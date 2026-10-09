import Link from "next/link";
import { guideCategories, getArticlesByCategory } from "@/data/guide";
import { buildMetadata } from "@/lib/metadata";
import { motifForGuideCategory } from "@/lib/thumbnails";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StudyThumbnail from "@/components/StudyThumbnail";

export const metadata = buildMetadata({
  title: "학습가이드 | 공부법·학습 전략·시험 대비",
  description:
    "초등·중등·고등 학년별 공부법, 국영수사과 과목별 공부법, 오답노트·계획표 같은 학습 전략과 시험·수행평가 대비, 논술·코딩·검정고시 준비 방법을 정리했습니다.",
  path: "/guide",
  image: "guide",
});

export default function GuidePage() {
  // Only categories that actually have articles get a section / chip.
  const sections = guideCategories
    .map((c) => ({ category: c, articles: getArticlesByCategory(c.slug) }))
    .filter((s) => s.articles.length > 0);

  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "학습가이드", href: "/guide" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">학습가이드</h1>
      <p className="mt-2 text-text-muted text-sm md:text-base">
        학년별·과목별 공부법과 학습 전략, 시험 대비 방법을 확인해보세요.
      </p>

      <nav aria-label="학습가이드 분류" className="mt-8 flex flex-wrap gap-2">
        {sections.map(({ category, articles }) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            className="rounded-full border border-border-subtle bg-white px-4 py-2 text-sm text-text-main hover:border-brand hover:text-brand transition-colors"
          >
            {category.name} <span className="text-text-muted">{articles.length}</span>
          </a>
        ))}
      </nav>

      {sections.map(({ category, articles }) => (
        <section key={category.slug} id={category.slug} className="mt-12 scroll-mt-24">
          <h2 className="text-lg md:text-xl font-bold text-navy">{category.name}</h2>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/guide/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white transition-all duration-300 ease-out hover:border-brand hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <StudyThumbnail motif={motifForGuideCategory(a.categorySlug)} />
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="font-bold text-navy leading-snug">{a.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
