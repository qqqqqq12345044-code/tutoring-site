import Link from "next/link";
import { Clock } from "lucide-react";
import type { GuideArticle } from "@/data/guide";
import { guideCategories } from "@/data/guide";
import { motifForGuideCategory } from "@/lib/thumbnails";
import { readingMinutes, formatGuideDate } from "@/lib/guideMeta";
import StudyThumbnail from "@/components/StudyThumbnail";

/** Magazine-style guide card: category badge, bold title, excerpt and reading meta. */
export default function GuideCard({
  article,
  featured = false,
  headingAs: Heading = "h3",
}: {
  article: GuideArticle;
  featured?: boolean;
  headingAs?: "h2" | "h3" | "h4";
}) {
  const category = guideCategories.find((c) => c.slug === article.categorySlug);
  return (
    <Link
      href={`/guide/${article.slug}`}
      className={`group flex overflow-hidden rounded-2xl border border-border-subtle bg-white transition-all duration-300 ease-out hover:border-brand hover:shadow-lg motion-reduce:transition-none ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div className={featured ? "md:w-1/2 shrink-0" : ""}>
        <StudyThumbnail motif={motifForGuideCategory(article.categorySlug)} />
      </div>
      <div className={`flex flex-1 flex-col gap-2.5 ${featured ? "p-6 md:p-8 justify-center" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-2">
          {featured && <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-white">최신 글</span>}
          {category && (
            <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand">{category.name}</span>
          )}
        </div>
        <Heading
          className={`font-extrabold text-navy leading-snug group-hover:text-brand transition-colors ${
            featured ? "text-xl md:text-2xl" : "text-[17px]"
          }`}
        >
          {article.title}
        </Heading>
        <p className={`text-text-main leading-relaxed ${featured ? "text-[15px] md:text-base" : "text-sm line-clamp-3"}`}>
          {article.excerpt}
        </p>
        <p className="mt-auto flex items-center gap-3 pt-2 text-xs font-semibold text-text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {readingMinutes(article)}분 읽기
          </span>
          <span>{formatGuideDate(article.updatedAt)}</span>
        </p>
      </div>
    </Link>
  );
}
