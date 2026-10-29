// 교과설계소 유입 수집(UTM/referrer/landingPage/NaPm 존재 여부). DORAN lib/attribution.ts와 같은 규칙:
// - 세션 첫 방문 값을 sessionStorage에 보존(first-touch), 명시적 UTM(utm_source)이 다른 새 광고 유입이면 갱신.
// - UTM 없는 진입/내부 이동은 저장값을 바꾸지 않는다.
// - NaPm은 존재 여부만 기록하고, NaPm만으로 광고로 단정하지 않는다(classifyAttribution).
// - 모든 값은 신뢰할 수 없는 입력이므로 길이 제한 + 제어문자 제거.
// NEXT_PUBLIC_LEAD_EVENTS_ENABLED / NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED가 없으면 호출되지 않는다(LeadTracking).
import type { AttributionSource } from "./types";
import type { RawAttribution } from "./clientCore";

const STORAGE_KEY = "gg_attribution";
const MAX_LEN = 200;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

const EMPTY: RawAttribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  referrer: "",
  landingPage: "",
  hasNaPm: "",
};

function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_LEN);
}

function readStored(): RawAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RawAttribution>;
    const result = { ...EMPTY };
    for (const key of Object.keys(EMPTY) as (keyof RawAttribution)[]) {
      result[key] = clean(typeof parsed[key] === "string" ? parsed[key] : "");
    }
    return result;
  } catch {
    return null;
  }
}

function napmFlag(params: URLSearchParams): string {
  for (const key of params.keys()) {
    if (key.toLowerCase() === "napm") return "1";
  }
  return "";
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const stored = readStored();
  if (stored && clean(params.get("utm_source")) === "") return;

  const current: RawAttribution = {
    ...EMPTY,
    referrer: clean(document.referrer),
    landingPage: clean(window.location.pathname + window.location.search),
    hasNaPm: napmFlag(params),
  };
  for (const key of UTM_KEYS) current[key] = clean(params.get(key));
  if (stored && UTM_KEYS.every((key) => stored[key] === current[key])) return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // 저장소가 막힌 환경에서는 건너뛴다.
  }
}

/** 현재 URL에 UTM이 있으면 그 값을 우선, 없으면 세션 저장값. 저장소를 못 쓰면 현재 URL/referrer만. */
export function getAttribution(): RawAttribution {
  if (typeof window === "undefined") return { ...EMPTY };
  const params = new URLSearchParams(window.location.search);
  const stored = readStored() ?? { ...EMPTY, referrer: clean(document.referrer), hasNaPm: napmFlag(params) };
  const result = { ...stored };
  for (const key of UTM_KEYS) {
    const live = clean(params.get(key));
    if (live) result[key] = live;
  }
  return result;
}

const NAVER_SEARCH_HOST = /(^|\.)search\.naver\.com$/;
const OWN_HOST = /(^|\.)gyogwaseolgye\.com$/;

export function classifyAttribution(a: RawAttribution): AttributionSource {
  if (a.utm_source.toLowerCase() === "naver" && a.utm_medium.toLowerCase() === "cpc") return "UTM_NAVER_CPC";
  if (a.referrer) {
    let host: string;
    try {
      host = new URL(a.referrer).hostname.toLowerCase();
    } catch {
      return "UNKNOWN";
    }
    if (NAVER_SEARCH_HOST.test(host)) return a.hasNaPm ? "NAVER_SEARCH_WITH_NAPM" : "NAVER_SEARCH";
    if (OWN_HOST.test(host)) return "UNKNOWN";
    return "OTHER_REFERRER";
  }
  if (a.hasNaPm) return "UNKNOWN";
  return a.utm_source ? "OTHER_REFERRER" : "DIRECT";
}
