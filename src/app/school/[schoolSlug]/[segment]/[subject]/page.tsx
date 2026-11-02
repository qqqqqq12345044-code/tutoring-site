import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { motifForSlug } from "@/lib/thumbnails";
import { getIndexability } from "@/lib/indexability";
import { allSchoolGradeRoutes, resolveSchoolGradeSubject } from "@/lib/schoolGrade";
import SchoolGradeSubjectPage from "@/components/school/SchoolGradeSubjectPage";

// /school/[schoolSlug]/[grade]/[subject] (2026-11-02 Phase 2). `segment` must be a 학년 digit with a published
// school×학년×과목 entry (src/data/schoolGradeSubjectContent.ts); a subject slug in that position or any other
// combination is 404, so no accidental school×subject×subject or 10k-national combinations exist.
export function generateStaticParams() {
  return allSchoolGradeRoutes()
    .filter((r) => r.subjectSlug)
    .map((r) => ({ schoolSlug: r.schoolSlug, segment: String(r.grade), subject: r.subjectSlug! }));
}

export async function generateMetadata(props: PageProps<"/school/[schoolSlug]/[segment]/[subject]">) {
  const { schoolSlug, segment, subject } = await props.params;
  const ctx = resolveSchoolGradeSubject(schoolSlug, segment, subject);
  if (!ctx) return {};
  const { index } = getIndexability("school-grade-subject", { schoolSlug, schoolGrade: segment, subjectSlug: subject });
  return buildMetadata({
    title: `${ctx.school.name} ${ctx.grade}학년 ${ctx.subject.name}과외 · 시험 대비`,
    description: ctx.content.intro,
    path: `/school/${schoolSlug}/${segment}/${subject}`,
    image: motifForSlug(ctx.subject.slug),
    robots: { index, follow: true },
  });
}

export default async function Page(props: PageProps<"/school/[schoolSlug]/[segment]/[subject]">) {
  const { schoolSlug, segment, subject } = await props.params;
  const ctx = resolveSchoolGradeSubject(schoolSlug, segment, subject);
  if (!ctx) notFound();
  return <SchoolGradeSubjectPage ctx={ctx} />;
}
