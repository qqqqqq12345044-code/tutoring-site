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
  // 2026-10-19 전국 1차 행정동 batch: 합정동(마포)·신갈동(용인)·강화읍(강화) 허브 3 + 작성된 동×과목 15 = +18 route,
  // 전부 GREEN·색인(빈 동×과목 route는 만들지 않음 → noindex 증가 0): 2234 → 2252, sitemap 302 → 320.
  // 2026-10-19 전국 2차 batch: 반포본동(서초)·송파2동·잠실4동(송파)·죽전2동(용인)·부평4동(부평) 허브 5 + 동×과목 25
  // = +30 route, 전부 GREEN·색인 → 2252 → 2282, sitemap 320 → 350, noindex 변화 0.
  // 2026-10-20 전국 3차 batch: 이매1동(성남)·마두1동(고양)·신정2동(양천) 허브 3 + 동×과목 15 = +18 route,
  // 전부 GREEN·색인 → 2282 → 2300, sitemap 350 → 368, noindex 변화 0.
  // 2026-10-20 전국 4차 batch: 신수동·대흥동·상암동(마포)·등촌제3동(강서) 허브 4 + 동×과목 20 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 21곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +45 → 2300 → 2345, sitemap 368 → 392, noindex 1930 → 1951.
  // 2026-10-21 전국 5차 batch: 방화제1동·발산제1동(강서)·성산제1동(마포) 허브 3 + 동×과목 15 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 27곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +45 → 2345 → 2390, sitemap 392 → 410, noindex 1951 → 1978.
  totalRoutes: 2390,
  // 2026-10-06: +6 indexed region×grade×subject pages (STEP 8, quality gate GREEN).
  // They were already routes (noindex fallback), so totalRoutes is unchanged.
  // 2026-10-06: −5 school×subject pages held noindex (src/data/schoolSubjectNoindex.ts, editorial AMBER holds).
  // 2026-10-07: +5 school×subject holds released after GREEN rewrite (공시 평가계획), −2 반포중(휴교) school page + math page
  // held noindex (src/data/schoolNoindex.ts, schoolSubjectNoindex.ts): 199 → 202, noindex 1281 → 1278.
  // 2026-10-16 2단계: 행정동×과목 9개(송산2동·흥선동·신곡2동 × 국어·영어·수학)를 학교알리미 평가계획으로 다시 써서
  // 품질 게이트 GREEN → qualityNoindex에서 제외되어 색인: sitemap 212 → 221, noindex 2020 → 2011.
  // 2026-10-16 확대: 나머지 12개 동 × 국어·영어·수학 36개도 같은 방식(src/data/dongSubjectContent.ts)으로 GREEN
  // → 색인: sitemap 221 → 257, noindex 2011 → 1975. 행정동×과목 사회·과학 30개와 동 허브 15개는 RED·noindex 유지.
  // 2026-10-19 의정부 완성: 행정동×과목 사회·과학 30개를 같은 방식으로 다시 써서 GREEN, 행정동 허브 15개도 동별 과목
  // 평가계획 요약을 실어 GREEN → 색인 45개 추가: sitemap 257 → 302, noindex 1975 → 1930 (route 수 변화 없음).
  sitemapCount: 410,
  noindexCount: 1978,
  brokenLinks: 0,
};
