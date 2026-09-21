/**
 * "Program" track — non-교과목 learning tracks (코딩, 검정고시, 한국어) that don't
 * belong in subjects.ts. subjects.ts models regular school subjects with
 * grade-tiered strategies (초/중/고); these programs have their own audience
 * and structure instead, so they get a separate data model rather than being
 * force-fit into Subject's shape.
 *
 * Mirrors the region-combination pattern used for subjects: see
 * src/data/regionProgramContent.ts for the (region × program) content gate.
 */
export interface ProgramTopic {
  title: string;
  description: string;
}

export interface Program {
  slug: string;
  name: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  /** Who this program is for — replaces Subject's grade-tiered strategies, since these tracks aren't grade-banded the same way. */
  targetAudience: string;
  topics: ProgramTopic[];
  painPoints: string[];
  process: { title: string; body: string }[];
  faqSlugs: string[];
}

export const programs: Program[] = [
  {
    slug: "coding",
    name: "코딩",
    shortDescription: "블록 코딩 기초부터 실제 프로젝트 제작까지 단계별로 배우는 1:1 코딩과외",
    heroTitle: "만들면서 배우는\n1:1 코딩과외",
    heroDescription:
      "코딩은 이론만 배우면 금방 흥미를 잃기 쉬운 분야입니다. 학생의 연령과 경험에 맞춰 블록 코딩이나 텍스트 언어 중 적절한 도구를 선택하고, 작은 프로젝트를 직접 완성해보며 학습합니다.",
    targetAudience:
      "코딩을 처음 접하는 초등학생부터, 진로 탐색 차원에서 프로그래밍을 배우고 싶은 중·고등학생까지 폭넓게 상담할 수 있습니다.",
    topics: [
      { title: "블록 코딩", description: "스크래치 등 블록 기반 도구로 논리적 사고와 순서 개념을 익히는 학습" },
      { title: "텍스트 언어 입문", description: "파이썬 등 실제 코드를 입력하며 문법과 구조를 이해하는 학습" },
      { title: "알고리즘 기초", description: "조건문·반복문 등 프로그램의 기본 흐름을 문제 풀이로 익히는 학습" },
      { title: "프로젝트 제작", description: "배운 내용을 활용해 간단한 게임이나 프로그램을 직접 완성하는 학습" },
    ],
    painPoints: [
      "코딩을 배워보고 싶은데 어디서부터 시작해야 할지 모르는 경우",
      "혼자 강의만 보다가 막히는 부분에서 진도가 멈춘 경우",
      "학교나 학원 수업 속도가 학생 수준과 맞지 않는 경우",
      "결과물을 직접 만들어보며 흥미를 이어가고 싶은 경우",
    ],
    process: [
      { title: "현재 경험 확인", body: "코딩 경험 유무와 관심 분야를 먼저 확인합니다." },
      { title: "도구·언어 선택", body: "학생 연령과 목표에 맞는 도구와 언어를 정합니다." },
      { title: "기초 개념 학습", body: "순서도, 조건문, 반복문 등 기본 개념을 익힙니다." },
      { title: "직접 만들어보기", body: "배운 개념을 작은 프로젝트에 적용해봅니다." },
      { title: "점검·확장", body: "완성한 결과물을 점검하고 다음 목표를 정합니다." },
    ],
    faqSlugs: ["program-scope", "lesson-type", "pricing", "teacher-match"],
  },
  {
    slug: "ged",
    name: "검정고시",
    shortDescription: "초졸·중졸·고졸 학력 인정 시험인 검정고시를 준비하는 과목별 맞춤 학습",
    heroTitle: "합격까지 남은 과목만\n집중적으로 준비하는 검정고시과외",
    heroDescription:
      "검정고시는 정규 학교를 다니지 않거나 조기에 학력을 인정받으려는 학생·성인이 응시하는 국가 인정 시험입니다. 과목별 시험 점수를 기준으로 합격 여부가 결정되는 절대평가 방식이라, 부족한 과목을 정확히 찾아 집중적으로 준비하는 것이 중요합니다.",
    targetAudience:
      "정규 학교를 다니지 않는 청소년, 조기 졸업이나 대입을 목표로 학력을 인정받으려는 학생, 학업을 중단했다가 다시 준비하는 성인까지 상담할 수 있습니다.",
    topics: [
      { title: "과목별 진단", description: "국어·영어·수학 등 응시 과목의 현재 실력을 먼저 확인하는 진단 학습" },
      { title: "핵심 개념 정리", description: "출제 범위 내 핵심 개념을 우선순위로 정리하는 학습" },
      { title: "기출 문제 풀이", description: "이전 회차 기출 문제를 풀며 출제 유형에 익숙해지는 학습" },
      { title: "취약 과목 집중", description: "합격 기준에 못 미치는 과목을 집중적으로 보완하는 학습" },
    ],
    painPoints: [
      "혼자 준비하려니 어떤 과목부터 시작해야 할지 막막한 경우",
      "특정 과목만 점수가 낮아 합격 기준을 채우지 못하는 경우",
      "학교를 다니지 않아 최근 출제 경향을 확인하기 어려운 경우",
      "짧은 기간 안에 시험을 준비해야 하는 경우",
    ],
    process: [
      { title: "현재 수준 확인", body: "응시 과목별 현재 실력과 준비 기간을 확인합니다." },
      { title: "과목 우선순위 설정", body: "합격 기준에 못 미치는 과목부터 우선순위를 정합니다." },
      { title: "핵심 개념 학습", body: "출제 범위 내 핵심 개념을 정리하며 학습합니다." },
      { title: "기출 문제 적용", body: "기출 문제를 풀며 실전 감각을 익힙니다." },
      { title: "모의 점검", body: "모의 채점으로 합격 가능성을 점검하고 남은 기간 계획을 조정합니다." },
    ],
    faqSlugs: ["program-scope", "lesson-type", "pricing", "consult-commitment"],
  },
  {
    slug: "korean-language",
    name: "한국어",
    shortDescription: "학교 수업을 한국어로 따라가야 하는 학생을 위한 맞춤 한국어 학습",
    heroTitle: "학교 생활에 필요한 한국어부터\n차근차근 배우는 한국어과외",
    heroDescription:
      "한국어가 모국어가 아니거나 가정에서 주로 다른 언어를 쓰는 학생은 일상 회화는 가능해도 학교 교과서의 문장과 어휘에서 막히는 경우가 많습니다. 현재 한국어 수준을 먼저 확인하고, 일상 회화와 학교 학습에 필요한 한국어를 함께 준비합니다.",
    targetAudience:
      "한국어가 익숙하지 않은 다문화가정·재외동포 자녀, 학교 수업을 한국어로 따라가기 어려운 외국인 학생, 한국어 기초부터 체계적으로 배우고 싶은 학생과 성인까지 상담할 수 있습니다.",
    topics: [
      { title: "기초 회화", description: "일상생활에서 바로 쓸 수 있는 표현을 중심으로 말하기·듣기를 익히는 학습" },
      { title: "읽기·쓰기", description: "한글 자모 원리부터 문장 단위 읽기·쓰기까지 단계별로 다지는 학습" },
      { title: "학습 한국어", description: "교과서에 등장하는 어휘와 문장 구조를 이해하는 학교 학습 연계 한국어" },
      { title: "어휘·표현 확장", description: "학년과 상황에 맞는 어휘와 표현을 문맥 속에서 익히는 학습" },
    ],
    painPoints: [
      "일상 대화는 가능한데 학교 교과서 문장은 이해하기 어려운 경우",
      "한글 읽기·쓰기 기초부터 다시 다져야 하는 경우",
      "또래보다 어휘량이 부족해 수업을 따라가기 힘든 경우",
      "체계적인 학습 계획 없이 한국어를 독학해온 경우",
    ],
    process: [
      { title: "현재 수준 확인", body: "듣기·말하기·읽기·쓰기 영역별 현재 수준을 먼저 확인합니다." },
      { title: "학습 목표 설정", body: "일상 회화, 학교 학습 등 필요한 목표를 함께 정합니다." },
      { title: "기초 다지기", body: "한글 자모와 기본 문장 구조부터 순서대로 학습합니다." },
      { title: "실생활·교과 적용", body: "익힌 표현을 실제 대화와 교과서 지문에 적용해봅니다." },
      { title: "점검·확장", body: "이해도를 점검하고 어휘·표현 범위를 넓혀갑니다." },
    ],
    faqSlugs: ["program-scope", "lesson-type", "pricing", "teacher-match"],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
