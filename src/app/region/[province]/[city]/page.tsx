import { notFound } from "next/navigation";
import { regions, getRegionBySlug, getChildren } from "@/data/regions";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { schools } from "@/data/schools";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

export function generateStaticParams() {
  return regions
    .filter((r) => r.level === "city")
    .map((c) => ({ province: c.parentSlug as string, city: c.slug }));
}

export async function generateMetadata(props: PageProps<"/region/[province]/[city]">) {
  const { province, city } = await props.params;
  const region = getRegionBySlug(city);
  if (!region || region.parentSlug !== province) return {};

  const { index } = getIndexability("region");

  return buildMetadata({
    title: `${region.name} 과외 | 초·중·고 1:1 맞춤 수업`,
    description: `${region.fullName} 초등·중등·고등 1:1 과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 방문·화상 수업을 상담해보세요.`,
    path: `/region/${province}/${region.slug}`,
    robots: { index, follow: true },
  });
}

export default async function CityPage(props: PageProps<"/region/[province]/[city]">) {
  const { province, city } = await props.params;
  const parent = getRegionBySlug(province);
  const region = getRegionBySlug(city);
  if (!region || !parent || region.parentSlug !== province) notFound();

  const districts = getChildren(region.slug);
  const relatedSchools = schools.filter((s) => s.cityRegionSlug === region.slug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "지역별 과외", href: "/regions" },
              { name: `${parent.name} 과외`, href: `/region/${parent.slug}` },
              { name: `${region.name} 과외`, href: `/region/${parent.slug}/${region.slug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {region.name} 과외 <span className="text-text-muted font-medium text-lg md:text-2xl">| 초·중·고 1:1 맞춤 수업</span>
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {region.name}에서 과외를 찾는다면 먼저 학생의 현재 개념 이해도와 학교 진도, 목표를
            확인하는 것이 중요합니다. 과목별로 필요한 부분부터 1:1로 학습합니다.
          </p>
        </div>
      </section>

      <section className="container-page py-14 md:py-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${region.name} 학년별 과외`}
          links={grades.map((g) => ({ label: `${region.name} ${g.name}과외`, href: `/grade/${g.slug}` }))}
        />
        <RelatedLinks
          title={`${region.name} 과목별 과외`}
          links={subjects.map((s) => ({ label: `${region.name} ${s.name}과외`, href: `/region/${parent.slug}/${region.slug}/${s.slug}` }))}
        />
      </section>

      {(districts.length > 0 || relatedSchools.length > 0) && (
        <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
          {districts.length > 0 && (
            <RelatedLinks
              title={`${region.name} 하위 지역`}
              links={districts.map((d) => ({ label: d.name, href: `/region/${parent.slug}/${region.slug}/${d.slug}` }))}
            />
          )}
          {relatedSchools.length > 0 && (
            <RelatedLinks
              title={`${region.name} 관련 학교`}
              links={relatedSchools.map((s) => ({ label: `${s.name} 과외`, href: `/school/${s.slug}` }))}
            />
          )}
        </section>
      )}

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${region.name} 과외, 지금 상담부터 받아보세요`} description="지역과 학년, 과목을 알려주시면 안내해드립니다." />
      </section>
    </>
  );
}
