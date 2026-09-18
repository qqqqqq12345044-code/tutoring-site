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
      <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light text-brand">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <h3 className="text-lg font-bold text-navy">{subject.name}</h3>
        <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{subject.shortDescription}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">
        {subject.name}과외 알아보기
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
