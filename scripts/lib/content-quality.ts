/**
 * Content-quality checks for src/data/regionGradeSubjectContent.ts, ahead of
 * scaling it to 50~100 entries. There was no reusable similarity utility in
 * this repo before this file — docs/qa/indexability-report.md's token-LCS
 * method was a one-off manual analysis, not committed code — so the token
 * similarity function below re-implements that same method (LCS over
 * whitespace-split tokens, normalized to 0~1) as reusable validator code.
 */
import { regionGradeSubjectContents, type RegionGradeSubjectContent } from "@/data/regionGradeSubjectContent";
import { schoolContents, type SchoolContent } from "@/data/schoolContent";
import { schoolSubjectContents, type SchoolSubjectContent } from "@/data/schoolSubjectContent";
import { regionProgramContents, type RegionProgramContent } from "@/data/regionProgramContent";
import { subGradeContents, type SubGradeContent } from "@/data/subGradeContent";
import { subjectTopicContents, type SubjectTopicContent } from "@/data/subjectTopicContent";
import { schools } from "@/data/schools";
import { regions } from "@/data/regions";
import { buildRegionSchoolIntro } from "@/lib/regionIntro";
import { buildRegionFaqs } from "@/lib/regionFaq";

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

function programEntryText(c: RegionProgramContent): string {
  return [c.intro, ...c.regionSpecificNotes.map((n) => n.body)].join(" ");
}

/**
 * Same checks as checkRegionGradeSubjectContentQuality, applied to
 * src/data/regionProgramContent.ts: published entries need notes + a minimum
 * intro length, and published entries sharing the same program must not read
 * as the same document with only the region name swapped.
 */
export function checkRegionProgramContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of regionProgramContents) {
    const key = `${c.regionSlug}/${c.programSlug}`;
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

  const publishedByProgram = new Map<string, RegionProgramContent[]>();
  for (const c of regionProgramContents) {
    if (c.status !== "published") continue;
    if (!publishedByProgram.has(c.programSlug)) publishedByProgram.set(c.programSlug, []);
    publishedByProgram.get(c.programSlug)!.push(c);
  }

  for (const [programSlug, group] of publishedByProgram) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const similarity = tokenSimilarity(programEntryText(group[i]), programEntryText(group[j]));
        if (similarity > SIMILARITY_THRESHOLD) {
          issues.push(
            `${programSlug}: ${group[i].regionSlug} vs ${group[j].regionSlug} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
              ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 지역명만 바뀐 동일 문서일 가능성)`
          );
        }
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

function plainSchoolEntryText(c: SchoolContent): string {
  return [c.intro, ...c.schoolSpecificNotes.map((n) => n.body)].join(" ");
}

/**
 * Checks every schoolContent entry (src/data/schoolContent.ts, the plain
 * /school/[schoolSlug] page's content gate) for publish-readiness:
 * - published entries must have at least one schoolSpecificNotes item
 * - published entries' intro must meet a minimum length
 * - no empty note title/body
 * - published entries sharing the same school level, or the same city
 *   region, must not read as the same document with only the school name
 *   swapped (token similarity gate) — this is the axis most likely to leak
 *   into the rendered page (shared FAQ/subject-list boilerplate), so it's
 *   checked in addition to the full-corpus pairwise check below.
 */
export function checkSchoolContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of schoolContents) {
    if (c.status !== "published") continue;

    if (c.schoolSpecificNotes.length === 0) {
      issues.push(`${c.schoolSlug}: status "published"이지만 schoolSpecificNotes가 비어 있음`);
    }
    if (c.intro.trim().length < MIN_INTRO_LENGTH) {
      issues.push(`${c.schoolSlug}: intro가 최소 길이(${MIN_INTRO_LENGTH}자) 미만 (${c.intro.trim().length}자)`);
    }
    for (const note of c.schoolSpecificNotes) {
      if (!note.title.trim() || !note.body.trim()) {
        issues.push(`${c.schoolSlug}: schoolSpecificNotes에 빈 title/body가 있음`);
      }
    }
  }

  const published = schoolContents.filter((c) => c.status === "published");

  function checkGroups(groups: Map<string, SchoolContent[]>, label: string) {
    for (const [key, group] of groups) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const similarity = tokenSimilarity(plainSchoolEntryText(group[i]), plainSchoolEntryText(group[j]));
          if (similarity > SIMILARITY_THRESHOLD) {
            issues.push(
              `${label} "${key}": ${group[i].schoolSlug} vs ${group[j].schoolSlug} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
                ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 학교명만 바뀐 동일 문서일 가능성)`
            );
          }
        }
      }
    }
  }

  const byLevel = new Map<string, SchoolContent[]>();
  const byCityRegion = new Map<string, SchoolContent[]>();
  for (const c of published) {
    const school = schools.find((s) => s.slug === c.schoolSlug);
    if (!school) continue;
    if (!byLevel.has(school.level)) byLevel.set(school.level, []);
    byLevel.get(school.level)!.push(c);
    if (!byCityRegion.has(school.cityRegionSlug)) byCityRegion.set(school.cityRegionSlug, []);
    byCityRegion.get(school.cityRegionSlug)!.push(c);
  }
  checkGroups(byLevel, "학교급");
  checkGroups(byCityRegion, "지역");

  // Full-corpus check: catches duplication across region/level boundaries too.
  for (let i = 0; i < published.length; i++) {
    for (let j = i + 1; j < published.length; j++) {
      const similarity = tokenSimilarity(plainSchoolEntryText(published[i]), plainSchoolEntryText(published[j]));
      if (similarity > SIMILARITY_THRESHOLD) {
        issues.push(
          `전체 학교: ${published[i].schoolSlug} vs ${published[j].schoolSlug} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
            ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 학교명만 바뀐 동일 문서일 가능성)`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Checks the data-driven intro sentence every city-level region page
 * (src/app/region/[province]/[city]/page.tsx) renders via
 * buildRegionSchoolIntro(). Only regions with at least one registered school
 * are compared — those intros are expected to differ (real school names),
 * so a high pairwise similarity there means two regions are effectively
 * reading as the same document with only the region name swapped. Regions
 * with no school data yet share an honest, short "not yet covered" sentence
 * by design and are excluded from this check.
 */
export function checkRegionPageContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  const cityRegions = regions.filter((r) => r.level === "city");
  const withSchools = cityRegions
    .map((r) => ({
      slug: r.slug,
      intro: buildRegionSchoolIntro(r.slug, r.name, schools.filter((s) => s.cityRegionSlug === r.slug)),
    }))
    .filter((r) => schools.some((s) => s.cityRegionSlug === r.slug));

  for (let i = 0; i < withSchools.length; i++) {
    for (let j = i + 1; j < withSchools.length; j++) {
      const similarity = tokenSimilarity(withSchools[i].intro, withSchools[j].intro);
      if (similarity > SIMILARITY_THRESHOLD) {
        issues.push(
          `지역 허브 페이지: ${withSchools[i].slug} vs ${withSchools[j].slug} 인트로 유사도 ${(similarity * 100).toFixed(1)}%` +
            ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 지역명만 바뀐 동일 문서일 가능성)`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Checks the data-driven region FAQ every city-level region page renders via
 * buildRegionFaqs() (src/lib/regionFaq.ts) — the "school count/names" answer
 * (Q1, always present when the region has schools) must not read as the same
 * document across regions with only the region name swapped; the optional
 * district/program answers are derived directly from real per-region data
 * (getChildren(), regionProgramContents) so they're excluded from the
 * cross-region similarity check by construction (they only render at all for
 * a region that actually has that data).
 */
export function checkRegionFaqContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  const cityRegions = regions.filter((r) => r.level === "city");
  const withFaqs = cityRegions
    .map((r) => ({
      slug: r.slug,
      faqs: buildRegionFaqs(r.slug, r.name, schools.filter((s) => s.cityRegionSlug === r.slug)),
    }))
    .filter((r) => r.faqs.length > 0);

  for (const r of withFaqs) {
    for (const f of r.faqs) {
      if (!f.question.trim() || !f.answer.trim()) {
        issues.push(`지역 FAQ: ${r.slug}/${f.slug} — 빈 question/answer`);
      }
    }
  }

  for (let i = 0; i < withFaqs.length; i++) {
    for (let j = i + 1; j < withFaqs.length; j++) {
      const similarity = tokenSimilarity(withFaqs[i].faqs[0].answer, withFaqs[j].faqs[0].answer);
      if (similarity > SIMILARITY_THRESHOLD) {
        issues.push(
          `지역 FAQ: ${withFaqs[i].slug} vs ${withFaqs[j].slug} 학교 안내 답변 유사도 ${(similarity * 100).toFixed(1)}%` +
            ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과 — 지역명만 바뀐 동일 문서일 가능성)`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

function subGradeEntryText(c: SubGradeContent): string {
  return [c.intro, ...c.notes.map((n) => n.body)].join(" ");
}

/**
 * Checks every subGradeContent entry (src/data/subGradeContent.ts, the
 * /grade/[slug]/[subGradeSlug] page's content gate) for publish-readiness:
 * required fields, plus pairwise similarity across all published entries
 * (there's no secondary grouping axis here — every entry is already a
 * distinct grade transition year, so a full-corpus check is sufficient).
 */
export function checkSubGradeContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of subGradeContents) {
    const key = `${c.gradeSlug}/${c.subGradeSlug}`;
    if (c.status !== "published") continue;

    if (c.notes.length === 0) {
      issues.push(`${key}: status "published"이지만 notes가 비어 있음`);
    }
    if (c.intro.trim().length < MIN_INTRO_LENGTH) {
      issues.push(`${key}: intro가 최소 길이(${MIN_INTRO_LENGTH}자) 미만 (${c.intro.trim().length}자)`);
    }
    for (const note of c.notes) {
      if (!note.title.trim() || !note.body.trim()) {
        issues.push(`${key}: notes에 빈 title/body가 있음`);
      }
    }
  }

  const published = subGradeContents.filter((c) => c.status === "published");
  for (let i = 0; i < published.length; i++) {
    for (let j = i + 1; j < published.length; j++) {
      const similarity = tokenSimilarity(subGradeEntryText(published[i]), subGradeEntryText(published[j]));
      if (similarity > SIMILARITY_THRESHOLD) {
        const a = `${published[i].gradeSlug}/${published[i].subGradeSlug}`;
        const b = `${published[j].gradeSlug}/${published[j].subGradeSlug}`;
        issues.push(
          `${a} vs ${b} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
            ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과)`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

function subjectTopicEntryText(c: SubjectTopicContent): string {
  return [c.intro, ...c.notes.map((n) => n.body)].join(" ");
}

/**
 * Checks every subjectTopicContent entry (src/data/subjectTopicContent.ts,
 * the /subject/[slug]/[topicSlug] page's content gate) for publish-readiness,
 * mirroring checkSubGradeContentQuality: required fields, plus pairwise
 * similarity across all published entries (full corpus — topics already span
 * distinct subjects and sub-areas, so no secondary grouping axis is needed).
 */
export function checkSubjectTopicContentQuality(): ContentQualityResult {
  const issues: string[] = [];

  for (const c of subjectTopicContents) {
    const key = `${c.subjectSlug}/${c.topicSlug}`;
    if (c.status !== "published") continue;

    if (c.notes.length === 0) {
      issues.push(`${key}: status "published"이지만 notes가 비어 있음`);
    }
    if (c.intro.trim().length < MIN_INTRO_LENGTH) {
      issues.push(`${key}: intro가 최소 길이(${MIN_INTRO_LENGTH}자) 미만 (${c.intro.trim().length}자)`);
    }
    for (const note of c.notes) {
      if (!note.title.trim() || !note.body.trim()) {
        issues.push(`${key}: notes에 빈 title/body가 있음`);
      }
    }
  }

  const published = subjectTopicContents.filter((c) => c.status === "published");
  for (let i = 0; i < published.length; i++) {
    for (let j = i + 1; j < published.length; j++) {
      const similarity = tokenSimilarity(subjectTopicEntryText(published[i]), subjectTopicEntryText(published[j]));
      if (similarity > SIMILARITY_THRESHOLD) {
        const a = `${published[i].subjectSlug}/${published[i].topicSlug}`;
        const b = `${published[j].subjectSlug}/${published[j].topicSlug}`;
        issues.push(
          `${a} vs ${b} 콘텐츠 유사도 ${(similarity * 100).toFixed(1)}%` +
            ` (기준 ${SIMILARITY_THRESHOLD * 100}% 초과)`
        );
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
