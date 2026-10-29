// 브라우저 전용 공통 로직(두 사이트 공유). 원칙:
// - 전화 실행을 절대 막지 않는다: preventDefault/stopPropagation 없음, 예외는 전부 삼킨다.
// - 전송은 sendBeacon(없으면 fetch keepalive) fire-and-forget. 응답을 기다리지 않는다.
// - 전화번호 값/폼 입력값은 보내지 않는다. displayedNumberId(예: "main")만 보낸다.
import type { AttributionSource, LeadAttribution, LeadContext, LeadProject, TouchSnapshot } from "./types";

/** 사이트별 raw attribution(DORAN lib/attribution.ts의 Attribution과 같은 모양). */
export interface RawAttribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  landingPage: string;
  hasNaPm: string;
}

export function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // fall through
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function storageGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // 저장소가 막힌 환경 — attribution은 best-effort.
  }
}

/** 탭 세션 식별자(랜덤). 개인을 식별하지 않는다. */
export function getLeadSessionId(prefix: string): string {
  const key = `${prefix}_lead_session`;
  const existing = storageGet(key);
  if (existing && /^[A-Za-z0-9-]{8,64}$/.test(existing)) return existing;
  const id = randomId();
  storageSet(key, id);
  return id;
}

export function toTouch(raw: RawAttribution, capturedAt = new Date().toISOString()): TouchSnapshot {
  return {
    source: raw.utm_source,
    medium: raw.utm_medium,
    campaign: raw.utm_campaign,
    content: raw.utm_content,
    term: raw.utm_term,
    referrer: raw.referrer,
    landingPage: raw.landingPage,
    hasNaPm: raw.hasNaPm === "1",
    capturedAt,
  };
}

/** 세션의 최초 유입을 한 번만 저장한다(이미 있으면 그대로). 이후 광고 재유입에도 덮어쓰지 않는다. */
export function rememberFirstTouch(prefix: string, raw: RawAttribution): void {
  const key = `${prefix}_first_touch`;
  if (storageGet(key)) return;
  storageSet(key, JSON.stringify(toTouch(raw)));
}

export function readFirstTouch(prefix: string): TouchSnapshot | null {
  const raw = storageGet(`${prefix}_first_touch`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<TouchSnapshot>;
    return typeof parsed === "object" && parsed ? (parsed as TouchSnapshot) : null;
  } catch {
    return null;
  }
}

/** raw(현재=last touch) + 분류 + first touch → schema attribution. */
export function buildLeadAttribution(raw: RawAttribution, source: AttributionSource, firstTouch: TouchSnapshot | null): LeadAttribution {
  const last = toTouch(raw);
  return {
    source: raw.utm_source,
    medium: raw.utm_medium,
    campaign: raw.utm_campaign,
    content: raw.utm_content,
    term: raw.utm_term,
    referrer: raw.referrer,
    landingPage: raw.landingPage,
    hasNaPm: raw.hasNaPm === "1",
    attributionSource: source,
    firstTouch: firstTouch ?? last,
    lastTouch: last,
  };
}

/** fire-and-forget 전송. 실패해도 아무 일도 일어나지 않는다. */
export function sendLeadBeacon(path: string, payload: unknown): void {
  try {
    const body = JSON.stringify(payload);
    // text/plain: CORS preflight 없는 simple request(같은 origin이지만 beacon 호환성 유지).
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function" && navigator.sendBeacon(path, blob)) {
      return;
    }
    void fetch(path, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" } }).catch(() => {});
  } catch {
    // 무시 — tracking 실패가 사용자 동작을 막으면 안 된다.
  }
}

function ctaLocationOf(anchor: Element): string {
  const tagged = anchor.closest("[data-lead-cta]") ?? anchor.closest("[data-analytics-location]");
  const value = tagged?.getAttribute("data-lead-cta") ?? tagged?.getAttribute("data-analytics-location");
  if (value && /^[A-Za-z0-9_-]{1,32}$/.test(value)) return value;
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  return "content";
}

export interface PhoneClickTrackingOptions {
  project: LeadProject;
  storagePrefix: string;
  endpoint: string;
  getAttribution: () => LeadAttribution;
  getContext?: () => LeadContext;
}

/**
 * 모든 a[href^="tel:"]에 위임 click listener(capture)를 단다 — CTA 컴포넌트를 하나도 고치지 않고 적용된다.
 * 기본 동작(전화 앱 실행)은 그대로 진행된다. 반환값은 해제 함수.
 */
export function installPhoneClickTracking(options: PhoneClickTrackingOptions): () => void {
  function onClick(event: MouseEvent) {
    try {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || !(anchor.getAttribute("href") ?? "").startsWith("tel:")) return;
      sendLeadBeacon(options.endpoint, {
        project: options.project,
        clickEventId: randomId(),
        clickedAt: new Date().toISOString(),
        currentPage: window.location.pathname,
        displayedNumberId: anchor.getAttribute("data-phone-id") || "main",
        ctaLocation: ctaLocationOf(anchor),
        sessionId: getLeadSessionId(options.storagePrefix),
        attribution: options.getAttribution(),
        context: options.getContext?.() ?? {},
      });
    } catch {
      // 무시
    }
  }
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
