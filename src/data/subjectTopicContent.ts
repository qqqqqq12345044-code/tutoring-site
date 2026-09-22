/**
 * Content for a single subject-topic page (/subject/[slug]/[topicSlug], e.g.
 * /subject/english/syntax for 영어 구문) — the subject-level counterpart of
 * subGradeContent.ts, reusing the same published-content-gate pattern.
 *
 * Key relationships (enforced by convention, not types):
 * - subjectSlug must be a Subject.slug from src/data/subjects.ts.
 * - topicSlug must be one of that subject's topics[].slug.
 *
 * src/lib/indexability.ts's "subject-topic" case gates on isPublishedContent():
 * a topic only stays index+sitemap eligible once status is "published" AND
 * notes is non-empty. A "draft" entry, or no entry at all, is noindex/out-of-
 * sitemap — the parent subject page's existing topic card still renders,
 * just without a dedicated page's extra detail.
 *
 * Initial published set (2026-09): a handful of topics with genuinely
 * distinct, well-established search intent (구문/어휘/문법/내신/수능 대비 are
 * real, commonly searched sub-areas — not an exhaustive cross product of
 * every topic in subjects.ts). The remaining topics stay unpublished/noindex
 * rather than forcing thin, mechanically-generated content for every one.
 */
export interface SubjectTopicContent {
  subjectSlug: string;
  topicSlug: string;
  status: "draft" | "published";
  intro: string;
  notes: { title: string; body: string }[];
}

export const subjectTopicContents: SubjectTopicContent[] = [
  {
    subjectSlug: "english",
    topicSlug: "syntax",
    status: "published",
    intro:
      "영어 구문은 단어를 다 알아도 문장이 길어지면 해석이 막히는 학생에게 가장 먼저 확인해야 할 영역입니다. 문장을 의미 단위로 끊어 읽고 수식 관계를 파악하는 훈련을 통해 독해 속도와 정확도를 함께 끌어올립니다.",
    notes: [
      {
        title: "끊어 읽기 훈련",
        body: "긴 문장을 주어·동사·수식어 단위로 나누어 읽는 연습을 반복하면, 처음 보는 문장에서도 구조를 빠르게 파악할 수 있습니다.",
      },
      {
        title: "구문과 독해의 연결",
        body: "구문 분석만 따로 연습하면 실제 지문 독해로 이어지지 않는 경우가 많아, 분석한 구조를 바로 지문 문제에 적용하는 과정을 함께 진행합니다.",
      },
      {
        title: "내신·수능 서술 문제 대비",
        body: "서술형 영작이나 어법 문제도 결국 문장 구조 이해에서 출발하므로, 구문 학습은 내신과 수능 두 영역 모두에 도움이 됩니다.",
      },
    ],
  },
  {
    subjectSlug: "english",
    topicSlug: "vocab",
    status: "published",
    intro:
      "영어 어휘는 무작정 외우는 것보다 문맥 속에서 반복적으로 접하며 익힐 때 오래 기억에 남습니다. 학년과 목표 수준에 맞는 어휘를 선별하고, 지문·문제와 연결해 실제로 쓸 수 있는 어휘력으로 만드는 것이 목표입니다.",
    notes: [
      {
        title: "학년별 어휘 수준 설정",
        body: "교과서와 목표 시험(내신·수능) 어휘 목록을 기준으로 현재 학생의 어휘 수준을 먼저 확인하고, 우선순위를 정해 학습량을 조절합니다.",
      },
      {
        title: "문맥 기반 암기",
        body: "단어만 따로 외우기보다 예문이나 지문 속에서 단어의 쓰임을 함께 익히면 실제 독해에서 활용도가 높아집니다.",
      },
      {
        title: "반복 점검 주기 설정",
        body: "한 번 외운 단어도 시간이 지나면 잊어버리기 쉬워, 일정 주기로 다시 확인하는 누적 복습 계획을 함께 세웁니다.",
      },
    ],
  },
  {
    subjectSlug: "math",
    topicSlug: "suneung",
    status: "published",
    intro:
      "수학 수능 대비는 단순히 어려운 문제를 많이 푸는 것이 아니라, 영역별 출제 경향을 파악하고 시간 배분 전략을 함께 훈련하는 과정입니다. 현재 실력과 남은 기간을 고려해 우선순위 영역을 정하는 것이 중요합니다.",
    notes: [
      {
        title: "영역별 출제 경향 파악",
        body: "매 시험마다 반복적으로 출제되는 유형과 최근 변화가 있는 유형을 구분해, 학습 우선순위를 조정합니다.",
      },
      {
        title: "시간 배분 연습",
        body: "실전과 동일한 시간 제한 안에서 문제를 푸는 연습을 반복해, 시험 중 시간 관리에 대한 감각을 키웁니다.",
      },
      {
        title: "오답 원인 분석",
        body: "틀린 문제를 개념 부족인지 실수인지 구분해 기록하고, 같은 유형에서 반복되는 실수를 줄여나갑니다.",
      },
    ],
  },
  {
    subjectSlug: "math",
    topicSlug: "school-exam",
    status: "published",
    intro:
      "수학 내신 대비는 학교별 진도와 기출 문제 경향을 정확히 파악하는 것에서 시작합니다. 같은 단원이라도 학교마다 시험에서 강조하는 유형과 난이도가 다를 수 있어, 재학 중인 학교를 기준으로 준비하는 것이 중요합니다.",
    notes: [
      {
        title: "학교 진도·기출 확인",
        body: "학교 시험 범위와 최근 몇 회차 기출 문제 유형을 확인해, 어떤 개념이 자주 출제되는지 먼저 파악합니다.",
      },
      {
        title: "서술형 답안 작성 연습",
        body: "내신 시험은 서술형 배점이 큰 경우가 많아, 풀이 과정을 채점 기준에 맞춰 논리적으로 작성하는 연습을 함께 진행합니다.",
      },
      {
        title: "시험 일정 기반 계획",
        body: "중간·기말고사 일정을 기준으로 역산해 학습 계획을 세우고, 시험 직전에는 취약 유형 위주로 마무리 점검을 합니다.",
      },
    ],
  },
  {
    subjectSlug: "korean",
    topicSlug: "grammar",
    status: "published",
    intro:
      "국어 문법은 암기할 내용이 많아 보이지만, 실제로는 몇 가지 핵심 원리를 이해하면 대부분의 문제 유형에 적용할 수 있습니다. 헷갈리기 쉬운 개념을 예문과 함께 정리해 실전 문제 적용까지 연결합니다.",
    notes: [
      {
        title: "핵심 개념 정리",
        body: "품사, 문장 성분, 음운 변동 등 자주 출제되는 핵심 개념을 예문 중심으로 정리해 헷갈리는 부분을 구분합니다.",
      },
      {
        title: "기출 유형 적용",
        body: "개념을 이해한 뒤에는 실제 내신·수능 기출 문제에 바로 적용해보며, 이론과 문제 풀이 사이의 간극을 줄입니다.",
      },
      {
        title: "오답 노트 관리",
        body: "자주 틀리는 문법 개념을 따로 정리해두고, 반복적으로 점검하며 취약한 부분을 줄여나갑니다.",
      },
    ],
  },
];

export function getSubjectTopicContent(subjectSlug: string, topicSlug: string): SubjectTopicContent | undefined {
  return subjectTopicContents.find((c) => c.subjectSlug === subjectSlug && c.topicSlug === topicSlug);
}

/** Whether a subject-topic entry is complete enough to be shown/indexed. */
export function isPublishedContent(content: SubjectTopicContent | undefined): content is SubjectTopicContent {
  return Boolean(content && content.status === "published" && content.notes.length > 0);
}
