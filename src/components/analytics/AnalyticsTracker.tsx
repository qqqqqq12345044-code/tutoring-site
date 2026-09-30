"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getPageType, saveConsultSource, trackEvent, type ConsultSource } from "@/lib/analytics";

const CONSULT_PATH = "/consult";

function isConsultHref(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname === CONSULT_PATH;
  } catch {
    return false;
  }
}

/** Where on the page a CTA sits: an explicit data-analytics-location, else header/footer/content. */
function getCtaLocation(anchor: Element): string {
  const tagged = anchor.closest("[data-analytics-location]");
  if (tagged) return tagged.getAttribute("data-analytics-location") ?? "content";
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  return "content";
}

/**
 * Site-wide funnel tracking with no per-component wiring: one delegated click
 * listener classifies consult / phone / Kakao links, and a pathname effect
 * records consult page views with the page the visitor came from. Renders
 * nothing. Only pathnames are recorded — never query strings or form values.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = pathname;
    if (pathname !== CONSULT_PATH) return;

    let sourcePath = previousPath ?? "";
    if (!sourcePath && document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.origin === window.location.origin) sourcePath = referrer.pathname;
      } catch {
        // malformed referrer — treat as direct
      }
    }
    const source: ConsultSource = sourcePath
      ? { source_page_type: getPageType(sourcePath), source_path: sourcePath }
      : { source_page_type: "direct", source_path: "" };
    saveConsultSource(source);
    trackEvent("consult_page_view", { ...source });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const currentPath = window.location.pathname;

      let name: "phone_click" | "kakao_click" | "consult_cta_click" | null = null;
      if (href.startsWith("tel:")) name = "phone_click";
      else if (href.includes("pf.kakao.com")) name = "kakao_click";
      else if (currentPath !== CONSULT_PATH && isConsultHref(href)) name = "consult_cta_click";
      if (!name) return;

      trackEvent(name, {
        location: getCtaLocation(anchor),
        page_type: getPageType(currentPath),
        source_path: currentPath,
      });
    }
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
