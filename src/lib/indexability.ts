import { getRegionSubjectContent } from "@/data/regionSubjectContent";
import { getRegionGradeSubjectContent, isPublishedContent as isRegionGradeSubjectPublished } from "@/data/regionGradeSubjectContent";
import { getSchoolSubjectContent, isPublishedContent as isSchoolSubjectPublished } from "@/data/schoolSubjectContent";
import { getRegionProgramContent, isPublishedContent as isRegionProgramPublished } from "@/data/regionProgramContent";

/**
 * Central indexing policy for programmatic SEO routes.
 *
 * Derived from docs/qa/indexability-report.md (audit at git checkpoint a7fbe1c).
 * This is the single source of truth for "should this route be indexed /
 * included in sitemap.xml" — pages and sitemap.ts should call getIndexability()
 * rather than hardcoding robots/sitemap logic per URL.
 *
 * Category mapping (see the audit report for full reasoning):
 *   A/B (index, sitemap)   — subject, grade, school, program, region (province/city/plain district),
 *                            region+subject pages with dedicated regionSubjectContent,
 *                            region+grade+subject pages with a *published*
 *                            regionGradeSubjectContent entry, school+subject pages with a
 *                            *published* schoolSubjectContent entry, region+program pages with a
 *                            *published* regionProgramContent entry (status "published" AND
 *                            at least one notes item — see each data file's isPublishedContent())
 *   C   (noindex, no sitemap) — region+subject / region+grade+subject / school+subject / region+program
 *                            fallback pages (no dedicated content, or a "draft" entry not yet ready)
 *   D   (noindex, no sitemap) — region+grade, region+district+subject
 *
 * Note: plain "school" (/school/[schoolSlug]) stays unconditionally indexed — that policy
 * is unchanged here. Only the new "school-subject" combination is content-gated. Same for
 * plain "program" (/program/[slug]) vs. the "region-program" combination.
 */

export type IndexabilityKind =
  | "subject"
  | "grade"
  | "school"
  | "program" // /program/[slug]
  | "region" // province / city / plain (subject-less, grade-less) district page
  | "region-subject" // /region/[province]/[city]/[subject]
  | "region-grade" // /region/[province]/[city]/[grade]
  | "region-grade-subject" // /region/[province]/[city]/[grade]/[subject]
  | "region-district-subject" // /region/[province]/[city]/[district]/[subject]
  | "school-subject" // /school/[schoolSlug]/[subject]
  | "region-program"; // /region/[province]/[city]/program/[programSlug]

export interface IndexabilityContext {
  /** City-level region slug, required for "region-subject" / "region-grade-subject" / "region-program" to look up dedicated content. */
  regionSlug?: string;
  /** Subject slug, required for "region-subject" / "region-grade-subject" / "school-subject". */
  subjectSlug?: string;
  /** Grade slug, required for "region-grade-subject" to look up dedicated content. */
  gradeSlug?: string;
  /** School slug, required for "school-subject" to look up dedicated content. */
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

const INDEXED: Indexability = { index: true, sitemap: true };
const NOT_INDEXED: Indexability = { index: false, sitemap: false };

export function getIndexability(kind: IndexabilityKind, ctx: IndexabilityContext = {}): Indexability {
  switch (kind) {
    case "subject":
    case "grade":
    case "school":
    case "program":
    case "region":
      return INDEXED;

    case "region-subject": {
      const hasDedicatedContent = Boolean(
        ctx.regionSlug && ctx.subjectSlug && getRegionSubjectContent(ctx.regionSlug, ctx.subjectSlug)
      );
      return hasDedicatedContent ? INDEXED : NOT_INDEXED;
    }

    case "region-grade-subject": {
      const content =
        ctx.regionSlug && ctx.gradeSlug && ctx.subjectSlug
          ? getRegionGradeSubjectContent(ctx.regionSlug, ctx.gradeSlug, ctx.subjectSlug)
          : undefined;
      return isRegionGradeSubjectPublished(content) ? INDEXED : NOT_INDEXED;
    }

    case "school-subject": {
      const content =
        ctx.schoolSlug && ctx.subjectSlug ? getSchoolSubjectContent(ctx.schoolSlug, ctx.subjectSlug) : undefined;
      return isSchoolSubjectPublished(content) ? INDEXED : NOT_INDEXED;
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
