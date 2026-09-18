import Link from "next/link";
import { School as SchoolIcon } from "lucide-react";
import { schools } from "@/data/schools";
import { getRegionBySlug } from "@/data/regions";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = buildMetadata({
  title: "학교별 과외 | 학교 진도에 맞춘 1:1 수업",
  description: "학교별 학사 일정과 진도에 맞춘 1:1 과외 정보를 확인하고 무료 상담을 받아보세요.",
  path: "/schools",
});

export default function SchoolsPage() {
  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ name: "학교별 과외", href: "/schools" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">학교별 과외</h1>
      <p className="mt-2 text-text-muted text-sm md:text-base">
        학교 진도와 시험 일정에 맞춘 1:1 과외 정보를 확인해보세요.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((s) => {
          const region = getRegionBySlug(s.districtRegionSlug ?? s.cityRegionSlug);
          return (
            <Link
              key={s.slug}
              href={`/school/${s.slug}`}
              className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-white p-6 transition-all duration-300 ease-out hover:border-brand hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-light text-brand shrink-0">
                <SchoolIcon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-navy">{s.name}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {region?.fullName ?? region?.name} · {s.level}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 text-sm text-text-muted">
        찾는 학교가 없다면 상담을 통해 학교명을 알려주세요. 학교 진도와 시험 일정에 맞춰
        안내해드립니다.
      </p>
    </section>
  );
}
