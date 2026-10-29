import { NextResponse } from "next/server";
import { aggregateLeadDashboard } from "@/lib/leads/dashboard";
import { isDashboardAuthorized } from "@/lib/leads/server";
import { getDefaultLeadStore } from "@/lib/leads/store";

// PROVED AI CONTROL CENTER용 집계(contract: lib/leads/dashboard.ts). LEAD_DASHBOARD_TOKEN(24자 이상)이
// 없거나 Bearer가 다르면 404 — 존재 자체를 드러내지 않는다. 개별 lead/PII는 내보내지 않고 집계만.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDashboardAuthorized(request)) return new NextResponse(null, { status: 404 });
  const payload = aggregateLeadDashboard(await getDefaultLeadStore().snapshot(), { storeKind: "memory" });
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
