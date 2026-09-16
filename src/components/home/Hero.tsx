import { CheckCircle2, ClipboardList, UserCheck, BookOpenCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Hero() {
  return (
    <section className="bg-white border-b border-border-subtle">
      <div className="container-page py-12 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold text-brand">
            {siteConfig.tagline}
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-extrabold text-navy leading-[1.3] whitespace-pre-line">
            {"우리 아이에게 맞는\n1:1 과외를 찾아드립니다"}
          </h1>
          <p className="text-text-main/80 text-base md:text-lg leading-relaxed">
            학생의 현재 수준과 목표를 먼저 확인하고, 국어·영어·수학·사회·과학 과목에 맞는 1:1
            수업을 연결합니다.
            <br />
            방문과외와 화상과외 모두 상담 가능합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <PrimaryButton href="/consult" size="lg">
              무료 과외 상담받기
            </PrimaryButton>
            <PrimaryButton href="/regions" variant="outline" size="lg">
              지역·학교별 과외 찾기
            </PrimaryButton>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
            상담만 받아도 괜찮습니다. 학생의 학년과 고민부터 편하게 알려주세요.
          </p>
        </div>

        <div className="relative">
          <span className="hidden sm:inline-flex absolute -top-3 -right-3 z-10 items-center gap-1.5 rounded-full bg-white border border-border-subtle shadow-sm px-3.5 py-1.5 text-xs font-bold text-navy">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            상담 진행중
          </span>
          <div className="rounded-3xl bg-brand-light p-6 md:p-8">
            <div className="rounded-2xl bg-white shadow-md border border-border-subtle p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-navy">학생 프로필 카드</p>
                <span className="rounded-full bg-navy text-white text-xs font-bold px-2.5 py-1">
                  중2 · 수학
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">현재 고민</span>
                  <span className="text-text-main font-medium">함수·방정식</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">수업 목표</span>
                  <span className="text-text-main font-medium">내신 대비</span>
                </div>
              </div>
              <div className="h-px bg-border-subtle" />
              <div className="flex items-center justify-between text-center">
                <FlowStep icon={ClipboardList} label="진단" />
                <span className="text-border-subtle" aria-hidden="true">→</span>
                <FlowStep icon={UserCheck} label="선생님 매칭" />
                <span className="text-border-subtle" aria-hidden="true">→</span>
                <FlowStep icon={BookOpenCheck} label="맞춤 수업" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowStep({
  icon: Icon,
  label,
}: {
  icon: typeof ClipboardList;
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
