/**
 * RED / AMBER / GREEN quality gate for the programmatic combination pages
 * (region×subject, region×grade×subject, school×subject). Read-only: it grades
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

export type QualityGrade = "GREEN" | "AMBER" | "RED";

export interface QualityRow {
  kind: "region-subject" | "region-grade-subject" | "school-subject";
  path: string;
  indexed: boolean;
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
  text: string;
  notes: { title: string; body: string }[];
  sources: string[];
  structural: { red: string[]; amber: string[] };
}

function grade(candidates: Candidate[]): QualityRow[] {
  const masked = candidates.map((c) => mask(c.text));
  return candidates.map((c, i) => {
    let nearest = 0;
    for (let j = 0; j < candidates.length; j++) {
      if (i !== j) nearest = Math.max(nearest, tokenSimilarity(masked[i], masked[j]));
    }
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
    return { kind: c.kind, path: c.path, indexed: c.indexed, grade: g, nearest, reasons: [...red, ...amber] };
  });
}

function cityPath(slug: string): string {
  return getRegionUrl(slug);
}

export function runQualityGate(): QualityRow[] {
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
    .filter((c) => c.status === "published")
    .map((c) => {
      const hasLevelSchool = schools.some(
        (s) => s.cityRegionSlug === c.regionSlug && schoolLevelToGradeSlug[s.level] === c.gradeSlug
      );
      return {
        kind: "region-grade-subject",
        path: `${cityPath(c.regionSlug)}/${c.gradeSlug}/${c.subjectSlug}`,
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

  return [...grade(regionSubject), ...grade(regionGradeSubject), ...grade(schoolSubject)];
}

export function summarizeQualityGate(rows: QualityRow[]): string[] {
  const lines: string[] = [];
  for (const kind of ["region-subject", "region-grade-subject", "school-subject"] as const) {
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
export function checkQualityNoindexSync(rows: QualityRow[]): { ok: boolean; issues: string[] } {
  const red = new Set(rows.filter((r) => r.grade === "RED").map((r) => r.path));
  const issues: string[] = [];
  for (const p of red) if (!qualityNoindexPaths.has(p)) issues.push(`RED but not held noindex: ${p}`);
  for (const p of qualityNoindexPaths) if (!red.has(p)) issues.push(`held noindex but no longer RED: ${p}`);
  for (const r of rows) if (r.grade === "RED" && r.indexed) issues.push(`RED page still indexed: ${r.path}`);
  return { ok: issues.length === 0, issues };
}
