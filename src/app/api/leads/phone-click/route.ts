import { NextResponse, after } from "next/server";
import { handlePhoneClick } from "@/lib/leads/service";
import { clientIp, leadDepsFromEnv, readLimitedText } from "@/lib/leads/server";
import { createRateLimiter } from "@/lib/leads/store";

// 전화 CTA 클릭 시점의 attribution snapshot(sendBeacon). 전화번호 값은 받지 않는다.
// PHONE_CLICK_TRACKING_ENABLED가 아니면 404.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allow = createRateLimiter(30, 60_000);

export async function POST(request: Request) {
  const deps = leadDepsFromEnv("GYOGWASEOLGYE");
  if (!deps.flags.phoneClickTracking) return new NextResponse(null, { status: 404 });
  if (!allow(clientIp(request))) return new NextResponse(null, { status: 429 });
  const raw = await readLimitedText(request, 6_144);
  if (raw === null) return new NextResponse(null, { status: 413 });
  after(async () => {
    await handlePhoneClick(raw, deps);
  });
  return new NextResponse(null, { status: 204 });
}
