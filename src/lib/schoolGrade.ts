import { schools, getSchoolBySlug, type School } from "@/data/schools";
import { getSubjectBySlug, subjects, type Subject } from "@/data/subjects";
import { getRegionBySlug, getRegionTitleName } from "@/data/regions";
import {
  GRADE_RANGE,
  getSchoolGradeEntries,
  getSchoolGradeSubjectContent,
  getSchoolGrades,
  schoolGradeSubjectContents,
  isPublishedGradeSubject,
  type SchoolGradeSubjectContent,
} from "@/data/schoolGradeSubjectContent";

/**
 * School → 학년 → 과목 routes (2026-11-02 Phase 2): /school/[schoolSlug]/[grade] and /school/[schoolSlug]/[grade]/[subject].
 * The 학년 segment shares the URL position of the existing /school/[schoolSlug]/[subject] pages (app folder
 * [segment]); subject slugs are words and 학년 segments are the digits 1~6, so the two never collide and no
 * existing URL changes.
 *
 * A route exists only for registered schools (src/data/schools.ts) with a published school×학년×과목 entry
 * (src/data/schoolGradeSubjectContent.ts) inside the 학교급's 학년 range; everything else is 404 (NO_DATA).
 */
export function parseGradeSegment(segment: string): number | undefined {
  return /^[1-6]$/.test(segment) ? Number(segment) : undefined;
}

export function isGradeInRange(level: School["level"], grade: number): boolean {
  return Number.isInteger(grade) && grade >= 1 && grade <= GRADE_RANGE[level];
}

export interface SchoolGradeContext {
  school: School;
  grade: number;
  /** Published entries for this school and 학년, in subjects.ts order. */
  entries: { subject: Subject; content: SchoolGradeSubjectContent }[];
}

export function resolveSchoolGrade(schoolSlug: string, segment: string): SchoolGradeContext | null {
  const grade = parseGradeSegment(segment);
  const school = getSchoolBySlug(schoolSlug);
  if (grade === undefined || !school || !isGradeInRange(school.level, grade)) return null;
  const bySubject = new Map(getSchoolGradeEntries(school.slug, grade).map((c) => [c.subjectSlug, c]));
  const entries = subjects
    .filter((s) => bySubject.has(s.slug))
    .map((s) => ({ subject: s, content: bySubject.get(s.slug)! }));
  return entries.length > 0 ? { school, grade, entries } : null;
}

export interface SchoolGradeSubjectContext {
  school: School;
  grade: number;
  subject: Subject;
  content: SchoolGradeSubjectContent;
}

export function resolveSchoolGradeSubject(schoolSlug: string, segment: string, subjectSlug: string): SchoolGradeSubjectContext | null {
  const grade = parseGradeSegment(segment);
  const school = getSchoolBySlug(schoolSlug);
  const subject = getSubjectBySlug(subjectSlug);
  if (grade === undefined || !school || !subject || !isGradeInRange(school.level, grade)) return null;
  const content = getSchoolGradeSubjectContent(school.slug, grade, subject.slug);
  return content ? { school, grade, subject, content } : null;
}

export function schoolGradeHref(schoolSlug: string, grade: number): string {
  return `/school/${schoolSlug}/${grade}`;
}

export function schoolGradeSubjectHref(schoolSlug: string, grade: number, subjectSlug: string): string {
  return `/school/${schoolSlug}/${grade}/${subjectSlug}`;
}

/** 학년 numbers with a 학년 page for a registered school (empty for every other school). */
export function schoolGradeNumbers(school: Pick<School, "slug" | "level">): number[] {
  return getSchoolGrades(school.slug).filter((g) => isGradeInRange(school.level, g));
}

/**
 * School name for 학년 / 학년×과목 page titles. When an earlier-registered school with the same name already has
 * 학년 pages (e.g. 경신중학교 대구 수성 vs 서울 종로), the later one gets its region appended — "경신중학교(종로구)" —
 * so titles stay unique; the earlier school's (already indexed) titles stay unchanged.
 */
export function schoolGradeTitleName(school: Pick<School, "slug" | "name" | "cityRegionSlug">): string {
  const idx = schools.findIndex((s) => s.slug === school.slug);
  const earlier = schools.slice(0, idx < 0 ? schools.length : idx);
  const clash = earlier.some((s) => s.name === school.name && schoolGradeNumbers(s).length > 0);
  if (!clash) return school.name;
  const region = getRegionTitleName(school.cityRegionSlug) || getRegionBySlug(school.cityRegionSlug)?.name;
  return region ? `${school.name}(${region})` : school.name;
}

/** Every 학년 / 학년×과목 route that exists — for generateStaticParams, the route inventory and sitemap.ts. */
export function allSchoolGradeRoutes(): { schoolSlug: string; grade: number; subjectSlug?: string }[] {
  const out: { schoolSlug: string; grade: number; subjectSlug?: string }[] = [];
  for (const school of schools) {
    for (const grade of schoolGradeNumbers(school)) {
      out.push({ schoolSlug: school.slug, grade });
      for (const c of schoolGradeSubjectContents) {
        if (c.schoolSlug === school.slug && c.grade === grade && isPublishedGradeSubject(c) && getSubjectBySlug(c.subjectSlug)) {
          out.push({ schoolSlug: school.slug, grade, subjectSlug: c.subjectSlug });
        }
      }
    }
  }
  return out;
}

/** Courses of a grade×subject entry with their assessment rows (one group when `course` is not used). */
export function groupAssessmentsByCourse(content: SchoolGradeSubjectContent) {
  const single = content.courses.length <= 1;
  const names = single ? [content.courses[0] ?? ""] : content.courses;
  return names.map((course) => {
    const rows = single ? content.assessments : content.assessments.filter((a) => a.course === course);
    // Plans use decimals such as 7.2 / 14.4 — round to 0.01 so the totals are exact.
    const sum = (k: "exam" | "task") => Math.round(rows.filter((a) => a.kind === k).reduce((s, a) => s + a.weight, 0) * 100) / 100;
    const exam = sum("exam");
    const task = sum("task");
    return { course, rows, exam, task };
  });
}

/** 은/는 · 이/가 for the last Hangul syllable (non-Hangul endings take the vowel form). */
function hasBatchim(word: string): boolean {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}
const topic = (w: string) => `${w}${hasBatchim(w) ? "은" : "는"}`;
const subj = (w: string) => `${w}${hasBatchim(w) ? "이" : "가"}`;

/**
 * Text of a 학년 hub (/school/[schoolSlug]/[grade]) derived only from that 학년's published entries, so the page
 * states nothing beyond the official plans. Also what the quality gate grades for the "school-grade" kind.
 */
export function buildSchoolGradeContent(ctx: SchoolGradeContext) {
  const { school, grade, entries } = ctx;
  const singles = entries
    .map((e) => ({ name: e.subject.name, group: groupAssessmentsByCourse(e.content) }))
    .filter((x) => x.group.length === 1)
    .map((x) => ({ name: x.name, task: x.group[0].task }));
  const sorted = [...singles].sort((a, b) => b.task - a.task);
  const names = entries.map((e) => e.subject.name).join("·");
  let intro = `${topic(school.name)} ${grade}학년 2학기 ${names} 평가계획을 학교알리미에 공시했습니다.`;
  if (sorted.length >= 2 && sorted[0].task !== sorted[sorted.length - 1].task) {
    const hi = sorted[0];
    const lo = sorted[sorted.length - 1];
    intro += ` 수행평가 비중은 ${subj(hi.name)} ${hi.task}%로 가장 크고 ${topic(lo.name)} ${lo.task}%입니다.`;
  } else if (sorted.length >= 2) {
    intro += ` ${sorted.map((s) => s.name).join("·")} 모두 수행평가 비중이 ${sorted[0].task}%입니다.`;
  }


  const cards = entries.map((e) => {
    const groups = groupAssessmentsByCourse(e.content);
    const tasks = e.content.assessments.filter((a) => a.kind === "task");
    return {
      subject: e.subject,
      courses: e.content.courses,
      ratio: groups.map((g) => `${groups.length > 1 ? `${g.course} ` : ""}시험 ${g.exam}% · 수행 ${g.task}%`).join(" / "),
      summary: e.content.summary,
      tasks: tasks.map((t) => `${t.course && groups.length > 1 ? `[${t.course}] ` : ""}${t.name}${t.timing ? ` (${t.timing})` : ""}`),
      href: schoolGradeSubjectHref(school.slug, grade, e.subject.slug),
    };
  });
  return { intro, cards };
}
