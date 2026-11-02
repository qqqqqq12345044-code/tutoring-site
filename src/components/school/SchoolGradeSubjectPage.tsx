import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import SourceList from "@/components/SourceList";
import PlanBasisNote from "@/components/PlanBasisNote";
import AssessmentList from "@/components/school/AssessmentList";
import EvidenceSection from "@/components/school/EvidenceSection";
import { buildSchoolBreadcrumb } from "@/lib/schoolHierarchy";
import { resolveSchoolGrade, schoolGradeHref, schoolGradeSubjectHref, type SchoolGradeSubjectContext } from "@/lib/schoolGrade";
import { getDong } from "@/data/dongs";
import { hasDongSubjectRoute } from "@/data/dongSubjectContent";
import { getRegionUrl } from "@/data/regions";
import { isSchoolInfoPlanSource } from "@/data/sources";

/** /school/[schoolSlug]/[grade]/[subject] — the conversion page: one school, one 학년, one 과목. */
export default function SchoolGradeSubjectPage({ ctx }: { ctx: SchoolGradeSubjectContext }) {
  const { school, grade, subject, content } = ctx;
  const gradeHref = schoolGradeHref(school.slug, grade);
  const href = schoolGradeSubjectHref(school.slug, grade, subject.slug);
  const dong = school.dongSlug ? getDong(school.cityRegionSlug, school.dongSlug) : undefined;
  const siblings = (resolveSchoolGrade(school.slug, String(grade))?.entries ?? []).filter((e) => e.subject.slug !== subject.slug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              ...buildSchoolBreadcrumb(school),
              { name: `${grade}학년`, href: gradeHref },
              { name: `${grade}학년 ${subject.name}과외`, href },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight break-keep">
            {school.name} {grade}학년 {subject.name}과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl break-keep">{content.intro}</p>
          {content.sources.some(isSchoolInfoPlanSource) && <PlanBasisNote className="max-w-2xl" />}
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`${grade}학년 ${subject.name} 시험·수행평가 반영 비율`} />
        <p className="mt-4 text-sm text-text-muted max-w-2xl break-keep">
          {content.courses.join(" · ")} — 학교 평가계획의 반영 비율 표를 그대로 옮겼습니다.
        </p>
        <div className="mt-8">
          <AssessmentList content={content} />
        </div>
      </section>

      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader align="left" title="시험 준비에서 먼저 볼 점" />
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {content.notes.map((n) => (
              <div key={n.title} className="border-l-4 border-brand-light pl-5 py-0.5">
                <p className="font-bold text-navy break-keep">{n.title}</p>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-14 md:pt-16">
        <EvidenceSection
          schoolCode={school.official?.code}
          grade={grade}
          subjectSlug={subject.slug}
          title={`${grade}학년 ${subject.name} 수업·분석 자료`}
        />
      </div>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${school.name} ${grade}학년 ${subject.name}과외 상담받기`}
          context={{ subject: subject.slug, region: school.cityRegionSlug, dong: school.dongSlug }}
        />
      </section>

      <section className="container-page pb-16 md:pb-20 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${school.name} ${grade}학년 다른 과목`}
          links={siblings.map((e) => ({
            label: `${grade}학년 ${e.subject.name}과외`,
            href: schoolGradeSubjectHref(school.slug, grade, e.subject.slug),
          }))}
        />
        <RelatedLinks
          title="관련 페이지"
          links={[
            { label: `${school.name} ${grade}학년 과외`, href: gradeHref },
            { label: `${school.name} 과외`, href: `/school/${school.slug}` },
            ...(dong
              ? hasDongSubjectRoute(dong.citySlug, dong.slug, subject.slug)
                ? [{ label: `${dong.name} ${subject.name}과외`, href: `${getRegionUrl(dong.citySlug)}/${dong.slug}/${subject.slug}` }]
                : [{ label: `${dong.name} 과외`, href: `${getRegionUrl(dong.citySlug)}/${dong.slug}` }]
              : []),
          ]}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <SourceList sources={content.sources} />
      </section>
    </>
  );
}
