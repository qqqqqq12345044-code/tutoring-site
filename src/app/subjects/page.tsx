import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { subjects } from "@/data/subjects";
import { programs } from "@/data/programs";
import { buildMetadata } from "@/lib/metadata";
import { motifForSlug } from "@/lib/thumbnails";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SubjectCard from "@/components/SubjectCard";
import StudyThumbnail from "@/components/StudyThumbnail";

export const metadata = buildMetadata({
  title: "과목별 과외 | 국어·영어·수학·사회·과학·논술·코딩·검정고시",
  description: "국어, 영어, 수학, 사회, 과학과 논술, 코딩, 검정고시까지 과목별 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
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

      <h2 className="mt-14 text-xl md:text-2xl font-bold text-navy">교과 외 과정</h2>
      <p className="mt-2 text-text-muted text-sm md:text-base">
        논술·코딩·검정고시처럼 학교 교과와 다른 목표를 가진 과정도 1:1로 상담할 수 있습니다.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {programs.map((p) => (
          <Link
            key={p.slug}
            href={`/program/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white transition-colors hover:border-brand"
          >
            <StudyThumbnail motif={motifForSlug(p.slug)} />
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-bold text-navy">{p.name}과외</h3>
              <p className="text-sm text-text-muted leading-relaxed">{p.shortDescription}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">
                {p.name}과외 알아보기
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
