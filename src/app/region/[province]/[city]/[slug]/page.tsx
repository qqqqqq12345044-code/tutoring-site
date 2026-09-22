import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegionBySlug, getChildren } from "@/data/regions";
import { subjects, getSubjectBySlug } from "@/data/subjects";
import { grades, getGradeBySlug } from "@/data/grades";
import { getRegionSubjectContent, regionSubjectContents } from "@/data/regionSubjectContent";
import { schools, type School } from "@/data/schools";
import { caseStudies } from "@/data/caseStudies";
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
import CaseStudyCard from "@/components/CaseStudyCard";

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

export function generateStaticParams() {
  return regionSubjectContents.map((c) => {
    const region = getRegionBySlug(c.regionSlug);
    return {
      province: region?.parentSlug as string,
      city: c.regionSlug,
      slug: c.subjectSlug,
    };
  });
}

function resolveContext(province: string, city: string, slug: string) {
  const parent = getRegionBySlug(province);
  const region = getRegionBySlug(city);
  if (!region || !parent || region.parentSlug !== province) return null;

  const subject = getSubjectBySlug(slug);
  if (subject) return { parent, region, type: "subject" as const, subject };

  const grade = getGradeBySlug(slug);
  if (grade) return { parent, region, type: "grade" as const, grade };

  const district = getChildren(region.slug).find((d) => d.slug === slug);
  if (district) return { parent, region, type: "district" as const, district };

  return null;
}

export async function generateMetadata(props: PageProps<"/region/[province]/[city]/[slug]">) {
  const { province, city, slug } = await props.params;
  const ctx = resolveContext(province, city, slug);
  if (!ctx) return {};

  if (ctx.type === "subject") {
    const { index } = getIndexability("region-subject", {
      regionSlug: ctx.region.slug,
      subjectSlug: ctx.subject.slug,
    });
    return buildMetadata({
      title: `${ctx.region.name} ${ctx.subject.name}과외 | 초·중·고 1:1 맞춤 수업`,
      description: `${ctx.region.name} 초등·중등·고등 ${ctx.subject.name}과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 1:1 방문·화상 수업을 상담해보세요.`,
      path: `/region/${province}/${city}/${slug}`,
      robots: { index, follow: true },
    });
  }
  if (ctx.type === "grade") {
    const { index } = getIndexability("region-grade");
    return buildMetadata({
      title: `${ctx.region.name} ${ctx.grade.name}과외 | 1:1 맞춤 수업`,
      description: `${ctx.region.name} ${ctx.grade.label}을 위한 1:1 과외를 상담해보세요.`,
      path: `/region/${province}/${city}/${slug}`,
      robots: { index, follow: true },
    });
  }
  const { index } = getIndexability("region");
  return buildMetadata({
    title: `${ctx.district.name} 과외 | 초·중·고 1:1 맞춤 수업`,
    description: `${ctx.district.fullName} 초등·중등·고등 1:1 과외를 찾고 있다면 학생의 현재 수준과 목표에 맞는 방문·화상 수업을 상담해보세요.`,
    path: `/region/${province}/${city}/${slug}`,
    robots: { index, follow: true },
  });
}

export default async function RegionFilterPage(props: PageProps<"/region/[province]/[city]/[slug]">) {
  const { province, city, slug } = await props.params;
  const ctx = resolveContext(province, city, slug);
  if (!ctx) notFound();

  const breadcrumbBase = [
    { name: "지역별 과외", href: "/regions" },
    { name: `${ctx.parent.name} 과외`, href: `/region/${ctx.parent.slug}` },
    { name: `${ctx.region.name} 과외`, href: `/region/${ctx.parent.slug}/${ctx.region.slug}` },
  ];

  if (ctx.type === "subject") {
    const content = getRegionSubjectContent(ctx.region.slug, ctx.subject.slug);
    const districts = getChildren(ctx.region.slug);
    const faqs = getFaqsBySlugs(ctx.subject.faqSlugs);
    const relatedSchools = schools.filter((s) => s.cityRegionSlug === ctx.region.slug);

    return (
      <>
        <JsonLd data={faqSchema(faqs)} />
        <section className="bg-white border-b border-border-subtle">
          <div className="container-page py-8 md:py-10 flex flex-col gap-4">
            <Breadcrumb items={[...breadcrumbBase, { name: `${ctx.subject.name}과외`, href: `/region/${province}/${city}/${slug}` }]} />
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
              {ctx.region.name} {ctx.subject.name}과외
              <br className="hidden md:block" /> 초·중·고 1:1 맞춤 수업
            </h1>
            <p className="text-text-main/80 leading-relaxed max-w-2xl">
              {content?.intro ??
                `${ctx.subject.name}은 같은 학년이라도 학생마다 막히는 지점이 다릅니다. 현재 개념 이해도와 학교 진도, 목표를 확인하고 필요한 부분부터 1:1로 학습합니다.`}
            </p>
          </div>
        </section>

        {/* GRADE-LEVEL SECTIONS */}
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`학년별 ${ctx.region.name} ${ctx.subject.name}과외`} />
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {(content?.gradeSections ??
              grades.map((g) => ({
                title: `${ctx.region.name} ${g.name} ${ctx.subject.name}과외`,
                body: g.description,
              }))
            ).map((sec) => (
              <div key={sec.title} className="border-l-4 border-brand-light pl-5 py-0.5">
                <p className="font-bold text-navy">{sec.title}</p>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHEN TO CONSULT */}
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader
              align="left"
              title={`이런 경우 ${ctx.subject.name}과외 상담을 받아보세요`}
              description="지역과 관계없이 학생들이 공통적으로 겪는 학습 상황입니다."
            />
            <div className="mt-8">
              <ChecklistPanel items={ctx.subject.painPoints} />
            </div>
          </div>
        </section>

        {/* HOW CLASSES PROCEED */}
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title="수업은 이렇게 진행합니다" />
          <div className="mt-10">
            <StepFlow steps={ctx.subject.process} />
          </div>
        </section>

        {/* REGION SCHOOL INFO */}
        {relatedSchools.length > 0 && (
          <section className="bg-white border-y border-border-subtle">
            <div className="container-page py-14 md:py-16">
              <SectionHeader
                align="left"
                title={`${ctx.region.name} 학교별 ${ctx.subject.name}과외 정보`}
                description="재학 중인 학교를 확인하면 진도와 시험 일정에 맞춘 학교별 안내를 볼 수 있습니다."
              />
              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                {LEVEL_ORDER.map((level) => {
                  const list = relatedSchools.filter((s) => s.level === level);
                  if (list.length === 0) return null;
                  return (
                    <div key={level} className="rounded-2xl border border-border-subtle p-6">
                      <p className="font-bold text-navy">
                        {level} <span className="text-text-muted font-medium text-sm">{list.length}곳</span>
                      </p>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {list.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/school/${s.slug}/${ctx.subject.slug}`}
                              className="text-sm text-text-main hover:text-brand transition-colors"
                            >
                              {s.name} {ctx.subject.name}과외
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CASE STUDIES */}
        <section className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title={`이런 학생에게 도움이 되는 ${ctx.subject.name} 수업 방식`}
            description="특정 학생을 대상으로 한 후기가 아닌, 이해를 돕기 위한 수업 설계 예시입니다."
          />
          <div className="mt-8 grid sm:grid-cols-3 gap-5">
            {(caseStudies.filter((cs) => cs.subject === ctx.subject.name).length > 0
              ? caseStudies.filter((cs) => cs.subject === ctx.subject.name)
              : caseStudies.slice(0, 3)
            ).map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        </section>

        {/* RELATED SUBJECTS / GRADES / DISTRICTS */}
        <section className="container-page py-14 md:py-16 flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <RelatedLinks
              title="관련 과목"
              links={subjects
                .filter((s) => s.slug !== ctx.subject.slug)
                .map((s) => ({ label: `${ctx.region.name} ${s.name}과외`, href: `/region/${province}/${city}/${s.slug}` }))}
            />
            <RelatedLinks
              title="관련 학년"
              links={grades.map((g) => ({
                label: `${ctx.region.name} ${g.name}과외`,
                href: `/region/${province}/${city}/${g.slug}`,
              }))}
            />
          </div>
          {districts.length > 0 && (
            <RelatedLinks
              title={`${ctx.region.name} 하위 지역 ${ctx.subject.name}과외`}
              links={districts.map((d) => ({
                label: `${d.name} ${ctx.subject.name}과외`,
                href: `/region/${province}/${city}/${d.slug}/${ctx.subject.slug}`,
              }))}
            />
          )}
          {relatedSchools.length > 0 && (
            <RelatedLinks
              title={`${ctx.region.name} 관련 학교`}
              links={relatedSchools.map((s) => ({ label: `${s.name} 과외`, href: `/school/${s.slug}` }))}
            />
          )}
        </section>

        <section className="container-page pb-14 md:pb-16">
          <SectionHeader align="left" title="자주 묻는 질문" />
          <div className="mt-8 max-w-2xl">
            <FAQAccordion items={faqs} />
          </div>
        </section>

        <section className="container-page pb-16 md:pb-20">
          <ConsultCTA title={`${ctx.region.name} ${ctx.subject.name}과외 상담받기`} description="학년과 목표를 알려주시면 안내해드립니다." />
        </section>
      </>
    );
  }

  if (ctx.type === "grade") {
    return (
      <>
        <section className="bg-white border-b border-border-subtle">
          <div className="container-page py-8 md:py-10 flex flex-col gap-4">
            <Breadcrumb items={[...breadcrumbBase, { name: `${ctx.grade.name}과외`, href: `/region/${province}/${city}/${slug}` }]} />
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
              {ctx.region.name} {ctx.grade.name}과외
            </h1>
            <p className="text-text-muted leading-relaxed max-w-2xl">
              {ctx.region.name}에서 {ctx.grade.label} 자녀의 과외를 찾고 있다면 과목별 학습 방향을
              먼저 확인해보세요.
            </p>
          </div>
        </section>

        <section className="container-page py-14 md:py-16">
          <RelatedLinks
            title={`${ctx.region.name} ${ctx.grade.name} 과목별 과외`}
            links={subjects.map((s) => ({
              label: `${ctx.region.name} ${ctx.grade.name} ${s.name}과외`,
              href: `/region/${province}/${city}/${slug}/${s.slug}`,
            }))}
          />
        </section>

        <section className="container-page pb-16 md:pb-20">
          <ConsultCTA title={`${ctx.region.name} ${ctx.grade.name}과외 상담받기`} />
        </section>
      </>
    );
  }

  const districtSubjectLinks = subjects.map((s) => ({
    label: `${ctx.district.name} ${s.name}과외`,
    href: `/region/${province}/${city}/${slug}/${s.slug}`,
  }));
  const districtSchools = schools.filter((s) => s.districtRegionSlug === ctx.district.slug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb items={[...breadcrumbBase, { name: `${ctx.district.name} 과외`, href: `/region/${province}/${city}/${slug}` }]} />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
            {ctx.district.name} 과외 <span className="text-text-muted font-medium text-lg md:text-2xl">| 초·중·고 1:1 맞춤 수업</span>
          </h1>
          <p className="text-text-muted leading-relaxed max-w-2xl">
            {ctx.district.fullName}에서 과외를 찾는다면 학생의 학년과 과목에 맞는 1:1 수업을 상담해보세요.
          </p>
        </div>
      </section>

      <section className="container-page py-14 md:py-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks title={`${ctx.district.name} 과목별 과외`} links={districtSubjectLinks} />
        {districtSchools.length > 0 && (
          <RelatedLinks
            title={`${ctx.district.name} 관련 학교`}
            links={districtSchools.map((s) => ({ label: `${s.name} 과외`, href: `/school/${s.slug}` }))}
          />
        )}
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${ctx.district.name} 과외 상담받기`} />
      </section>
    </>
  );
}
