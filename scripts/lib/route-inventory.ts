/**
 * Single source of truth for "how many routes exist and which are indexed".
 * Reuses the real site modules (src/lib/indexability.ts, src/data/*, and the
 * actual sitemap()/robots() route handlers) instead of re-implementing the
 * SEO policy — this file only enumerates *which* URLs exist; the
 * index/sitemap decision always comes from getIndexability().
 */
import { siteConfig } from "@/config/site";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { regions, getChildren, getRegionUrl } from "@/data/regions";
import { schools } from "@/data/schools";
import { guideArticles } from "@/data/guide";
import { getIndexability } from "@/lib/indexability";
import sitemap from "../../src/app/sitemap";
import robots from "../../src/app/robots";

export interface RouteEntry {
  path: string;
  index: boolean;
  sitemap: boolean;
}

const STATIC_PATHS = [
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

/** Every content route (page-producing URL), each tagged with its real indexability. */
export function getAllContentRoutes(): RouteEntry[] {
  const routes: RouteEntry[] = [];

  for (const path of STATIC_PATHS) routes.push({ path, index: true, sitemap: true });
  for (const s of subjects) routes.push({ path: `/subject/${s.slug}`, index: true, sitemap: true });
  for (const g of grades) routes.push({ path: `/grade/${g.slug}`, index: true, sitemap: true });
  for (const sc of schools) routes.push({ path: `/school/${sc.slug}`, index: true, sitemap: true });
  for (const a of guideArticles) routes.push({ path: `/guide/${a.slug}`, index: true, sitemap: true });

  // region / province / city / plain-district pages — always indexed.
  for (const r of regions) {
    const { index, sitemap } = getIndexability("region");
    routes.push({ path: getRegionUrl(r.slug), index, sitemap });
  }

  // City-level combination pages, mirroring src/app/sitemap.ts's iteration.
  for (const city of regions.filter((r) => r.level === "city")) {
    const base = getRegionUrl(city.slug);

    for (const s of subjects) {
      const { index, sitemap } = getIndexability("region-subject", {
        regionSlug: city.slug,
        subjectSlug: s.slug,
      });
      routes.push({ path: `${base}/${s.slug}`, index, sitemap });
    }
    for (const g of grades) {
      const { index, sitemap } = getIndexability("region-grade");
      routes.push({ path: `${base}/${g.slug}`, index, sitemap });
    }
    for (const g of grades) {
      for (const s of subjects) {
        const { index, sitemap } = getIndexability("region-grade-subject");
        routes.push({ path: `${base}/${g.slug}/${s.slug}`, index, sitemap });
      }
    }
    for (const district of getChildren(city.slug)) {
      for (const s of subjects) {
        const { index, sitemap } = getIndexability("region-district-subject");
        routes.push({ path: `${base}/${district.slug}/${s.slug}`, index, sitemap });
      }
    }
  }

  return routes;
}

export interface InventorySummary {
  totalRoutes: number; // content routes + robots.txt + sitemap.xml
  contentRoutes: number;
  sitemapCount: number;
  noindexCount: number;
  duplicateSitemapUrls: string[];
  indexSitemapMismatches: string[]; // routes where index/sitemap flags disagree with the real sitemap() output
}

export function getSitemapPaths(): string[] {
  return sitemap().map((entry) => entry.url.replace(siteConfig.domain, ""));
}

export function computeSummary(): InventorySummary {
  const routes = getAllContentRoutes();
  const contentRoutes = routes.length;
  const noindexCount = routes.filter((r) => !r.index).length;

  const realSitemapUrls = sitemap().map((entry) => entry.url.replace(siteConfig.domain, ""));
  const sitemapSet = new Set(realSitemapUrls);

  const seen = new Set<string>();
  const duplicateSitemapUrls: string[] = [];
  for (const url of realSitemapUrls) {
    if (seen.has(url)) duplicateSitemapUrls.push(url);
    seen.add(url);
  }

  const indexSitemapMismatches: string[] = [];
  for (const r of routes) {
    const inSitemap = sitemapSet.has(r.path);
    if (inSitemap !== r.sitemap) indexSitemapMismatches.push(r.path);
  }

  robots(); // smoke-check it doesn't throw

  return {
    totalRoutes: contentRoutes + 2, // + /robots.txt + /sitemap.xml
    contentRoutes,
    sitemapCount: sitemapSet.size,
    noindexCount,
    duplicateSitemapUrls,
    indexSitemapMismatches,
  };
}
