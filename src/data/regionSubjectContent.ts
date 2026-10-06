import { neisSchoolSource, type ContentSource } from "@/data/sources";

/**
 * Region-specific part of a region+subject landing page
 * (/region/[province]/[city]/[subject]). Having an entry here is what makes
 * the page indexable (src/lib/indexability.ts "region-subject").
 *
 * Only write what is actually specific to the region: registered schools
 * (src/data/schools.ts), administrative facts already verified in
 * src/data/regions.ts / schools.ts comments, and how the consult is run for
 * that region. Subject-wide study advice belongs in subjectStudyGuide.ts,
 * which the page renders alongside this entry — never paste it here with the
 * region name swapped.
 */
export interface RegionSubjectContent {
  regionSlug: string;
  subjectSlug: string;
  intro: string;
  gradeSections: { title: string; body: string }[];
  /** Region-only facts/considerations (optional; older entries predate this field). */
  localNotes?: { title: string; body: string }[];
  /** Region-specific FAQs, rendered before the subject's shared FAQs. */
  faqs?: { question: string; answer: string }[];
  /**
   * Where the entry's factual statements come from — official pages that were
   * actually opened (시청 연혁, 교육부 NEIS 학교기본정보, 학교 공식 연혁 등).
   * Shown to visitors in the page's "참고 자료" block (SourceList) and required for
   * the quality gate's GREEN grade (scripts/lib/quality-gate.ts); without it the entry is AMBER.
   */
  sources?: ContentSource[];
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
  {
    regionSlug: "gangseo",
    subjectSlug: "math",
    intro:
      "서울 강서구에서 수학과외를 알아보고 있다면, 자녀가 다니는 학교와 지금 배우는 수학 단원을 기준으로 상담을 시작하는 것이 좋습니다. 교과설계소에는 강서구 소재 학교 중 서울양천초등학교와 마포고등학교 정보가 등록되어 있으며, 초등 연산·문장제부터 고등 내신과 모의고사까지 학생의 현재 위치에서 필요한 부분을 1:1로 설계합니다.",
    gradeSections: [
      {
        title: "강서구 초등 수학과외",
        body: "분수·소수 연산과 문장제를 식으로 바꾸는 연습을 중심으로, 학교 단원평가 범위에 맞춰 개념을 직접 설명할 수 있을 때까지 확인합니다.",
      },
      {
        title: "강서구 중등 수학과외",
        body: "강서구 중학교 정보는 아직 등록 전이라 상담 때 재학 학교의 시험 범위와 서술형 비중을 직접 확인하고, 일차방정식·일차함수처럼 학년 간 이어지는 단원의 빈틈부터 점검합니다.",
      },
      {
        title: "강서구 고등 수학과외",
        body: "학교 내신 범위와 모의고사 일정을 함께 놓고 학습 비중을 정합니다. 마포고등학교처럼 교명과 소재 구가 다른 학교도 있어 상담은 실제 재학 학교를 기준으로 진행합니다.",
      },
    ],
    localNotes: [
      {
        title: "교명과 소재지가 다른 강서구 학교",
        body: "강서구에는 가양동에 있는 서울양천초등학교, 1985년 2월 등촌동 신교사로 이전한 마포고등학교처럼 다른 구 이름이 들어간 학교가 있습니다. 학교명만 보고 지역 페이지를 찾으면 엉뚱한 지역 정보를 보게 될 수 있어, 교과설계소는 학교를 실제 소재 구 기준으로 분류합니다.",
      },
      {
        title: "초등에서 고등까지 이어지는 수학",
        body: "현재 강서구에 등록된 학교는 초등학교와 고등학교입니다. 초등 문장제 해석 능력과 중학교 함수 개념이 고등 수학의 기초가 되므로, 학년이 바뀌어도 이전 단계의 빈틈을 함께 확인하는 방식으로 수업을 이어갑니다.",
      },
    ],
    faqs: [
      {
        question: "강서구 중학생도 수학과외 상담이 가능한가요?",
        answer:
          "가능합니다. 현재 사이트에 등록된 강서구 학교는 초등학교·고등학교뿐이지만 상담은 등록 여부와 관계없이 진행합니다. 학교명과 학년, 최근 시험 범위를 알려주시면 그에 맞춰 수업 계획을 안내해드립니다.",
      },
      {
        question: "마포고등학교는 마포구 페이지에서 찾아야 하나요?",
        answer:
          "아닙니다. 마포고등학교는 강서구에 있는 학교라 강서구 학교 목록에 분류되어 있습니다. 학교별 페이지에서 마포고등학교 수학과외 안내를 확인할 수 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("서울양천초등학교"),
      neisSchoolSource("마포고등학교"),
      { label: "마포고등학교 — 학교연혁 (1985.02 강서구 등촌동 신교사 완공 이전)", url: "https://mapo.sen.hs.kr/18853/subMenu.do" },
    ],
  },
  {
    regionSlug: "michuhol",
    subjectSlug: "english",
    intro:
      "인천 미추홀구에서 영어과외를 찾고 있다면, 학교급에 따라 영어 시험 방식이 크게 달라진다는 점부터 고려하는 것이 좋습니다. 교과설계소에는 미추홀구의 인천숭의초등학교·관교중학교·인천고등학교 정보가 등록되어 있어 초등 읽기 습관부터 중등 교과서 내신, 고등 구문·독해까지 학교급별로 이어서 확인할 수 있습니다.",
    gradeSections: [
      {
        title: "미추홀구 초등 영어과외",
        body: "3학년부터 시작되는 학교 영어 수업에 맞춰 파닉스와 짧은 문장 읽기를 다지고, 영어 문장을 소리 내어 읽는 습관을 만드는 데 초점을 둡니다.",
      },
      {
        title: "미추홀구 중등 영어과외",
        body: "중학교 내신은 교과서 본문과 학교 자료 비중이 큰 편이라 본문 구조 분석과 변형 문제·서술형 영작을 함께 준비합니다. 관교중학교 등 재학 학교의 실제 시험 범위는 상담 때 확인합니다.",
      },
      {
        title: "미추홀구 고등 영어과외",
        body: "고등학교는 부교재·모의고사 지문까지 시험 범위가 넓어질 수 있어, 인천고등학교 등 재학 학교의 범위를 먼저 확인하고 구문 분석을 바탕으로 내신과 모의고사 독해를 함께 관리합니다.",
      },
    ],
    localNotes: [
      {
        title: "2026년 인천 행정체제 개편과 미추홀구",
        body: "2026년 7월 1일 인천 행정체제 개편으로 중구·동구는 제물포구와 영종구로, 서구는 서해구와 검단구로 재편되어 2군·8구가 2군·9구가 되었습니다. 미추홀구는 연수구·남동구·부평구·계양구와 함께 기존 체제를 유지하는 구입니다.",
      },
      {
        title: "초·중·고 학교 정보가 모두 등록된 지역",
        body: "등록된 인천숭의초등학교(숭의동)는 남녀공학이고, 관교중학교(관교동)와 인천고등학교(주안동)는 남학교로 분류되어 있습니다. 초·중·고가 모두 등록되어 있어 자녀가 상급 학교로 진학해도 같은 지역 안에서 학교별 영어 안내를 이어서 확인할 수 있습니다.",
      },
    ],
    faqs: [
      {
        question: "인천 행정구역 개편 이후 미추홀구 페이지가 바뀌나요?",
        answer:
          "바뀌지 않습니다. 미추홀구는 2026년 7월 개편으로 구역이 바뀐 지역이 아니어서 기존 지역 페이지와 학교 페이지를 그대로 이용할 수 있습니다.",
      },
      {
        question: "인천숭의초등학교 학생도 영어 기초부터 시작할 수 있나요?",
        answer:
          "가능합니다. 현재 읽기 수준과 학교 영어 수업 진도를 먼저 확인한 뒤 파닉스나 기초 문장 등 필요한 단계부터 시작합니다.",
      },
    ],
    sources: [
      { label: "인천광역시 — 인천형 행정체제 개편 개요 (2026-07-01 2군·9구 출범)", url: "https://www.incheon.go.kr/IC01070101" },
      { label: "인천광역시 보도자료 — ’26년 7월, 인천에 자치구 하나 더 생겨 2군·9구로 출범 (개편 대상·유지 구)", url: "https://www.incheon.go.kr/IC010205/view?repSeq=DOM_0000000009096254" },
      neisSchoolSource("인천숭의초등학교"),
      neisSchoolSource("관교중학교"),
      neisSchoolSource("인천고등학교"),
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
