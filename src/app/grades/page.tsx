import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { grades, subGradeFullLabel } from "@/data/grades";
import { buildMetadata } from "@/lib/metadata";
import { getIndexability } from "@/lib/indexability";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GradeCard from "@/components/GradeCard";

export const metadata = buildMetadata({
  title: "학년별 과외 | 초등 1학년부터 고등 3학년까지",
  description: "초등학교 1학년부터 고등학교 3학년까지, 학년별로 달라지는 학습 포인트와 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
  path: "/grades",
});

export default function GradesPage() {
  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "학년별 과외", href: "/grades" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">학년별 과외</h1>
      <p className="mt-2 text-text-main text-[15px] md:text-base">
        학년이 달라지면 공부 방법도 달라져야 합니다. 학년에 맞는 학습 전략을 확인해보세요.
      </p>
      <h2 className="sr-only">학교급 목록</h2>
      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {grades.map((g) => (
          <GradeCard key={g.slug} grade={g} />
        ))}
      </div>

      <h2 className="mt-16 text-xl md:text-2xl font-extrabold text-navy">학년별로 자세히 보기</h2>
      <p className="mt-2 text-[15px] text-text-main">학년을 고르면 그 시기에 맞는 학습 포인트와 과외 안내를 볼 수 있습니다.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {grades.map((g) => (
          <div key={g.slug} className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-navy px-6 py-4">
              <p className="text-lg font-extrabold text-white">{g.label}</p>
              <Link href={`/grade/${g.slug}`} className="text-sm font-bold text-sky-200 hover:text-white">
                {g.name}과외 전체 →
              </Link>
            </div>
            <ul className="divide-y divide-border-subtle">
              {g.subGrades.map((sg) => {
                const label = `${subGradeFullLabel(g.slug, sg.slug)} 과외`;
                // Only link sub-grade pages that are indexed (published content); others show as plain text.
                const linked = getIndexability("sub-grade", { gradeSlug: g.slug, subGradeSlug: sg.slug }).index;
                const inner = (
                  <>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-[15px] font-bold ${linked ? "text-navy group-hover:text-brand" : "text-text-main"}`}>
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm text-text-muted leading-relaxed">{sg.note}</span>
                    </span>
                    {linked && <ChevronRight className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />}
                  </>
                );
                return (
                  <li key={sg.slug}>
                    {linked ? (
                      <Link
                        href={`/grade/${g.slug}/${sg.slug}`}
                        className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-brand-light/60"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-6 py-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
