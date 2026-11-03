/**
 * GEO/AEO pilot (2026-11-03, docs/qa/geo-aeo-pilot-2026-11-03.md): question-led answer blocks on a whitelist of
 * indexed GREEN school×학년×과목 pages. An entry exists only for the pilot pages below — every other page renders
 * exactly as before. No new facts: each answer must be backed by the page's own 학교알리미 평가계획 rows
 * (`evidence`, rendered from src/data/schoolGradeSubjectContent.ts) or its published notes (`noteRefs`), and
 * scripts/lib/geo-check.ts rejects any figure in an answer that those referenced rows/notes do not contain.
 *
 * Dates are real, never build-time:
 * - planCheckedAt — the day the page's 평가계획 rows were read from the 원문 and published (first commit adding the
 *   entry to schoolGradeSubjectContent.ts).
 * - answersUpdatedAt — the day these questions/answers were written or last changed.
 */
export interface GeoEvidenceRef {
  /** Assessment row name exactly as in the entry's `assessments`. */
  name: string;
  /** Required on multi-course entries (사회·역사 등): the row's `course`. */
  course?: string;
  /** Also show the row's 평가 방법 (배점·유형) — set only when the answer uses it, to keep mobile cards short. */
  detail?: true;
}

export interface GeoAnswer {
  /** Visible question heading — names the school, 학년 and 과목 so it stands alone. */
  question: string;
  /** 2~4 sentences; the first sentence alone answers the question and names school·학년·과목. */
  answer: string;
  /** Assessment rows the answer relies on (rendered as the 근거 list). */
  evidence: GeoEvidenceRef[];
  /** Titles of the entry's published notes the answer also relies on (optional). */
  noteRefs?: string[];
}

export interface SchoolGradeGeoEntry {
  schoolSlug: string;
  grade: number;
  subjectSlug: string;
  /** Primary pilot page ("한 페이지 · 질문 10개 · 30일"). Exactly one entry is primary. */
  primary?: true;
  planCheckedAt: string;
  answersUpdatedAt: string;
  items: GeoAnswer[];
}

export const schoolGradeGeoEntries: SchoolGradeGeoEntry[] = [
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "korean",
    primary: true,
    planCheckedAt: "2026-11-02",
    answersUpdatedAt: "2026-11-03",
    items: [
      {
        question: "잠실고등학교 1학년 국어는 지필평가와 수행평가가 각각 몇 %인가요?",
        answer:
          "잠실고등학교 1학년 국어(공통국어2)는 중간고사 30%와 기말고사 30%를 합친 지필평가가 60%, 수행평가가 40%입니다. 수행평가 40%는 찬반 논제 기반 협력적 논증문 쓰기 14%, 국어 현상을 해석하는 탐구 기반 글쓰기 10%, 논증 내용 구술 평가 8%, 자기 성장 포트폴리오 8%로 나뉩니다.",
        evidence: [
          { name: "중간고사" },
          { name: "기말고사" },
          { name: "찬반 논제 기반 협력적 논증문 쓰기" },
          { name: "국어 현상을 해석하는 탐구 기반 글쓰기" },
          { name: "논증 내용 구술 평가" },
          { name: "자기 성장 포트폴리오" },
        ],
      },
      {
        question: "잠실고등학교 1학년 국어 중간·기말고사에서 서·논술형은 몇 점인가요?",
        answer:
          "잠실고등학교 1학년 공통국어2의 중간고사와 기말고사는 회차마다 서·논술형 10점, 그 외 문항 90점으로 배점됩니다. 두 시험은 각각 30%가 반영되며, 중간고사는 10월 1~2주, 기말고사는 12월 3주에 치릅니다.",
        evidence: [{ name: "중간고사", detail: true }, { name: "기말고사", detail: true }],
      },
      {
        question: "잠실고등학교 1학년 국어 시험 대비는 무엇부터 맞추면 되나요?",
        answer:
          "잠실고등학교 1학년 공통국어2는 10월 1~2주 중간고사 직후 10월 3주부터 논증문 쓰기와 구술 평가가 이어지므로, 10월 일정을 먼저 맞추는 것이 출발점입니다. 두 수행평가는 쟁점 설정, 주장·근거 제시, 예상 반론과 반박 논리 구성이라는 같은 평가요소를 글과 말로 보기 때문에 한 번에 묶어 준비할 수 있습니다.",
        evidence: [{ name: "중간고사" }, { name: "찬반 논제 기반 협력적 논증문 쓰기" }, { name: "논증 내용 구술 평가" }],
        noteRefs: ["논증 단원에 수행평가 두 개가 이어집니다"],
      },
    ],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 2,
    subjectSlug: "math",
    planCheckedAt: "2026-11-02",
    answersUpdatedAt: "2026-11-03",
    items: [
      {
        question: "죽전고등학교 2학년 수학(미적분Ⅰ) 1차 정기시험에는 논술형이 몇 점 나오나요?",
        answer:
          "죽전고등학교 2학년 미적분Ⅰ에서 논술형 문항은 1차 정기시험(9.17.-9.23.)에만 24점이 있고, 나머지 76점은 선택형입니다. 이 24점이 학기 성적에서 차지하는 몫은 7.2%이며, 11.30.-12.4.에 보는 2차 정기시험은 100점 전부 선택형입니다.",
        evidence: [
          { name: "1차 정기시험", detail: true },
          { name: "2차 정기시험", detail: true },
        ],
      },
      {
        question: "죽전고등학교 2학년 미적분Ⅰ 사고력평가는 언제, 어떤 범위로 보나요?",
        answer:
          "죽전고등학교 2학년 미적분Ⅰ 사고력평가는 두 번으로, 극한과 연속 사고력평가(12%)는 8월5주, 미분 사고력평가(12%)는 10월5주에 논술형으로 치릅니다. 미분 사고력평가의 성취기준 가운데 [02-07]~[02-10]은 2차 정기시험 범위에도 들어 있어, 10월 평가 준비가 2차 시험 준비로 이어집니다.",
        evidence: [
          { name: "극한과 연속 사고력평가", detail: true },
          { name: "미분 사고력평가", detail: true },
          { name: "2차 정기시험" },
        ],
        noteRefs: ["미분 사고력평가는 2차 범위 일부를 먼저 봅니다"],
      },
      {
        question: "죽전고등학교 2학년 미적분Ⅰ 수행평가 40%는 어떻게 나뉘나요?",
        answer:
          "죽전고등학교 2학년 미적분Ⅰ 수행평가 40%는 사고력평가 두 번(각 12%), 미적분 주제탐구 활동(8%), 미적분활동 포트폴리오작성(8%)의 네 영역입니다. 포트폴리오는 8월2주-11월3주에 걸쳐 쌓는 영역이고, 주제탐구 활동은 10월1주에 치르는 논술형 과제입니다.",
        evidence: [
          { name: "극한과 연속 사고력평가" },
          { name: "미분 사고력평가" },
          { name: "미적분 주제탐구 활동", detail: true },
          { name: "미적분활동 포트폴리오작성" },
        ],
      },
    ],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "english",
    planCheckedAt: "2026-11-02",
    answersUpdatedAt: "2026-11-03",
    items: [
      {
        question: "하단중학교 2학년 영어구술평가는 무엇을 평가하고 어떻게 준비하나요?",
        answer:
          "하단중학교 2학년 영어구술평가는 10월에 치르는 15% 수행평가로, 대본 완성도 · 내용 적합성 · 전달력 · 언어 사용을 평가합니다. 평가요소가 대본 완성도에서 시작하므로, 말하기 연습에 앞서 대본을 정확한 문장으로 완성해 두는 것이 첫 단계입니다.",
        evidence: [{ name: "영어구술평가", detail: true }],
        noteRefs: ["구술평가 점수는 대본에서 시작"],
      },
      {
        question: "하단중학교 2학년 영어는 9월에 어떤 평가가 겹치나요?",
        answer:
          "하단중학교 2학년 영어는 9월에 영어듣기 수행평가(10%)와 9월 5주 중간고사(30%)가 함께 있습니다. 중간고사는 선택형과 서답형으로 출제되고 서답형이 40점이며, 12월 1주 기말고사도 같은 방식입니다.",
        evidence: [{ name: "영어듣기" }, { name: "중간고사", detail: true }, { name: "기말고사", detail: true }],
      },
      {
        question: "하단중학교 2학년 영어 러닝로그는 어느 범위까지 평가되나요?",
        answer:
          "하단중학교 2학년 영어 러닝로그(15%)는 8~11월에 걸쳐 읽기·쓰기를 평가하는 누적 수행평가입니다. 평가계획에는 8월 Lesson 4부터 11월 Lesson 7까지 매달 수행평가로 적혀 있고, 12월 Lesson 8은 관찰평가와 형성평가만 계획되어 학기 점수 범위에 들어가지 않습니다.",
        evidence: [{ name: "러닝로그", detail: true }],
        noteRefs: ["러닝로그 15%는 넉 달 누적"],
      },
    ],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "science",
    planCheckedAt: "2026-11-02",
    answersUpdatedAt: "2026-11-03",
    items: [
      {
        question: "경안여자중학교 2학년 과학 서술형 수행평가는 무엇을 하나요?",
        answer:
          "경안여자중학교 2학년 과학의 서술형 수행평가는 광합성 과제(8~9월)와 전압·전류 과제(9~10월) 두 개로, 각각 15%가 반영됩니다. 광합성 과제는 센서 데이터를 분석해 결론을 쓰고, 전압·전류 과제는 전압과 전류를 측정해 그래프를 그린 뒤 결과를 해석합니다.",
        evidence: [
          { name: "광합성에 필요한 물질과 생산된 물질 알아보기", detail: true },
          { name: "전압과 전류 사이의 관계 알아보기", detail: true },
        ],
      },
      {
        question: "경안여자중학교 2학년 과학 정기시험은 언제, 어떤 형식인가요?",
        answer:
          "경안여자중학교 2학년 과학 1차 정기시험(9~10월)과 2차 정기시험(12월)은 각각 30%가 반영되며 두 시험 모두 선택형입니다. 진도표에는 1차가 9월 28일~10월 1일(Ⅴ·Ⅶ단원), 2차가 12월 8~10일(Ⅵ·Ⅷ단원)로 적혀 있습니다.",
        evidence: [
          { name: "1차 정기시험", detail: true },
          { name: "2차 정기시험", detail: true },
        ],
        noteRefs: ["소화계 노래 배점과 정기시험 일정"],
      },
      {
        question: "경안여자중학교 2학년 과학 소화계 노래 만들기는 어떻게 채점하나요?",
        answer:
          "경안여자중학교 2학년 과학 '인공지능을 활용한 소화계 노래 만들기'는 10~11월에 진행하는 10% 프로젝트 평가입니다. 과학 개념의 정확성 30점, AI 활용과 가사 창의성 20점, 발표와 상호 평가 20점, 기관계 간 상호작용 및 체계성 30점으로 채점하며 동료평가가 포함됩니다.",
        evidence: [{ name: "인공지능을 활용한 소화계 노래 만들기" }],
        noteRefs: ["소화계 노래 배점과 정기시험 일정"],
      },
    ],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "social",
    planCheckedAt: "2026-11-02",
    answersUpdatedAt: "2026-11-03",
    items: [
      {
        question: "무거중학교 3학년 사회는 사회와 역사를 어떻게 나눠 평가하나요?",
        answer:
          "무거중학교 3학년 사회 교과는 사회와 역사를 따로 평가하며, 두 과목 모두 1차(10월 3주)·2차(11월 3주) 정기시험이 각 30%, 수행평가 두 개가 각 20%입니다. 사회 수행은 인구 정책 뉴스 대본 만들기(9월)와 환경 문제 마인드맵으로 표현해 보기(10월), 역사 수행은 조선의 과학기술 조사하기(9월)와 조선 후기의 가상 일기 쓰기(10~11월)입니다.",
        evidence: [
          { name: "1차 정기시험", course: "사회" },
          { name: "2차 정기시험", course: "사회" },
          { name: "인구 정책 뉴스 대본 만들기", course: "사회" },
          { name: "환경 문제 마인드맵으로 표현해 보기", course: "사회" },
          { name: "1차 정기시험", course: "역사" },
          { name: "2차 정기시험", course: "역사" },
          { name: "조선의 과학기술 조사하기", course: "역사" },
          { name: "조선 후기의 가상 일기 쓰기", course: "역사" },
        ],
      },
      {
        question: "무거중학교 3학년 사회·역사 시험에서 서·논술형은 언제 나오나요?",
        answer:
          "무거중학교 3학년 사회와 역사의 서‧논술형은 1차 정기시험에만 있어, 1차는 선택형 60점·서‧논술형 40점, 2차는 선택형 100점으로 치릅니다. 2차 정기시험이 11월 3주라서 10월 수행평가인 사회 마인드맵·역사 가상 일기와 준비 기간이 바로 이어집니다.",
        evidence: [
          { name: "1차 정기시험", course: "사회", detail: true },
          { name: "2차 정기시험", course: "사회", detail: true },
          { name: "1차 정기시험", course: "역사", detail: true },
          { name: "2차 정기시험", course: "역사", detail: true },
        ],
        noteRefs: ["두 과목 모두 서‧논술형은 1차 시험에만"],
      },
    ],
  },
];

export function getSchoolGradeGeo(schoolSlug: string, grade: number, subjectSlug: string): SchoolGradeGeoEntry | undefined {
  return schoolGradeGeoEntries.find((e) => e.schoolSlug === schoolSlug && e.grade === grade && e.subjectSlug === subjectSlug);
}
