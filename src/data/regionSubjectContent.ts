export interface RegionSubjectContent {
  regionSlug: string;
  subjectSlug: string;
  intro: string;
  gradeSections: { title: string; body: string }[];
}

export const regionSubjectContents: RegionSubjectContent[] = [
  {
    regionSlug: "suwon",
    subjectSlug: "math",
    intro:
      "수학은 같은 학년이라도 학생마다 막히는 지점이 다릅니다. 현재 개념 이해도와 학교 진도, 목표를 확인하고 필요한 부분부터 1:1로 학습합니다.",
    gradeSections: [
      {
        title: "수원 초등 수학과외",
        body: "기초 연산뿐 아니라 개념을 정확히 이해하고 설명할 수 있도록 수업 방향을 잡습니다.",
      },
      {
        title: "수원 중등 수학과외",
        body: "중학교부터 단원 간 연결이 강해지는 만큼 취약한 이전 개념을 함께 확인하고 학교 진도와 시험 대비를 병행합니다.",
      },
      {
        title: "수원 고등 수학과외",
        body: "내신과 모의고사 학습을 학생 상황에 맞춰 배분하고 취약 단원과 문제 유형을 집중적으로 관리합니다.",
      },
    ],
  },
  {
    regionSlug: "suwon",
    subjectSlug: "english",
    intro:
      "영어는 단어를 많이 알아도 문장이 길어지면 해석이 막히는 경우가 많습니다. 구문 분석과 독해 적용을 연결해 학교 진도와 목표에 맞는 학습을 설계합니다.",
    gradeSections: [
      {
        title: "수원 초등 영어과외",
        body: "리딩 습관과 기초 문장 구조를 익히며 영어에 대한 자신감을 함께 쌓습니다.",
      },
      {
        title: "수원 중등 영어과외",
        body: "문법 체계를 정리하고 교과서·부교재 독해를 병행하며 학교 내신을 대비합니다.",
      },
      {
        title: "수원 고등 영어과외",
        body: "구문 분석을 바탕으로 내신과 모의고사 독해를 함께 관리하고 서술형 대비까지 연결합니다.",
      },
    ],
  },
];

export function getRegionSubjectContent(
  regionSlug: string,
  subjectSlug: string
): RegionSubjectContent | undefined {
  return regionSubjectContents.find(
    (c) => c.regionSlug === regionSlug && c.subjectSlug === subjectSlug
  );
}
