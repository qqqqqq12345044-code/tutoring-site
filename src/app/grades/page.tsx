import { grades } from "@/data/grades";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GradeCard from "@/components/GradeCard";

export const metadata = buildMetadata({
  title: "학년별 과외 | 초등·중등·고등",
  description: "초등, 중등, 고등 학년별 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
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
      <h2 className="sr-only">학년 목록</h2>
      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {grades.map((g) => (
          <GradeCard key={g.slug} grade={g} />
        ))}
      </div>
    </section>
  );
}
