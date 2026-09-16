export interface GuideCategory {
  slug: string;
  name: string;
}

export const guideCategories: GuideCategory[] = [
  { slug: "elementary-study", name: "초등 공부법" },
  { slug: "middle-naeshin", name: "중등 내신" },
  { slug: "high-naeshin", name: "고등 내신" },
  { slug: "suneung", name: "수능" },
  { slug: "korean-study", name: "국어 공부법" },
  { slug: "english-study", name: "영어 공부법" },
  { slug: "math-study", name: "수학 공부법" },
  { slug: "social-study", name: "사회 공부법" },
  { slug: "science-study", name: "과학 공부법" },
  { slug: "choosing-tutor", name: "과외 선택 가이드" },
];

export interface GuideArticle {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  body: string[];
}

export const guideArticles: GuideArticle[] = [
  {
    slug: "elementary-study-habit",
    categorySlug: "elementary-study",
    title: "초등학생, 공부 습관은 어떻게 잡아야 할까요",
    excerpt: "무리한 선행보다 중요한 것은 매일 일정한 시간에 학습하는 습관입니다.",
    body: [
      "초등학생 시기의 학습은 진도보다 습관 형성이 우선입니다. 매일 같은 시간에 짧게라도 책상에 앉는 루틴을 만드는 것이 이후 중·고등 학습의 바탕이 됩니다.",
      "특히 읽기 습관은 모든 과목의 기초가 됩니다. 글을 읽고 스스로 요약해보는 연습을 꾸준히 하면 국어뿐 아니라 사회, 과학 과목의 독해력에도 도움이 됩니다.",
      "선행보다 현재 학년의 개념을 정확히 이해하고 있는지 점검하는 것이 장기적으로 더 효과적입니다.",
    ],
  },
  {
    slug: "middle-first-exam",
    categorySlug: "middle-naeshin",
    title: "중학교 첫 시험, 무엇부터 준비해야 할까요",
    excerpt: "중간·기말고사 범위와 수행평가 일정을 함께 관리하는 것이 핵심입니다.",
    body: [
      "중학교 첫 시험은 초등학교와 달리 시험 범위가 명확하고 채점 기준이 엄격합니다. 시험 4~5주 전부터 과목별 범위를 확인하고 계획을 세우는 것이 좋습니다.",
      "수행평가는 지필고사만큼 비중이 크기 때문에 일정을 놓치지 않도록 별도로 관리해야 합니다.",
      "취약 과목이 있다면 시험 직전보다 평소 진도에 맞춰 꾸준히 보완하는 것이 시험 기간 부담을 줄이는 방법입니다.",
    ],
  },
  {
    slug: "high-naeshin-suneung-balance",
    categorySlug: "high-naeshin",
    title: "고등학생, 내신과 수능 준비 비중은 어떻게 나눠야 할까요",
    excerpt: "학년과 목표에 따라 내신과 수능 학습 비중을 다르게 가져가야 합니다.",
    body: [
      "고1~2 시기에는 내신 관리 비중이 상대적으로 높지만, 수능형 문제 풀이 경험도 함께 쌓아두는 것이 좋습니다.",
      "고3이 되면 내신 일정과 수능 준비를 동시에 관리해야 하므로 학습 계획을 미리 세워두는 것이 중요합니다.",
      "정답은 학생마다 다르기 때문에 현재 성적, 목표, 남은 시간을 함께 고려해 계획을 조정하는 것이 필요합니다.",
    ],
  },
  {
    slug: "math-weak-unit",
    categorySlug: "math-study",
    title: "수학 취약 단원, 어디서부터 다시 시작해야 할까요",
    excerpt: "현재 학년의 문제를 풀지 못하는 이유는 이전 개념에 있는 경우가 많습니다.",
    body: [
      "수학은 단원 간 연결이 강한 과목입니다. 현재 배우는 단원에서 막힌다면 이전 학년의 관련 개념을 먼저 점검해보는 것이 좋습니다.",
      "문제를 많이 푸는 것보다 왜 틀렸는지 원인을 파악하는 것이 취약 단원을 보완하는 핵심입니다.",
      "오답노트를 활용해 자주 틀리는 유형을 따로 관리하면 같은 실수를 반복하지 않는 데 도움이 됩니다.",
    ],
  },
  {
    slug: "choosing-visit-or-online",
    categorySlug: "choosing-tutor",
    title: "방문과외와 화상과외, 무엇을 선택해야 할까요",
    excerpt: "학생의 성향과 생활 패턴에 따라 맞는 수업 방식이 다릅니다.",
    body: [
      "방문과외는 학생의 학습 환경을 직접 확인하고 정해진 시간에 규칙적으로 수업할 수 있다는 장점이 있습니다.",
      "화상과외는 지역에 관계없이 선생님을 선택할 수 있고 일정 조율이 상대적으로 유연합니다.",
      "어느 한쪽이 무조건 낫다고 말하기는 어렵습니다. 학생의 성향과 가능한 시간을 고려해 상담을 통해 결정하는 것을 권합니다.",
    ],
  },
];

export function getGuideArticleBySlug(slug: string): GuideArticle | undefined {
  return guideArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): GuideArticle[] {
  return guideArticles.filter((a) => a.categorySlug === categorySlug);
}

/** Maps a guide category to the grade/subject it's most relevant to, for cross-linking. */
const categoryToGradeSlug: Record<string, string> = {
  "elementary-study": "elementary",
  "middle-naeshin": "middle",
  "high-naeshin": "high",
  suneung: "high",
};

const categoryToSubjectSlug: Record<string, string> = {
  "korean-study": "korean",
  "english-study": "english",
  "math-study": "math",
  "social-study": "social",
  "science-study": "science",
};

export function getRelatedGradeSlug(categorySlug: string): string | undefined {
  return categoryToGradeSlug[categorySlug];
}

export function getRelatedSubjectSlug(categorySlug: string): string | undefined {
  return categoryToSubjectSlug[categorySlug];
}

export function getArticlesByGradeSlug(gradeSlug: string): GuideArticle[] {
  const categorySlugs = Object.entries(categoryToGradeSlug)
    .filter(([, g]) => g === gradeSlug)
    .map(([c]) => c);
  return guideArticles.filter((a) => categorySlugs.includes(a.categorySlug));
}

export function getArticlesBySubjectSlug(subjectSlug: string): GuideArticle[] {
  const categorySlugs = Object.entries(categoryToSubjectSlug)
    .filter(([, s]) => s === subjectSlug)
    .map(([c]) => c);
  return guideArticles.filter((a) => categorySlugs.includes(a.categorySlug));
}
