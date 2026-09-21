import { notFound } from "next/navigation";
import { regions, getRegionBySlug } from "@/data/regions";
import { programs, getProgramBySlug } from "@/data/programs";
import { getRegionProgramContent, isPublishedContent } from "@/data/regionProgramContent";
import { schools } from "@/data/schools";
import { getFaqsBySlugs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import { JsonLd, faqSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedLinks from "@/components/RelatedLinks";
import ChecklistPanel from "@/components/ui/ChecklistPanel";

function resolveContext(province: string, city: string, programSlug: string) {
  const parent = getRegionBySlug(province);
  const region = getRegionBySlug(city);
  if (!region || !parent || region.parentSlug !== province || region.level !== "city") return null;

  const program = getProgramBySlug(programSlug);
  if (!program) return null;

  return { parent, region, program };
}

export function generateStaticParams() {
  const params: { province: string; city: string; programSlug: string }[] = [];
  for (const city of regions.filter((r) => r.level === "city")) {
    for (const p of programs) {
      params.push({ province: city.parentSlug as string, city: city.slug, programSlug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata(props: PageProps<"/region/[province]/[city]/program/[programSlug]">) {
  const { province, city, programSlug } = await props.params;
  const ctx = resolveContext(province, city, programSlug);
  if (!ctx) return {};

  const content = getRegionProgramContent(ctx.region.slug, ctx.program.slug);
  const published = isPublishedContent(content);
  const { index } = getIndexability("region-program", {
    regionSlug: ctx.region.slug,
    programSlug: ctx.program.slug,
  });

  return buildMetadata({
    title: `${ctx.region.name} ${ctx.program.name}과외 | 1:1 맞춤 프로그램`,
    description:
      (published ? content?.intro : undefined) ??
      `${ctx.region.name}에서 ${ctx.program.name}과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 1:1 방문·화상 수업을 상담해보세요.`,
    path: `/region/${province}/${city}/program/${programSlug}`,
    robots: { index, follow: true },
  });
}

export default async function RegionProgramPage(props: PageProps<"/region/[province]/[city]/program/[programSlug]">) {
  const { province, city, programSlug } = await props.params;
  const ctx = resolveContext(province, city, programSlug);
  if (!ctx) notFound();

  const rawContent = getRegionProgramContent(ctx.region.slug, ctx.program.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const faqs = getFaqsBySlugs(ctx.program.faqSlugs);
  const relatedSchools = schools.filter((s) => s.cityRegionSlug === ctx.region.slug);

  const breadcrumbBase = [
    { name: "지역별 과외", href: "/regions" },
    { name: `${ctx.parent.name} 과외`, href: `/region/${ctx.parent.slug}` },
    { name: `${ctx.region.name} 과외`, href: `/region/${ctx.parent.slug}/${ctx.region.slug}` },
  ];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[...breadcrumbBase, { name: `${ctx.program.name}과외`, href: `/region/${province}/${city}/program/${programSlug}` }]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {ctx.region.name} {ctx.program.name}과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {content?.intro ??
              `${ctx.region.name}에서 ${ctx.program.name}과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 1:1 방문·화상 수업을 상담해보세요.`}
          </p>
        </div>
      </section>

      {/* 전국 공용 프로그램 콘텐츠 — programs.ts 재사용, 지역 콘텐츠 유무와 무관하게 항상 표시 */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`이런 경우 ${ctx.program.name}과외 상담을 받아보세요`} />
        <div className="mt-8">
          <ChecklistPanel items={ctx.program.painPoints} />
        </div>
      </section>

      {content && (
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader align="left" title={`${ctx.region.name} ${ctx.program.name}과외 안내`} />
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {content.regionSpecificNotes.map((n) => (
                <div key={n.title} className="border-l-4 border-brand-light pl-5 py-0.5">
                  <p className="font-bold text-navy">{n.title}</p>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-14 md:py-16">
        <ConsultCTA title={`${ctx.region.name} ${ctx.program.name}과외 상담받기`} />
      </section>

      <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${ctx.region.name} 다른 프로그램`}
          links={programs
            .filter((p) => p.slug !== ctx.program.slug)
            .map((p) => ({ label: `${ctx.region.name} ${p.name}과외`, href: `/region/${province}/${city}/program/${p.slug}` }))}
        />
        <RelatedLinks
          title="관련 페이지"
          links={[
            { label: `${ctx.region.name} 과외`, href: `/region/${province}/${city}` },
            { label: `${ctx.program.name}과외`, href: `/program/${ctx.program.slug}` },
            ...relatedSchools.map((s) => ({ label: `${s.name} 과외`, href: `/school/${s.slug}` })),
          ]}
        />
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
