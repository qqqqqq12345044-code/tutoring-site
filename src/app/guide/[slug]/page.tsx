import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { readingMinutes, formatGuideDate } from "@/lib/guideMeta";
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
        <Link
          href={`/guide#${category.slug}`}
          className="mt-5 inline-block rounded-full bg-brand-light px-3 py-1 text-sm font-bold text-brand hover:bg-brand hover:text-white transition-colors"
        >
          {category.name}
        </Link>
      )}
      <h1 className="mt-3 text-2xl md:text-[2.1rem] font-extrabold text-navy leading-snug tracking-tight">
        {article.title}
      </h1>
      <p className="mt-4 text-base md:text-lg text-text-main leading-relaxed">{article.excerpt}</p>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border-subtle py-3 text-sm font-semibold text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4" aria-hidden="true" />
          {readingMinutes(article)}분 읽기
        </span>
        <span>
          업데이트 <time dateTime={article.updatedAt}>{formatGuideDate(article.updatedAt)}</time>
        </span>
        <span>교과설계소 학습가이드</span>
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle">
        <StudyThumbnail motif={motifForGuideCategory(article.categorySlug)} />
      </div>
      <div className="mt-8 flex flex-col gap-5">
        {article.body.map((p) => (
          <p key={p} className="text-[17px] text-text-main leading-[1.85]">
            {p}
          </p>
        ))}
      </div>
      {article.sections.length > 1 && (
        <nav aria-label="이 글의 목차" className="mt-10 rounded-2xl border border-border-subtle bg-white p-6">
          <p className="text-base font-extrabold text-navy">이 글의 목차</p>
          <ol className="mt-3 flex flex-col divide-y divide-border-subtle">
            {article.sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#section-${i + 1}`} className="flex items-start gap-3 py-2.5 text-[15px] font-semibold text-text-main hover:text-brand">
                  <span className="font-black text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {article.sections.map((section, i) => (
        <section key={section.heading} id={`section-${i + 1}`} className="mt-12 scroll-mt-24">
          <h2 className="flex items-start gap-3 text-xl md:text-2xl font-extrabold text-navy leading-snug">
            <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-navy text-sm font-bold text-white tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pt-0.5">{section.heading}</span>
          </h2>
          <div className="mt-4 flex flex-col gap-5">
            {section.paragraphs.map((p) => (
              <p key={p} className="text-[17px] text-text-main leading-[1.85]">
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
