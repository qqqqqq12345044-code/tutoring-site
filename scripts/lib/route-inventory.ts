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
import { programs } from "@/data/programs";
import { regions, getChildren, getRegionUrl, getRegionBySlug } from "@/data/regions";
import { schools } from "@/data/schools";
import { guideArticles } from "@/data/guide";
import { getRegionGradeSubjectContent, isPublishedContent } from "@/data/regionGradeSubjectContent";
import { getSchoolContent, isPublishedContent as isSchoolPublished } from "@/data/schoolContent";
import { getSchoolSubjectContent, isPublishedContent as isSchoolSubjectPublished } from "@/data/schoolSubjectContent";
import { getRegionProgramContent, isPublishedContent as isRegionProgramPublished } from "@/data/regionProgramContent";
import { getSubGradeContent, isPublishedContent as isSubGradePublished } from "@/data/subGradeContent";
import { getSubjectTopicContent, isPublishedContent as isSubjectTopicPublished } from "@/data/subjectTopicContent";
import { getIndexability, countSchoolsInRegion } from "@/lib/indexability";
import { hasRegionComboRoutes } from "@/lib/regionRoutes";
import { preExpansionRegionSlugs } from "@/data/regions";
import { qualityNoindexPaths } from "@/data/qualityNoindex";
import { schoolSubjectNoindexPaths } from "@/data/schoolSubjectNoindex";
import { schoolNoindexSlugs } from "@/data/schoolNoindex";
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
  for (const sc of schools) {
    const { index, sitemap } = getIndexability("school", { schoolSlug: sc.slug });
    routes.push({ path: `/school/${sc.slug}`, index, sitemap });
  }
  for (const g of grades) {
    for (const sg of g.subGrades) {
      const { index, sitemap } = getIndexability("sub-grade", { gradeSlug: g.slug, subGradeSlug: sg.slug });
      routes.push({ path: `/grade/${g.slug}/${sg.slug}`, index, sitemap });
    }
  }
  for (const s of subjects) {
    for (const t of s.topics) {
      const { index, sitemap } = getIndexability("subject-topic", { subjectSlug: s.slug, topicSlug: t.slug });
      routes.push({ path: `/subject/${s.slug}/${t.slug}`, index, sitemap });
    }
  }
  for (const a of guideArticles) routes.push({ path: `/guide/${a.slug}`, index: true, sitemap: true });
  for (const p of programs) routes.push({ path: `/program/${p.slug}`, index: true, sitemap: true });

  // region / province / city / plain-district pages — gated on registered schools.
  for (const r of regions) {
    const { index, sitemap } = getIndexability("region", { regionSlug: r.slug });
    routes.push({ path: getRegionUrl(r.slug), index, sitemap });
  }

  // City-level combination pages, mirroring src/app/sitemap.ts's iteration. School-less regions added
  // in the 2026-10 expansion have no combination routes at all (src/lib/regionRoutes.ts).
  for (const city of regions.filter((r) => r.level === "city" && hasRegionComboRoutes(r.slug))) {
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
        const { index, sitemap } = getIndexability("region-grade-subject", {
          regionSlug: city.slug,
          gradeSlug: g.slug,
          subjectSlug: s.slug,
        });
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

  // School-level combination pages, mirroring src/app/sitemap.ts's iteration.
  for (const school of schools) {
    for (const subjectSlug of school.availableSubjectSlugs) {
      const { index, sitemap } = getIndexability("school-subject", { schoolSlug: school.slug, subjectSlug });
      routes.push({ path: `/school/${school.slug}/${subjectSlug}`, index, sitemap });
    }
  }

  // Region+program combination pages, mirroring src/app/sitemap.ts's iteration.
  for (const city of regions.filter((r) => r.level === "city" && hasRegionComboRoutes(r.slug))) {
    const base = getRegionUrl(city.slug);
    for (const p of programs) {
      const { index, sitemap } = getIndexability("region-program", { regionSlug: city.slug, programSlug: p.slug });
      routes.push({ path: `${base}/program/${p.slug}`, index, sitemap });
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

export interface GateCheckResult {
  ok: boolean;
  issues: string[];
}

/**
 * Regression check for the region-grade-subject content gate
 * (src/data/regionGradeSubjectContent.ts): for every city × grade × subject
 * combination, whether getIndexability() marks it index+sitemap must match
 * isPublishedContent() on the raw data (status "published" + at least one
 * regionSpecificNotes item — a "draft" entry must NOT be indexed). This
 * independently cross-checks the policy function against the raw data (not
 * just against itself), so a bug in the "region-grade-subject" case of
 * indexability.ts is caught across all 165 combos, not just a hand-picked few.
 */
export function checkRegionGradeSubjectGate(): GateCheckResult {
  const issues: string[] = [];

  for (const city of regions.filter((r) => r.level === "city")) {
    for (const g of grades) {
      for (const s of subjects) {
        const isEligible =
          isPublishedContent(getRegionGradeSubjectContent(city.slug, g.slug, s.slug)) &&
          !qualityNoindexPaths.has(`${getRegionUrl(city.slug)}/${g.slug}/${s.slug}`);
        const { index, sitemap } = getIndexability("region-grade-subject", {
          regionSlug: city.slug,
          gradeSlug: g.slug,
          subjectSlug: s.slug,
        });
        if (index !== isEligible || sitemap !== isEligible) {
          issues.push(
            `region-grade-subject gate: ${city.slug}/${g.slug}/${s.slug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`
          );
        }
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Structural integrity check for src/data/schools.ts, ahead of scaling it
 * past the Stage 1 pilot (33 schools): every school.slug must be globally
 * unique, cityRegionSlug must reference an existing city-level RegionNode,
 * and districtRegionSlug (when present) must reference an existing
 * district-level RegionNode whose parentSlug matches that school's
 * cityRegionSlug.
 */
export function checkSchoolDataIntegrity(): GateCheckResult {
  const issues: string[] = [];

  const slugCounts = new Map<string, number>();
  for (const s of schools) slugCounts.set(s.slug, (slugCounts.get(s.slug) ?? 0) + 1);
  for (const [slug, count] of slugCounts) {
    if (count > 1) issues.push(`school slug 중복: "${slug}" (${count}건)`);
  }

  for (const s of schools) {
    const cityRegion = getRegionBySlug(s.cityRegionSlug);
    if (!cityRegion) {
      issues.push(`${s.slug}: cityRegionSlug "${s.cityRegionSlug}"가 regions.ts에 존재하지 않음`);
    } else if (cityRegion.level !== "city") {
      issues.push(`${s.slug}: cityRegionSlug "${s.cityRegionSlug}"는 city-level이 아님 (level=${cityRegion.level})`);
    }

    if (s.districtRegionSlug) {
      const districtRegion = getRegionBySlug(s.districtRegionSlug);
      if (!districtRegion) {
        issues.push(`${s.slug}: districtRegionSlug "${s.districtRegionSlug}"가 regions.ts에 존재하지 않음`);
      } else if (districtRegion.parentSlug !== s.cityRegionSlug) {
        issues.push(
          `${s.slug}: districtRegionSlug "${s.districtRegionSlug}"의 부모(${districtRegion.parentSlug})가 cityRegionSlug "${s.cityRegionSlug}"와 일치하지 않음`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the plain-school content gate (src/data/schoolContent.ts),
 * mirroring checkSchoolSubjectGate: for every school, whether getIndexability()
 * marks it index+sitemap must match isPublishedContent() on the raw data.
 */
export function checkSchoolGate(): GateCheckResult {
  const issues: string[] = [];

  for (const school of schools) {
    const isEligible = isSchoolPublished(getSchoolContent(school.slug)) && !schoolNoindexSlugs.has(school.slug);
    const { index, sitemap } = getIndexability("school", { schoolSlug: school.slug });
    if (index !== isEligible || sitemap !== isEligible) {
      issues.push(`school gate: ${school.slug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`);
    }
  }
  for (const slug of schoolNoindexSlugs) {
    if (!schools.some((s) => s.slug === slug)) issues.push(`school noindex hold is not a registered school: ${slug}`);
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the sub-grade content gate (src/data/subGradeContent.ts),
 * mirroring checkSchoolGate: for every grade × sub-grade combination, whether
 * getIndexability() marks it index+sitemap must match isPublishedContent()
 * on the raw data.
 */
export function checkSubGradeGate(): GateCheckResult {
  const issues: string[] = [];

  for (const grade of grades) {
    for (const subGrade of grade.subGrades) {
      const isEligible = isSubGradePublished(getSubGradeContent(grade.slug, subGrade.slug));
      const { index, sitemap } = getIndexability("sub-grade", { gradeSlug: grade.slug, subGradeSlug: subGrade.slug });
      if (index !== isEligible || sitemap !== isEligible) {
        issues.push(
          `sub-grade gate: ${grade.slug}/${subGrade.slug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the subject-topic content gate
 * (src/data/subjectTopicContent.ts), mirroring checkSubGradeGate: for every
 * subject × topic combination, whether getIndexability() marks it
 * index+sitemap must match isPublishedContent() on the raw data.
 */
export function checkSubjectTopicGate(): GateCheckResult {
  const issues: string[] = [];

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const isEligible = isSubjectTopicPublished(getSubjectTopicContent(subject.slug, topic.slug));
      const { index, sitemap } = getIndexability("subject-topic", { subjectSlug: subject.slug, topicSlug: topic.slug });
      if (index !== isEligible || sitemap !== isEligible) {
        issues.push(
          `subject-topic gate: ${subject.slug}/${topic.slug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the school-subject content gate
 * (src/data/schoolSubjectContent.ts), mirroring checkRegionGradeSubjectGate:
 * for every school × its own availableSubjectSlugs combination, whether
 * getIndexability() marks it index+sitemap must match isPublishedContent()
 * on the raw data.
 */
export function checkSchoolSubjectGate(): GateCheckResult {
  const issues: string[] = [];

  for (const school of schools) {
    for (const subjectSlug of school.availableSubjectSlugs) {
      const isEligible =
        isSchoolSubjectPublished(getSchoolSubjectContent(school.slug, subjectSlug)) &&
        !qualityNoindexPaths.has(`/school/${school.slug}/${subjectSlug}`) &&
        !schoolSubjectNoindexPaths.has(`/school/${school.slug}/${subjectSlug}`);
      const { index, sitemap } = getIndexability("school-subject", { schoolSlug: school.slug, subjectSlug });
      if (index !== isEligible || sitemap !== isEligible) {
        issues.push(
          `school-subject gate: ${school.slug}/${subjectSlug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the region-program content gate
 * (src/data/regionProgramContent.ts), mirroring checkSchoolSubjectGate:
 * for every city × program combination, whether getIndexability() marks it
 * index+sitemap must match isPublishedContent() on the raw data.
 */
export function checkRegionProgramGate(): GateCheckResult {
  const issues: string[] = [];

  for (const city of regions.filter((r) => r.level === "city")) {
    for (const p of programs) {
      const isEligible = isRegionProgramPublished(getRegionProgramContent(city.slug, p.slug));
      const { index, sitemap } = getIndexability("region-program", { regionSlug: city.slug, programSlug: p.slug });
      if (index !== isEligible || sitemap !== isEligible) {
        issues.push(
          `region-program gate: ${city.slug}/${p.slug} — published-eligible=${isEligible} but index=${index} sitemap=${sitemap}`
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Route-collision check for the new program track: /program/[slug] lives in
 * its own top-level namespace (no existing route uses that first segment),
 * and /region/[province]/[city]/program/[programSlug] adds a literal
 * "program" segment as a sibling of the existing polymorphic
 * /region/[province]/[city]/[slug] route (which resolves subject → grade →
 * district, in that order). Next.js always prefers a literal path segment
 * over a sibling dynamic one, so this only stays unambiguous as long as no
 * program slug also happens to be a subject/grade/district slug (which would
 * make that value unreachable through the [slug] resolver) and no existing
 * slug is literally "program".
 */
export function checkProgramRouteCollisions(): GateCheckResult {
  const issues: string[] = [];

  const subjectSlugs = new Set(subjects.map((s) => s.slug));
  const gradeSlugs = new Set(grades.map((g) => g.slug));
  const districtSlugs = new Set(regions.filter((r) => r.level === "district").map((r) => r.slug));

  for (const p of programs) {
    if (subjectSlugs.has(p.slug)) issues.push(`program slug "${p.slug}"가 subject slug와 충돌함`);
    if (gradeSlugs.has(p.slug)) issues.push(`program slug "${p.slug}"가 grade slug와 충돌함`);
    if (districtSlugs.has(p.slug)) issues.push(`program slug "${p.slug}"가 district slug와 충돌함`);
  }
  if (subjectSlugs.has("program") || gradeSlugs.has("program") || districtSlugs.has("program")) {
    issues.push('기존 subject/grade/district slug 중 "program"이 이미 존재함 (region/[city]/program 세그먼트와 충돌)');
  }
  if (STATIC_PATHS.includes("/program")) {
    issues.push('STATIC_PATHS에 "/program"이 이미 존재함 (/program/[slug]와 충돌)');
  }

  const programSlugCounts = new Map<string, number>();
  for (const p of programs) programSlugCounts.set(p.slug, (programSlugCounts.get(p.slug) ?? 0) + 1);
  for (const [slug, count] of programSlugCounts) {
    if (count > 1) issues.push(`program slug 중복: "${slug}" (${count}건)`);
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Combination-route gate (2026-10-09, src/lib/regionRoutes.ts): every city hub
 * exists; a city's combination routes (subject / grade / grade×subject /
 * district×subject / program) exist in full when the city predates the
 * 2026-10 expansion or has a registered school, and not at all otherwise.
 * Cross-checks the helper against preExpansionRegionSlugs + a direct school
 * count, so pre-existing public URLs can't silently disappear.
 */
export function checkRegionComboRoutes(): GateCheckResult {
  const issues: string[] = [];
  const paths = new Set(getAllContentRoutes().map((r) => r.path));
  for (const city of regions.filter((r) => r.level === "city")) {
    const base = getRegionUrl(city.slug);
    const expected =
      preExpansionRegionSlugs.has(city.slug) || schools.some((s) => s.cityRegionSlug === city.slug);
    if (hasRegionComboRoutes(city.slug) !== expected) issues.push(`combo gate: ${city.slug} helper=${!expected} expected=${expected}`);
    if (!paths.has(base)) issues.push(`combo gate: city hub missing ${base}`);
    const combos = [
      ...subjects.map((s) => `${base}/${s.slug}`),
      ...grades.flatMap((g) => [`${base}/${g.slug}`, ...subjects.map((s) => `${base}/${g.slug}/${s.slug}`)]),
      ...getChildren(city.slug).flatMap((d) => subjects.map((s) => `${base}/${d.slug}/${s.slug}`)),
      ...programs.map((p) => `${base}/program/${p.slug}`),
    ];
    const present = combos.filter((p) => paths.has(p)).length;
    if (expected && present !== combos.length) issues.push(`combo gate: ${city.slug} has ${present}/${combos.length} combo routes`);
    if (!expected && present !== 0) issues.push(`combo gate: school-less ${city.slug} still has ${present} combo routes`);
  }
  return { ok: issues.length === 0, issues };
}

/**
 * Regression check for the region hub gate (2026-10): a province / city /
 * district page is index+sitemap exactly when at least one registered school
 * sits in its subtree. Cross-checks getIndexability("region") against a
 * direct count over schools.ts so a slip in either side is caught.
 */
export function checkRegionGate(): GateCheckResult {
  const issues: string[] = [];
  for (const r of regions) {
    const direct = schools.filter(
      (s) =>
        s.cityRegionSlug === r.slug ||
        s.districtRegionSlug === r.slug ||
        getRegionBySlug(s.cityRegionSlug)?.parentSlug === r.slug
    ).length;
    const eligible = direct > 0;
    const { index, sitemap } = getIndexability("region", { regionSlug: r.slug });
    if (index !== eligible || sitemap !== eligible || countSchoolsInRegion(r.slug) !== direct) {
      issues.push(`region gate: ${r.slug} — schools=${direct} but index=${index} sitemap=${sitemap}`);
    }
  }
  return { ok: issues.length === 0, issues };
}

/**
 * sitemap <lastmod> must come from src/data/contentDates.ts: a real
 * YYYY-MM-DD content date, never a build-time Date, and never in the future.
 */
export function checkSitemapLastmod(): GateCheckResult {
  const issues: string[] = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of sitemap()) {
    const lm = entry.lastModified;
    if (typeof lm !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(lm)) {
      issues.push(`sitemap lastmod: ${entry.url} — not a content date (${String(lm)})`);
    } else if (lm > today) {
      issues.push(`sitemap lastmod: ${entry.url} — future date ${lm}`);
    }
  }
  return { ok: issues.length === 0, issues };
}
