import type { CaseStudy } from "@/data/caseStudies";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-navy text-white text-xs font-bold px-3 py-1">
          {caseStudy.gradeLabel}
        </span>
        <span className="rounded-full bg-brand-light text-brand text-xs font-bold px-3 py-1">
          {caseStudy.subject}
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted">고민</p>
        <p className="mt-1 text-sm text-text-main leading-relaxed">{caseStudy.concern}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted">수업 방향</p>
        <p className="mt-1 text-sm text-text-main leading-relaxed">{caseStudy.approach}</p>
      </div>
      <p className="mt-auto pt-2 text-xs text-text-muted border-t border-border-subtle">
        ※ 이해를 돕기 위한 수업 설계 예시입니다.
      </p>
    </div>
  );
}
