import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { regions, getRegionUrl, getChildren } from "@/data/regions";
import { schools } from "@/data/schools";
import { guideArticles } from "@/data/guide";

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
    ...regions.map((r) => getRegionUrl(r.slug)),
    ...schools.map((s) => `/school/${s.slug}`),
    ...guideArticles.map((a) => `/guide/${a.slug}`),
  ];

  // City-level combination pages: /region/[province]/[city]/[subject|grade],
  // plus the deeper grade+subject / district+subject pages one level below.
  const cityComboPaths: string[] = [];
  for (const city of regions.filter((r) => r.level === "city")) {
    const base = getRegionUrl(city.slug);
    for (const s of subjects) cityComboPaths.push(`${base}/${s.slug}`);
    for (const g of grades) cityComboPaths.push(`${base}/${g.slug}`);

    for (const g of grades) {
      for (const s of subjects) cityComboPaths.push(`${base}/${g.slug}/${s.slug}`);
    }
    for (const district of getChildren(city.slug)) {
      for (const s of subjects) cityComboPaths.push(`${base}/${district.slug}/${s.slug}`);
    }
  }

  const allPaths = Array.from(new Set([...staticPaths, ...dynamicPaths, ...cityComboPaths]));

  return allPaths.map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
  }));
}
