/**
 * Nationwide grade × subject content shared across every region — the
 * "common layer" split out of regionGradeSubjectContent.ts so that region
 * entries stop re-typing the same grade-tier explanation with only the
 * region name swapped (the exact duplication pattern flagged in
 * docs/qa/indexability-report.md).
 *
 * This file never gates indexability by itself. It is safe to show on any
 * region-grade-subject page regardless of that region's content status —
 * only src/data/regionGradeSubjectContent.ts's region-specific content
 * (via isPublishedContent()) decides index/sitemap eligibility.
 */
export interface GradeSubjectPlaybook {
  gradeSlug: string;
  subjectSlug: string;
  focusPoints: { title: string; body: string }[];
}

export const gradeSubjectPlaybooks: GradeSubjectPlaybook[] = [
  {
    gradeSlug: "middle",
    subjectSlug: "math",
    focusPoints: [
      {
        title: "중1 자유학기제 활용",
        body: "지필고사 부담이 적은 시기인 만큼 기초 개념을 정확히 다지고 중2 첫 시험을 미리 대비합니다.",
      },
      {
        title: "중2 첫 본격 지필고사 대비",
        body: "학교 진도와 시험 범위에 맞춰 취약 단원을 먼저 확인하고 유형 학습을 병행합니다.",
      },
      {
        title: "중3 고등 수학 연계 준비",
        body: "고등학교 진학 전 중학 과정을 정리하고 고1 수학에서 바로 이어지는 개념을 미리 점검합니다.",
      },
    ],
  },
  {
    gradeSlug: "middle",
    subjectSlug: "english",
    focusPoints: [
      {
        title: "중1 자유학기제 활용",
        body: "지필고사가 없는 시기를 활용해 어휘와 리딩 습관을 먼저 다지고, 중2부터 시작되는 평가 방식 변화에 대비합니다.",
      },
      {
        title: "중2 듣기평가·서술형 도입 대응",
        body: "지필고사에 듣기평가와 서술형 문항 비중이 늘어나는 시기이므로, 문항 유형별로 나눠 대비 전략을 세웁니다.",
      },
      {
        title: "중3 고교 영어 전환 준비",
        body: "고등학교 진학 전 문법 체계와 독해량을 정리해, 고1부터 시작되는 모의고사 형식에 미리 적응합니다.",
      },
    ],
  },
  {
    gradeSlug: "high",
    subjectSlug: "math",
    focusPoints: [
      {
        title: "고1 첫 모의고사 적응",
        body: "중학교 시험과 다른 모의고사 문항 구성에 적응하며, 내신과 모의고사를 병행하는 학습 리듬을 잡습니다.",
      },
      {
        title: "고2 선택과목 분화 대응",
        body: "선택 과목에 따라 학습 범위가 나뉘는 시기이므로, 목표에 맞춰 단원별 학습 비중을 조정합니다.",
      },
      {
        title: "고3 수능·내신 마무리 전략",
        body: "남은 기간 동안 수능 영역별 시간 배분 연습과 마지막 내신 대비를 함께 계획해 우선순위를 정리합니다.",
      },
    ],
  },
];

export function getGradeSubjectPlaybook(
  gradeSlug: string,
  subjectSlug: string
): GradeSubjectPlaybook | undefined {
  return gradeSubjectPlaybooks.find((p) => p.gradeSlug === gradeSlug && p.subjectSlug === subjectSlug);
}
