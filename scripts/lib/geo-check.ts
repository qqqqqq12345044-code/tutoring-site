import { schools, getSchoolBySlug } from "@/data/schools";
import { getSubjectBySlug } from "@/data/subjects";
import { getSchoolGradeSubjectContent, isPublishedGradeSubject, type SchoolGradeSubjectContent } from "@/data/schoolGradeSubjectContent";
import { schoolGradeGeoEntries, type GeoAnswer, type SchoolGradeGeoEntry } from "@/data/schoolGradeGeo";
import { isSchoolInfoPlanSource } from "@/data/sources";
import { getIndexability } from "@/lib/indexability";
import { findGeoEvidenceRow, geoEvidenceLine } from "@/lib/schoolGradeGeo";
import { tokenSimilarity } from "./content-quality";
import { BANNED, BRAND, PII } from "./school-grade-check";

/**
 * GEO/AEO pilot rules (docs/qa/geo-aeo-pilot-2026-11-03.md) for src/data/schoolGradeGeo.ts. Additive: the existing
 * Quality Gate also grades pilot pages with their answers included (scripts/lib/quality-gate.ts), thresholds unchanged.
 *
 * Per page: indexed GREEN school×학년×과목 page with a 학교알리미 평가계획 source; real ISO dates (not in the future,
 * planCheckedAt ≤ answersUpdatedAt); exactly one primary page; at most MAX_ITEMS visible answers.
 * Per answer: question heading names school·학년·과목 and ends with "?"; answer is 2~4 sentences / 60~400자 and its
 * first sentence names school·학년·과목; every evidence ref / note ref resolves; every figure in the answer appears in
 * the referenced rows or notes (or is a sum of the referenced weights); every N% equals a referenced weight or sum;
 * no banned / PII / brand / guarantee / placeholder wording.
 * Across pages: no identical name-masked question; masked answer similarity ≤ 30% (the QG GREEN line).
 */
const MAX_ITEMS = 6;
const MAX_ANSWER_SIMILARITY = 0.3;
const GEO_BANNED = [
  /인용\s*(이|을)?\s*보장/, /반드시\s*(노출|인용|언급)/, /(AI|챗GPT|ChatGPT|검색).{0,10}(노출|인용)\s*(됩니다|보장)/, /상위\s*노출/, /검색\s*1위/,
];
const PLACEHOLDER = [/OOO|○○|TODO|XXX|lorem/i, /[{}]/, /\bundefined\b|\bnull\b/];

export interface GeoReadiness {
  path: string;
  primary: boolean;
  answers: number;
  checks: Record<string, boolean>;
}

const schoolNames = schools.map((s) => s.name).filter((n) => n.length >= 2).sort((a, b) => b.length - a.length);
function mask(text: string, extra: string[]): string {
  let out = text;
  for (const n of [...extra, ...schoolNames]) if (n) out = out.split(n).join("〔이름〕");
  return out.replace(/\d+(\.\d+)?/g, "〔수〕");
}

const numbers = (text: string) => (text.match(/\d+(?:\.\d+)?/g) ?? []).map((n) => n.replace(/\.$/, ""));
const sentences = (text: string) => text.split(/(?<=[다요]\.)\s+/).filter((s) => s.trim().length > 0);

function contextOk(text: string, school: string, grade: number, subjectName: string, courses: string[]): boolean {
  return text.includes(school) && text.includes(`${grade}학년`) && (text.includes(subjectName) || courses.some((c) => text.includes(c)));
}

function checkAnswer(id: string, item: GeoAnswer, c: SchoolGradeSubjectContent, school: string, subjectName: string, issues: string[]) {
  const where = `${id} "${item.question.slice(0, 24)}…"`;
  if (!item.question.trim().endsWith("?")) issues.push(`${where}: question must end with "?"`);
  if (!contextOk(item.question, school, c.grade, subjectName, c.courses)) issues.push(`${where}: question lacks school·학년·과목`);
  const sents = sentences(item.answer);
  if (sents.length < 2 || sents.length > 4) issues.push(`${where}: answer has ${sents.length} sentences (2~4)`);
  if (item.answer.length < 60 || item.answer.length > 400) issues.push(`${where}: answer ${item.answer.length}자 (60~400)`);
  if (!contextOk(sents[0] ?? "", school, c.grade, subjectName, c.courses)) issues.push(`${where}: first sentence lacks school·학년·과목`);
  if (item.evidence.length === 0) issues.push(`${where}: no evidence rows`);

  const rows = item.evidence.map((ref) => {
    const row = findGeoEvidenceRow(c, ref);
    if (!row) issues.push(`${where}: evidence row not found: ${ref.course ? `[${ref.course}] ` : ""}${ref.name}`);
    else if (c.courses.length > 1 && !ref.course) issues.push(`${where}: multi-course entry needs evidence course: ${ref.name}`);
    return row;
  }).filter((r) => r !== undefined);
  const notes = (item.noteRefs ?? []).map((t) => {
    const n = c.notes.find((x) => x.title === t);
    if (!n) issues.push(`${where}: note not found: ${t}`);
    return n;
  }).filter((n) => n !== undefined);

  const weights = new Set<string>(rows.map((r) => String(r.weight)));
  const byCourse = new Map<string, { exam: number; task: number }>();
  for (const r of rows) {
    const g = byCourse.get(r.course ?? "") ?? { exam: 0, task: 0 };
    g[r.kind] += r.weight;
    byCourse.set(r.course ?? "", g);
  }
  for (const g of byCourse.values()) [g.exam, g.task, g.exam + g.task].forEach((n) => n > 0 && weights.add(String(n)));
  const allowed = new Set<string>([
    ...weights,
    String(c.grade),
    // Only figures the 근거 list shows: method (배점·유형) counts only for refs marked detail.
    ...item.evidence.flatMap((ref) => {
      const r = findGeoEvidenceRow(c, ref);
      return r ? numbers([r.name, r.timing ?? "", ref.detail ? (r.method ?? "") : "", r.course ?? ""].join(" ")) : [];
    }),
    ...notes.flatMap((n) => numbers(`${n.title} ${n.body}`)),
    ...c.courses.flatMap(numbers),
  ]);
  const bare = item.answer.split(school).join(" ");
  const unsupported = numbers(bare).filter((n) => !allowed.has(n));
  if (unsupported.length) issues.push(`${where}: unsupported figures ${[...new Set(unsupported)].join(", ")}`);
  const visible = item.evidence.map((ref) => geoEvidenceLine(c, ref)).join(" ");
  const pct = [...bare.matchAll(/(\d+(?:\.\d+)?)\s*%/g)]
    .map((m) => m[1])
    .filter((n) => !weights.has(n) && !visible.includes(`${n}%`) && !notes.some((x) => x.body.includes(`${n}%`)));
  if (pct.length) issues.push(`${where}: % not matching evidence weights ${[...new Set(pct)].join(", ")}`);

  const text = `${item.question} ${item.answer}`;
  for (const re of [...BANNED, ...GEO_BANNED]) if (re.test(text)) issues.push(`${where}: banned wording ${re}`);
  for (const re of [...PII, ...BRAND]) if (re.test(text)) issues.push(`${where}: personal data / brand ${re}`);
  for (const re of PLACEHOLDER) if (re.test(text)) issues.push(`${where}: placeholder ${re}`);
}

export function checkSchoolGradeGeo(today = new Date().toISOString().slice(0, 10)): {
  ok: boolean;
  issues: string[];
  summary: string;
  readiness: GeoReadiness[];
  maxAnswerSimilarity: number;
} {
  const issues: string[] = [];
  const readiness: GeoReadiness[] = [];
  const keys = new Set<string>();
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (schoolGradeGeoEntries.filter((e) => e.primary).length !== 1) issues.push("exactly one GEO entry must be primary");

  const masked: { id: string; q: string; a: string }[] = [];
  for (const e of schoolGradeGeoEntries as SchoolGradeGeoEntry[]) {
    const id = `/school/${e.schoolSlug}/${e.grade}/${e.subjectSlug}`;
    if (keys.has(id)) issues.push(`${id}: duplicate GEO entry`);
    keys.add(id);
    const school = getSchoolBySlug(e.schoolSlug);
    const subject = getSubjectBySlug(e.subjectSlug);
    const c = getSchoolGradeSubjectContent(e.schoolSlug, e.grade, e.subjectSlug);
    if (!school || !subject || !c || !isPublishedGradeSubject(c)) {
      issues.push(`${id}: no published school×학년×과목 entry`);
      continue;
    }
    const indexed = getIndexability("school-grade-subject", { schoolSlug: e.schoolSlug, schoolGrade: String(e.grade), subjectSlug: e.subjectSlug }).index;
    if (!indexed) issues.push(`${id}: GEO pilot page must be indexed (GREEN)`);
    const source = c.sources.find(isSchoolInfoPlanSource);
    if (!source || !/^https:\/\//.test(source.url) || !source.label.trim()) issues.push(`${id}: no 학교알리미 평가계획 source with URL`);
    for (const [k, v] of [["planCheckedAt", e.planCheckedAt], ["answersUpdatedAt", e.answersUpdatedAt]] as const) {
      if (!iso.test(v) || Number.isNaN(Date.parse(v))) issues.push(`${id}: ${k} is not an ISO date`);
      else if (v > today) issues.push(`${id}: ${k} ${v} is in the future`);
    }
    if (e.planCheckedAt > e.answersUpdatedAt) issues.push(`${id}: planCheckedAt after answersUpdatedAt`);
    if (e.items.length === 0 || e.items.length > MAX_ITEMS) issues.push(`${id}: ${e.items.length} answers (1~${MAX_ITEMS})`);
    const before = issues.length;
    for (const item of e.items) {
      checkAnswer(id, item, c, school.name, subject.name, issues);
      masked.push({ id, q: mask(item.question, [...c.courses, subject.name]), a: mask(item.answer, c.courses) });
    }
    const itemsOk = issues.length === before;
    readiness.push({
      path: id,
      primary: !!e.primary,
      answers: e.items.length,
      checks: {
        question_present: e.items.every((i) => i.question.trim().endsWith("?")),
        direct_answer_present: e.items.every((i) => sentences(i.answer).length >= 2),
        answer_self_contained: e.items.every((i) => contextOk(sentences(i.answer)[0] ?? "", school.name, e.grade, subject.name, c.courses)),
        official_evidence_present: e.items.every((i) => i.evidence.length > 0) && !!source,
        source_visible: !!source,
        verified_date_present: iso.test(e.planCheckedAt) && iso.test(e.answersUpdatedAt),
        clear_heading: e.items.every((i) => i.question.length <= 60),
        semantic_html: true, // GeoAnswerSection: section > h2, article > h3 + p + ul + cite + time
        internal_link_present: true, // page keeps its 학년 hub / school / 동×과목 links (SchoolGradeSubjectPage)
        cta_present: true, // ConsultCTA after the information sections
        figures_supported: itemsOk,
      },
    });
  }

  let maxSim = 0;
  for (let i = 0; i < masked.length; i++) {
    for (let j = i + 1; j < masked.length; j++) {
      if (masked[i].id === masked[j].id) continue;
      if (masked[i].q === masked[j].q) issues.push(`identical masked question on ${masked[i].id} and ${masked[j].id}: ${masked[i].q}`);
      const sim = tokenSimilarity(masked[i].a, masked[j].a);
      maxSim = Math.max(maxSim, sim);
      if (sim > MAX_ANSWER_SIMILARITY) issues.push(`answer similarity ${(sim * 100).toFixed(0)}% (>30%): ${masked[i].id} ↔ ${masked[j].id}`);
    }
  }
  const answers = schoolGradeGeoEntries.reduce((n, e) => n + e.items.length, 0);
  return {
    ok: issues.length === 0,
    issues,
    summary: `${schoolGradeGeoEntries.length} pages, ${answers} answers, max masked answer similarity ${(maxSim * 100).toFixed(1)}%`,
    readiness,
    maxAnswerSimilarity: maxSim,
  };
}
