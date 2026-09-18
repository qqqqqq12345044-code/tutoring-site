import { getRegionSubjectContent } from "@/data/regionSubjectContent";
import { getRegionGradeSubjectContent, isPublishedContent as isRegionGradeSubjectPublished } from "@/data/regionGradeSubjectContent";
import { getSchoolSubjectContent, isPublishedContent as isSchoolSubjectPublished } from "@/data/schoolSubjectContent";

/**
 * Central indexing policy for programmatic SEO routes.
 *
 * Derived from docs/qa/indexability-report.md (audit at git checkpoint a7fbe1c).
 * This is the single source of truth for "should this route be indexed /
 * included in sitemap.xml" — pages and sitemap.ts should call getIndexability()
 * rather than hardcoding robots/sitemap logic per URL.
 *
 * Category mapping (see the audit report for full reasoning):
 *   A/B (index, sitemap)   — subject, grade, school, region (province/city/plain district),
 *                            region+subject pages with dedicated regionSubjectContent,
 *                            region+grade+subject pages with a *published*
 *                            regionGradeSubjectContent entry, school+subject pages with a
 *                            *published* schoolSubjectContent entry (status "published" AND
 *                            at least one notes item — see each data file's isPublishedContent())
 *   C   (noindex, no sitemap) — region+subject / region+grade+subject / school+subject
 *                            fallback pages (no dedicated content, or a "draft" entry not yet ready)
 *   D   (noindex, no sitemap) — region+grade, region+district+subject
 *
 * Note: plain "school" (/school/[schoolSlug]) stays unconditionally indexed — that policy
 * is unchanged here. Only the new "school-subject" combination is content-gated.
 */

export type IndexabilityKind =
  | "subject"
  | "grade"
  | "school"
  | "region" // province / city / plain (subject-less, grade-less) district page
  | "region-subject" // /region/[province]/[city]/[subject]
  | "region-grade" // /region/[province]/[city]/[grade]
  | "region-grade-subject" // /region/[province]/[city]/[grade]/[subject]
  | "region-district-subject" // /region/[province]/[city]/[district]/[subject]
  | "school-subject"; // /school/[schoolSlug]/[subject]

export interface IndexabilityContext {
  /** City-level region slug, required for "region-subject" / "region-grade-subject" to look up dedicated content. */
  regionSlug?: string;
  /** Subject slug, required for "region-subject" / "region-grade-subject" / "school-subject". */
  subjectSlug?: string;
  /** Grade slug, required for "region-grade-subject" to look up dedicated content. */
  gradeSlug?: string;
  /** School slug, required for "school-subject" to look up dedicated content. */
  schoolSlug?: string;
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

    case "region-grade":
    case "region-district-subject":
      return NOT_INDEXED;
  }
}
