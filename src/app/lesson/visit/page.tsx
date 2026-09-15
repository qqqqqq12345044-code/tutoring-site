import Link from "next/link";
import {
  Home as HomeIcon,
  Users,
  BookOpen,
  Clock,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import ChecklistPanel from "@/components/ui/ChecklistPanel";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { subjects } from "@/data/subjects";

export const metadata = buildMetadata({
  title: "방문과외 | 집에서 받는 1:1 맞춤 수업",
  description: "선생님이 직접 방문해 학생의 학습 환경에 맞춰 진행하는 1:1 방문과외를 상담해보세요.",
  path: "/lesson/visit",
});

const benefits = [
  { icon: HomeIcon, title: "안정적인 학습 환경", body: "익숙한 공간에서 집중력을 유지하며 수업할 수 있습니다." },
  { icon: BookOpen, title: "학습 환경 직접 확인", body: "선생님이 학생의 교재와 학습 습관을 직접 살펴봅니다." },
  { icon: Users, title: "학부모와의 소통", body: "수업 전후로 학생의 상태를 학부모와 편하게 나눌 수 있습니다." },
  { icon: Clock, title: "규칙적인 학습 루틴", body: "이동 시간을 줄이고 정해진 시간에 꾸준히 학습합니다." },
];

const checkSteps = ["희망 지역 확인", "과목 및 학년 확인", "일정 조율"];

const fitPoints = [
  "이동 시간 없이 익숙한 공간에서 집중하고 싶은 학생",
  "선생님이 학습 환경과 교재를 직접 봐주기를 원하는 경우",
  "학부모가 수업 전후로 학생 상태를 확인하고 싶은 경우",
  "정해진 시간에 규칙적으로 수업하는 루틴이 필요한 경우",
];

export default function VisitLessonPage() {
  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-10 md:py-14 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="flex flex-col gap-5">
            <Breadcrumb items={[{ name: "방문과외", href: "/lesson/visit" }]} />
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
              학생의 공간에서 진행하는
              <br className="hidden sm:block" /> 1:1 방문과외
            </h1>
            <p className="text-text-main/80 leading-relaxed">
              선생님이 학생의 집으로 방문해 익숙한 환경에서 수업을 진행합니다. 학습 환경과 교재를
              직접 확인하며 학생에게 맞는 방식으로 수업을 이어갑니다.
            </p>
            <div className="pt-1">
              <PrimaryButton href="/consult" size="lg">
                방문과외 상담받기
              </PrimaryButton>
            </div>
          </div>

          <div className="rounded-3xl bg-brand-light p-6 md:p-8">
            <div className="rounded-2xl bg-white shadow-sm border border-border-subtle p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-navy">방문과외 진행 체크</p>
                <span className="rounded-full bg-navy text-white text-xs font-bold px-2.5 py-1">
                  1:1 방문
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {checkSteps.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-sm text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="h-px bg-border-subtle" />
              <div className="flex items-center justify-between text-center">
                <FlowStep icon={MapPin} label="학생 집 방문" />
                <span className="text-border-subtle">→</span>
                <FlowStep icon={BookOpen} label="교재 확인" />
                <span className="text-border-subtle">→</span>
                <FlowStep icon={ClipboardCheck} label="1:1 수업" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LESSON TYPE SWITCHER */}
      <section className="container-page pt-8 md:pt-10">
        <div className="grid sm:grid-cols-2 gap-3 rounded-2xl border border-border-subtle bg-white p-2 max-w-xl">
          <div className="rounded-xl bg-navy px-5 py-4">
            <p className="text-sm font-bold text-white">방문과외</p>
            <p className="mt-1 text-xs text-white/70">지금 보고 계신 수업 방식</p>
          </div>
          <Link
            href="/lesson/online"
            className="rounded-xl px-5 py-4 hover:bg-brand-light transition-colors"
          >
            <p className="text-sm font-bold text-navy">화상과외</p>
            <p className="mt-1 text-xs text-text-muted">전국 어디서든 실시간 수업</p>
          </Link>
        </div>
      </section>

      {/* BENEFITS — 2-column feature layout */}
      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title="방문과외의 장점" />
        <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light text-brand shrink-0">
                <b.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-navy">{b.title}</p>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT FITS */}
      <section className="bg-white border-y border-border-subtle">
        <div className="container-page py-14 md:py-16">
          <SectionHeader align="left" title="방문과외는 이런 학생에게 잘 맞습니다" />
          <div className="mt-8">
            <ChecklistPanel items={fitPoints} />
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <ConsultCTA title="방문과외 가능 여부를 확인해보세요" description="지역과 과목을 알려주시면 확인해드립니다." />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <RelatedLinks
          title="과목별 과외"
          links={subjects.map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
      </section>
    </>
  );
}

function FlowStep({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-light text-brand">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-xs font-medium text-text-muted">{label}</span>
    </div>
  );
}
