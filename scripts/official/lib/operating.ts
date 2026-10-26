/**
 * `operating` (학교알리미 2026년 3차 공시 확인) resolution for school-import candidates.
 *
 * The 학교알리미 manifest lives in a gitignored cache, so a given PC only knows the schools it fetched itself.
 * A confirmation recorded earlier in data/official/school-candidates.json must therefore survive a run on a PC
 * whose manifest is missing or partial: operating only moves unverified → disclosed, never back.
 * (docs/qa/school-import-manifest-risk-2026-10-26.md)
 */
export type Operating = "disclosed-2026-3" | "unverified";

type ManifestSchools = Record<string, { term?: string; files?: object; error?: string }>;

/** NEIS codes whose 2026년 3차 공시 was fetched with at least one file in this manifest. */
export function disclosedFromManifest(schools: ManifestSchools): Set<string> {
  return new Set(Object.entries(schools).filter(([, e]) => e.term === "3" && !e.error && Object.keys(e.files ?? {}).length > 0).map(([c]) => c));
}

/** NEIS codes already marked disclosed in a previously saved candidates file. */
export function previouslyDisclosed(records: { code: string; operating?: string }[]): Set<string> {
  return new Set(records.filter((r) => r.operating === "disclosed-2026-3").map((r) => r.code));
}

export function resolveOperating(code: string, current: Set<string>, previous: Set<string>): Operating {
  return current.has(code) || previous.has(code) ? "disclosed-2026-3" : "unverified";
}
