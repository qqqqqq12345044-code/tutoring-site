/**
 * Evidence kinds for school / grade / subject content (2026-11-02, docs/qa/national-school-content-expansion-2026-11-02.md).
 *
 * - OFFICIAL       — 공개 자료(학교알리미 교수·학습 및 평가계획, NEIS 학교기본정보 등). Every fact on a
 *                    school×grade×subject page today is OFFICIAL and carries its ContentSource (src/data/sources.ts).
 * - FIELD_ANALYSIS — 교육 현장 분석(최근 시험 출제 경향, 자주 나오는 유형, 학생들이 어려워하는 단원, 성적대별 전략).
 * - CASE_BASED     — 수업·학습 상담 사례(시험 대비 사례, 학습 개선 사례, 성적 변화 사례).
 *
 * FIELD_ANALYSIS / CASE_BASED are ALLOWED_WITH_EVIDENCE: a page shows such a section only when a verified
 * EvidenceRecord below matches it, and the section is hidden otherwise (no placeholder). No record exists yet —
 * the repo has no verified field analysis or lesson-case data (src/data/caseStudies.ts holds generic, unsourced
 * examples and is not evidence). Records are added only from real, aggregated material; nothing is generated.
 *
 * Rules (checked by validate:quick, scripts/lib/evidence-check.ts):
 * - No personal data: no student / parent / teacher names, phone numbers, addresses or other identifiers.
 * - A figure (%, 등급, 점, 명) in `summary` requires `sampleSize` and `period` — the figure must come from an
 *   actual count. 합격률·성공률·학교 평균등급·학교별 시험 난이도 수치는 쓰지 않는다.
 * - The public wording names the kind ("수업 사례 기반", "학습 상담 사례 기반", "시험 대비 사례 분석"), never a
 *   company or brand name, and never calls the material "교과설계소 자체 고객 데이터".
 */
export type EvidenceKind = "OFFICIAL" | "FIELD_ANALYSIS" | "CASE_BASED";

export interface EvidenceRecord {
  id: string;
  kind: Exclude<EvidenceKind, "OFFICIAL">;
  /** NEIS 학교 표준코드 when the record is about one school; omitted for grade/subject-wide material. */
  schoolCode?: string;
  /** 학년 1~6 (학교급 범위 안). */
  grade?: number;
  subjectSlug?: string;
  /** Period the material covers, e.g. "2026-1" (2026학년도 1학기). Required when summary has a figure. */
  period?: string;
  title: string;
  summary: string;
  /** How the material was gathered, in public wording (e.g. "학습 상담 사례 기반"). */
  sourceKind: string;
  /** Date the record was checked against the underlying material (YYYY-MM-DD). */
  verifiedAt: string;
  /** Number of cases / students aggregated. Required when summary has a figure. */
  sampleSize?: number;
}

export const evidenceRecords: EvidenceRecord[] = [];

export const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  OFFICIAL: "공개 자료",
  FIELD_ANALYSIS: "교육 현장 분석",
  CASE_BASED: "수업 사례 기반",
};

export function getEvidenceRecords(q: { schoolCode?: string; grade?: number; subjectSlug?: string }): EvidenceRecord[] {
  return evidenceRecords.filter(
    (r) =>
      (r.schoolCode === undefined || r.schoolCode === q.schoolCode) &&
      (r.grade === undefined || r.grade === q.grade) &&
      (r.subjectSlug === undefined || r.subjectSlug === q.subjectSlug)
  );
}
