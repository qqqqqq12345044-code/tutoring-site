// route handler 공통: env → 의존성 조립. server 전용(token/secret을 읽는다).
import { timingSafeEqual } from "node:crypto";
import type { LeadProject } from "./types";
import { readLeadFlags } from "./flags";
import { getDefaultLeadStore } from "./store";
import { telegramNotifierFromEnv } from "./telegram";
import { resolveCallProvider } from "./providers/index";
import type { CallWebhookDeps, LeadDeps } from "./service";

// 실패 분류만 남긴다(본문/PII/토큰 금지).
const log = (message: string) => console.warn(message);

export function leadDepsFromEnv(project: LeadProject): LeadDeps {
  const flags = readLeadFlags();
  return { project, flags, store: getDefaultLeadStore(), notifier: telegramNotifierFromEnv(flags.telegram), log };
}

export function callWebhookDepsFromEnv(project: LeadProject): CallWebhookDeps {
  const base = leadDepsFromEnv(project);
  // 별도 요약 adapter(외부 AI)는 아직 없다 — provider summary만 사용.
  return { ...base, provider: base.flags.callProvider ? resolveCallProvider() : null, summaryAdapter: null };
}

/** 본문을 크기 제한 안에서 text로 읽는다. 초과/실패면 null. */
export async function readLimitedText(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) return null;
  try {
    const text = await request.text();
    return text.length > maxBytes ? null : text;
  } catch {
    return null;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Authorization: Bearer <LEAD_DASHBOARD_TOKEN>. token env가 없으면 항상 false(= 비활성). */
export function isDashboardAuthorized(request: Request, token = process.env.LEAD_DASHBOARD_TOKEN): boolean {
  if (!token || token.length < 24) return false;
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
