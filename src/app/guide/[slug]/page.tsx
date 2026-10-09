import { notFound } from "next/navigation";
import {
  guideArticles,
  guideCategories,
  getGuideArticleBySlug,
  getRelatedGradeSlug,
  getRelatedSubjectSlug,
  getRelatedProgramSlug,
} from "@/data/guide";
import { getProgramBySlug } from "@/data/programs";
import { getGradeBySlug } from "@/data/grades";
import { getSubjectBySlug } from "@/data/subjects";
import { buildMetadata } from "@/lib/metadata";
import { motifForGuideCategory } from "@/lib/thumbnails";
import { indexedSubGradeLinks, indexedSubjectTopicLinks } from "@/lib/internalLinks";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import SourceList from "@/components/SourceList";
import StudyThumbnail from "@/components/StudyThumbnail";

export function generateStaticParams() {
  return guideArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/guide/[slug]">) {
  const { slug } = await props.params;
  const article = getGuideArticleBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/guide/${article.slug}`,
    image: motifForGuideCategory(article.categorySlug),
  });
}

export default async function GuideArticlePage(props: PageProps<"/guide/[slug]">) {
  const { slug } = await props.params;
  const article = getGuideArticleBySlug(slug);
  if (!article) notFound();

  const category = guideCategories.find((c) => c.slug === article.categorySlug);
  const relatedGrade = getGradeBySlug(getRelatedGradeSlug(article.categorySlug) ?? "");
  const relatedSubject = getSubjectBySlug(getRelatedSubjectSlug(article.categorySlug) ?? "");
  const relatedProgram = getProgramBySlug(getRelatedProgramSlug(article.categorySlug) ?? "");
  const relatedLinks = [
    ...(relatedGrade ? [{ label: `${relatedGrade.name}과외`, href: `/grade/${relatedGrade.slug}` }] : []),
    ...(relatedSubject ? [{ label: `${relatedSubject.name}과외`, href: `/subject/${relatedSubject.slug}` }] : []),
    ...(relatedProgram ? [{ label: `${relatedProgram.name}과외`, href: `/program/${relatedProgram.slug}` }] : []),
  ];
  // Deeper indexed explainers for the same subject / school level (never noindex pages).
  const studyLinks = [
    ...(relatedSubject ? indexedSubjectTopicLinks(relatedSubject.slug) : []),
    ...(relatedGrade ? indexedSubGradeLinks(relatedGrade.slug) : []),
  ];
  // The next four guides in list order (wrapping), so every guide gets inbound links.
  const idx = guideArticles.findIndex((a) => a.slug === article.slug);
  const otherGuides = [...guideArticles.slice(idx + 1), ...guideArticles.slice(0, idx)]
    .slice(0, 4)
    .map((a) => ({ label: a.title, href: `/guide/${a.slug}` }));

  return (
    <article className="container-page py-10 md:py-14 max-w-2xl">
      <Breadcrumb
        items={[
          { name: "학습가이드", href: "/guide" },
          { name: article.title, href: `/guide/${article.slug}` },
        ]}
      />
      {category && (
        <span className="mt-4 inline-block rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">
          {category.name}
        </span>
      )}
      <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-navy leading-snug">
        {article.title}
      </h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle">
        <StudyThumbnail motif={motifForGuideCategory(article.categorySlug)} />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {article.body.map((p) => (
          <p key={p} className="text-text-main leading-relaxed">
            {p}
          </p>
        ))}
      </div>
      {article.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-lg md:text-xl font-bold text-navy">{section.heading}</h2>
          <div className="mt-3 flex flex-col gap-4">
            {section.paragraphs.map((p) => (
              <p key={p} className="text-text-main leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
      <SourceList sources={article.sources} className="mt-10" />
      <div className="mt-10 flex flex-col gap-4">
        {relatedLinks.length > 0 && <RelatedLinks title="관련 페이지" links={relatedLinks} />}
        {studyLinks.length > 0 && <RelatedLinks title="함께 보면 좋은 학습 정보" links={studyLinks} />}
        <RelatedLinks title="다른 학습가이드" links={otherGuides} />
      </div>

      <div className="mt-10">
        <ConsultCTA title="더 궁금한 점이 있다면 상담해보세요" />
      </div>
    </article>
  );
}
