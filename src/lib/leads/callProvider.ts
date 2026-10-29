// 통화 provider 중립 interface. 특정 업체에 묶이지 않도록 route/service는 이 interface만 본다.
// 전제: 새 번호 구매/번호 이전 없이 "기존 번호"에 연동되는 provider만 붙인다
// (supportsExistingNumber()로 연동 방식을 명시하게 한다).
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CallSummary, CallTranscript, LeadProject, NormalizedCallEvent } from "./types";

export interface WebhookRequest {
  headers: { get(name: string): string | null };
  /** 서명 검증용 원문 body(파싱 전). */
  rawBody: string;
  /** 수신 시각(ms). replay 방지 tolerance 계산용. */
  receivedAt: number;
}

export type ExistingNumberMethod =
  | "CARRIER_NATIVE" // 같은 회선의 통신사/단말 기능
  | "CALL_FORWARDING" // 기존 번호 → provider 착신 전환
  | "SIP_TRUNK"
  | "NONE"
  | "UNKNOWN";

export interface ExistingNumberSupport {
  supported: boolean | "UNKNOWN";
  method: ExistingNumberMethod;
  /** 번호 이전(porting)이 필요한지. true면 이번 프로젝트 후보에서 제외. */
  portingRequired: boolean | "UNKNOWN";
  notes: string;
}

export interface CallProvider {
  readonly name: string;
  supportsExistingNumber(): ExistingNumberSupport;
  verifyWebhook(req: WebhookRequest): Promise<boolean>;
  /** provider payload → 정규화 이벤트. 모르는 형식이면 null. */
  normalizeCallEvent(body: Record<string, unknown>, project: LeadProject): NormalizedCallEvent | null;
  getCall(providerCallId: string): Promise<NormalizedCallEvent | null>;
  getTranscript(providerCallId: string): Promise<CallTranscript>;
  getSummary(providerCallId: string): Promise<CallSummary>;
}

/**
 * HMAC-SHA256(secret, `${timestamp}.${rawBody}`) 서명 검증 + timestamp tolerance(replay 방지).
 * signature는 hex(선택적으로 "sha256=" 접두). 비교는 timingSafeEqual.
 */
export function verifyHmacSignature({
  rawBody,
  timestamp,
  signature,
  secret,
  receivedAt,
  toleranceSeconds = 300,
}: {
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
  secret: string | undefined;
  receivedAt: number;
  toleranceSeconds?: number;
}): boolean {
  if (!secret || !timestamp || !signature) return false;
  if (!/^\d{9,11}$/.test(timestamp)) return false;
  if (Math.abs(receivedAt / 1000 - Number(timestamp)) > toleranceSeconds) return false;
  const given = signature.replace(/^sha256=/, "");
  if (!/^[0-9a-f]{64}$/i.test(given)) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return timingSafeEqual(Buffer.from(given.toLowerCase(), "hex"), Buffer.from(expected, "hex"));
}

export function signHmac(secret: string, timestamp: string, rawBody: string): string {
  return `sha256=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")}`;
}

/** provider 호출 timeout. 시간 초과 시 fallback 값을 돌려준다(예외를 밖으로 던지지 않음). */
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise.catch(() => fallback),
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
