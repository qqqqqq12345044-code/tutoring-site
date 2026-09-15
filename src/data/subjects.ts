export interface SubjectTopic {
  title: string;
  description: string;
}

export interface Subject {
  slug: string;
  name: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  topics: SubjectTopic[];
  gradeStrategies: {
    grade: "초등" | "중등" | "고등";
    description: string;
  }[];
  painPoints: string[];
  process: { title: string; body: string }[];
  faqSlugs: string[];
}

export const subjects: Subject[] = [
  {
    slug: "korean",
    name: "국어",
    shortDescription: "문학·독서·문법부터 학교별 내신과 수능 대비까지",
    heroTitle: "글의 구조를 읽는 힘부터 키우는\n1:1 국어과외",
    heroDescription:
      "국어는 단순 암기가 아니라 글을 읽고 구조화하는 연습이 필요한 과목입니다. 학생이 어디에서 막히는지부터 확인하고 독서, 문학, 문법 영역을 균형 있게 학습합니다.",
    topics: [
      { title: "독서", description: "지문의 구조를 파악하고 핵심 정보를 빠르게 찾는 훈련" },
      { title: "문학", description: "작품의 맥락과 표현 방식을 이해하는 감상 학습" },
      { title: "문법", description: "헷갈리기 쉬운 문법 개념을 예문 중심으로 정리" },
      { title: "서술형", description: "채점 기준에 맞춰 답안을 구성하는 연습" },
      { title: "내신", description: "학교 진도와 기출 경향에 맞춘 시험 대비" },
      { title: "모의고사", description: "정기적인 모의고사 분석으로 취약 유형 관리" },
      { title: "수능", description: "수능 국어 영역별 문제 풀이 전략 학습" },
    ],
    gradeStrategies: [
      { grade: "초등", description: "글을 읽고 핵심 내용을 정리하는 독해 습관을 만듭니다." },
      { grade: "중등", description: "문학·비문학 지문 분석과 서술형 답안 작성을 함께 연습합니다." },
      { grade: "고등", description: "내신 기출과 수능 기출을 병행하며 실전 감각을 키웁니다." },
    ],
    painPoints: [
      "글을 읽고도 핵심 내용을 정리하기 어려운 경우",
      "문학 작품의 맥락과 표현을 해석하기 어려운 경우",
      "서술형 답안을 채점 기준에 맞게 쓰기 어려운 경우",
      "학교 시험 범위에 맞춰 체계적으로 준비하고 싶은 경우",
    ],
    process: [
      { title: "현재 독해 수준 확인", body: "지문을 읽고 이해하는 정도를 먼저 확인합니다." },
      { title: "취약 영역 확인", body: "독서·문학·문법 중 보완이 필요한 영역을 찾습니다." },
      { title: "학교 진도·목표 반영", body: "학교 진도와 시험 범위, 목표를 계획에 반영합니다." },
      { title: "지문 적용 학습", body: "다양한 지문에 읽기 전략을 적용해봅니다." },
      { title: "서술형·오답 관리", body: "서술형 답안과 틀린 문제를 함께 점검합니다." },
    ],
    faqSlugs: ["subject-scope", "lesson-type", "elementary-tutoring", "pricing"],
  },
  {
    slug: "english",
    name: "영어",
    shortDescription: "어휘·문법·독해·서술형·내신·수능 영역별 맞춤 학습",
    heroTitle: "문장 구조부터 실전 독해까지\n1:1 영어과외",
    heroDescription:
      "단어를 많이 외워도 긴 문장 앞에서 막히는 경우가 많습니다. 구문 분석과 독해 적용을 연결해 학교 내신과 수능까지 이어지는 학습을 설계합니다.",
    topics: [
      { title: "어휘", description: "학년 수준에 맞는 어휘를 문맥 속에서 익히는 학습" },
      { title: "문법", description: "글쓰기와 독해에 바로 쓸 수 있는 실전 문법 정리" },
      { title: "구문", description: "긴 문장을 끊어 읽고 구조를 분석하는 훈련" },
      { title: "독해", description: "지문 유형별 독해 전략과 시간 관리 연습" },
      { title: "서술형", description: "학교 시험 서술형 문항에 맞춘 영작 연습" },
      { title: "학교 내신", description: "교과서 본문과 부교재를 기반으로 한 내신 대비" },
      { title: "모의고사", description: "듣기·독해 영역별 모의고사 분석" },
      { title: "수능", description: "수능 영어 유형별 풀이 전략 학습" },
    ],
    gradeStrategies: [
      { grade: "초등", description: "파닉스 이후 리딩 습관과 기초 문장 구조를 익힙니다." },
      { grade: "중등", description: "문법 체계와 독해 훈련을 병행하며 내신을 준비합니다." },
      { grade: "고등", description: "구문 분석을 바탕으로 내신과 수능 독해를 함께 관리합니다." },
    ],
    painPoints: [
      "단어는 아는데 문장이 길어지면 해석이 막히는 경우",
      "문법 규칙은 알지만 독해에 바로 적용하지 못하는 경우",
      "서술형·영작 문제에서 어떻게 답을 써야 할지 막막한 경우",
      "학교 내신과 수능 대비를 함께 준비하고 싶은 경우",
    ],
    process: [
      { title: "현재 실력 확인", body: "어휘·문법·독해 수준을 먼저 확인합니다." },
      { title: "취약 영역 확인", body: "구문 분석과 독해 중 막히는 지점을 찾습니다." },
      { title: "학교 진도·목표 반영", body: "학교 진도와 시험 일정, 목표를 계획에 반영합니다." },
      { title: "지문 적용 학습", body: "구문 분석을 실제 지문 독해에 적용해봅니다." },
      { title: "서술형·오답 관리", body: "서술형 답안과 오답을 함께 점검합니다." },
    ],
    faqSlugs: ["subject-scope", "lesson-type", "pricing", "teacher-match"],
  },
  {
    slug: "math",
    name: "수학",
    shortDescription: "개념 이해부터 유형 학습·심화·내신·수능까지 단계별 관리",
    heroTitle: "학생의 현재 수준부터 확인하는\n1:1 수학과외",
    heroDescription:
      "수학은 이전 단원의 개념이 다음 단원과 이어지는 과목입니다. 막힌 지점을 정확히 찾아 취약 개념을 보완하고 학교 진도와 목표에 맞는 문제 유형을 함께 학습합니다.",
    topics: [
      { title: "개념 학습", description: "공식 암기가 아닌 원리 이해 중심의 개념 정리" },
      { title: "취약 단원 보완", description: "이전 학년에서 놓친 개념을 함께 확인하고 메꾸는 학습" },
      { title: "유형 학습", description: "단원별 대표 유형을 반복하며 풀이 방법을 체득" },
      { title: "심화 학습", description: "목표에 따라 난이도 높은 문제로 사고력 확장" },
      { title: "내신 대비", description: "학교 시험 범위와 기출 경향에 맞춘 집중 관리" },
      { title: "수능 대비", description: "수능 수학 영역별 문제풀이 전략과 시간 배분 연습" },
    ],
    gradeStrategies: [
      { grade: "초등", description: "연산 정확도와 함께 개념을 말로 설명할 수 있는 이해력을 기릅니다." },
      { grade: "중등", description: "단원 간 연결고리를 확인하며 학교 진도와 시험 대비를 병행합니다." },
      { grade: "고등", description: "내신과 모의고사 학습 비중을 상황에 맞게 배분합니다." },
    ],
    painPoints: [
      "이전 단원의 개념이 쌓이지 않아 지금 진도를 따라가기 어려운 경우",
      "개념은 이해했는데 비슷한 유형에서 반복해서 틀리는 경우",
      "학교 시험 범위에 맞춰 계획적으로 준비하고 싶은 경우",
      "혼자 문제를 풀 때 어디서 막혔는지 스스로 확인하기 어려운 경우",
    ],
    process: [
      { title: "현재 수준 확인", body: "진단을 통해 학생이 어디에서 막히는지 먼저 확인합니다." },
      { title: "취약 단원 확인", body: "이전 학년 개념 중 보완이 필요한 부분을 함께 찾습니다." },
      { title: "학교 진도·목표 반영", body: "학교 진도와 시험 일정, 학생의 목표를 계획에 반영합니다." },
      { title: "문제 적용", body: "이해한 개념을 다양한 유형의 문제에 적용해봅니다." },
      { title: "오답 관리", body: "틀린 문제를 분석하고 같은 실수를 반복하지 않도록 관리합니다." },
    ],
    faqSlugs: ["subject-scope", "lesson-type", "pricing", "teacher-match"],
  },
  {
    slug: "social",
    name: "사회",
    shortDescription: "개념 구조화와 암기 전략부터 내신·사회탐구 대비까지",
    heroTitle: "흐름으로 이해하고 오래 기억하는\n1:1 사회과외",
    heroDescription:
      "사회는 단순 암기보다 개념 사이의 흐름과 구조를 이해할 때 오래 기억됩니다. 단원별 핵심 구조를 잡고 학교 시험과 사회탐구 대비까지 연결합니다.",
    topics: [
      { title: "개념 구조화", description: "단원별 핵심 개념을 흐름도로 정리하는 학습" },
      { title: "암기 전략", description: "무작정 외우지 않고 연결지어 기억하는 방법 학습" },
      { title: "자료 해석", description: "그래프·지도·통계 자료를 해석하는 연습" },
      { title: "학교 내신", description: "학교 진도와 수행평가 일정에 맞춘 시험 대비" },
      { title: "사회탐구", description: "고등 사회탐구 과목별 개념 정리와 기출 분석" },
    ],
    gradeStrategies: [
      { grade: "초등", description: "사회 현상에 관심을 갖고 기본 개념 용어를 익힙니다." },
      { grade: "중등", description: "단원별 구조를 잡고 학교 시험 범위에 맞춰 정리합니다." },
      { grade: "고등", description: "선택 과목의 개념 정리와 기출 문제 분석을 병행합니다." },
    ],
    painPoints: [
      "개념을 외워도 금방 잊어버리는 경우",
      "그래프나 통계 자료를 해석하기 어려운 경우",
      "단원 간 흐름이 연결되지 않아 헷갈리는 경우",
      "학교 시험 범위에 맞춰 정리가 필요한 경우",
    ],
    process: [
      { title: "현재 이해도 확인", body: "단원별로 알고 있는 개념과 헷갈리는 부분을 확인합니다." },
      { title: "취약 단원 확인", body: "흐름이 끊기는 단원을 함께 찾습니다." },
      { title: "학교 진도·목표 반영", body: "학교 진도와 수행평가 일정을 계획에 반영합니다." },
      { title: "자료 해석 연습", body: "그래프·통계·지도 자료를 문제에 적용해봅니다." },
      { title: "오답 관리", body: "틀린 문제를 분석하고 개념을 다시 정리합니다." },
    ],
    faqSlugs: ["subject-scope", "lesson-type", "pricing"],
  },
  {
    slug: "science",
    name: "과학",
    shortDescription: "개념 이해와 문제 적용을 연결하는 내신·과학탐구 맞춤 학습",
    heroTitle: "개념과 문제풀이를 함께 연결하는\n1:1 과학과외",
    heroDescription:
      "과학은 개념을 이해해도 문제에 적용하는 과정에서 막히는 경우가 많습니다. 개념 이해와 문제 적용을 함께 훈련해 학교 시험과 과학탐구까지 대비합니다.",
    topics: [
      { title: "개념 이해", description: "원리를 그림과 예시로 이해하는 개념 학습" },
      { title: "문제 적용", description: "이해한 개념을 실전 문제에 적용하는 훈련" },
      { title: "물리", description: "물리 단원별 개념과 계산 문제 풀이 연습" },
      { title: "화학", description: "화학 개념과 반응식, 계산 문제 학습" },
      { title: "생명과학", description: "생명과학 개념 구조화와 암기 전략" },
      { title: "지구과학", description: "지구과학 개념과 자료 해석 연습" },
      { title: "과학탐구", description: "고등 과학탐구 과목별 기출 문제 분석" },
    ],
    gradeStrategies: [
      { grade: "초등", description: "실험과 관찰을 바탕으로 과학적 사고의 기초를 다집니다." },
      { grade: "중등", description: "개념 이해와 문제 적용을 함께 훈련하며 내신을 준비합니다." },
      { grade: "고등", description: "선택 과목의 심화 개념과 기출 유형을 집중 관리합니다." },
    ],
    painPoints: [
      "개념은 이해했는데 문제에 적용하지 못하는 경우",
      "계산 과정에서 자주 실수가 나오는 경우",
      "단원별 개념이 헷갈려 정리가 필요한 경우",
      "학교 시험 범위에 맞춰 준비하고 싶은 경우",
    ],
    process: [
      { title: "현재 이해도 확인", body: "개념 이해와 문제 적용 중 막히는 지점을 확인합니다." },
      { title: "취약 단원 확인", body: "보완이 필요한 단원과 계산 유형을 찾습니다." },
      { title: "학교 진도·목표 반영", body: "학교 진도와 시험 일정을 계획에 반영합니다." },
      { title: "문제 적용", body: "이해한 개념을 실전 문제에 적용해봅니다." },
      { title: "오답 관리", body: "틀린 문제의 원인을 분석하고 다시 정리합니다." },
    ],
    faqSlugs: ["subject-scope", "lesson-type", "pricing"],
  },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}
