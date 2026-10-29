// Mock call provider — fake 통화/transcript/summary만 다룬다(실제 API 호출 없음).
// 로컬/테스트 전용: Vercel Production(VERCEL_ENV=production)에서는 resolveCallProvider가 선택하지 않는다.
//
// webhook 형식(가상):
//   headers: x-mock-timestamp: <unix sec>, x-mock-signature: sha256=<HMAC(secret, `${ts}.${rawBody}`)>
//   body: { eventId, callId, type: "call.completed"|"call.missed"|"call.started", startedAt, endedAt?,
//           durationSeconds?, answered?, recorded?, callerLast4?, clickEventId?, transcript?, summary? }
import type { CallSummary, CallTranscript, LeadProject, NormalizedCallEvent, CallStatus } from "../types";
import type { CallProvider, WebhookRequest } from "../callProvider";
import { verifyHmacSignature } from "../callProvider";
import { cleanId, cleanIsoDate, cleanText, maskPhoneNumber } from "../sanitize";

const STATUS_BY_TYPE: Record<string, CallStatus> = {
  "call.started": "RINGING",
  "call.answered": "ANSWERED",
  "call.completed": "COMPLETED",
  "call.missed": "MISSED",
};

export function createMockCallProvider(secret: string | undefined): CallProvider {
  // fake transcript/summary 보관(메모리). 실제 고객 데이터가 들어올 일이 없는 전용 provider다.
  const fixtures = new Map<string, { transcript?: string; summary?: string[] }>();

  return {
    name: "mock",
    supportsExistingNumber() {
      return { supported: true, method: "CALL_FORWARDING", portingRequired: false, notes: "테스트용 가상 provider" };
    },
    async verifyWebhook(req: WebhookRequest) {
      return verifyHmacSignature({
        rawBody: req.rawBody,
        timestamp: req.headers.get("x-mock-timestamp"),
        signature: req.headers.get("x-mock-signature"),
        secret,
        receivedAt: req.receivedAt,
      });
    },
    normalizeCallEvent(body, project: LeadProject): NormalizedCallEvent | null {
      const providerEventId = cleanId(body.eventId);
      const providerCallId = cleanId(body.callId);
      const status = STATUS_BY_TYPE[cleanText(body.type, 40)];
      const callStartedAt = cleanIsoDate(body.startedAt);
      if (!providerEventId || !providerCallId || !status || !callStartedAt) return null;

      if (typeof body.transcript === "string" || Array.isArray(body.summary)) {
        fixtures.set(providerCallId, {
          transcript: typeof body.transcript === "string" ? body.transcript.slice(0, 20_000) : undefined,
          summary: Array.isArray(body.summary) ? body.summary.map((s) => cleanText(s, 120)).filter(Boolean) : undefined,
        });
      }
      const duration = Number(body.durationSeconds);
      return {
        provider: "mock",
        providerEventId,
        providerCallId,
        project,
        status,
        callStartedAt,
        callCompletedAt: cleanIsoDate(body.endedAt) || undefined,
        durationSeconds: Number.isFinite(duration) && duration >= 0 ? Math.round(duration) : undefined,
        answered: typeof body.answered === "boolean" ? body.answered : status === "COMPLETED" ? true : status === "MISSED" ? false : undefined,
        recorded: body.recorded === true,
        clickEventId: cleanId(body.clickEventId) || undefined,
        callerMasked: maskPhoneNumber(body.callerLast4),
      };
    },
    async getCall() {
      return null;
    },
    async getTranscript(providerCallId): Promise<CallTranscript> {
      const text = fixtures.get(providerCallId)?.transcript;
      return text ? { status: "READY", text } : { status: "UNAVAILABLE" };
    },
    async getSummary(providerCallId): Promise<CallSummary> {
      const bullets = fixtures.get(providerCallId)?.summary;
      return bullets && bullets.length > 0 ? { status: "READY", bullets } : { status: "UNAVAILABLE", bullets: [] };
    },
  };
}
