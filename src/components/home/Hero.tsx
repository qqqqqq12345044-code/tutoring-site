import { CheckCircle2, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";

export interface HeroStat {
  value: string;
  label: string;
}

/**
 * Home hero. Leads with trust (how lessons are designed + what the site is built on) instead of a promotion.
 * Every number shown comes from the site's own data (passed in from the page), never a made-up claim —
 * no satisfaction rates, teacher counts or reviews are stated because none are verified.
 */
export default function Hero({ stats }: { stats: HeroStat[] }) {
  return (
    <section className="bg-white border-b border-border-subtle" data-analytics-location="hero">
      <div className="container-page py-12 md:py-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold text-brand">
            {siteConfig.tagline}
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-extrabold text-navy leading-[1.3] whitespace-pre-line">
            {"우리 아이 수업을\n먼저 진단하고 설계합니다"}
          </h1>
          <p className="text-text-main text-base md:text-lg leading-relaxed">
            학생의 현재 수준과 학교 시험 방식을 먼저 확인한 뒤, 국어·영어·수학·사회·과학 1:1 수업을 방문·화상으로
            연결합니다.
          </p>

          <ul className="flex flex-col gap-2.5 pt-1">
            {[
              "수업 전 학생의 현재 수준과 막히는 부분부터 확인합니다",
              "학교알리미·NEIS 공식 자료로 학교별 평가 방식과 일정을 확인합니다",
              "수업 후에도 학습 상태와 다음 계획을 꾸준히 점검합니다",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px] md:text-base font-semibold text-navy">
                <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <PrimaryButton href="/consult" size="lg">
              무료 과외 상담받기
            </PrimaryButton>
            <PrimaryButton href="/regions" variant="outline" size="lg">
              지역·학교별 과외 찾기
            </PrimaryButton>
          </div>
          <p className="text-sm text-text-muted">
            상담만 받아도 괜찮습니다. 학년과 고민부터 편하게 알려주세요.
          </p>
        </div>

        <div className="rounded-3xl bg-navy p-6 md:p-8 text-white">
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="w-5 h-5 text-sky-300" aria-hidden="true" />
            교과설계소가 정리한 공식 자료
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15">
            {stats.map((s) => (
              <div key={s.label} className="bg-navy px-4 py-5 md:px-5 md:py-6">
                <dt className="text-sm font-semibold text-white/85">{s.label}</dt>
                <dd className="mt-1.5 text-3xl md:text-4xl font-extrabold tabular-nums text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-white/85">
            학교별 안내는 학교알리미 정보공시(평가계획)와 NEIS 교육정보 개방 포털의 공식 기록을 직접 확인해 만들고,
            근거가 된 원문 출처를 학년·과목별 안내 페이지에 함께 표시합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
