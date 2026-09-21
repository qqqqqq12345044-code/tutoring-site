import { notFound } from "next/navigation";
import { programs, getProgramBySlug } from "@/data/programs";
import { regions, getRegionUrl } from "@/data/regions";
import { regionProgramContents, isPublishedContent } from "@/data/regionProgramContent";
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
import StepFlow from "@/components/ui/StepFlow";
import PrimaryButton from "@/components/ui/PrimaryButton";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/program/[slug]">) {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) return {};

  const { index } = getIndexability("program");

  return buildMetadata({
    title: `${program.name}과외 | 1:1 맞춤 프로그램`,
    description: `${program.shortDescription}. 학생의 현재 수준과 목표에 맞는 1:1 ${program.name}과외를 상담해보세요.`,
    path: `/program/${program.slug}`,
    robots: { index, follow: true },
  });
}

export default async function ProgramPage(props: PageProps<"/program/[slug]">) {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const faqs = getFaqsBySlugs(program.faqSlugs);
  const regionLinks = regionProgramContents
    .filter((c) => c.programSlug === program.slug && isPublishedContent(c))
    .map((c) => {
      const region = regions.find((r) => r.slug === c.regionSlug);
      if (!region) return null;
      return { label: `${region.name} ${program.name}과외`, href: `${getRegionUrl(region.slug)}/program/${program.slug}` };
    })
    .filter((l): l is { label: string; href: string } => Boolean(l));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb items={[{ name: `${program.name}과외`, href: `/program/${program.slug}` }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight whitespace-pre-line">
              {program.heroTitle}
            </h1>
            <p className="mt-4 text-text-main/80 leading-relaxed">{program.heroDescription}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <PrimaryButton href="/consult" size="lg">
                {program.name}과외 상담받기
              </PrimaryButton>
              <PrimaryButton href="/regions" variant="outline" size="lg">
                우리 동네 과외 찾기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title="이런 분들이 상담합니다" description={program.targetAudience} />
      </section>

      {/* PAIN POINTS */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title={`${program.name}과외, 이런 경우에 필요합니다`}
            description="많은 학생과 학부모가 아래와 같은 상황에서 상담을 시작합니다."
          />
          <div className="mt-8">
            <ChecklistPanel items={program.painPoints} />
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`${program.name}과외, 이렇게 학습합니다`} />
        <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {program.topics.map((topic, i) => (
            <div key={topic.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="text-3xl font-extrabold text-brand-light shrink-0 leading-none tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-bold text-navy text-base md:text-lg">{topic.title}</p>
                <p className="mt-1.5 text-sm md:text-[15px] text-text-muted leading-relaxed">{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader align="left" title="수업은 이렇게 진행합니다" />
          <div className="mt-10">
            <StepFlow steps={program.process} />
          </div>
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16">
        <ConsultCTA
          title={`${program.name}과외, 지금 상담부터 받아보세요`}
          description="현재 상황과 목표를 알려주시면 학습 방향을 안내해드립니다."
        />
      </section>

      <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title="다른 프로그램"
          links={programs
            .filter((p) => p.slug !== program.slug)
            .map((p) => ({ label: `${p.name}과외`, href: `/program/${p.slug}` }))}
        />
        {regionLinks.length > 0 && <RelatedLinks title="지역별 프로그램" links={regionLinks} />}
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
