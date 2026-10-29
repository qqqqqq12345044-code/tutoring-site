// PROVED AI CONTROL CENTER가 읽을 집계 contract. 값이 수집되지 않는 지표는 0이 아니라 "UNKNOWN".
import type { LeadEvent, LeadProject, NormalizedCallEvent, PhoneClickEvent } from "./types";

export const LEAD_DASHBOARD_CONTRACT_VERSION = 1;

export interface LeadDashboardRow {
  project: LeadProject;
  channel: LeadEvent["channel"] | "PHONE_CLICK";
  source: string;
  campaign: string;
  service: string;
  leadCount: number;
  phoneClickCount: number;
  /** CONFIRMED 연결 통화. */
  matchedCalls: number;
  /** LIKELY(추정) 연결 통화 — matched와 섞지 않는다. */
  likelyCalls: number;
  unmatchedCalls: number;
  answeredCalls: number;
  missedCalls: number;
  avgDurationSeconds: number | "UNKNOWN";
  /** 상담 상태가 수집되기 전에는 UNKNOWN. */
  conversion: number | "UNKNOWN";
}

export interface LeadDashboardPayload {
  contractVersion: number;
  generatedAt: string;
  /** 저장소가 인스턴스 메모리라 전체 이력이 아닐 수 있음을 표시. */
  storeKind: "memory" | "durable";
  rows: LeadDashboardRow[];
}

function serviceOf(context: LeadEvent["context"]): string {
  return context.language || context.subject || context.service || "";
}

export function aggregateLeadDashboard(
  data: { leads: LeadEvent[]; clicks: PhoneClickEvent[]; calls?: NormalizedCallEvent[] },
  { now = new Date(), storeKind = "memory" as const }: { now?: Date; storeKind?: "memory" | "durable" } = {},
): LeadDashboardPayload {
  const rows = new Map<string, LeadDashboardRow & { _durations: number[]; _statusKnown: boolean; _converted: number }>();
  const row = (project: LeadProject, channel: LeadDashboardRow["channel"], source: string, campaign: string, service: string) => {
    const key = [project, channel, source, campaign, service].join("|");
    let r = rows.get(key);
    if (!r) {
      r = {
        project, channel, source, campaign, service,
        leadCount: 0, phoneClickCount: 0, matchedCalls: 0, likelyCalls: 0, unmatchedCalls: 0,
        answeredCalls: 0, missedCalls: 0, avgDurationSeconds: "UNKNOWN", conversion: "UNKNOWN",
        _durations: [], _statusKnown: false, _converted: 0,
      };
      rows.set(key, r);
    }
    return r;
  };

  for (const lead of data.leads) {
    const a = lead.attribution;
    const r = row(lead.project, lead.channel, a.attributionSource, a.campaign, serviceOf(lead.context));
    r.leadCount += 1;
    if (lead.status !== "NEW" && lead.status !== "UNKNOWN") r._statusKnown = true;
    if (lead.status === "CONVERTED") r._converted += 1;
    const p = lead.phone;
    if (p) {
      if (p.attributionConfidence === "CONFIRMED") r.matchedCalls += 1;
      else if (p.attributionConfidence === "LIKELY") r.likelyCalls += 1;
      else r.unmatchedCalls += 1;
      if (p.answered === true) r.answeredCalls += 1;
      if (p.answered === false) r.missedCalls += 1;
      if (typeof p.durationSeconds === "number") r._durations.push(p.durationSeconds);
    }
  }
  for (const click of data.clicks) {
    const a = click.attribution;
    row(click.project, "PHONE_CLICK", a.attributionSource, a.campaign, serviceOf(click.context)).phoneClickCount += 1;
  }

  return {
    contractVersion: LEAD_DASHBOARD_CONTRACT_VERSION,
    generatedAt: now.toISOString(),
    storeKind,
    rows: [...rows.values()].map(({ _durations, _statusKnown, _converted, ...r }) => ({
      ...r,
      avgDurationSeconds: _durations.length ? Math.round(_durations.reduce((s, d) => s + d, 0) / _durations.length) : "UNKNOWN",
      conversion: _statusKnown ? _converted : "UNKNOWN",
    })),
  };
}
