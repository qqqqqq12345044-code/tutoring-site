/**
 * School → 행정동 resolution for the registered schools (src/data/schools.ts). Re-runnable, dry run by default.
 *
 *   npx tsx scripts/official/school-dongs.ts                       # report only (uses cached NEIS answers)
 *   npx tsx scripts/official/school-dongs.ts --write               # also writes data/official/school-dongs.json
 *   npx tsx scripts/official/school-dongs.ts --national-counts     # NEIS 초·중·고 totals per 시도교육청
 *   npx tsx scripts/official/school-dongs.ts --national [--write]  # every NEIS 초·중·고 → data/official/national-school-dongs.json
 *       [--chunk 200] [--max-chunks N] [--retry-pending]           # resumable: chunk checkpoint, rerun to continue
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
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
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
  FOND_YMD?: string;
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
/** Cache hits / live requests, reported per chunk by --national. */
const hits = { neis: 0, neisLive: 0, juso: 0, jusoLive: 0 };

async function neis(params: Record<string, string>, cacheKey: string): Promise<{ total: number; rows: NeisRow[] }> {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${cacheKey.replace(/[^\w가-힣-]/g, "_")}.json`);
  let body: string;
  if (existsSync(file)) {
    body = readFileSync(file, "utf-8");
    hits.neis++;
  } else {
    hits.neisLive++;
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

const JUSO_CACHE = ".cache/official/juso";

/**
 * 법정동(emdNm) + 행정동명 for a road address. hemdNm is only returned with addInfoYn=Y and is the full path
 * ("경기도 수원시 영통구 영통3동"); accepted only when the exact-address results share one of each under the expected 시군구.
 * Responses are cached without the key; an API error (errorCode ≠ "0") throws instead of turning into "pending".
 */
async function jusoLookup(roadAddress: string, sigungu: string): Promise<{ legal: string; hemd: string } | undefined> {
  const key = process.env.JUSO_CONFM_KEY;
  if (!key) return undefined;
  mkdirSync(JUSO_CACHE, { recursive: true });
  const file = path.join(JUSO_CACHE, `${roadAddress.replace(/[^\w가-힣-]/g, "_")}.json`);
  let json;
  if (existsSync(file)) {
    json = JSON.parse(readFileSync(file, "utf-8"));
    hits.juso++;
  } else {
    hits.jusoLive++;
    const q = new URLSearchParams({ confmKey: key, currentPage: "1", countPerPage: "5", keyword: roadAddress, resultType: "json", addInfoYn: "Y" });
    const res = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do?${q}`);
    if (!res.ok) throw new Error(`JUSO ${res.status}`);
    json = await res.json();
    const code = json?.results?.common?.errorCode;
    // Key / system errors stop the run; keyword errors (E0005~E0013 etc.) only leave this school pending.
    if (code === undefined || ["E0001", "E0014", "-999"].includes(code)) throw new Error(`JUSO ${code ?? "no response"}`);
    writeFileSync(file, JSON.stringify(json));
    await sleep(400);
  }
  // The keyword search also returns 부번 addresses ("송이로 42" → "송이로 42-1"); keep exact 도로명+건물번호 only.
  // Spaces are ignored (NEIS writes "인주대로 721번길 49"), and the road must follow the 시군구/읍면 directly.
  const flat = roadAddress.replace(/\s+/g, "");
  const list: { hemdNm?: string; emdNm?: string; rn?: string; buldMnnm?: string; buldSlno?: string }[] = json?.results?.juso ?? [];
  const exact = list.filter((j) => {
    const tail = `${j.rn}${j.buldMnnm}${j.buldSlno && j.buldSlno !== "0" ? `-${j.buldSlno}` : ""}`.replace(/\s+/g, "");
    return flat.endsWith(tail) && /[시군구읍면]$/.test(flat.slice(0, -tail.length));
  });
  const full = [...new Set(exact.map((j) => j.hemdNm?.trim()).filter(Boolean))] as string[];
  const legal = [...new Set(exact.map((j) => j.emdNm?.trim()).filter(Boolean))] as string[];
  if (full.length !== 1 || legal.length !== 1) return undefined;
  const tokens = full[0].split(/\s+/);
  const scopes = sigungu.split("|");
  // An empty 시군구 (세종) has nothing to match; the 행정동 is still checked against that 시도's official candidates.
  if (!scopes.some((g) => g === "" || full[0].includes(` ${g} `))) return undefined;
  return { legal: legal[0], hemd: tokens[tokens.length - 1] };
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
  // Former names some NEIS addresses still carry → the 시도 of the official table (KIKmix has no rows under the old names).
  강원도: "강원특별자치도", 전라북도: "전북특별자치도", 전라남도: "전남광주통합특별시", 광주광역시: "전남광주통합특별시",
};
/** 시도 without 시군구 (세종): the official table has one 시군구 row with an empty name, and the address has none. */
const SINGLE_TIER_SIDO = new Set(["세종특별자치시"]);

let tableMemo: ReturnType<typeof loadAdminDongTable> | undefined;
const adminTable = () => (tableMemo ??= loadAdminDongTable());

async function resolveSchool(s: School, codes: Map<string, [string, string]>): Promise<SchoolDongRecord> {
  const base: SchoolDongRecord = { schoolSlug: s.slug, schoolName: s.name, status: "pending" };
  const row = await findNeis(s, codes);
  if (typeof row === "string") return { ...base, reason: row };
  // Site data resolved earlier through 주소정보누리집 (의정부, 2026-10-16) is kept, but must be one of the official candidates.
  const site = s.dongSlug ? (await import("@/data/dongs")).getDong(s.cityRegionSlug, s.dongSlug) : undefined;
  return resolveRow(row, base, site);
}

/** NEIS row → 행정동 (shared by the registered-school run and --national). */
async function resolveRow(row: NeisRow, base: SchoolDongRecord, site?: { name: string; code?: string }): Promise<SchoolDongRecord> {
  const addr = row.ORG_RDNMA.trim();
  const parts = addr.split(/\s+/);
  const table = adminTable();
  const sido = SIDO_ALIAS[parts[0]] ?? parts[0];
  // 시군구 is one token, or two when the second is an 일반구 ("수원시 영통구"). A city whose 일반구 are not in the
  // address ("부천시 …" after the 2024 구 restoration) is searched across all of its 일반구.
  const two = `${parts[1]} ${parts[2]}`;
  const sigunguRows = SINGLE_TIER_SIDO.has(sido)
    ? table.sigungu.filter((g) => g.sido === sido && g.name === "")
    : table.sigungu.filter((g) => g.sido === sido && (g.name === two || g.name === parts[1] || g.name.startsWith(`${parts[1]} `)));
  const exactTwo = sigunguRows.filter((g) => g.name === two);
  const scope = exactTwo.length ? exactTwo : sigunguRows.filter((g) => g.name.startsWith(`${parts[1]} `)).length ? sigunguRows.filter((g) => g.name.startsWith(`${parts[1]} `)) : sigunguRows;
  const sigungu = scope.map((g) => g.name).join("|");
  const rec: SchoolDongRecord = { ...base, neisCode: row.SD_SCHUL_CODE, roadAddress: addr, sigungu };
  if (scope.length === 0) return { ...rec, reason: `공식 시군구 표에 없음: ${sido} ${parts[1]}` };
  const inScope = table.dongs.filter((d) => d.sido === sido && scope.some((g) => g.name === d.sigungu));
  // 법정동 = an item of ORG_RDNDA "(…)" that is a 법정동/리 of this 시군구 (building names are skipped).
  const items = (row.ORG_RDNDA?.match(/\(([^)]*)\)/)?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  let legal = items.find((it) => inScope.some((d) => d.legal.some(([, n]) => n === it)));
  // NEIS gave no 법정동: take it from 주소정보누리집 for the same road address (still checked against the official table).
  let viaJuso: { legal: string; hemd: string } | undefined;
  if (!legal && !site) {
    viaJuso = await jusoLookup(addr, sigungu);
    if (viaJuso && inScope.some((d) => d.legal.some(([, n]) => n === viaJuso!.legal))) legal = viaJuso.legal;
  }
  if (!legal) {
    if (site) return { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: site.code, reason: "NEIS에 법정동 없음 — 기존 주소정보누리집 확인값" };
    return { ...rec, reason: `NEIS 상세주소에 법정동 없음 (${row.ORG_RDNDA ?? "-"})` };
  }
  rec.legalDong = legal;
  const candidates = inScope.filter((d) => d.legal.some(([, n]) => n === legal));
  if (site) {
    const ok = candidates.some((c) => c.name === site.name) || KNOWN_NEIS_MISMATCH[base.schoolSlug] !== undefined;
    if (ok && !candidates.some((c) => c.name === site.name)) {
      return { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: site.code, reason: KNOWN_NEIS_MISMATCH[base.schoolSlug] };
    }
    return ok
      ? { ...rec, status: "resolved", method: "site-verified" as SchoolDongRecord["method"], dongName: site.name, dongCode: candidates.find((c) => c.name === site.name)!.code }
      : { ...rec, reason: `기존 행정동 ${site.name}이 법정동 ${legal}의 공식 행정동(${candidates.map((c) => c.name).join("·")})에 없음`, candidates: candidates.map((c) => c.name) };
  }
  if (candidates.length === 1) {
    return { ...rec, status: "resolved", method: "legal-dong-unique", dongCode: candidates[0].code, dongName: candidates[0].name };
  }
  const hemd = (viaJuso ?? (await jusoLookup(addr, sigungu)))?.hemd;
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

const NATIONAL_OUT = "data/official/national-school-dongs.json";
const NATIONAL_STATS = "data/official/national-school-dong-stats.json";
/** Per-school results of --national, appended after every chunk; a rerun skips codes already here (FAILED is retried). */
const NATIONAL_CHECKPOINT = ".cache/official/national-school-dongs.jsonl";

type NationalState = "CONFIRMED" | "PENDING" | "FAILED" | "EXCLUDED";
type NationalRecord = Omit<SchoolDongRecord, "schoolSlug"> & { atpt: string; level: string; state: NationalState };

const argNum = (name: string, fallback: number) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? Number(process.argv[i + 1]) : fallback;
};
const mb = (n: number) => Math.round(n / 1048576);

/** Latest line per NEIS code (a retried FAILED school is replaced by its newer line). */
function readCheckpoint(): Map<string, NationalRecord> {
  const m = new Map<string, NationalRecord>();
  if (!existsSync(NATIONAL_CHECKPOINT)) return m;
  for (const line of readFileSync(NATIONAL_CHECKPOINT, "utf-8").split("\n")) {
    if (!line.trim()) continue;
    const r = JSON.parse(line) as NationalRecord;
    m.set(r.neisCode!, r);
  }
  return m;
}

async function nationalRecord(row: NeisRow): Promise<NationalRecord> {
  const extra = { atpt: row.ATPT_OFCDC_SC_CODE, level: row.SCHUL_KND_SC_NM };
  try {
    const r: Partial<SchoolDongRecord> = await resolveRow(row, { schoolSlug: "", schoolName: row.SCHUL_NM, status: "pending" });
    delete r.schoolSlug;
    return { ...(r as SchoolDongRecord), ...extra, state: r.status === "resolved" ? "CONFIRMED" : "PENDING" };
  } catch (e) {
    const msg = (e as Error).message;
    // Key / system errors stop the run (the chunk so far is still saved); anything else is FAILED and retried next run.
    if (/^JUSO (E0001|E0014|-999|no response)/.test(msg)) throw e;
    return { schoolName: row.SCHUL_NM, neisCode: row.SD_SCHUL_CODE, roadAddress: row.ORG_RDNMA.trim(), status: "pending", reason: `요청 실패: ${msg}`, ...extra, state: "FAILED" };
  }
}

/**
 * --national: every NEIS 초·중·고 (needs NEIS_API_KEY; pages of 1000, cached) → 행정동 with the same rules as above.
 * Excluded before mapping: "(가칭)" names, rows without a road address, 설립일 in the future (미개교), duplicate codes.
 * NEIS 학교기본정보 has no 운영/폐교 field — the list is what NEIS currently publishes; nothing else is inferred.
 *
 * Memory-safe and resumable: schools are resolved in chunks (--chunk N, default 200) and each chunk is appended to
 * NATIONAL_CHECKPOINT before the next starts, so only one chunk of results is held. --max-chunks N ends the process
 * after N chunks (run it again to continue). Once every school has a line, the checkpoint is consolidated into
 * data/official/national-school-dongs.json + national-school-dong-stats.json (with --write); src/data/schools.ts is never touched.
 */
async function national() {
  if (!process.env.NEIS_API_KEY) throw new Error("--national needs NEIS_API_KEY (keyless NEIS returns 5 rows)");
  const chunkSize = argNum("--chunk", 200);
  const maxChunks = argNum("--max-chunks", Infinity);
  const kinds = ["초등학교", "중학교", "고등학교"] as const;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const seen = new Map<string, NeisRow>();
  const excluded = new Map<string, number>();
  const excludedRecords: NationalRecord[] = [];
  const excludedKeys = new Set<string>();
  const ex = (k: string, row?: NeisRow) => {
    // A row NEIS lists twice is one school ((가칭) rows share placeholder codes, so the name is part of the key).
    if (row && excludedKeys.has(`${row.SD_SCHUL_CODE}|${row.SCHUL_NM}`)) return ex("중복 코드");
    if (row) excludedKeys.add(`${row.SD_SCHUL_CODE}|${row.SCHUL_NM}`);
    excluded.set(k, (excluded.get(k) ?? 0) + 1);
    if (row) excludedRecords.push({ schoolName: row.SCHUL_NM, neisCode: row.SD_SCHUL_CODE, roadAddress: row.ORG_RDNMA?.trim() || undefined, status: "pending", reason: k, atpt: row.ATPT_OFCDC_SC_CODE, level: row.SCHUL_KND_SC_NM, state: "EXCLUDED" });
  };
  let fetched = 0;
  for (const atpt of Object.values(ATPT)) {
    for (const k of kinds) {
      for (let p = 1; ; p++) {
        const q = { ATPT_OFCDC_SC_CODE: atpt, SCHUL_KND_SC_NM: k, pIndex: String(p), pSize: "1000" };
        const r = await neis(q, `national-${atpt}-${k}-p${p}`);
        fetched += r.rows.length;
        for (const row of r.rows) {
          if (row.SCHUL_KND_SC_NM !== k) ex("학교급 불일치", row);
          else if (/가칭/.test(row.SCHUL_NM)) ex("(가칭)", row);
          else if (!row.ORG_RDNMA?.trim()) ex("주소 없음", row);
          else if (row.FOND_YMD && row.FOND_YMD > today) ex("미개교(설립일 이후)", row);
          // NEIS sometimes lists a school before it opens with the plan in its official name ("…(개교예정)").
          else if (/개교예정|신설예정/.test(row.SCHUL_NM)) ex("미개교(학교명에 개교예정)", row);
          else if (seen.has(row.SD_SCHUL_CODE)) ex("중복 코드");
          else seen.set(row.SD_SCHUL_CODE, row);
        }
        if (p * 1000 >= r.total) break;
      }
    }
  }
  console.log(`NEIS 수집 ${fetched} → 매핑 대상 ${seen.size}; 제외 ${[...excluded].map(([k, v]) => `${k} ${v}`).join(", ") || "0"}`);

  const done = readCheckpoint();
  // --retry-pending re-resolves PENDING schools too (after a rule fix; cached answers make it cheap).
  const retry = new Set<NationalState>(process.argv.includes("--retry-pending") ? ["FAILED", "PENDING"] : ["FAILED"]);
  const todo = [...seen.values()].filter((r) => retry.has(done.get(r.SD_SCHUL_CODE)?.state ?? "FAILED"));
  done.clear();
  console.log(`checkpoint: 처리됨 ${seen.size - todo.length} · 남음 ${todo.length} (chunk ${chunkSize}${Number.isFinite(maxChunks) ? `, 이번 실행 최대 ${maxChunks} chunk` : ""})`);
  const t0 = Date.now();
  let peak = 0;
  let processed = 0;
  for (let c = 0; c < maxChunks && processed < todo.length; c++) {
    const lines: string[] = [];
    try {
      for (const row of todo.slice(processed, processed + chunkSize)) lines.push(JSON.stringify(await nationalRecord(row)));
    } finally {
      if (lines.length) appendFileSync(NATIONAL_CHECKPOINT, lines.join("\n") + "\n");
      processed += lines.length;
    }
    const m = process.memoryUsage();
    peak = Math.max(peak, m.rss);
    console.log(`  chunk ${c + 1}: ${processed}/${todo.length} · rss ${mb(m.rss)}MB heap ${mb(m.heapUsed)}MB · JUSO cache ${hits.juso} / live ${hits.jusoLive} · ${Math.round((Date.now() - t0) / 1000)}s`);
  }
  console.log(`이번 실행: ${processed}건, peak rss ${mb(peak)}MB`);
  if (processed < todo.length) return console.log(`미완료 — 남은 ${todo.length - processed}건은 다시 실행하면 이어서 처리`);
  consolidate([...seen.keys()], excludedRecords, Object.fromEntries(excluded));
}

/** Checkpoint → per-state / 시도 / 시군구 / 행정동 statistics (+ the two JSON files with --write). */
function consolidate(codes: string[], excludedRecords: NationalRecord[], excluded: Record<string, number>) {
  const cp = readCheckpoint();
  const out = [...codes.map((c) => cp.get(c)!), ...excludedRecords];
  const sidoOf = (atpt: string) => Object.keys(ATPT).find((s) => ATPT[s] === atpt)!;
  const states: NationalState[] = ["CONFIRMED", "PENDING", "FAILED", "EXCLUDED"];
  const count = (rs: NationalRecord[]) => Object.fromEntries(states.map((s) => [s, rs.filter((r) => r.state === s).length]));
  console.log(`전국 ${out.length}: ${states.map((s) => `${s} ${out.filter((r) => r.state === s).length}`).join(" / ")}`);

  const bySido: Record<string, Record<string, number>> = {};
  for (const sido of Object.keys(ATPT)) bySido[sido] = count(out.filter((r) => sidoOf(r.atpt) === sido));
  for (const [s, v] of Object.entries(bySido)) console.log(`  ${s}: ${states.map((k) => `${k[0]}${v[k]}`).join(" ")}`);
  const reasons = new Map<string, number>();
  for (const p of out.filter((r) => r.state === "PENDING" || r.state === "FAILED")) {
    const k = `${p.state} — ${p.reason!.replace(/[:(].*$/, "").trim()}`;
    reasons.set(k, (reasons.get(k) ?? 0) + 1);
  }
  for (const [k, v] of reasons) console.log(`  ${k}: ${v}`);

  // 행정동 counts over the whole official table (CONFIRMED only), so 0-school 동 are counted too.
  const table = adminTable();
  const perDong = new Map<string, number>();
  for (const r of out) if (r.state === "CONFIRMED" && r.dongCode) perDong.set(r.dongCode, (perDong.get(r.dongCode) ?? 0) + 1);
  const bySigungu: Record<string, number> = {};
  const buckets = { zero: 0, one: 0, twoPlus: 0 };
  for (const d of table.dongs) {
    const n = perDong.get(d.code) ?? 0;
    bySigungu[`${d.sido} ${d.sigungu}`] = (bySigungu[`${d.sido} ${d.sigungu}`] ?? 0) + n;
    buckets[n === 0 ? "zero" : n === 1 ? "one" : "twoPlus"]++;
  }
  const known = new Set(table.dongs.map((d) => d.code));
  const unknownDong = [...perDong.keys()].filter((c) => !known.has(c));
  console.log(`행정동 ${table.dongs.length}: 학교 0곳 ${buckets.zero} / 1곳 ${buckets.one} / 2곳 이상 ${buckets.twoPlus}${unknownDong.length ? ` · 표에 없는 코드 ${unknownDong.length}` : ""}`);

  // Cross-check with the registered-school run (same NEIS code must give the same 행정동).
  if (existsSync(OUT)) {
    const byCode = new Map(out.map((r) => [r.neisCode, r]));
    const reg: SchoolDongRecord[] = JSON.parse(readFileSync(OUT, "utf-8")).records;
    let same = 0, differ = 0;
    for (const r of reg) {
      const n = byCode.get(r.neisCode);
      if (!n || r.status !== "resolved" || n.state !== "CONFIRMED") continue;
      if (n.dongCode === r.dongCode) same++;
      else {
        differ++;
        console.log(`  ! 등록 학교 불일치 ${r.schoolName}: 등록 ${r.dongName} / 전국 ${n.dongName}`);
      }
    }
    console.log(`등록 학교 교차검증: 일치 ${same} / 불일치 ${differ}`);
  }

  if (process.argv.includes("--write")) {
    const lines = out.map((r) => JSON.stringify(r));
    writeFileSync(
      NATIONAL_OUT,
      `{"adminDongTable":${JSON.stringify(table.source)},"generatedFrom":"NEIS 학교기본정보(초·중·고) + 행정안전부 KIKmix + 주소정보누리집 도로명주소 API","excluded":${JSON.stringify(excluded)},"records":[\n${lines.join(",\n")}\n]}\n`,
    );
    const dongs = table.dongs.filter((d) => perDong.has(d.code)).map((d) => ({ code: d.code, sido: d.sido, sigungu: d.sigungu, name: d.name, schools: perDong.get(d.code)! }));
    writeFileSync(NATIONAL_STATS, JSON.stringify({ adminDongTable: table.source, total: out.length, states: count(out), bySido, dongBuckets: buckets, bySigungu, dongs }, null, 1) + "\n");
    console.log(`wrote ${NATIONAL_OUT}, ${NATIONAL_STATS}`);
  } else console.log("dry run (pass --write to save)");
}

async function main() {
  if (process.argv.includes("--national-counts")) return nationalCounts();
  if (process.argv.includes("--national")) return national();
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
