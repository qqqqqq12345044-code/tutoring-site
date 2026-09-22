import { notFound } from "next/navigation";
import { grades, getGradeBySlug } from "@/data/grades";
import { subjects } from "@/data/subjects";
import { getSubGradeContent, isPublishedContent } from "@/data/subGradeContent";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

function resolveContext(gradeSlug: string, subGradeSlug: string) {
  const grade = getGradeBySlug(gradeSlug);
  const subGrade = grade?.subGrades.find((sg) => sg.slug === subGradeSlug);
  if (!grade || !subGrade) return null;
  return { grade, subGrade };
}

export function generateStaticParams() {
  return grades.flatMap((g) => g.subGrades.map((sg) => ({ slug: g.slug, subGradeSlug: sg.slug })));
}

export async function generateMetadata(props: PageProps<"/grade/[slug]/[subGradeSlug]">) {
  const { slug, subGradeSlug } = await props.params;
  const ctx = resolveContext(slug, subGradeSlug);
  if (!ctx) return {};

  const rawContent = getSubGradeContent(ctx.grade.slug, ctx.subGrade.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const { index } = getIndexability("sub-grade", { gradeSlug: ctx.grade.slug, subGradeSlug: ctx.subGrade.slug });

  return buildMetadata({
    title: content
      ? `${ctx.subGrade.label} 과외 | ${content.notes[0].title}`
      : `${ctx.subGrade.label} 과외 | 1:1 맞춤 수업`,
    description: content?.intro ?? `${ctx.subGrade.label} 학생을 위한 1:1 과외를 상담해보세요. ${ctx.subGrade.note}`,
    path: `/grade/${ctx.grade.slug}/${ctx.subGrade.slug}`,
    robots: { index, follow: true },
  });
}

export default async function SubGradePage(props: PageProps<"/grade/[slug]/[subGradeSlug]">) {
  const { slug, subGradeSlug } = await props.params;
  const ctx = resolveContext(slug, subGradeSlug);
  if (!ctx) notFound();

  const rawContent = getSubGradeContent(ctx.grade.slug, ctx.subGrade.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "학년별 과외", href: "/grades" },
              { name: `${ctx.grade.name}과외`, href: `/grade/${ctx.grade.slug}` },
              { name: `${ctx.subGrade.label} 과외`, href: `/grade/${ctx.grade.slug}/${ctx.subGrade.slug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {ctx.subGrade.label} 1:1 맞춤 과외
          </h1>
          <p className="text-text-main/80 leading-relaxed max-w-2xl">{content?.intro ?? ctx.subGrade.note}</p>
        </div>
      </section>

      {content && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`${ctx.subGrade.label} 학습 포인트`} />
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
          title={`${ctx.subGrade.label} 과목별 과외`}
          links={subjects.map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
        <RelatedLinks
          title={`${ctx.grade.name} 다른 학년`}
          links={ctx.grade.subGrades
            .filter((sg) => sg.slug !== ctx.subGrade.slug)
            .map((sg) => ({ label: `${sg.label} 과외`, href: `/grade/${ctx.grade.slug}/${sg.slug}` }))}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${ctx.subGrade.label}, 지금 상담부터 받아보세요`}
          description="현재 학습 상황을 알려주시면 학년에 맞는 학습 방향을 안내해드립니다."
        />
      </section>
    </>
  );
}
