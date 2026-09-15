import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { grades, getGradeBySlug } from "@/data/grades";
import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import ChecklistPanel from "@/components/ui/ChecklistPanel";
import PrimaryButton from "@/components/ui/PrimaryButton";

export function generateStaticParams() {
  return grades.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/grade/[slug]">) {
  const { slug } = await props.params;
  const grade = getGradeBySlug(slug);
  if (!grade) return {};

  return buildMetadata({
    title: `${grade.label} 과외 | 학년별 1:1 맞춤 수업`,
    description: `${grade.description}. ${grade.label}에게 맞는 1:1 과외를 상담해보세요.`,
    path: `/grade/${grade.slug}`,
  });
}

export default async function GradePage(props: PageProps<"/grade/[slug]">) {
  const { slug } = await props.params;
  const grade = getGradeBySlug(slug);
  if (!grade) notFound();

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb items={[{ name: "학년별 과외", href: "/grades" }, { name: `${grade.name}과외`, href: `/grade/${grade.slug}` }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
              {grade.label} 1:1 맞춤 과외
            </h1>
            <p className="mt-4 text-text-main/80 leading-relaxed">{grade.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {grade.keywords.map((k) => (
                <span key={k} className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
                  {k}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <PrimaryButton href="/consult" size="lg">
                {grade.name}과외 상담받기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* STUDY POINTS */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`${grade.label}에게 중요한 학습 포인트`} />
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {grade.studyGoals.map((goal) => (
            <div
              key={goal.title}
              className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-white p-6"
            >
              <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy">{goal.title}</p>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{goal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORRIES */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title={`${grade.name}학생, 이런 고민이 많습니다`}
            description="상담을 시작하는 학생과 학부모님이 자주 이야기하는 고민입니다."
          />
          <div className="mt-8">
            <ChecklistPanel items={grade.worries} />
          </div>
        </div>
      </section>

      {/* SUB-GRADE DIRECTIONS */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`${grade.name} 학년별 학습 방향`} />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {grade.subGrades.map((sg) => (
            <div key={sg.slug} className="rounded-2xl bg-brand-light p-5">
              <p className="font-extrabold text-navy">{sg.label}</p>
              <p className="mt-1.5 text-sm text-text-main/80 leading-relaxed">{sg.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16">
        <RelatedLinks
          title={`${grade.name} 과목별 과외`}
          links={subjects.map((s) => ({ label: `${grade.name} ${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${grade.name}과외, 지금 상담부터 받아보세요`}
          description="학생의 현재 상황을 알려주시면 학습 방향을 안내해드립니다."
        />
      </section>
    </>
  );
}
