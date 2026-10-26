/**
 * National school candidates → site school data. Registering a school and creating its routes are separate steps:
 * the candidate list covers every NEIS school but nothing in it reaches the app; only --promote writes schools into
 * src/data/schools.imported.ts (and therefore creates /school/[slug] routes), one 행정동 batch at a time.
 *
 *   npx tsx scripts/official/school-import.ts                       # dry run: build candidates, diff vs the saved list
 *   npx tsx scripts/official/school-import.ts --write               # save data/official/school-candidates.json + slug registry
 *   npx tsx scripts/official/school-import.ts --dongs [--top 40]    # rank candidate 행정동 for the next dong batch
 *   npx tsx scripts/official/school-import.ts --promote <dongCode,...> [--write]   # register those 행정동's schools
 *   npx tsx scripts/official/school-import.ts --summary             # route / sitemap / noindex counts (before/after a promote)
 *
 * Identity is the NEIS school code. Slugs come from data/official/school-slugs.json, which is only ever appended to:
 * a code keeps its slug forever, and the 190 schools registered before the import keep their existing slugs/URLs.
 * New slugs are the romanized name (+ city, + code on collision), e.g. "seoulmokdong-elementary-school".
 *
 * Route protection for promoted schools:
 *   - availableSubjectSlugs is empty → no /school/[slug]/[subject] routes (those need written content anyway);
 *     the school page itself exists (noindex until it has published content, src/lib/indexability.ts).
 *   - only into cities that already have combination routes (src/lib/regionRoutes.ts), so a first school in a
 *     school-less city can never switch on ~27 template routes or its hub's index gate.
 *   - only CONFIRMED schools (address → one official 행정동) whose 학교알리미 2026년 3차 공시 was actually fetched
 *     (data/official/... manifest, term 3 with files) — the operating check; anything else stays a candidate.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { regions, getRegionBySlug } from "@/data/regions";
import { dongs } from "@/data/dongs";
import { schools } from "@/data/schools";
import { hasRegionComboRoutes } from "@/lib/regionRoutes";
import { loadAdminDongTable, officialSigunguNames } from "./lib/admin-dong-table";
import { disclosedFromManifest, previouslyDisclosed, resolveOperating } from "./lib/operating";

const NATIONAL = "data/official/national-school-dongs.json";
const REGISTERED = "data/official/school-dongs.json";
const CANDIDATES = "data/official/school-candidates.json";
const SLUGS = "data/official/school-slugs.json";
const IMPORTED_TS = "src/data/schools.imported.ts";
const NEIS_CACHE = ".cache/official/neis";
const SCHOOLINFO_MANIFEST = ".cache/official/schoolinfo/manifest.json";

type Level = "초등학교" | "중학교" | "고등학교";
interface NationalRecord {
  schoolName: string;
  neisCode: string;
  roadAddress?: string;
  legalDong?: string;
  sigungu?: string;
  state: "CONFIRMED" | "PENDING" | "FAILED" | "EXCLUDED";
  dongCode?: string;
  dongName?: string;
  reason?: string;
  atpt: string;
  level: Level;
}
export interface SchoolCandidate {
  code: string;
  name: string;
  level: Level;
  /** 시도교육청 코드 (NEIS ATPT_OFCDC_SC_CODE). */
  office: string;
  state: NationalRecord["state"];
  /** registered = already in src/data/schools.ts(.imported); candidate = CONFIRMED and inside a site city;
   *  unmapped-region = CONFIRMED but its 시군구 has no site RegionNode (광주·전남 통합, 세종 …). */
  status: "registered" | "candidate" | "unmapped-region" | "pending" | "excluded";
  slug: string;
  sigungu?: string;
  dongCode?: string;
  dongName?: string;
  citySlug?: string;
  districtSlug?: string;
  /** 학교알리미 2026년 3차 공시를 받아 본 학교만 "disclosed-2026-3"; 나머지는 운영 여부 미확인. */
  operating: "disclosed-2026-3" | "unverified";
  reason?: string;
}

// ── romanization (국어의 로마자 표기법, syllable by syllable; no sound-change rules) ───────────────────────────
const L = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const V = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
const T = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];
export function romanize(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0) - 0xac00;
    if (c >= 0 && c < 11172) out += L[Math.floor(c / 588)] + V[Math.floor((c % 588) / 28)] + T[c % 28];
    else if (/[A-Za-z0-9]/.test(ch)) out += ch.toLowerCase();
  }
  return out;
}
const LEVEL_SUFFIX: Record<Level, string> = { 초등학교: "elementary-school", 중학교: "middle-school", 고등학교: "high-school" };
function baseSlug(name: string, level: Level): string {
  const stem = name.replace(/(초등학교|중학교|고등학교)/g, "");
  return `${romanize(stem) || "school"}-${LEVEL_SUFFIX[level]}`;
}
/** 행정동 slug in the dongs.ts style: "이매1동" → "imae1-dong", "강화읍" → "ganghwa-eup". */
export function dongSlugFor(name: string): string {
  const m = name.match(/^(.*?)(동|읍|면)$/);
  const stem = m ? m[1] : name;
  const kind = m?.[2] === "읍" ? "eup" : m?.[2] === "면" ? "myeon" : "dong";
  return `${romanize(stem.replace(/제(?=\d)/, ""))}-${kind}`;
}

// ── inputs ────────────────────────────────────────────────────────────────────────────────────────────────
function readNational(): NationalRecord[] {
  return JSON.parse(readFileSync(NATIONAL, "utf-8")).records;
}

/** 시군구 name (KIKmix) → site city / district. */
function sigunguIndex(): Map<string, { city: string; district?: string }> {
  const table = loadAdminDongTable();
  const m = new Map<string, { city: string; district?: string }>();
  for (const r of regions.filter((x) => x.level === "city")) {
    const prov = getRegionBySlug(r.parentSlug!)!;
    for (const n of officialSigunguNames(r.slug, table)) m.set(`${prov.fullName}|${n}`, { city: r.slug });
  }
  for (const r of regions.filter((x) => x.level === "district")) {
    const city = getRegionBySlug(r.parentSlug!)!;
    const prov = getRegionBySlug(city.parentSlug!)!;
    for (const n of officialSigunguNames(r.slug, table)) m.set(`${prov.fullName}|${n}`, { city: city.slug, district: r.slug });
  }
  return m;
}

/** NEIS code → the full cached schoolInfo row (설립구분·남녀공학·고교유형·설립일). Read from the --national page cache. */
function neisRows(): Map<string, Record<string, string | null>> {
  const m = new Map<string, Record<string, string | null>>();
  for (const f of readdirSync(NEIS_CACHE).filter((x) => x.startsWith("national-"))) {
    const j = JSON.parse(readFileSync(path.join(NEIS_CACHE, f), "utf-8"));
    for (const r of j.schoolInfo?.[1]?.row ?? []) if (r.SD_SCHUL_CODE) m.set(r.SD_SCHUL_CODE, r);
  }
  return m;
}

/** NEIS codes whose 학교알리미 2026년 3차 4-가 공시 was fetched with at least one file. */
function disclosedCodes(): Set<string> {
  if (!existsSync(SCHOOLINFO_MANIFEST)) return new Set();
  const m = JSON.parse(readFileSync(SCHOOLINFO_MANIFEST, "utf-8")).schools as Record<string, { term?: string; files?: object; error?: string }>;
  return disclosedFromManifest(m);
}

/** Confirmations saved by earlier runs (kept even when this PC's manifest lacks the school). */
function savedDisclosedCodes(): Set<string> {
  return existsSync(CANDIDATES) ? previouslyDisclosed(JSON.parse(readFileSync(CANDIDATES, "utf-8")).records) : new Set();
}

function registeredByCode(): Map<string, string> {
  const m = new Map<string, string>();
  for (const r of JSON.parse(readFileSync(REGISTERED, "utf-8")).records as { schoolSlug: string; neisCode?: string }[]) if (r.neisCode) m.set(r.neisCode, r.schoolSlug);
  for (const s of schools) if (s.official?.code) m.set(s.official.code, s.slug);
  return m;
}

let noCode = 0;

// ── candidates ────────────────────────────────────────────────────────────────────────────────────────────
function buildCandidates(): { list: SchoolCandidate[]; registry: Record<string, string>; newSlugs: number } {
  const registry: Record<string, string> = existsSync(SLUGS) ? JSON.parse(readFileSync(SLUGS, "utf-8")) : {};
  const registered = registeredByCode();
  const taken = new Set([...schools.map((s) => s.slug), ...Object.values(registry)]);
  // Registered schools keep their site slug (never re-derived).
  for (const [code, slug] of registered) if (!registry[code]) registry[code] = slug;
  const idx = sigunguIndex();
  const disclosed = disclosedCodes();
  const savedDisclosed = savedDisclosedCodes();
  // NEIS lists (가칭)/개교예정 rows with a blank code (7 spaces): no identity, so they are counted but not listed.
  const all = readNational();
  const recs = all.filter((r) => r.neisCode?.trim()).sort((a, b) => a.neisCode.localeCompare(b.neisCode));
  noCode = all.length - recs.length;
  let newSlugs = 0;
  const list: SchoolCandidate[] = [];
  for (const r of recs) {
    // 법정동 split cases list several 시군구 ("부천시 원미구|…"); the 행정동 decides which one, so map by the dong's row.
    const where = r.dongCode ? dongRow(r.dongCode) : undefined;
    // Keyed by KIKmix 시도 vs the site province fullName: they differ for 전남광주통합특별시 (site: 광주·전남), which
    // therefore stays unmapped-region until that structure is decided (docs/qa/…gwangju…).
    const region = where ? idx.get(`${where.sido}|${where.sigungu}`) : undefined;
    if (!registry[r.neisCode]) {
      const base = baseSlug(r.schoolName, r.level);
      let slug = base;
      if (taken.has(slug)) slug = `${base}-${region?.city ?? r.atpt.toLowerCase()}`;
      if (taken.has(slug)) slug = `${base}-${r.neisCode}`;
      registry[r.neisCode] = slug;
      taken.add(slug);
      newSlugs++;
    }
    const status: SchoolCandidate["status"] = registered.has(r.neisCode)
      ? "registered"
      : r.state === "EXCLUDED"
        ? "excluded"
        : r.state !== "CONFIRMED"
          ? "pending"
          : region
            ? "candidate"
            : "unmapped-region";
    list.push({
      code: r.neisCode,
      name: r.schoolName,
      level: r.level,
      office: r.atpt,
      state: r.state,
      status,
      slug: registry[r.neisCode],
      sigungu: where?.sigungu ?? r.sigungu,
      dongCode: r.dongCode,
      dongName: r.dongName,
      citySlug: region?.city,
      districtSlug: region?.district,
      operating: resolveOperating(r.neisCode, disclosed, savedDisclosed),
      reason: r.state === "CONFIRMED" ? (region ? undefined : `사이트 지역 노드 없음: ${where?.sido} ${where?.sigungu}`) : r.reason,
    });
  }
  return { list, registry, newSlugs };
}

let dongMemo: Map<string, { sido: string; sigungu: string; name: string; legal: [string, string][] }> | undefined;
function dongRow(code: string) {
  dongMemo ??= new Map(loadAdminDongTable().dongs.map((d) => [d.code, d]));
  return dongMemo.get(code);
}
function diff(prev: SchoolCandidate[], next: SchoolCandidate[]): string[] {
  const p = new Map(prev.map((c) => [c.code, c]));
  const n = new Map(next.map((c) => [c.code, c]));
  const added = next.filter((c) => !p.has(c.code)).length;
  const removed = prev.filter((c) => !n.has(c.code)).length;
  const changed = next.filter((c) => p.has(c.code) && JSON.stringify(p.get(c.code)) !== JSON.stringify(c));
  const slugChanged = changed.filter((c) => p.get(c.code)!.slug !== c.slug);
  return [
    `diff vs ${CANDIDATES}: +${added} / -${removed} / changed ${changed.length} (slug changed ${slugChanged.length})`,
    ...changed.slice(0, 10).map((c) => `  ~ ${c.code} ${c.name}: ${Object.keys(c).filter((k) => JSON.stringify((p.get(c.code) as never)[k]) !== JSON.stringify((c as never)[k])).join(",")}`),
  ];
}

function report(list: SchoolCandidate[]) {
  const by = (k: keyof SchoolCandidate) => {
    const m = new Map<string, number>();
    for (const c of list) m.set(String(c[k]), (m.get(String(c[k])) ?? 0) + 1);
    return [...m].map(([a, b]) => `${a} ${b}`).join(" · ");
  };
  console.log(`학교 ${list.length}: ${by("status")}`);
  console.log(`  운영 확인(학교알리미 2026년 3차 공시): ${by("operating")}`);
  const unmapped = new Map<string, number>();
  for (const c of list.filter((x) => x.status === "unmapped-region")) unmapped.set(c.reason!, (unmapped.get(c.reason!) ?? 0) + 1);
  for (const [k, v] of [...unmapped].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`  unmapped — ${k}: ${v}`);
}

// ── dong ranking ──────────────────────────────────────────────────────────────────────────────────────────
const SIDO_PRIORITY: Record<string, number> = { B10: 3, J10: 2, E10: 1.5, C10: 1, D10: 1, F10: 1, G10: 1, H10: 1 };
function rankDongs(list: SchoolCandidate[], top: number) {
  const have = new Set(dongs.map((d) => d.code));
  const groups = new Map<string, SchoolCandidate[]>();
  for (const c of list) {
    if (!c.dongCode || c.state !== "CONFIRMED" || !c.citySlug || have.has(c.dongCode)) continue;
    groups.set(c.dongCode, [...(groups.get(c.dongCode) ?? []), c]);
  }
  const rows = [...groups].map(([code, cs]) => {
    const levels = new Set(cs.map((c) => c.level)).size;
    const reg = cs.filter((c) => c.status === "registered").length;
    const disclosed = cs.filter((c) => c.operating === "disclosed-2026-3").length;
    const combos = hasRegionComboRoutes(cs[0].citySlug!);
    const score = (cs.length >= 2 ? 1 : 0) * (SIDO_PRIORITY[cs[0].office] ?? 0.5) * 10 + levels * 2 + Math.min(cs.length, 6) + reg + disclosed * 2 + (combos ? 3 : -20);
    return { code, name: cs[0].dongName!, city: cs[0].citySlug!, sigungu: cs[0].sigungu, n: cs.length, levels, reg, disclosed, combos, score, cs };
  });
  rows.sort((a, b) => b.score - a.score || a.code.localeCompare(b.code));
  console.log(`후보 행정동 (CONFIRMED 학교, 사이트 도시 안, 동 페이지 없음): ${rows.length}, 학교 2곳 이상 ${rows.filter((r) => r.n >= 2).length}`);
  for (const r of rows.slice(0, top)) {
    console.log(`${r.score.toFixed(0).padStart(3)} ${r.code} ${r.sigungu} ${r.name} [${r.city}] 학교 ${r.n} (급 ${r.levels}, 등록 ${r.reg}, 공시확인 ${r.disclosed}${r.combos ? "" : ", 도시 조합 route 없음"}): ${r.cs.map((c) => c.name).join(", ")}`);
  }
}

// ── promote ───────────────────────────────────────────────────────────────────────────────────────────────
function promote(list: SchoolCandidate[], dongCodes: string[]) {
  const rows = neisRows();
  // Normalized to LF so the append point is found whatever line endings the file was checked out with.
  const prev: string = existsSync(IMPORTED_TS) ? readFileSync(IMPORTED_TS, "utf-8").replace(/\r\n/g, "\n") : "";
  const already = new Set([...prev.matchAll(/code: "(\d+)"/g)].map((m) => m[1]));
  const add: string[] = [];
  const skipped: string[] = [];
  for (const dc of dongCodes) {
    const d = dongRow(dc);
    if (!d) throw new Error(`공식 행정동 코드 아님: ${dc}`);
    for (const c of list.filter((x) => x.dongCode === dc && x.state === "CONFIRMED")) {
      if (c.status === "registered" || already.has(c.code)) continue;
      if (c.status !== "candidate") { skipped.push(`${c.name}: ${c.status}`); continue; }
      if (c.operating !== "disclosed-2026-3") { skipped.push(`${c.name}: 학교알리미 2026년 3차 공시 미확인`); continue; }
      if (!hasRegionComboRoutes(c.citySlug!)) { skipped.push(`${c.name}: ${c.citySlug}에 등록 학교 없음(조합 route 보호)`); continue; }
      const r = rows.get(c.code);
      const n = national().get(c.code);
      if (!r || !n?.roadAddress || !n.legalDong) { skipped.push(`${c.name}: NEIS 행/주소 없음`); continue; }
      const coed = r.COEDU_SC_NM === "남" ? "남학교" : r.COEDU_SC_NM === "여" ? "여학교" : "남녀공학";
      const hs = c.level === "고등학교" && r.HS_SC_NM ? (r.HS_SC_NM === "특목고" && r.SPCLY_PURPS_HS_ORD_NM ? `특목고(${r.SPCLY_PURPS_HS_ORD_NM})` : r.HS_SC_NM) : undefined;
      const f = String(r.FOND_YMD ?? "");
      const official = [
        `code: "${c.code}"`,
        `office: "${c.office}"`,
        `roadAddress: ${JSON.stringify(n.roadAddress)}`,
        `legalDong: ${JSON.stringify(n.legalDong)}`,
        `foundation: ${JSON.stringify(r.FOND_SC_NM)}`,
        `coed: "${coed}"`,
        ...(hs ? [`highSchoolType: ${JSON.stringify(hs)}`] : []),
        `founded: "${f.slice(0, 4)}-${f.slice(4, 6)}-${f.slice(6, 8)}"`,
      ];
      add.push(
        `  imported(${JSON.stringify(c.slug)}, ${JSON.stringify(c.name)}, ${JSON.stringify(c.citySlug)}, ${c.districtSlug ? JSON.stringify(c.districtSlug) : "undefined"}, "${c.level}", ${JSON.stringify(dongSlugFor(d.name))}, { ${official.join(", ")} }), // ${d.sigungu} ${d.name}`,
      );
    }
  }
  console.log(`promote ${dongCodes.length}개 동: 신규 등록 ${add.length}개교 → route +${add.length} (학교 페이지만, 과목 route 0), skip ${skipped.length}`);
  for (const s of skipped) console.log(`  skip ${s}`);
  for (const a of add) console.log(`  + ${a.trim().slice(0, 150)}`);
  if (!process.argv.includes("--write") || add.length === 0) return console.log(add.length ? "dry run (pass --write to save)" : "nothing to add");
  if (prev && !prev.includes("\n];\n")) throw new Error(`${IMPORTED_TS}: array end not found`);
  const body = prev ? prev.replace(/\n\];\n[\s\S]*$/, `\n${add.join("\n")}\n];\n`) + tailOf(prev) : header() + add.join("\n") + "\n];\n" + footer();
  writeFileSync(IMPORTED_TS, body);
  console.log(`wrote ${IMPORTED_TS}`);
}
let natMemo: Map<string, NationalRecord> | undefined;
const national = () => (natMemo ??= new Map(readNational().map((r) => [r.neisCode, r])));
function tailOf(prev: string): string {
  return prev.slice(prev.indexOf("\n];\n") + 4);
}
function header(): string {
  return `import type { OfficialSchoolRecord, School } from "@/data/schools";

/**
 * Schools registered from the national candidate list (scripts/official/school-import.ts --promote) — generated,
 * append-only; edit through the script. Each entry is a CONFIRMED NEIS school (도로명주소 → one official 행정동,
 * data/official/national-school-dongs.json) whose 학교알리미 2026년 3차 공시 was fetched (operating check).
 * availableSubjectSlugs is empty on purpose: no school×subject routes until written content exists.
 */
export const importedSchools: School[] = [
`;
}
function footer(): string {
  return `
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
`;
}

async function main() {
  if (process.argv.includes("--summary")) {
    const { computeSummary } = await import("../lib/route-inventory");
    const s = computeSummary();
    return console.log(`Routes ${s.totalRoutes} · Sitemap ${s.sitemapCount} · Noindex ${s.noindexCount}`);
  }
  const { list, registry, newSlugs } = buildCandidates();
  const slugs = Object.values(registry);
  if (new Set(slugs).size !== slugs.length) throw new Error("slug registry has duplicates");
  const pi = process.argv.indexOf("--promote");
  if (pi > 0) return promote(list, process.argv[pi + 1].split(","));
  if (process.argv.includes("--dongs")) return rankDongs(list, Number(process.argv[process.argv.indexOf("--top") + 1]) || 40);
  report(list);
  console.log(`  학교코드 없는 NEIS 행((가칭)·개교예정, 목록 제외): ${noCode}`);
  console.log(`slug registry: ${slugs.length} (new ${newSlugs})`);
  if (existsSync(CANDIDATES)) diff(JSON.parse(readFileSync(CANDIDATES, "utf-8")).records, list).forEach((l) => console.log(l));
  if (process.argv.includes("--write")) {
    writeFileSync(SLUGS, JSON.stringify(Object.fromEntries(Object.entries(registry).sort()), null, 0).replace(/,"/g, ',\n"') + "\n");
    writeFileSync(
      CANDIDATES,
      `{"generatedFrom":"${NATIONAL} + ${REGISTERED} + regions.ts + 학교알리미 manifest","records":[\n${list.map((c) => JSON.stringify(c)).join(",\n")}\n]}\n`,
    );
    console.log(`wrote ${CANDIDATES}, ${SLUGS}`);
  } else console.log("dry run (pass --write to save)");
}

main();
