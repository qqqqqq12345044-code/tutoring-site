import { notFound } from "next/navigation";
import { schools, getSchoolBySlug } from "@/data/schools";
import { getSubjectBySlug } from "@/data/subjects";
import { getRegionBySlug, getRegionUrl, getRegionPath } from "@/data/regions";
import { grades } from "@/data/grades";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

export function generateStaticParams() {
  return schools.map((s) => ({ schoolSlug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/school/[schoolSlug]">) {
  const { schoolSlug } = await props.params;
  const school = getSchoolBySlug(schoolSlug);
  if (!school) return {};

  const { index } = getIndexability("school");

  return buildMetadata({
    title: `${school.name} 과외 | 학교 진도에 맞춘 1:1 수업`,
    description: `${school.name} 학생을 위한 1:1 과외를 상담해보세요. 학교 진도와 시험 일정에 맞춘 수업을 안내해드립니다.`,
    path: `/school/${school.slug}`,
    robots: { index, follow: true },
  });
}

export default async function SchoolPage(props: PageProps<"/school/[schoolSlug]">) {
  const { schoolSlug } = await props.params;
  const school = getSchoolBySlug(schoolSlug);
  if (!school) notFound();

  const region = getRegionBySlug(school.regionSlug);
  const regionPath = getRegionPath(school.regionSlug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "학교별 과외", href: "/schools" },
              { name: `${school.name} 과외`, href: `/school/${school.slug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {school.name} 과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {school.name} 학생도 학교 진도와 시험 일정에 맞춘 1:1 상담이 가능합니다. 현재 학습
            상황과 목표를 먼저 확인하고 필요한 과목부터 수업을 시작합니다.
          </p>
          {region && (
            <p className="text-sm text-text-muted">
              지역: {regionPath.map((r) => r.name).join(" > ")} · 학교급: {school.level}
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
            .map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
        <RelatedLinks
          title="관련 지역·학년"
          links={[
            ...(region ? [{ label: `${region.name} 과외`, href: getRegionUrl(region.slug) }] : []),
            ...grades.map((g) => ({ label: `${g.name}과외`, href: `/grade/${g.slug}` })),
          ]}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${school.name} 학생 맞춤 과외 상담받기`} />
      </section>
    </>
  );
}
