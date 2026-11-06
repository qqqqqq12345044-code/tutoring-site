import type { NationalSchool } from "@/data/nationalSchools";
import { nationalSchoolSource } from "@/data/nationalSchools";
import { getRegionPath, getRegionTitleName, getRegionUrl } from "@/data/regions";
import { getDongsByCity, MOIS_ADMIN_CODE_SOURCE } from "@/data/dongs";
import { subjects } from "@/data/subjects";
import { getGradeBySlug } from "@/data/grades";
import { buildSchoolBreadcrumb, schoolLevelToGradeSlug } from "@/lib/schoolHierarchy";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedLinks from "@/components/RelatedLinks";
import SourceList from "@/components/SourceList";
import ConsultCTA from "@/components/ConsultCTA";

/** 은/는 for the last Hangul syllable (school names end in 학교 / 분교장 / 캠퍼스). */
function topicParticle(word: string): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? "은" : "는";
}

/** 행정동 page of this school, when src/data/dongs.ts has that 행정동 (matched by official code, never by name). */
export function nationalSchoolDong(school: NationalSchool) {
  return getDongsByCity(school.cityRegionSlug).find((d) => d.code === school.dongCode);
}

/** "울산 남구" style area label (province + disambiguated city/district name). */
export function nationalSchoolArea(school: NationalSchool): string {
  const path = getRegionPath(school.districtRegionSlug ?? school.cityRegionSlug);
  const province = path[0];
  const rest = path.slice(1).map((r) => r.name);
  const cityTitle = getRegionTitleName(school.cityRegionSlug);
  // getRegionTitleName already carries the province for names shared across 시·도 (e.g. "울산광역시 남구").
  if (cityTitle.includes(" ")) return [cityTitle, ...rest.slice(1)].join(" ");
  return [province?.name, ...rest].filter(Boolean).join(" ");
}

/**
 * Fact-only hub for a page-capable national school (PAGE_ONLY, always noindex). Shows only what the official
 * records say — name, 학교급, 소재 지역, 행정동, source — plus the consult CTA. No 평가계획 / 학교 특징 text:
 * none has been read for these schools yet.
 */
export default function NationalSchoolPage({ school }: { school: NationalSchool }) {
  const regionPath = getRegionPath(school.districtRegionSlug ?? school.cityRegionSlug);
  const dong = nationalSchoolDong(school);
  const grade = getGradeBySlug(schoolLevelToGradeSlug[school.level]);
  const area = nationalSchoolArea(school);
  const cityRegion = regionPath.find((r) => r.slug === school.cityRegionSlug);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4">
          <Breadcrumb items={buildSchoolBreadcrumb(school)} />
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight break-keep">{school.name} 과외</h1>
          <p className="text-text-muted leading-relaxed max-w-2xl break-keep">
            {school.name}{topicParticle(school.name)} {area} {school.dongName}에 있는 {school.level}입니다. 교과설계소는 학교와 별개의 1:1 과외
            서비스이며, 상담에서 학생의 학교 진도와 시험 일정을 먼저 확인한 뒤 수업 과목을 정합니다.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm max-w-2xl">
            <dt className="text-text-muted">학교급</dt>
            <dd className="text-text-main">{school.level}</dd>
            <dt className="text-text-muted">소재 지역</dt>
            <dd className="text-text-main break-keep">{regionPath.map((r) => r.fullName).join(" ")}</dd>
            <dt className="text-text-muted">행정동</dt>
            <dd className="text-text-main">{school.dongName}</dd>
          </dl>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed break-keep border-l-2 border-brand/50 pl-3 max-w-2xl">
            학교 기본 정보는 교육부 NEIS 학교기본정보, 행정동은 도로명주소를 행정안전부 행정동 코드(2026.10.12. 시행)에
            대조해 1곳으로 확인한 값입니다. 이 학교의 학교알리미 평가계획은 아직 정리하지 않아 과목별 평가 비율은 싣지
            않았습니다.
          </p>
        </div>
      </section>

      <section className="container-page py-14 md:py-16 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title="지역·행정동"
          links={[
            ...regionPath.slice(1).map((r) => ({ label: `${r.slug === school.cityRegionSlug ? area : r.name} 과외`, href: getRegionUrl(r.slug) })),
            ...(dong && cityRegion ? [{ label: `${dong.name} 과외`, href: `${getRegionUrl(cityRegion.slug)}/${dong.slug}` }] : []),
          ]}
        />
        <RelatedLinks
          title="과목·학년별 안내"
          links={[
            ...(grade ? [{ label: `${grade.name}과외`, href: `/grade/${grade.slug}` }] : []),
            ...subjects.map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` })),
          ]}
        />
      </section>

      <section className="container-page pb-10">
        <SourceList sources={[nationalSchoolSource(school), MOIS_ADMIN_CODE_SOURCE]} title="출처" className="max-w-2xl" />
      </section>

      <section className="container-page pb-16 md:pb-20">
        <ConsultCTA
          title={`${school.name} 학생 1:1 과외 상담받기`}
          context={{ region: school.cityRegionSlug, ...(dong ? { dong: dong.slug } : {}) }}
        />
      </section>
    </>
  );
}
