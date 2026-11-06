import Link from "next/link";
import { CheckCircle2, FileText, School, BookOpen, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getTrustStats, formatCount } from "@/lib/trustStats";

/**
 * Home hero. Leads with what the site verifiably does (학교 공식 평가계획을 읽고 정리) instead of a promotion,
 * so a parent's first impression is "these people read my child's school documents". Numbers come from
 * getTrustStats() (counted from published data), never typed by hand.
 */
export default function Hero() {
  const stats = getTrustStats();
  const items = [
    {
      icon: School,
      value: `${formatCount(stats.planSchools)}개 학교`,
      label: "학교알리미 평가계획 원문을 직접 읽고 정리",
    },
    {
      icon: FileText,
      value: `${formatCount(stats.planPages)}개`,
      label: "학교·학년·과목별 평가 안내 페이지",
    },
    {
      icon: BookOpen,
      value: `${formatCount(stats.guides)}편`,
      label: "학년별·과목별 학습가이드",
    },
  ];

  return (
    <section className="bg-white border-b border-border-subtle" data-analytics-location="hero">
      <div className="container-page py-12 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold text-brand">
            {siteConfig.tagline}
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-extrabold text-navy leading-[1.3] whitespace-pre-line">
            {"학교 시험을 먼저 이해하고\n1:1 수업을 설계합니다"}
          </h1>
          <p className="text-text-main text-base md:text-lg leading-relaxed break-keep">
            교과설계소는 학교알리미에 공시된 학교별 평가계획을 직접 읽고 학교·학년·과목별로 정리합니다. 이 정보를
            바탕으로 학생의 현재 수준과 목표에 맞는 국어·영어·수학·사회·과학 1:1 수업을 상담해드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <PrimaryButton href="/consult" size="lg">
              무료 과외 상담받기
            </PrimaryButton>
            <PrimaryButton href="/schools" variant="outline" size="lg">
              우리 학교 평가 안내 보기
            </PrimaryButton>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
            상담만 받아도 괜찮습니다. 학생의 학년과 고민부터 편하게 알려주세요.
          </p>
        </div>

        <div className="rounded-3xl bg-navy p-6 md:p-8 text-white">
          <p className="text-sm font-bold text-blue-200">공식 자료로 확인한 정보</p>
          <p className="mt-2 text-xl md:text-2xl font-extrabold leading-snug">
            추측이 아니라 학교가 공개한
            <br />
            원문을 기준으로 안내합니다
          </p>
          <ul className="mt-6 divide-y divide-white/15 border-y border-white/15">
            {items.map((item) => (
              <li key={item.label} className="flex items-center gap-4 py-4">
                <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-white/10 text-white">
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-2xl font-black tabular-nums">{item.value}</p>
                  <p className="text-sm text-white/85">{item.label}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-white/75 break-keep">
            기준: 학교알리미 {stats.planTerm.term} 평가계획({stats.planTerm.disclosed}) · NEIS 학교기본정보. 교과설계소는
            학교와 별개의 과외 서비스입니다.
          </p>
          <Link
            href="/schools"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white hover:underline"
          >
            학교별 평가 안내 둘러보기
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
