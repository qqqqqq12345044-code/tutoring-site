export interface Grade {
  slug: string;
  name: string;
  label: string;
  description: string;
  keywords: string[];
  studyGoals: { title: string; description: string }[];
  worries: string[];
  subGrades: { slug: string; label: string; note: string }[];
}

export const grades: Grade[] = [
  {
    slug: "elementary",
    name: "초등",
    label: "초등학생",
    description: "기초 개념과 공부 습관을 함께 만드는 시기",
    keywords: ["기초", "학습습관", "개념이해"],
    studyGoals: [
      { title: "공부 습관", description: "매일 일정한 시간에 학습하는 루틴을 만듭니다." },
      { title: "기초 개념", description: "다음 학년 학습의 바탕이 되는 개념을 정확히 이해합니다." },
      { title: "읽기와 이해", description: "글을 읽고 스스로 정리하는 힘을 기릅니다." },
      { title: "중학교 준비", description: "중학교 학습량과 난이도에 미리 적응합니다." },
    ],
    worries: [
      "공부 습관이 잡히지 않아 스스로 학습하기 어려운 경우",
      "학년이 올라갈수록 학습량이 늘어 미리 대비하고 싶은 경우",
      "기초 개념을 놓치고 다음 진도를 나가는 것이 걱정되는 경우",
      "중학교 학습 방식에 미리 적응시키고 싶은 경우",
    ],
    subGrades: [
      { slug: "1", label: "초1", note: "학교 생활과 공부 습관을 만드는 시기입니다." },
      { slug: "2", label: "초2", note: "읽기와 기본 연산을 탄탄히 다지는 시기입니다." },
      { slug: "3", label: "초3", note: "본격적으로 교과 학습량이 늘어나는 시기입니다." },
      { slug: "4", label: "초4", note: "과목별 개념이 확장되며 이해력이 중요해지는 시기입니다." },
      { slug: "5", label: "초5", note: "중학교 학습을 대비해 기초를 점검하는 시기입니다." },
      { slug: "6", label: "초6", note: "중학교 진학 전 학습 습관과 개념을 정리하는 시기입니다." },
    ],
  },
  {
    slug: "middle",
    name: "중등",
    label: "중학생",
    description: "본격적인 내신 관리와 과목별 학습 전략이 필요한 시기",
    keywords: ["내신", "취약단원", "시험대비"],
    studyGoals: [
      { title: "첫 본격 내신", description: "중간·기말고사 시험 범위에 맞춘 학습 계획을 세웁니다." },
      { title: "학교 시험 대비", description: "학교별 시험 일정과 수행평가를 함께 관리합니다." },
      { title: "취약과목 보완", description: "과목별로 막힌 부분을 정확히 찾아 보완합니다." },
      { title: "고등 과정 준비", description: "고등학교 학습에 필요한 기본기를 다집니다." },
    ],
    worries: [
      "초등학교 때와 달리 시험 난이도와 범위가 갑자기 늘어난 느낌이에요",
      "과목마다 공부해야 할 양이 많아져서 시간 관리가 어려워요",
      "한 과목이 무너지면 다른 과목 공부할 시간까지 부족해져요",
      "고등학교 진학 전에 부족한 부분을 미리 채우고 싶어요",
    ],
    subGrades: [
      { slug: "1", label: "중1", note: "자유학기제와 함께 학습 습관과 기초를 다지는 시기입니다." },
      { slug: "2", label: "중2", note: "본격적인 내신 시험이 시작되며 난이도가 높아지는 시기입니다." },
      { slug: "3", label: "중3", note: "고등학교 진학을 앞두고 전 과목을 정리하는 시기입니다." },
    ],
  },
  {
    slug: "high",
    name: "고등",
    label: "고등학생",
    description: "학교 내신과 모의고사·수능을 함께 관리해야 하는 시기",
    keywords: ["내신", "수능", "입시"],
    studyGoals: [
      { title: "내신 관리", description: "학교 시험 범위와 기출 경향에 맞춘 집중 학습을 합니다." },
      { title: "모의고사", description: "정기적인 모의고사로 실력을 점검하고 약점을 보완합니다." },
      { title: "수능 대비", description: "수능 영역별 문제풀이 전략과 학습 계획을 세웁니다." },
      { title: "학년별 전략", description: "학년과 목표에 맞춰 내신과 수능 비중을 조절합니다." },
    ],
    worries: [
      "내신과 모의고사를 동시에 준비하려니 시간이 부족해요",
      "과목별로 우선순위를 어떻게 정해야 할지 막막해요",
      "성적은 나오는데 정체된 것 같아 방법을 바꾸고 싶어요",
      "수능까지 남은 기간 동안 학습 계획을 세우기 어려워요",
    ],
    subGrades: [
      { slug: "1", label: "고1", note: "고등 학습 방식에 적응하며 내신 기초를 다지는 시기입니다." },
      { slug: "2", label: "고2", note: "내신과 모의고사를 함께 준비하며 진로를 구체화하는 시기입니다." },
      { slug: "3", label: "고3", note: "수능과 최종 내신을 마무리하며 지원 전략을 세우는 시기입니다." },
    ],
  },
];

export function getGradeBySlug(slug: string): Grade | undefined {
  return grades.find((g) => g.slug === slug);
}
