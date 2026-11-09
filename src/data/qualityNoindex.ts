/**
 * Combination pages held at noindex by the quality gate (2026-10-02, RED grade
 * from scripts/lib/quality-gate.ts — run `npx tsx scripts/audit-quality.ts --verbose`).
 *
 * The page stays reachable with its canonical and content unchanged; only
 * robots becomes noindex and the URL leaves sitemap.xml (src/lib/indexability.ts).
 * validate:quick fails if this list and the gate's RED set drift apart, so:
 * - an entry improved to AMBER/GREEN must be removed from here to re-index it;
 * - a newly RED entry must be added here (or fixed) before it can ship.
 */
export const qualityNoindexPaths = new Set<string>([
  // 지역×과목 — 지역 고유 note 없음 (2)
  "/region/gyeonggi/suwon/english",
  "/region/gyeonggi/suwon/math",
  // 지역×학년×과목 — 이름 마스킹 유사도 >60% 또는 실질 note 0 (19)
  "/region/gyeonggi/yongin/high/english",
  "/region/incheon/bupyeong/high/math",
  "/region/incheon/bupyeong/middle/english",
  "/region/incheon/ganghwa/high/korean",
  "/region/incheon/ganghwa/middle/science",
  "/region/incheon/gyeyang/high/english",
  "/region/incheon/gyeyang/middle/social",
  "/region/incheon/michuhol/high/english",
  "/region/incheon/michuhol/middle/math",
  "/region/incheon/namdong/high/social",
  "/region/incheon/namdong/middle/korean",
  "/region/incheon/yeonsu/high/math",
  "/region/incheon/yeonsu/middle/english",
  "/region/seoul/gangnam/high/math",
  "/region/seoul/gangnam/middle/english",
  "/region/seoul/gangseo/elementary/math",
  "/region/seoul/gangseo/high/korean",
  "/region/seoul/mapo/high/english",
  "/region/seoul/songpa/high/math",
  // 학교×과목 — 이름 마스킹 유사도 >60% (13)
  "/school/anyang-high-school/english",
  "/school/ganghwa-middle-school/science",
  "/school/gangnam-high-school/english",
  "/school/goyang-high-school/english",
  "/school/gyeyang-elementary-school/korean",
  "/school/gyeyang-middle-school/social",
  "/school/namdong-middle-school/korean",
  "/school/seocho-high-school/math",
  "/school/seocho-middle-school/math",
  "/school/songpa-high-school/math",
  "/school/suwon-yeoja-high-school/english",
  "/school/yeonsu-middle-school/english",
  "/school/yongin-high-school/english",
  // 행정동 hub — 2026-10-16 의정부 pilot에서 15개 모두 RED(70~83%)였으나, 2026-10-19 허브에 동별 과목 페이지
  // (학교알리미 평가계획) 요약을 싣고 화면에 없던 학교 목록 노트를 빼서 15개 모두 GREEN(13~28%) → 제외. 현재 해당 항목 없음.
  // 행정동×과목 — 2026-10-16 국어·영어·수학 45개, 2026-10-19 사회·과학 30개를 학교알리미 2026학년도 2학기 평가계획으로
  // 다시 써서(src/data/dongSubjectContent.ts) 75개 모두 GREEN(12~27%)이 되어 이 목록에서 제외했다. 현재 해당 항목 없음.
]);
