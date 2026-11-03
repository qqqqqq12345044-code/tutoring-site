import type { GradeSubjectAssessment, SchoolGradeSubjectContent } from "@/data/schoolGradeSubjectContent";
import type { GeoEvidenceRef } from "@/data/schoolGradeGeo";

/** The assessment row a GEO evidence ref points at (name, and course on multi-course entries), or undefined. */
export function findGeoEvidenceRow(content: SchoolGradeSubjectContent, ref: GeoEvidenceRef): GradeSubjectAssessment | undefined {
  return content.assessments.find((a) => a.name === ref.name && (ref.course === undefined || a.course === ref.course));
}

/** One 근거 line, built only from the 평가계획 row: "[과목] 이름 비율% · 시기" (+ " · 방법" when ref.detail). */
export function geoEvidenceLine(content: SchoolGradeSubjectContent, ref: GeoEvidenceRef): string {
  const row = findGeoEvidenceRow(content, ref);
  if (!row) return ref.name;
  const course = content.courses.length > 1 && row.course ? `[${row.course}] ` : "";
  return [`${course}${row.name} ${row.weight}%`, row.timing, ref.detail ? row.method : undefined].filter(Boolean).join(" · ");
}
