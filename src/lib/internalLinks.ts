import { regions, getRegionUrl, getRegionBySlug, getRegionPath } from "@/data/regions";
import { grades } from "@/data/grades";
import { subjects } from "@/data/subjects";
import type { School } from "@/data/schools";
import { dongs, getDong } from "@/data/dongs";
import { dongSubjectContents } from "@/data/dongSubjectContent";
import { isSchoolInfoPlanSource } from "@/data/sources";
import { getIndexability } from "@/lib/indexability";
import type { RelatedLink } from "@/components/RelatedLinks";

/**
 * Index-aware internal links. Every helper here only returns URLs that
 * getIndexability() marks indexed, so a page that is later demoted to noindex
 * drops out of these link lists automatically — indexed pages don't keep
 * pointing crawlers at pages we've asked them not to index.
 */

/** Indexed school×subject URL for this school, or undefined. */
export function indexedSchoolSubjectHref(school: School, subjectSlug: string): string | undefined {
  return getIndexability("school-subject", { schoolSlug: school.slug, subjectSlug }).index
    ? `/school/${school.slug}/${subjectSlug}`
    : undefined;
}

/**
 * Indexed 행정동×과목 pages whose facts were read from this school's own 학교알리미 평가계획 — matched by the
 * schoolInfoPlanSource entry naming the school (not by text search), in subject order.
 */
export function indexedDongSubjectLinksForSchool(school: School): RelatedLink[] {
  const tag = `학교알리미 — ${school.name} 교과별`;
  return subjects.flatMap((subject) => {
    const entry = dongSubjectContents.find(
      (c) =>
        c.subjectSlug === subject.slug &&
        c.status === "published" &&
        c.notes.length > 0 &&
        c.sources.some((s) => isSchoolInfoPlanSource(s) && s.label.startsWith(tag))
    );
    if (!entry) return [];
    const dong = getDong(entry.citySlug, entry.dongSlug);
    if (!dong) return [];
    if (!getIndexability("region-dong-subject", { regionSlug: dong.citySlug, dongSlug: dong.slug, subjectSlug: subject.slug }).index) return [];
    return [{ label: `${dong.name} ${subject.name}과외`, href: `${getRegionUrl(dong.citySlug)}/${dong.slug}/${subject.slug}` }];
  });
}

/**
 * Indexed 행정동 hubs under one province (시·도), labelled "시·구 동", plus how many indexed 행정동×과목 pages and
 * 시·군·구 they cover — the counts the province hub shows come straight from these lists.
 */
export function indexedDongSummaryForProvince(provinceSlug: string): { links: RelatedLink[]; cityCount: number; subjectPageCount: number } {
  const inProvince = dongs.filter(
    (d) =>
      getRegionPath(d.citySlug)[0]?.slug === provinceSlug &&
      getIndexability("region-dong", { regionSlug: d.citySlug, dongSlug: d.slug }).index
  );
  const subjectPageCount = inProvince.reduce(
    (n, d) =>
      n +
      subjects.filter((s) => getIndexability("region-dong-subject", { regionSlug: d.citySlug, dongSlug: d.slug, subjectSlug: s.slug }).index)
        .length,
    0
  );
  return {
    links: inProvince.map((d) => ({
      label: `${getRegionBySlug(d.citySlug)?.name ?? ""} ${d.name}`.trim(),
      href: `${getRegionUrl(d.citySlug)}/${d.slug}`,
    })),
    cityCount: new Set(inProvince.map((d) => d.citySlug)).size,
    subjectPageCount,
  };
}

/** Indexed region×grade×subject pages under one city (optionally one subject / grade only). */
export function indexedRegionGradeSubjectLinks(
  citySlug: string,
  filter: { subjectSlug?: string; gradeSlug?: string } = {}
): RelatedLink[] {
  const city = regions.find((r) => r.slug === citySlug);
  if (!city) return [];
  const links: RelatedLink[] = [];
  for (const g of grades) {
    if (filter.gradeSlug && g.slug !== filter.gradeSlug) continue;
    for (const s of subjects) {
      if (filter.subjectSlug && s.slug !== filter.subjectSlug) continue;
      if (getIndexability("region-grade-subject", { regionSlug: citySlug, gradeSlug: g.slug, subjectSlug: s.slug }).index) {
        links.push({ label: `${city.name} ${g.name} ${s.name}과외`, href: `${getRegionUrl(citySlug)}/${g.slug}/${s.slug}` });
      }
    }
  }
  return links;
}

/** Indexed region-level pages (region×subject, region×grade×subject) for one subject, across all cities. */
export function indexedRegionLinksForSubject(subjectSlug: string): RelatedLink[] {
  const subject = subjects.find((s) => s.slug === subjectSlug);
  if (!subject) return [];
  const links: RelatedLink[] = [];
  for (const city of regions.filter((r) => r.level === "city")) {
    if (getIndexability("region-subject", { regionSlug: city.slug, subjectSlug }).index) {
      links.push({ label: `${city.name} ${subject.name}과외`, href: `${getRegionUrl(city.slug)}/${subjectSlug}` });
    }
    links.push(...indexedRegionGradeSubjectLinks(city.slug, { subjectSlug }));
  }
  return links;
}

/** Indexed subject-topic explainers (/subject/[slug]/[topicSlug]) for one subject. */
export function indexedSubjectTopicLinks(subjectSlug: string): RelatedLink[] {
  const subject = subjects.find((s) => s.slug === subjectSlug);
  if (!subject) return [];
  return subject.topics
    .filter((t) => getIndexability("subject-topic", { subjectSlug, topicSlug: t.slug }).index)
    .map((t) => ({ label: `${subject.name} ${t.title} 학습법`, href: `/subject/${subjectSlug}/${t.slug}` }));
}

/** Indexed sub-grade pages (/grade/[slug]/[subGradeSlug]) for one school level. */
export function indexedSubGradeLinks(gradeSlug: string): RelatedLink[] {
  const grade = grades.find((g) => g.slug === gradeSlug);
  if (!grade) return [];
  return grade.subGrades
    .filter((sg) => getIndexability("sub-grade", { gradeSlug, subGradeSlug: sg.slug }).index)
    .map((sg) => ({ label: `${sg.label} 공부 포인트`, href: `/grade/${gradeSlug}/${sg.slug}` }));
}
