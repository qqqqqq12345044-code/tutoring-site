import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Grade } from "@/data/grades";

export default function GradeCard({ grade }: { grade: Grade }) {
  return (
    <Link
      href={`/grade/${grade.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-7 hover:border-brand hover:shadow-md transition-all"
    >
      <span
        aria-hidden="true"
        className="text-3xl font-extrabold text-navy/10 group-hover:text-brand/20 transition-colors"
      >
        {grade.name}
      </span>
      <div>
        <h3 className="text-lg font-bold text-navy">{grade.label} 과외</h3>
        <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{grade.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {grade.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand"
          >
            {k}
          </span>
        ))}
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">
        {grade.name}과외 확인하기
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
