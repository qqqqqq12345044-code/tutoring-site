import { SCHOOLINFO_PLAN_TERM } from "@/data/sources";

/**
 * Short visible note under a page's intro: what the school-specific facts are based on (학교알리미 평가계획
 * 공시 학기·시점) and that 교과설계소 is separate from the schools. Shown only on pages whose facts come from
 * schoolInfoPlanSource entries; the full per-school source list stays in SourceList at the bottom.
 */
export default function PlanBasisNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs md:text-sm text-text-muted leading-relaxed break-keep border-l-2 border-brand-light pl-3 ${className}`.trim()}>
      학교알리미 {SCHOOLINFO_PLAN_TERM.term} 평가계획({SCHOOLINFO_PLAN_TERM.disclosed}) 원문 기준입니다. 교과설계소는
      학교와 별개의 과외 서비스이며, 평가 일정은 학교 사정에 따라 바뀔 수 있습니다.
    </p>
  );
}
