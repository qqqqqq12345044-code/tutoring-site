/**
 * Provider-agnostic conversion events for the consult funnel.
 *
 * trackEvent() forwards to GA4 (window.gtag) when <GoogleAnalytics /> is
 * active (NEXT_PUBLIC_GA_MEASUREMENT_ID set), or to a GTM dataLayer if one
 * exists; with neither present it does nothing. No provider ID lives in code.
 *
 * Privacy: params are limited to page classification and pathnames. Never
 * pass form values (name, phone, message, ...) and never pass a query string —
 * only `location.pathname`.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventName =
  | "consult_cta_click"
  | "phone_click"
  | "kakao_click"
  | "consult_page_view"
  | "consult_form_start"
  | "consult_submit_success"
  | "consult_submit_failure";

export type PageType =
  | "home"
  | "region"
  | "school"
  | "subject"
  | "grade"
  | "program"
  | "guide"
  | "consult"
  | "hub"
  | "other";

export type AnalyticsParams = Record<string, string | number>;

const HUB_PATHS = new Set(["/subjects", "/grades", "/regions", "/schools"]);

/** Coarse page family for funnel attribution (home → consult, region → consult, ...). */
export function getPageType(pathname: string): PageType {
  if (pathname === "/") return "home";
  if (HUB_PATHS.has(pathname)) return "hub";
  const first = pathname.split("/")[1];
  switch (first) {
    case "region":
      // /region/<province>/<city>/program/<slug> is a program landing page, not a plain region page.
      return pathname.includes("/program/") ? "program" : "region";
    case "school":
    case "subject":
    case "grade":
    case "program":
    case "guide":
    case "consult":
      return first;
    default:
      return "other";
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, params);
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
}

/**
 * The page a visitor came from before reaching /consult, kept for the rest of
 * the tab session so form start/submit events carry the same attribution as
 * the consult page view (client-side navigation doesn't update document.referrer).
 */
const SOURCE_KEY = "consult_source";

export interface ConsultSource {
  source_page_type: PageType | "direct";
  source_path: string;
}

export function saveConsultSource(source: ConsultSource): void {
  try {
    sessionStorage.setItem(SOURCE_KEY, JSON.stringify(source));
  } catch {
    // Storage unavailable (private mode, blocked) — attribution is best-effort.
  }
}

export function readConsultSource(): ConsultSource {
  try {
    const raw = sessionStorage.getItem(SOURCE_KEY);
    if (raw) return JSON.parse(raw) as ConsultSource;
  } catch {
    // fall through
  }
  return { source_page_type: "direct", source_path: "" };
}
