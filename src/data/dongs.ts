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
 * - Slugs end in "-dong" so they can never collide with a subject / grade / district /
 *   "program" segment under the same city (checked by validate:quick).
 *
 * Kept separate from src/data/regions.ts on purpose: regions feed the site-wide region
 * lists, district routes and the region hub gate, and dongs must not change any of them.
 */
export interface AdminDong {
  slug: string;
  /** 행정동 name, e.g. "호원1동". */
  name: string;
  /** City-level RegionNode slug (src/data/regions.ts). */
  citySlug: string;
  /** 법정동 covered by this 행정동, as listed in the official table. */
  legalDongs: string[];
  tong: number;
  ban: number;
}

export const UIJEONGBU_ADMIN_AREA_SOURCE: ContentSource = {
  label: "의정부시청 — 행정구역안내 (행정동·법정동·통·반 현황)",
  url: "https://www.ui4u.go.kr/portal/contents.do?mId=0501040000",
};

/** Sources per city for the 행정동 table itself. */
export const dongTableSources: Record<string, ContentSource> = {
  uijeongbu: UIJEONGBU_ADMIN_AREA_SOURCE,
};

// 의정부시 15개 행정동 — 의정부시청 행정구역안내 표(2026-10-16 확인, 합계 714통 3,928반).
// 고산동은 2024-07-01 송산1동에서 분동된 행정동.
export const dongs: AdminDong[] = [
  { slug: "uijeongbu1-dong", name: "의정부1동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동", "호원동"], tong: 60, ban: 299 },
  { slug: "uijeongbu2-dong", name: "의정부2동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 48, ban: 232 },
  { slug: "howon1-dong", name: "호원1동", citySlug: "uijeongbu", legalDongs: ["호원동"], tong: 52, ban: 315 },
  { slug: "howon2-dong", name: "호원2동", citySlug: "uijeongbu", legalDongs: ["호원동"], tong: 54, ban: 303 },
  { slug: "jangam-dong", name: "장암동", citySlug: "uijeongbu", legalDongs: ["장암동"], tong: 36, ban: 220 },
  { slug: "singok1-dong", name: "신곡1동", citySlug: "uijeongbu", legalDongs: ["신곡동"], tong: 57, ban: 377 },
  { slug: "singok2-dong", name: "신곡2동", citySlug: "uijeongbu", legalDongs: ["신곡동"], tong: 58, ban: 314 },
  { slug: "songsan1-dong", name: "송산1동", citySlug: "uijeongbu", legalDongs: ["용현동"], tong: 49, ban: 272 },
  { slug: "songsan2-dong", name: "송산2동", citySlug: "uijeongbu", legalDongs: ["민락동"], tong: 38, ban: 250 },
  { slug: "songsan3-dong", name: "송산3동", citySlug: "uijeongbu", legalDongs: ["민락동", "낙양동"], tong: 61, ban: 289 },
  { slug: "jageum-dong", name: "자금동", citySlug: "uijeongbu", legalDongs: ["자일동", "금오동", "녹양동"], tong: 42, ban: 244 },
  { slug: "ganeung-dong", name: "가능동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 47, ban: 250 },
  { slug: "heungseon-dong", name: "흥선동", citySlug: "uijeongbu", legalDongs: ["의정부동", "가능동"], tong: 37, ban: 195 },
  { slug: "nogyang-dong", name: "녹양동", citySlug: "uijeongbu", legalDongs: ["녹양동"], tong: 37, ban: 203 },
  { slug: "gosan-dong", name: "고산동", citySlug: "uijeongbu", legalDongs: ["고산동", "산곡동"], tong: 38, ban: 165 },
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
