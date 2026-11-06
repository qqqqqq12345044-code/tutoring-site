import Link from "next/link";
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

  // Reading time from the article's own text (Korean ≈ 500자/분), rounded up.
  const charCount = [...article.body, ...article.sections.flatMap((x) => [x.heading, ...x.paragraphs])].join("").length;
  const readMinutes = Math.max(1, Math.ceil(charCount / 500));
  const fmt = (d: string) => d.replaceAll("-", ".");
  // Next reads: same-category first, then the list order — shown as cards.
  const nextReads = [
    ...guideArticles.filter((a) => a.categorySlug === article.categorySlug && a.slug !== article.slug),
    ...guideArticles.slice(idx + 1),
    ...guideArticles.slice(0, idx),
  ]
    .filter((a, i, arr) => a.slug !== article.slug && arr.findIndex((b) => b.slug === a.slug) === i)
    .slice(0, 3);

  return (
    <article className="container-page py-10 md:py-14 max-w-3xl">
      <Breadcrumb
        items={[
          { name: "학습가이드", href: "/guide" },
          { name: article.title, href: `/guide/${article.slug}` },
        ]}
      />
      {category && (
        <Link
          href={`/guide#${category.slug}`}
          className="mt-5 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white hover:bg-navy"
        >
          {category.name}
        </Link>
      )}
      <h1 className="mt-3 text-2xl md:text-[2.1rem] font-extrabold text-navy leading-snug break-keep">{article.title}</h1>
      <p className="mt-4 text-base md:text-lg leading-relaxed text-text-main break-keep">{article.excerpt}</p>
      <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-muted">
        <div className="flex gap-1.5"><dt className="font-semibold">게시</dt><dd>{fmt(article.publishedAt)}</dd></div>
        {article.updatedAt && article.updatedAt !== article.publishedAt && (
          <div className="flex gap-1.5"><dt className="font-semibold">수정</dt><dd>{fmt(article.updatedAt)}</dd></div>
        )}
        <div className="flex gap-1.5"><dt className="font-semibold">읽는 시간</dt><dd>약 {readMinutes}분</dd></div>
        {(article.sources?.length ?? 0) > 0 && (
          <div className="flex gap-1.5"><dt className="font-semibold">출처</dt><dd>공식 자료 {article.sources!.length}건</dd></div>
        )}
      </dl>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle">
        <StudyThumbnail motif={motifForGuideCategory(article.categorySlug)} />
      </div>

      {article.sections.length > 1 && (
        <nav aria-label="목차" className="mt-8 rounded-2xl border border-border-subtle bg-white p-6">
          <p className="text-sm font-extrabold text-navy">이 글의 목차</p>
          <ol className="mt-3 divide-y divide-border-subtle">
            {article.sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#s${i + 1}`} className="flex gap-3 py-2.5 text-[15px] font-semibold text-text-main hover:text-brand">
                  <span className="w-6 shrink-0 font-black text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="break-keep">{section.heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {article.body.map((p, i) => (
          <p
            key={p}
            className={
              i === 0
                ? "rounded-2xl border-l-4 border-brand bg-brand-light/60 p-5 text-[16px] md:text-[17px] font-medium leading-relaxed text-text-main break-keep"
                : "text-[16px] md:text-[17px] text-text-main leading-[1.85] break-keep"
            }
          >
            {p}
          </p>
        ))}
      </div>
      {article.sections.map((section, i) => (
        <section key={section.heading} id={`s${i + 1}`} className="mt-12 scroll-mt-24">
          <h2 className="flex items-start gap-3 text-xl md:text-2xl font-extrabold text-navy break-keep">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-sm font-black text-white tabular-nums">
              {i + 1}
            </span>
            {section.heading}
          </h2>
          <div className="mt-4 flex flex-col gap-4 border-l-2 border-border-subtle pl-5 md:ml-4">
            {section.paragraphs.map((p) => (
              <p key={p} className="text-[16px] md:text-[17px] text-text-main leading-[1.85] break-keep">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
      <SourceList sources={article.sources} className="mt-12" />

      {nextReads.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-extrabold text-navy">다음에 읽으면 좋은 글</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {nextReads.map((a) => (
              <Link
                key={a.slug}
                href={`/guide/${a.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-border-subtle bg-white p-5 transition-all hover:border-brand hover:shadow-md"
              >
                <span className="w-fit rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand">
                  {guideCategories.find((c) => c.slug === a.categorySlug)?.name}
                </span>
                <span className="font-bold leading-snug text-navy group-hover:text-brand break-keep">{a.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
