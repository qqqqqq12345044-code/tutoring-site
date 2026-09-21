export interface FAQ {
  slug: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    slug: "subject-scope",
    question: "어떤 과목을 수업할 수 있나요?",
    answer:
      "국어, 영어, 수학, 사회, 과학을 중심으로 학생의 학년과 목표에 맞는 1:1 수업을 상담할 수 있습니다.",
  },
  {
    slug: "lesson-type",
    question: "방문과외와 화상과외 모두 가능한가요?",
    answer:
      "지역과 과목, 선생님 일정에 따라 가능한 방식이 달라질 수 있습니다. 상담 시 희망 방식을 알려주시면 확인해드립니다.",
  },
  {
    slug: "elementary-tutoring",
    question: "초등학생도 과외가 가능한가요?",
    answer:
      "가능합니다. 초등 과정은 무리한 선행보다는 기초 개념과 학습 습관 형성을 중요하게 봅니다.",
  },
  {
    slug: "pricing",
    question: "수업료는 얼마인가요?",
    answer:
      "학년, 과목, 수업 횟수, 수업 방식 등에 따라 달라질 수 있어 상담 이후 정확히 안내해드립니다.",
  },
  {
    slug: "teacher-match",
    question: "선생님이 학생과 맞지 않으면 어떻게 하나요?",
    answer: "상담을 통해 학생 상황을 확인하고 조율합니다.",
  },
  {
    slug: "consult-commitment",
    question: "상담을 받으면 바로 수업해야 하나요?",
    answer:
      "상담은 현재 상황과 수업 가능 여부를 확인하기 위한 과정입니다. 상담 후 진행 여부는 편하게 결정하실 수 있습니다.",
  },
  {
    slug: "program-scope",
    question: "국어·영어·수학 같은 교과목 외에 다른 프로그램도 상담할 수 있나요?",
    answer:
      "네, 코딩·검정고시·한국어처럼 정규 교과목 외 학습이 필요한 경우에도 학생의 목표와 현재 수준에 맞춘 1:1 프로그램을 상담할 수 있습니다.",
  },
];

export const homeFaqSlugs = [
  "subject-scope",
  "lesson-type",
  "elementary-tutoring",
  "pricing",
  "teacher-match",
  "consult-commitment",
];

export function getFaqsBySlugs(slugs: string[]): FAQ[] {
  return slugs
    .map((slug) => faqs.find((f) => f.slug === slug))
    .filter((f): f is FAQ => Boolean(f));
}
