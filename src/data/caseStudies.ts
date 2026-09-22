export interface CaseStudy {
  id: string;
  gradeLabel: string;
  subject: string;
  concern: string;
  approach: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "case-1",
    gradeLabel: "중2",
    subject: "수학",
    concern: "방정식 이후부터 개념이 흔들리고 시험 때 계산 실수가 반복되는 학생",
    approach: "취약 개념 재정리 → 학교 진도 병행 → 오답 유형 관리",
  },
  {
    id: "case-2",
    gradeLabel: "고1",
    subject: "영어",
    concern: "단어는 외우지만 긴 문장을 해석하기 어려운 학생",
    approach: "구문 분석 → 독해 적용 → 학교 교과서·부교재 대비",
  },
  {
    id: "case-3",
    gradeLabel: "초6",
    subject: "국어",
    concern: "글을 읽어도 핵심 내용을 정리하기 어려운 학생",
    approach: "문단 요약 → 핵심어 찾기 → 독해 문제 적용",
  },
  {
    id: "case-4",
    gradeLabel: "중3",
    subject: "사회",
    concern: "암기할 내용은 많은데 개념끼리 연결이 안 돼 헷갈리는 학생",
    approach: "단원별 핵심 개념 정리 → 개념 간 관계 도식화 → 기출 문제 적용",
  },
  {
    id: "case-5",
    gradeLabel: "고2",
    subject: "과학",
    concern: "개념은 아는데 계산이 들어간 문제만 나오면 막히는 학생",
    approach: "개념 재확인 → 계산 과정 단계별 분리 → 유형별 반복 연습",
  },
];
