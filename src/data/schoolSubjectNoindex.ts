/**
 * School×subject pages held at noindex by an editorial decision, separate from
 * src/data/qualityNoindex.ts (which must hold exactly the quality gate's RED set).
 * An entry here must be a published, non-RED page.
 *
 * History: 2026-10-06 five AMBER pages were held (개포고 수학, 서현중 영어, 영통중 영어,
 * 인천갈산초 과학, 인천남동고 사회). 2026-10-07 they were rewritten with 학교알리미 공시 평가계획
 * facts, reached GREEN, and were released from this list.
 *
 * Current hold: 반포중 수학 — 학교알리미에서 '휴교'로 표시되고 2023학년도가 마지막 공시다
 * (docs/qa/seo-full-audit-2026-10-07.md §3). Its school page is held in
 * src/data/schoolNoindex.ts.
 *
 * Like qualityNoindex, the page stays reachable (HTTP 200, canonical and body
 * unchanged); only robots becomes noindex and the URL leaves sitemap.xml
 * (src/lib/indexability.ts). Index-aware link helpers drop links to it.
 * validate:quick checks every entry is a published school×subject page that is
 * not RED (a RED page belongs in qualityNoindex.ts instead).
 */
export const schoolSubjectNoindexPaths = new Set<string>([
  "/school/banpo-middle-school/math", // 반포중 수학 — 휴교
]);
