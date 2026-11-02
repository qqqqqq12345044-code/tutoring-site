import type { School } from "@/data/schools";
import { getRegionBySlug, getRegionPath, getRegionUrl } from "@/data/regions";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { hasRegionComboRoutes } from "@/lib/regionRoutes";

export const schoolLevelToGradeSlug: Record<School["level"], string> = {
  초등학교: "elementary",
  중학교: "middle",
  고등학교: "high",
};

/**
 * Hierarchical breadcrumb for school pages, mirroring the site's information
 * structure rather than the flat /school/[slug] URL:
 *   지역별 과외 > 서울 과외 > 강서구 과외 > (수원 영통구 과외 >) 초등학교 > ○○초등학교 과외
 *
 * The 학교급 crumb links to the city-level region+grade hub
 * (/region/[province]/[city]/[grade]), which lists that city's schools of the
 * same level. URLs themselves are unchanged. Also used for national PAGE_ONLY schools (src/data/nationalSchools.ts).
 */
export function buildSchoolBreadcrumb(
  school: Pick<School, "slug" | "name" | "level" | "cityRegionSlug" | "districtRegionSlug">
): BreadcrumbItem[] {
  const regionPath = getRegionPath(school.districtRegionSlug ?? school.cityRegionSlug);
  const city = getRegionBySlug(school.cityRegionSlug);

  const items: BreadcrumbItem[] = [{ name: "지역별 과외", href: "/regions" }];
  for (const r of regionPath) items.push({ name: `${r.name} 과외`, href: getRegionUrl(r.slug) });
  // The 학교급 hub is a combo route — only link it where combo routes exist (national PAGE_ONLY schools in
  // cities without a registered school would otherwise point at a 404).
  if (city && hasRegionComboRoutes(city.slug)) items.push({ name: school.level, href: `${getRegionUrl(city.slug)}/${schoolLevelToGradeSlug[school.level]}` });
  items.push({ name: `${school.name} 과외`, href: `/school/${school.slug}` });
  return items;
}
