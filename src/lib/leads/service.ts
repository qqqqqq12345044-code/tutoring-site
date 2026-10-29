// route handler가 호출하는 orchestration. Next.js에 의존하지 않고 store/notifier/provider/flags/now를
// 주입받아서, 같은 로직을 scripts/validate-leads.mts에서 fake 데이터로 그대로 검증한다.
// 어떤 경로도 예외를 사용자 요청(상담 제출/전화 실행)으로 전파하지 않는다.
import { randomUUID } from "node:crypto";
import {
  LEAD_EVENT_VERSION,
  type LeadContext,
  type LeadEvent,
  type LeadProject,
  type NormalizedCallEvent,
  type PhoneClickEvent,
} from "./types";
import { cleanAttribution, cleanContext, cleanId, cleanIsoDate, cleanPath, emptyAttribution, parseJsonBody } from "./sanitize";
import type { LeadFlags } from "./flags";
import type { LeadEventStore } from "./store";
import type { LeadNotifier } from "./telegram";
import { formatCallCompletedMessage, formatMissedCallMessage, formatPhoneClickMessage, formatWebLeadMessage } from "./telegram";
import type { CallProvider } from "./callProvider";
import { DEFAULT_MATCH_WINDOW_MS, matchCallToClick } from "./callMatching";
import { resolveCallSummary, type CallSummaryAdapter } from "./summary";

export interface LeadDeps {
  project: LeadProject;
  flags: LeadFlags;
  store: LeadEventStore;
  notifier: LeadNotifier | null;
  now?: () => Date;
  newId?: () => string;
  /** 실패 분류만 남기는 logger(본문 금지). */
  log?: (message: string) => void;
}

export interface ServiceResult {
  status: number;
  body: Record<string, unknown>;
}

const nowOf = (deps: LeadDeps) => (deps.now ? deps.now() : new Date());
const idOf = (deps: LeadDeps) => (deps.newId ? deps.newId() : randomUUID());

async function safeNotify(deps: LeadDeps, text: string, tag: string) {
  if (!deps.notifier) return;
  try {
    const result = await deps.notifier.send(text);
    if (!result.ok) deps.log?.(`[leads] telegram ${tag} failed: ${result.reason ?? "unknown"}`);
  } catch {
    deps.log?.(`[leads] telegram ${tag} failed: exception`);
  }
}

// ------------------------------------------------------------------ web lead

export function buildWebLeadEvent(
  input: { attribution: unknown; context: unknown; leadId?: string },
  deps: Pick<LeadDeps, "project" | "now" | "newId">,
): LeadEvent {
  return {
    version: LEAD_EVENT_VERSION,
    leadId: cleanId(input.leadId) || (deps.newId ? deps.newId() : randomUUID()),
    project: deps.project,
    createdAt: (deps.now ? deps.now() : new Date()).toISOString(),
    channel: "WEB_FORM",
    attribution: input.attribution ? cleanAttribution(input.attribution) : emptyAttribution(),
    context: cleanContext(input.context),
    status: "NEW",
  };
}

/**
 * 웹 상담 저장이 성공한 뒤 호출한다(저장 흐름과 분리). LeadEvent를 저장하고 Telegram을 보낸다.
 * LEAD_EVENTS_ENABLED가 OFF면 아무것도 하지 않는다(Telegram은 LEAD_TELEGRAM_ENABLED로 별도 제어).
 */
export async function recordWebLead(
  input: { attribution: unknown; context: unknown; leadId?: string },
  deps: LeadDeps,
): Promise<LeadEvent | null> {
  if (!deps.flags.leadEvents) return null;
  const lead = buildWebLeadEvent(input, deps);
  try {
    await deps.store.saveLead(lead);
  } catch {
    deps.log?.("[leads] store saveLead failed");
  }
  await safeNotify(deps, formatWebLeadMessage(lead), "web");
  return lead;
}

/** DORAN용: 브라우저 beacon(/api/leads/web) 본문 처리. 상담 원문은 받지 않는다. */
export async function handleWebLeadBeacon(rawBody: string, deps: LeadDeps): Promise<ServiceResult> {
  if (!deps.flags.leadEvents) return { status: 404, body: { ok: false } };
  const body = parseJsonBody(rawBody);
  if (!body || body.project !== deps.project) return { status: 400, body: { ok: false } };
  const lead = await recordWebLead({ attribution: body.attribution, context: body.context, leadId: cleanId(body.leadId) }, deps);
  return { status: 202, body: { ok: true, leadId: lead?.leadId ?? null } };
}

// ---------------------------------------------------------------- phone click

export function parsePhoneClick(body: Record<string, unknown>, deps: Pick<LeadDeps, "project" | "now">): PhoneClickEvent | null {
  if (body.project !== deps.project) return null;
  const clickEventId = cleanId(body.clickEventId);
  if (!clickEventId) return null;
  const now = deps.now ? deps.now() : new Date();
  // 클라이언트 시각은 참고만: 서버 시각과 10분 이상 다르면 서버 시각을 쓴다(매칭 window 보호).
  const clientAt = cleanIsoDate(body.clickedAt);
  const clickedAt =
    clientAt && Math.abs(Date.parse(clientAt) - now.getTime()) < 10 * 60_000 ? clientAt : now.toISOString();
  return {
    version: LEAD_EVENT_VERSION,
    clickEventId,
    project: deps.project,
    clickedAt,
    currentPage: cleanPath(body.currentPage),
    displayedNumberId: cleanId(body.displayedNumberId, 32) || "main",
    ctaLocation: cleanId(body.ctaLocation, 32) || "content",
    sessionId: cleanId(body.sessionId),
    attribution: cleanAttribution(body.attribution),
    context: cleanContext(body.context) as LeadContext,
  };
}

export async function handlePhoneClick(rawBody: string, deps: LeadDeps): Promise<ServiceResult> {
  if (!deps.flags.phoneClickTracking) return { status: 404, body: { ok: false } };
  const body = parseJsonBody(rawBody, 6_144);
  const click = body ? parsePhoneClick(body, deps) : null;
  if (!click) return { status: 400, body: { ok: false } };
  try {
    await deps.store.savePhoneClick(click);
  } catch {
    deps.log?.("[leads] store savePhoneClick failed");
  }
  if (deps.flags.phoneClickTelegram) await safeNotify(deps, formatPhoneClickMessage(click), "phone-click");
  return { status: 202, body: { ok: true } };
}

// ---------------------------------------------------------------- call webhook

export interface CallWebhookDeps extends LeadDeps {
  provider: CallProvider | null;
  summaryAdapter?: CallSummaryAdapter | null;
  matchWindowMs?: number;
}

function parseWebhookBody(rawBody: string): Record<string, unknown> | null {
  const json = parseJsonBody(rawBody, 65_536);
  if (json) return json;
  if (!rawBody || rawBody.length > 65_536) return null;
  // application/x-www-form-urlencoded(Twilio 등)
  const params = new URLSearchParams(rawBody);
  const out: Record<string, unknown> = {};
  for (const [k, v] of params) out[k] = v;
  return Object.keys(out).length ? out : null;
}

export async function handleCallWebhook(
  req: { headers: { get(name: string): string | null }; rawBody: string },
  deps: CallWebhookDeps,
): Promise<ServiceResult & { lead?: LeadEvent }> {
  if (!deps.flags.callProvider || !deps.provider) return { status: 404, body: { ok: false } };
  const provider = deps.provider;
  const now = nowOf(deps);

  if (!(await provider.verifyWebhook({ headers: req.headers, rawBody: req.rawBody, receivedAt: now.getTime() }))) {
    deps.log?.(`[leads] webhook signature invalid (${provider.name})`);
    return { status: 401, body: { ok: false } };
  }
  const body = parseWebhookBody(req.rawBody);
  const call: NormalizedCallEvent | null = body
    ? provider.normalizeCallEvent({ ...body, receivedAt: now.toISOString() }, deps.project)
    : null;
  if (!call) return { status: 400, body: { ok: false } };

  if (!(await deps.store.claimWebhookEvent(provider.name, call.providerEventId))) {
    return { status: 200, body: { ok: true, duplicate: true } };
  }
  await deps.store.saveCall(call);

  // 시작/응답 중 이벤트는 저장만 하고, 종료(완료/부재중) 이벤트에서만 lead + 알림을 만든다.
  if (call.status !== "COMPLETED" && call.status !== "MISSED") {
    return { status: 200, body: { ok: true, stored: true } };
  }

  const windowMs = deps.matchWindowMs ?? DEFAULT_MATCH_WINDOW_MS;
  const since = new Date(Date.parse(call.callStartedAt) - windowMs - 60_000).toISOString();
  const [clicks, used] = await Promise.all([
    deps.store.recentPhoneClicks(deps.project, since),
    deps.store.usedClickIds(deps.project),
  ]);
  const match = matchCallToClick(call, clicks, { windowMs, usedClickIds: used });

  const outcome =
    call.status === "COMPLETED"
      ? await resolveCallSummary(provider, call.providerCallId, { flags: deps.flags, adapter: deps.summaryAdapter })
      : { transcript: { status: "UNAVAILABLE" as const }, summary: { status: "UNAVAILABLE" as const, bullets: [] } };

  const click = match.click;
  const lead: LeadEvent = {
    version: LEAD_EVENT_VERSION,
    leadId: idOf(deps),
    project: deps.project,
    createdAt: now.toISOString(),
    channel: "PHONE",
    // 연결 못 한 통화는 attribution을 비워 둔다(추정값을 만들어 넣지 않음).
    attribution: click ? click.attribution : emptyAttribution(),
    context: click ? click.context : {},
    phone: {
      displayedNumberId: click?.displayedNumberId ?? "main",
      clickEventId: click?.clickEventId,
      clickedAt: click?.clickedAt,
      clickedPage: click?.currentPage,
      clickAttribution: click?.attribution,
      provider: provider.name,
      providerCallId: call.providerCallId,
      callStartedAt: call.callStartedAt,
      callCompletedAt: call.callCompletedAt,
      durationSeconds: call.durationSeconds,
      answered: call.answered,
      recorded: deps.flags.callRecording ? call.recorded : false,
      matchStatus: match.status,
      attributionConfidence: match.confidence,
      transcriptStatus: outcome.transcript.status,
      summaryStatus: outcome.summary.status,
    },
    status: "NEW",
  };
  await deps.store.saveLead(lead);

  const text =
    call.status === "MISSED" ? formatMissedCallMessage(lead, call.callerMasked) : formatCallCompletedMessage(lead, outcome.summary);
  await safeNotify(deps, text, "call");

  return {
    status: 200,
    body: { ok: true, leadId: lead.leadId, match: match.status, confidence: match.confidence, ambiguous: match.ambiguous },
    lead,
  };
}

