import { getRegionSubjectContent } from "@/data/regionSubjectContent";
import { getRegionGradeSubjectContent, isPublishedContent as isRegionGradeSubjectPublished } from "@/data/regionGradeSubjectContent";
import { getSchoolContent, isPublishedContent as isSchoolPublished } from "@/data/schoolContent";
import { getSchoolSubjectContent, isPublishedContent as isSchoolSubjectPublished } from "@/data/schoolSubjectContent";
import { getRegionProgramContent, isPublishedContent as isRegionProgramPublished } from "@/data/regionProgramContent";
import { getSubGradeContent, isPublishedContent as isSubGradePublished } from "@/data/subGradeContent";
import { getSubjectTopicContent, isPublishedContent as isSubjectTopicPublished } from "@/data/subjectTopicContent";
import { getRegionBySlug, getRegionUrl } from "@/data/regions";
import { qualityNoindexPaths } from "@/data/qualityNoindex";
import { schoolSubjectNoindexPaths } from "@/data/schoolSubjectNoindex";
import { schoolNoindexSlugs } from "@/data/schoolNoindex";
import { schools } from "@/data/schools";

/**
 * Central indexing policy for programmatic SEO routes.
 *
 * Derived from docs/qa/indexability-report.md (audit at git checkpoint a7fbe1c).
 * This is the single source of truth for "should this route be indexed /
 * included in sitemap.xml" — pages and sitemap.ts should call getIndexability()
 * rather than hardcoding robots/sitemap logic per URL.
 *
 * Category mapping (see the audit report for full reasoning):
 *   A/B (index, sitemap)   — subject, grade, program, region (province/city/plain district),
 *                            school pages with a *published* schoolContent entry,
 *                            sub-grade pages with a *published* subGradeContent entry,
 *                            subject-topic pages with a *published* subjectTopicContent entry,
 *                            region+subject pages with dedicated regionSubjectContent,
 *                            region+grade+subject pages with a *published*
 *                            regionGradeSubjectContent entry, school+subject pages with a
 *                            *published* schoolSubjectContent entry, region+program pages with a
 *                            *published* regionProgramContent entry (status "published" AND
 *                            at least one notes item — see each data file's isPublishedContent())
 *   C   (noindex, no sitemap) — school / sub-grade / region+subject / region+grade+subject /
 *                            school+subject / region+program fallback pages (no dedicated
 *                            content, or a "draft" entry not yet ready)
 *   D   (noindex, no sitemap) — region+grade, region+district+subject
 *
 * Note: plain "school" (/school/[schoolSlug]) is content-gated the same way as
 * "school-subject" (2026-09 change — ~97% of school pages were near-duplicate
 * templates once school count scaled past ~100; see docs/qa for the audit).
 * Plain "program" (/program/[slug]) is unchanged and still unconditionally indexed.
 *
 * "region" (province / city / district hub) is gated on registered schools
 * (2026-10 change): a region with no school anywhere in its subtree renders
 * the same template as every other empty region (audit: 14 provinces read
 * ~100% identical), so it stays reachable for users but is noindex and out of
 * the sitemap until schools.ts covers it.
 *
 * "region-subject" / "region-grade-subject" / "school-subject" pages listed in
 * src/data/qualityNoindex.ts (quality gate RED, 2026-10) are noindex even with
 * published content; the page itself still renders unchanged.
 */

export type IndexabilityKind =
  | "subject"
  | "grade"
  | "sub-grade" // /grade/[slug]/[subGradeSlug]
  | "subject-topic" // /subject/[slug]/[topicSlug]
  | "school" // /school/[schoolSlug]
  | "program" // /program/[slug]
  | "region" // province / city / plain (subject-less, grade-less) district page
  | "region-subject" // /region/[province]/[city]/[subject]
  | "region-grade" // /region/[province]/[city]/[grade]
  | "region-grade-subject" // /region/[province]/[city]/[grade]/[subject]
  | "region-district-subject" // /region/[province]/[city]/[district]/[subject]
  | "school-subject" // /school/[schoolSlug]/[subject]
  | "region-program"; // /region/[province]/[city]/program/[programSlug]

export interface IndexabilityContext {
  /**
   * Region slug. Any level for "region" (school-count gate); city-level for
   * "region-subject" / "region-grade-subject" / "region-program" to look up dedicated content.
   */
  regionSlug?: string;
  /** Subject slug, required for "region-subject" / "region-grade-subject" / "school-subject". */
  subjectSlug?: string;
  /** Grade slug, required for "region-grade-subject" / "sub-grade" to look up dedicated content. */
  gradeSlug?: string;
  /** Sub-grade slug (e.g. "6" for 초6), required for "sub-grade" to look up dedicated content. */
  subGradeSlug?: string;
  /** Subject topic slug (e.g. "syntax" for 구문), required for "subject-topic" to look up dedicated content. */
  topicSlug?: string;
  /** School slug, required for "school" / "school-subject" to look up dedicated content. */
  schoolSlug?: string;
  /** Program slug, required for "region-program" to look up dedicated content. */
  programSlug?: string;
}

export interface Indexability {
  /** Whether the page should be indexable (robots: index vs noindex). Always paired with "follow". */
  index: boolean;
  /** Whether the URL should be listed in sitemap.xml. */
  sitemap: boolean;
}

/** Registered schools located anywhere under a province / city / district node. */
export function countSchoolsInRegion(regionSlug: string): number {
  return schools.filter(
    (s) =>
      s.cityRegionSlug === regionSlug ||
      s.districtRegionSlug === regionSlug ||
      getRegionBySlug(s.cityRegionSlug)?.parentSlug === regionSlug
  ).length;
}

const INDEXED: Indexability = { index: true, sitemap: true };
const NOT_INDEXED: Indexability = { index: false, sitemap: false };

export function getIndexability(kind: IndexabilityKind, ctx: IndexabilityContext = {}): Indexability {
  switch (kind) {
    case "subject":
    case "grade":
    case "program":
      return INDEXED;

    case "region":
      return ctx.regionSlug && countSchoolsInRegion(ctx.regionSlug) > 0 ? INDEXED : NOT_INDEXED;

    case "school": {
      const content = ctx.schoolSlug ? getSchoolContent(ctx.schoolSlug) : undefined;
      if (ctx.schoolSlug && schoolNoindexSlugs.has(ctx.schoolSlug)) return NOT_INDEXED; // editorial hold (휴교 등)
      return isSchoolPublished(content) ? INDEXED : NOT_INDEXED;
    }

    case "sub-grade": {
      const content =
        ctx.gradeSlug && ctx.subGradeSlug ? getSubGradeContent(ctx.gradeSlug, ctx.subGradeSlug) : undefined;
      return isSubGradePublished(content) ? INDEXED : NOT_INDEXED;
    }

    case "subject-topic": {
      const content =
        ctx.subjectSlug && ctx.topicSlug ? getSubjectTopicContent(ctx.subjectSlug, ctx.topicSlug) : undefined;
      return isSubjectTopicPublished(content) ? INDEXED : NOT_INDEXED;
    }

    case "region-subject": {
      const hasDedicatedContent = Boolean(
        ctx.regionSlug && ctx.subjectSlug && getRegionSubjectContent(ctx.regionSlug, ctx.subjectSlug)
      );
      if (!hasDedicatedContent) return NOT_INDEXED;
      return qualityNoindexPaths.has(`${getRegionUrl(ctx.regionSlug!)}/${ctx.subjectSlug}`) ? NOT_INDEXED : INDEXED;
    }

    case "region-grade-subject": {
      const content =
        ctx.regionSlug && ctx.gradeSlug && ctx.subjectSlug
          ? getRegionGradeSubjectContent(ctx.regionSlug, ctx.gradeSlug, ctx.subjectSlug)
          : undefined;
      if (!isRegionGradeSubjectPublished(content)) return NOT_INDEXED;
      return qualityNoindexPaths.has(`${getRegionUrl(content.regionSlug)}/${content.gradeSlug}/${content.subjectSlug}`)
        ? NOT_INDEXED
        : INDEXED;
    }

    case "school-subject": {
      const content =
        ctx.schoolSlug && ctx.subjectSlug ? getSchoolSubjectContent(ctx.schoolSlug, ctx.subjectSlug) : undefined;
      if (!isSchoolSubjectPublished(content)) return NOT_INDEXED;
      const path = `/school/${content.schoolSlug}/${content.subjectSlug}`;
      // RED holds (quality gate) and editorial school×subject holds (AMBER) are kept in separate lists.
      return qualityNoindexPaths.has(path) || schoolSubjectNoindexPaths.has(path) ? NOT_INDEXED : INDEXED;
    }

    case "region-program": {
      const content =
        ctx.regionSlug && ctx.programSlug ? getRegionProgramContent(ctx.regionSlug, ctx.programSlug) : undefined;
      return isRegionProgramPublished(content) ? INDEXED : NOT_INDEXED;
    }

    case "region-grade":
    case "region-district-subject":
      return NOT_INDEXED;
  }
}
