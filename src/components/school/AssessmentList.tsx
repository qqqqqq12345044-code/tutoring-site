import type { SchoolGradeSubjectContent } from "@/data/schoolGradeSubjectContent";
import { groupAssessmentsByCourse } from "@/lib/schoolGrade";

/**
 * The 반영 비율 rows of one school×학년×과목 plan, grouped by course. A stacked list rather than a table so it
 * stays readable at 390px without horizontal scrolling.
 */
export default function AssessmentList({ content }: { content: SchoolGradeSubjectContent }) {
  const groups = groupAssessmentsByCourse(content);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((g) => (
        <div key={g.course || "course"} className="rounded-2xl border border-border-subtle bg-white p-5 md:p-6">
          <p className="font-bold text-navy break-keep">
            {g.course || "평가 구성"}
            <span className="ml-2 text-sm font-medium text-text-muted">
              정기시험 {g.exam}% · 수행평가 {g.task}%
            </span>
          </p>
          <ul className="mt-4 flex flex-col divide-y divide-border-subtle">
            {g.rows.map((a) => (
              <li key={`${a.kind}-${a.name}`} className="py-3 flex gap-3">
                <span
                  className={`shrink-0 mt-0.5 rounded-md px-2 py-0.5 text-xs font-bold ${
                    a.kind === "exam" ? "bg-navy text-white" : "bg-brand-light text-navy"
                  }`}
                >
                  {a.kind === "exam" ? "시험" : "수행"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-main break-keep">
                    {a.name} <span className="font-bold text-navy">{a.weight}%</span>
                  </p>
                  {(a.timing || a.method) && (
                    <p className="mt-1 text-xs text-text-muted break-keep">{[a.timing, a.method].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
