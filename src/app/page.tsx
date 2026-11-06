import {
  Target,
  Route,
  CalendarClock,
  LineChart,
  School,
  BookX,
  CircleHelp,
  Repeat,
  ClipboardCheck,
  Compass,
  FileText,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { regions, getProvinces, getRegionUrl } from "@/data/regions";
import { schools } from "@/data/schools";
import { programs } from "@/data/programs";
import { guideArticles } from "@/data/guide";
import { countSchoolsInRegion } from "@/lib/indexability";
import { motifForSlug } from "@/lib/thumbnails";
import GuideCard from "@/components/GuideCard";
import StudyThumbnail from "@/components/StudyThumbnail";
import { caseStudies } from "@/data/caseStudies";
import { homeFaqSlugs, getFaqsBySlugs } from "@/data/faqs";
import SectionHeader from "@/components/ui/SectionHeader";
import { subjectIcons } from "@/components/SubjectCard";
import GradeCard from "@/components/GradeCard";
import RegionCard from "@/components/RegionCard";
import CaseStudyCard from "@/components/CaseStudyCard";
import ConsultForm from "@/components/ConsultForm";
import FAQAccordion from "@/components/FAQAccordion";
import SearchBox from "@/components/SearchBox";
import Hero, { type HeroStat } from "@/components/home/Hero";
import LevelTestBanner from "@/components/LevelTestBanner";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TextLink from "@/components/ui/TextLink";
import StepFlow from "@/components/ui/StepFlow";
import { JsonLd, faqSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: `${siteConfig.brandName} | 초·중·고 1:1 맞춤과외`,
  description:
    "국어·영어·수학·사회·과학 1:1 과외. 학생의 수준과 목표에 맞춰 학습을 설계합니다.",
  path: "/",
});

const whyItems = [
  {
    num: "01",
    icon: Target,
    title: "정확한 현재 수준 확인",
    body: "학생이 어디에서 막히는지 먼저 확인하고 필요한 부분부터 수업합니다.",
  },
  {
    num: "02",
    icon: Route,
    title: "학생별 맞춤 커리큘럼",
    body: "정해진 진도를 따라가기보다 학생의 목표와 이해 속도에 맞게 조절합니다.",
  },
  {
    num: "03",
    icon: CalendarClock,
    title: "학교·시험 일정에 맞춘 관리",
    body: "내신 기간, 수행평가, 모의고사 등 학생 일정에 맞춰 학습 우선순위를 정합니다.",
  },
  {
    num: "04",
    icon: LineChart,
    title: "지속적인 학습 피드백",
    body: "수업만 하고 끝나는 것이 아니라 학습 상태와 다음 계획을 꾸준히 점검합니다.",
  },
];

const processSteps = [
  { step: "01", title: "무료 상담", body: "학년, 과목, 지역, 현재 고민을 확인합니다." },
  { step: "02", title: "학습 상황 확인", body: "무료 레벨테스트와 상담으로 현재 수준과 필요한 학습 방향을 파악합니다." },
  { step: "03", title: "선생님 매칭", body: "학생에게 맞는 수업 방식과 선생님을 조율합니다." },
  { step: "04", title: "수업 시작", body: "학생별 계획에 맞춰 1:1 수업을 진행합니다." },
];

const trustBasis = [
  {
    icon: FileText,
    source: "학교알리미 정보공시",
    title: "학교별 평가계획 확인",
    body: "학교가 공시한 교과별 평가계획에서 지필·수행평가 비율과 과제를 확인해 학년·과목별 안내에 반영합니다.",
  },
  {
    icon: CalendarDays,
    source: "NEIS 교육정보 개방 포털",
    title: "학교 기본정보 확인",
    body: "교육부 NEIS에 등록된 학교 소재지·학교급 등 공식 기록으로 학교와 지역을 연결합니다.",
  },
  {
    icon: BookOpen,
    source: "교육부·정책브리핑",
    title: "교육과정 변화 반영",
    body: "학습가이드의 교육과정·입시 관련 설명은 교육부 발표와 정책브리핑 자료를 근거로 작성합니다.",
  },
];

const problemItems = [
  { icon: BookX, text: "학원 진도를 따라가기 힘들어요" },
  { icon: CircleHelp, text: "개념은 아는데 시험 점수가 안 나와요" },
  { icon: Repeat, text: "모르는 부분이 쌓여 어디서부터 시작해야 할지 모르겠어요" },
  { icon: ClipboardCheck, text: "혼자서는 공부를 꾸준히 하지 못해요" },
  { icon: School, text: "학교 시험에 맞춰 내신을 관리하고 싶어요" },
  { icon: Compass, text: "수능 준비를 어떻게 해야 할지 모르겠어요" },
];

export default function HomePage() {
  const homeFaqs = getFaqsBySlugs(homeFaqSlugs);
  const provinces = getProvinces();
  const featuredProvinces = provinces.filter((p) => countSchoolsInRegion(p.slug) > 0);
  // 교과 외 과정 중 홈에 노출할 3종 (한국어과외는 대상이 달라 과목 목록에서 제외, 푸터·과목 허브에서 연결)
  const homePrograms = programs.filter((p) => ["nonsul", "coding", "ged"].includes(p.slug));
  // 최신 정보성 글 6편 (publishedAt 내림차순)
  const latestGuides = [...guideArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 6);

  const searchTargets = [
    ...regions.map((r) => ({ label: r.level === "province" ? r.name : r.fullName, href: getRegionUrl(r.slug) })),
    ...schools.map((s) => ({ label: s.name, href: `/school/${s.slug}` })),
  ];

  const statSchools = schools.length;
  const statCities = regions.filter((r) => r.level === "city" && countSchoolsInRegion(r.slug) > 0).length;
  const heroStats: HeroStat[] = [
    { value: `${statSchools.toLocaleString("ko-KR")}곳`, label: "학교 정보 정리" },
    { value: `${statCities}곳`, label: "안내 시·군·구" },
    { value: `${subjects.length}과목`, label: "국·영·수·사·과" },
    { value: `${guideArticles.length}편`, label: "학습가이드" },
  ];

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <Hero stats={heroStats} />

      {/* WHY — numbered cards with clearly visible numbers */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader
          eyebrow="WHY 교과설계소"
          title={"같은 1시간이라도\n학생에게 맞는 수업은 다릅니다"}
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {whyItems.map((item) => (
            <div
              key={item.num}
              className="relative flex gap-5 rounded-2xl border border-border-subtle bg-white p-6 md:p-7"
            >
              <span
                aria-hidden="true"
                className="text-4xl md:text-5xl font-black text-brand leading-none shrink-0 select-none tabular-nums"
              >
                {item.num}
              </span>
              <div>
                <p className="flex items-center gap-2 font-extrabold text-navy text-lg">
                  <item.icon className="w-5 h-5 text-brand shrink-0" aria-hidden="true" />
                  {item.title}
                </p>
                <p className="mt-2 text-[15px] text-text-main leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BASIS — what the school/subject pages are actually built on */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-16 md:py-20">
          <SectionHeader
            eyebrow="OFFICIAL DATA"
            title={"학교 시험 준비는\n학교 공식 자료에서 시작합니다"}
            description="추측이 아니라 학교가 공개한 자료를 먼저 확인합니다. 확인되지 않은 내용은 안내하지 않습니다."
          />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {trustBasis.map((t) => (
              <div key={t.title} className="flex flex-col gap-3 rounded-2xl bg-bg-app border border-border-subtle p-6 md:p-7">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-navy text-white">
                  <t.icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <p className="text-sm font-bold text-brand">{t.source}</p>
                <p className="text-lg font-extrabold text-navy leading-snug">{t.title}</p>
                <p className="text-[15px] text-text-main leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <TextLink href="/schools">학교별 과외 안내 보기</TextLink>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader eyebrow="HOW IT WORKS" title={"상담부터 수업 시작까지\n이렇게 진행됩니다"} />
        <div className="mt-10">
          <StepFlow steps={processSteps} />
        </div>
        <LevelTestBanner className="mt-12" />
      </section>

      {/* SUBJECT — list rows, distinct from card grids elsewhere on the page */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-16 md:py-20">
          <SectionHeader title={"필요한 과목부터\n집중해서 시작하세요"} />
          <div className="mt-10 divide-y divide-border-subtle border-y border-border-subtle">
            {subjects.map((s) => {
              const Icon = subjectIcons[s.slug];
              return (
                <Link
                  key={s.slug}
                  href={`/subject/${s.slug}`}
                  className="group flex items-center gap-4 py-5 px-2 -mx-2 rounded-lg hover:bg-brand-light/60 transition-colors"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-navy">{s.name}과외</p>
                    <p className="text-sm text-text-main truncate">{s.shortDescription}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
          <p className="mt-10 text-base font-extrabold text-navy">교과 외 과정</p>
          <div className="mt-3 grid sm:grid-cols-3 gap-4">
            {homePrograms.map((p) => (
              <Link
                key={p.slug}
                href={`/program/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white transition-colors hover:border-brand"
              >
                <StudyThumbnail motif={motifForSlug(p.slug)} />
                <div className="p-5">
                  <p className="font-extrabold text-navy">{p.name}과외</p>
                  <p className="mt-1 text-sm text-text-main leading-relaxed">{p.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader title={"학년이 달라지면\n공부 방법도 달라져야 합니다"} />
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {grades.map((g) => (
            <GradeCard key={g.slug} grade={g} />
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-16 md:py-20">
          <SectionHeader title={"수업은 학생마다\n이렇게 다르게 설계됩니다"} />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.id} caseStudy={c} />
            ))}
          </div>
        </div>
      </section>

      {/* STUDY GUIDES — informational content, not tutoring listings */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader
          eyebrow="STUDY GUIDE"
          title={"과외를 고르기 전에\n먼저 읽어보면 좋은 공부법"}
          description="학습 전략, 시험 대비, 학년별·과목별 공부법을 정리했습니다."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestGuides.map((a) => (
            <GuideCard key={a.slug} article={a} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <TextLink href="/guide">학습가이드 전체 보기</TextLink>
        </div>
      </section>

      {/* REGION + QUICK SEARCH */}
      <section className="bg-brand-light">
        <div className="container-page py-16 md:py-20 flex flex-col items-center gap-6 text-center">
          <SectionHeader
            title={"우리 동네 과외를\n찾아보세요"}
            description="지역이나 학교를 검색하면 관련 과목과 학년별 과외 정보를 확인할 수 있습니다."
          />
          <SearchBox targets={searchTargets} />
          <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-3xl">
            {provinces.map((p) => (
              <Link
                key={p.slug}
                href={`/region/${p.slug}`}
                className="rounded-full bg-white border border-border-subtle px-4 py-2 text-sm font-semibold text-navy hover:border-brand hover:text-brand transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 w-full grid sm:grid-cols-2 gap-4 text-left">
            {featuredProvinces.map((p) => (
              <RegionCard key={p.slug} region={p} />
            ))}
          </div>
          <TextLink href="/regions">전체 지역 보기</TextLink>
        </div>
      </section>

      {/* PROBLEM BASED */}
      <section className="bg-navy">
        <div className="container-page py-16 md:py-20">
          <h2 className="text-center text-2xl md:text-[2.15rem] font-extrabold text-white whitespace-pre-line leading-[1.3] tracking-tight">
            {"혹시 이런 고민 때문에\n과외를 찾고 계신가요?"}
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemItems.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-5 py-5"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 text-white shrink-0">
                  <item.icon className="w-4 h-4" />
                </span>
                <p className="text-[15px] font-semibold text-white leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-white text-[15px]">
              학생마다 필요한 해결 방법은 다릅니다.
              <br />
              먼저 현재 상황부터 확인해보세요.
            </p>
            <PrimaryButton href="/consult" size="lg">
              학습 상담받기
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader title={"과외 상담 전\n많이 물어보시는 질문"} />
        <div className="mt-10 max-w-2xl mx-auto">
          <FAQAccordion items={homeFaqs} />
        </div>
      </section>

      {/* FINAL CTA + FORM */}
      <section className="bg-brand-light">
        <div className="container-page py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-navy leading-snug whitespace-pre-line">
              {"우리 아이에게 필요한 과외,\n현재 고민부터 알려주세요"}
            </h2>
            <p className="mt-3 text-text-muted text-sm md:text-base leading-relaxed">
              학년과 과목, 지역을 남겨주시면 수업 가능 여부와 진행 방법을 상담해드립니다.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ConsultForm />
          </div>
        </div>
      </section>
    </>
  );
}
