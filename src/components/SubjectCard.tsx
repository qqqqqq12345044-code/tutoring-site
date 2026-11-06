import Link from "next/link";
import { ArrowRight, BookOpen, Languages, Calculator, Landmark, FlaskConical } from "lucide-react";
import type { Subject } from "@/data/subjects";

export const subjectIcons: Record<string, typeof BookOpen> = {
  korean: BookOpen,
  english: Languages,
  math: Calculator,
  social: Landmark,
  science: FlaskConical,
};

export default function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = subjectIcons[subject.slug] ?? BookOpen;

  return (
    <Link
      href={`/subject/${subject.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-6 transition-all duration-300 ease-out hover:border-brand hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-navy text-white group-hover:bg-brand transition-colors">
          <Icon className="w-6 h-6" />
        </span>
        <h3 className="text-xl font-extrabold text-navy">{subject.name}과외</h3>
      </div>
      <p className="text-[15px] text-text-main leading-relaxed">{subject.shortDescription}</p>
      {subject.topics.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 border-t border-border-subtle pt-4">
          {subject.topics.slice(0, 6).map((t) => (
            <li key={t.slug} className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand">
              {t.title}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
        {subject.name}과외 알아보기
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
