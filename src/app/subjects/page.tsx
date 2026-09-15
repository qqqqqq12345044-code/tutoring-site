import { subjects } from "@/data/subjects";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SubjectCard from "@/components/SubjectCard";

export const metadata = buildMetadata({
  title: "과목별 과외 | 국어·영어·수학·사회·과학",
  description: "국어, 영어, 수학, 사회, 과학 과목별 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
  path: "/subjects",
});

export default function SubjectsPage() {
  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "과목별 과외", href: "/subjects" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">과목별 과외</h1>
      <p className="mt-2 text-text-muted text-sm md:text-base">
        국어·영어·수학·사회·과학, 필요한 과목부터 1:1로 시작해보세요.
      </p>
      <h2 className="sr-only">과목 목록</h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((s) => (
          <SubjectCard key={s.slug} subject={s} />
        ))}
      </div>
    </section>
  );
}
