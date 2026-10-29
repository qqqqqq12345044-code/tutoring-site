import { NextResponse } from "next/server";
import { handleCallWebhook } from "@/lib/leads/service";
import { callWebhookDepsFromEnv, readLimitedText } from "@/lib/leads/server";

// 기존 번호 연동 Call Provider webhook. CALL_PROVIDER_ENABLED + CALL_PROVIDER + 해당 provider secret이
// 모두 있어야 동작하고, 아니면 404. 서명 검증 실패 401, 중복 event는 200(duplicate)으로 흡수한다.
// 로그에는 실패 분류만 남긴다(발신번호/transcript 금지).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(request: Request) {
  const deps = callWebhookDepsFromEnv("GYOGWASEOLGYE");
  if (!deps.flags.callProvider || !deps.provider) return new NextResponse(null, { status: 404 });
  const rawBody = await readLimitedText(request, 65_536);
  if (rawBody === null) return NextResponse.json({ ok: false }, { status: 413 });
  try {
    const result = await handleCallWebhook({ headers: request.headers, rawBody }, deps);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    console.warn("[leads] call webhook failed: exception");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
