import { preExpansionRegionSlugs } from "@/data/regions";
import { countSchoolsInRegion } from "@/lib/indexability";

/**
 * Whether a city-level region gets combination routes under its hub:
 *   /region/[province]/[city]/[subject | grade | district]
 *   /region/[province]/[city]/[grade | district]/[subject]
 *   /region/[province]/[city]/program/[programSlug]
 *
 * The hub page itself (/region/[province]/[city]) always exists. Combination
 * routes exist only when the city has at least one registered school, so a
 * school-less region doesn't spawn ~27 identical template pages. Regions that
 * existed before the 2026-10-09 expansion keep their combos unconditionally —
 * those URLs are already public (removing them is a separate decision, see
 * docs/ai/NEXT_TASK.md). Adding a school to schools.ts turns the combos on
 * automatically; whether each combo is indexed is still decided by
 * src/lib/indexability.ts.
 *
 * Single source of truth for page resolvers, generateStaticParams, sitemap.ts
 * and scripts/lib/route-inventory.ts.
 */
export function hasRegionComboRoutes(citySlug: string): boolean {
  return preExpansionRegionSlugs.has(citySlug) || countSchoolsInRegion(citySlug) > 0;
}
