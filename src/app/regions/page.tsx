import Link from "next/link";
import { MapPin } from "lucide-react";
import { regions, getProvinces, getRegionUrl } from "@/data/regions";
import { schools } from "@/data/schools";
import { countSchoolsInRegion } from "@/lib/indexability";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RegionCard from "@/components/RegionCard";
import SearchBox from "@/components/SearchBox";

export const metadata = buildMetadata({
  title: "지역별 과외 | 전국 시/도별 1:1 과외 안내",
  description: "서울, 경기를 비롯한 전국 지역별 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
  path: "/regions",
  image: "region",
});

export default function RegionsPage() {
  const provinces = getProvinces();
  // 하위에 등록 학교가 있는 시·도만 "학교 정보가 등록된 지역"으로 묶는다 (모든 시·도가 시·군·구를 가진 뒤에도 의미 유지).
  const featured = provinces.filter((p) => countSchoolsInRegion(p.slug) > 0);
  const compact = provinces.filter((p) => countSchoolsInRegion(p.slug) === 0);
  const searchTargets = [
    ...regions.map((r) => ({ label: r.level === "province" ? r.name : r.fullName, href: getRegionUrl(r.slug) })),
    ...schools.map((s) => ({ label: s.name, href: `/school/${s.slug}` })),
  ];

  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "지역별 과외", href: "/regions" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">지역별 과외</h1>
      <p className="mt-2 text-text-main/80 text-sm md:text-base max-w-2xl leading-relaxed">
        전국 어디에서든 1:1 과외를 상담할 수 있습니다. 지역명 또는 학교명으로 찾아보세요.
      </p>

      <div className="mt-6">
        <SearchBox targets={searchTargets} />
      </div>

      <div className="mt-10 md:mt-12">
        <p className="text-sm font-bold text-navy mb-4">학교 정보가 등록된 지역</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {featured.map((p) => (
            <RegionCard key={p.slug} region={p} />
          ))}
        </div>
      </div>

      <div className="mt-10 md:mt-12">
        <p className="text-sm font-bold text-navy mb-4">그 외 지역 (방문·화상 상담 가능)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {compact.map((p) => (
            <Link
              key={p.slug}
              href={`/region/${p.slug}`}
              className="flex items-center gap-2 rounded-xl border border-border-subtle bg-white px-4 py-3.5 text-sm font-medium text-text-main hover:border-brand hover:text-brand transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
              {p.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
