import { schoolGradeSubjectContents, isPublishedGradeSubject } from "@/data/schoolGradeSubjectContent";
import { guideArticles } from "@/data/guide";
import { SCHOOLINFO_PLAN_TERM } from "@/data/sources";

/**
 * Numbers shown on trust panels. Every value is counted from the site's own published data at build time —
 * never typed in by hand — so the panel can't drift from what the pages actually contain.
 */
export function getTrustStats() {
  const published = schoolGradeSubjectContents.filter(isPublishedGradeSubject);
  return {
    /** Schools whose 학교알리미 평가계획 원문 has been read and published as 학년×과목 pages. */
    planSchools: new Set(published.map((c) => c.schoolSlug)).size,
    /** Published 학교 × 학년 × 과목 평가 안내 pages. */
    planPages: published.length,
    guides: guideArticles.length,
    planTerm: SCHOOLINFO_PLAN_TERM,
  };
}

export function formatCount(n: number): string {
  return n.toLocaleString("ko-KR");
}
