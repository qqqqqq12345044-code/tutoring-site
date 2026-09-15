import { notFound } from "next/navigation";
import { getProvinces, getRegionBySlug, getChildren } from "@/data/regions";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { homeFaqSlugs, getFaqsBySlugs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, faqSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedLinks from "@/components/RelatedLinks";

export function generateStaticParams() {
  return getProvinces().map((p) => ({ province: p.slug }));
}

export async function generateMetadata(props: PageProps<"/region/[province]">) {
  const { province } = await props.params;
  const region = getRegionBySlug(province);
  if (!region || region.level !== "province") return {};

  return buildMetadata({
    title: `${region.name} 과외 | 초·중·고 1:1 맞춤 수업`,
    description: `${region.name} 지역 초등·중등·고등 1:1 과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 방문·화상 수업을 상담해보세요.`,
    path: `/region/${region.slug}`,
  });
}

export default async function ProvincePage(props: PageProps<"/region/[province]">) {
  const { province } = await props.params;
  const region = getRegionBySlug(province);
  if (!region || region.level !== "province") notFound();

  const children = getChildren(region.slug);
  const faqs = getFaqsBySlugs(homeFaqSlugs.slice(0, 4));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb items={[{ name: "지역별 과외", href: "/regions" }, { name: `${region.name} 과외`, href: `/region/${region.slug}` }]} />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {region.name} 과외 <span className="text-text-muted font-medium text-lg md:text-2xl">| 초·중·고 1:1 맞춤 수업</span>
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {region.name} 지역에서 과외를 찾고 있다면 학생의 학년과 과목, 목표를 먼저 확인하는 것이
            중요합니다. 방문과 화상 수업 모두 상담을 통해 가능 여부를 확인해드립니다.
          </p>
        </div>
      </section>

      {children.length > 0 && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`${region.name} 주요 지역`} />
          <div className="mt-6">
            <RelatedLinks
              title=""
              links={children.map((c) => ({ label: c.name, href: `/region/${region.slug}/${c.slug}` }))}
            />
          </div>
        </section>
      )}

      <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${region.name} 학년별 과외`}
          links={grades.map((g) => ({ label: `${region.name} ${g.name}과외`, href: `/grade/${g.slug}` }))}
        />
        <RelatedLinks
          title={`${region.name} 과목별 과외`}
          links={subjects.map((s) => ({ label: `${region.name} ${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
      </section>

      <section className="container-page pb-14 md:pb-16">
        <ConsultCTA title={`${region.name} 과외, 지금 상담부터 받아보세요`} description="지역과 학년, 과목을 알려주시면 안내해드립니다." />
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
