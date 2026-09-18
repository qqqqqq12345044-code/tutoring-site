/**
 * Content-quality checks for src/data/regionGradeSubjectContent.ts, ahead of
 * scaling it to 50~100 entries. There was no reusable similarity utility in
 * this repo before this file — docs/qa/indexability-report.md's token-LCS
 * method was a one-off manual analysis, not committed code — so the token
 * similarity function below re-implements that same method (LCS over
 * whitespace-split tokens, normalized to 0~1) as reusable validator code.
 */
import { regionGradeSubjectContents, type RegionGradeSubjectContent } from "@/data/regionGradeSubjectContent";
import { schoolSubjectContents, type SchoolSubjectContent } from "@/data/schoolSubjectContent";

export interface ContentQualityResult {
  ok: boolean;
  issues: string[];
}

const MIN_INTRO_LENGTH = 40;

/** Same method docs/qa/indexability-report.md used: token-level LCS similarity, 0~1. */
export function tokenSimilarity(textA: string, textB: string): number {
  const a = textA.split(/\s+/).filter(Boolean);
  const b = textB.split(/\s+/).filter(Boolean);
  if (a.length === 0 || b.length === 0) return 0;

  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[a.length][b.length];
  return (2 * lcs) / (a.length + b.length);
}

/**
 * Similarity threshold above which two published entries sharing the same
 * grade+subject are treated as "practically the same document". Chosen
 * between the audit's own baselines: ~30-45% for genuinely different
 * content, 78%+ for content judged "practically identical".
 */
const SIMILARITY_THRESHOLD = 0.6;

function entryText(c: RegionGradeSubjectContent): string {
  return [c.intro, ...c.regionSpecificNotes.map((n) => n.body)].join(" ");
}

/**
 * Checks every regionGradeSubjectContent entry for publish-readiness:
 * - published entries must have at least one regionSpecificNotes item
 * - published entries' intro must meet a minimum length
 * - no empty note title/body
 * - published entries sharing the same grade+subject must not read as the
 *   same document with only the region swapped (token similarity gate)
 */
export function checkRegionGradeSubjectContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of regionGradeSubjectContents) {
    const key = `${c.regionSlug}/${c.gradeSlug}/${c.subjectSlug}`;
    if (c.status !== "published") continue;

    if (c.regionSpecificNotes.length === 0) {
      issues.push(`${key}: status "published"이지만 regionSpecificNotes가 비어 있음`);
    }
    if (c.intro.trim().length < MIN_INTRO_LENGTH) {
      issues.push(`${key}: intro가 최소 길이(${MIN_INTRO_LENGTH}자) 미만 (${c.intro.trim().length}자)`);
    }
    for (const note of c.regionSpecificNotes) {
      if (!note.title.trim() || !note.body.trim()) {
        issues.push(`${key}: regionSpecificNotes에 빈 title/body가 있음`);
      }
    }
  }

  const publishedByGradeSubject = new Map<string, RegionGradeSubjectContent[]>();
  for (const c of regionGradeSubjectContents) {
    if (c.status !== "published") continue;
    const key = `${c.gradeSlug}/${c.subjectSlug}`;
    if (!publishedByGradeSubject.has(key)) publishedByGradeSubject.set(key, []);
    publishedByGradeSubject.get(key)!.push(c);
  }

  for (const [key, group] of publishedByGradeSubject) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const similarity = tokenSimilarity(entryText(group[i]), entryText(group[j]));
        if (similarity > SIMILARITY_THRESHOLD) {
          issues.push(
            `${key}: ${group[i].regionSlug} vs ${group[j].regionSlug} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
              ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 지역명만 바뀐 동일 문서일 가능성)`
          );
        }
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

function schoolEntryText(c: SchoolSubjectContent): string {
  return [c.intro, ...c.schoolSpecificNotes.map((n) => n.body)].join(" ");
}

/**
 * Same checks as checkRegionGradeSubjectContentQuality, applied to
 * src/data/schoolSubjectContent.ts: published entries need notes + a minimum
 * intro length, and published entries sharing the same subject must not read
 * as the same document with only the school name swapped.
 */
export function checkSchoolSubjectContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of schoolSubjectContents) {
    const key = `${c.schoolSlug}/${c.subjectSlug}`;
    if (c.status !== "published") continue;

    if (c.schoolSpecificNotes.length === 0) {
      issues.push(`${key}: status "published"이지만 schoolSpecificNotes가 비어 있음`);
    }
    if (c.intro.trim().length < MIN_INTRO_LENGTH) {
      issues.push(`${key}: intro가 최소 길이(${MIN_INTRO_LENGTH}자) 미만 (${c.intro.trim().length}자)`);
    }
    for (const note of c.schoolSpecificNotes) {
      if (!note.title.trim() || !note.body.trim()) {
        issues.push(`${key}: schoolSpecificNotes에 빈 title/body가 있음`);
      }
    }
  }

  const publishedBySubject = new Map<string, SchoolSubjectContent[]>();
  for (const c of schoolSubjectContents) {
    if (c.status !== "published") continue;
    if (!publishedBySubject.has(c.subjectSlug)) publishedBySubject.set(c.subjectSlug, []);
    publishedBySubject.get(c.subjectSlug)!.push(c);
  }

  for (const [subjectSlug, group] of publishedBySubject) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const similarity = tokenSimilarity(schoolEntryText(group[i]), schoolEntryText(group[j]));
        if (similarity > SIMILARITY_THRESHOLD) {
          issues.push(
            `${subjectSlug}: ${group[i].schoolSlug} vs ${group[j].schoolSlug} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
              ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 학교명만 바뀐 동일 문서일 가능성)`
          );
        }
      }
    }
  }

  return { ok: issues.length === 0, issues };
}
