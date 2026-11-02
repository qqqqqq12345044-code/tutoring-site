/**
 * Writes src/data/nationalSchools.json — the page-capable (PAGE_ONLY) national school list behind
 * /school/[schoolSlug] for schools that are NOT registered in src/data/schools.ts.
 *
 * Source: data/official/school-candidates.json (scripts/official/school-import.ts). Only rows with
 * status "candidate" are written: NEIS 학교기본정보 identity + 도로명주소 → exactly one official 행정동
 * (state CONFIRMED) + a city node in src/data/regions.ts. Everything else is left out on purpose:
 *   - registered        → already served by src/data/schools.ts (own page, own gates)
 *   - pending           → 행정동 not confirmed (never guessed)
 *   - excluded          → 주소 없음 / 미개교
 *   - unmapped-region   → 시·도 not representable yet (전남광주통합특별시, 세종 — HOLD)
 *   - NEIS 학교명에 "(폐교)" 표기 → closed (NEIS has no 운영 field; the name itself says so)
 *
 * These pages are always noindex, follow and never in the sitemap (src/lib/indexability.ts "school-national");
 * no school×subject route is created for them. The file is derived data — validate:quick checks it is in
 * sync with school-candidates.json (scripts/lib/route-inventory.ts checkNationalSchools).
 *
 * usage: npx tsx scripts/official/national-school-pages.ts [--write]
 */
import fs from "fs";
import path from "path";

const CANDIDATES = path.join("data", "official", "school-candidates.json");
const OUT = path.join("src", "data", "nationalSchools.json");

interface CandidateRow {
  code: string;
  name: string;
  level: string;
  office: string;
  state: string;
  status: string;
  slug: string;
  dongCode?: string;
  dongName?: string;
  citySlug?: string;
  districtSlug?: string;
}

/** NEIS still lists a few closed 분교장 with the closure in the name, e.g. "전곡초등학교적동분교장(폐교)". */
export const CLOSED_NAME = /\(폐교\)/;

/** Column order of each row in src/data/nationalSchools.json (kept as tuples to keep the bundle small). */
export const NATIONAL_SCHOOL_COLUMNS = ["code", "slug", "name", "level", "office", "citySlug", "districtSlug", "dongCode", "dongName"] as const;

export function buildNationalSchoolRows(records: CandidateRow[]): string[][] {
  return records
    .filter((r) => r.status === "candidate" && r.state === "CONFIRMED" && r.citySlug && r.dongCode && r.dongName)
    .filter((r) => !CLOSED_NAME.test(r.name))
    .map((r) => [r.code, r.slug, r.name, r.level, r.office, r.citySlug!, r.districtSlug ?? "", r.dongCode!, r.dongName!])
    .sort((a, b) => a[1].localeCompare(b[1]));
}

export function readCandidateRecords(): CandidateRow[] {
  return JSON.parse(fs.readFileSync(CANDIDATES, "utf8")).records;
}

export function renderNationalSchoolsJson(rows: string[][]): string {
  const body = {
    source: "data/official/school-candidates.json (status candidate · CONFIRMED) — scripts/official/national-school-pages.ts",
    columns: NATIONAL_SCHOOL_COLUMNS,
    rows,
  };
  // One row per line: readable diffs without blowing up the file size.
  return (
    "{\n" +
    `  "source": ${JSON.stringify(body.source)},\n` +
    `  "columns": ${JSON.stringify(body.columns)},\n` +
    '  "rows": [\n' +
    rows.map((r) => "    " + JSON.stringify(r)).join(",\n") +
    "\n  ]\n}\n"
  );
}

if (process.argv[1] && path.basename(process.argv[1]).startsWith("national-school-pages")) {
  const rows = buildNationalSchoolRows(readCandidateRecords());
  const text = renderNationalSchoolsJson(rows);
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  console.log(`page-capable national schools: ${rows.length} (${current === text ? "in sync" : "changed"})`);
  if (process.argv.includes("--write")) {
    fs.writeFileSync(OUT, text);
    console.log(`wrote ${OUT} (${(Buffer.byteLength(text) / 1024).toFixed(0)} KB)`);
  }
}
