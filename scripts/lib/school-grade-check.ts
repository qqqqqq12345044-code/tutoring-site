import { schools } from "@/data/schools";
import { subjects } from "@/data/subjects";
import { schoolGradeSubjectContents, GRADE_RANGE } from "@/data/schoolGradeSubjectContent";
import { evidenceRecords } from "@/data/evidence";
import { isSchoolInfoPlanSource } from "@/data/sources";
import { groupAssessmentsByCourse } from "@/lib/schoolGrade";

/**
 * Data rules for src/data/schoolGradeSubjectContent.ts and src/data/evidence.ts (2026-11-02 Phase 2,
 * docs/qa/national-school-content-expansion-2026-11-02.md):
 * - entry points at a registered school, a 학년 inside its 학교급 range and a known subject; unique key;
 * - every course's 반영 비율 rows add up to exactly 100 and multi-course entries tag every row;
 * - at least one 학교알리미 평가계획 source (OFFICIAL basis);
 * - wording bans: 난이도·합격·등급/성적 향상·학원·후기 claims and figures with no source in the plan;
 * - evidence records: no personal data, figures only with sampleSize + period, no brand/company names.
 */
const BANNED = [
  /난이도/, /어렵(다|습니다|게)/, /쉽(다|습니다|게)/, /합격/, /진학\s*실적/, /등급\s*(상승|향상|올)/, /성적\s*(상승|향상)/,
  /학원/, /학군/, /어려워하/, /자주\s*막히/, /1위/,
  // Advertising senses only — plan wording such as 채점 "최고 단계", "인권 보장 장치", "조선 후기" is a fact.
  /(수강|이용|학부모|학생|과외)\s*후기/, /최고(?!\s*(단계|점|수준|배점))/, /(성적|효과|결과|합격|강사|수업).{0,8}보장/,
];
const PII = [/\d{2,3}-\d{3,4}-\d{4}/, /[가-힣]{2,4}\s*(학생|군|양)\s*\(/, /@[a-z0-9-]+\./i, /\d+동\s*\d+호/];
const BRAND = [/동화세상/, /에듀코/, /자체\s*고객\s*데이터/];

export function checkSchoolGradeContent(): { ok: boolean; issues: string[]; summary: string } {
  const issues: string[] = [];
  const keys = new Set<string>();
  for (const c of schoolGradeSubjectContents) {
    const id = `${c.schoolSlug}/${c.grade}/${c.subjectSlug}`;
    if (keys.has(id)) issues.push(`duplicate entry ${id}`);
    keys.add(id);
    const school = schools.find((s) => s.slug === c.schoolSlug);
    if (!school) issues.push(`${id}: not a registered school`);
    else if (!(Number.isInteger(c.grade) && c.grade >= 1 && c.grade <= GRADE_RANGE[school.level])) issues.push(`${id}: 학년 outside ${school.level} range`);
    if (!subjects.some((s) => s.slug === c.subjectSlug)) issues.push(`${id}: unknown subject`);
    if (c.courses.length === 0) issues.push(`${id}: courses empty`);
    if (c.courses.length > 1 && c.assessments.some((a) => !a.course || !c.courses.includes(a.course))) issues.push(`${id}: multi-course row without a listed course`);
    for (const g of groupAssessmentsByCourse(c)) {
      if (g.rows.length === 0) issues.push(`${id}: course ${g.course} has no rows`);
      else if (g.exam + g.task !== 100) issues.push(`${id}: ${g.course || "course"} 반영 비율 합계 ${g.exam + g.task}%`);
    }
    if (c.assessments.some((a) => !(a.weight > 0))) issues.push(`${id}: non-positive weight`);
    if (!c.sources.some(isSchoolInfoPlanSource)) issues.push(`${id}: no 학교알리미 평가계획 source`);
    if (c.summary.length > 80) issues.push(`${id}: summary ${c.summary.length}자 (>80)`);
    if (c.notes.length < 2) issues.push(`${id}: notes ${c.notes.length} (<2)`);
    const text = [c.summary, c.intro, ...c.notes.flatMap((n) => [n.title, n.body])].join(" ");
    for (const re of [...BANNED, ...BRAND]) if (re.test(text)) issues.push(`${id}: banned wording ${re}`);
  }
  const ids = new Set<string>();
  for (const r of evidenceRecords) {
    if (ids.has(r.id)) issues.push(`evidence duplicate id ${r.id}`);
    ids.add(r.id);
    const text = [r.title, r.summary, r.sourceKind].join(" ");
    for (const re of [...PII, ...BRAND]) if (re.test(text)) issues.push(`evidence ${r.id}: personal data or brand wording ${re}`);
    if (/\d+(\.\d+)?\s*(%|등급|점|명|배)/.test(r.summary) && !(r.sampleSize && r.sampleSize > 0 && r.period)) issues.push(`evidence ${r.id}: figure without sampleSize/period`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.verifiedAt)) issues.push(`evidence ${r.id}: verifiedAt`);
    if (r.grade !== undefined && !(r.grade >= 1 && r.grade <= 6)) issues.push(`evidence ${r.id}: grade`);
  }
  const published = schoolGradeSubjectContents.filter((c) => c.status === "published").length;
  return {
    ok: issues.length === 0,
    issues,
    summary: `${published} entries, evidence OFFICIAL only / FIELD_ANALYSIS ${evidenceRecords.filter((r) => r.kind === "FIELD_ANALYSIS").length} / CASE_BASED ${evidenceRecords.filter((r) => r.kind === "CASE_BASED").length}`,
  };
}
