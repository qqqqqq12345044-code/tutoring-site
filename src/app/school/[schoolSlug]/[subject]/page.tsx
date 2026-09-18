import { notFound } from "next/navigation";
import { schools, getSchoolBySlug } from "@/data/schools";
import { subjects, getSubjectBySlug } from "@/data/subjects";
import { getSchoolSubjectContent, isPublishedContent } from "@/data/schoolSubjectContent";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import ChecklistPanel from "@/components/ui/ChecklistPanel";

function resolveContext(schoolSlug: string, subjectSlug: string) {
  const school = getSchoolBySlug(schoolSlug);
  const subject = getSubjectBySlug(subjectSlug);
  if (!school || !subject || !school.availableSubjectSlugs.includes(subjectSlug)) return null;
  return { school, subject };
}

export function generateStaticParams() {
  return schools.flatMap((s) => s.availableSubjectSlugs.map((subjectSlug) => ({ schoolSlug: s.slug, subject: subjectSlug })));
}

export async function generateMetadata(props: PageProps<"/school/[schoolSlug]/[subject]">) {
  const { schoolSlug, subject: subjectSlug } = await props.params;
  const ctx = resolveContext(schoolSlug, subjectSlug);
  if (!ctx) return {};

  const rawContent = getSchoolSubjectContent(ctx.school.slug, ctx.subject.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;
  const { index } = getIndexability("school-subject", {
    schoolSlug: ctx.school.slug,
    subjectSlug: ctx.subject.slug,
  });

  return buildMetadata({
    title: content
      ? `${ctx.school.name} ${ctx.subject.name}과외 | ${content.schoolSpecificNotes[0].title}`
      : `${ctx.school.name} ${ctx.subject.name}과외 | 1:1 맞춤 수업`,
    description:
      content?.intro ??
      `${ctx.school.name} 학생을 위한 ${ctx.subject.name}과외를 상담해보세요. 학교 진도와 시험 일정에 맞춘 수업을 안내해드립니다.`,
    path: `/school/${schoolSlug}/${subjectSlug}`,
    robots: { index, follow: true },
  });
}

export default async function SchoolSubjectPage(props: PageProps<"/school/[schoolSlug]/[subject]">) {
  const { schoolSlug, subject: subjectSlug } = await props.params;
  const ctx = resolveContext(schoolSlug, subjectSlug);
  if (!ctx) notFound();

  const rawContent = getSchoolSubjectContent(ctx.school.slug, ctx.subject.slug);
  const content = isPublishedContent(rawContent) ? rawContent : undefined;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "학교별 과외", href: "/schools" },
              { name: `${ctx.school.name} 과외`, href: `/school/${ctx.school.slug}` },
              { name: `${ctx.school.name} ${ctx.subject.name}과외`, href: `/school/${schoolSlug}/${subjectSlug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {ctx.school.name} {ctx.subject.name}과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {content?.intro ??
              `${ctx.school.name} 학생도 ${ctx.subject.name} 학교 진도와 시험 일정에 맞춘 1:1 상담이 가능합니다. 현재 학습 상황과 목표를 먼저 확인하고 필요한 부분부터 수업을 시작합니다.`}
          </p>
        </div>
      </section>

      {/* 전국 공용 과목 콘텐츠 — subjects.ts 재사용, 학교 콘텐츠 유무와 무관하게 항상 표시 */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`이런 경우 ${ctx.subject.name}과외 상담을 받아보세요`} />
        <div className="mt-8">
          <ChecklistPanel items={ctx.subject.painPoints} />
        </div>
      </section>

      {content && (
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader align="left" title={`${ctx.school.name} ${ctx.subject.name}과외 안내`} />
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

      <section className="container-page py-14 md:py-16">
        <ConsultCTA title={`${ctx.school.name} ${ctx.subject.name}과외 상담받기`} />
      </section>

      <section className="container-page pb-16 md:pb-20 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${ctx.school.name} 다른 과목`}
          links={ctx.school.availableSubjectSlugs
            .filter((slug) => slug !== ctx.subject.slug)
            .map((slug) => subjects.find((s) => s.slug === slug))
            .filter((s): s is NonNullable<typeof s> => Boolean(s))
            .map((s) => ({ label: `${ctx.school.name} ${s.name}과외`, href: `/school/${ctx.school.slug}/${s.slug}` }))}
        />
        <RelatedLinks
          title="관련 페이지"
          links={[
            { label: `${ctx.school.name} 과외`, href: `/school/${ctx.school.slug}` },
            { label: `${ctx.subject.name}과외`, href: `/subject/${ctx.subject.slug}` },
          ]}
        />
      </section>
    </>
  );
}
