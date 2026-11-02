import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import SourceList from "@/components/SourceList";
import PlanBasisNote from "@/components/PlanBasisNote";
import EvidenceSection from "@/components/school/EvidenceSection";
import { buildSchoolBreadcrumb } from "@/lib/schoolHierarchy";
import { buildSchoolGradeContent, schoolGradeHref, schoolGradeNumbers, type SchoolGradeContext } from "@/lib/schoolGrade";
import { getDong } from "@/data/dongs";
import { getRegionUrl } from "@/data/regions";
import type { ContentSource } from "@/data/sources";

/** /school/[schoolSlug]/[grade] — one school's 학년 hub, built only from that 학년's published subject entries. */
export default function SchoolGradePage({ ctx }: { ctx: SchoolGradeContext }) {
  const { school, grade, entries } = ctx;
  const { intro, cards } = buildSchoolGradeContent(ctx);
  const dong = school.dongSlug ? getDong(school.cityRegionSlug, school.dongSlug) : undefined;
  const otherGrades = schoolGradeNumbers(school).filter((g) => g !== grade);
  const sources: ContentSource[] = [];
  for (const e of entries) for (const s of e.content.sources) if (!sources.some((x) => x.url === s.url)) sources.push(s);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb items={[...buildSchoolBreadcrumb(school), { name: `${grade}학년`, href: schoolGradeHref(school.slug, grade) }]} />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight break-keep">
            {school.name} {grade}학년 과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl break-keep">{intro}</p>
          <PlanBasisNote className="max-w-2xl" />
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title={`${grade}학년 과목별 평가 구성`} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <div key={c.subject.slug} className="rounded-2xl border border-border-subtle bg-white p-5 md:p-6 flex flex-col">
              <p className="font-bold text-navy break-keep">
                {c.subject.name}
                <span className="ml-2 text-sm font-medium text-text-muted">{c.courses.join(" · ")}</span>
              </p>
              <p className="mt-2 text-sm font-bold text-brand break-keep">{c.ratio}</p>
              <p className="mt-2 text-sm text-text-muted leading-relaxed break-keep">{c.summary}</p>
              {c.tasks.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1 text-xs text-text-muted list-disc pl-4">
                  {c.tasks.map((t) => (
                    <li key={t} className="break-keep">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={c.href}
                className="mt-4 inline-flex items-center gap-1 self-start rounded-full border border-border-subtle px-3.5 py-2 text-sm text-text-main hover:border-brand hover:text-brand"
              >
                {grade}학년 {c.subject.name}과외 자세히
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <EvidenceSection schoolCode={school.official?.code} grade={grade} title={`${grade}학년 수업·분석 자료`} />

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${school.name} ${grade}학년 과외 상담받기`} context={{ region: school.cityRegionSlug, dong: school.dongSlug }} />
      </section>

      <section className="container-page pb-16 md:pb-20 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title={`${school.name} 다른 학년`}
          links={otherGrades.map((g) => ({ label: `${school.name} ${g}학년 과외`, href: schoolGradeHref(school.slug, g) }))}
        />
        <RelatedLinks
          title="관련 페이지"
          links={[
            { label: `${school.name} 과외`, href: `/school/${school.slug}` },
            ...(dong ? [{ label: `${dong.name} 과외`, href: `${getRegionUrl(dong.citySlug)}/${dong.slug}` }] : []),
          ]}
        />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <SourceList sources={sources} />
      </section>
    </>
  );
}
