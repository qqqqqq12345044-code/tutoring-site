/**
 * data/official/admin-dongs.json (built by scripts/official/admin-dongs.ts) and lookups over it.
 * Used by scripts and validators only — never imported by the app, so it adds nothing to the bundle.
 */
import { readFileSync } from "fs";
import { regions, getRegionBySlug } from "@/data/regions";

export interface OfficialAdminDongTable {
  source: { label: string; url: string; asOf: string };
  sido: { code: string; name: string }[];
  /** 시·군·구 and 일반구 rows; 일반구 names carry their city ("수원시 영통구"). */
  sigungu: { code: string; sido: string; name: string }[];
  /** 읍·면·동 (행정동) rows with their 법정동/리 [code, name] pairs. */
  dongs: { code: string; sido: string; sigungu: string; name: string; created: string; legal: [string, string][] }[];
}

export const ADMIN_DONG_TABLE_PATH = "data/official/admin-dongs.json";

let cached: OfficialAdminDongTable | null = null;
export function loadAdminDongTable(): OfficialAdminDongTable {
  cached ??= JSON.parse(readFileSync(ADMIN_DONG_TABLE_PATH, "utf-8")) as OfficialAdminDongTable;
  return cached;
}

/**
 * Official 시군구 names that a city- or district-level RegionNode covers.
 * - city "의정부" (경기) → ["의정부시"]; "강남구" (서울) → ["강남구"]
 * - city "수원" with 일반구 → ["수원시 장안구", "수원시 권선구", …] (every 일반구 row of 수원시)
 * - district "영통구" under "수원" → ["수원시 영통구"]
 * Returns [] when nothing matches (the caller reports it; no guessing).
 */
export function officialSigunguNames(regionSlug: string, table = loadAdminDongTable()): string[] {
  const node = getRegionBySlug(regionSlug);
  const province = provinceOf(regionSlug);
  if (!node || !province) return [];
  const inSido = table.sigungu.filter((s) => s.sido === province.fullName);
  const variants = (n: string) => [n, `${n}시`, `${n}군`, `${n}구`];
  if (node.level === "district") {
    const city = getRegionBySlug(node.parentSlug!)!;
    const want = variants(city.name).flatMap((c) => [`${c} ${node.name}`]);
    return inSido.filter((s) => want.includes(s.name)).map((s) => s.name);
  }
  // The display name may carry a qualifier ("경기 광주" → fullName "경기 광주시"); try both.
  const bare = node.name.replace(/^(서울|부산|대구|인천|광주|대전|울산|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s+/, "");
  const fullBare = node.fullName.replace(/^(서울|부산|대구|인천|광주|대전|울산|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s+/, "");
  const names = new Set([...variants(bare), fullBare]);
  const exact = inSido.filter((s) => names.has(s.name)).map((s) => s.name);
  if (exact.length === 0) return [];
  // A 시 with 일반구 has its own row plus "시 구" rows; the 행정동 hang off the 일반구 rows.
  const withGu = inSido.filter((s) => exact.some((e) => s.name.startsWith(`${e} `))).map((s) => s.name);
  return withGu.length > 0 ? withGu : exact;
}

function provinceOf(regionSlug: string) {
  const node = getRegionBySlug(regionSlug);
  if (!node || node.level === "province") return undefined;
  return node.level === "city" ? getRegionBySlug(node.parentSlug!) : getRegionBySlug(getRegionBySlug(node.parentSlug!)!.parentSlug!);
}

export function officialDongsForRegion(regionSlug: string, table = loadAdminDongTable()) {
  const names = officialSigunguNames(regionSlug, table);
  const province = provinceOf(regionSlug);
  return table.dongs.filter((d) => province && d.sido === province.fullName && names.includes(d.sigungu));
}

/** City/district RegionNodes with no official 시군구 match (reported by validators, never guessed). */
export function unmatchedRegions(table = loadAdminDongTable()): string[] {
  return regions.filter((r) => r.level !== "province" && officialSigunguNames(r.slug, table).length === 0).map((r) => r.slug);
}
