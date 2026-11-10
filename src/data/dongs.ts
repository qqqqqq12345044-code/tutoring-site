import type { ContentSource } from "@/data/sources";

/**
 * 행정동 (administrative dong) nodes under a city-level region — the page unit for
 * /region/[province]/[city]/[dong] and /region/[province]/[city]/[dong]/[subject].
 *
 * Rules (2026-10-16, 의정부 pilot):
 * - Only 행정동 get pages. 법정동 (legal dong) names are shown on the 행정동 page as
 *   area information and never get their own URL — one 법정동 often spans several
 *   행정동 (e.g. 호원동 → 호원1동·호원2동·의정부1동), so a 법정동 page would duplicate them.
 * - Every row is copied from the city's official 행정구역 table (source below); nothing
 *   is inferred. 통·반 counts are that table's figures.
 * - A school is placed in a 행정동 only through School.dongSlug (src/data/schools.ts),
 *   which is resolved from the school's road address, not from the 법정동 name.
 * - Slugs end in "-dong" (읍·면: "-eup" / "-myeon") so they can never collide with a subject / grade /
 *   district / "program" segment under the same city (checked by validate:quick).
 *
 * Kept separate from src/data/regions.ts on purpose: regions feed the site-wide region
 * lists, district routes and the region hub gate, and dongs must not change any of them.
 */
export interface AdminDong {
  slug: string;
  /** 행정안전부 행정동코드 (data/official/admin-dongs.json); checked by validate:quick when present. */
  code?: string;
  /** 행정동 name, e.g. "호원1동". */
  name: string;
  /** City-level RegionNode slug (src/data/regions.ts). */
  citySlug: string;
  /** 법정동 covered by this 행정동, as listed in the official table. */
  legalDongs: string[];
  /** 통·반 counts from the city's own 행정구역 table; absent when only the 행정안전부 code table backs the row. */
  tong?: number;
  ban?: number;
}

export const UIJEONGBU_ADMIN_AREA_SOURCE: ContentSource = {
  label: "의정부시청 — 행정구역안내 (행정동·법정동·통·반 현황)",
  url: "https://www.ui4u.go.kr/portal/contents.do?mId=0501040000",
};

/** 행정안전부 주민등록 행정기관 코드 (행정동·법정동) — data/official/admin-dongs.json, used when a city has no own table. */
export const MOIS_ADMIN_CODE_SOURCE: ContentSource = {
  label: "행정안전부 — 행정기관(행정동) 및 관할구역(법정동) 변경내역 (2026.10.12. 시행 코드)",
  url: "https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000052&nttId=130109",
};

/** Sources per city for the 행정동 table itself (MOIS_ADMIN_CODE_SOURCE otherwise). */
export const dongTableSources: Record<string, ContentSource> = {
  uijeongbu: UIJEONGBU_ADMIN_AREA_SOURCE,
};

// 의정부시 15개 행정동 — 의정부시청 행정구역안내 표(2026-10-16 확인, 합계 714통 3,928반).
// 고산동은 2024-07-01 송산1동에서 분동된 행정동.
export const dongs: AdminDong[] = [
  { slug: "uijeongbu1-dong", code: "4115051000", name: "의정부1동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동", "호원동"], tong: 60, ban: 299 },
  { slug: "uijeongbu2-dong", code: "4115052000", name: "의정부2동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 48, ban: 232 },
  { slug: "howon1-dong", code: "4115054500", name: "호원1동", citySlug: "uijeongbu", legalDongs: ["호원동"], tong: 52, ban: 315 },
  { slug: "howon2-dong", code: "4115055500", name: "호원2동", citySlug: "uijeongbu", legalDongs: ["호원동"], tong: 54, ban: 303 },
  { slug: "jangam-dong", code: "4115056100", name: "장암동", citySlug: "uijeongbu", legalDongs: ["장암동"], tong: 36, ban: 220 },
  { slug: "singok1-dong", code: "4115056700", name: "신곡1동", citySlug: "uijeongbu", legalDongs: ["신곡동"], tong: 57, ban: 377 },
  { slug: "singok2-dong", code: "4115056800", name: "신곡2동", citySlug: "uijeongbu", legalDongs: ["신곡동"], tong: 58, ban: 314 },
  { slug: "songsan1-dong", code: "4115057300", name: "송산1동", citySlug: "uijeongbu", legalDongs: ["용현동"], tong: 49, ban: 272 },
  { slug: "songsan2-dong", code: "4115057600", name: "송산2동", citySlug: "uijeongbu", legalDongs: ["민락동"], tong: 38, ban: 250 },
  { slug: "songsan3-dong", code: "4115057800", name: "송산3동", citySlug: "uijeongbu", legalDongs: ["민락동", "낙양동"], tong: 61, ban: 289 },
  { slug: "jageum-dong", code: "4115058000", name: "자금동", citySlug: "uijeongbu", legalDongs: ["자일동", "금오동", "녹양동"], tong: 42, ban: 244 },
  { slug: "ganeung-dong", code: "4115059500", name: "가능동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 47, ban: 250 },
  { slug: "heungseon-dong", code: "4115061500", name: "흥선동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 37, ban: 195 },
  { slug: "nogyang-dong", code: "4115062000", name: "녹양동", citySlug: "uijeongbu", legalDongs: ["녹양동"], tong: 37, ban: 203 },
  { slug: "gosan-dong", code: "4115063000", name: "고산동", citySlug: "uijeongbu", legalDongs: ["고산동", "산곡동"], tong: 38, ban: 165 },

  // 2026-10-19 전국 1차 batch — 등록 학교 2곳 이상이 법정동 1:1로 확정된 행정동만 (docs/qa/national-dong-batch1-2026-10-19.md).
  // 행정안전부 행정동코드·법정동(리) 구성 그대로(data/official/admin-dongs.json).
  { slug: "hapjeong-dong", code: "1144068000", name: "합정동", citySlug: "mapo", legalDongs: ["합정동"] },
  { slug: "singal-dong", code: "4146351000", name: "신갈동", citySlug: "yongin", legalDongs: ["신갈동"] },
  {
    slug: "ganghwa-eup",
    code: "2871025000",
    name: "강화읍",
    citySlug: "ganghwa",
    legalDongs: ["강화읍", "신문리", "관청리", "국화리", "남산리", "갑곳리", "용정리", "옥림리", "월곳리", "대산리"],
  },

  // 2026-10-19 전국 2차 batch — 등록 학교가 주소정보누리집 도로명주소 API(행정동명)로 확정되고, 그중 2곳 이상의
  // 2학기 평가계획 원문을 읽을 수 있는 행정동만 (docs/qa/national-dong-batch2-2026-10-19.md).
  { slug: "banpobon-dong", code: "1165055000", name: "반포본동", citySlug: "seocho", legalDongs: ["반포동"] },
  { slug: "songpa2-dong", code: "1171059000", name: "송파2동", citySlug: "songpa", legalDongs: ["송파동"] },
  { slug: "jamsil4-dong", code: "1171069000", name: "잠실4동", citySlug: "songpa", legalDongs: ["신천동"] },
  { slug: "jukjeon2-dong", code: "4146555000", name: "죽전2동", citySlug: "yongin", legalDongs: ["죽전동"] },
  { slug: "bupyeong4-dong", code: "2823754000", name: "부평4동", citySlug: "bupyeong", legalDongs: ["부평동"] },

  // 2026-10-20 전국 3차 batch — 같은 기준(등록 학교 2곳 이상 확정 + 그 학교들의 2학기 평가계획을 텍스트로 확인)
  // (docs/qa/national-dong-batch3-2026-10-20.md).
  { slug: "imae1-dong", code: "4113560000", name: "이매1동", citySlug: "seongnam", legalDongs: ["이매동"] },
  { slug: "madu1-dong", code: "4128556000", name: "마두1동", citySlug: "goyang", legalDongs: ["마두동"] },
  { slug: "sinjeong2-dong", code: "1147063000", name: "신정2동", citySlug: "yangcheon", legalDongs: ["신정동"] },

  // 2026-10-20 전국 4차 batch — 학교는 전국 후보 목록에서 등록(scripts/official/school-import.ts --promote)
  // (docs/qa/national-dong-batch4-2026-10-20.md).
  { slug: "daeheung-dong", code: "1144060000", name: "대흥동", citySlug: "mapo", legalDongs: ["대흥동", "노고산동", "신수동"] },
  { slug: "sinsu-dong", code: "1144063000", name: "신수동", citySlug: "mapo", legalDongs: ["대흥동", "신수동", "현석동", "구수동", "신정동"] },
  { slug: "sangam-dong", code: "1144074000", name: "상암동", citySlug: "mapo", legalDongs: ["상암동"] },
  { slug: "deungchon3-dong", code: "1150053500", name: "등촌제3동", citySlug: "gangseo", legalDongs: ["등촌동"] },

  // 2026-10-21 전국 5차 batch — 학교는 전국 후보 목록에서 등록(scripts/official/school-import.ts --promote)
  // (docs/qa/national-dong-batch5-2026-10-21.md).
  { slug: "banghwa1-dong", code: "1150063000", name: "방화제1동", citySlug: "gangseo", legalDongs: ["마곡동", "공항동", "방화동"] },
  { slug: "seongsan1-dong", code: "1144072000", name: "성산제1동", citySlug: "mapo", legalDongs: ["성산동"] },
  { slug: "balsan1-dong", code: "1150061100", name: "발산제1동", citySlug: "gangseo", legalDongs: ["마곡동", "내발산동", "외발산동"] },

  // 2026-10-21 전국 6차 batch (docs/qa/national-dong-batch6-2026-10-21.md).
  { slug: "seohyeon1-dong", code: "4113558000", name: "서현1동", citySlug: "seongnam", legalDongs: ["율동", "서현동"] },
  { slug: "gwanyang-dong", code: "4117355200", name: "관양동", citySlug: "anyang", legalDongs: ["관양동"] },
  { slug: "deungchon2-dong", code: "1150053000", name: "등촌제2동", citySlug: "gangseo", legalDongs: ["등촌동"] },

  // 2026-10-23 전국 7차 batch (docs/qa/national-dong-batch7-2026-10-23.md). 잠실2동은 잠신중 표 해석이 불확실해 제외.
  { slug: "banghwa3-dong", code: "1150064100", name: "방화제3동", citySlug: "gangseo", legalDongs: ["마곡동", "방화동"] },
  { slug: "sinjeong3-dong", code: "1147064000", name: "신정3동", citySlug: "yangcheon", legalDongs: ["신정동"] },

  // 2026-10-23 전국 8차 batch (docs/qa/national-dong-batch8-2026-10-23.md).
  { slug: "pungnap2-dong", code: "1171052000", name: "풍납2동", citySlug: "songpa", legalDongs: ["풍납동"] },
  { slug: "mok5-dong", code: "1147055000", name: "목5동", citySlug: "yangcheon", legalDongs: ["목동"] },

  // 2026-10-23 전국 9차 batch (docs/qa/national-dong-batch9-2026-10-23.md).
  { slug: "sinwol3-dong", code: "1147058000", name: "신월3동", citySlug: "yangcheon", legalDongs: ["신월동"] },
  { slug: "seocho3-dong", code: "1165053000", name: "서초3동", citySlug: "seocho", legalDongs: ["방배동", "서초동"] },
  { slug: "yeomri-dong", code: "1144061000", name: "염리동", citySlug: "mapo", legalDongs: ["공덕동", "염리동"] },

  // 2026-10-26 전국 10차 batch (docs/qa/national-dong-batch10-2026-10-26.md).
  { slug: "daechi1-dong", code: "1168060000", name: "대치1동", citySlug: "gangnam", legalDongs: ["대치동"] },
  { slug: "segok-dong", code: "1168070000", name: "세곡동", citySlug: "gangnam", legalDongs: ["세곡동", "자곡동", "율현동"] },
  { slug: "oryun-dong", code: "1171056600", name: "오륜동", citySlug: "songpa", legalDongs: ["방이동"] },
  { slug: "wirye-dong", code: "1171064700", name: "위례동", citySlug: "songpa", legalDongs: ["장지동", "거여동"] },

  // 2026-10-26 전국 11차 batch (docs/qa/national-dong-batch11-2026-10-26.md).
  { slug: "ogeum-dong", code: "1171057000", name: "오금동", citySlug: "songpa", legalDongs: ["오금동"] },
  { slug: "jangji-dong", code: "1171064600", name: "장지동", citySlug: "songpa", legalDongs: ["문정동", "장지동"] },
  { slug: "jamsil2-dong", code: "1171067000", name: "잠실2동", citySlug: "songpa", legalDongs: ["잠실동"] },

  // 2026-10-26 전국 12차 batch (docs/qa/national-dong-batch12-2026-10-26.md).
  { slug: "dogok2-dong", code: "1168065600", name: "도곡2동", citySlug: "gangnam", legalDongs: ["도곡동"] },
  { slug: "gaepo2-dong", code: "1168067000", name: "개포2동", citySlug: "gangnam", legalDongs: ["개포동", "일원동"] },

  // 2026-10-26 전국 13차 batch (docs/qa/national-dong-batch13-2026-10-26.md).
  { slug: "bangbae3-dong", code: "1165062000", name: "방배3동", citySlug: "seocho", legalDongs: ["방배동"] },
  { slug: "banpo1-dong", code: "1165056000", name: "반포1동", citySlug: "seocho", legalDongs: ["반포동"] },
  { slug: "cheongdam-dong", code: "1168056500", name: "청담동", citySlug: "gangnam", legalDongs: ["청담동"] },

  // 2026-10-26 전국 14차 batch (docs/qa/national-dong-batch14-2026-10-26.md).
  { slug: "gayang3-dong", code: "1150060500", name: "가양제3동", citySlug: "gangseo", legalDongs: ["가양동"] },
  { slug: "ahyeon-dong", code: "1144055500", name: "아현동", citySlug: "mapo", legalDongs: ["아현동", "공덕동", "염리동"] },
  { slug: "sinjeong4-dong", code: "1147065000", name: "신정4동", citySlug: "yangcheon", legalDongs: ["신정동"] },

  // 2026-10-26 전국 15차 batch (docs/qa/national-dong-batch15-2026-10-26.md).
  { slug: "bangbae4-dong", code: "1165062100", name: "방배4동", citySlug: "seocho", legalDongs: ["방배동"] },

  // 2026-10-26 전국 16차 batch (docs/qa/national-dong-batch16-2026-10-26.md).
  { slug: "sang-dong", code: "4119267000", name: "상동", citySlug: "bucheon", legalDongs: ["상동"] },

  // 2026-10-27 전국 17차 batch (docs/qa/national-dong-batch17-2026-10-27.md).
  { slug: "hwagok4-dong", code: "1150057000", name: "화곡제4동", citySlug: "gangseo", legalDongs: ["화곡동"] },
  { slug: "gayang1-dong", code: "1150060300", name: "가양제1동", citySlug: "gangseo", legalDongs: ["등촌동", "가양동", "마곡동"] },
  { slug: "banpo3-dong", code: "1165058000", name: "반포3동", citySlug: "seocho", legalDongs: ["잠원동"] },

  // 2026-10-27 전국 18차 batch (docs/qa/national-dong-batch18-2026-10-27.md).
  { slug: "gaepo1-dong", code: "1168066000", name: "개포1동", citySlug: "gangnam", legalDongs: ["개포동"] },
  { slug: "samseong1-dong", code: "1168058000", name: "삼성1동", citySlug: "gangnam", legalDongs: ["삼성동"] },
  { slug: "hwajeong1-dong", code: "4128162100", name: "화정1동", citySlug: "goyang", legalDongs: ["화정동"] },

  // 2026-10-27 전국 19차 batch (docs/qa/national-dong-batch19-2026-10-27.md).
  { slug: "yeoksam2-dong", code: "1168065000", name: "역삼2동", citySlug: "gangnam", legalDongs: ["역삼동"] },
  { slug: "yeomchang-dong", code: "1150051000", name: "염창동", citySlug: "gangseo", legalDongs: ["염창동", "가양동"] },
  { slug: "gwangyo-dong", code: "2817770000", name: "관교동", citySlug: "michuhol", legalDongs: ["관교동"] },
  // 2026-10-27 전국 20차 batch (docs/qa/national-dong-batch20-2026-10-27.md).
  { slug: "yonghyeon5-dong", code: "2817757000", name: "용현5동", citySlug: "michuhol", legalDongs: ["용현동"] },
  { slug: "songdo1-dong", code: "2818582000", name: "송도1동", citySlug: "yeonsu", legalDongs: ["송도동"] },
  { slug: "galsan-dong", code: "4117363000", name: "갈산동", citySlug: "anyang", legalDongs: ["호계동"] },
  // 2026-10-27 전국 21차 batch (docs/qa/national-dong-batch21-2026-10-27.md).
  { slug: "suseo-dong", code: "1168075000", name: "수서동", citySlug: "gangnam", legalDongs: ["수서동"] },
  { slug: "seocho2-dong", code: "1165052000", name: "서초2동", citySlug: "seocho", legalDongs: ["서초동"] },
  // 2026-10-27 전국 22차 batch (docs/qa/national-dong-batch22-2026-10-27.md).
  { slug: "sinsa-dong", code: "1168051000", name: "신사동", citySlug: "gangnam", legalDongs: ["신사동", "압구정동"] },
  { slug: "gyesan4-dong", code: "2824561400", name: "계산4동", citySlug: "gyeyang", legalDongs: ["계산동", "용종동"] },
  { slug: "yeonsu3-dong", code: "2818576300", name: "연수3동", citySlug: "yeonsu", legalDongs: ["연수동"] },
  // 2026-10-27 전국 23차 batch (docs/qa/national-dong-batch23-2026-10-27.md).
  { slug: "songdo3-dong", code: "2818584000", name: "송도3동", citySlug: "yeonsu", legalDongs: ["송도동"] },
  { slug: "bugae3-dong", code: "2823766100", name: "부개3동", citySlug: "bupyeong", legalDongs: ["부개동"] },
  { slug: "gyeyang2-dong", code: "2824572000", name: "계양2동", citySlug: "gyeyang", legalDongs: ["방축동", "병방동", "용종동", "임학동"] },
  // 2026-10-27 전국 24차 batch (docs/qa/national-dong-batch24-2026-10-27.md).
  { slug: "seongnam-dong", code: "4113351000", name: "성남동", citySlug: "seongnam", legalDongs: ["성남동"] },
  { slug: "jung2-dong", code: "4119264000", name: "중2동", citySlug: "bucheon", legalDongs: ["중동"] },
  // 2026-11-02 전국 25차 batch = 광역시 pilot (첫 울산·대전 동, docs/qa/national-school-expansion-readiness-2026-11-02.md).
  { slug: "mugeo-dong", code: "3114059500", name: "무거동", citySlug: "ulsan-nam", legalDongs: ["무거동"] },
  {
    slug: "sinseong-dong",
    code: "3020055000",
    name: "신성동",
    citySlug: "daejeon-yuseong",
    legalDongs: ["신성동", "가정동", "도룡동", "장동", "방현동", "화암동", "덕진동", "하기동", "추목동", "자운동", "신봉동"],
  },
  // 2026-11-02 26차 batch = 부산·대구 pilot (첫 부산·대구 동, docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "hadan2-dong", code: "2638056200", name: "하단제2동", citySlug: "busan-saha", legalDongs: ["하단동"] },
  { slug: "beomeo4-dong", code: "2726054000", name: "범어4동", citySlug: "daegu-suseong", legalDongs: ["범어동"] },
  // 2026-11-02 27차 batch = 경남·강원 pilot (첫 창원·원주 동, docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "bongam-dong", code: "4812762000", name: "봉암동", citySlug: "changwon", legalDongs: ["봉암동", "양덕동"] },
  { slug: "bangokgwanseol-dong", code: "5113067500", name: "반곡관설동", citySlug: "wonju", legalDongs: ["관설동", "반곡동"] },
  // 2026-11-02 29차 전북 전주 완산구 노송동(전주고·전주신일중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "nosong-dong", code: "5211160500", name: "노송동", citySlug: "jeonju", legalDongs: ["중노송동", "남노송동", "서노송동"] },
  // 2026-11-02 29차 경북 안동 서구동(안동여고·경안여중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "seogu-dong", code: "4717058500", name: "서구동", citySlug: "andong", legalDongs: ["안흥동", "대석동", "옥야동", "광석동", "당북동", "화성동", "법상동", "금곡동"] },
  // 2026-11-02 28차 충북 청주 상당구 탑대성동(일신여고·일신여중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "tapdaeseong-dong", code: "4311162000", name: "탑대성동", citySlug: "cheongju", legalDongs: ["탑동", "대성동"] },
  // 2026-11-02 28차 충남 천안 동남구 병천면(병천고·병천중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "byeongcheon-myeon", code: "4413136000", name: "병천면", citySlug: "cheonan", legalDongs: ["병천면", "가전리", "병천리", "탑원리", "도원리", "매성리", "관성리", "봉항리", "용두리", "송정리"] },
  // 2026-11-03 Batch 30 제주 한림읍(한림고·한림항공우주고·한림여중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "hanrim-eup", code: "5011025000", name: "한림읍", citySlug: "jeju-si", legalDongs: ["한림읍", "귀덕리", "수원리", "대림리", "한림리", "금악리", "동명리", "명월리", "옹포리", "상대리", "상명리", "협재리", "월령리", "금능리", "월림리", "한수리"] },
  // 2026-11-03 Batch 30 청주 금천동(금천고·금천중·청주동중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "geumcheon-dong", code: "4311168000", name: "금천동", citySlug: "cheongju", legalDongs: ["금천동"] },
  // 2026-11-03 Batch 30 천안 원성1동(천안중앙고·천안중·천성중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "wonseong1-dong", code: "4413153000", name: "원성1동", citySlug: "cheonan", legalDongs: ["문화동", "원성동", "유량동"] },
  // 2026-11-03 Batch 30 전주 평화1동(완산여고·전주남중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "pyeonghwa1-dong", code: "5211169100", name: "평화1동", citySlug: "jeonju", legalDongs: ["평화동1가"] },
  // 2026-11-03 Batch 30 영주 영주1동(영광여고·영광여중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "yeongju1-dong", code: "4721055000", name: "영주1동", citySlug: "yeongju", legalDongs: ["영주동", "하망동"] },
  // 2026-11-05 Batch 31 영천 금호읍(포은고·금호여중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "geumho-eup", code: "4723025000", name: "금호읍", citySlug: "yeongcheon", legalDongs: ["금호읍", "교대리", "덕성리", "성천리", "대미리", "석섬리", "원제리", "냉천리", "신월리", "봉죽리", "관정리", "구암리", "약남리", "대곡리", "호남리", "어은리", "오계리", "원기리", "신대리", "남성리", "삼호리", "황정리"] },
  // 2026-11-05 Batch 31 아산 온양5동(온양용화고·온양중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "onyang5-dong", code: "4420061000", name: "온양5동", citySlug: "asan", legalDongs: ["기산동", "초사동", "신인동", "용화동", "점양동"] },
  // 2026-11-05 Batch 31 청주 옥산면(양업고·옥산중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "oksan-myeon", code: "4311332000", name: "옥산면", citySlug: "cheongju", legalDongs: ["옥산면", "오산리", "덕촌리", "신촌리", "환희리", "가락리", "동림리", "금계리", "장동리", "사정리", "수락리", "장남리", "호죽리", "남촌리", "소로리", "국사리"] },
  // 2026-11-05 Batch 32 제주 조천읍(함덕고·함덕중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "jocheon-eup", code: "5011025900", name: "조천읍", citySlug: "jeju-si", legalDongs: ["조천읍", "신촌리", "와흘리", "조천리", "함덕리", "신흥리", "대흘리", "북촌리", "와산리", "교래리", "선흘리"] },
  // 2026-11-05 Batch 32 제주 애월읍(제주외고·애월중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "aewol-eup", code: "5011025300", name: "애월읍", citySlug: "jeju-si", legalDongs: ["애월읍", "용흥리", "중엄리", "어음1리", "어음2리", "귀일리", "어도리", "동귀리", "광령리", "상귀리", "구엄리", "수산리", "신엄리", "장전리", "소길리", "고성리", "하가리", "상가리", "고내리", "애월리", "납읍리", "어음리", "곽지리", "금성리", "봉성리", "하귀1리", "하귀2리", "유수암리", "광령1리", "광령2리", "광령3리"] },
  // 2026-11-05 Batch 33 울산 남구 신정2동(울산여고·학성중) (docs/qa/national-school-content-expansion-2026-11-02.md).
  { slug: "sinjeong2-dong", code: "3114052000", name: "신정2동", citySlug: "ulsan-nam", legalDongs: ["신정동"] },
  // 2026-11-06 Batch 34 대구 달서구 도원동 · 부산 동래구 사직제2동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "dowon-dong", code: "2729062800", name: "도원동", citySlug: "daegu-dalseo", legalDongs: ["도원동"] },
  { slug: "sajik2-dong", code: "2626059000", name: "사직제2동", citySlug: "busan-dongnae", legalDongs: ["사직동"] },
  // 2026-11-06 Batch 35 전국 확장 10개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "ara-dong", code: "5011063000", name: "아라동", citySlug: "jeju-si", legalDongs: ["아라일동", "아라이동", "오등동", "월평동", "영평동"] },
  { slug: "hangyeong-myeon", code: "5011031000", name: "한경면", citySlug: "jeju-si", legalDongs: ["한경면", "청수리", "용수리", "고산리", "판포리", "금등리", "조수리", "두모리", "신창리", "낙천리", "저지리", "산양리", "한원리", "용당리"] },
  { slug: "burim-dong", code: "4117356600", name: "부림동", citySlug: "anyang", legalDongs: ["관양동"] },
  { slug: "tangjeong-myeon", code: "4420033000", name: "탕정면", citySlug: "asan", legalDongs: ["탕정면", "용두리", "명암리", "동산리", "호산리", "매곡리", "갈산리"] },
  { slug: "ojeong-dong", code: "4119656000", name: "오정동", citySlug: "bucheon", legalDongs: ["오정동", "대장동"] },
  { slug: "mochung-dong", code: "4311254000", name: "모충동", citySlug: "cheongju", legalDongs: ["모충동"] },
  { slug: "daehyeon-dong", code: "3114062500", name: "대현동", citySlug: "ulsan-nam", legalDongs: ["야음동"] },
  { slug: "sinbong-dong", code: "4146553000", name: "신봉동", citySlug: "yongin", legalDongs: ["신봉동"] },
  { slug: "hupyeong2-dong", code: "5111061000", name: "후평2동", citySlug: "chuncheon", legalDongs: ["후평동"] },
  { slug: "yeonil-eup", code: "4711125300", name: "연일읍", citySlug: "pohang", legalDongs: ["연일읍", "생지리", "괴정리", "동문리", "오천리", "유강리", "자명리", "학전리", "달전리", "중명리", "중단리", "택전리", "인주리", "우복리"] },
  // 2026-11-06 Batch 36 전국 확장 8개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "seongsan2-dong", code: "1144073000", name: "성산제2동", citySlug: "mapo", legalDongs: ["성산동", "중동"] },
  { slug: "mok4-dong", code: "1147054000", name: "목4동", citySlug: "yangcheon", legalDongs: ["목동"] },
  { slug: "yeon-dong", code: "5011065000", name: "연동", citySlug: "jeju-si", legalDongs: ["연동"] },
  { slug: "hwabuk-dong", code: "5011060000", name: "화북동", citySlug: "jeju-si", legalDongs: ["화북일동", "화북이동"] },
  { slug: "ok-dong", code: "3114060000", name: "옥동", citySlug: "ulsan-nam", legalDongs: ["옥동", "두왕동"] },
  { slug: "samsan-dong", code: "3114057000", name: "삼산동", citySlug: "ulsan-nam", legalDongs: ["달동", "삼산동"] },
  { slug: "munseong-dong", code: "4413152000", name: "문성동", citySlug: "cheonan", legalDongs: ["성황동", "문화동", "원성동"] },
  { slug: "musil-dong", code: "5113066000", name: "무실동", citySlug: "wonju", legalDongs: ["단계동", "무실동"] },
  // 2026-11-06 Batch 37 전국 확장 24개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "munmudaewang-myeon", code: "4713031500", name: "문무대왕면", citySlug: "gyeongju", legalDongs: ["문무대왕면", "어일리", "입천리", "두산리", "송전리", "죽전리", "구길리", "용당리", "봉길리", "권이리", "호암리", "용동리", "와읍리", "안동리", "장항리", "범곡리"] },
  { slug: "pungsan-eup", code: "4717025000", name: "풍산읍", citySlug: "andong", legalDongs: ["풍산읍", "안교리", "상리리", "하리리", "마애리", "수리", "회곡리", "계평리", "막곡리", "수곡리", "노리", "죽전리", "만운리", "서미리", "신양리", "현애리", "오미리", "괴정리", "매곡리", "소산리"] },
  { slug: "songha-dong", code: "4717066000", name: "송하동", citySlug: "andong", legalDongs: ["노하동", "송현동"] },
  { slug: "dunpo-myeon", code: "4420036000", name: "둔포면", citySlug: "asan", legalDongs: ["둔포면", "둔포리", "송용리", "시포리", "신법리", "신남리", "신항리", "관대리", "산전리", "신양리", "봉재리", "운교리", "석곡리", "운용리", "신왕리", "염작리"] },
  { slug: "onyang3-dong", code: "4420059000", name: "온양3동", citySlug: "asan", legalDongs: ["모종동", "권곡동", "신동"] },
  { slug: "yeokgok1-dong", code: "4119257000", name: "역곡1동", citySlug: "bucheon", legalDongs: ["역곡동"] },
  { slug: "bongmyeong-dong", code: "4413155000", name: "봉명동", citySlug: "cheonan", legalDongs: ["봉명동", "쌍용동"] },
  { slug: "gyo-dong", code: "5111052000", name: "교동", citySlug: "chuncheon", legalDongs: ["교동"] },
  { slug: "seonsan-eup", code: "4719025000", name: "선산읍", citySlug: "gumi", legalDongs: ["선산읍", "완전리", "동부리", "노상리", "이문리", "죽장리", "내고리", "북산리", "습례리", "교리", "화조리", "원리", "독동리", "생곡리", "신기리", "봉곡리", "포상리", "소재리", "봉남리"] },
  { slug: "jinryang-eup", code: "4729025300", name: "진량읍", citySlug: "gyeongsan", legalDongs: ["진량읍", "신상리", "선화리", "보인리", "봉회리", "북리", "부기리", "양기리", "상림리", "내리리", "문천리", "평사리(坪沙)", "평사리(平沙)", "다문리", "아사리", "시문리", "현내리", "마곡리", "광석리", "신제리", "대원리", "속초리", "안촌리", "황제리", "당곡리", "가야리"] },
  // Batch 37 추가 14개 동 (같은 기준)
  { slug: "buldang2-dong", code: "4413356700", name: "불당2동", citySlug: "cheonan", legalDongs: ["불당동"] },
  { slug: "bongmyeong2songjeong-dong", code: "4311375600", name: "봉명2.송정동", citySlug: "cheongju", legalDongs: ["봉명동", "송정동"] },
  { slug: "dong-myeon", code: "5111031000", name: "동면", citySlug: "chuncheon", legalDongs: ["동면", "지내리", "만천리", "장학리", "감정리", "월곡리", "품안리", "품걸리", "신이리", "평촌리", "상걸리"] },
  { slug: "sandong-eup", code: "4719025600", name: "산동읍", citySlug: "gumi", legalDongs: ["산동읍", "동곡리", "도중리", "적림리", "성수리", "신당리", "봉산리", "임천리", "인덕리", "백현리", "송산리"] },
  { slug: "seobu1-dong", code: "4729054100", name: "서부1동", citySlug: "gyeongsan", legalDongs: ["옥곡동", "사정동", "옥산동"] },
  { slug: "dongbu-dong", code: "4729056000", name: "동부동", citySlug: "gyeongsan", legalDongs: ["계양동", "남방동", "내동", "여천동", "유곡동", "신천동", "점촌동", "평산동", "사동", "삼풍동"] },
  { slug: "pungnam-dong", code: "5211153000", name: "풍남동", citySlug: "jeonju", legalDongs: ["경원동1가", "경원동2가", "경원동3가", "풍남동1가", "풍남동2가", "풍남동3가", "전동", "전동3가", "교동"] },
  { slug: "junghwasan1-dong", code: "5211167100", name: "중화산1동", citySlug: "jeonju", legalDongs: ["중화산동1가", "중화산동2가"] },
  { slug: "inhu3-dong", code: "5211356000", name: "인후3동", citySlug: "jeonju", legalDongs: ["인후동1가"] },
  { slug: "guryongpo-eup", code: "4711125000", name: "구룡포읍", citySlug: "pohang", legalDongs: ["구룡포읍", "구룡포리", "삼정리", "석병리", "성동리", "구평리", "장길리", "하정리", "병포리", "후동리", "눌태리"] },
  { slug: "daei-dong", code: "4711159000", name: "대이동", citySlug: "pohang", legalDongs: ["대잠동", "이동"] },
  { slug: "usan-dong", code: "5113060000", name: "우산동", citySlug: "wonju", legalDongs: ["우산동", "가현동"] },
  { slug: "hyucheon1-dong", code: "4721059000", name: "휴천1동", citySlug: "yeongju", legalDongs: ["휴천동"] },
  { slug: "gaheung2-dong", code: "4721063000", name: "가흥2동", citySlug: "yeongju", legalDongs: ["가흥동", "고현동", "창진동", "상줄동", "아지동"] },
  // 2026-11-09 Batch 38 전국 확장 10개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "gagyeong-dong", code: "4311374700", name: "가경동", citySlug: "cheongju", legalDongs: ["가경동"] },
  { slug: "wonsinheung-dong", code: "3020061000", name: "원신흥동", citySlug: "daejeon-yuseong", legalDongs: ["봉명동", "원신흥동"] },
  { slug: "yurim2-dong", code: "4146153600", name: "유림2동", citySlug: "yongin", legalDongs: ["유방동", "고림동"] },
  { slug: "gwanpyeong-dong", code: "3020060000", name: "관평동", citySlug: "daejeon-yuseong", legalDongs: ["탑립동", "용산동", "관평동"] },
  { slug: "ochang-eup", code: "4311425300", name: "오창읍", citySlug: "cheongju", legalDongs: ["오창읍", "여천리", "화산리(華山)", "유리", "일신리", "모정리", "학소리", "원리", "복현리", "양지리", "장대리", "창리", "주성리", "송대리", "도암리", "괴정리", "가곡리", "석우리", "상평리", "기암리", "탑리", "농소리", "신평리", "중신리", "각리", "양청리", "구룡리", "성산리", "후기리", "용두리", "화산리(花山)", "가좌리", "두릉리", "성재리", "백현리"] },
  { slug: "yulryangsacheon-dong", code: "4311454000", name: "율량.사천동", citySlug: "cheongju", legalDongs: ["율량동", "사천동"] },
  { slug: "seongdang-dong", code: "2729051500", name: "성당동", citySlug: "daegu-dalseo", legalDongs: ["성당동"] },
  { slug: "bunpyeong-dong", code: "4311256000", name: "분평동", citySlug: "cheongju", legalDongs: ["미평동", "분평동", "장성동", "장암동"] },
  { slug: "myeongryun-dong", code: "2626054500", name: "명륜동", citySlug: "busan-dongnae", legalDongs: ["명륜동"] },
  { slug: "manchon1-dong", code: "2726055000", name: "만촌1동", citySlug: "daegu-suseong", legalDongs: ["만촌동"] },
  // 2026-11-09 Batch 39 전국 확장 10개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "jangrim2-dong", code: "2638059000", name: "장림제2동", citySlug: "busan-saha", legalDongs: ["장림동"] },
  { slug: "myeongjang2-dong", code: "2626076200", name: "명장제2동", citySlug: "busan-dongnae", legalDongs: ["명장동"] },
  { slug: "yongsan2-dong", code: "2729057200", name: "용산2동", citySlug: "daegu-dalseo", legalDongs: ["장기동", "용산동"] },
  { slug: "noeun2-dong", code: "3020054700", name: "노은2동", citySlug: "daejeon-yuseong", legalDongs: ["지족동", "죽동", "하기동", "수남동", "안산동", "외삼동", "반석동"] },
  { slug: "noeun3-dong", code: "3020054800", name: "노은3동", citySlug: "daejeon-yuseong", legalDongs: ["지족동", "반석동"] },
  { slug: "jung4-dong", code: "4119266000", name: "중4동", citySlug: "bucheon", legalDongs: ["중동"] },
  { slug: "jungang-dong", code: "4146151000", name: "중앙동", citySlug: "yongin", legalDongs: ["김량장동", "남동"] },
  { slug: "idong-eup", code: "4146125600", name: "이동읍", citySlug: "yongin", legalDongs: ["이동읍", "송전리", "어비리", "묘봉리", "화산리", "시미리", "덕성리", "묵리", "천리", "서리"] },
  { slug: "osong-eup", code: "4311325000", name: "오송읍", citySlug: "cheongju", legalDongs: ["오송읍", "호계리", "상정리", "공북리", "쌍청리", "만수리", "연제리", "궁평리", "오송리", "동평리", "서평리", "봉산리", "정중리", "상봉리"] },
  { slug: "cheongryong-dong", code: "4413158000", name: "청룡동", citySlug: "cheonan", legalDongs: ["구성동", "청수동", "삼룡동", "청당동", "구룡동"] },
  // 2026-11-09 Batch 40 전국 확장 10개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "gamcheon1-dong", code: "2638062000", name: "감천제1동", citySlug: "busan-saha", legalDongs: ["감천동"] },
  { slug: "jung1-dong", code: "4119263000", name: "중1동", citySlug: "bucheon", legalDongs: ["중동"] },
  { slug: "duryu12-dong", code: "2729053500", name: "두류1.2동", citySlug: "daegu-dalseo", legalDongs: ["두류동"] },
  { slug: "oncheon2-dong", code: "3020054000", name: "온천2동", citySlug: "daejeon-yuseong", legalDongs: ["장대동", "노은동", "죽동", "궁동", "어은동", "구성동"] },
  { slug: "jungang-dong", code: "4311152500", name: "중앙동", citySlug: "cheongju", legalDongs: ["영동", "북문로2가", "북문로3가", "수동"] },
  { slug: "sanghyeon3-dong", code: "4146558500", name: "상현3동", citySlug: "yongin", legalDongs: ["상현동"] },
  { slug: "hwajeong2-dong", code: "4128162200", name: "화정2동", citySlug: "goyang", legalDongs: ["화정동"] },
  { slug: "bokdae1-dong", code: "4311374100", name: "복대1동", citySlug: "cheongju", legalDongs: ["복대동"] },
  { slug: "gujeuk-dong", code: "3020058000", name: "구즉동", citySlug: "daejeon-yuseong", legalDongs: ["봉산동", "송강동", "금고동", "대동", "금탄동", "신동", "둔곡동", "구룡동"] },
  { slug: "jeonmin-dong", code: "3020057000", name: "전민동", citySlug: "daejeon-yuseong", legalDongs: ["문지동", "전민동", "원촌동"] },
  // 2026-11-09 Batch 41 전국 확장 18개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "mohyeon-eup", code: "4146125300", name: "모현읍", citySlug: "yongin", legalDongs: ["모현읍", "왕산리", "갈담리", "초부리", "일산리", "매산리", "동림리", "능원리", "오산리"] },
  { slug: "sangok1-dong", code: "2823757000", name: "산곡1동", citySlug: "bupyeong", legalDongs: ["산곡동"] },
  { slug: "bupyeong1-dong", code: "2823751000", name: "부평1동", citySlug: "bupyeong", legalDongs: ["부평동"] },
  { slug: "byeongmokan-dong", code: "4117158300", name: "병목안동", citySlug: "anyang", legalDongs: ["안양동"] },
  { slug: "hyeondo-myeon", code: "4311232000", name: "현도면", citySlug: "cheongju", legalDongs: ["현도면", "상삼리", "중삼리", "죽전리", "우록리", "시동리", "선동리", "시목리", "중척리", "하석리", "노산리", "달계리", "매봉리", "양지리", "죽암리"] },
  { slug: "songdo4-dong", code: "2818585000", name: "송도4동", citySlug: "yeonsu", legalDongs: ["송도동"] },
  { slug: "wolseong1-dong", code: "2729060100", name: "월성1동", citySlug: "daegu-dalseo", legalDongs: ["대천동", "월성동", "월암동"] },
  { slug: "sinjeong3-dong", code: "3114053000", name: "신정3동", citySlug: "ulsan-nam", legalDongs: ["신정동"] },
  { slug: "hwajeon-dong", code: "4128166000", name: "화전동", citySlug: "goyang", legalDongs: ["화전동", "덕은동", "향동동"] },
  { slug: "dadae2-dong", code: "2638060200", name: "다대제2동", citySlug: "busan-saha", legalDongs: ["다대동"] },
  { slug: "yongsan1-dong", code: "2729057100", name: "용산1동", citySlug: "daegu-dalseo", legalDongs: ["장기동", "용산동"] },
  { slug: "mokcheon-eup", code: "4413125000", name: "목천읍", citySlug: "cheonan", legalDongs: ["목천읍", "서리", "동리", "교촌리", "서흥리", "덕전리", "송전리", "석천리", "동평리", "운전리", "남화리", "지산리", "교천리", "신계리", "천정리", "응원리", "삼성리", "도장리", "소사리"] },
  { slug: "hyoseong1-dong", code: "2824560100", name: "효성1동", citySlug: "gyeyang", legalDongs: ["효성동"] },
  { slug: "dadae1-dong", code: "2638060100", name: "다대제1동", citySlug: "busan-saha", legalDongs: ["다대동"] },
  { slug: "oncheon3-dong", code: "2626057000", name: "온천제3동", citySlug: "busan-dongnae", legalDongs: ["온천동"] },
  { slug: "bonri-dong", code: "2729059000", name: "본리동", citySlug: "daegu-dalseo", legalDongs: ["본리동"] },
  { slug: "igok1-dong", code: "2729057600", name: "이곡1동", citySlug: "daegu-dalseo", legalDongs: ["갈산동", "이곡동"] },
  { slug: "noeun1-dong", code: "3020054600", name: "노은1동", citySlug: "daejeon-yuseong", legalDongs: ["장대동", "갑동", "노은동", "지족동", "죽동"] },
  // 2026-11-09 Batch 42 전국 확장 16개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "bijeon1-dong", code: "4122062000", name: "비전1동", citySlug: "pyeongtaek", legalDongs: ["비전동", "월곡동", "청룡동", "죽백동"] },
  { slug: "hwaseo2-dong", code: "4111569000", name: "화서2동", citySlug: "suwon", legalDongs: ["화서동"] },
  { slug: "beomseo-eup", code: "3171025900", name: "범서읍", citySlug: "ulsan-ulju", legalDongs: ["범서읍", "사연리", "천상리", "입암리", "굴화리", "서사리", "두산리", "구영리", "중리", "망성리", "척과리"] },
  { slug: "dongsam1-dong", code: "2620065000", name: "동삼제1동", citySlug: "busan-yeongdo", legalDongs: ["동삼동"] },
  { slug: "soheul-eup", code: "4165025000", name: "소흘읍", citySlug: "pocheon", legalDongs: ["소흘읍", "송우리", "이동교리", "무림리", "이곡리", "직동리", "고모리", "이가팔리", "초가팔리", "무봉리"] },
  { slug: "hyangnam-eup", code: "4159125300", name: "향남읍", citySlug: "hwaseong", legalDongs: ["향남읍", "평리", "발안리", "제암리", "상신리", "구문천리", "하길리", "화리현리", "상두리", "백토리", "길성리", "요리", "수직리", "갈천리", "증거리", "송곡리", "동오리", "관리", "도이리", "행정리", "방축리", "장짐리"] },
  { slug: "jincheon-eup", code: "4375025000", name: "진천읍", citySlug: "jincheon", legalDongs: ["진천읍", "교성리", "신정리", "원덕리", "읍내리", "성석리", "벽암리", "행정리", "장관리", "건송리", "지암리", "사석리", "문봉리", "상계리", "금암리", "연곡리", "삼덕리", "송두리", "가산리", "상신리", "산척리"] },
  { slug: "mok-dong", code: "3014055000", name: "목동", citySlug: "daejeon-jung", legalDongs: ["목동"] },
  { slug: "gwanjeo2-dong", code: "3017059700", name: "관저2동", citySlug: "daejeon-seo", legalDongs: ["관저동"] },
  { slug: "anjung-eup", code: "4122025300", name: "안중읍", citySlug: "pyeongtaek", legalDongs: ["안중읍", "안중리", "학현리", "금곡리", "대반리", "삼정리", "용성리", "덕우리", "성해리", "송담리", "현화리"] },
  { slug: "eunhaeng-dong", code: "4139054000", name: "은행동", citySlug: "siheung", legalDongs: ["은행동", "안현동"] },
  { slug: "bokhyeon2-dong", code: "2723067200", name: "복현2동", citySlug: "daegu-buk", legalDongs: ["복현동"] },
  { slug: "pyeongri3-dong", code: "2717064000", name: "평리3동", citySlug: "daegu-seo", legalDongs: ["평리동"] },
  { slug: "daebang-dong", code: "1159066000", name: "대방동", citySlug: "dongjak", legalDongs: ["대방동"] },
  { slug: "samseong-dong", code: "3011069500", name: "삼성동", citySlug: "daejeon-dong", legalDongs: ["삼성동"] },
  { slug: "daeheung-dong", code: "3014057500", name: "대흥동", citySlug: "daejeon-jung", legalDongs: ["대흥동"] },
  // 2026-11-09 Batch 43 전국 확장 18개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "anseong3-dong", code: "4155053000", name: "안성3동", citySlug: "anseong", legalDongs: ["금산동", "연지동", "대천동", "금석동", "사곡동", "당왕동", "신건지동", "신소현동", "신모산동"] },
  { slug: "hoamjik-dong", code: "4313058000", name: "호암.직동", citySlug: "chungju", legalDongs: ["호암동", "직동"] },
  { slug: "bijeon2-dong", code: "4122063000", name: "비전2동", citySlug: "pyeongtaek", legalDongs: ["비전동", "소사동", "용이동"] },
  { slug: "yaksa-dong", code: "3111064000", name: "약사동", citySlug: "ulsan-jung", legalDongs: ["약사동"] },
  { slug: "nongso1-dong", code: "3120051000", name: "농소1동", citySlug: "ulsan-buk", legalDongs: ["창평동", "호계동", "매곡동", "신천동"] },
  { slug: "saengyeon1-dong", code: "4125051000", name: "생연1동", citySlug: "dongducheon", legalDongs: ["생연동"] },
  { slug: "junghwa1-dong", code: "1126060000", name: "중화제1동", citySlug: "jungnang", legalDongs: ["중화동"] },
  { slug: "sangil1-dong", code: "1174052500", name: "상일제1동", citySlug: "gangdong", legalDongs: ["상일동"] },
  { slug: "hyehwa-dong", code: "1111065000", name: "혜화동", citySlug: "jongno", legalDongs: ["와룡동", "혜화동", "명륜1가", "명륜2가", "명륜4가", "명륜3가"] },
  { slug: "munhwa1-dong", code: "3014072000", name: "문화1동", citySlug: "daejeon-jung", legalDongs: ["문화동"] },
  { slug: "mangubon-dong", code: "1126065500", name: "망우본동", citySlug: "jungnang", legalDongs: ["망우동"] },
  { slug: "jeungpo-dong", code: "4150051500", name: "증포동", citySlug: "icheon", legalDongs: ["안흥동", "갈산동", "증포동", "송정동"] },
  { slug: "jeungpyeong-eup", code: "4374525000", name: "증평읍", citySlug: "jeungpyeong", legalDongs: ["증평읍", "증평리", "교동리", "중동리", "대동리", "신동리", "창동리", "장동리", "증천리", "내성리", "초중리", "연탄리", "송산리", "미암리", "사곡리", "용강리", "덕상리", "남차리", "율리", "죽리", "남하리"] },
  { slug: "gayang2-dong", code: "3011063000", name: "가양2동", citySlug: "daejeon-dong", legalDongs: ["가양동"] },
  { slug: "galhyeon2-dong", code: "1138055200", name: "갈현제2동", citySlug: "eunpyeong", legalDongs: ["갈현동"] },
  { slug: "sugung-dong", code: "1153079000", name: "수궁동", citySlug: "guro", legalDongs: ["궁동", "온수동"] },
  { slug: "doksan1-dong", code: "1154561000", name: "독산제1동", citySlug: "geumcheon", legalDongs: ["독산동"] },
  { slug: "dunnae-myeon", code: "5173033000", name: "둔내면", citySlug: "hoengseong", legalDongs: ["둔내면", "현천리", "둔방내리", "영랑리", "조항리", "우용리", "두원리", "자포곡리", "석문리", "삽교리", "마암리", "화동리", "궁종리", "태기리"] },
  // 2026-11-09 Batch 44 전국 확장 17개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "jeongja3-dong", code: "4111157300", name: "정자3동", citySlug: "suwon", legalDongs: ["정자동", "천천동"] },
  { slug: "nammok2-dong", code: "3117059000", name: "남목2동", citySlug: "ulsan-dong", legalDongs: ["서부동"] },
  { slug: "nongso2-dong", code: "3120052000", name: "농소2동", citySlug: "ulsan-buk", legalDongs: ["매곡동", "신천동", "중산동"] },
  { slug: "gwangtan-myeon", code: "4148035000", name: "광탄면", citySlug: "paju", legalDongs: ["광탄면", "분수리", "방축리", "마장리", "발랑리", "창만리", "용미리", "신산리", "기산리", "영장리"] },
  { slug: "guam-dong", code: "2723074500", name: "구암동", citySlug: "daegu-buk", legalDongs: ["구암동"] },
  { slug: "nonhyeongojan-dong", code: "2820071000", name: "논현고잔동", citySlug: "namdong", legalDongs: ["논현동", "고잔동"] },
  { slug: "daesong-dong", code: "3117054000", name: "대송동", citySlug: "ulsan-dong", legalDongs: ["화정동"] },
  { slug: "gungnae-dong", code: "4141060000", name: "궁내동", citySlug: "gunpo", legalDongs: ["산본동"] },
  { slug: "paju-eup", code: "4148025300", name: "파주읍", citySlug: "paju", legalDongs: ["파주읍", "봉서리", "향양리", "부곡리", "봉암리", "백석리", "파주리", "연풍리"] },
  { slug: "u1-dong", code: "2635051000", name: "우제1동", citySlug: "busan-haeundae", legalDongs: ["우동"] },
  { slug: "seodaesin3-dong", code: "2614056000", name: "서대신제3동", citySlug: "busan-seo", legalDongs: ["서대신동3가"] },
  { slug: "jeonggwan-eup", code: "2671025600", name: "정관읍", citySlug: "busan-gijang", legalDongs: ["정관읍", "방곡리", "매학리", "임곡리", "월평리", "달산리", "병산리", "모전리", "용수리", "두명리", "예림리"] },
  { slug: "dasa-eup", code: "2771025600", name: "다사읍", citySlug: "daegu-dalseong", legalDongs: ["다사읍", "이천리", "달천리", "박곡리", "방천리", "서재리", "세천리", "죽곡리", "매곡리", "부곡리", "문양리", "문산리"] },
  { slug: "daun-dong", code: "3111061000", name: "다운동", citySlug: "ulsan-jung", legalDongs: ["태화동", "다운동"] },
  { slug: "bongdam-eup", code: "4159325000", name: "봉담읍", citySlug: "hwaseong", legalDongs: ["봉담읍", "상리", "내리", "수영리", "동화리", "와우리", "수기리", "분천리", "왕림리", "세곡리", "당하리", "마하리", "유리", "덕리", "덕우리", "하가등리", "상기리"] },
  { slug: "chwiam-dong", code: "4423051000", name: "취암동", citySlug: "nonsan", legalDongs: ["화지동", "반월동", "취암동", "지산동", "덕지동", "내동", "관촉동"] },
  { slug: "nongso3-dong", code: "3120053000", name: "농소3동", citySlug: "ulsan-buk", legalDongs: ["가대동", "상안동", "천곡동", "달천동", "시례동"] },
  // 2026-11-10 Batch 45 전국 확장 17개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "seolak-myeon", code: "4182031000", name: "설악면", citySlug: "gapyeong", legalDongs: ["설악면", "신천리", "선촌리", "회곡리", "사룡리", "송산리", "미사리", "위곡리", "창의리", "엄소리", "설곡리", "묵안리", "가일리", "방일리", "천안리", "이천리"] },
  { slug: "junggye23-dong", code: "1135062500", name: "중계2.3동", citySlug: "nowon", legalDongs: ["중계동"] },
  { slug: "guku-dong", code: "2723080000", name: "국우동", citySlug: "daegu-buk", legalDongs: ["동호동", "학정동", "도남동", "국우동"] },
  { slug: "gwangcheon-eup", code: "4480025300", name: "광천읍", citySlug: "hongseong", legalDongs: ["광천읍", "신진리", "광천리", "담산리", "가정리", "내죽리", "소암리", "매현리", "벽계리", "상정리", "옹암리", "운용리", "대평리", "월림리"] },
  { slug: "gwangjeong-dong", code: "4141062000", name: "광정동", citySlug: "gunpo", legalDongs: ["산본동"] },
  { slug: "gwarim-dong", code: "4139062100", name: "과림동", citySlug: "siheung", legalDongs: ["과림동", "무지내동"] },
  { slug: "jungang-dong", code: "4122051000", name: "중앙동", citySlug: "pyeongtaek", legalDongs: ["서정동", "장당동", "이충동"] },
  { slug: "byeongjeom2-dong", code: "4159553000", name: "병점2동", citySlug: "hwaseong", legalDongs: ["병점동"] },
  { slug: "dongtan9-dong", code: "4159759000", name: "동탄9동", citySlug: "hwaseong", legalDongs: ["신동", "목동"] },
  { slug: "anheung-myeon", code: "5173032000", name: "안흥면", citySlug: "hoengseong", legalDongs: ["안흥면", "안흥리", "가천리", "송한리", "상안리", "지구리", "소사리", "성산리"] },
  { slug: "sinseon-dong", code: "2620058500", name: "신선동", citySlug: "busan-yeongdo", legalDongs: ["영선동2가", "신선동1가", "신선동2가", "신선동3가", "봉래동4가"] },
  { slug: "cheonggye-dong", code: "4143056000", name: "청계동", citySlug: "uiwang", legalDongs: ["학의동", "내손동", "청계동", "포일동"] },
  { slug: "myeonmok38-dong", code: "1126057500", name: "면목제3.8동", citySlug: "jungnang", legalDongs: ["면목동"] },
  { slug: "cheolsan3-dong", code: "4121061000", name: "철산3동", citySlug: "gwangmyeong", legalDongs: ["철산동"] },
  { slug: "sau-dong", code: "4157054000", name: "사우동", citySlug: "gimpo", legalDongs: ["사우동"] },
  { slug: "wolpi-dong", code: "4127158000", name: "월피동", citySlug: "ansan", legalDongs: ["양상동", "부곡동", "월피동"] },
  { slug: "hosu-dong", code: "4127353500", name: "호수동", citySlug: "ansan", legalDongs: ["고잔동"] },
  // 2026-11-10 Batch 46 전국 확장 16개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "hwado-eup", code: "4136025600", name: "화도읍", citySlug: "namyangju", legalDongs: ["화도읍", "마석우리", "묵현리", "가곡리", "구암리", "금남리", "답내리", "월산리"] },
  { slug: "cheongbuk-eup", code: "4122025900", name: "청북읍", citySlug: "pyeongtaek", legalDongs: ["청북읍", "현곡리", "삼계리", "고잔리", "옥길리", "후사리", "토진리", "백봉리", "어연리", "율북리", "한산리", "어소리", "고렴리"] },
  { slug: "gwonseon2-dong", code: "4111368000", name: "권선2동", citySlug: "suwon", legalDongs: ["권선동"] },
  { slug: "soha2-dong", code: "4121065000", name: "소하2동", citySlug: "gwangmyeong", legalDongs: ["소하동"] },
  { slug: "sanggye9-dong", code: "1135071000", name: "상계9동", citySlug: "nowon", legalDongs: ["상계동"] },
  { slug: "samseong-dong", code: "1162074500", name: "삼성동", citySlug: "gwanak", legalDongs: ["신림동"] },
  { slug: "haenggung-dong", code: "4111574000", name: "행궁동", citySlug: "suwon", legalDongs: ["팔달로1가", "팔달로2가", "팔달로3가", "남창동", "영동", "중동", "구천동", "남수동", "매향동", "북수동", "신풍동", "장안동"] },
  { slug: "godeok2-dong", code: "1174056000", name: "고덕제2동", citySlug: "gangdong", legalDongs: ["고덕동"] },
  { slug: "jucheon-myeon", code: "5175036000", name: "주천면", citySlug: "yeongwol", legalDongs: ["주천면", "주천리", "판운리", "도천리", "신일리", "금마리", "용석리"] },
  { slug: "jingwan-dong", code: "1138069000", name: "진관동", citySlug: "eunpyeong", legalDongs: ["진관동"] },
  { slug: "yanggu-eup", code: "5180025000", name: "양구읍", citySlug: "yanggu", legalDongs: ["양구읍", "상리", "중리", "하리", "송청리", "수인리", "웅진리", "석현리", "공리", "학조리", "이리", "안대리", "정림리", "동수리", "고대리", "죽곡리", "한전리", "도사리", "공수리", "군량리", "월명리", "상무룡리"] },
  { slug: "okcheon-eup", code: "4373025000", name: "옥천읍", citySlug: "okcheon", legalDongs: ["옥천읍", "죽향리", "문정리", "상계리", "하계리", "교동리", "동안리", "수북리", "매화리", "구일리", "서대리", "가풍리", "삼청리", "대천리", "마암리", "양수리", "금구리", "장야리", "삼양리", "서정리", "옥각리", "오대리"] },
  { slug: "dongincheon-dong", code: "2812556000", name: "동인천동", citySlug: "jemulpo", legalDongs: ["내동", "경동", "용동", "인현동", "전동"] },
  { slug: "naechon-myeon", code: "5172033000", name: "내촌면", citySlug: "hongcheon", legalDongs: ["내촌면", "물걸리", "와야리", "서곡리", "도관리", "답풍리", "화상대리", "문현리", "광암리"] },
  { slug: "daeyeon6-dong", code: "2629056000", name: "대연제6동", citySlug: "busan-nam", legalDongs: ["대연동"] },
  { slug: "dongtan7-dong", code: "4159757000", name: "동탄7동", citySlug: "hwaseong", legalDongs: ["산척동", "송동"] },
  // 2026-11-10 Batch 47 전국 확장 14개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "sujeong5-dong", code: "2617060000", name: "수정제5동", citySlug: "busan-dong", legalDongs: ["수정동"] },
  { slug: "gajwa4-dong", code: "2827561000", name: "가좌4동", citySlug: "seohae", legalDongs: ["가좌동"] },
  { slug: "gwangjang-dong", code: "1121581000", name: "광장동", citySlug: "gwangjin", legalDongs: ["광장동"] },
  { slug: "eumseong-eup", code: "4377025000", name: "음성읍", citySlug: "eumseong", legalDongs: ["음성읍", "읍내리", "평곡리", "석인리", "한벌리", "용산리", "사정리", "감우리", "소여리", "신천리", "초천리", "동음리", "삼생리"] },
  { slug: "goesan-eup", code: "4376025000", name: "괴산읍", citySlug: "goesan", legalDongs: ["괴산읍", "동부리", "서부리", "정용리", "신기리", "신항리", "사창리", "능촌리", "제월리", "대덕리", "대사리", "검승리"] },
  { slug: "yeongchun-myeon", code: "4380033000", name: "영춘면", citySlug: "danyang", legalDongs: ["영춘면", "상리", "하리", "남천리", "백자리", "의풍리", "동대리", "용진리", "오사리", "유암리", "사이곡리", "별방리", "만종리", "장발리", "사지원리"] },
  { slug: "hwanggan-myeon", code: "4374032000", name: "황간면", citySlug: "yeongdong", legalDongs: ["황간면", "남성리", "신흥리", "마산리", "소계리", "난곡리", "우매리", "원촌리", "용암리", "금계리", "회포리", "우천리", "노근리", "서송원리", "광평리"] },
  { slug: "songjeong-dong", code: "4161052000", name: "송정동", citySlug: "gyeonggi-gwangju", legalDongs: ["송정동"] },
  { slug: "seojeong-dong", code: "4122052000", name: "서정동", citySlug: "pyeongtaek", legalDongs: ["서정동"] },
  { slug: "juksan-myeon", code: "4155040000", name: "죽산면", citySlug: "anseong", legalDongs: ["죽산면", "죽산리", "매산리", "장원리", "두현리", "장능리", "장계리", "용설리", "칠장리", "당목리", "두교리"] },
  { slug: "gusan-dong", code: "1138056000", name: "구산동", citySlug: "eunpyeong", legalDongs: ["구산동"] },
  { slug: "doksan3-dong", code: "1154563000", name: "독산제3동", citySlug: "geumcheon", legalDongs: ["독산동"] },
  { slug: "galma1-dong", code: "3017058100", name: "갈마1동", citySlug: "daejeon-seo", legalDongs: ["갈마동"] },
  // 2026-11-10 Batch 48 전국 확장 17개 동 (행정동 코드: data/official/admin-dongs.json)
  { slug: "songcheon-dong", code: "1130555500", name: "송천동", citySlug: "gangbuk", legalDongs: ["미아동"] },
  { slug: "namyang-eup", code: "4159125600", name: "남양읍", citySlug: "hwaseong", legalDongs: ["남양읍", "남양리", "신남리", "장덕리", "안석리", "활초리", "온석리", "무송리", "북양리", "송림리", "수화리", "장전리", "신외리", "문호리", "시리", "원천리"] },
  { slug: "gwanmun-dong", code: "2723071500", name: "관문동", citySlug: "daegu-buk", legalDongs: ["노곡동", "매천동", "팔달동", "금호동", "사수동"] },
  { slug: "mannyeon-dong", code: "3017065000", name: "만년동", citySlug: "daejeon-seo", legalDongs: ["만년동"] },
  { slug: "songchon-dong", code: "3023054300", name: "송촌동", citySlug: "daejeon-daedeok", legalDongs: ["송촌동"] },
  { slug: "galma2-dong", code: "3017058200", name: "갈마2동", citySlug: "daejeon-seo", legalDongs: ["갈마동"] },
  { slug: "ansan-dong", code: "4127161000", name: "안산동", citySlug: "ansan", legalDongs: ["수암동", "장상동", "장하동"] },
  { slug: "janggok-dong", code: "4139063100", name: "장곡동", citySlug: "siheung", legalDongs: ["장현동", "장곡동"] },
  { slug: "woncheon-dong", code: "4111755000", name: "원천동", citySlug: "suwon", legalDongs: ["원천동"] },
  { slug: "homaesil-dong", code: "4111366400", name: "호매실동", citySlug: "suwon", legalDongs: ["호매실동"] },
  { slug: "girin-myeon", code: "5181033000", name: "기린면", citySlug: "inje", legalDongs: ["기린면", "현리", "북리", "서리", "방동리", "진동리"] },
  { slug: "nae-myeon", code: "5172039000", name: "내면", citySlug: "hongcheon", legalDongs: ["내면", "창촌리", "광원리", "명개리", "율전리", "자운리", "방내리"] },
  { slug: "cheolam-dong", code: "5119061500", name: "철암동", citySlug: "taebaek", legalDongs: ["철암동", "동점동"] },
  { slug: "gamgok-myeon", code: "4377037000", name: "감곡면", citySlug: "eumseong", legalDongs: ["감곡면", "오향리", "주천리", "원당리", "상평리", "월정리", "영산리", "사곡리", "문촌리", "오궁리", "상우리", "왕장리", "단평리"] },
  { slug: "gyohyeonanrim-dong", code: "4313053500", name: "교현.안림동", citySlug: "chungju", legalDongs: ["교현동", "종민동", "안림동", "목벌동"] },
  { slug: "sageun-dong", code: "1120055000", name: "사근동", citySlug: "seongdong", legalDongs: ["사근동", "행당동"] },
  { slug: "jeonnong2-dong", code: "1123057000", name: "전농제2동", citySlug: "dongdaemun", legalDongs: ["전농동"] },
];

export function getDongsByCity(citySlug: string): AdminDong[] {
  return dongs.filter((d) => d.citySlug === citySlug);
}

export function getDong(citySlug: string, dongSlug: string): AdminDong | undefined {
  return dongs.find((d) => d.citySlug === citySlug && d.slug === dongSlug);
}

/** Other 행정동 in the same city that share at least one 법정동 with this one (official table only). */
export function getDongsSharingLegalDong(dong: AdminDong): { legalDong: string; dongs: AdminDong[] }[] {
  return dong.legalDongs
    .map((legalDong) => ({
      legalDong,
      dongs: dongs.filter((d) => d.citySlug === dong.citySlug && d.slug !== dong.slug && d.legalDongs.includes(legalDong)),
    }))
    .filter((g) => g.dongs.length > 0);
}
