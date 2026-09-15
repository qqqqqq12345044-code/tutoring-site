import { notFound } from "next/navigation";
import { getRegionBySlug, getChildren } from "@/data/regions";
import { subjects, getSubjectBySlug } from "@/data/subjects";
import { getGradeBySlug } from "@/data/grades";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

function resolveContext(province: string, city: string, slug: string, subjectSlug: string) {
  const parent = getRegionBySlug(province);
  const region = getRegionBySlug(city);
  const subject = getSubjectBySlug(subjectSlug);
  if (!region || !parent || !subject || region.parentSlug !== province) return null;

  const grade = getGradeBySlug(slug);
  if (grade) return { parent, region, subject, type: "grade" as const, grade };

  const district = getChildren(region.slug).find((d) => d.slug === slug);
  if (district) return { parent, region, subject, type: "district" as const, district };

  return null;
}

export async function generateMetadata(
  props: PageProps<"/region/[province]/[city]/[slug]/[subject]">
) {
  const { province, city, slug, subject: subjectSlug } = await props.params;
  const ctx = resolveContext(province, city, slug, subjectSlug);
  if (!ctx) return {};

  const label = ctx.type === "grade" ? `${ctx.region.name} ${ctx.grade.name}` : ctx.district.name;

  return buildMetadata({
    title: `${label} ${ctx.subject.name}과외 | 1:1 맞춤 수업`,
    description: `${label}에서 ${ctx.subject.name}과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 1:1 수업을 상담해보세요.`,
    path: `/region/${province}/${city}/${slug}/${subjectSlug}`,
  });
}

export default async function RegionFilterSubjectPage(
  props: PageProps<"/region/[province]/[city]/[slug]/[subject]">
) {
  const { province, city, slug, subject: subjectSlug } = await props.params;
  const ctx = resolveContext(province, city, slug, subjectSlug);
  if (!ctx) notFound();

  const label = ctx.type === "grade" ? `${ctx.region.name} ${ctx.grade.name}` : ctx.district.name;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb
            items={[
              { name: "지역별 과외", href: "/regions" },
              { name: `${ctx.parent.name} 과외`, href: `/region/${ctx.parent.slug}` },
              { name: `${ctx.region.name} 과외`, href: `/region/${ctx.parent.slug}/${ctx.region.slug}` },
              { name: `${label} ${ctx.subject.name}과외`, href: `/region/${province}/${city}/${slug}/${subjectSlug}` },
            ]}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {label} {ctx.subject.name}과외
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {label}에서 {ctx.subject.name}과외를 찾는다면 현재 개념 이해도와 목표를 먼저 확인하고
            필요한 부분부터 1:1로 학습하는 것이 중요합니다.
          </p>
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <ConsultCTA title={`${label} ${ctx.subject.name}과외 상담받기`} />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <RelatedLinks
          title="다른 과목"
          links={subjects
            .filter((s) => s.slug !== ctx.subject.slug)
            .map((s) => ({ label: `${label} ${s.name}과외`, href: `/region/${province}/${city}/${slug}/${s.slug}` }))}
        />
      </section>
    </>
  );
}
