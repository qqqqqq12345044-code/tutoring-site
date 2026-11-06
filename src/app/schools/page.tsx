import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { schools, type School } from "@/data/schools";
import { getProvinces, getChildren, getRegionUrl } from "@/data/regions";
import { buildMetadata } from "@/lib/metadata";
import { schoolLevelToGradeSlug } from "@/lib/schoolHierarchy";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = buildMetadata({
  title: "학교별 과외 | 학교 진도에 맞춘 1:1 수업",
  description: "지역 → 시·군·구 → 초등학교·중학교·고등학교 순서로 학교를 찾아 학교 진도와 시험 일정에 맞춘 1:1 과외 정보를 확인해보세요.",
  path: "/schools",
  image: "school",
});

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

const LEVEL_BADGE: Record<School["level"], string> = {
  초등학교: "bg-emerald-600 text-white",
  중학교: "bg-brand text-white",
  고등학교: "bg-navy text-white",
};

/**
 * Hierarchical school directory: 시·도 → 시·군·구 → 학교급 → 학교 (→ 학교별 과외 페이지).
 * Only regions that actually have registered schools are listed; the 학교급 heading links to
 * the city-level region+grade hub (/region/[province]/[city]/[grade]) that lists the same schools.
 */
export default function SchoolsPage() {
  const tree = getProvinces()
    .map((province) => ({
      province,
      cities: getChildren(province.slug)
        .map((city) => {
          const citySchools = schools.filter((s) => s.cityRegionSlug === city.slug);
          return {
            city,
            levels: LEVEL_ORDER.map((level) => ({ level, list: citySchools.filter((s) => s.level === level) })).filter(
              (l) => l.list.length > 0
            ),
          };
        })
        .filter((c) => c.levels.length > 0),
    }))
    .filter((p) => p.cities.length > 0);

  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "학교별 과외", href: "/schools" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">학교별 과외</h1>
      <p className="mt-2 text-text-main text-[15px] md:text-base">
        지역과 학교급을 골라 재학 중인 학교를 찾으면 학교 진도와 시험 일정에 맞춘 안내를 볼 수 있습니다.
      </p>

      <nav aria-label="시·도 바로가기" className="mt-6 flex flex-wrap gap-2">
        {tree.map(({ province }) => (
          <a
            key={province.slug}
            href={`#${province.slug}`}
            className="rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-brand hover:text-brand transition-colors"
          >
            {province.name}
          </a>
        ))}
      </nav>

      {tree.map(({ province, cities }) => (
        <section key={province.slug} id={province.slug} className="mt-12 scroll-mt-24">
          <h2 className="border-l-4 border-brand pl-3 text-xl md:text-2xl font-extrabold text-navy">
            <Link href={getRegionUrl(province.slug)} className="hover:text-brand transition-colors">
              {province.name} 학교별 과외
            </Link>
          </h2>
          <div className="mt-5 flex flex-col gap-6">
            {cities.map(({ city, levels }) => (
              <div key={city.slug} className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
                <h3 className="flex items-center justify-between gap-3 border-b border-border-subtle bg-bg-app px-5 py-4 md:px-6">
                  <Link href={getRegionUrl(city.slug)} className="text-lg font-extrabold text-navy hover:text-brand transition-colors">
                    {city.fullName}
                  </Link>
                  <span className="text-sm font-semibold text-text-muted">
                    학교 {levels.reduce((n, l) => n + l.list.length, 0)}곳
                  </span>
                </h3>
                <div className="grid md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-border-subtle">
                  {levels.map(({ level, list }) => (
                    <div key={level} className="px-5 py-5 md:px-6">
                      <Link
                        href={`${getRegionUrl(city.slug)}/${schoolLevelToGradeSlug[level]}`}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-extrabold transition-opacity hover:opacity-85 ${LEVEL_BADGE[level]}`}
                      >
                        {level}
                        <span className="tabular-nums font-bold opacity-90">{list.length}</span>
                      </Link>
                      <ul className="mt-3 divide-y divide-border-subtle border-t border-border-subtle">
                        {list.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/school/${s.slug}`}
                              className="group flex items-center justify-between gap-2 py-2.5 text-[15px] font-medium text-text-main hover:text-brand transition-colors"
                            >
                              <span>{s.name} 과외</span>
                              <ChevronRight className="w-4 h-4 text-border-subtle group-hover:text-brand shrink-0" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-10 text-sm text-text-muted">
        찾는 학교가 없다면 상담을 통해 학교명을 알려주세요. 학교 진도와 시험 일정에 맞춰
        안내해드립니다.
      </p>
    </section>
  );
}
