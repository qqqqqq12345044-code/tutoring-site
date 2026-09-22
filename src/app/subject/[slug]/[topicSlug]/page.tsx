import { notFound } from "next/navigation";
import { subjects, getSubjectBySlug } from "@/data/subjects";
import { grades } from "@/data/grades";
import { getSubjectTopicContent, isPublishedContent } from "@/data/subjectTopicContent";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

function resolveContext(subjectSlug: string, topicSlug: string) {
  const subject = getSubjectBySlug(subjectSlug);
  const topic = subject?.topics.find((t) => t.slug === topicSlug);
  if (!subject || !topic) return null;
  return { subject, topic };
}

export function generateStaticParams() {
  return subjects.flatMap((s) => s.topics.map((t) => ({ slug: s.slug, topicSlug: t.slug })));
}

export async function generateMetadata(props: PageProps<"/subject/[slug]/[topicSlug]">) {
  const { slug, topicSlug } = await props.params;
  const ctx = resolveContext(slug, topicSlug);
  if (!ctx) return {};

  const rawContent = getSubjectTopicContent(ctx.subject.slug, ctx.topic.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const { index } = getIndexability("subject-topic", { subjectSlug: ctx.subject.slug, topicSlug: ctx.topic.slug });

  return buildMetadata({
    title: `${ctx.subject.name} ${ctx.topic.title} | 1:1 맞춤 과외`,
    description: content?.intro ?? `${ctx.subject.name} ${ctx.topic.title} 학습을 위한 1:1 과외를 상담해보세요. ${ctx.topic.description}`,
    path: `/subject/${ctx.subject.slug}/${ctx.topic.slug}`,
    robots: { index, follow: true },
  });
}

export default async function SubjectTopicPage(props: PageProps<"/subject/[slug]/[topicSlug]">) {
  const { slug, topicSlug } = await props.params;
  const ctx = resolveContext(slug, topicSlug);
  if (!ctx) notFound();

  const rawContent = getSubjectTopicContent(ctx.subject.slug, ctx.topic.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "과목별 과외", href: "/subjects" },
              { name: `${ctx.subject.name}과외`, href: `/subject/${ctx.subject.slug}` },
              { name: `${ctx.subject.name} ${ctx.topic.title}`, href: `/subject/${ctx.subject.slug}/${ctx.topic.slug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {ctx.subject.name} {ctx.topic.title} 1:1 맞춤 과외
          </h1>
          <p className="text-text-main/80 leading-relaxed max-w-2xl">{content?.intro ?? ctx.topic.description}</p>
        </div>
      </section>

      {content && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`${ctx.subject.name} ${ctx.topic.title} 학습 포인트`} />
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {content.notes.map((n) => (
              <div key={n.title} className="border-l-4 border-brand-light pl-5 py-0.5">
                <p className="font-bold text-navy">{n.title}</p>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-page pb-14 md:pb-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${ctx.subject.name} 다른 학습 영역`}
          links={ctx.subject.topics
            .filter((t) => t.slug !== ctx.topic.slug)
            .map((t) => ({ label: `${ctx.subject.name} ${t.title}`, href: `/subject/${ctx.subject.slug}/${t.slug}` }))}
        />
        <RelatedLinks
          title="학년별 과외"
          links={grades.map((g) => ({ label: `${g.name}과외`, href: `/grade/${g.slug}` }))}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${ctx.subject.name} ${ctx.topic.title}, 지금 상담부터 받아보세요`}
          description="현재 학습 상황을 알려주시면 학습 방향을 안내해드립니다."
        />
      </section>
    </>
  );
}
