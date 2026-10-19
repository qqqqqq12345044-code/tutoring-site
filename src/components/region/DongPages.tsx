import Link from "next/link";
import type { RegionNode } from "@/data/regions";
import { getDongsByCity, getDongsSharingLegalDong, type AdminDong } from "@/data/dongs";
import { subjects, type Subject } from "@/data/subjects";
import { grades } from "@/data/grades";
import { guideArticles } from "@/data/guide";
import { getGradeSubjectPlaybook } from "@/data/gradeSubjectPlaybook";
import { getSubjectStudyGuide } from "@/data/subjectStudyGuide";
import { getDongSubjectContent } from "@/data/dongSubjectContent";
import type { School } from "@/data/schools";
import { buildMetadata } from "@/lib/metadata";
import { motifForSlug } from "@/lib/thumbnails";
import { getIndexability } from "@/lib/indexability";
import { schoolLevelToGradeSlug } from "@/lib/schoolHierarchy";
import { buildDongHubContent, buildDongSubjectContent, getDongSchools, groupByLevel, type DongNote } from "@/lib/dongContent";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import StepFlow from "@/components/ui/StepFlow";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks, { type RelatedLink } from "@/components/RelatedLinks";
import SourceList from "@/components/SourceList";
import StudyThumbnail from "@/components/StudyThumbnail";

/**
 * 행정동 hub and 행정동×과목 pages (/region/[province]/[city]/[dong](/[subject])).
 * Rendered from src/lib/dongContent.ts; indexability comes from getIndexability()
 * ("region-dong" / "region-dong-subject").
 */

interface DongCtx {
  parent: RegionNode;
  region: RegionNode;
  dong: AdminDong;
}

const levelGuideCategory: Record<School["level"], string> = {
  초등학교: "elementary-study",
  중학교: "middle-naeshin",
  고등학교: "high-naeshin",
};

function dongBase({ parent, region, dong }: DongCtx): string {
  return `/region/${parent.slug}/${region.slug}/${dong.slug}`;
}

function breadcrumbBase({ parent, region }: DongCtx) {
  return [
    { name: "지역별 과외", href: "/regions" },
    { name: `${parent.name} 과외`, href: `/region/${parent.slug}` },
    { name: `${region.name} 과외`, href: `/region/${parent.slug}/${region.slug}` },
  ];
}

/** Short school list for descriptions: "호암초·회룡초·회룡중·호원고". */
function shortSchoolNames(list: School[], max = 4): string {
  const short = list.map((s) => s.name.replace(/등학교$/, "").replace(/학교$/, ""));
  return short.length > max ? `${short.slice(0, max).join("·")} 등 ${short.length}곳` : short.join("·");
}

export function dongHubMetadata(ctx: DongCtx) {
  const list = getDongSchools(ctx.dong);
  const { index } = getIndexability("region-dong", { regionSlug: ctx.region.slug, dongSlug: ctx.dong.slug });
  return buildMetadata({
    title: `${ctx.region.name} ${ctx.dong.name} 과외 | 초·중·고 1:1 맞춤 수업`,
    description: `${ctx.region.fullName} ${ctx.dong.name}(법정동 ${ctx.dong.legalDongs.join("·")}) 초·중·고 1:1 과외 안내. 동 안의 학교(${shortSchoolNames(list)})와 과목별 수업 페이지를 확인하세요.`,
    path: dongBase(ctx),
    image: "region",
    robots: { index, follow: true },
  });
}

export function dongSubjectMetadata(ctx: DongCtx, subject: Subject) {
  const list = getDongSchools(ctx.dong);
  const { index } = getIndexability("region-dong-subject", {
    regionSlug: ctx.region.slug,
    dongSlug: ctx.dong.slug,
    subjectSlug: subject.slug,
  });
  const planBased = Boolean(getDongSubjectContent(ctx.region.slug, ctx.dong.slug, subject.slug));
  return buildMetadata({
    title: `${ctx.region.name} ${ctx.dong.name} ${subject.name}과외 | ${planBased ? `학교별 2학기 ${subject.name} 평가계획` : `학교급별 ${subject.name} 공부 포인트`}`,
    description: planBased
      ? `${ctx.region.name} ${ctx.dong.name} ${subject.name}과외 — ${shortSchoolNames(list)}의 2026학년도 2학기 ${subject.name} 평가계획(정기시험·수행평가 비율과 과제)을 학교알리미 공시 기준으로 비교합니다.`
      : `${ctx.region.name} ${ctx.dong.name}(법정동 ${ctx.dong.legalDongs.join("·")}) ${subject.name}과외 — ${shortSchoolNames(list)} 학교급별 ${subject.name} 학습 포인트와 1:1 수업 진행 방식을 안내합니다.`,
    path: `${dongBase(ctx)}/${subject.slug}`,
    image: motifForSlug(subject.slug),
    robots: { index, follow: true },
  });
}

function NotesGrid({ notes }: { notes: DongNote[] }) {
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-8">
      {notes.map((n) => (
        <article key={n.title}>
          <h3 className="font-bold text-navy">{n.title}</h3>
          <p className="mt-2 text-[15px] text-text-main/85 leading-relaxed break-keep">{n.body}</p>
        </article>
      ))}
    </div>
  );
}

function SchoolsByLevel({ list }: { list: School[] }) {
  return (
    <div className="mt-8 grid sm:grid-cols-3 gap-6">
      {groupByLevel(list).map((g) => (
        <div key={g.level} className="rounded-2xl border border-border-subtle bg-white p-6">
          <p className="font-bold text-navy">{g.level}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {g.list.map((s) => (
              <li key={s.slug} className="text-sm leading-snug">
                <Link href={`/school/${s.slug}`} className="text-text-main hover:text-brand transition-colors">
                  {s.name} 과외
                </Link>
                {s.official && (
                  <span className="block text-xs text-text-muted mt-0.5">{s.official.roadAddress.replace(/^경기도 /, "")}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function siblingDongLinks(ctx: DongCtx, subject?: Subject): RelatedLink[] {
  const base = `/region/${ctx.parent.slug}/${ctx.region.slug}`;
  return getDongsSharingLegalDong(ctx.dong)
    .flatMap((g) => g.dongs)
    .filter((d, i, arr) => arr.findIndex((x) => x.slug === d.slug) === i)
    .map((d) => ({
      label: subject ? `${d.name} ${subject.name}과외` : `${d.name} 과외`,
      href: subject ? `${base}/${d.slug}/${subject.slug}` : `${base}/${d.slug}`,
    }));
}

function gradeLinks(ctx: DongCtx, list: School[]): RelatedLink[] {
  const cityBase = `/region/${ctx.parent.slug}/${ctx.region.slug}`;
  const levels = new Set(list.map((s) => schoolLevelToGradeSlug[s.level]));
  return grades
    .filter((g) => levels.has(g.slug))
    .flatMap((g) => [
      { label: `${ctx.region.name} ${g.name}과외`, href: `${cityBase}/${g.slug}` },
      { label: `${g.name} 학습 안내`, href: `/grade/${g.slug}` },
    ]);
}

function guideLinks(list: School[], subject?: Subject): RelatedLink[] {
  const categories = new Set<string>([
    ...(subject ? [`${subject.slug}-study`] : []),
    ...list.map((s) => levelGuideCategory[s.level]),
  ]);
  return guideArticles
    .filter((a) => categories.has(a.categorySlug))
    .slice(0, 6)
    .map((a) => ({ label: a.title, href: `/guide/${a.slug}` }));
}

export function DongHubView({ ctx }: { ctx: DongCtx }) {
  const list = getDongSchools(ctx.dong);
  const content = buildDongHubContent(ctx.dong, ctx.region.name);
  const base = dongBase(ctx);
  const otherDongs = getDongsByCity(ctx.region.slug).filter((d) => d.slug !== ctx.dong.slug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb items={[...breadcrumbBase(ctx), { name: `${ctx.dong.name} 과외`, href: base }]} />
          <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
                {ctx.region.name} {ctx.dong.name} 과외
                <span className="block mt-1 text-text-muted font-medium text-lg md:text-2xl">초·중·고 1:1 맞춤 수업</span>
              </h1>
              <p className="mt-4 text-text-main/80 leading-relaxed break-keep">{content.intro}</p>
            </div>
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border-subtle">
              <StudyThumbnail motif="region" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <RelatedLinks
          title={`${ctx.dong.name} 과목별 과외`}
          links={subjects.map((s) => ({ label: `${ctx.dong.name} ${s.name}과외`, href: `${base}/${s.slug}` }))}
        />
      </section>

      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title={`${ctx.dong.name} 학교`}
            description="NEIS 학교기본정보의 도로명주소를 행정안전부 주소정보누리집에서 조회해 이 행정동으로 확인된 학교입니다."
          />
          <SchoolsByLevel list={list} />
          <NotesGrid notes={content.notes.filter((n) => !n.subjectSlug)} />
        </div>
      </section>

      {content.notes.some((n) => n.subjectSlug) && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader
            align="left"
            title={`${ctx.dong.name} 과목별 2학기 평가 요약`}
            description="각 과목 페이지에 정리한 학교알리미 2026학년도 2학기 평가계획 가운데 앞부분을 옮겼습니다."
          />
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {content.notes
              .filter((n) => n.subjectSlug)
              .map((n) => (
                <article key={n.title}>
                  <h3 className="font-bold text-navy">
                    <Link href={`${base}/${n.subjectSlug}`} className="hover:text-brand transition-colors">
                      {n.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15px] text-text-main/85 leading-relaxed break-keep">{n.body}</p>
                </article>
              ))}
          </div>
        </section>
      )}

      <section className="container-page py-14 md:py-16 flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <RelatedLinks title="관련 학년" links={gradeLinks(ctx, list)} />
          <RelatedLinks title="관련 학습 가이드" links={guideLinks(list)} />
        </div>
        <RelatedLinks title="법정동을 함께 쓰는 행정동" links={siblingDongLinks(ctx)} />
        <RelatedLinks
          title={`${ctx.region.name} 다른 행정동`}
          links={[
            { label: `${ctx.region.name} 과외 전체`, href: `/region/${ctx.parent.slug}/${ctx.region.slug}` },
            ...otherDongs.map((d) => ({ label: `${d.name} 과외`, href: `/region/${ctx.parent.slug}/${ctx.region.slug}/${d.slug}` })),
          ]}
        />
      </section>

      <section className="container-page pb-14 md:pb-16">
        <SourceList sources={content.sources} />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA title={`${ctx.region.name} ${ctx.dong.name} 과외 상담받기`} description="학교와 학년, 과목을 알려주시면 안내해드립니다." />
      </section>
    </>
  );
}

export function DongSubjectView({ ctx, subject }: { ctx: DongCtx; subject: Subject }) {
  const list = getDongSchools(ctx.dong);
  const content = buildDongSubjectContent(ctx.dong, ctx.region.name, subject);
  const base = dongBase(ctx);
  const cityBase = `/region/${ctx.parent.slug}/${ctx.region.slug}`;
  const guide = getSubjectStudyGuide(subject.slug);
  const playbooks = groupByLevel(list)
    .map((g) => ({ level: g.level, playbook: getGradeSubjectPlaybook(schoolLevelToGradeSlug[g.level], subject.slug) }))
    .filter((p) => p.playbook);
  // Written (평가계획) pages show all their notes in the main section.
  const levelNotes = content.planBased ? content.notes : content.notes.filter((n) => n.title.endsWith(`${subject.name} 공부 포인트`));
  const otherNotes = content.notes.filter((n) => !levelNotes.includes(n));
  const heading = content.planBased ? `학교별 2학기 ${subject.name} 평가계획` : `학교급별 ${subject.name} 공부 포인트`;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb
            items={[
              ...breadcrumbBase(ctx),
              { name: `${ctx.dong.name} 과외`, href: base },
              { name: `${subject.name}과외`, href: `${base}/${subject.slug}` },
            ]}
          />
          <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
                {ctx.region.name} {ctx.dong.name} {subject.name}과외
                <span className="block mt-1 text-text-muted font-medium text-lg md:text-2xl">{heading}</span>
              </h1>
              <p className="mt-4 text-text-main/80 leading-relaxed break-keep">{content.intro}</p>
            </div>
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border-subtle">
              <StudyThumbnail motif={motifForSlug(subject.slug)} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <SectionHeader
          align="left"
          title={`${ctx.dong.name} ${heading}`}
          description={content.planBased ? "학교알리미에 공시된 각 학교의 2026학년도 2학기 교과별 평가계획 원문을 확인해 정리했습니다. 시기와 과제는 학교 사정에 따라 바뀔 수 있습니다." : undefined}
        />
        <NotesGrid notes={levelNotes} />
        <SchoolsByLevel list={list} />
      </section>

      {otherNotes.length > 0 && (
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader align="left" title={`${ctx.dong.name} 지역·학교 정보`} />
            <NotesGrid notes={otherNotes} />
          </div>
        </section>
      )}

      {playbooks.length > 0 && (
        <section className="container-page py-14 md:py-16">
          <SectionHeader align="left" title={`학년별 ${subject.name} 학습 전략`} description="지역과 관계없이 같은 학년에서 공통으로 확인하는 내용입니다." />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.flatMap(({ level, playbook }) =>
              playbook!.focusPoints.map((p) => (
                <div key={`${level}-${p.title}`} className="border-l-4 border-brand-light pl-5 py-0.5">
                  <p className="font-bold text-navy">{p.title}</p>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">{p.body}</p>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {guide && (
        <section className="bg-white border-y border-border-subtle">
          <div className="container-page py-14 md:py-16">
            <SectionHeader align="left" title={`시험 4주 전부터의 ${subject.name} 학습 계획`} description="지역과 관계없이 공통으로 쓰는 시험 대비 흐름입니다." />
            <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {guide.examPlan.map((step) => (
                <li key={step.when} className="border-l-4 border-brand-light pl-5 py-0.5">
                  <p className="text-sm font-bold text-brand">{step.when}</p>
                  <p className="mt-2 text-sm text-text-main leading-relaxed">{step.focus}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title="수업은 이렇게 진행합니다" />
        <div className="mt-10">
          <StepFlow steps={subject.process} />
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16 flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <RelatedLinks
            title={`${ctx.dong.name} 다른 과목`}
            links={[
              { label: `${ctx.dong.name} 과외 전체`, href: base },
              ...subjects.filter((s) => s.slug !== subject.slug).map((s) => ({ label: `${ctx.dong.name} ${s.name}과외`, href: `${base}/${s.slug}` })),
            ]}
          />
          <RelatedLinks
            title={`${ctx.region.name} ${subject.name}과외`}
            links={[
              { label: `${ctx.region.name} ${subject.name}과외`, href: `${cityBase}/${subject.slug}` },
              { label: `${subject.name}과외 안내`, href: `/subject/${subject.slug}` },
              ...siblingDongLinks(ctx, subject),
            ]}
          />
          <RelatedLinks title="관련 학년" links={gradeLinks(ctx, list)} />
          <RelatedLinks title="관련 학습 가이드" links={guideLinks(list, subject)} />
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16">
        <SourceList sources={content.sources} />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${ctx.region.name} ${ctx.dong.name} ${subject.name}과외 상담받기`}
          description="학교와 학년, 현재 고민을 알려주시면 안내해드립니다."
        />
      </section>
    </>
  );
}
