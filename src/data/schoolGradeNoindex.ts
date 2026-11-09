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
  // 2026-11-02 29차: 전주신일중 학년 hub 2·3 (RED 61% — 두 학년의 과목 구성·비율이 거의 같음; RED는 index 금지).
  "/school/jeonjusinil-middle-school/2",
  "/school/jeonjusinil-middle-school/3",
  // 2026-11-02 28차: 병천중 학년 hub 1·2 (AMBER 45%).
  "/school/byeongcheon-middle-school/1",
  "/school/byeongcheon-middle-school/2",
  // 2026-11-03 Batch 30 제주 한림읍: 한림고 1학년(31%)·한림항공우주고 1·2학년(36%)·한림여중 1~3학년(33%) 학년 hub는 AMBER라 noindex(같은 학교 학년 hub끼리 구조가 비슷함).
  "/school/hanrim-high-school/1",
  "/school/hanrimhanggonguju-high-school/1",
  "/school/hanrimhanggonguju-high-school/2",
  "/school/hanrimyeoja-middle-school/1",
  "/school/hanrimyeoja-middle-school/2",
  "/school/hanrimyeoja-middle-school/3",
  // 2026-11-03 Batch 30 천안 원성1동: 천안중·천성중 학년 hub(36~41%, 두 학교의 60:40 구조가 같음)·천안중앙고 1학년 hub(31%)·천성중 학년×과목 5개(33~39%)는 AMBER라 noindex.
  "/school/cheonanjungang-high-school/1",
  "/school/cheonan-middle-school/1",
  "/school/cheonan-middle-school/2",
  "/school/cheonan-middle-school/3",
  "/school/cheonseong-middle-school/1",
  "/school/cheonseong-middle-school/2",
  "/school/cheonseong-middle-school/3",
  "/school/cheonseong-middle-school/1/math",
  "/school/cheonseong-middle-school/1/science",
  "/school/cheonseong-middle-school/2/math",
  "/school/cheonseong-middle-school/2/science",
  "/school/cheonseong-middle-school/3/science",
  // 2026-11-03 Batch 30 전주 평화1동: 완산여고 2학년 hub(과목 카드 1개뿐이라 실질 note 1개)·전주남중 2·3학년 hub(41%, 두 학년의 시험 60%·수행 40% 구조가 같음)는 AMBER라 noindex.
  "/school/wansanyeoja-high-school/2",
  "/school/jeonjunam-middle-school/2",
  "/school/jeonjunam-middle-school/3",
  // 2026-11-03 Batch 30 영주 영주1동: 영광여중 2·3학년 hub(37%, 시험 2회 60% + 수행 2개 40% 구조가 같음)는 AMBER라 noindex.
  "/school/yeonggwangyeoja-middle-school/2",
  "/school/yeonggwangyeoja-middle-school/3",
  // 2026-11-05 Batch 31 영천 금호읍: 금호여중 1~3학년 hub(38%, 세 학년 모두 정기시험 60%·수행 40% 구조가 같음)는 AMBER라 noindex.
  "/school/geumhoyeoja-middle-school/1",
  "/school/geumhoyeoja-middle-school/2",
  "/school/geumhoyeoja-middle-school/3",
  // 2026-11-05 Batch 32 제주 조천읍: 함덕고 1·2학년 hub(42%, 두 학년 모두 정기시험 2회·수행 2개 구조가 같음)는 AMBER라 noindex.
  "/school/hamdeok-high-school/1",
  "/school/hamdeok-high-school/2",
  // 2026-11-05 Batch 33 울산 신정2동: 학성중 1·2학년 hub(두 학년 모두 정기시험 30·30·수행 20·20 구조가 같음)는 AMBER라 noindex.
  "/school/hakseong-middle-school/1",
  "/school/hakseong-middle-school/2",
  // 2026-11-06 Batch 35: 과목 1개 hub(실질 note 1개, 구조상 AMBER)는 noindex 보류. 신선여고 1학년(통합사회2 1개)은 hub 보류 시 과목 페이지가 orphan이라 항목 자체를 넣지 않음.
  "/school/pyeongchongyeongyeong-high-school/2",
  "/school/hupyeong-middle-school/3",
  // 2026-11-10 Batch 42: 학년 hub AMBER(이름 마스킹 유사도) noindex 보류.
  "/school/seongsa-middle-school/2",
  "/school/aju-middle-school/2",
  "/school/aju-middle-school/3",
  "/school/jejujungangyeoja-high-school/1",
]);
