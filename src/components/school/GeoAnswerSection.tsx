import SectionHeader from "@/components/ui/SectionHeader";
import { isSchoolInfoPlanSource } from "@/data/sources";
import type { SchoolGradeSubjectContent } from "@/data/schoolGradeSubjectContent";
import type { SchoolGradeGeoEntry } from "@/data/schoolGradeGeo";
import { geoEvidenceLine } from "@/lib/schoolGradeGeo";

/**
 * GEO/AEO pilot block (docs/qa/geo-aeo-pilot-2026-11-03.md): question → direct answer → 근거 rows → 출처 → 기준·반영일,
 * one <article> per question so a single answer can be read (or quoted) on its own with its evidence attached.
 * Renders only for whitelisted pages (src/data/schoolGradeGeo.ts). No FAQPage schema: the visible Q&A is the content.
 */
export default function GeoAnswerSection({
  title,
  geo,
  content,
}: {
  title: string;
  geo: SchoolGradeGeoEntry;
  content: SchoolGradeSubjectContent;
}) {
  const source = content.sources.find(isSchoolInfoPlanSource);
  return (
    <section className="container-page py-14 md:py-16">
      <SectionHeader align="left" title={title} />
      <div className="mt-8 flex flex-col gap-6 max-w-3xl">
        {geo.items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-border-subtle bg-white p-5 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-navy leading-snug break-keep">{item.question}</h3>
            <p className="mt-3 text-[15px] text-navy leading-relaxed break-keep">{item.answer}</p>
            <div className="mt-4 border-t border-border-subtle pt-3 text-sm text-text-muted">
              <p className="font-bold text-navy">근거 (평가계획 반영 비율 표)</p>
              <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5 break-keep">
                {item.evidence.map((ref) => (
                  <li key={`${ref.course ?? ""}|${ref.name}`}>{geoEvidenceLine(content, ref)}</li>
                ))}
                {item.noteRefs?.map((t) => (
                  <li key={t}>평가계획 정리: {t} (아래 &lsquo;시험 준비에서 먼저 볼 점&rsquo;)</li>
                ))}
              </ul>
              {source && (
                <p className="mt-2 break-words">
                  출처:{" "}
                  <cite className="not-italic">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline hover:text-brand">
                      {source.label}
                    </a>
                  </cite>
                </p>
              )}
              <p className="mt-1">
                원문 대조 반영{" "}
                <time dateTime={geo.planCheckedAt}>{geo.planCheckedAt}</time> · 답변 작성{" "}
                <time dateTime={geo.answersUpdatedAt}>{geo.answersUpdatedAt}</time>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
