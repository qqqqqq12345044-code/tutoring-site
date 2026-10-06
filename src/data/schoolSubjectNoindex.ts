/**
 * School×subject pages held at noindex by an editorial decision (2026-10-06),
 * separate from src/data/qualityNoindex.ts (which must hold exactly the quality
 * gate's RED set). These are AMBER pages — not RED — whose content could not be
 * made distinct with verified official facts:
 * - masked similarity 56~58%, no sources, first note only points to a region page;
 * - rewriting them with NEIS facts did not add enough unique content
 *   (see docs/qa/school-subject-amber-analysis-2026-10-06.md §7·§8).
 *
 * Like qualityNoindex, the page stays reachable (HTTP 200, canonical and body
 * unchanged); only robots becomes noindex and the URL leaves sitemap.xml
 * (src/lib/indexability.ts). Index-aware link helpers drop links to it.
 * validate:quick checks every entry is a published school×subject page that is
 * not RED (a RED page belongs in qualityNoindex.ts instead).
 */
export const schoolSubjectNoindexPaths = new Set<string>([
  "/school/gangnam-high-school/math", // 개포고 수학
  "/school/seongnam-middle-school/english", // 서현중 영어
  "/school/yeongtong-middle-school/english", // 영통중 영어
  "/school/bupyeong-elementary-school/science", // 인천갈산초 과학
  "/school/namdong-high-school/social", // 인천남동고 사회
]);
