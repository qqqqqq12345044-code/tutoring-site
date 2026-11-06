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
