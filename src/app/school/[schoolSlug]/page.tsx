import { notFound } from "next/navigation";
import { schools, getSchoolBySlug } from "@/data/schools";
import { getSubjectBySlug } from "@/data/subjects";
import { getRegionBySlug, getRegionUrl, getRegionPath } from "@/data/regions";
import { getGradeBySlug } from "@/data/grades";
import { getDong } from "@/data/dongs";
import { getFaqsBySlugs } from "@/data/faqs";
import { getSchoolContent, isPublishedContent } from "@/data/schoolContent";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import { buildSchoolBreadcrumb, schoolLevelToGradeSlug } from "@/lib/schoolHierarchy";
import { indexedSchoolSubjectHref, indexedDongSubjectLinksForSchool, orphanRiskSchoolGradeSubjects } from "@/lib/internalLinks";
import { SCHOOLINFO_PLAN_TERM } from "@/data/sources";
import { JsonLd, faqSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedLinks from "@/components/RelatedLinks";
import PlanBasisNote from "@/components/PlanBasisNote";
import NationalSchoolPage, { nationalSchoolArea } from "@/components/NationalSchoolPage";
import { getNationalSchoolBySlug } from "@/data/nationalSchools";
import { schoolGradeHref, schoolGradeNumbers } from "@/lib/schoolGrade";

// Registered schools are prerendered. Page-capable national schools (src/data/nationalSchools.ts, ~10k, always
// noindex) are rendered on demand (dynamicParams defaults to true, same as the 행정동 pages) so the build does not
// grow with them; any other slug → 404.
export function generateStaticParams() {
  return schools.map((s) => ({ schoolSlug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/school/[schoolSlug]">) {
  const { schoolSlug } = await props.params;
  const school = getSchoolBySlug(schoolSlug);
  if (!school) {
    const national = getNationalSchoolBySlug(schoolSlug);
    if (!national) return {};
    const { index } = getIndexability("school-national", { schoolSlug: national.slug });
    const area = `${nationalSchoolArea(national)} ${national.dongName}`;
    return buildMetadata({
      title: `${national.name} 과외 | ${area} ${national.level}`,
      description: `${national.name}(${area} ${national.level}) 기본 정보와 1:1 과외 상담 안내. 학교급·소재 행정동은 NEIS 학교기본정보와 행정안전부 행정동 코드 기준이며, 교과설계소는 학교와 별개의 과외 서비스입니다.`,
      path: `/school/${national.slug}`,
      image: "school",
      robots: { index, follow: true },
    });
  }

  const rawContent = getSchoolContent(school.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const { index } = getIndexability("school", { schoolSlug: school.slug });

  return buildMetadata({
    title: content
      ? `${school.name} 과외 | ${content.schoolSpecificNotes[0].title}`
      : `${school.name} 과외 | 학교 진도에 맞춘 1:1 수업`,
    description:
      content?.intro ??
      `${school.name} 학생을 위한 1:1 과외를 상담해보세요. 학교 진도와 시험 일정에 맞춘 수업을 안내해드립니다.`,
    path: `/school/${school.slug}`,
    image: "school",
    robots: { index, follow: true },
  });
}

export default async function SchoolPage(props: PageProps<"/school/[schoolSlug]">) {
  const { schoolSlug } = await props.params;
  const school = getSchoolBySlug(schoolSlug);
  if (!school) {
    const national = getNationalSchoolBySlug(schoolSlug);
    if (!national) notFound();
    return <NationalSchoolPage school={national} />;
  }

  const rawContent = getSchoolContent(school.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const region = getRegionBySlug(school.districtRegionSlug ?? school.cityRegionSlug);
  const regionPath = getRegionPath(school.districtRegionSlug ?? school.cityRegionSlug);
  const matchingGrade = getGradeBySlug(schoolLevelToGradeSlug[school.level]);
  const dong = school.dongSlug ? getDong(school.cityRegionSlug, school.dongSlug) : undefined;
  const faqs = getFaqsBySlugs(["subject-scope", "pricing"]);
  // 이 학교의 평가계획 원문을 출처로 쓴 색인 동×과목 페이지(학교 소속 동) — 새 사실 없이 기존 공개 콘텐츠로만 연결한다.
  const planLinks = dong ? indexedDongSubjectLinksForSchool(school) : [];
  // 학년 hub가 noindex인데 같은 학년에 색인 과목이 하나뿐인 학년×과목 페이지 — 이 hub가 색인일 때만 직접 연결한다.
  const directGradeSubjectLinks = getIndexability("school", { schoolSlug: school.slug }).index
    ? orphanRiskSchoolGradeSubjects(school).map(({ label, href }) => ({ label, href }))
    : [];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb items={buildSchoolBreadcrumb(school)} />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {school.name} 과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {content?.intro ??
              `${school.name} 학생도 학교 진도와 시험 일정에 맞춘 1:1 상담이 가능합니다. 현재 학습 상황과 목표를 먼저 확인하고 필요한 과목부터 수업을 시작합니다.`}
          </p>
          {region && (
            <p className="text-sm text-text-muted">
              지역: {regionPath.map((r) => r.name).join(" > ")}
              {dong ? ` > ${dong.name}` : ""} · 학교급: {school.level}
            </p>
          )}
          {school.official && (
            <p className="text-sm text-text-muted">
              주소: {school.official.roadAddress} · {school.official.foundation}
              {school.official.highSchoolType ? ` · ${school.official.highSchoolType}` : ""} (NEIS 학교기본정보)
            </p>
          )}
        </div>
      </section>

      <section className="container-page py-14 md:py-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title="가능 과목"
          links={school.availableSubjectSlugs
            .map((slug) => getSubjectBySlug(slug))
            .filter((s): s is NonNullable<typeof s> => Boolean(s))
            .map((s) => {
              const href = indexedSchoolSubjectHref(school, s.slug);
              return href
                ? { label: `${school.name} ${s.name}과외`, href }
                : { label: `${s.name}과외`, href: `/subject/${s.slug}` };
            })}
        />
        <RelatedLinks
          title="관련 지역·학년"
          links={[
            ...(region ? [{ label: `${region.name} 과외`, href: getRegionUrl(region.slug) }] : []),
            ...(dong ? [{ label: `${dong.name} 과외`, href: `${getRegionUrl(dong.citySlug)}/${dong.slug}` }] : []),
            ...(matchingGrade ? [{ label: `${matchingGrade.name}과외`, href: `/grade/${matchingGrade.slug}` }] : []),
          ]}
        />
        {/* 학년 hubs exist only where published OFFICIAL 학년×과목 entries exist (src/lib/schoolGrade.ts). */}
        <RelatedLinks
          title="학년별 과목 평가 정보"
          links={[
            ...schoolGradeNumbers(school).map((g) => ({ label: `${school.name} ${g}학년 과외`, href: schoolGradeHref(school.slug, g) })),
            ...directGradeSubjectLinks,
          ]}
        />
      </section>

      {dong && planLinks.length > 0 && (
        <section className="container-page pb-14 md:pb-16">
          <SectionHeader align="left" title={`${school.name} 평가계획이 반영된 ${dong.name} 과목 페이지`} />
          <p className="mt-4 text-text-muted leading-relaxed max-w-2xl break-keep">
            아래 {planLinks.length}개 페이지는 {school.name}의 {SCHOOLINFO_PLAN_TERM.term} 평가계획 원문을 출처로 삼아 {dong.name} 학교들의
            시험·수행평가 반영 비율과 과제를 정리했습니다. 학년별 비율과 시기는 각 페이지에서 확인할 수 있습니다.
          </p>
          <PlanBasisNote className="mt-3 max-w-2xl" />
          <div className="mt-6 max-w-2xl">
            <RelatedLinks title={`${dong.name} 과목별 평가계획`} links={planLinks} />
          </div>
        </section>
      )}

      {content && (
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader align="left" title={`${school.name} 학생을 위한 안내`} />
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {content.schoolSpecificNotes.map((n) => (
                <div key={n.title} className="border-l-4 border-brand-light pl-5 py-0.5">
                  <p className="font-bold text-navy">{n.title}</p>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${school.name} 학생 맞춤 과외 상담받기`} context={{ region: school.cityRegionSlug, dong: school.dongSlug }} />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <SectionHeader align="left" title="자주 묻는 질문" />
        <div className="mt-8 max-w-2xl">
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </>
  );
}
