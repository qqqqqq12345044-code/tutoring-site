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
  {
    subjectSlug: "english",
    topicSlug: "grammar",
    status: "published",
    intro:
      "영어 문법은 규칙을 안다고 해서 바로 문제에 적용되는 것이 아니라, 실제 문장에서 반복적으로 틀리는 포인트를 짚어줘야 실력으로 이어지는 영역입니다. 규칙 암기에서 끝나지 않고 독해와 서술형까지 연결하는 연습을 함께 진행합니다.",
    notes: [
      {
        title: "자주 틀리는 포인트 정리",
        body: "시제, 수 일치, 관계대명사처럼 반복적으로 헷갈리는 항목을 예문과 함께 정리해 같은 실수를 줄여나갑니다.",
      },
      {
        title: "독해 지문에 바로 적용",
        body: "문법 규칙만 따로 외우면 실전에서 활용이 어려운 경우가 많아, 배운 규칙을 독해 지문 속 문장에서 직접 확인하는 과정을 함께 진행합니다.",
      },
      {
        title: "어법·서술형 문제 대비",
        body: "학교 시험의 어법 문제와 영작형 서술 문항은 결국 문법 이해에서 출발하므로, 자주 나오는 문형을 중심으로 답안 작성까지 연습합니다.",
      },
    ],
  },
  {
    subjectSlug: "english",
    topicSlug: "reading-comprehension",
    status: "published",
    intro:
      "영어 독해는 단어와 문법을 알아도 지문 유형에 따라 접근 방식이 달라져 어려움을 느끼는 경우가 많습니다. 유형별 읽기 전략과 시간 관리 방법을 함께 훈련해 정확도와 속도를 같이 끌어올립니다.",
    notes: [
      {
        title: "유형별 접근 전략",
        body: "주제 찾기, 세부 정보 파악, 빈칸 추론 등 지문 유형에 따라 확인해야 할 포인트가 다르므로, 유형을 구분해 접근법을 따로 연습합니다.",
      },
      {
        title: "실전 시간 배분",
        body: "정해진 시간 안에 여러 지문을 풀어야 하는 시험 특성상, 지문 길이에 맞춰 시간을 배분하는 연습을 반복해 실전 감각을 키웁니다.",
      },
      {
        title: "오답 원인 구분",
        body: "어휘 부족인지, 구문 이해 부족인지, 문제 유형 파악 실패인지 원인을 구분해 기록하면 같은 실수를 반복하지 않을 수 있습니다.",
      },
    ],
  },
  {
    subjectSlug: "english",
    topicSlug: "school-exam",
    status: "published",
    intro:
      "영어 내신은 학교 교과서 본문과 부교재를 기반으로 출제되는 경우가 많아, 다른 어떤 영역보다 학교 진도에 맞춘 준비가 중요합니다. 본문 분석부터 서술형 대비까지 시험 형식에 맞춰 학습합니다.",
    notes: [
      {
        title: "교과서 본문 선분석",
        body: "학교에서 다루는 교과서 본문의 문장 구조와 핵심 어휘, 문법 포인트를 미리 정리해두면 시험 직전 복습 부담을 크게 줄일 수 있습니다.",
      },
      {
        title: "학교별 출제 경향 확인",
        body: "같은 본문이라도 학교마다 자주 묻는 유형(빈칸, 어법, 서술형)이 다를 수 있어, 최근 기출을 참고해 준비 방향을 조정합니다.",
      },
      {
        title: "영작형 서술 답안 연습",
        body: "정해진 문형에 맞춰 정확한 문장을 완성하는 연습을 반복하면, 서술형에서 부분 감점을 줄일 수 있습니다.",
      },
    ],
  },
  {
    subjectSlug: "english",
    topicSlug: "suneung",
    status: "published",
    intro:
      "수능 영어는 학교 내신과 달리 정해진 시간 안에 다양한 유형의 지문을 빠르게 처리하는 능력이 필요한 시험입니다. 유형별 풀이 순서와 듣기·독해 시간 배분을 함께 훈련합니다.",
    notes: [
      {
        title: "유형별 풀이 순서",
        body: "대의 파악, 빈칸 추론, 순서 배열처럼 자주 출제되는 유형마다 접근 순서가 다르므로, 유형별 풀이 루틴을 정리해 반복 연습합니다.",
      },
      {
        title: "듣기·독해 시간 배분",
        body: "듣기 방송이 진행되는 시간을 활용해 독해 문제를 먼저 확인하는 등, 실전 시간 배분 방법을 반복 연습해 시험 중 여유를 만듭니다.",
      },
      {
        title: "고난도 지문 대비",
        body: "최근 수능은 어려운 지문의 비중이 늘고 있어, 긴 문장을 빠르게 끊어 읽는 구문 독해력을 함께 다져둘 필요가 있습니다.",
      },
    ],
  },
  {
    subjectSlug: "math",
    topicSlug: "concept",
    status: "published",
    intro:
      "수학은 공식을 외우기보다 원리를 이해해야 다음 단원으로 자연스럽게 이어지는 과목입니다. 개념을 스스로 설명할 수 있는 수준까지 이해하고, 이를 문제에 적용하는 연습을 함께 진행합니다.",
    notes: [
      {
        title: "원리부터 이해하기",
        body: "공식이 어떻게 만들어지는지 과정을 먼저 이해하면, 조건이 조금 바뀐 변형 문제에도 유연하게 대응할 수 있습니다.",
      },
      {
        title: "말로 설명해보는 연습",
        body: "배운 개념을 스스로 말이나 글로 설명해보면 이해가 부족한 지점이 드러나, 놓친 부분을 바로 확인할 수 있습니다.",
      },
      {
        title: "이전 단원과의 연결 확인",
        body: "수학은 이전 학년·단원의 개념이 다음 단원으로 이어지는 경우가 많아, 새 단원을 배우기 전 관련 개념을 함께 점검합니다.",
      },
    ],
  },
  {
    subjectSlug: "math",
    topicSlug: "problem-types",
    status: "published",
    intro:
      "수학 유형 학습은 단원별로 자주 나오는 대표 문제를 반복하며 풀이 방법을 체득하는 과정입니다. 문제 수를 늘리는 것이 목적이 아니라, 유형별 풀이 패턴을 몸에 익히는 것이 핵심입니다.",
    notes: [
      {
        title: "단원별 대표 유형 선별",
        body: "단원마다 시험에 자주 출제되는 대표 유형을 먼저 골라내고, 해당 유형에 집중해 반복 연습합니다.",
      },
      {
        title: "풀이 과정 단계별 정리",
        body: "같은 유형이라도 조건이 조금씩 달라질 수 있어, 풀이 과정을 단계별로 정리해두면 변형 문제에도 빠르게 적용할 수 있습니다.",
      },
      {
        title: "시간 제한 내 풀이 훈련",
        body: "유형을 충분히 익힌 뒤에는 실제 시험처럼 시간을 정해두고 풀어보며 실전 감각을 함께 기릅니다.",
      },
    ],
  },
  {
    subjectSlug: "korean",
    topicSlug: "reading",
    status: "published",
    intro:
      "국어 독서는 지문을 읽고도 핵심 내용을 정리하지 못해 문제 풀이로 이어지지 않는 경우가 많은 영역입니다. 지문의 구조를 파악하고 핵심 정보를 빠르게 찾는 훈련으로 독해력을 체계적으로 키웁니다.",
    notes: [
      {
        title: "지문 구조 파악",
        body: "문단별 역할과 글 전체의 논리 구조를 파악하는 훈련을 반복하면, 처음 보는 지문도 빠르게 이해할 수 있습니다.",
      },
      {
        title: "문제와 연결되는 정보 찾기",
        body: "지문에서 문제와 직접 연결되는 핵심 정보를 빠르게 찾아내는 연습을 통해 풀이 속도를 함께 높입니다.",
      },
      {
        title: "제재별 서술 방식 익히기",
        body: "과학·경제·인문 등 제재별로 자주 쓰이는 서술 방식을 미리 익혀두면 낯선 지문 앞에서도 당황하지 않고 접근할 수 있습니다.",
      },
    ],
  },
  {
    subjectSlug: "korean",
    topicSlug: "school-exam",
    status: "published",
    intro:
      "국어 내신은 학교 진도에 따라 다루는 작품과 지문이 정해져 있어, 수업 시간에 배운 해석과 개념을 정확히 정리하는 것이 중요합니다. 서술형 답안 작성까지 학교 시험 형식에 맞춰 준비합니다.",
    notes: [
      {
        title: "수업 중 해석 정리",
        body: "교과서 작품과 지문에 대해 수업에서 다룬 해석과 선생님이 강조한 포인트를 놓치지 않고 정리해두는 것이 대비의 기본입니다.",
      },
      {
        title: "학교별 기출 확인",
        body: "학교마다 자주 나오는 문제 유형(주제 파악, 표현 방식, 서술형)이 다를 수 있어 최근 기출을 참고해 준비 방향을 정합니다.",
      },
      {
        title: "근거 제시형 답안 연습",
        body: "채점 기준에 맞춰 지문 속 근거를 함께 제시하며 답안을 쓰는 연습을 반복해 서술형 감점을 줄여나갑니다.",
      },
    ],
  },
  {
    subjectSlug: "social",
    topicSlug: "school-exam",
    status: "published",
    intro:
      "사회 내신은 학교 진도와 수행평가 일정에 맞춰 비교적 넓은 범위를 체계적으로 정리해야 하는 과목입니다. 단원별 핵심 개념을 흐름으로 이해하고 학교 시험 형식에 맞춰 준비합니다.",
    notes: [
      {
        title: "단원별 흐름 정리",
        body: "시험 범위에 해당하는 단원의 핵심 개념을 흐름도나 표로 정리해 무작정 외우는 부담을 줄입니다.",
      },
      {
        title: "수행평가 일정 관리",
        body: "지필고사뿐 아니라 수행평가 비중도 큰 과목이므로, 학교 일정에 맞춰 미리 준비할 항목을 확인해둡니다.",
      },
      {
        title: "자료 해석형 문제 대비",
        body: "그래프나 통계 자료를 활용한 문제가 자주 출제되므로, 자료를 읽고 해석하는 연습을 함께 진행합니다.",
      },
    ],
  },
  {
    subjectSlug: "social",
    topicSlug: "social-tamgu",
    status: "published",
    intro:
      "사회탐구는 수능 사회 영역을 준비하는 학습으로, 응시하는 학년도에 따라 준비 범위가 달라집니다. 2028학년도 수능부터는 선택과목 없이 통합사회에서 출제되고 그 이전 학년도 응시자는 기존처럼 선택한 과목 중심이므로, 먼저 응시 학년도를 확인한 뒤 개념을 정리하고 기출 문제 분석으로 실전 감각을 키웁니다.",
    notes: [
      {
        title: "응시 학년도별 준비 범위",
        body: "2028학년도 수능 이전에 응시한다면 생활과 윤리, 사회문화 등 선택한 과목의 핵심 개념을 정리하고, 2028학년도 수능부터는 고1 통합사회의 개념을 영역 간 연결해 정리합니다.",
      },
      {
        title: "반복 출제 유형 분석",
        body: "과목별로 반복해서 나오는 문제 유형을 확인해 남은 기간 학습 우선순위를 정합니다.",
      },
      {
        title: "모의고사로 실력 점검",
        body: "정기적인 모의고사로 실력을 점검하고, 자주 틀리는 개념을 다시 확인하는 과정을 반복합니다.",
      },
    ],
  },
  {
    subjectSlug: "science",
    topicSlug: "concept",
    status: "published",
    intro:
      "과학은 개념을 이해했다고 생각해도 막상 문제를 풀면 다르게 느껴지는 경우가 많은 과목입니다. 원리를 그림과 예시로 이해하고, 이를 문제 풀이로 자연스럽게 연결하는 과정을 함께 진행합니다.",
    notes: [
      {
        title: "현상의 원리부터 이해",
        body: "어떤 현상이 왜 일어나는지 원리부터 이해하면, 조건이 바뀐 변형 문제에도 유연하게 대응할 수 있습니다.",
      },
      {
        title: "그림·도식으로 표현하기",
        body: "눈에 보이지 않는 개념은 그림이나 도식으로 표현해보는 과정을 거치면 이해와 기억에 함께 도움이 됩니다.",
      },
      {
        title: "이해한 개념 문제에 적용",
        body: "이해한 개념을 바로 문제에 적용해보며, 이론으로 아는 것과 실제로 푸는 것 사이의 간극을 줄여나갑니다.",
      },
    ],
  },
  {
    subjectSlug: "science",
    topicSlug: "science-tamgu",
    status: "published",
    intro:
      "과학탐구는 수능 과학 영역을 준비하는 학습으로, 응시하는 학년도에 따라 범위가 달라집니다. 2028학년도 수능부터는 선택과목 없이 통합과학에서 출제되고 그 이전 학년도 응시자는 기존처럼 선택한 과목의 개념 깊이와 계산 비중이 중요하므로, 응시 학년도에 맞춰 핵심 개념을 정리하고 기출 문제로 실전 감각을 키웁니다.",
    notes: [
      {
        title: "응시 학년도별 준비 범위",
        body: "2028학년도 수능 이전에 응시한다면 물리학, 화학, 생명과학, 지구과학 중 선택한 과목의 핵심 개념과 공식을 정리하고, 2028학년도 수능부터는 통합과학에서 영역 간 연결 개념을 함께 정리합니다.",
      },
      {
        title: "계산 문제 단계별 훈련",
        body: "과목에 따라 계산 비중이 높은 경우가 많아, 풀이 과정을 단계별로 나눠 연습하며 실수를 줄여나갑니다.",
      },
      {
        title: "기출 유형과 모의고사 활용",
        body: "과목별로 자주 출제되는 문제 유형을 확인하고, 모의고사를 통해 남은 기간의 학습 방향을 점검합니다.",
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
