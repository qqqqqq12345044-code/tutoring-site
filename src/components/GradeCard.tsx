import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Grade } from "@/data/grades";
import { levelStyle } from "@/lib/levelStyle";

export default function GradeCard({ grade }: { grade: Grade }) {
  const ls = levelStyle(grade.slug);
  return (
    <Link
      href={`/grade/${grade.slug}`}
      className={`group flex flex-col gap-4 rounded-2xl border border-border-subtle border-t-4 ${ls.top} bg-white p-7 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none`}
    >
      <span className={`text-3xl font-black tracking-tight ${ls.text}`}>{grade.name}</span>
      <div>
        <h3 className="text-lg font-extrabold text-navy">{grade.label} 과외</h3>
        <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{grade.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {grade.keywords.map((k) => (
          <span key={k} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ls.soft} ${ls.text}`}>
            {k}
          </span>
        ))}
      </div>
      <span className={`mt-auto inline-flex items-center gap-1 text-sm font-bold ${ls.text}`}>
        {grade.name}과외 확인하기
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
