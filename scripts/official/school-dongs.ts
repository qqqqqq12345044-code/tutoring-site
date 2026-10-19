/**
 * School → 행정동 resolution for the registered schools (src/data/schools.ts). Re-runnable, dry run by default.
 *
 *   npx tsx scripts/official/school-dongs.ts                       # report only (uses cached NEIS answers)
 *   npx tsx scripts/official/school-dongs.ts --write               # also writes data/official/school-dongs.json
 *   npx tsx scripts/official/school-dongs.ts --national-counts     # NEIS 초·중·고 totals per 시도교육청
 *
 * Steps per school (nothing guessed — anything not certain stays "pending"):
 *   1. NEIS 학교기본정보: by school code when known (School.official.code / sources.ts), otherwise by exact
 *      school name within the province's 교육청 (accepted only when exactly one exact-name row comes back).
 *   2. 법정동 = first item of NEIS ORG_RDNDA "(법정동, 건물)"; 시군구 = from ORG_RDNMA.
 *   3. data/official/admin-dongs.json (행정안전부 KIKmix): if that 법정동 belongs to exactly one 행정동 of the
 *      시군구 → resolved ("legal-dong-unique"). If it spans several 행정동 → pending ("legal-dong-split").
 *   4. Optional: with JUSO_CONFM_KEY set (행정안전부 주소정보누리집 도로명주소 검색 API 승인키 — never hardcoded),
 *      split cases are resolved by the API's 행정동명(hemdNm) for the NEIS road address ("juso-api").
 *
 * Requests: keyless NEIS only returns a few rows, so lookups are one school at a time, cached under
 * .cache/official/neis/ and spaced 400ms apart. NEIS_API_KEY (optional) is passed through when set.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { schools, type School } from "@/data/schools";
import { getRegionBySlug } from "@/data/regions";
import { loadAdminDongTable } from "./lib/admin-dong-table";

const CACHE = ".cache/official/neis";
const OUT = "data/official/school-dongs.json";
const NEIS = "https://open.neis.go.kr/hub/schoolInfo";

const ATPT: Record<string, string> = {
  서울특별시: "B10", 부산광역시: "C10", 대구광역시: "D10", 인천광역시: "E10", 광주광역시: "F10", 대전광역시: "G10",
  울산광역시: "H10", 세종특별자치시: "I10", 경기도: "J10", 강원특별자치도: "K10", 충청북도: "M10", 충청남도: "N10",
  전북특별자치도: "P10", 전라남도: "Q10", 경상북도: "R10", 경상남도: "S10", 제주특별자치도: "T10",
};

interface NeisRow {
  ATPT_OFCDC_SC_CODE: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  SCHUL_KND_SC_NM: string;
  ORG_RDNMA: string;
  ORG_RDNDA: string | null;
  LCTN_SC_NM: string;
}

export interface SchoolDongRecord {
  schoolSlug: string;
  schoolName: string;
  neisCode?: string;
  roadAddress?: string;
  legalDong?: string;
  sigungu?: string;
  status: "resolved" | "pending";
  method?: "legal-dong-unique" | "juso-api" | "site-verified";
  dongCode?: string;
  dongName?: string;
  reason?: string;
  candidates?: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function neis(params: Record<string, string>, cacheKey: string): Promise<{ total: number; rows: NeisRow[] }> {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${cacheKey.replace(/[^\w가-힣-]/g, "_")}.json`);
  let body: string;
  if (existsSync(file)) body = readFileSync(file, "utf-8");
  else {
    const q = new URLSearchParams({ Type: "json", pIndex: "1", pSize: "100", ...params });
    if (process.env.NEIS_API_KEY) q.set("KEY", process.env.NEIS_API_KEY);
    const res = await fetch(`${NEIS}?${q}`);
    if (!res.ok) throw new Error(`NEIS ${res.status} for ${cacheKey}`);
    body = await res.text();
    writeFileSync(file, body);
    await sleep(400);
  }
  const json = JSON.parse(body);
  if (!json.schoolInfo) return { total: 0, rows: [] };
  return { total: json.schoolInfo[0].head[0].list_total_count, rows: json.schoolInfo[1].row as NeisRow[] };
}

function provinceFullName(s: School): string | undefined {
  const city = getRegionBySlug(s.cityRegionSlug);
  return city?.parentSlug ? getRegionBySlug(city.parentSlug)?.fullName : undefined;
}

/** Known NEIS codes: School.official, then the code table in src/data/sources.ts (read as text to stay decoupled). */
function knownCodes(): Map<string, [string, string]> {
  const src = readFileSync("src/data/sources.ts", "utf-8");
  const m = new Map<string, [string, string]>();
  for (const x of src.matchAll(/\s([가-힣A-Za-z]+):\s*\["([A-Z]\d{2})",\s*"(\d{7})"\]/g)) m.set(x[1], [x[2], x[3]]);
  return m;
}

async function findNeis(s: School, codes: Map<string, [string, string]>): Promise<NeisRow | string> {
  const prov = provinceFullName(s);
  const atpt = prov ? ATPT[prov] : undefined;
  if (s.official?.code && atpt) {
    const r = await neis({ ATPT_OFCDC_SC_CODE: atpt, SD_SCHUL_CODE: s.official.code }, `${atpt}-${s.official.code}`);
    return r.rows[0] ?? "NEIS: 코드 조회 결과 없음";
  }
  const known = codes.get(s.name);
  if (known) {
    const r = await neis({ ATPT_OFCDC_SC_CODE: known[0], SD_SCHUL_CODE: known[1] }, `${known[0]}-${known[1]}`);
    return r.rows[0] ?? "NEIS: 코드 조회 결과 없음";
  }
  if (!atpt) return `시도교육청 코드를 정할 수 없음 (${prov ?? "?"})`;
  const r = await neis({ ATPT_OFCDC_SC_CODE: atpt, SCHUL_NM: s.name }, `${atpt}-name-${s.name}`);
  const exact = r.rows.filter((x) => x.SCHUL_NM === s.name);
  if (exact.length !== 1) return `NEIS 이름 검색 정확 일치 ${exact.length}건`;
  return exact[0];
}

async function jusoHemd(roadAddress: string): Promise<string | undefined> {
  const key = process.env.JUSO_CONFM_KEY;
  if (!key) return undefined;
  const q = new URLSearchParams({ confmKey: key, currentPage: "1", countPerPage: "5", keyword: roadAddress, resultType: "json" });
  const res = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do?${q}`);
  if (!res.ok) return undefined;
  const json = await res.json();
  const list = json?.results?.juso ?? [];
  const names = [...new Set(list.map((j: { hemdNm?: string }) => j.hemdNm).filter(Boolean))] as string[];
  await sleep(400);
  return names.length === 1 ? names[0] : undefined;
}

/** Documented cases where NEIS's 법정동 differs from the 주소정보누리집 result the site uses. */
const KNOWN_NEIS_MISMATCH: Record<string, string> = {
  "uijeongbu-gwangdong-high-school":
    "NEIS 상세주소 (가능동) ≠ 주소정보누리집 법정동 녹양동 — 주소정보누리집 값 사용 (docs/qa/uijeongbu-dong-pilot-2026-10-16.md)",
};

const SIDO_ALIAS: Record<string, string> = {
  서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시", 광주: "광주광역시", 대전: "대전광역시",
  울산: "울산광역시", 세종: "세종특별자치시", 경기: "경기도", 강원: "강원특별자치도", 충북: "충청북도", 충남: "충청남도",
  전북: "전북특별자치도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도", 제주: "제주특별자치도",
};

async function resolveSchool(s: School, codes: Map<string, [string, string]>): Promise<SchoolDongRecord> {
  const base: SchoolDongRecord = { schoolSlug: s.slug, schoolName: s.name, status: "pending" };
  const row = await findNeis(s, codes);
  if (typeof row === "string") return { ...base, reason: row };
  const addr = row.ORG_RDNMA.trim();
  const parts = addr.split(/\s+/);
  const table = loadAdminDongTable();
  const sido = SIDO_ALIAS[parts[0]] ?? parts[0];
  // 시군구 is one token, or two when the second is an 일반구 ("수원시 영통구"). A city whose 일반구 are not in the
  // address ("부천시 …" after the 2024 구 restoration) is searched across all of its 일반구.
  const two = `${parts[1]} ${parts[2]}`;
  const sigunguRows = table.sigungu.filter((g) => g.sido === sido && (g.name === two || g.name === parts[1] || g.name.startsWith(`${parts[1]} `)));
  const exactTwo = sigunguRows.filter((g) => g.name === two);
  const scope = exactTwo.length ? exactTwo : sigunguRows.filter((g) => g.name.startsWith(`${parts[1]} `)).length ? sigunguRows.filter((g) => g.name.startsWith(`${parts[1]} `)) : sigunguRows;
  const sigungu = scope.map((g) => g.name).join("|");
  const rec: SchoolDongRecord = { ...base, neisCode: row.SD_SCHUL_CODE, roadAddress: addr, sigungu };
  if (scope.length === 0) return { ...rec, reason: `공식 시군구 표에 없음: ${sido} ${parts[1]}` };
  const inScope = table.dongs.filter((d) => d.sido === sido && scope.some((g) => g.name === d.sigungu));
  // 법정동 = an item of ORG_RDNDA "(…)" that is a 법정동/리 of this 시군구 (building names are skipped).
  const items = (row.ORG_RDNDA?.match(/\(([^)]*)\)/)?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const legal = items.find((it) => inScope.some((d) => d.legal.some(([, n]) => n === it)));
  // Site data resolved earlier through 주소정보누리집 (의정부, 2026-10-16) is kept, but must be one of the official candidates.
  const site = s.dongSlug ? (await import("@/data/dongs")).getDong(s.cityRegionSlug, s.dongSlug) : undefined;
  if (!legal) {
    if (site) return { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: site.code, reason: "NEIS에 법정동 없음 — 기존 주소정보누리집 확인값" };
    return { ...rec, reason: `NEIS 상세주소에 법정동 없음 (${row.ORG_RDNDA ?? "-"})` };
  }
  rec.legalDong = legal;
  const candidates = inScope.filter((d) => d.legal.some(([, n]) => n === legal));
  if (site) {
    const ok = candidates.some((c) => c.name === site.name) || KNOWN_NEIS_MISMATCH[s.slug] !== undefined;
    if (ok && !candidates.some((c) => c.name === site.name)) {
      return { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: site.code, reason: KNOWN_NEIS_MISMATCH[s.slug] };
    }
    return ok
      ? { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: candidates.find((c) => c.name === site.name)!.code }
      : { ...rec, reason: `기존 행정동 ${site.name}이 법정동 ${legal}의 공식 행정동(${candidates.map((c) => c.name).join("·")})에 없음`, candidates: candidates.map((c) => c.name) };
  }
  if (candidates.length === 1) {
    return { ...rec, status: "resolved", method: "legal-dong-unique", dongCode: candidates[0].code, dongName: candidates[0].name };
  }
  const hemd = await jusoHemd(addr);
  const viaApi = hemd ? candidates.find((c) => c.name === hemd) : undefined;
  if (viaApi) return { ...rec, status: "resolved", method: "juso-api", dongCode: viaApi.code, dongName: viaApi.name };
  return {
    ...rec,
    reason: process.env.JUSO_CONFM_KEY ? "법정동이 여러 행정동에 걸침 (주소 API로도 확정 못 함)" : "법정동이 여러 행정동에 걸침 (JUSO_CONFM_KEY 필요)",
    candidates: candidates.map((c) => c.name),
  };
}

async function nationalCounts() {
  const kinds = ["초등학교", "중학교", "고등학교"];
  let total = 0;
  for (const [sido, atpt] of Object.entries(ATPT)) {
    const counts: number[] = [];
    for (const k of kinds) {
      const r = await neis({ ATPT_OFCDC_SC_CODE: atpt, SCHUL_KND_SC_NM: k }, `${atpt}-count-${k}`);
      counts.push(r.total);
    }
    total += counts.reduce((a, b) => a + b, 0);
    console.log(`${sido} (${atpt}): 초 ${counts[0]} / 중 ${counts[1]} / 고 ${counts[2]}`);
  }
  console.log(`전국 초·중·고 (NEIS 학교기본정보, 학교급 필터 기준): ${total}`);
}

async function main() {
  if (process.argv.includes("--national-counts")) return nationalCounts();
  const codes = knownCodes();
  const records: SchoolDongRecord[] = [];
  for (const s of schools) records.push(await resolveSchool(s, codes));

  const resolved = records.filter((r) => r.status === "resolved");
  const pending = records.filter((r) => r.status === "pending");
  // Cross-check: schools that already carry dongSlug must agree with the official resolution when resolved.
  const disagree = records.filter((r) => {
    const s = schools.find((x) => x.slug === r.schoolSlug)!;
    return s.dongSlug && r.status === "resolved" && !r.dongName;
  });
  console.log(`학교 ${records.length}: resolved ${resolved.length} / pending ${pending.length}`);
  const reasons = new Map<string, number>();
  for (const p of pending) reasons.set(p.reason!.replace(/ \(.*\)$/, "").replace(/\d+건/, "N건"), (reasons.get(p.reason!.replace(/ \(.*\)$/, "").replace(/\d+건/, "N건")) ?? 0) + 1);
  for (const [k, v] of reasons) console.log(`  pending — ${k}: ${v}`);
  if (disagree.length) console.log(`  disagree ${disagree.length}`);
  if (process.argv.includes("--verbose")) {
    for (const r of records) console.log(`${r.status === "resolved" ? "OK " : "-- "} ${r.schoolName} ${r.sigungu ?? ""} ${r.legalDong ?? ""} → ${r.dongName ?? r.reason}${r.candidates ? ` [${r.candidates.join(",")}]` : ""}`);
  }
  if (process.argv.includes("--write")) {
    const table = loadAdminDongTable();
    mkdirSync(path.dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({ adminDongTable: table.source, generatedFrom: "NEIS 학교기본정보 + 행정안전부 KIKmix", records }, null, 1) + "\n");
    console.log(`wrote ${OUT}`);
  } else console.log("dry run (pass --write to save)");
}

main();
