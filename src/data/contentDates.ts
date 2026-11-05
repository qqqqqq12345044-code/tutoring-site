import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { guideArticles } from "@/data/guide";
import { dongs } from "@/data/dongs";

/**
 * When each page's *content* last really changed (YYYY-MM-DD, KST) — the
 * source for sitemap.xml <lastmod>. Never derived from build or request time:
 * a redeploy without content changes must not move these dates.
 *
 * How to maintain:
 * - Guide articles carry their own updatedAt in src/data/guide.ts.
 * - Edit a data entry or a page template's visible content → bump the matching
 *   KIND_UPDATED date (template/whole-kind change) or add a PATH_UPDATED entry
 *   (single page). Link-list or breadcrumb tweaks are not content changes.
 * - Initial values come from git history: the last commit that touched each
 *   kind's page template or data file (`git log -1 --format=%cs -- <file>`),
 *   plus 2026-10-02 for the SEO content work done that day.
 * - A page's date is the later of its kind date and its own PATH_UPDATED /
 *   PATH_UPDATED_BY_DATE date, so a kind bump also moves older per-page dates.
 * - Batch work (new 행정동 / 학교×학년×과목 entries, or edits to existing ones):
 *   add every affected sitemap path under the batch's commit date in
 *   PATH_UPDATED_BY_DATE. Hubs count as changed when an entry they list changes.
 */
export type ContentKind =
  | "home"
  | "static"
  | "subject"
  | "subject-topic"
  | "grade"
  | "sub-grade"
  | "guide"
  | "program"
  | "region-province"
  | "region-city"
  | "region-district"
  | "region-subject"
  | "region-grade"
  | "region-grade-subject"
  | "region-district-subject"
  | "region-program"
  | "school"
  | "school-subject"
  | "school-grade"
  | "school-grade-subject"
  | "region-dong"
  | "region-dong-subject";

const KIND_UPDATED: Record<ContentKind, string> = {
  // 2026-10-09: 교과 외 과정·학습가이드 섹션 추가
  home: "2026-10-09",
  static: "2026-09-28",
  subject: "2026-09-22",
  "subject-topic": "2026-09-28",
  grade: "2026-09-22",
  // 2026-10-09: "초등학교 1학년" 풀네임 제목, 학년별 과목 포인트, 공부법 링크 추가
  "sub-grade": "2026-10-09",
  guide: "2026-09-22",
  // 2026-10-09: 과목 허브 연결, 공부법·준비 가이드 링크
  program: "2026-10-09",
  // 2026-10-09: 시·군·구 전체 목록(학교 등록 지역/그 외) 표시
  "region-province": "2026-10-09",
  "region-city": "2026-09-28",
  "region-district": "2026-09-22",
  // 2026-10-02: shared study-guide sections, local notes and region FAQs added to the template.
  "region-subject": "2026-10-02",
  "region-grade": "2026-09-22",
  "region-grade-subject": "2026-09-28",
  "region-district-subject": "2026-09-18",
  "region-program": "2026-09-28",
  school: "2026-09-28",
  // 2026-10-27 (11ba301): PlanBasisNote 기준 문구가 학교×과목 화면에 추가
  "school-subject": "2026-10-27",
  // 2026-11-02 (6c41ce0): 학교 학년 hub / 학년×과목 페이지 신설. 이후 batch는 PATH_UPDATED_BY_DATE
  "school-grade": "2026-11-02",
  "school-grade-subject": "2026-11-02",
  // 2026-10-16: 의정부 행정동 pilot (행정동 hub, 행정동×과목)
  // 2026-10-27 (11ba301·3c31d76): DongPages 기준 문구 추가, 과목 안내 문단 재작성
  "region-dong": "2026-10-27",
  "region-dong-subject": "2026-10-27",
};

/** Per-URL overrides — pages whose own content changed after their kind's date. */
const PATH_UPDATED: Record<string, string> = {
  // 2026-10-09: 과목 허브에 논술·코딩·검정고시, 학년 허브에 1~12학년 목록, 학교 허브 지역 계층화, 가이드 9편 추가
  "/subjects": "2026-10-09",
  "/grades": "2026-10-09",
  "/schools": "2026-10-09",
  "/guide": "2026-10-09",
  // 2026-10-02 SEO content work
  "/subject/math": "2026-10-02",
  "/subject/english": "2026-10-02",
  "/subject/korean": "2026-10-02",
  "/subject/social": "2026-10-06", // 2026-10-06: 탐구 주제 설명 정리 (STEP 12)
  "/subject/science": "2026-10-06", // 2026-10-06: 탐구 주제 설명 정리 (STEP 12)
  // 2026-10-06 STEP 12: 2028학년도 수능 표현 점검 (탐구 주제 응시 학년도 구분, 주제 설명 정리)
  "/subject/social/social-tamgu": "2026-10-06",
  "/subject/science/science-tamgu": "2026-10-06",
  // 2026-10-06 3차: 학교×과목 공식 사실 보강, 남은 AMBER 재작성, 고등 영어 playbook, 마포중·서울개원초 데이터 정정
  "/region/gyeonggi/suwon/high/math": "2026-10-06",
  "/region/gyeonggi/goyang/middle/math": "2026-10-06",
  "/region/seoul/mapo/middle/english": "2026-10-06",
  "/region/gyeonggi/anyang/high/english": "2026-10-07",
  "/region/gyeonggi/seongnam/middle/math": "2026-10-07", // 2026-10-07 후속: 서현·이매·판교중 공시 수학 평가계획 비교
  "/region/gyeonggi/yongin/high/english": "2026-10-06",
  "/region/seoul/mapo/high/english": "2026-10-06",
  "/region/incheon/michuhol/high/english": "2026-10-06",
  "/region/incheon/gyeyang/high/english": "2026-10-06",
  "/school/gangnam-middle-school/english": "2026-10-07",
  "/school/yangcheon-middle-school/math": "2026-10-07",
  "/school/seocho-high-school/english": "2026-10-07",
  "/school/seocho-middle-school/english": "2026-10-07",
  "/school/songpa-high-school/english": "2026-10-07",
  "/school/yangcheon-high-school/math": "2026-10-07",
  "/school/yongin-high-school/math": "2026-10-07",
  "/school/goyang-high-school/math": "2026-10-07",
  "/school/anyang-high-school/math": "2026-10-07",
  "/school/jungdong-high-school/math": "2026-10-07",
  "/school/banpo-middle-school/math": "2026-10-07",
  "/school/seongsan-middle-school/math": "2026-10-07",
  "/school/hyundai-high-school/english": "2026-10-07",
  "/school/sungmun-high-school/english": "2026-10-07",
  "/school/michuhol-high-school/english": "2026-10-06",
  "/school/yeonsu-elementary-school/math": "2026-10-07",
  "/school/ganghwa-elementary-school/math": "2026-10-07",
  "/school/mapo-middle-school/english": "2026-10-07",
  "/school/michuhol-elementary-school/korean": "2026-10-07",
  "/school/mapo-middle-school/math": "2026-10-07",
  "/school/mapo-middle-school": "2026-10-06",
  "/school/gangnam-elementary-school": "2026-10-06",
  "/region/gyeonggi/bucheon/middle/english": "2026-10-06",
  // 2026-10-06 후속: 공식 출처 보강·"참고 자료" 표시·지역 사실 정정, 신규 GREEN 3건(수원·서초·양천 중등)
  "/region/seoul/gangseo/math": "2026-10-06",
  "/region/incheon/michuhol/english": "2026-10-06",
  "/region/gyeonggi/suwon/middle/math": "2026-10-06",
  "/region/seoul/seocho/middle/english": "2026-10-06",
  "/region/seoul/yangcheon/middle/math": "2026-10-06",
  // 2026-10-06 STEP 8: new region×grade×subject pages (quality gate GREEN)
  "/region/gyeonggi/seongnam/middle/english": "2026-10-06",
  "/region/gyeonggi/yongin/middle/math": "2026-10-06",
  "/region/gyeonggi/bucheon/middle/math": "2026-10-06",
  "/region/gyeonggi/anyang/middle/math": "2026-10-06",
  "/region/gyeonggi/goyang/high/math": "2026-10-06",
  "/region/seoul/songpa/middle/math": "2026-10-06",
  // 2026-10-07 SEO 전수 감사: 학교알리미 2026학년도 2학기 교과별 평가계획 기반 학교×과목 콘텐츠 보강(43), 반포중 휴교 정정, 안양 고등 영어 비교 note
  "/school/gangnam-middle-school/math": "2026-10-07",
  "/school/yangcheon-middle-school/english": "2026-10-07",
  "/school/songpa-middle-school/math": "2026-10-07",
  "/school/songpa-middle-school/english": "2026-10-07",
  "/school/yeongtong-middle-school/math": "2026-10-07",
  "/school/bucheon-middle-school/english": "2026-10-07",
  "/school/bucheon-middle-school/math": "2026-10-07",
  "/school/jamsil-high-school/math": "2026-10-07",
  "/school/sinseo-middle-school/math": "2026-10-07",
  "/school/jukjeon-high-school/math": "2026-10-07",
  "/school/pyeongchon-high-school/math": "2026-10-07",
  "/school/daechi-elementary-school/math": "2026-10-07",
  "/school/daechi-elementary-school/korean": "2026-10-07",
  "/school/munjeong-middle-school/english": "2026-10-07",
  "/school/eonnam-middle-school/english": "2026-10-07", // 2026-10-07 후속: 언남중 공시 평가계획(연도 표기 확인 후) 반영
  "/school/seongnam-middle-school/english": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/yeongtong-middle-school/english": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/gangnam-high-school/math": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/namdong-high-school/social": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/bupyeong-elementary-school/science": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/sinmok-high-school/english": "2026-10-07",
  "/school/banpo-elementary-school/english": "2026-10-07",
  "/school/michuhol-middle-school/math": "2026-10-07",
  "/school/yeonsu-high-school/math": "2026-10-07",
  "/school/namdong-elementary-school/english": "2026-10-07",
  "/school/bupyeong-middle-school/english": "2026-10-07",
  "/school/bupyeong-high-school/math": "2026-10-07",
  "/school/gyeyang-high-school/english": "2026-10-07",
  "/school/ganghwa-high-school/korean": "2026-10-07",
  "/school/seongnam-middle-school/math": "2026-10-07",
};

/**
 * Per-page dates from batch work, grouped by commit date. Derived from git history of src/data/dongs.ts,
 * dongSubjectContent.ts, schoolGradeSubjectContent.ts (last commit that changed each page's entry or, for a hub,
 * any entry it lists) and schoolGradeGeo.ts answersUpdatedAt. 2026-10-29 = 00fece6 (학교 hub 기준 표시·평가계획 섹션).
 * Only dates later than the page's kind date are listed.
 */
const PATH_UPDATED_BY_DATE: Record<string, string[]> = {
  "2026-10-29": [
    "/school/banpo-elementary-school",
    "/school/bupyeong-high-school",
    "/school/bupyeong-middle-school",
    "/school/daechi-elementary-school",
    "/school/ganghwa-elementary-school",
    "/school/ganghwa-high-school",
    "/school/gangnam-middle-school",
    "/school/gyeyang-middle-school",
    "/school/jamsil-high-school",
    "/school/jukjeon-high-school",
    "/school/mapo-middle-school",
    "/school/seocho-high-school",
    "/school/seocho-middle-school",
    "/school/seongnam-middle-school",
    "/school/seongsan-middle-school",
    "/school/songpa-high-school",
    "/school/songpa-middle-school",
    "/school/yeonsu-middle-school",
  ],
  "2026-11-02": [
    "/region/busan/busan-saha/hadan2-dong",
    "/region/busan/busan-saha/hadan2-dong/english",
    "/region/busan/busan-saha/hadan2-dong/korean",
    "/region/busan/busan-saha/hadan2-dong/math",
    "/region/busan/busan-saha/hadan2-dong/science",
    "/region/busan/busan-saha/hadan2-dong/social",
    "/region/chungbuk/cheongju/tapdaeseong-dong",
    "/region/chungbuk/cheongju/tapdaeseong-dong/korean",
    "/region/chungbuk/cheongju/tapdaeseong-dong/science",
    "/region/chungbuk/cheongju/tapdaeseong-dong/social",
    "/region/chungnam/cheonan/byeongcheon-myeon",
    "/region/chungnam/cheonan/byeongcheon-myeon/math",
    "/region/chungnam/cheonan/byeongcheon-myeon/science",
    "/region/chungnam/cheonan/byeongcheon-myeon/social",
    "/region/daegu/daegu-suseong/beomeo4-dong",
    "/region/daegu/daegu-suseong/beomeo4-dong/english",
    "/region/daegu/daegu-suseong/beomeo4-dong/korean",
    "/region/daegu/daegu-suseong/beomeo4-dong/math",
    "/region/daegu/daegu-suseong/beomeo4-dong/science",
    "/region/daegu/daegu-suseong/beomeo4-dong/social",
    "/region/daejeon/daejeon-yuseong/sinseong-dong",
    "/region/daejeon/daejeon-yuseong/sinseong-dong/english",
    "/region/daejeon/daejeon-yuseong/sinseong-dong/korean",
    "/region/daejeon/daejeon-yuseong/sinseong-dong/math",
    "/region/daejeon/daejeon-yuseong/sinseong-dong/science",
    "/region/daejeon/daejeon-yuseong/sinseong-dong/social",
    "/region/gangwon/wonju/bangokgwanseol-dong",
    "/region/gangwon/wonju/bangokgwanseol-dong/english",
    "/region/gangwon/wonju/bangokgwanseol-dong/korean",
    "/region/gangwon/wonju/bangokgwanseol-dong/math",
    "/region/gangwon/wonju/bangokgwanseol-dong/science",
    "/region/gangwon/wonju/bangokgwanseol-dong/social",
    "/region/gyeongbuk/andong/seogu-dong",
    "/region/gyeongbuk/andong/seogu-dong/english",
    "/region/gyeongbuk/andong/seogu-dong/korean",
    "/region/gyeongbuk/andong/seogu-dong/math",
    "/region/gyeongbuk/andong/seogu-dong/science",
    "/region/gyeongbuk/andong/seogu-dong/social",
    "/region/gyeongnam/changwon/bongam-dong",
    "/region/gyeongnam/changwon/bongam-dong/english",
    "/region/gyeongnam/changwon/bongam-dong/korean",
    "/region/gyeongnam/changwon/bongam-dong/math",
    "/region/gyeongnam/changwon/bongam-dong/science",
    "/region/gyeongnam/changwon/bongam-dong/social",
    "/region/jeonbuk/jeonju/nosong-dong",
    "/region/jeonbuk/jeonju/nosong-dong/math",
    "/region/jeonbuk/jeonju/nosong-dong/science",
    "/region/jeonbuk/jeonju/nosong-dong/social",
    "/region/ulsan/ulsan-nam/mugeo-dong",
    "/region/ulsan/ulsan-nam/mugeo-dong/english",
    "/region/ulsan/ulsan-nam/mugeo-dong/korean",
    "/region/ulsan/ulsan-nam/mugeo-dong/math",
    "/region/ulsan/ulsan-nam/mugeo-dong/science",
    "/region/ulsan/ulsan-nam/mugeo-dong/social",
  ],
  "2026-11-03": [
    "/region/chungbuk/cheongju/geumcheon-dong",
    "/region/chungbuk/cheongju/geumcheon-dong/english",
    "/region/chungbuk/cheongju/geumcheon-dong/korean",
    "/region/chungbuk/cheongju/geumcheon-dong/math",
    "/region/chungbuk/cheongju/geumcheon-dong/science",
    "/region/chungbuk/cheongju/geumcheon-dong/social",
    "/region/chungnam/cheonan/wonseong1-dong",
    "/region/chungnam/cheonan/wonseong1-dong/english",
    "/region/chungnam/cheonan/wonseong1-dong/korean",
    "/region/chungnam/cheonan/wonseong1-dong/math",
    "/region/chungnam/cheonan/wonseong1-dong/science",
    "/region/chungnam/cheonan/wonseong1-dong/social",
    "/region/gyeongbuk/yeongju/yeongju1-dong",
    "/region/gyeongbuk/yeongju/yeongju1-dong/english",
    "/region/gyeongbuk/yeongju/yeongju1-dong/math",
    "/region/gyeongbuk/yeongju/yeongju1-dong/science",
    "/region/gyeongbuk/yeongju/yeongju1-dong/social",
    "/region/jeju/jeju-si/hanrim-eup",
    "/region/jeju/jeju-si/hanrim-eup/english",
    "/region/jeju/jeju-si/hanrim-eup/korean",
    "/region/jeju/jeju-si/hanrim-eup/math",
    "/region/jeju/jeju-si/hanrim-eup/science",
    "/region/jeju/jeju-si/hanrim-eup/social",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong/english",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong/korean",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong/math",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong/science",
    "/region/jeonbuk/jeonju/pyeonghwa1-dong/social",
    "/school/cheonan-middle-school/1/english",
    "/school/cheonan-middle-school/1/korean",
    "/school/cheonan-middle-school/1/math",
    "/school/cheonan-middle-school/1/science",
    "/school/cheonan-middle-school/1/social",
    "/school/cheonan-middle-school/2/english",
    "/school/cheonan-middle-school/2/korean",
    "/school/cheonan-middle-school/2/math",
    "/school/cheonan-middle-school/2/science",
    "/school/cheonan-middle-school/2/social",
    "/school/cheonan-middle-school/3/english",
    "/school/cheonan-middle-school/3/korean",
    "/school/cheonan-middle-school/3/math",
    "/school/cheonan-middle-school/3/science",
    "/school/cheonan-middle-school/3/social",
    "/school/cheonanjungang-high-school/1/english",
    "/school/cheonanjungang-high-school/1/korean",
    "/school/cheonanjungang-high-school/1/math",
    "/school/cheonanjungang-high-school/1/science",
    "/school/cheonanjungang-high-school/1/social",
    "/school/cheonanjungang-high-school/2",
    "/school/cheonanjungang-high-school/2/english",
    "/school/cheonanjungang-high-school/2/korean",
    "/school/cheonanjungang-high-school/2/math",
    "/school/cheongjudong-middle-school/2",
    "/school/cheongjudong-middle-school/2/english",
    "/school/cheongjudong-middle-school/2/korean",
    "/school/cheongjudong-middle-school/2/math",
    "/school/cheongjudong-middle-school/2/science",
    "/school/cheongjudong-middle-school/2/social",
    "/school/cheongjudong-middle-school/3",
    "/school/cheongjudong-middle-school/3/english",
    "/school/cheongjudong-middle-school/3/korean",
    "/school/cheongjudong-middle-school/3/math",
    "/school/cheongjudong-middle-school/3/science",
    "/school/cheongjudong-middle-school/3/social",
    "/school/cheonseong-middle-school/1/english",
    "/school/cheonseong-middle-school/1/korean",
    "/school/cheonseong-middle-school/1/social",
    "/school/cheonseong-middle-school/2/english",
    "/school/cheonseong-middle-school/2/korean",
    "/school/cheonseong-middle-school/2/social",
    "/school/cheonseong-middle-school/3/english",
    "/school/cheonseong-middle-school/3/korean",
    "/school/cheonseong-middle-school/3/math",
    "/school/cheonseong-middle-school/3/social",
    "/school/geumcheon-high-school-cheongju/1",
    "/school/geumcheon-high-school-cheongju/1/english",
    "/school/geumcheon-high-school-cheongju/1/korean",
    "/school/geumcheon-high-school-cheongju/1/math",
    "/school/geumcheon-high-school-cheongju/1/science",
    "/school/geumcheon-high-school-cheongju/1/social",
    "/school/geumcheon-high-school-cheongju/2",
    "/school/geumcheon-high-school-cheongju/2/english",
    "/school/geumcheon-high-school-cheongju/2/korean",
    "/school/geumcheon-high-school-cheongju/2/math",
    "/school/geumcheon-middle-school/2",
    "/school/geumcheon-middle-school/2/english",
    "/school/geumcheon-middle-school/2/korean",
    "/school/geumcheon-middle-school/2/math",
    "/school/geumcheon-middle-school/2/science",
    "/school/geumcheon-middle-school/3",
    "/school/geumcheon-middle-school/3/english",
    "/school/geumcheon-middle-school/3/korean",
    "/school/geumcheon-middle-school/3/science",
    "/school/geumcheon-middle-school/3/social",
    "/school/gyeonganyeoja-middle-school/2/science",
    "/school/hadan-middle-school/2/english",
    "/school/hanrim-high-school/1/korean",
    "/school/hanrim-high-school/1/math",
    "/school/hanrim-high-school/1/science",
    "/school/hanrim-high-school/1/social",
    "/school/hanrim-high-school/2",
    "/school/hanrim-high-school/2/english",
    "/school/hanrim-high-school/2/korean",
    "/school/hanrim-high-school/2/math",
    "/school/hanrimhanggonguju-high-school/1/english",
    "/school/hanrimhanggonguju-high-school/1/korean",
    "/school/hanrimhanggonguju-high-school/1/math",
    "/school/hanrimhanggonguju-high-school/1/science",
    "/school/hanrimhanggonguju-high-school/1/social",
    "/school/hanrimhanggonguju-high-school/2/english",
    "/school/hanrimhanggonguju-high-school/2/korean",
    "/school/hanrimhanggonguju-high-school/2/math",
    "/school/hanrimyeoja-middle-school/1/english",
    "/school/hanrimyeoja-middle-school/1/math",
    "/school/hanrimyeoja-middle-school/1/science",
    "/school/hanrimyeoja-middle-school/1/social",
    "/school/hanrimyeoja-middle-school/2/korean",
    "/school/hanrimyeoja-middle-school/2/math",
    "/school/hanrimyeoja-middle-school/2/science",
    "/school/hanrimyeoja-middle-school/2/social",
    "/school/hanrimyeoja-middle-school/3/english",
    "/school/hanrimyeoja-middle-school/3/korean",
    "/school/hanrimyeoja-middle-school/3/math",
    "/school/hanrimyeoja-middle-school/3/science",
    "/school/hanrimyeoja-middle-school/3/social",
    "/school/jamsil-high-school/1/korean",
    "/school/jeonjunam-middle-school/2/english",
    "/school/jeonjunam-middle-school/2/korean",
    "/school/jeonjunam-middle-school/2/math",
    "/school/jeonjunam-middle-school/2/social",
    "/school/jeonjunam-middle-school/3/english",
    "/school/jeonjunam-middle-school/3/korean",
    "/school/jeonjunam-middle-school/3/math",
    "/school/jeonjunam-middle-school/3/science",
    "/school/jukjeon-high-school/2/math",
    "/school/mugeo-middle-school/3/social",
    "/school/wansanyeoja-high-school/1",
    "/school/wansanyeoja-high-school/1/english",
    "/school/wansanyeoja-high-school/1/korean",
    "/school/wansanyeoja-high-school/1/math",
    "/school/wansanyeoja-high-school/1/science",
    "/school/wansanyeoja-high-school/1/social",
    "/school/wansanyeoja-high-school/2/math",
    "/school/yeonggwangyeoja-high-school/1",
    "/school/yeonggwangyeoja-high-school/1/english",
    "/school/yeonggwangyeoja-high-school/1/math",
    "/school/yeonggwangyeoja-high-school/1/science",
    "/school/yeonggwangyeoja-high-school/1/social",
    "/school/yeonggwangyeoja-high-school/2",
    "/school/yeonggwangyeoja-high-school/2/english",
    "/school/yeonggwangyeoja-high-school/2/math",
    "/school/yeonggwangyeoja-middle-school/1",
    "/school/yeonggwangyeoja-middle-school/1/english",
    "/school/yeonggwangyeoja-middle-school/1/korean",
    "/school/yeonggwangyeoja-middle-school/1/science",
    "/school/yeonggwangyeoja-middle-school/1/social",
    "/school/yeonggwangyeoja-middle-school/2/english",
    "/school/yeonggwangyeoja-middle-school/2/korean",
    "/school/yeonggwangyeoja-middle-school/2/math",
    "/school/yeonggwangyeoja-middle-school/2/social",
    "/school/yeonggwangyeoja-middle-school/3/english",
    "/school/yeonggwangyeoja-middle-school/3/korean",
    "/school/yeonggwangyeoja-middle-school/3/math",
    "/school/yeonggwangyeoja-middle-school/3/science",
  ],
};

const PATH_DATE_BY_PATH = new Map(
  Object.entries(PATH_UPDATED_BY_DATE).flatMap(([date, paths]) => paths.map((p) => [p, date] as const))
);

const subjectSlugs = new Set(subjects.map((s) => s.slug));
const gradeSlugs = new Set(grades.map((g) => g.slug));
const dongSlugs = new Set(dongs.map((d) => d.slug));

export function getContentKind(path: string): ContentKind {
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return "home";
  if (seg.length === 1) return "static";
  switch (seg[0]) {
    case "subject":
      return seg.length === 2 ? "subject" : "subject-topic";
    case "grade":
      return seg.length === 2 ? "grade" : "sub-grade";
    case "guide":
      return "guide";
    case "program":
      return "program";
    case "school":
      if (seg.length === 2) return "school";
      if (/^\d$/.test(seg[2])) return seg.length === 3 ? "school-grade" : "school-grade-subject";
      return "school-subject";
    case "region": {
      if (seg.length === 2) return "region-province";
      if (seg.length === 3) return "region-city";
      if (seg[3] === "program") return "region-program";
      if (seg.length === 4) {
        if (subjectSlugs.has(seg[3])) return "region-subject";
        if (gradeSlugs.has(seg[3])) return "region-grade";
        if (dongSlugs.has(seg[3])) return "region-dong";
        return "region-district";
      }
      if (dongSlugs.has(seg[3])) return "region-dong-subject";
      return gradeSlugs.has(seg[3]) ? "region-grade-subject" : "region-district-subject";
    }
  }
  return "static";
}

/** Last real content change for a URL path, as YYYY-MM-DD. */
export function getContentUpdatedAt(path: string): string {
  if (path.startsWith("/guide/")) {
    const article = guideArticles.find((a) => `/guide/${a.slug}` === path);
    if (article) return article.updatedAt;
  }
  const kindDate = KIND_UPDATED[getContentKind(path)];
  return [kindDate, PATH_UPDATED[path], PATH_DATE_BY_PATH.get(path)]
    .filter((d): d is string => Boolean(d))
    .reduce((a, b) => (b > a ? b : a));
}
