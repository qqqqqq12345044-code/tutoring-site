// Twilio Voice scaffold (실제 API 호출/credential 없음).
// 연동 방식(공식 문서 기준, 2026-10-27 조사): 기존 010 번호 → 통신사 착신전환 부가서비스 → Twilio KR 번호.
//   - 고객에게 보이는 번호는 기존 번호 그대로지만, 착신 대상인 Twilio 번호가 내부적으로 필요하다
//     (KR 번호는 사업자 등록 필요). 이 번호 발급은 사용자 승인 전 금지 — docs/LEAD_CALL_TRACKING.md 참고.
//   - Webhook 서명: X-Twilio-Signature = base64(HMAC-SHA1(authToken, url + 정렬된 POST 파라미터 key+value)).
//   - status callback 파라미터: CallSid, CallStatus(queued|ringing|in-progress|completed|busy|failed|no-answer|canceled),
//     CallDuration, Timestamp, From ...
// getCall/getTranscript/getSummary는 REST 연동 전이라 UNAVAILABLE을 돌려준다.
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CallStatus, LeadProject, NormalizedCallEvent } from "../types";
import type { CallProvider, WebhookRequest } from "../callProvider";
import { cleanId, cleanIsoDate, cleanText, maskPhoneNumber } from "../sanitize";

const STATUS: Record<string, CallStatus> = {
  queued: "RINGING",
  ringing: "RINGING",
  "in-progress": "ANSWERED",
  completed: "COMPLETED",
  busy: "MISSED",
  "no-answer": "MISSED",
  failed: "MISSED",
  canceled: "MISSED",
};

/** Twilio 서명 계산(문서의 알고리즘). 테스트에서도 사용. */
export function twilioSignature(authToken: string, url: string, params: URLSearchParams): string {
  const keys = [...new Set(params.keys())].sort();
  const data = keys.reduce((acc, key) => acc + key + params.getAll(key).join(""), url);
  return createHmac("sha1", authToken).update(data, "utf8").digest("base64");
}

export function createTwilioCallProvider({ authToken, webhookUrl }: { authToken?: string; webhookUrl?: string }): CallProvider {
  return {
    name: "twilio",
    supportsExistingNumber() {
      return {
        supported: true,
        method: "CALL_FORWARDING",
        portingRequired: false,
        notes: "기존 번호 → 착신전환 → Twilio KR 번호(내부용, 사업자 필요). 한국어 STT/요약 품질 미검증.",
      };
    },
    async verifyWebhook(req: WebhookRequest) {
      const given = req.headers.get("x-twilio-signature");
      if (!authToken || !webhookUrl || !given) return false;
      const expected = twilioSignature(authToken, webhookUrl, new URLSearchParams(req.rawBody));
      const a = Buffer.from(given);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    },
    normalizeCallEvent(body, project: LeadProject): NormalizedCallEvent | null {
      const callSid = cleanId(body.CallSid);
      const status = STATUS[cleanText(body.CallStatus, 20)];
      if (!callSid || !status) return null;
      // Twilio Timestamp는 RFC 2822 형식. 없으면 수신 시각을 쓰도록 route가 넘긴 값 사용.
      const startedAt = cleanIsoDate(body.Timestamp) || cleanIsoDate(body.receivedAt);
      if (!startedAt) return null;
      const duration = Number(body.CallDuration);
      return {
        provider: "twilio",
        // 같은 CallSid에 상태별 callback이 여러 번 오므로 상태까지 묶어 중복 키로 쓴다.
        providerEventId: `${callSid}-${cleanText(body.CallStatus, 20)}`,
        providerCallId: callSid,
        project,
        status,
        callStartedAt: startedAt,
        durationSeconds: Number.isFinite(duration) && duration >= 0 ? duration : undefined,
        answered: status === "COMPLETED" ? true : status === "MISSED" ? false : undefined,
        recorded: false,
        callerMasked: maskPhoneNumber(body.From),
      };
    },
    async getCall() {
      return null;
    },
    async getTranscript() {
      return { status: "UNAVAILABLE" };
    },
    async getSummary() {
      return { status: "UNAVAILABLE", bullets: [] };
    },
  };
}
