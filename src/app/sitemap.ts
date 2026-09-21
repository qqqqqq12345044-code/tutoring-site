import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { programs } from "@/data/programs";
import { regions, getRegionUrl, getChildren } from "@/data/regions";
import { schools } from "@/data/schools";
import { guideArticles } from "@/data/guide";
import { getIndexability } from "@/lib/indexability";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/subjects",
    "/grades",
    "/regions",
    "/schools",
    "/guide",
    "/lesson/visit",
    "/lesson/online",
    "/consult",
    "/privacy",
    "/terms",
  ];

  const dynamicPaths = [
    ...subjects.map((s) => `/subject/${s.slug}`),
    ...grades.map((g) => `/grade/${g.slug}`),
    ...programs.map((p) => `/program/${p.slug}`),
    ...regions.map((r) => getRegionUrl(r.slug)),
    ...schools.map((s) => `/school/${s.slug}`),
    ...guideArticles.map((a) => `/guide/${a.slug}`),
  ];

  // City-level combination pages: /region/[province]/[city]/[subject|grade],
  // plus the deeper grade+subject / district+subject pages one level below.
  // Inclusion follows the central indexing policy (src/lib/indexability.ts) —
  // only combinations marked `sitemap: true` there are listed here.
  const cityComboPaths: string[] = [];
  for (const city of regions.filter((r) => r.level === "city")) {
    const base = getRegionUrl(city.slug);

    for (const s of subjects) {
      if (getIndexability("region-subject", { regionSlug: city.slug, subjectSlug: s.slug }).sitemap) {
        cityComboPaths.push(`${base}/${s.slug}`);
      }
    }
    for (const g of grades) {
      if (getIndexability("region-grade").sitemap) cityComboPaths.push(`${base}/${g.slug}`);
    }
    for (const g of grades) {
      for (const s of subjects) {
        if (
          getIndexability("region-grade-subject", {
            regionSlug: city.slug,
            gradeSlug: g.slug,
            subjectSlug: s.slug,
          }).sitemap
        ) {
          cityComboPaths.push(`${base}/${g.slug}/${s.slug}`);
        }
      }
    }
    for (const district of getChildren(city.slug)) {
      for (const s of subjects) {
        if (getIndexability("region-district-subject").sitemap) {
          cityComboPaths.push(`${base}/${district.slug}/${s.slug}`);
        }
      }
    }
  }

  // School-level combination pages: /school/[schoolSlug]/[subject], bounded by
  // each school's own availableSubjectSlugs. Same content-gated pattern as
  // region-grade-subject above — only combos marked `sitemap: true` there
  // (i.e. a published schoolSubjectContent entry) are listed here.
  const schoolComboPaths: string[] = [];
  for (const school of schools) {
    for (const subjectSlug of school.availableSubjectSlugs) {
      if (getIndexability("school-subject", { schoolSlug: school.slug, subjectSlug }).sitemap) {
        schoolComboPaths.push(`/school/${school.slug}/${subjectSlug}`);
      }
    }
  }

  // Region+program combination pages: /region/[province]/[city]/program/[programSlug].
  // Same content-gated pattern as school-subject above — only combos marked
  // `sitemap: true` there (i.e. a published regionProgramContent entry) are listed here.
  const regionProgramPaths: string[] = [];
  for (const city of regions.filter((r) => r.level === "city")) {
    const base = getRegionUrl(city.slug);
    for (const p of programs) {
      if (getIndexability("region-program", { regionSlug: city.slug, programSlug: p.slug }).sitemap) {
        regionProgramPaths.push(`${base}/program/${p.slug}`);
      }
    }
  }

  const allPaths = Array.from(
    new Set([...staticPaths, ...dynamicPaths, ...cityComboPaths, ...schoolComboPaths, ...regionProgramPaths])
  );

  return allPaths.map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
  }));
}
