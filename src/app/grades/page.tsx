import Link from "next/link";
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
      <p className="mt-2 text-text-muted text-sm md:text-base">
        학년이 달라지면 공부 방법도 달라져야 합니다. 학년에 맞는 학습 전략을 확인해보세요.
      </p>
      <h2 className="sr-only">학교급 목록</h2>
      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {grades.map((g) => (
          <GradeCard key={g.slug} grade={g} />
        ))}
      </div>

      <h2 className="mt-14 text-xl md:text-2xl font-bold text-navy">학년별로 자세히 보기</h2>
      <div className="mt-6 grid sm:grid-cols-3 gap-5">
        {grades.map((g) => (
          <div key={g.slug} className="rounded-2xl border border-border-subtle bg-white p-6">
            <p className="font-bold text-navy">{g.label}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {g.subGrades.map((sg) => {
                const label = `${subGradeFullLabel(g.slug, sg.slug)} 과외`;
                // Only link sub-grade pages that are indexed (published content); others show as plain text.
                const linked = getIndexability("sub-grade", { gradeSlug: g.slug, subGradeSlug: sg.slug }).index;
                return (
                  <li key={sg.slug} className="text-sm">
                    {linked ? (
                      <Link href={`/grade/${g.slug}/${sg.slug}`} className="text-text-main hover:text-brand transition-colors">
                        {label}
                      </Link>
                    ) : (
                      <span className="text-text-muted">{label}</span>
                    )}
                    <span className="block text-xs text-text-muted">{sg.note}</span>
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
