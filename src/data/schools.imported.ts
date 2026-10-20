import type { OfficialSchoolRecord, School } from "@/data/schools";

/**
 * Schools registered from the national candidate list (scripts/official/school-import.ts --promote) — generated,
 * append-only; edit through the script. Each entry is a CONFIRMED NEIS school (도로명주소 → one official 행정동,
 * data/official/national-school-dongs.json) whose 학교알리미 2026년 3차 공시 was fetched (operating check).
 * availableSubjectSlugs is empty on purpose: no school×subject routes until written content exists.
 */
export const importedSchools: School[] = [
];

function imported(
  slug: string,
  name: string,
  cityRegionSlug: string,
  districtRegionSlug: string | undefined,
  level: School["level"],
  dongSlug: string,
  official: OfficialSchoolRecord,
): School {
  return { slug, name, cityRegionSlug, ...(districtRegionSlug ? { districtRegionSlug } : {}), level, availableSubjectSlugs: [], dataSource: "official", dongSlug, official };
}
