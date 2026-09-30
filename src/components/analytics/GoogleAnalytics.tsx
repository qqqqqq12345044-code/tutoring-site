import Script from "next/script";

/**
 * GA4 loader, inert until NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. "G-XXXXXXXXXX")
 * is set in the deploy environment — no measurement ID is kept in code.
 * Once active, src/lib/analytics.ts trackEvent() calls reach GA4 through
 * window.gtag. Enabling it also means updating /privacy to disclose GA cookies.
 */
const rawMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const measurementId = rawMeasurementId && /^G-[A-Z0-9]+$/.test(rawMeasurementId) ? rawMeasurementId : null;

/**
 * Rendered in <head>: a plain inline script runs during HTML parsing, before
 * hydration, so window.gtag already queues events fired on first render
 * (e.g. consult_page_view on a direct /consult landing).
 */
export function GoogleAnalyticsInit() {
  if (!measurementId) return null;
  return (
    <script
      id="ga4-init"
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}');`,
      }}
    />
  );
}

export default function GoogleAnalytics() {
  if (!measurementId) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />;
}
