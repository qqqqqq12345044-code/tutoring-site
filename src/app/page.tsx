import {
  Target,
  Route,
  CalendarClock,
  LineChart,
  Home as HomeIcon,
  Video,
  School,
  BookX,
  CircleHelp,
  Repeat,
  ClipboardCheck,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { regions, getProvinces, getRegionUrl } from "@/data/regions";
import { schools } from "@/data/schools";
import { caseStudies } from "@/data/caseStudies";
import { homeFaqSlugs, getFaqsBySlugs } from "@/data/faqs";
import SectionHeader from "@/components/ui/SectionHeader";
import { subjectIcons } from "@/components/SubjectCard";
import GradeCard from "@/components/GradeCard";
import RegionCard from "@/components/RegionCard";
import LessonTypeCard from "@/components/LessonTypeCard";
import CaseStudyCard from "@/components/CaseStudyCard";
import ConsultForm from "@/components/ConsultForm";
import FAQAccordion from "@/components/FAQAccordion";
import SearchBox from "@/components/SearchBox";
import Hero from "@/components/home/Hero";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TextLink from "@/components/ui/TextLink";
import StepFlow from "@/components/ui/StepFlow";
import { JsonLd, faqSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: `${siteConfig.brandName} | ${siteConfig.tagline}`,
  description:
    "국어·영어·수학·사회·과학 초중고 1:1 과외. 학생의 현재 수준과 목표에 맞는 방문·화상 수업을 무료로 상담받아보세요.",
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
  { step: "02", title: "학습 상황 확인", body: "현재 수준과 필요한 학습 방향을 파악합니다." },
  { step: "03", title: "선생님 매칭", body: "학생에게 맞는 수업 방식과 선생님을 조율합니다." },
  { step: "04", title: "수업 시작", body: "학생별 계획에 맞춰 1:1 수업을 진행합니다." },
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
  const featuredProvinces = provinces.filter((p) => p.children.length > 0);

  const searchTargets = [
    ...regions.map((r) => ({ label: r.name, href: getRegionUrl(r.slug) })),
    ...schools.map((s) => ({ label: s.name, href: `/school/${s.slug}` })),
  ];

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <Hero />

      {/* QUICK SEARCH */}
      <section className="bg-brand-light">
        <div className="container-page py-14 md:py-16 flex flex-col items-center gap-6 text-center">
          <SectionHeader
            title="우리 동네 과외를 찾아보세요"
            description="지역이나 학교를 검색하면 관련 과목과 학년별 과외 정보를 확인할 수 있습니다."
          />
          <SearchBox targets={searchTargets} />
          <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-3xl">
            {provinces.map((p) => (
              <Link
                key={p.slug}
                href={`/region/${p.slug}`}
                className="rounded-full bg-white border border-border-subtle px-4 py-2 text-sm text-text-main hover:border-brand hover:text-brand transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY — editorial layout, not uniform boxes */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader
          eyebrow="WHY US"
          title={"같은 1시간이라도\n학생에게 맞는 수업은 다릅니다"}
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {whyItems.map((item) => (
            <div key={item.num} className="relative flex gap-5">
              <span
                aria-hidden="true"
                className="text-5xl font-extrabold text-brand-light leading-none shrink-0 select-none tabular-nums"
              >
                {item.num}
              </span>
              <div className="pt-1.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-light text-brand mb-3">
                  <item.icon className="w-4 h-4" />
                </span>
                <p className="font-bold text-navy text-lg">{item.title}</p>
                <p className="mt-1.5 text-[15px] text-text-muted leading-relaxed max-w-sm">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
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
                  className="group flex items-center gap-4 py-5 px-2 -mx-2 rounded-lg hover:bg-brand-light/40 transition-colors"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy">{s.name}과외</p>
                    <p className="text-sm text-text-muted truncate">{s.shortDescription}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
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

      {/* VISIT VS ONLINE */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-16 md:py-20">
          <SectionHeader title={"학생에게 편한 방식으로\n수업할 수 있습니다"} />
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <LessonTypeCard
              icon={HomeIcon}
              title="방문과외"
              description="선생님이 학생의 집으로 방문해 수업합니다."
              benefits={[
                "집에서 안정적으로 수업",
                "학생 교재와 학습 환경 직접 확인",
                "학부모와 수업 전후 소통 가능",
                "이동 시간을 줄이고 규칙적인 학습 가능",
              ]}
              ctaLabel="방문과외 알아보기"
              ctaHref="/lesson/visit"
            />
            <LessonTypeCard
              icon={Video}
              title="화상과외"
              description="화상 프로그램을 통해 실시간으로 수업합니다."
              benefits={[
                "전국 어디서든 수업 가능",
                "지역과 관계없이 선생님 선택 가능",
                "화면 공유를 활용한 실시간 수업",
                "일정 조율이 상대적으로 유연",
              ]}
              ctaLabel="화상과외 알아보기"
              ctaHref="/lesson/online"
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader eyebrow="HOW IT WORKS" title={"상담부터 수업 시작까지\n어렵지 않습니다"} />
        <div className="mt-10">
          <StepFlow steps={processSteps} />
        </div>
      </section>

      {/* PROBLEM BASED */}
      <section className="bg-navy">
        <div className="container-page py-16 md:py-20">
          <SectionHeader
            title={"혹시 이런 고민 때문에\n과외를 찾고 계신가요?"}
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemItems.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-5"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white shrink-0">
                  <item.icon className="w-4 h-4" />
                </span>
                <p className="text-sm text-white/90 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-white/70 text-sm">
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

      {/* CASE STUDIES */}
      <section className="container-page py-16 md:py-20">
        <SectionHeader title={"수업은 학생마다\n이렇게 다르게 설계됩니다"} />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((c) => (
            <CaseStudyCard key={c.id} caseStudy={c} />
          ))}
        </div>
      </section>

      {/* REGION */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-16 md:py-20">
          <SectionHeader title={"전국 어디에서든\n1:1 과외를 상담할 수 있습니다"} />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {provinces.map((p) => (
              <Link
                key={p.slug}
                href={`/region/${p.slug}`}
                className="rounded-full border border-border-subtle px-4 py-2 text-sm text-text-main hover:border-brand hover:text-brand transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {featuredProvinces.map((p) => (
              <RegionCard key={p.slug} region={p} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <TextLink href="/regions">전체 지역 보기</TextLink>
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
