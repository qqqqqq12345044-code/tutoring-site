import type { GuideArticle } from "@/data/guide";

/**
 * Display-only helpers for the 학습가이드 magazine layout. Kept out of src/data/guide.ts so content edits
 * there (new articles) never conflict with layout work.
 */

/** Rough Korean reading time: ~500 characters per minute, at least 1 minute. */
export function readingMinutes(a: GuideArticle): number {
  const chars = [...a.body, ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs])].join("").replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/** "2026-11-05" → "2026.11.05" */
export function formatGuideDate(iso: string): string {
  return iso.replace(/-/g, ".");
}

/** Category groups shown as magazine sections on /guide (categories without articles are dropped). */
export const guideCategoryGroups: { title: string; description: string; slugs: string[] }[] = [
  {
    title: "학년별 공부법",
    description: "초등부터 수능까지, 시기마다 달라지는 공부 방법",
    slugs: ["elementary-study", "middle-naeshin", "high-naeshin", "suneung"],
  },
  {
    title: "과목별 공부법",
    description: "국어·영어·수학·사회·과학, 과목마다 다른 공부 순서",
    slugs: ["korean-study", "english-study", "math-study", "social-study", "science-study"],
  },
  {
    title: "학습 전략·시험 대비",
    description: "계획표, 오답 정리, 시험 기간 운영처럼 모든 과목에 통하는 전략",
    slugs: ["study-strategy", "exam-prep"],
  },
  {
    title: "교과 외 과정",
    description: "논술·코딩·검정고시 준비",
    slugs: ["nonsul-study", "coding-study", "ged-study"],
  },
];
