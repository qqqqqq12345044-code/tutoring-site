import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guideCategories, guideArticles } from "@/data/guide";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = buildMetadata({
  title: "학습가이드 | 학년별·과목별 공부법",
  description: "초등·중등·고등 학년별, 국영수사과 과목별 공부법과 과외 선택 가이드를 확인해보세요.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "학습가이드", href: "/guide" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">학습가이드</h1>
      <p className="mt-2 text-text-muted text-sm md:text-base">
        학년별, 과목별 공부법과 과외 선택에 도움이 되는 정보를 확인해보세요.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {guideCategories.map((c) => (
          <span
            key={c.slug}
            className="rounded-full border border-border-subtle bg-white px-4 py-2 text-sm text-text-main"
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {guideArticles.map((a) => (
          <Link
            key={a.slug}
            href={`/guide/${a.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-6 hover:border-brand hover:shadow-md transition-all"
          >
            <span className="w-fit rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">
              {guideCategories.find((c) => c.slug === a.categorySlug)?.name}
            </span>
            <h2 className="font-bold text-navy leading-snug">{a.title}</h2>
            <p className="text-sm text-text-muted leading-relaxed">{a.excerpt}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">
              읽어보기
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
