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
