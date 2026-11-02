/**
 * Region hubs (/region/[province] or /region/[province]/[city]) held at noindex even though a registered school
 * switches the "region" gate on (src/lib/indexability.ts). The page stays reachable (HTTP 200, body unchanged);
 * only robots becomes noindex and the URL stays out of sitemap.xml.
 *
 * - ulsan, daejeon (2026-11-02, 광역시 pilot): each province has one 행정동 page so far, and the province hub is
 *   the shared template with that one dong summary — the two read 100% alike after name masking (other indexed
 *   province hubs: 90.5%). New pages are indexed only after they pass the duplicate threshold
 *   (docs/qa/national-school-expansion-readiness-2026-11-02.md § Quality Gate), so they stay noindex until the
 *   province has enough dong content to differ. They were noindex before the pilot (no indexed→noindex change).
 *
 * Every slug must be a province / city node with a registered school (checked by validate:quick's region gate).
 */
export const regionHubNoindexSlugs = new Set<string>(["ulsan", "daejeon"]);
