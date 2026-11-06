import SectionHeader from "@/components/ui/SectionHeader";
import { EVIDENCE_LABEL, getEvidenceRecords } from "@/data/evidence";

/**
 * FIELD_ANALYSIS / CASE_BASED material for a school (×학년 ×과목) page — 출제 경향, 자주 막히는 영역, 성적대별 전략,
 * 수업·상담 사례. Rendered only when a verified record in src/data/evidence.ts matches; otherwise nothing (no
 * placeholder). Each card names its evidence kind and basis so it is never read as an official school fact.
 */
export default function EvidenceSection({
  schoolCode,
  grade,
  subjectSlug,
  title,
}: {
  schoolCode?: string;
  grade?: number;
  subjectSlug?: string;
  title: string;
}) {
  const records = getEvidenceRecords({ schoolCode, grade, subjectSlug });
  if (records.length === 0) return null;
  return (
    <section className="container-page pb-14 md:pb-16">
      <SectionHeader align="left" title={title} />
      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        {records.map((r) => (
          <div key={r.id} className="border-l-4 border-brand/70 pl-5 py-0.5">
            <p className="text-xs font-bold text-brand">{EVIDENCE_LABEL[r.kind]} · {r.sourceKind}</p>
            <p className="mt-1 font-bold text-navy">{r.title}</p>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{r.summary}</p>
            <p className="mt-2 text-xs text-text-muted">
              {[r.period && `기간 ${r.period}`, r.sampleSize && `사례 ${r.sampleSize}건`, `확인 ${r.verifiedAt}`].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
