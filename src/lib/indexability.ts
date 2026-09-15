import { getRegionSubjectContent } from "@/data/regionSubjectContent";

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
 *                            region+subject pages that have dedicated regionSubjectContent
 *   C   (noindex, no sitemap) — region+subject fallback pages (no dedicated content)
 *   D   (noindex, no sitemap) — region+grade, region+grade+subject, region+district+subject
 */

export type IndexabilityKind =
  | "subject"
  | "grade"
  | "school"
  | "region" // province / city / plain (subject-less, grade-less) district page
  | "region-subject" // /region/[province]/[city]/[subject]
  | "region-grade" // /region/[province]/[city]/[grade]
  | "region-grade-subject" // /region/[province]/[city]/[grade]/[subject]
  | "region-district-subject"; // /region/[province]/[city]/[district]/[subject]

export interface IndexabilityContext {
  /** City-level region slug, required for "region-subject" to look up dedicated content. */
  regionSlug?: string;
  /** Subject slug, required for "region-subject". */
  subjectSlug?: string;
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

    case "region-grade":
    case "region-grade-subject":
    case "region-district-subject":
      return NOT_INDEXED;
  }
}
