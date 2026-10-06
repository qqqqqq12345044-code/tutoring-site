/**
 * Known-good SEO scope snapshot, used only to flag *unexpected* drift in
 * validate:full. Real counts are always computed from live code/data
 * (see route-inventory.ts) — this is a regression tripwire, not the source
 * of truth. Update these numbers deliberately (single place) whenever a
 * content/indexing change intentionally moves the scope, e.g. adding a
 * region, subject, school, or regionSubjectContent entry.
 */
export const BASELINE = {
  totalRoutes: 1482,
  // 2026-10-06: +6 indexed region×grade×subject pages (STEP 8, quality gate GREEN).
  // They were already routes (noindex fallback), so totalRoutes is unchanged.
  // 2026-10-06: −5 school×subject pages held noindex (src/data/schoolSubjectNoindex.ts, editorial AMBER holds).
  sitemapCount: 199,
  noindexCount: 1281,
  brokenLinks: 0,
};
