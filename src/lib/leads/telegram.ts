// Telegram 알림 adapter(server-side only). token/chat id는 env에서만 읽고 코드/로그에 남기지 않는다.
// 메시지에는 이름·연락처·주소·상담 내용·transcript 원문을 넣지 않는다(유입/맥락/상태 요약만).
import type { CallSummary, LeadEvent, LeadProject, PhoneClickEvent } from "./types";
import { pathOnly } from "./sanitize";

export interface NotifyResult {
  ok: boolean;
  /** 실패 분류만(본문/토큰 없음). */
  reason?: "disabled" | "http" | "network" | "timeout";
}

export interface LeadNotifier {
  send(text: string): Promise<NotifyResult>;
}

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{ ok: boolean; status: number }>;

export interface TelegramOptions {
  token: string;
  chatId: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}

const MAX_MESSAGE = 3_500; // Telegram 한도(4096)보다 여유 있게

export function createTelegramNotifier({ token, chatId, fetchImpl, timeoutMs = 4_000 }: TelegramOptions): LeadNotifier {
  const doFetch: FetchLike = fetchImpl ?? ((url, init) => fetch(url, init));
  return {
    async send(text) {
      try {
        const res = await doFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // parse_mode 없이 plain text — 사용자 유입 값이 마크업으로 해석되지 않게 한다.
          body: JSON.stringify({ chat_id: chatId, text: text.slice(0, MAX_MESSAGE), disable_web_page_preview: true }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        return res.ok ? { ok: true } : { ok: false, reason: "http" };
      } catch (err) {
        const name = err instanceof Error ? err.name : "";
        return { ok: false, reason: name === "TimeoutError" || name === "AbortError" ? "timeout" : "network" };
      }
    },
  };
}

/** flag OFF 또는 env 누락이면 null(= 알림 비활성). */
export function telegramNotifierFromEnv(
  enabled: boolean,
  env: Record<string, string | undefined> = process.env,
): LeadNotifier | null {
  const token = env.TELEGRAM_LEAD_BOT_TOKEN;
  const chatId = env.TELEGRAM_LEAD_CHAT_ID;
  if (!enabled || !token || !chatId) return null;
  return createTelegramNotifier({ token, chatId });
}

/** 테스트용: 보낸 메시지를 메모리에만 쌓는다. */
export function createMemoryNotifier(): LeadNotifier & { sent: string[] } {
  const sent: string[] = [];
  return {
    sent,
    async send(text) {
      sent.push(text);
      return { ok: true };
    },
  };
}

// ---------------------------------------------------------------- formatting

const PROJECT_LABEL: Record<LeadProject, string> = { DORAN: "DORAN", GYOGWASEOLGYE: "교과설계소" };

const CONFIDENCE_LABEL = {
  CONFIRMED: "CONFIRMED (확정)",
  LIKELY: "LIKELY (추정 · 클릭 시각 근접)",
  UNKNOWN: "UNKNOWN (웹 유입 연결 안 됨)",
} as const;

export function formatKst(iso: string | undefined): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function contextLine(lead: Pick<LeadEvent, "context">): string[] {
  const c = lead.context;
  const lines: string[] = [];
  if (c.language) lines.push(`언어: ${c.language}`);
  if (c.service) lines.push(`서비스: ${c.service}`);
  if (c.subject) lines.push(`과목: ${c.subject}`);
  if (c.currentLevel) lines.push(`수준/학년: ${c.currentLevel}`);
  if (c.studyGoal) lines.push(`목적: ${c.studyGoal}`);
  return lines;
}

function sourceLines(a: LeadEvent["attribution"]): string[] {
  const lines = [`유입: ${a.attributionSource}`];
  if (a.campaign) lines.push(`캠페인: ${a.campaign}`);
  if (a.source || a.medium) lines.push(`UTM: ${a.source || "-"} / ${a.medium || "-"}`);
  const landing = pathOnly(a.firstTouch?.landingPage || a.landingPage);
  if (landing) lines.push(`랜딩: ${landing}`);
  return lines;
}

export function formatWebLeadMessage(lead: LeadEvent): string {
  return [
    `[${PROJECT_LABEL[lead.project]} · 신규 상담]`,
    "",
    "채널: 웹 상담",
    ...sourceLines(lead.attribution),
    ...contextLine(lead),
    `접수: ${formatKst(lead.createdAt)}`,
    `ID: ${lead.leadId.slice(0, 8)}`,
  ].join("\n");
}

export function formatPhoneClickMessage(click: PhoneClickEvent): string {
  return [
    `[${PROJECT_LABEL[click.project]} · 전화 버튼 클릭]`,
    "",
    "※ 클릭만 감지(실제 통화 여부 미확인)",
    ...sourceLines(click.attribution),
    ...contextLine(click),
    `페이지: ${click.currentPage || "-"}`,
    `시각: ${formatKst(click.clickedAt)}`,
  ].join("\n");
}

export function formatCallCompletedMessage(lead: LeadEvent, summary: CallSummary): string {
  const phone = lead.phone;
  const lines = [
    `[${PROJECT_LABEL[lead.project]} · 전화 상담 완료]`,
    "",
    ...(phone?.attributionConfidence === "UNKNOWN" ? ["유입: UNKNOWN"] : sourceLines(lead.attribution)),
    ...contextLine(lead),
    `Attribution: ${CONFIDENCE_LABEL[phone?.attributionConfidence ?? "UNKNOWN"]}`,
    `통화: ${formatDuration(phone?.durationSeconds)}`,
    `시각: ${formatKst(phone?.callStartedAt)}`,
  ];
  if (summary.status === "READY" && summary.bullets.length > 0) {
    lines.push("", "AI 요약:", ...summary.bullets.slice(0, 5).map((b) => `- ${b.slice(0, 120)}`));
  } else {
    lines.push(`AI 요약: ${summary.status === "DISABLED" ? "OFF" : summary.status}`);
  }
  lines.push("", `다음: ${summary.nextAction || "담당자 확인"}`);
  return lines.join("\n");
}

export function formatMissedCallMessage(lead: LeadEvent, callerMasked?: string): string {
  const phone = lead.phone;
  return [
    `[${PROJECT_LABEL[lead.project]} · 부재중 전화]`,
    "",
    ...(phone?.attributionConfidence === "UNKNOWN" ? ["유입: UNKNOWN"] : sourceLines(lead.attribution)),
    `Attribution: ${CONFIDENCE_LABEL[phone?.attributionConfidence ?? "UNKNOWN"]}`,
    `시각: ${formatKst(phone?.callStartedAt)}`,
    ...(callerMasked ? [`발신: ${callerMasked}`] : []),
    "",
    "콜백 필요",
  ].join("\n");
}
