import Link from "next/link";
import { ArrowRight, BookOpen, Languages, Calculator, Landmark, FlaskConical } from "lucide-react";
import type { Subject } from "@/data/subjects";
import { levelStyle } from "@/lib/levelStyle";

export const subjectIcons: Record<string, typeof BookOpen> = {
  korean: BookOpen,
  english: Languages,
  math: Calculator,
  social: Landmark,
  science: FlaskConical,
};

/**
 * Subject card for /subjects. Shows what the subject page actually covers (topic chips + 학교급별 방향 from
 * src/data/subjects.ts) so the list reads as a structured overview rather than a plain text list.
 */
export default function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = subjectIcons[subject.slug] ?? BookOpen;

  return (
    <Link
      href={`/subject/${subject.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white transition-all duration-300 ease-out hover:border-brand hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
    >
      <div className="flex items-center gap-4 border-b border-border-subtle bg-bg-app px-6 py-5">
        <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-navy text-white">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-black text-navy">{subject.name}과외</h3>
          <p className="mt-0.5 text-sm text-text-main/80 leading-snug break-keep">{subject.shortDescription}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-6 py-5">
        <div>
          <p className="text-xs font-bold text-text-muted">이런 내용을 학습합니다</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {subject.topics.map((t) => (
              <li key={t.slug} className="rounded-full border border-border-subtle px-2.5 py-1 text-[13px] font-semibold text-text-main">
                {t.title}
              </li>
            ))}
          </ul>
        </div>

        <ul className="divide-y divide-border-subtle border-y border-border-subtle">
          {subject.gradeStrategies.map((gs) => {
            const ls = levelStyle(gs.grade);
            return (
              <li key={gs.grade} className="flex items-start gap-3 py-2.5">
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-black text-white ${ls.solid}`}>{gs.grade}</span>
                <span className="text-[13px] leading-relaxed text-text-main/85 break-keep">{gs.description}</span>
              </li>
            );
          })}
        </ul>

        <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
          {subject.name}과외 자세히 보기
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
