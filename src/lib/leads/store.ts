// Lead/클릭/통화 이벤트 저장소 seam.
// 기본 구현은 in-memory다 — serverless에서는 인스턴스마다 따로라서 "클릭은 A 인스턴스, 통화 webhook은
// B 인스턴스"면 매칭이 안 된다. Phase B~D 운영 전에는 durable store(KV/DB/Sheet)를 이 interface로 붙여야 한다.
// 저장 대상은 비식별 이벤트뿐이다(이름/연락처/상담 내용 없음).
import type { LeadEvent, LeadProject, NormalizedCallEvent, PhoneClickEvent } from "./types";

export interface LeadEventStore {
  savePhoneClick(click: PhoneClickEvent): Promise<void>;
  recentPhoneClicks(project: LeadProject, sinceIso: string): Promise<PhoneClickEvent[]>;
  /** 처음 보는 provider event면 true(저장), 이미 처리했으면 false(중복). */
  claimWebhookEvent(provider: string, providerEventId: string): Promise<boolean>;
  saveCall(call: NormalizedCallEvent): Promise<void>;
  saveLead(lead: LeadEvent): Promise<void>;
  /** 이미 다른 통화에 연결된 click id. */
  usedClickIds(project: LeadProject): Promise<Set<string>>;
  snapshot(): Promise<{ leads: LeadEvent[]; clicks: PhoneClickEvent[]; calls: NormalizedCallEvent[] }>;
}

const MAX_ITEMS = 2_000;

function push<T>(list: T[], item: T) {
  list.push(item);
  if (list.length > MAX_ITEMS) list.shift();
}

export function createMemoryLeadStore(): LeadEventStore {
  const clicks: PhoneClickEvent[] = [];
  const calls: NormalizedCallEvent[] = [];
  const leads: LeadEvent[] = [];
  const seenEvents = new Set<string>();

  return {
    async savePhoneClick(click) {
      if (clicks.some((c) => c.clickEventId === click.clickEventId)) return;
      push(clicks, click);
    },
    async recentPhoneClicks(project, sinceIso) {
      const since = Date.parse(sinceIso);
      return clicks.filter((c) => c.project === project && Date.parse(c.clickedAt) >= since);
    },
    async claimWebhookEvent(provider, providerEventId) {
      const key = `${provider}:${providerEventId}`;
      if (seenEvents.has(key)) return false;
      seenEvents.add(key);
      if (seenEvents.size > MAX_ITEMS * 2) seenEvents.delete(seenEvents.values().next().value as string);
      return true;
    },
    async saveCall(call) {
      push(calls, call);
    },
    async saveLead(lead) {
      push(leads, lead);
    },
    async usedClickIds(project) {
      return new Set(
        leads.filter((l) => l.project === project && l.phone?.clickEventId).map((l) => l.phone!.clickEventId as string),
      );
    },
    async snapshot() {
      return { leads: [...leads], clicks: [...clicks], calls: [...calls] };
    },
  };
}

// 프로세스(인스턴스) 단위 기본 store. route 간 공유.
const globalForLeads = globalThis as unknown as { __leadStore?: LeadEventStore };
export function getDefaultLeadStore(): LeadEventStore {
  globalForLeads.__leadStore ??= createMemoryLeadStore();
  return globalForLeads.__leadStore;
}

/** 아주 단순한 IP별 rate limiter(인스턴스 메모리). 남용 억제용 speed bump. */
export function createRateLimiter(maxPerWindow = 30, windowMs = 60_000) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5_000) hits.delete(hits.keys().next().value as string);
    return recent.length <= maxPerWindow;
  };
}
