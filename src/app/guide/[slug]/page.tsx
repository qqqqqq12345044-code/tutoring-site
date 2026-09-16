import { notFound } from "next/navigation";
import {
  guideArticles,
  guideCategories,
  getGuideArticleBySlug,
  getRelatedGradeSlug,
  getRelatedSubjectSlug,
} from "@/data/guide";
import { getGradeBySlug } from "@/data/grades";
import { getSubjectBySlug } from "@/data/subjects";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";

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
  });
}

export default async function GuideArticlePage(props: PageProps<"/guide/[slug]">) {
  const { slug } = await props.params;
  const article = getGuideArticleBySlug(slug);
  if (!article) notFound();

  const category = guideCategories.find((c) => c.slug === article.categorySlug);
  const relatedGrade = getGradeBySlug(getRelatedGradeSlug(article.categorySlug) ?? "");
  const relatedSubject = getSubjectBySlug(getRelatedSubjectSlug(article.categorySlug) ?? "");
  const relatedLinks = [
    ...(relatedGrade ? [{ label: `${relatedGrade.name}과외`, href: `/grade/${relatedGrade.slug}` }] : []),
    ...(relatedSubject ? [{ label: `${relatedSubject.name}과외`, href: `/subject/${relatedSubject.slug}` }] : []),
    ...(article.categorySlug === "choosing-tutor"
      ? [
          { label: "방문과외 알아보기", href: "/lesson/visit" },
          { label: "화상과외 알아보기", href: "/lesson/online" },
        ]
      : []),
  ];

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
      <div className="mt-6 flex flex-col gap-4">
        {article.body.map((p) => (
          <p key={p} className="text-text-main leading-relaxed">
            {p}
          </p>
        ))}
      </div>
      {relatedLinks.length > 0 && (
        <div className="mt-10">
          <RelatedLinks title="관련 페이지" links={relatedLinks} />
        </div>
      )}

      <div className="mt-10">
        <ConsultCTA title="더 궁금한 점이 있다면 상담해보세요" />
      </div>
    </article>
  );
}
