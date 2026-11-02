/**
 * School × 학년 (×과목) pages held at noindex, follow because the quality gate did not grade them GREEN
 * (scripts/lib/quality-gate.ts kinds "school-grade" / "school-grade-subject"). Only GREEN pages are indexed — the
 * same rule as the 행정동 pages. validate:quick checks that this list matches the gate's non-GREEN rows exactly.
 * The page itself still renders (HTTP 200) and stays out of sitemap.xml.
 *
 * 2026-11-02 pilot: the 학년 hubs of 무거중 and 계산중 are AMBER (이름 마스킹 유사도 38~45% between the same
 * school's 학년 hubs). Both schools use one 반영 비율 pattern in almost every subject and 학년 (무거중: 1차 30 +
 * 2차 30 + 수행 2개 40 everywhere), so the hubs summarise near-identical tables; the 학년×과목 pages under them
 * are GREEN and indexed.
 */
export const schoolGradeNoindexPaths = new Set<string>([
  "/school/mugeo-middle-school/1",
  "/school/mugeo-middle-school/2",
  "/school/mugeo-middle-school/3",
  "/school/gyeyang-middle-school/1",
  "/school/gyeyang-middle-school/2",
  "/school/gyeyang-middle-school/3",
  // 2026-11-02 26차: 하단중 학년 hub (1·2학년 모두 중간·기말 30%씩 + 수행 40%, 이름 마스킹 유사도 38~50%).
  "/school/hadan-middle-school/1",
  "/school/hadan-middle-school/2",
  "/school/hadan-middle-school/3",
  // 2026-11-02 27차: 창신중 학년 hub (41~43%), 영서고 학년 hub (모든 과목 2회고사 40% + 수행 2개 60%, 32%).
  "/school/changsin-middle-school/1",
  "/school/changsin-middle-school/2",
  "/school/changsin-middle-school/3",
  "/school/yeongseo-high-school/1",
  "/school/yeongseo-high-school/2",
]);
