import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { levelStyle } from "@/lib/levelStyle";
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

      <h2 className="mt-16 text-xl md:text-2xl font-extrabold text-navy">학년별로 자세히 보기</h2>
      <p className="mt-2 text-sm md:text-base text-text-muted">학년을 누르면 그 학년의 학습 포인트와 과목별 안내를 볼 수 있습니다.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {grades.map((g) => {
          const ls = levelStyle(g.slug);
          return (
            <div key={g.slug} className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
              <div className={`flex items-center justify-between px-6 py-4 ${ls.solid}`}>
                <p className="text-lg font-black text-white">{g.label}</p>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                  {g.subGrades.length}개 학년
                </span>
              </div>
              <ul className="divide-y divide-border-subtle">
                {g.subGrades.map((sg) => {
                  const label = `${subGradeFullLabel(g.slug, sg.slug)} 과외`;
                  // Only link sub-grade pages that are indexed (published content); others show as plain text.
                  const linked = getIndexability("sub-grade", { gradeSlug: g.slug, subGradeSlug: sg.slug }).index;
                  const row = (
                    <>
                      <span
                        className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-xl text-sm font-black ${ls.soft} ${ls.text}`}
                      >
                        {sg.label}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[15px] font-bold ${linked ? "text-navy" : "text-text-main"}`}>{label}</span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-text-muted">{sg.note}</span>
                      </span>
                      {linked && <ChevronRight className={`w-4 h-4 shrink-0 ${ls.text}`} aria-hidden="true" />}
                    </>
                  );
                  return (
                    <li key={sg.slug}>
                      {linked ? (
                        <Link
                          href={`/grade/${g.slug}/${sg.slug}`}
                          className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-bg-app"
                        >
                          {row}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3.5 px-5 py-4">{row}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
