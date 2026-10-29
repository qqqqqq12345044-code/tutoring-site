// 신뢰할 수 없는 입력(브라우저 beacon / provider webhook)을 schema 값으로 정리하는 순수 함수 모음.
import type {
  AttributionSource,
  LeadAttribution,
  LeadContext,
  TouchSnapshot,
} from "./types";

const MAX_LEN = 200;

export const ATTRIBUTION_SOURCES: readonly AttributionSource[] = [
  "UTM_NAVER_CPC",
  "NAVER_SEARCH_WITH_NAPM",
  "NAVER_SEARCH",
  "OTHER_REFERRER",
  "DIRECT",
  "UNKNOWN",
];

/** 제어문자 제거 + trim + 길이 제한. 문자열이 아니면 "". */
export function cleanText(value: unknown, maxLen = MAX_LEN): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLen);
}

/** 같은 사이트 pathname만 허용(query/hash 제거). 형식이 이상하면 "". */
export function cleanPath(value: unknown): string {
  const text = cleanText(value, 300);
  if (!text.startsWith("/") || text.startsWith("//")) return "";
  return text.split(/[?#]/)[0].slice(0, MAX_LEN);
}

/** landingPage(pathname+search)에서 Telegram/대시보드 표시용 pathname만 꺼낸다. */
export function pathOnly(landingPage: string): string {
  return landingPage ? landingPage.split(/[?#]/)[0] || "/" : "";
}

export function cleanIsoDate(value: unknown): string {
  const text = cleanText(value, 40);
  if (!text) return "";
  const time = Date.parse(text);
  return Number.isFinite(time) ? new Date(time).toISOString() : "";
}

/** 영숫자/하이픈/밑줄 ID만 허용. */
export function cleanId(value: unknown, maxLen = 64): string {
  const text = cleanText(value, maxLen);
  return /^[A-Za-z0-9_-]+$/.test(text) ? text : "";
}

export function cleanAttributionSource(value: unknown): AttributionSource {
  return ATTRIBUTION_SOURCES.includes(value as AttributionSource) ? (value as AttributionSource) : "UNKNOWN";
}

function obj(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function cleanTouch(value: unknown): TouchSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const raw = obj(value);
  return {
    source: cleanText(raw.source),
    medium: cleanText(raw.medium),
    campaign: cleanText(raw.campaign),
    content: cleanText(raw.content),
    term: cleanText(raw.term),
    referrer: cleanText(raw.referrer),
    landingPage: cleanText(raw.landingPage),
    hasNaPm: raw.hasNaPm === true,
    capturedAt: cleanIsoDate(raw.capturedAt),
  };
}

export function emptyAttribution(): LeadAttribution {
  return {
    source: "",
    medium: "",
    campaign: "",
    content: "",
    term: "",
    referrer: "",
    landingPage: "",
    hasNaPm: false,
    attributionSource: "UNKNOWN",
    firstTouch: null,
    lastTouch: null,
  };
}

export function cleanAttribution(value: unknown): LeadAttribution {
  const raw = obj(value);
  return {
    source: cleanText(raw.source),
    medium: cleanText(raw.medium),
    campaign: cleanText(raw.campaign),
    content: cleanText(raw.content),
    term: cleanText(raw.term),
    referrer: cleanText(raw.referrer),
    landingPage: cleanText(raw.landingPage),
    hasNaPm: raw.hasNaPm === true,
    attributionSource: cleanAttributionSource(raw.attributionSource),
    firstTouch: cleanTouch(raw.firstTouch),
    lastTouch: cleanTouch(raw.lastTouch),
  };
}

/** 선택형 맥락 값만(각 80자). 자유 입력 문장이 들어올 자리는 만들지 않는다. */
export function cleanContext(value: unknown): LeadContext {
  const raw = obj(value);
  const context: LeadContext = {};
  for (const key of ["service", "language", "subject", "studyGoal", "currentLevel"] as const) {
    const text = cleanText(raw[key], 80);
    if (text) context[key] = text;
  }
  return context;
}

/**
 * 발신번호 마스킹: 끝 4자리만 남긴다("010-****-1234"). 자릿수가 이상하면 undefined —
 * 마스킹을 확신할 수 없는 값은 표시하지 않는다.
 */
export function maskPhoneNumber(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  if (/^\d{4}$/.test(digits)) return `***-****-${digits}`;
  if (!/^0\d{8,10}$/.test(digits)) return undefined;
  const head = digits.startsWith("02") ? "02" : digits.slice(0, 3);
  return `${head}-****-${digits.slice(-4)}`;
}

/** 요청 본문 JSON 파싱(크기 제한). 실패하면 null. */
export function parseJsonBody(text: string, maxBytes = 8_192): Record<string, unknown> | null {
  if (!text || text.length > maxBytes) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
