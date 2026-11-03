/**
 * RED / AMBER / GREEN quality gate for the programmatic combination pages
 * (region×subject, region×grade×subject, school×subject, and — since the
 * 2026-10-16 의정부 pilot — 행정동 hub and 행정동×subject pages). Read-only: it grades
 * the data, it does not change indexability — that stays in
 * src/lib/indexability.ts and is decided per policy after reviewing this report.
 *
 * Similarity is measured on *masked* text: every school / region name is
 * replaced by a placeholder first, so two entries that differ only by the
 * names they mention score ~100% ("이름만 바꾼 문서"). Similarity alone never
 * makes an entry GREEN — sources, substantive notes and structural conditions
 * are checked too.
 *
 * GREEN: ≥2 substantive notes, sources listed, masked nearest-neighbour
 *        similarity ≤ 30%, structural conditions met (school of that level
 *        registered in the region, grade×subject playbook exists).
 * AMBER: no hard failure, but at least one GREEN condition missing.
 * RED:   no substantive note, masked similarity > 60%, or a structural
 *        condition that makes the page misleading (e.g. no school of that
 *        level registered in the region).
 */
import { regions, getRegionUrl } from "@/data/regions";
import { schools } from "@/data/schools";
import { regionSubjectContents } from "@/data/regionSubjectContent";
import { regionGradeSubjectContents } from "@/data/regionGradeSubjectContent";
import { schoolSubjectContents } from "@/data/schoolSubjectContent";
import { getGradeSubjectPlaybook } from "@/data/gradeSubjectPlaybook";
import { schoolLevelToGradeSlug } from "@/lib/schoolHierarchy";
import { getIndexability } from "@/lib/indexability";
import { tokenSimilarity } from "./content-quality";
import { qualityNoindexPaths } from "@/data/qualityNoindex";
import { schoolSubjectNoindexPaths } from "@/data/schoolSubjectNoindex";
import { dongs } from "@/data/dongs";
import { subjects } from "@/data/subjects";
import { hasDongSubjectRoute } from "@/data/dongSubjectContent";
import { buildDongHubContent, buildDongSubjectContent, getDongSchools } from "@/lib/dongContent";
import { schoolGradeSubjectContents, isPublishedGradeSubject } from "@/data/schoolGradeSubjectContent";
import { schoolGradeNoindexPaths } from "@/data/schoolGradeNoindex";
import { getSchoolGradeGeo } from "@/data/schoolGradeGeo";
import { allSchoolGradeRoutes, buildSchoolGradeContent, groupAssessmentsByCourse, resolveSchoolGrade } from "@/lib/schoolGrade";

export type QualityGrade = "GREEN" | "AMBER" | "RED";

export const QUALITY_KINDS = [
  "region-subject",
  "region-grade-subject",
  "school-subject",
  "region-dong",
  "region-dong-subject",
  "school-grade",
  "school-grade-subject",
] as const;
export type QualityKind = (typeof QUALITY_KINDS)[number];

export interface QualityRow {
  kind: QualityKind;
  path: string;
  indexed: boolean;
  /** True only for a status "draft" entry graded by a dry run (includeDrafts); never indexed. */
  draft?: boolean;
  grade: QualityGrade;
  nearest: number; // masked nearest-neighbour similarity within the same kind, 0~1
  reasons: string[];
}

const RED_SIMILARITY = 0.6;
const GREEN_SIMILARITY = 0.3;

/**
 * A note that only points to another page ("○○ 페이지에서 확인해보세요")
 * carries no information of its own. Must mention "페이지" (not 홈페이지) — generic advice
 * like "학교 교육과정 안내를 함께 확인" is real content, not a pointer.
 */
function isPointerNote(body: string): boolean {
  // "학교 홈페이지" is an external source to check, not a pointer to our own page.
  return /(?<!홈)페이지/.test(body) && /(안내|함께|참고|확인)/.test(body);
}

const names = [
  ...schools.map((s) => s.name),
  ...regions.flatMap((r) => [r.fullName, r.name, r.name.replace(/(구|군|시)$/, "")]),
  // 행정동·법정동 names, so dong pages that differ only by the dong they name score ~100%.
  ...dongs.flatMap((d) => [d.name, ...d.legalDongs]),
]
  .filter((n) => n.length >= 2)
  .sort((a, b) => b.length - a.length); // longest first so "서울양천초등학교" masks before "양천"

function mask(text: string): string {
  let out = text;
  for (const n of names) out = out.split(n).join("〔이름〕");
  return out;
}

interface Candidate {
  kind: QualityRow["kind"];
  path: string;
  indexed: boolean;
  draft?: boolean;
  text: string;
  notes: { title: string; body: string }[];
  sources: readonly unknown[];
  structural: { red: string[]; amber: string[] };
}

/**
 * `pool`: texts of other kinds the candidates are also compared against (stricter, never looser) — used so a
 * school×학년×과목 page cannot pass by repeating its school×과목 or 행정동×과목 page.
 */
function grade(candidates: Candidate[], pool: string[] = []): QualityRow[] {
  const masked = candidates.map((c) => mask(c.text));
  const maskedPool = pool.map(mask);
  return candidates.map((c, i) => {
    let nearest = 0;
    for (let j = 0; j < candidates.length; j++) {
      if (i !== j) nearest = Math.max(nearest, tokenSimilarity(masked[i], masked[j]));
    }
    for (const t of maskedPool) nearest = Math.max(nearest, tokenSimilarity(masked[i], t));
    const substantive = c.notes.filter((n) => !isPointerNote(n.body));
    const red = [...c.structural.red];
    const amber = [...c.structural.amber];
    if (c.notes.length === 0) red.push("고유 note 없음");
    else if (substantive.length === 0) red.push("실질 note 0 (안내 링크성 문장뿐)");
    else if (substantive.length < 2) amber.push(`실질 note ${substantive.length}개 (<2)`);
    if (nearest > RED_SIMILARITY) red.push(`이름 마스킹 유사도 ${(nearest * 100).toFixed(0)}% (>60%)`);
    else if (nearest > GREEN_SIMILARITY) amber.push(`이름 마스킹 유사도 ${(nearest * 100).toFixed(0)}% (>30%)`);
    if (c.sources.length === 0) amber.push("출처(sources) 없음");
    const g: QualityGrade = red.length ? "RED" : amber.length ? "AMBER" : "GREEN";
    return {
      kind: c.kind,
      path: c.path,
      indexed: c.indexed,
      ...(c.draft ? { draft: true } : {}),
      grade: g,
      nearest,
      reasons: [...red, ...amber],
    };
  });
}

function cityPath(slug: string): string {
  return getRegionUrl(slug);
}

/**
 * includeDrafts (dry run only): also grades status "draft" region×grade×subject
 * entries as if published, so a candidate can be scored before it is switched
 * on. Drafts stay noindex (getIndexability ignores them) and never enter the
 * validators' default run, which keeps calling runQualityGate() without it.
 */
export function runQualityGate(options: { includeDrafts?: boolean } = {}): QualityRow[] {
  const includeDrafts = options.includeDrafts ?? false;
  const regionSubject: Candidate[] = regionSubjectContents.map((c) => ({
    kind: "region-subject",
    path: `${cityPath(c.regionSlug)}/${c.subjectSlug}`,
    indexed: getIndexability("region-subject", { regionSlug: c.regionSlug, subjectSlug: c.subjectSlug }).index,
    text: [c.intro, ...c.gradeSections.map((s) => s.body), ...(c.localNotes ?? []).map((n) => n.body)].join(" "),
    notes: c.localNotes ?? [],
    sources: c.sources ?? [],
    structural: {
      red: schools.some((s) => s.cityRegionSlug === c.regionSlug) ? [] : ["지역 등록 학교 0"],
      amber: [],
    },
  }));

  const regionGradeSubject: Candidate[] = regionGradeSubjectContents
    .filter((c) => c.status === "published" || includeDrafts)
    .map((c) => {
      const hasLevelSchool = schools.some(
        (s) => s.cityRegionSlug === c.regionSlug && schoolLevelToGradeSlug[s.level] === c.gradeSlug
      );
      return {
        kind: "region-grade-subject",
        path: `${cityPath(c.regionSlug)}/${c.gradeSlug}/${c.subjectSlug}`,
        draft: c.status !== "published",
        indexed: getIndexability("region-grade-subject", {
          regionSlug: c.regionSlug,
          gradeSlug: c.gradeSlug,
          subjectSlug: c.subjectSlug,
        }).index,
        text: [c.intro, ...c.regionSpecificNotes.map((n) => n.body)].join(" "),
        notes: c.regionSpecificNotes,
        sources: c.sources ?? [],
        structural: {
          red: hasLevelSchool ? [] : ["해당 학교급 등록 학교 0"],
          amber: getGradeSubjectPlaybook(c.gradeSlug, c.subjectSlug) ? [] : ["학년×과목 playbook 없음"],
        },
      };
    });

  const schoolSubject: Candidate[] = schoolSubjectContents
    .filter((c) => c.status === "published")
    .map((c) => ({
      kind: "school-subject",
      path: `/school/${c.schoolSlug}/${c.subjectSlug}`,
      indexed: getIndexability("school-subject", { schoolSlug: c.schoolSlug, subjectSlug: c.subjectSlug }).index,
      text: [c.intro, ...c.schoolSpecificNotes.map((n) => n.body)].join(" "),
      notes: c.schoolSpecificNotes,
      sources: c.sources ?? [],
      structural: { red: [], amber: [] },
    }));

  // 행정동 hub / 행정동×subject (src/lib/dongContent.ts): graded on the dong-specific text the
  // page renders (intro + notes); shared layers on the same page are excluded, as for the kinds above.
  // Every dong is graded (there is no draft state) — a page is indexed only if it is not RED.
  const dongCandidates = (kind: "region-dong" | "region-dong-subject") =>
    dongs.flatMap((d) => {
      const city = regions.find((r) => r.slug === d.citySlug);
      if (!city) return [];
      const base = `${cityPath(d.citySlug)}/${d.slug}`;
      const structural = { red: getDongSchools(d).length > 0 ? [] : ["동 등록 학교 0"], amber: [] };
      const toCandidate = (path: string, indexed: boolean, c: ReturnType<typeof buildDongHubContent>): Candidate => ({
        kind,
        path,
        indexed,
        text: [c.intro, ...c.notes.map((n) => n.body)].join(" "),
        notes: c.notes,
        sources: c.sources,
        structural,
      });
      if (kind === "region-dong") {
        return [
          toCandidate(base, getIndexability("region-dong", { regionSlug: d.citySlug, dongSlug: d.slug }).index, buildDongHubContent(d, city.name)),
        ];
      }
      return subjects.filter((s) => hasDongSubjectRoute(d.citySlug, d.slug, s.slug)).map((s) =>
        toCandidate(
          `${base}/${s.slug}`,
          getIndexability("region-dong-subject", { regionSlug: d.citySlug, dongSlug: d.slug, subjectSlug: s.slug }).index,
          buildDongSubjectContent(d, city.name, s)
        )
      );
    });

  // School × 학년 × 과목 and 학년 hub pages (2026-11-02 Phase 2): graded on the entry text the page renders
  // (intro + summary + notes; the 반영 비율 list is the official table itself). Also compared against the
  // school×과목 and 행정동×과목 texts so a page cannot pass by repeating them.
  const schoolGradeSubject: Candidate[] = schoolGradeSubjectContents
    .filter((c) => (c.status === "published" ? isPublishedGradeSubject(c) : includeDrafts))
    .map((c) => {
      const path = `/school/${c.schoolSlug}/${c.grade}/${c.subjectSlug}`;
      const badTotals = groupAssessmentsByCourse(c)
        .filter((g) => g.exam + g.task !== 100)
        .map((g) => `반영 비율 합계 ${g.exam + g.task}% (${g.course || "과목"})`);
      const routeExists = allSchoolGradeRoutes().some((r) => r.schoolSlug === c.schoolSlug && r.grade === c.grade && r.subjectSlug === c.subjectSlug);
      return {
        kind: "school-grade-subject" as const,
        path,
        draft: c.status !== "published",
        indexed: getIndexability("school-grade-subject", { schoolSlug: c.schoolSlug, schoolGrade: String(c.grade), subjectSlug: c.subjectSlug }).index,
        // GEO pilot pages (src/data/schoolGradeGeo.ts) are graded with their visible questions/answers included.
        text: [c.intro, c.summary, ...c.notes.map((n) => n.body), ...(getSchoolGradeGeo(c.schoolSlug, c.grade, c.subjectSlug)?.items.flatMap((i) => [i.question, i.answer]) ?? [])].join(" "),
        notes: c.notes,
        sources: c.sources,
        structural: { red: [...badTotals, ...(routeExists || c.status !== "published" ? [] : ["route 없음(미등록 학교·학년 범위 밖)"])], amber: [] },
      };
    });
  const schoolGradeHub: Candidate[] = allSchoolGradeRoutes()
    .filter((r) => !r.subjectSlug)
    .flatMap((r) => {
      const ctx = resolveSchoolGrade(r.schoolSlug, String(r.grade));
      if (!ctx) return [];
      const built = buildSchoolGradeContent(ctx);
      return [
        {
          kind: "school-grade" as const,
          path: `/school/${r.schoolSlug}/${r.grade}`,
          indexed: getIndexability("school-grade", { schoolSlug: r.schoolSlug, schoolGrade: String(r.grade) }).index,
          text: [built.intro, ...built.cards.map((c) => [c.summary, ...c.tasks].join(" "))].join(" "),
          notes: built.cards.map((c) => ({ title: c.subject.name, body: c.summary })),
          sources: ctx.entries.flatMap((e) => e.content.sources),
          structural: { red: [], amber: [] },
        },
      ];
    });
  const schoolSubjectTexts = schoolSubject.map((c) => c.text);
  const dongSubjectTexts = dongCandidates("region-dong-subject").map((c) => c.text);

  return [
    ...grade(schoolGradeSubject, [...schoolSubjectTexts, ...dongSubjectTexts]),
    ...grade(schoolGradeHub),
    ...grade(regionSubject),
    ...grade(regionGradeSubject),
    ...grade(schoolSubject),
    ...grade(dongCandidates("region-dong")),
    ...grade(dongCandidates("region-dong-subject")),
  ];
}

export function summarizeQualityGate(rows: QualityRow[]): string[] {
  const lines: string[] = [];
  for (const kind of QUALITY_KINDS) {
    const k = rows.filter((r) => r.kind === kind);
    const count = (g: QualityGrade) => k.filter((r) => r.grade === g).length;
    const indexedRed = k.filter((r) => r.indexed && r.grade === "RED").length;
    lines.push(
      `${kind}: GREEN ${count("GREEN")} / AMBER ${count("AMBER")} / RED ${count("RED")} (indexed RED ${indexedRed})`
    );
  }
  return lines;
}

/**
 * src/data/qualityNoindex.ts must hold exactly the gate's RED set: a RED page
 * that is still indexed, or a held page that improved past RED, is a drift.
 */
export function checkQualityNoindexSync(allRows: QualityRow[]): { ok: boolean; issues: string[] } {
  // School 학년 / 학년×과목 holds live in src/data/schoolGradeNoindex.ts (checkSchoolGradeNoindexSync).
  const rows = allRows.filter((r) => r.kind !== "school-grade" && r.kind !== "school-grade-subject");
  const red = new Set(rows.filter((r) => r.grade === "RED").map((r) => r.path));
  const issues: string[] = [];
  for (const p of red) if (!qualityNoindexPaths.has(p)) issues.push(`RED but not held noindex: ${p}`);
  for (const p of qualityNoindexPaths) if (!red.has(p)) issues.push(`held noindex but no longer RED: ${p}`);
  for (const r of rows) if (r.grade === "RED" && r.indexed) issues.push(`RED page still indexed: ${r.path}`);
  return { ok: issues.length === 0, issues };
}

/**
 * src/data/schoolSubjectNoindex.ts (editorial AMBER holds) must stay separate from the
 * RED list: every entry must be a graded school×subject page, not RED, not also in
 * qualityNoindex.ts, and actually noindex.
 */
export function checkSchoolSubjectNoindexHolds(rows: QualityRow[]): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  for (const p of schoolSubjectNoindexPaths) {
    const row = rows.find((r) => r.kind === "school-subject" && r.path === p);
    if (!row) issues.push(`hold is not a published school×subject page: ${p}`);
    else if (row.grade === "RED") issues.push(`hold is RED — move it to qualityNoindex.ts: ${p}`);
    else if (row.indexed) issues.push(`hold is still indexed: ${p}`);
    if (qualityNoindexPaths.has(p)) issues.push(`listed in both noindex lists: ${p}`);
  }
  return { ok: issues.length === 0, issues };
}

/**
 * 행정동 hub / 행정동×subject pages are indexed only at GREEN (2026-10-19). getIndexability() holds RED
 * pages through qualityNoindex.ts; this check makes sure no AMBER dong page is left indexed either —
 * an AMBER dong page must be improved to GREEN or held before it ships. Thresholds are unchanged.
 */
/** Indexed school 학년 / 학년×과목 pages must be GREEN, and src/data/schoolGradeNoindex.ts lists exactly the non-GREEN ones. */
export function checkSchoolGradeNoindexSync(rows: QualityRow[]): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  const kinds = new Set(["school-grade", "school-grade-subject"]);
  const nonGreen = new Set(rows.filter((r) => kinds.has(r.kind) && !r.draft && r.grade !== "GREEN").map((r) => r.path));
  for (const p of nonGreen) if (!schoolGradeNoindexPaths.has(p)) issues.push(`non-GREEN school-grade page not held at noindex: ${p}`);
  for (const p of schoolGradeNoindexPaths) if (!nonGreen.has(p)) issues.push(`schoolGradeNoindex.ts lists a page that is GREEN or does not exist: ${p}`);
  for (const r of rows) if (kinds.has(r.kind) && r.indexed && r.grade !== "GREEN") issues.push(`indexed ${r.grade}: ${r.path}`);
  return { ok: issues.length === 0, issues };
}

export function checkDongIndexedGreen(rows: QualityRow[]): { ok: boolean; issues: string[] } {
  const issues = rows
    .filter((r) => (r.kind === "region-dong" || r.kind === "region-dong-subject") && r.indexed && r.grade !== "GREEN")
    .map((r) => `${r.grade} dong page is indexed: ${r.path}`);
  return { ok: issues.length === 0, issues };
}
