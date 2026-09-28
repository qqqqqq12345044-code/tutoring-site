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
  {
    gradeSlug: "elementary",
    subGradeSlug: "4",
    status: "published",
    intro:
      "초4는 과목별로 다루는 개념이 눈에 띄게 늘어나며, 단순히 문제를 푸는 것보다 개념을 얼마나 이해했는지가 성적을 가르는 시기입니다. 학습량이 늘어나는 만큼 과목별 이해도를 자주 점검해주는 것이 중요합니다.",
    notes: [
      {
        title: "과목별 개념 확장 대비",
        body: "국어·수학·영어 모두 이전 학년보다 다루는 개념의 범위가 넓어지므로, 새로 배우는 개념을 이전에 배운 내용과 연결해 이해하는 습관이 필요합니다.",
      },
      {
        title: "스스로 정리하는 습관",
        body: "배운 내용을 그날그날 짧게라도 스스로 정리해보는 습관을 들이면, 학습량이 늘어나는 고학년에도 무리 없이 적응할 수 있습니다.",
      },
      {
        title: "읽기 독립성 키우기",
        body: "교과서 지문의 길이와 난이도가 올라가는 시기이므로, 혼자 지문을 읽고 핵심을 파악하는 연습을 조금씩 늘려가는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    gradeSlug: "elementary",
    subGradeSlug: "5",
    status: "published",
    intro:
      "초5는 중학교 진학까지 약 1년 반 정도가 남은 시기로, 남아 있는 여유를 활용해 과목별 기초를 다시 점검하기 좋은 시점입니다. 무리한 선행보다 현재 학년 개념을 확실히 다지는 것이 다음 단계 학습에 더 도움이 됩니다.",
    notes: [
      {
        title: "기초 개념 재점검",
        body: "지금까지 배운 내용 중 확실히 이해하지 못한 개념이 있다면, 중학교 진학 전에 시간을 두고 다시 짚어보는 것이 좋습니다.",
      },
      {
        title: "학습 계획 스스로 세우기",
        body: "부모나 교사가 정해준 계획을 따르는 것에서 나아가, 하루·한 주 학습 계획을 스스로 세워보는 연습을 시작하기 좋은 시기입니다.",
      },
      {
        title: "중학교 학습량 미리 가늠하기",
        body: "중학교부터는 과목 수와 시험 준비 범위가 크게 늘어나므로, 초5 시기에 조금씩 학습 시간을 늘려보며 적응력을 키워두는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    gradeSlug: "middle",
    subGradeSlug: "1",
    status: "published",
    intro:
      "중1은 자유학기제로 지필고사 없이 한 학기를 보내는 경우가 많아, 시험 부담 없이 학습 습관과 기초 체력을 다지기 좋은 시기입니다. 다만 이 시기를 그냥 흘려보내면 이후 본격적인 내신 시기에 부담이 커질 수 있습니다.",
    notes: [
      {
        title: "자유학기제 기간 활용",
        body: "지필고사가 없는 학기에는 등수보다 과목별 이해도 자체에 집중해, 부족한 개념을 여유 있게 채울 수 있습니다.",
      },
      {
        title: "학습 습관 자리잡기",
        body: "시험 압박이 적은 만큼 매일 일정한 시간에 공부하는 습관을 만들어두면, 지필고사가 시작되는 이후 학기에 큰 도움이 됩니다.",
      },
      {
        title: "중학교 학습 방식 적응",
        body: "초등학교보다 과목 수가 늘고 수업 방식도 달라지므로, 과목별 필기와 정리 방법을 자신에게 맞게 찾아가는 시기로 활용합니다.",
      },
    ],
  },
  {
    gradeSlug: "middle",
    subGradeSlug: "2",
    status: "published",
    intro:
      "중2는 본격적인 지필고사가 시작되며 과목별 난이도와 시험 범위가 눈에 띄게 늘어나는 시기입니다. 중1과 달리 성적이 실제로 기록에 남기 시작하므로, 시험 대비 방식을 정비할 필요가 있습니다.",
    notes: [
      {
        title: "지필고사 대비 방식 정비",
        body: "중1 자유학기제와 달리 중간·기말고사 범위와 일정이 명확해지므로, 시험 범위에 맞춘 계획적인 준비 방식을 이 시기에 자리잡아야 합니다.",
      },
      {
        title: "과목별 난이도 상승 대응",
        body: "특히 수학·영어는 중1보다 개념의 깊이가 급격히 늘어나는 경우가 많아, 이전 학기 개념이 흔들리지 않았는지 먼저 점검하는 것이 중요합니다.",
      },
      {
        title: "고등학교 대비 기초 다지기",
        body: "중2 성적은 이후 학기와 고등학교 학습에도 영향을 주는 경우가 많아, 무너진 과목이 있다면 방학 등을 활용해 미리 보완해두는 것이 좋습니다.",
      },
    ],
  },
  {
    gradeSlug: "high",
    subGradeSlug: "2",
    status: "published",
    intro:
      "고2는 선택과목 체계에 따라 진로와 연결된 과목을 본격적으로 학습하며, 내신과 모의고사를 함께 준비해야 하는 부담이 커지는 시기입니다. 고1보다 학습량과 난이도가 늘어나는 만큼 시간 관리가 특히 중요합니다.",
    notes: [
      {
        title: "선택과목 학습 전략",
        body: "진로와 연결된 선택과목을 본격적으로 배우기 시작하므로, 해당 과목의 개념을 확실히 다지며 진로 방향을 함께 구체화합니다.",
      },
      {
        title: "내신·모의고사 비중 조절",
        body: "학교 시험과 정기 모의고사 일정이 겹치는 경우가 많아, 시기별로 어느 쪽에 더 집중할지 우선순위를 정해 학습 시간을 배분합니다.",
      },
      {
        title: "고3 대비 취약 과목 정리",
        body: "고2까지 쌓인 내신·모의고사 성적을 바탕으로 취약한 과목을 파악해, 고3이 되기 전에 기초를 다시 다져두는 것이 좋습니다.",
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
