/**
 * Known-good SEO scope snapshot, used only to flag *unexpected* drift in
 * validate:full. Real counts are always computed from live code/data
 * (see route-inventory.ts) — this is a regression tripwire, not the source
 * of truth. Update these numbers deliberately (single place) whenever a
 * content/indexing change intentionally moves the scope, e.g. adding a
 * region, subject, school, or regionSubjectContent entry.
 */
export const BASELINE = {
  // 2026-10-09: +206 시·군·구 노드(src/data/regions.ts, 지역 누락 보완) — 학교 미등록이라 허브 1개씩만 생성(noindex).
  // 조합 route(과목·학년·학년×과목·프로그램)는 학교가 등록될 때만 생김(src/lib/regionRoutes.ts) → 미생성 5,562개.
  // 가이드 9편 추가로 sitemap +9. 실측(validate:full): 1482 → 1697, sitemap 202 → 211, noindex 1278 → 1484.
  // 2026-10-16: 의정부 파일럿 — 학교 70곳 등록(NEIS, 행정동 매핑) → 의정부 허브 색인(+1 sitemap), 조합 route 27,
  // 학교 70 + 학교×과목 350, 행정동 허브 15 + 행정동×과목 75 (전부 noindex: 콘텐츠 미작성 또는 품질 게이트 RED).
  // 실측: 1697 → 2234, sitemap 211 → 212, noindex 1484 → 2020.
  totalRoutes: 2234,
  // 2026-10-06: +6 indexed region×grade×subject pages (STEP 8, quality gate GREEN).
  // They were already routes (noindex fallback), so totalRoutes is unchanged.
  // 2026-10-06: −5 school×subject pages held noindex (src/data/schoolSubjectNoindex.ts, editorial AMBER holds).
  // 2026-10-07: +5 school×subject holds released after GREEN rewrite (공시 평가계획), −2 반포중(휴교) school page + math page
  // held noindex (src/data/schoolNoindex.ts, schoolSubjectNoindex.ts): 199 → 202, noindex 1281 → 1278.
  sitemapCount: 212,
  noindexCount: 2020,
  brokenLinks: 0,
};
