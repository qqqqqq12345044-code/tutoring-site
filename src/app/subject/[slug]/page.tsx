import { notFound } from "next/navigation";
import { subjects, getSubjectBySlug } from "@/data/subjects";
import { grades } from "@/data/grades";
import { getFaqsBySlugs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, faqSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedLinks from "@/components/RelatedLinks";
import ChecklistPanel from "@/components/ui/ChecklistPanel";
import PrimaryButton from "@/components/ui/PrimaryButton";

export function generateStaticParams() {
  return subjects.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/subject/[slug]">) {
  const { slug } = await props.params;
  const subject = getSubjectBySlug(slug);
  if (!subject) return {};

  return buildMetadata({
    title: `${subject.name}과외 | 초·중·고 1:1 맞춤 수업`,
    description: `${subject.shortDescription}. 학생의 현재 수준과 목표에 맞는 1:1 ${subject.name}과외를 상담해보세요.`,
    path: `/subject/${subject.slug}`,
  });
}

export default async function SubjectPage(props: PageProps<"/subject/[slug]">) {
  const { slug } = await props.params;
  const subject = getSubjectBySlug(slug);
  if (!subject) notFound();

  const faqs = getFaqsBySlugs(subject.faqSlugs);

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb items={[{ name: "과목별 과외", href: "/subjects" }, { name: subject.name, href: `/subject/${subject.slug}` }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight whitespace-pre-line">
              {subject.heroTitle}
            </h1>
            <p className="mt-4 text-text-main/80 leading-relaxed">{subject.heroDescription}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <PrimaryButton href="/consult" size="lg">
                {subject.name}과외 상담받기
              </PrimaryButton>
              <PrimaryButton href="/regions" variant="outline" size="lg">
                우리 동네 과외 찾기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader
          align="left"
          title={`${subject.name}과외, 이런 학생에게 필요합니다`}
          description="많은 학생과 학부모가 아래와 같은 상황에서 상담을 시작합니다."
        />
        <div className="mt-8">
          <ChecklistPanel items={subject.painPoints} />
        </div>
      </section>

      {/* HOW THEY STUDY — editorial list, not uniform cards */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`${subject.name}과외, 이렇게 학습합니다`} />
          <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {subject.topics.map((topic, i) => (
              <div key={topic.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="text-3xl font-extrabold text-brand-light shrink-0 leading-none tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-bold text-navy text-base md:text-lg">{topic.title}</p>
                  <p className="mt-1.5 text-sm md:text-[15px] text-text-muted leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE STRATEGY */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title="학년별 학습 방향" />
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          {subject.gradeStrategies.map((gs) => (
            <div key={gs.grade} className="border-l-4 border-brand-light pl-5 py-0.5">
              <span className="text-sm font-bold text-brand">{gs.grade}</span>
              <p className="mt-2 text-sm text-text-main leading-relaxed">{gs.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16">
        <ConsultCTA
          title={`${subject.name}과외, 지금 상담부터 받아보세요`}
          description="학년과 목표를 알려주시면 학습 방향을 안내해드립니다."
        />
      </section>

      <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title="학년별 과외"
          links={grades.map((g) => ({ label: `${g.name}과외`, href: `/grade/${g.slug}` }))}
        />
        <RelatedLinks
          title="다른 과목 과외"
          links={subjects
            .filter((s) => s.slug !== subject.slug)
            .map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` }))}
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
