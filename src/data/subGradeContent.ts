/**
 * Content for a single sub-grade page (/grade/[slug]/[subGradeSlug], e.g.
 * /grade/elementary/6 for 초6) — the sub-grade-level counterpart of
 * schoolContent.ts, reusing the same published-content-gate pattern.
 *
 * Key relationships (enforced by convention, not types):
 * - gradeSlug must be a Grade.slug from src/data/grades.ts.
 * - subGradeSlug must be one of that grade's subGrades[].slug.
 *
 * src/lib/indexability.ts's "sub-grade" case gates on isPublishedContent():
 * a sub-grade only stays index+sitemap eligible once status is "published"
 * AND notes is non-empty. A "draft" entry, or no entry at all, is
 * noindex/out-of-sitemap — the parent grade page's existing sub-grade card
 * still renders, just without a dedicated page's extra detail.
 *
 * Initial published set (2026-09): only the four grade-transition years
 * with genuinely distinct, well-established search intent (진학 준비,
 * 첫 내신, 수시/정시 등은 실제 한국 교육 제도의 일부이며 추측이 아님) —
 * 초6(중학교 진학 준비), 중3(고입 준비), 고1(고등 적응), 고3(수시/정시).
 * The remaining 8 sub-grades stay unpublished/noindex rather than forcing
 * thin, mechanically-generated content for every grade.
 */
export interface SubGradeContent {
  gradeSlug: string;
  subGradeSlug: string;
  status: "draft" | "published";
  intro: string;
  notes: { title: string; body: string }[];
}

export const subGradeContents: SubGradeContent[] = [
  {
    gradeSlug: "elementary",
    subGradeSlug: "6",
    status: "published",
    intro:
      "초6은 중학교 진학을 앞두고 학습 습관과 과목별 기초 개념을 정리하는 시기입니다. 무리한 선행보다 놓친 개념을 점검하고 중학교 학습량에 적응할 준비를 하는 것이 중요합니다.",
    notes: [
      {
        title: "중학교 진학 준비",
        body: "중학교는 과목 수와 시험 범위가 크게 늘어나므로, 초6 때 과목별 기초 개념을 다시 점검하고 스스로 계획을 세워 공부하는 습관을 만들어두는 것이 좋습니다.",
      },
      {
        title: "자유학기제 이전 적응",
        body: "중학교 1학년 1학기는 자유학기제로 지필고사가 없는 경우가 많아, 초6 시기에 미리 꾸준한 학습 습관을 다져두면 이후 본격적인 내신 시기에 도움이 됩니다.",
      },
      {
        title: "과목별 기초 점검",
        body: "국어 독해력, 영어 문장 구조 이해, 수학 연산과 개념 이해도를 중학교 진학 전에 점검해 부족한 부분을 먼저 보완하는 것이 효과적입니다.",
      },
    ],
  },
  {
    gradeSlug: "middle",
    subGradeSlug: "3",
    status: "published",
    intro:
      "중3은 고등학교 진학을 앞두고 마지막 내신 관리와 함께 전 과목을 정리해야 하는 시기입니다. 고입 전형에 따라 내신 반영 방식이 달라질 수 있어 목표 고등학교에 맞춘 준비가 필요합니다.",
    notes: [
      {
        title: "고입 전형과 내신 관리",
        body: "일반고·특목고·자사고 등 목표로 하는 고등학교 유형에 따라 내신 반영 비중과 전형 요소가 다르므로, 지원하려는 학교의 입시 요강을 먼저 확인하는 것이 중요합니다.",
      },
      {
        title: "전 과목 총정리",
        body: "중3 2학기는 고등학교 진학 전 마지막으로 중학교 전 과목 개념을 정리할 수 있는 시기이므로, 취약 과목을 우선순위로 두고 복습 계획을 세우는 것이 좋습니다.",
      },
      {
        title: "고등학교 학습 방식 대비",
        body: "고등학교는 내신과 모의고사를 함께 준비해야 하므로, 중3 때부터 꾸준한 학습 습관과 시간 관리 방식을 미리 연습해두는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    gradeSlug: "high",
    subGradeSlug: "1",
    status: "published",
    intro:
      "고1은 고등학교 내신 체계에 처음 적응하며 3월 전국연합학력평가 등 모의고사도 함께 시작되는 시기입니다. 내신과 모의고사 준비 방식의 차이를 이해하고 학습 계획을 세우는 것이 중요합니다.",
    notes: [
      {
        title: "고등학교 첫 내신",
        body: "고등학교 내신은 중학교보다 시험 범위와 난이도가 높아지고 등급제로 평가되는 경우가 많아, 첫 시험부터 학교별 출제 경향을 파악해두는 것이 이후 학년에 도움이 됩니다.",
      },
      {
        title: "전국연합학력평가 대비",
        body: "고1부터 매 학기 전국연합학력평가(모의고사)를 치르게 되므로, 내신 시험 일정과 겹치지 않도록 두 시험을 구분해 학습 계획을 세우는 것이 필요합니다.",
      },
      {
        title: "과목 선택 대비",
        body: "고2부터는 선택과목 체계로 진로에 따른 과목 선택이 중요해지므로, 고1 시기에 여러 과목의 적성과 성취도를 확인해보는 것이 진로 결정에 도움이 됩니다.",
      },
    ],
  },
  {
    gradeSlug: "high",
    subGradeSlug: "3",
    status: "published",
    intro:
      "고3은 수능 준비와 마지막 내신 관리를 함께 진행하며 수시·정시 지원 전략까지 세워야 하는 시기입니다. 남은 기간과 목표에 맞춰 학습 우선순위를 조정하는 것이 중요합니다.",
    notes: [
      {
        title: "수시·정시 병행 준비",
        body: "수시 전형을 준비한다면 내신과 학생부 관리를, 정시 위주라면 수능 과목 학습에 더 집중하는 등 지원 전략에 따라 학습 비중을 다르게 가져가는 것이 필요합니다.",
      },
      {
        title: "마지막 내신 관리",
        body: "고3 1학기까지의 내신이 수시 전형에 반영되는 경우가 많아, 목표 대학과 전형을 먼저 확인하고 내신 학습 계획을 세우는 것이 중요합니다.",
      },
      {
        title: "수능 최종 마무리",
        body: "고3 시기에는 새로운 개념 학습보다 그동안 쌓아온 내용을 실전 문제에 적용하는 마무리 학습과 모의고사 기반 시간 관리 연습이 효과적입니다.",
      },
    ],
  },
];

export function getSubGradeContent(gradeSlug: string, subGradeSlug: string): SubGradeContent | undefined {
  return subGradeContents.find((c) => c.gradeSlug === gradeSlug && c.subGradeSlug === subGradeSlug);
}

/** Whether a sub-grade entry is complete enough to be shown/indexed. */
export function isPublishedContent(content: SubGradeContent | undefined): content is SubGradeContent {
  return Boolean(content && content.status === "published" && content.notes.length > 0);
}
