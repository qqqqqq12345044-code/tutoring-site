import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, FolderOpen, FileCheck2 } from "lucide-react";
import { guideArticles, guideCategories, getArticlesByCategory, type GuideArticle } from "@/data/guide";
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

/**
 * Category groups and one-line scope descriptions. The descriptions only say what a category covers — they add
 * no facts of their own (facts live in the articles, with sources).
 */
const GROUPS: { id: string; title: string; description: string; categories: string[] }[] = [
  {
    id: "by-grade",
    title: "학년별 공부법",
    description: "학교급이 바뀔 때 무엇이 달라지는지, 시기별로 무엇을 먼저 챙겨야 하는지 정리했습니다.",
    categories: ["elementary-study", "middle-naeshin", "high-naeshin", "suneung"],
  },
  {
    id: "by-subject",
    title: "과목별 공부법",
    description: "국어·영어·수학·사회·과학, 과목마다 다른 공부 순서와 시험 준비 방법입니다.",
    categories: ["korean-study", "english-study", "math-study", "social-study", "science-study"],
  },
  {
    id: "strategy",
    title: "학습 전략 · 시험 대비",
    description: "계획 세우기, 오답 관리, 시험 기간 운영처럼 과목과 상관없이 쓰이는 방법입니다.",
    categories: ["study-strategy", "exam-prep"],
  },
  {
    id: "programs",
    title: "교과 외 과정",
    description: "논술·코딩·검정고시처럼 학교 교과와 목표가 다른 과정의 준비 방법입니다.",
    categories: ["nonsul-study", "coding-study", "ged-study"],
  },
];

const CATEGORY_SCOPE: Record<string, string> = {
  "elementary-study": "공부 습관과 읽기, 기초 연산을 다지는 방법",
  "middle-naeshin": "중학교 지필·수행평가를 함께 준비하는 방법",
  "high-naeshin": "고등학교 내신 관리와 과목 선택",
  suneung: "수능 체제 이해와 준비 순서",
  "korean-study": "독서·문학·문법을 공부하는 순서",
  "english-study": "어휘·구문·독해와 서술형 대비",
  "math-study": "개념 정리와 문제풀이, 오답 관리",
  "social-study": "개념 구조화와 자료 해석",
  "science-study": "개념 이해와 탐구·실험 대비",
  "study-strategy": "계획표·오답노트·복습 루틴",
  "exam-prep": "시험 기간 운영과 수행평가 준비",
  "nonsul-study": "논술 답안 구성과 준비 순서",
  "coding-study": "코딩 학습을 시작하는 순서",
  "ged-study": "검정고시 준비 순서",
};

/** "Read first" picks: one orientation article per learner situation (first article of each category). */
const PICK_CATEGORIES = ["study-strategy", "elementary-study", "middle-naeshin", "high-naeshin"];

function latestUpdateLabel(articles: GuideArticle[]): string {
  const latest = articles.reduce((max, a) => {
    const d = a.updatedAt > a.publishedAt ? a.updatedAt : a.publishedAt;
    return d > max ? d : max;
  }, "");
  const [y, m] = latest.split("-");
  return `${y}년 ${Number(m)}월`;
}

/** Preview + topic list built only from the article's own text (no new copy). */
function highlights(a: GuideArticle) {
  return { preview: a.body[0] ?? a.excerpt, topics: a.sections.slice(0, 3).map((s) => s.heading) };
}

function categoryName(slug: string) {
  return guideCategories.find((c) => c.slug === slug)?.name ?? "";
}

export default function GuidePage() {
  const picks = PICK_CATEGORIES.map((c) => getArticlesByCategory(c)[0]).filter((a): a is GuideArticle => Boolean(a));
  const [bigPick, ...smallPicks] = picks;
  const withSources = guideArticles.filter((a) => (a.sources?.length ?? 0) > 0).length;
  const groups = GROUPS.map((g) => ({
    ...g,
    sections: g.categories
      .map((slug) => ({ slug, name: categoryName(slug), articles: getArticlesByCategory(slug) }))
      .filter((s) => s.articles.length > 0),
  })).filter((g) => g.sections.length > 0);
  const usedCategoryCount = groups.reduce((n, g) => n + g.sections.length, 0);

  const stats = [
    { icon: BookOpen, value: `${guideArticles.length}편`, label: "학습가이드" },
    { icon: FolderOpen, value: `${usedCategoryCount}개`, label: "주제 분류" },
    { icon: FileCheck2, value: `${withSources}편`, label: "공식 자료 출처 표기" },
    { icon: CalendarDays, value: latestUpdateLabel(guideArticles), label: "최근 업데이트" },
  ];

  return (
    <>
      <section className="border-b border-border-subtle bg-white">
        <div className="container-page py-10 md:py-14">
          <Breadcrumb items={[{ name: "학습가이드", href: "/guide" }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand">STUDY GUIDE</p>
              <h1 className="mt-3 text-3xl md:text-[2.6rem] font-extrabold leading-[1.25] text-navy">
                공부가 막힐 때,
                <br />
                필요한 답부터 찾아보세요
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-text-main/85 break-keep">
                학년별·과목별 공부법부터 계획 세우기, 시험 기간 운영까지 학생과 학부모님이 실제로 많이 궁금해하는
                주제를 정리했습니다. 교육과정·입시 제도처럼 사실이 필요한 내용은 공식 자료 출처를 함께 적었습니다.
              </p>
              <nav aria-label="학습가이드 분류" className="mt-6 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <a
                    key={g.id}
                    href={`#${g.id}`}
                    className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand transition-colors"
                  >
                    {g.title}
                  </a>
                ))}
              </nav>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <li key={s.label} className="rounded-2xl border border-border-subtle bg-bg-app p-5">
                  <s.icon className="w-5 h-5 text-brand" aria-hidden="true" />
                  <p className="mt-3 text-2xl font-black text-navy tabular-nums">{s.value}</p>
                  <p className="text-sm font-semibold text-text-muted">{s.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {bigPick && (
        <section className="container-page py-14 md:py-16">
          <p className="text-xs font-bold tracking-widest text-brand">EDITOR&apos;S PICK</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-navy">먼저 읽으면 좋은 글</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <Link
              href={`/guide/${bigPick.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white transition-all hover:border-brand hover:shadow-lg lg:col-span-2 lg:flex-row"
            >
              <div className="lg:w-1/2">
                <StudyThumbnail motif={motifForGuideCategory(bigPick.categorySlug)} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-7">
                <span className="w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                  {categoryName(bigPick.categorySlug)}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold leading-snug text-navy">{bigPick.title}</h3>
                <p className="text-[15px] leading-relaxed text-text-main/85 break-keep">{bigPick.excerpt}</p>
                <TopicList topics={highlights(bigPick).topics} />
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-brand">
                  처음 읽기 좋은 글
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
            <div className="flex flex-col gap-4">
              {smallPicks.map((a) => (
                <Link
                  key={a.slug}
                  href={`/guide/${a.slug}`}
                  className="group flex flex-1 flex-col gap-2 rounded-2xl border border-border-subtle bg-white p-5 transition-all hover:border-brand hover:shadow-md"
                >
                  <span className="w-fit rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand">
                    {categoryName(a.categorySlug)}
                  </span>
                  <h3 className="font-extrabold leading-snug text-navy group-hover:text-brand">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted line-clamp-2">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {groups.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          className={`scroll-mt-24 border-t border-border-subtle ${gi % 2 === 0 ? "bg-white" : "bg-bg-app"}`}
        >
          <div className="container-page py-14 md:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-black text-brand tabular-nums">{String(gi + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-navy">{g.title}</h2>
              <p className="mt-2 text-[15px] md:text-base leading-relaxed text-text-muted break-keep">{g.description}</p>
            </div>
            <div className="mt-10 flex flex-col gap-12">
              {g.sections.map(({ slug, name, articles }) => {
                const [lead, ...rest] = articles;
                const h = highlights(lead);
                return (
                  <div key={slug} id={slug} className="scroll-mt-24">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-4 border-brand pl-4">
                      <h3 className="text-xl font-extrabold text-navy">{name}</h3>
                      <span className="text-sm font-bold text-brand">{articles.length}편</span>
                      {CATEGORY_SCOPE[slug] && (
                        <span className="w-full text-sm text-text-muted">{CATEGORY_SCOPE[slug]}</span>
                      )}
                    </div>
                    <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                      <Link
                        href={`/guide/${lead.slug}`}
                        className="group flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-6 transition-all hover:border-brand hover:shadow-md"
                      >
                        <h4 className="text-lg font-extrabold leading-snug text-navy group-hover:text-brand">{lead.title}</h4>
                        <p className="text-[15px] leading-relaxed text-text-main/85 line-clamp-3 break-keep">{h.preview}</p>
                        <TopicList topics={h.topics} />
                        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-bold text-brand">
                          읽어보기
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                      {rest.length > 0 ? (
                        <ul className="self-start divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-white">
                          {rest.map((a) => (
                            <li key={a.slug}>
                              <Link href={`/guide/${a.slug}`} className="group flex items-start gap-3 p-5 hover:bg-bg-app">
                                <span className="flex-1">
                                  <span className="block font-bold leading-snug text-navy group-hover:text-brand">{a.title}</span>
                                  <span className="mt-1 block text-sm leading-relaxed text-text-muted line-clamp-2">{a.excerpt}</span>
                                </span>
                                <ArrowRight className="mt-1 w-4 h-4 shrink-0 text-brand" aria-hidden="true" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="hidden overflow-hidden rounded-2xl border border-border-subtle lg:block">
                          <StudyThumbnail motif={motifForGuideCategory(slug)} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

function TopicList({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null;
  return (
    <div className="rounded-xl bg-bg-app p-4">
      <p className="text-xs font-bold text-text-muted">이 글에서 다루는 내용</p>
      <ol className="mt-2 flex flex-col gap-1.5">
        {topics.map((t, i) => (
          <li key={t} className="flex gap-2 text-sm font-semibold text-text-main">
            <span className="font-black text-brand tabular-nums">{i + 1}</span>
            <span className="break-keep">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
