import { guideArticles, guideCategories, getArticlesByCategory } from "@/data/guide";
import { buildMetadata } from "@/lib/metadata";
import { guideCategoryGroups } from "@/lib/guideMeta";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GuideCard from "@/components/GuideCard";

export const metadata = buildMetadata({
  title: "학습가이드 | 공부법·학습 전략·시험 대비",
  description:
    "초등·중등·고등 학년별 공부법, 국영수사과 과목별 공부법, 오답노트·계획표 같은 학습 전략과 시험·수행평가 대비, 논술·코딩·검정고시 준비 방법을 정리했습니다.",
  path: "/guide",
  image: "guide",
});

export default function GuidePage() {
  const latest = [...guideArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = latest[0];
  const recent = latest.slice(1, 4);

  // Group → categories that actually have articles. Any category not covered by a group still gets shown.
  const grouped = new Set(guideCategoryGroups.flatMap((g) => g.slugs));
  const groups = [
    ...guideCategoryGroups,
    { title: "기타", description: "", slugs: guideCategories.map((c) => c.slug).filter((s) => !grouped.has(s)) },
  ]
    .map((g) => ({
      ...g,
      categories: g.slugs
        .map((slug) => ({ category: guideCategories.find((c) => c.slug === slug)!, articles: getArticlesByCategory(slug) }))
        .filter((c) => c.category && c.articles.length > 0),
    }))
    .filter((g) => g.categories.length > 0);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-10 md:py-14">
          <Breadcrumb items={[{ name: "학습가이드", href: "/guide" }]} />
          <p className="mt-6 text-xs font-bold tracking-widest text-brand">STUDY GUIDE</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy">학습가이드</h1>
          <p className="mt-3 max-w-2xl text-[15px] md:text-lg text-text-main leading-relaxed">
            학년별·과목별 공부법과 학습 전략, 시험 대비 방법을 정리했습니다. 교육과정·입시 관련 내용은 교육부 발표와
            정책브리핑 자료를 근거로 작성하고 출처를 함께 표시합니다.
          </p>
          <p className="mt-4 text-sm font-bold text-navy">
            전체 <span className="text-brand tabular-nums">{guideArticles.length}</span>편
          </p>

          {featured && (
            <div className="mt-8">
              <GuideCard article={featured} featured />
            </div>
          )}
          {recent.length > 0 && (
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((a) => (
                <GuideCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <nav
        aria-label="학습가이드 분류"
        className="sticky top-16 md:top-18 z-20 border-b border-border-subtle bg-white/95 backdrop-blur"
      >
        <div className="container-page flex gap-2 overflow-x-auto py-3">
          {groups.flatMap((g) => g.categories).map(({ category, articles }) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="shrink-0 rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-brand hover:text-brand transition-colors"
            >
              {category.name} <span className="text-brand tabular-nums">{articles.length}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="container-page py-10 md:py-14">
        {groups.map((g) => (
          <section key={g.title} className="mt-6 first:mt-0 border-t-2 border-navy pt-8 pb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy">{g.title}</h2>
            {g.description && <p className="mt-2 text-[15px] text-text-main">{g.description}</p>}
            {g.categories.map(({ category, articles }) => (
              <section key={category.slug} id={category.slug} className="mt-10 scroll-mt-36">
                <h3 className="flex items-center gap-2 border-l-4 border-brand pl-3 text-lg md:text-xl font-extrabold text-navy">
                  {category.name}
                  <span className="text-sm font-bold text-text-muted tabular-nums">{articles.length}편</span>
                </h3>
                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map((a) => (
                    <GuideCard key={a.slug} article={a} headingAs="h4" />
                  ))}
                </div>
              </section>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
