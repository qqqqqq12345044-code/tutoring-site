import { notFound } from "next/navigation";
import Link from "next/link";
import { regions, getRegionBySlug, getChildren } from "@/data/regions";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { schools, type School } from "@/data/schools";
import { caseStudies } from "@/data/caseStudies";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import { buildRegionSchoolIntro } from "@/lib/regionIntro";
import { buildRegionFaqs } from "@/lib/regionFaq";
import { JsonLd, faqSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import CaseStudyCard from "@/components/CaseStudyCard";
import FAQAccordion from "@/components/FAQAccordion";

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

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
  const schoolsByLevel = LEVEL_ORDER.map((level) => ({
    level,
    list: relatedSchools.filter((s) => s.level === level),
  })).filter((g) => g.list.length > 0);
  const relevantCaseStudies = caseStudies.slice(0, 3);
  const regionFaqs = buildRegionFaqs(region.slug, region.name, relatedSchools);

  return (
    <>
      {regionFaqs.length > 0 && <JsonLd data={faqSchema(regionFaqs)} />}

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
          <p className="text-text-main/80 leading-relaxed max-w-2xl">
            {buildRegionSchoolIntro(region.slug, region.name, relatedSchools)}
          </p>
        </div>
      </section>

      {schoolsByLevel.length > 0 && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`${region.name} 학교별 과외 정보`} />
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {schoolsByLevel.map((g) => (
              <div key={g.level} className="rounded-2xl border border-border-subtle bg-white p-6">
                <p className="font-bold text-navy">
                  {g.level} <span className="text-text-muted font-medium text-sm">{g.list.length}곳</span>
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {g.list.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/school/${s.slug}`}
                        className="text-sm text-text-main hover:text-brand transition-colors"
                      >
                        {s.name} 과외
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {districts.length > 0 && (
        <section className="container-page pb-14 md:pb-16">
          <RelatedLinks
            title={`${region.name} 하위 지역`}
            links={districts.map((d) => ({ label: d.name, href: `/region/${parent.slug}/${region.slug}/${d.slug}` }))}
          />
        </section>
      )}

      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title="이런 학생에게 도움이 되는 수업 방식"
            description="특정 학생을 대상으로 한 후기가 아닌, 이해를 돕기 위한 수업 설계 예시입니다."
          />
          <div className="mt-8 grid sm:grid-cols-3 gap-5">
            {relevantCaseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        </div>
      </section>

      {regionFaqs.length > 0 && (
        <section className="container-page pb-14 md:pb-16">
          <SectionHeader align="left" title={`${region.name} 과외 자주 묻는 질문`} />
          <div className="mt-8 max-w-2xl">
            <FAQAccordion items={regionFaqs} />
          </div>
        </section>
      )}

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${region.name} 과외, 지금 상담부터 받아보세요`} description="지역과 학년, 과목을 알려주시면 안내해드립니다." />
      </section>
    </>
  );
}
