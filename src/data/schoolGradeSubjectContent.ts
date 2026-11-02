import { schoolInfoPlanSource, type ContentSource } from "@/data/sources";

/**
 * School × 학년 × 과목 content (/school/[schoolSlug]/[grade]/[subject]) and the 학년 hub built from it
 * (/school/[schoolSlug]/[grade]) — 2026-11-02 Phase 2 pilot, docs/qa/national-school-content-expansion-2026-11-02.md.
 *
 * - Every fact is OFFICIAL (src/data/evidence.ts): read in the school's own 학교알리미 4-가 교과별(학년별)
 *   교수·학습 및 평가계획 attachment for `planTerm`. `assessments` copies that plan's 반영 비율 표 (the rows of
 *   one course add up to 100 — checked by validate:quick); `notes` explain what the table means for exam
 *   preparation, without 난이도·성적·합격·학원 claims.
 * - Routes exist only for entries here (no entry → 404): a 학년 page needs at least one published entry for that
 *   school and 학년, a 학년×과목 page needs its own entry. Nothing is generated for the ~10k national hubs.
 * - Indexing (src/lib/indexability.ts "school-grade" / "school-grade-subject"): published + quality gate GREEN
 *   (RED / AMBER are listed in src/data/qualityNoindex.ts and stay noindex, follow).
 * - The plans are per semester: re-check every entry when the 2027학년도 1학기 plans are disclosed
 *   (PLAN_TERM_RECHECK_BY in dongSubjectContent.ts) and update it or set status "draft".
 */
export interface GradeSubjectAssessment {
  /** Row name as written in the plan (정기시험 회차 or 수행평가 영역/과제명). */
  name: string;
  kind: "exam" | "task";
  /** 반영 비율 (%) of the course grade. */
  weight: number;
  /** 시기 as written in the plan; omitted when the plan's own tables disagree. */
  timing?: string;
  /** 평가 방법/유형 (선택형·서논술형 배점, 논술형, 구술, 프로젝트 …) as written in the plan. */
  method?: string;
  /** 과목명 when the page covers more than one course (고등학교 선택과목); every row of a course shares it. */
  course?: string;
}

export interface SchoolGradeSubjectContent {
  schoolSlug: string;
  /** 학년 — 초 1~6, 중·고 1~3. */
  grade: number;
  subjectSlug: string;
  status: "draft" | "published";
  /** 공시 학기: "2026-2" = 2026학년도 2학기 (학교알리미 2026년 3차·9월 공시). */
  planTerm: "2026-2";
  /** Course names as written in the plan, e.g. ["공통국어2"] or ["미적분Ⅰ", "확률과 통계"]. */
  courses: string[];
  /** One line (≤ 80자) shown on the 학년 hub next to the subject link. */
  summary: string;
  intro: string;
  assessments: GradeSubjectAssessment[];
  notes: { title: string; body: string }[];
  sources: ContentSource[];
}

export const schoolGradeSubjectContents: SchoolGradeSubjectContent[] = [
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "중간·기말 각 30%(회차별 서·논술형 10점) · 수행 4개 40%(논증문·구술·포트폴리오·탐구 글쓰기)",
    intro:
      "잠실고등학교 1학년 공통국어2는 중간·기말고사가 각 30%, 수행평가 네 과제가 합쳐 40%입니다. 찬반 논증문 쓰기와 구술 평가가 10월 3주~11월 1주에 이어서 진행되므로, 상담에서는 이 시기 일정과 회차별 시험 범위부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1~2주", method: "서·논술형 10점·그 외 90점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 10점·그 외 90점" },
      { name: "찬반 논제 기반 협력적 논증문 쓰기", kind: "task", weight: 14, timing: "10월 3주-5주", method: "서・논술" },
      { name: "논증 내용 구술 평가", kind: "task", weight: 8, timing: "10월 4주-11월 1주", method: "구술・발표" },
      { name: "자기 성장 포트폴리오", kind: "task", weight: 8, timing: "8월 4주~12월 1주", method: "포트폴리오" },
      { name: "국어 현상을 해석하는 탐구 기반 글쓰기", kind: "task", weight: 10, timing: "8월 3주~12월 2주", method: "서・논술, 기타(탐구 활동 과제 참여)" },
    ],
    notes: [
      {
        title: "논증 단원에 수행평가 두 개가 이어집니다",
        body: "‘문제를 해결하는 말과 글’ 단원을 배우는 10월 3주부터 모둠 논증문 쓰기(14%)가, 이어 10월 4주~11월 1주에 같은 논제의 주장과 근거를 말로 설명하는 구술 평가(8%)가 진행됩니다. 두 과제의 평가요소는 쟁점 설정, 주장·근거 제시, 예상 반론과 반박 논리 구성으로 같아서, 글로 세운 논증을 말로 다시 설명할 수 있게 정리해 두는 것이 두 과제를 잇는 준비입니다.",
      },
      {
        title: "서·논술형 비중은 수행평가 쪽이 큽니다",
        body: "평가 비율표에서 중간·기말고사는 각각 서·논술형 10점과 그 외 문항 90점으로 배점되어, 회차마다 서·논술형이 차지하는 비율은 3%입니다. 반면 수행평가 100점 중 60점이 서·논술형으로 잡혀 있어, 서술형 글쓰기는 정기시험보다 수행평가에서 더 많이 평가됩니다.",
      },
      {
        title: "국어의 역사·맞춤법은 학기 내내 이어집니다",
        body: "진도표에서 ‘국어의 역사와 한글 맞춤법’ 단원은 8월부터 12월까지 다른 단원과 나란히 배치되어 있고, 같은 성취기준이 학기 전체에 걸친 탐구 기반 글쓰기(10%)에 쓰입니다. 탐구 질문을 세우고 결론을 글로 제시하는 과제이므로, 맞춤법 원리와 국어 변화 사례는 시험 범위이자 탐구 주제 후보로 함께 정리해 둘 만합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "중간·기말 각 30% · 수행 3개 40%(구술 의사소통·문제해결 포트폴리오·독서탐구 서술)",
    intro:
      "잠실고등학교 1학년 공통수학2는 정기시험 두 번이 60%, 의사소통·문제해결·독서탐구 수행평가가 40%를 이룹니다. 중간고사는 도형의 방정식과 집합, 기말고사는 명제부터 유리·무리함수까지로 범위가 나뉘어 있어 상담에서는 회차별 단원부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, method: "서·논술형 20점·그 외 80점" },
      { name: "기말고사", kind: "exam", weight: 30, method: "서·논술형 20점·그 외 80점" },
      { name: "의사소통평가", kind: "task", weight: 7.2, timing: "수시(3회)", method: "구술・발표" },
      { name: "문제해결평가", kind: "task", weight: 14.4, timing: "수시(6회)", method: "포트폴리오" },
      { name: "독서탐구평가", kind: "task", weight: 18.4, timing: "중간고사 이후", method: "서술・논술" },
    ],
    notes: [
      {
        title: "집합과 명제가 서로 다른 회차에 들어갑니다",
        body: "평가 비율표의 교육과정 영역 칸에서 중간고사는 평면좌표와 직선의 방정식, 원의 방정식과 도형의 이동, 집합이고, 기말고사는 명제, 함수의 그래프, 유리함수와 무리함수입니다. 진도표에서는 ‘Ⅱ. 집합과 명제’가 한 단원이지만 시험 범위에서는 집합이 중간고사, 명제가 기말고사로 나뉩니다.",
      },
      {
        title: "독서탐구는 중간고사 뒤 보고서로",
        body: "수행평가 중 비중이 가장 큰 독서탐구평가(18.4%)는 중간고사 이후 서술・논술 방식으로 진행됩니다. 평가요소는 도서에서 2학기 수학 개념과 원리를 추출하고, 책 속 제재와 수학 개념을 비교·분석해 보고서로 구조화하는 것이므로, 읽을 책을 정할 때 연결할 단원을 함께 정해 두는 편이 평가요소와 맞습니다.",
      },
      {
        title: "수시 평가가 모두 아홉 번입니다",
        body: "의사소통평가는 수시 3회, 문제해결평가는 수시 6회로 학기 중 나누어 실시됩니다. 의사소통평가는 풀이 과정을 올바른 용어로 설명하는 구술・발표이고, 문제해결평가는 단원별 개념 적용과 오답 분석·피드백을 담는 포트폴리오여서, 단원이 끝날 때마다 풀이와 오답을 기록해 두는 방식과 맞물립니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "중간·기말 각 30%(회차별 서·논술형 30점) · 수행 4개 40%(말하기·글쓰기·포트폴리오·경청)",
    intro:
      "잠실고등학교 1학년 공통영어2는 중간고사가 Lesson 1~2, 기말고사가 Lesson 3~4를 범위로 각 30%이고, 수행평가 네 영역이 40%입니다. 영어 상담에서는 10~11월에 함께 진행되는 글쓰기·말하기 과제 일정부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1~2주", method: "서·논술형 30점·그 외 70점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3~4주", method: "서·논술형 30점·그 외 70점" },
      { name: "선택 주제에 대한 글쓰기", kind: "task", weight: 12, timing: "10~11월" },
      { name: "포트폴리오", kind: "task", weight: 8, timing: "8~12월" },
      { name: "선택 주제에 대한 말하기", kind: "task", weight: 16, timing: "10~11월" },
      { name: "적극적 경청하기", kind: "task", weight: 4, timing: "10~11월", method: "조사·관찰보고서" },
    ],
    notes: [
      {
        title: "말하기 16%가 가장 큰 수행 영역입니다",
        body: "수행평가 네 영역 중 선택 주제에 대한 말하기가 16%로 가장 크고, 평가요소는 주제와 조건을 충족하는 과제 완성도와 어휘·어법의 정확성 및 유창성입니다. 글쓰기(12%)도 같은 10~11월에 진행되며 여기에 글의 창의성과 체계적 구성이 더해지므로, 같은 시기에 말과 글 두 형식의 과제를 준비하게 됩니다.",
      },
      {
        title: "정기시험 ‘그 외’ 문항의 범위",
        body: "계획서는 정기시험의 ‘그 외’를 선택형(선다형·진위형·연결형·배열형)과 서답형 중 완성형·단답형으로 설명합니다. 회차마다 100점 중 30점이 서·논술형이고 진도표의 각 Lesson은 이해와 표현 영역 성취기준을 함께 다루므로, 본문 독해와 함께 요약하기·의견 쓰기 같은 표현 성취기준도 시험 대비 범위에 넣어 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2", "한국사2"],
    summary: "통합사회2 시험 60%·수행 40%(서·논술 2개) / 한국사2 시험 50%·수행 50%(3개)",
    intro:
      "잠실고등학교 1학년 사회 영역은 통합사회2(정기시험 60%·수행평가 40%)와 한국사2(정기시험 50%·수행평가 50%)의 반영 비율이 다릅니다. 두 과목 모두 수행평가에 서·논술 과제가 있어, 상담에서는 과목별 수행 일정과 서술 과제 형식부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1주", method: "서·논술형 16점·그 외 84점", course: "통합사회2" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 16점·그 외 84점", course: "통합사회2" },
      { name: "재무 컨설팅 연습", kind: "task", weight: 20, timing: "9월 ~ 11월", method: "서술・논술", course: "통합사회2" },
      { name: "공간성과 정의를 탐구하는 지리, 윤리 성장노트", kind: "task", weight: 20, timing: "8월 3주 ~ 12월", method: "서・논술", course: "통합사회2" },
      { name: "중간고사", kind: "exam", weight: 25, method: "서·논술형 20점·그 외 80점", course: "한국사2" },
      { name: "기말고사", kind: "exam", weight: 25, method: "서·논술형 20점·그 외 80점", course: "한국사2" },
      { name: "역사 도서 읽고 포트폴리오 작성하기", kind: "task", weight: 25, timing: "10월", method: "포트폴리오", course: "한국사2" },
      { name: "역사 자료 분석하여 탐구 과제 해결하기", kind: "task", weight: 20, timing: "10월", method: "서술・논술", course: "한국사2" },
      { name: "학습 포트폴리오 만들기", kind: "task", weight: 5, timing: "수시", method: "포트폴리오", course: "한국사2" },
    ],
    notes: [
      {
        title: "한국사2는 단원별로 시험 범위가 나뉩니다",
        body: "한국사2 평가 비율표에서 중간고사 범위는 Ⅰ 일제 식민 통치와 민족운동, 기말고사 범위는 Ⅱ 대한민국의 발전입니다. 진도표상 12월~1월에 배우는 Ⅲ 오늘날의 대한민국은 수행평가 범위에만 들어 있고, 도서 포트폴리오(25%)와 자료 분석 서논술(20%)은 둘 다 10월로 잡혀 있습니다.",
      },
      {
        title: "통합사회2 수행평가는 두 과제 모두 서·논술",
        body: "통합사회2 수행평가 40%는 재무 컨설팅 연습과 지리·윤리 성장노트 두 과제로, 둘 다 서·논술 방식이며 각 20%입니다. 재무 컨설팅은 자료 수집·정리와 금융 자산 이해를 재무계획에 반영하는 능력을, 성장노트는 학습지·탐구 결과·성찰을 기한 안에 정리했는지를 봅니다. 계획서는 교사가 허락한 경우에만 AI를 쓸 수 있다고 적고 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "중간·기말 각 30%(회차별 서·논술형 40점) · 수행 2개 40%(중화 실험·지질시대 웹앱)",
    intro:
      "잠실고등학교 1학년 통합과학2는 중간·기말고사 각 30%에 수행평가 두 과제가 20%씩입니다. 정기시험 100점 중 40점이 서·논술형으로 배정되어 있어, 과학 상담에서는 서술형 답안 작성과 8~10월에 놓인 수행평가 일정을 먼저 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1주", method: "서·논술형 40점·그 외 60점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 40점·그 외 60점" },
      { name: "산과 염기를 혼합할 때 용액의 온도 측정 실험", kind: "task", weight: 20, timing: "9~10월" },
      { name: "AI 활용 코딩으로 지질 시대별 환경과 생물 웹앱 제작하기", kind: "task", weight: 20, timing: "8~9월" },
    ],
    notes: [
      {
        title: "수행평가는 10월까지 배치되어 있습니다",
        body: "웹앱 제작은 8~9월, 중화 실험은 9~10월로 계획되어 있어 두 수행평가가 모두 학기 앞부분에 놓입니다(진도·상황에 따라 변동될 수 있다고 명시). 진도표상 이 시기는 지질시대와 산·염기 성취기준을 배우는 때이고, 수행평가 범위도 Ⅰ 변화와 다양성·Ⅱ 환경과 에너지로 적혀 있습니다.",
      },
      {
        title: "실험 과제는 측정·설명·그래프를 함께 봅니다",
        body: "중화 실험의 평가요소는 실험 기구로 부피와 온도를 정확히 측정하기, 혼합 용액의 온도 변화와 지시약 색 변화로 액성 설명하기, 온도 변화 그래프를 스프레드시트로 그리기입니다. 웹앱 과제는 지질 시대별 환경·생물 조사 내용을 오류 없이 구현하고 매 차시 온라인 공유 플랫폼에 기록하는지를 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["화법과 언어", "문학과 영상"],
    summary: "화법과 언어 시험 50%·수행 50%(토론·일지·어법) / 문학과 영상 시험 60%·수행 40%",
    intro:
      "잠실고등학교 2학년 국어 선택과목 중 화법과 언어는 정기시험 50%·수행평가 50%, 문학과 영상(3~5반)은 정기시험 60%·수행평가 40%입니다. 두 과목 모두 정기시험에 서·논술형 배점이 없어, 상담에서는 과목별 수행 과제의 형식부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 25, timing: "10월 1~2주", method: "서·논술형 0점·그 외 100점", course: "화법과 언어" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월 3주", method: "서·논술형 0점·그 외 100점", course: "화법과 언어" },
      { name: "세다토론으로 논증 구성하기", kind: "task", weight: 25, timing: "11월 1주~11월 3주", method: "서・논술, 토의・토론, 포트폴리오", course: "화법과 언어" },
      { name: "언어생활 일지", kind: "task", weight: 15, timing: "8월 ~ 12월", method: "서・논술, 포트폴리오", course: "화법과 언어" },
      { name: "어법 탐구 포트폴리오", kind: "task", weight: 10, timing: "8월 3주~11월 4주", method: "포트폴리오", course: "화법과 언어" },
      { name: "중간고사", kind: "exam", weight: 30, method: "서·논술형 0점·그 외 100점", course: "문학과 영상" },
      { name: "기말고사", kind: "exam", weight: 30, method: "서·논술형 0점·그 외 100점", course: "문학과 영상" },
      { name: "삶을 비추는 문학과 영상 창작 활동", kind: "task", weight: 16, timing: "8~11월", course: "문학과 영상" },
      { name: "나만의 문학과 영상 포트폴리오", kind: "task", weight: 24, timing: "8~11월", method: "서·논술형", course: "문학과 영상" },
    ],
    notes: [
      {
        title: "세다토론은 11월 1~3주에 진행됩니다",
        body: "화법과 언어에서 가장 큰 수행 과제는 세다토론으로 논증 구성하기(25%)로, 11월 1주~3주에 논제의 필수 쟁점별 논증을 세우고 교차 조사를 포함한 절차에 따라 토론합니다. 평가요소에 쟁점 분석과 질문·답변, 역할 분담, 발음·성량·속도 같은 전달력까지 들어 있어 논증 원고와 말하기 연습을 함께 준비하게 됩니다.",
      },
      {
        title: "문법 지식은 수행평가에서 자료 분석으로 확인됩니다",
        body: "어법 탐구 포트폴리오(10%)는 품사, 문장 구조, 국어의 변천 지식으로 신문 기사나 광고 문구 같은 실제 자료의 문법 요소 표현 효과를 설명하는지를 봅니다. 화법과 언어의 정기시험은 서·논술형 없이 100점이 모두 ‘그 외’ 문항이어서, 서술로 설명하는 능력은 이 포트폴리오와 언어생활 일지에서 주로 평가됩니다.",
      },
      {
        title: "문학과 영상은 창작과 포트폴리오 두 과제",
        body: "문학과 영상의 수행평가 40%는 창작 활동(16%)과 포트폴리오(24%) 두 가지이며 둘 다 8~11월에 진행됩니다. 창작 활동은 의미 있는 경험을 글과 영상으로 표현하면서 매체 특성과 효과를 고려하는지를, 포트폴리오는 활동지를 빠짐없이 정리하고 유의미한 정보로 재구성하는지를 봅니다. 시험 범위는 중간고사가 1·2단원, 기말고사가 3·4단원입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ", "수학과제탐구"],
    summary: "미적분Ⅰ 시험 60%·수행 2개 40% / 수학과제탐구 기말 30%·탐구 과제 5개 70%",
    intro:
      "잠실고등학교 2학년 미적분Ⅰ은 중간·기말고사 각 30%에 수행평가 두 개가 40%이고, 수학과제탐구는 중간고사 없이 기말고사 30%와 탐구 과제 다섯 개로 성적을 냅니다. 상담에서는 수강 과목에 따라 시험 대비와 탐구 보고서 준비의 비중을 먼저 나눕니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1~2주", method: "서·논술형 20점·그 외 80점", course: "미적분Ⅰ" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 20점·그 외 80점", course: "미적분Ⅰ" },
      { name: "문제 풀이 오류 탐색 및 첨삭하기", kind: "task", weight: 20, timing: "10월 ~ 11월", course: "미적분Ⅰ" },
      { name: "함수의 극한과 연속, 미분, 적분 학습 포트폴리오", kind: "task", weight: 20, timing: "8~11월", course: "미적분Ⅰ" },
      { name: "기말고사", kind: "exam", weight: 30, method: "서·논술형 40점·그 외 60점", course: "수학과제탐구" },
      { name: "과제탐구 포트폴리오", kind: "task", weight: 21, timing: "8 ~ 11월", course: "수학과제탐구" },
      { name: "문헌 연구", kind: "task", weight: 14, timing: "9월", course: "수학과제탐구" },
      { name: "사례 조사", kind: "task", weight: 14, timing: "9~10월", course: "수학과제탐구" },
      { name: "수학 실험", kind: "task", weight: 14, timing: "10~11월", course: "수학과제탐구" },
      { name: "개발 연구", kind: "task", weight: 7, timing: "11월", course: "수학과제탐구" },
    ],
    notes: [
      {
        title: "미적분Ⅰ은 미분의 활용부터 기말 범위입니다",
        body: "미적분Ⅰ 중간고사는 함수의 극한과 연속·미분, 기말고사는 미분의 활용·적분이 범위입니다. 진도표상 평균값 정리, 증가·감소와 극대·극소, 그래프 개형은 10월 3주 이후에 배우므로 기말고사에 들어갑니다. 수행평가인 오류 탐색·첨삭은 풀이의 오류 지점을 찾아 관련 개념을 정확한 용어와 기호로 정리하고 풀이를 다시 구성하는 과제입니다.",
      },
      {
        title: "수학과제탐구 과제는 탐구 방법 순서로 이어집니다",
        body: "수학과제탐구 수행평가는 진도표의 탐구 방법 순서를 따라 9월 문헌 연구, 9~10월 사례 조사, 10~11월 수학 실험, 11월 개발 연구로 이어지고, 과제탐구 포트폴리오(21%)가 8~11월 전체에 걸쳐 있습니다. 사례 조사는 질문지와 통계 자료 분석을, 수학 실험은 선행연구 검토와 탐구 결과 보고서 작성을 요구합니다.",
      },
      {
        title: "수학과제탐구 기말고사의 서·논술형 40점",
        body: "수학과제탐구는 평가 비율표에서 중간고사 배점이 0점이고, 기말고사 100점 중 40점이 서·논술형입니다. 기말고사 범위는 과제 탐구의 이해, 방법과 절차, 실행 및 평가 세 단원 전체로 적혀 있어, 문헌 조사·사례 조사·수학 실험·개발 연구의 절차를 설명하는 성취기준도 시험 범위에 포함됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  {
    schoolSlug: "jamsil-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ", "영어 발표와 토론"],
    summary: "영어Ⅱ 시험 60%·수행 5개 40% / 영어 발표와 토론 기말 30%·발표·토론 과제 70%",
    intro:
      "잠실고등학교 2학년 영어Ⅱ는 중간·기말고사 각 30%에 수행평가 다섯 영역이 40%이고, 영어 발표와 토론(7~8반)은 기말고사 30%에 발표·토론 과제가 70%를 차지합니다. 상담에서는 수강 과목이 시험 중심인지 과제 중심인지부터 구분합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월 1~2주", method: "서·논술형 30점·그 외 70점", course: "영어Ⅱ" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 30점·그 외 70점", course: "영어Ⅱ" },
      { name: "선택 주제에 대한 글쓰기", kind: "task", weight: 12, timing: "10~11월", course: "영어Ⅱ" },
      { name: "포트폴리오", kind: "task", weight: 4, timing: "8~12월", course: "영어Ⅱ" },
      { name: "고난도 어휘 쓰기", kind: "task", weight: 4, timing: "8~12월", course: "영어Ⅱ" },
      { name: "선택 주제에 대한 말하기", kind: "task", weight: 16, timing: "8~12월", course: "영어Ⅱ" },
      { name: "적극적 경청하기", kind: "task", weight: 4, timing: "8~12월", course: "영어Ⅱ" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 3주", method: "서·논술형 30점·그 외 70점", course: "영어 발표와 토론" },
      { name: "논제에 대한 찬반 입장을 선택하여 주장하는 말하기", kind: "task", weight: 14, timing: "9월", course: "영어 발표와 토론" },
      { name: "자신의 삶에서 의미 있었던 경험을 이야기 구조에 맞게 구성하여 발표하기", kind: "task", weight: 14, timing: "10월", course: "영어 발표와 토론" },
      { name: "혐오 발언 금지법에 관한 찬반 토론 개요서 작성하기", kind: "task", weight: 14, timing: "11월", course: "영어 발표와 토론" },
      { name: "‘경제성장보다 기후 위기 대응을 우선시해야 한다’는 논제에 대한 찬반 팀 토론 프로젝트", kind: "task", weight: 21, timing: "12월", course: "영어 발표와 토론" },
      { name: "적극적 경청하기", kind: "task", weight: 7, timing: "9~12월", course: "영어 발표와 토론" },
    ],
    notes: [
      {
        title: "영어 발표와 토론은 한 달에 한 과제씩",
        body: "영어 발표와 토론 수행평가는 9월 찬반 주장 말하기, 10월 경험 이야기 발표, 11월 혐오 발언 금지법 토론 개요서, 12월 기후 위기 논제 팀 토론으로 매달 하나씩 배치되어 있습니다. 비중이 가장 큰 팀 토론(21%)은 상대 주장의 논리를 분석해 반박하는지와 토론 과정·결과를 성찰하는지까지 평가요소에 넣고 있습니다.",
      },
      {
        title: "영어Ⅱ 고난도 어휘 쓰기는 학기 내내",
        body: "영어Ⅱ 진도표는 중간고사 전 Unit 1~2, 이후 Unit 3~5를 다루며 각 단원에 보충독해자료(활동지)가 함께 적혀 있습니다. 수행평가 중 고난도 어휘 쓰기(4%)는 8~12월에 걸쳐 어휘 사용의 정확성과 유창성을 따로 평가하므로, 단원별 어휘를 학기 중 꾸준히 정리해 두는 것이 이 과제와 바로 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("잠실고등학교")],
  },
  // ───────── 1학년 ─────────
  {
    schoolSlug: "jukjeon-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "정기시험 2회 60%(선택형) · 수행 3개 40%(사회적 독서·시 재구성·논증하는 글)",
    intro:
      "죽전고등학교 1학년 공통국어2는 1·2차 정기시험이 각 30%로 모두 선택형이고, 수행평가 40% 가운데 35%가 논술형으로 반영됩니다. 상담에서는 8월부터 11월까지 이어지는 수행 3개의 시기와 두 번의 시험 범위를 나란히 놓고 봅니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점" },
      { name: "시집 읽고 사회적 독서 활동하기", kind: "task", weight: 20, timing: "8월 – 9월 1주", method: "논술형(반영 20%)" },
      { name: "시 재구성하기", kind: "task", weight: 10, timing: "9월 5주-11월 1주", method: "논술형 반영 5%" },
      { name: "논증하는 글 쓰기", kind: "task", weight: 10, timing: "11월 2주-5주", method: "논술형(반영 10%)" },
    ],
    notes: [
      {
        title: "서·논술형은 수행평가 쪽에만 있습니다",
        body: "반영 비율 표에서 1·2차 정기시험은 선택형으로만 표시되어 있고 논술형 반영 칸은 ‘-’로 표시되어 있습니다. 학기 논술형 35%는 시집 독서 활동 20%, 시 재구성 5%, 논증하는 글 쓰기 10%에서 나옵니다. 그래서 서술 답안 연습은 시험 직전보다 각 수행 과제 일정에 맞춰 두는 편이 계획서 구조와 맞습니다.",
      },
      {
        title: "1차와 2차는 다루는 영역이 다릅니다",
        body: "1차 정기시험 평가 요소는 국어의 변화, 한국 문학사의 흐름 속 작품의 내용·형식, 주체적인 작품 해석, 매체 변화가 소통 문화에 끼치는 영향입니다. 2차에는 여기에 복합양식 자료의 관점·의도 평가, 한글 맞춤법의 원리, 협상 과정, 말의 영향력, 매체 자료의 비판적 수용이 더해져 성취기준이 9개로 늘어납니다.",
      },
      {
        title: "독서 활동은 태도 평가와 묶여 있습니다",
        body: "정의적 능력 평가 항목에 사회적 독서 활동 참여(상호작용·공감·존중 등)를 8~9월 논술형·관찰로 본다고 적혀 있고, 그 결과는 수행평가 영역1에 반영됩니다. 논증하는 글 쓰기는 성취기준 [10공국2-03-02]에 따라 논증 요소를 분석해 내용을 조직하는 능력을 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "정기시험 2회 60%(1차에 논술형 20점) · 수행 3개 40%(문제해결·주제탐구·노트)",
    intro:
      "1학년 공통수학2는 정기시험 60%, 수행평가 40%이고, 정기시험 중 논술형은 1차에만 20점(학기 반영 6%) 들어 있습니다. 죽전고 수학 상담은 1차 범위인 도형의 방정식·집합과 2차 범위인 명제·함수 가운데 어디부터 다질지를 먼저 정합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 80점(24%)·논술형 20점(6%)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점" },
      { name: "수학문제 해결하기", kind: "task", weight: 18, timing: "11월1주", method: "논술형" },
      { name: "주제탐구 보고서쓰기", kind: "task", weight: 12, timing: "9월5주", method: "논술형" },
      { name: "수업과정노트 작성하기", kind: "task", weight: 10, timing: "8월2주 -11월3주" },
    ],
    notes: [
      {
        title: "시험 범위는 단원 단위로 갈립니다",
        body: "1차 평가 요소는 선분의 내분점, 두 직선의 평행·수직 조건, 점과 직선 사이의 거리, 원의 방정식과 원·직선의 위치 관계, 평행이동·대칭이동, 집합과 벤 다이어그램입니다. 2차는 명제의 역과 대우, 충분조건·필요조건, 귀류법, 절대부등식, 합성함수·역함수, 유리함수·무리함수 그래프로 이어집니다.",
      },
      {
        title: "수행평가 일정과 논술형 비중",
        body: "주제탐구 보고서는 9월 5주로 1차 시험 직후에, 수학문제 해결하기는 11월 1주로 2차 시험 전에 잡혀 있습니다. 두 과제가 모두 논술형이어서 1차 시험 논술형 6%와 합치면 학기 논술형 반영은 36%입니다. 수학문제 해결하기 평가 요소는 내분점부터 합성함수까지 걸쳐 있어 2차 범위 일부도 포함합니다.",
      },
      {
        title: "주제탐구 보고서가 요구하는 것",
        body: "계획서는 도형의 방정식, 집합과 명제, 함수와 그래프 가운데 주제를 골라 탐구하고, 자신의 진로와 연계해 수학 개념을 확장한 내용을 보고서로 쓰도록 안내합니다. 수업과정노트는 8월 2주부터 11월 3주까지 주어진 학습 과제를 풀고 해결 방법을 수학적으로 표현하는 기록으로 평가합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "정기시험 2회 60%(선택형) · 수행 3개 40%(에세이·탐구 보고서·리딩로그)",
    intro:
      "공통영어2는 1·2차 정기시험이 30%씩 선택형으로 치러지고, 수행평가는 미래 공존 에세이 20%, 미래 이슈 탐구 보고서 15%, 리딩로그 5%입니다. 죽전고 1학년 영어 상담은 8월 4주 에세이와 10월 1주 보고서라는 두 번의 영어 쓰기부터 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점" },
      { name: "미래 공존 에세이 쓰기", kind: "task", weight: 20, timing: "8월4주", method: "논술형" },
      { name: "미래 이슈 탐구 보고서 쓰기", kind: "task", weight: 15, timing: "10월1주", method: "논술형" },
      { name: "리딩로그 작성하기", kind: "task", weight: 5, timing: "8월4주-11월3주" },
    ],
    notes: [
      {
        title: "교과서 단원과 유형 학습이 번갈아 나옵니다",
        body: "진도표상 8월은 2단원 From Problems to Solutions, 9월 5주~10월은 3단원 Our Heritage, Our Treasure를 다룹니다. 그 사이 9월과 10월 말~11월에는 Unit 4~18(글의 요지·주제·제목, 어법·어휘, 빈칸추론, 글의 순서, 문단요약) 유형 학습이 두 차례 나오고, 12월은 영어 원서 읽기입니다. 정기시험 평가 요소도 세부 정보, 주제·요지, 함축적 의미, 논리적 관계 같은 읽기 항목이 중심입니다.",
      },
      {
        title: "두 쓰기 과제의 요구 차이",
        body: "에세이는 여러 문화권에서 이슈가 되는 주제를 골라 자기 의견을 문단으로 구성하고, 비판적 사고로 주장의 당위성을 세우며 어휘·어법을 정확히 쓰는지 봅니다. 탐구 보고서는 과거와 현재를 관통하는 사회 문제를 골라 탐구 내용을 보고서 형식으로 구성하는 과제입니다. 학기 논술형 35%가 이 두 과제에서 모두 나옵니다.",
      },
      {
        title: "리딩로그는 학기 내내 쌓입니다",
        body: "리딩로그는 8월 4주부터 11월 3주까지 이어지는 5% 영역으로, 영어로 제시된 글을 읽고 세부 내용을 바탕으로 이해했는지를 평가합니다. 8월 수업 계획에도 읽기 태도를 성찰하는 리딩 로그 포트폴리오를 활용한다고 적혀 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2"],
    summary: "정기시험 2회 50% · 수행 3개 50%(인권 프로젝트·기사 비평·포트폴리오)",
    intro:
      "죽전고등학교 1학년 통합사회2는 정기시험과 수행평가가 50%씩입니다. 수행 가운데 인권 침해 문제 해결 프로젝트와 사회 불평등 기사 비평이 20%씩 논술형이라, 상담은 두 과제가 있는 8월 4주와 9월 5주부터 짚습니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 25, timing: "9.17.-9.23.", method: "선택형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 25, timing: "11.30.-12.4.", method: "선택형 100점" },
      { name: "인권 침해 문제 해결 프로젝트", kind: "task", weight: 20, timing: "8월4주", method: "논술형" },
      { name: "사회 불평등 기사 비평하기", kind: "task", weight: 20, timing: "9월5주", method: "논술형" },
      { name: "배(배움)느(느낌)실(실천) 포트폴리오", kind: "task", weight: 10, timing: "8월2주-10월1주" },
    ],
    notes: [
      {
        title: "1차는 인권·정의·경제 체제, 2차는 시장과 세계",
        body: "1차 평가 요소는 헌법상 기본권과 인권 보장 장치, 청소년 노동권, 능력·업적·필요 기준의 정의, 자유주의·공동체주의 정의관, 시장·계획·혼합 경제 체제입니다. 2차는 합리적 선택과 경제 주체, 금융 자산과 국제 무역, 세계화 문제, 동아시아 역사 갈등, 세계 인구 문제, 에너지 자원 분포로 넘어갑니다.",
      },
      {
        title: "논술형 과제 두 개는 1차 범위와 겹칩니다",
        body: "인권 프로젝트의 성취기준 [10통사2-01-03]과 기사 비평의 [10통사2-02-03]은 모두 1차 정기시험 범위 목록에 들어 있습니다. 프로젝트는 인권 침해 해결 탐구 내용 작성, 인포그래픽 제작, 성찰과 자기 주도 학습 계획까지 요구하고, 기사 비평은 신문 기사를 준비·분석해 사회 불평등 해결 방안을 모색하는 과제입니다.",
      },
      {
        title: "포트폴리오는 단원마다 쓰는 활동지입니다",
        body: "배느실 포트폴리오(10%)는 각 단원의 배움, 느낌과 생각, 실천과 다짐을 활동지에 적고 관리하는 영역으로 8월 2주부터 10월 1주까지 이어집니다. 반영 성취기준은 [10통사2-01-01]~[10통사2-03-02]이며, 수업 계획에도 같은 기간이 수행평가로 표시되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "정기시험 2회 50% · 수행 3개 50%(화학변화·기상이변 탐구 분석, 주제탐구 발표)",
    intro:
      "1학년 통합과학2는 정기시험 50%, 수행평가 50%이고, 논술형 40%는 화학변화 탐구 분석과 기상이변 탐구 분석에서 20%씩 나옵니다. 죽전고 과학 과외에서는 8월 3주와 10월 1주에 놓인 두 탐구 분석 과제의 내용부터 시험 범위와 연결해 봅니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 25, timing: "9.17.-9.23.", method: "선택형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 25, timing: "11.30.-12.4.", method: "선택형 100점" },
      { name: "화학변화 탐구 분석하기", kind: "task", weight: 20, timing: "8월3주", method: "논술형" },
      { name: "기상이변 탐구 분석하기", kind: "task", weight: 20, timing: "10월1주", method: "논술형" },
      { name: "과학주제탐구 발표하기", kind: "task", weight: 10, timing: "8월1주-11월2주" },
    ],
    notes: [
      {
        title: "탐구 분석 과제와 시험 범위가 맞물립니다",
        body: "화학변화 과제의 성취기준 [10통과2-01-03]·[01-04]는 1차 범위에, 기상이변 과제의 [10통과2-02-03]은 2차 범위에 함께 들어 있습니다. 화학변화 과제는 산·염기 구분, 산화 환원 반응의 규칙성, 중화 반응에서 관찰되는 변화 서술을, 기상이변 과제는 온실효과 강화 메커니즘과 엘니뇨·사막화의 영향 분석을 요구합니다.",
      },
      {
        title: "1·2차 정기시험 평가 요소",
        body: "1차는 지질시대 환경과 생물 변화, 변이와 자연선택, 생물다양성, 산화 환원·중화 반응, 에너지 흡수·방출, 생태계 구성 요소입니다. 2차는 생태 피라미드와 생태계 평형, 지구 온난화, 엘니뇨·라니냐·사막화, 전자기 유도와 에너지 전환, 감염병·빅데이터 활용, 과학 관련 사회적 쟁점과 윤리까지 다룹니다.",
      },
      {
        title: "주제탐구 발표는 학기 전체 과제입니다",
        body: "과학주제탐구 발표(10%)는 8월 1주부터 11월 2주까지 이어지며, 과학기술 관련 사회적 쟁점의 해결책을 탐색하고 일상 속 과학 원리를 진로와 연계해 탐구한 뒤 발표 계획서와 보고서를 작성하는 구성입니다. 반영 성취기준이 1·2차 시험 범위 대부분에 걸쳐 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },

  // ───────── 2학년 ─────────
  {
    schoolSlug: "jukjeon-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["화법과 언어"],
    summary: "정기시험 2회 60%(선택형) · 수행 2개 40%(토론 입론서·국어 생활 성찰 보고서)",
    intro:
      "죽전고등학교 2학년 국어 과목은 1~12반이 함께 듣는 화법과 언어로, 1·2차 정기시험 30%씩과 수행평가 2개 20%씩으로 구성됩니다. 수행 40%가 모두 논술형이어서 입론서와 보고서를 쓰는 시기를 시험 준비 일정과 겹치지 않게 맞추는 것이 첫 순서입니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 100점", course: "화법과 언어" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점", course: "화법과 언어" },
      { name: "사회적 논제 토론 입론서 작성하기", kind: "task", weight: 20, timing: "8월2주~9월1주", method: "논술형", course: "화법과 언어" },
      { name: "국어 생활 비판적 성찰 및 개선 보고서 작성하기", kind: "task", weight: 20, timing: "10월2주~4주", method: "논술형", course: "화법과 언어" },
    ],
    notes: [
      {
        title: "정기시험은 문법 개념 문항이 중심입니다",
        body: "두 시험의 평가 요소에는 언어와 사고·사회·문화의 관계, 국어의 시대별 변화 양상, 표준 발음법, 품사와 문장 구조 선택에 따른 표현 효과, 어휘·문법 요소가 화자의 태도를 드러내는 기능이 공통으로 들어 있습니다. 2차에는 단어의 짜임과 의미 관계를 중심으로 한 어휘 활용이 추가됩니다.",
      },
      {
        title: "입론서는 논증 평가와 반대 신문까지 봅니다",
        body: "입론서 과제는 성취기준 [12화언01-11]·[01-12]에 근거해 공동체 문제를 분석하고 대안을 도출하는 것, 주장·이유·근거를 검토해 논증의 타당성·신뢰성·공정성을 평가하고 반대 신문을 하며 토론하는 것을 요소로 듭니다. 수업 계획에는 8월 2주~9월 1주 토의와 토론 단원에서 입론 개요서 쓰기를 관찰한다고 적혀 있습니다.",
      },
      {
        title: "보고서는 자기 국어생활을 자료로 씁니다",
        body: "10월 2주~4주 보고서는 [12화언01-14]·[01-15]를 근거로, 자신의 국어생활을 사회적 실천 행위로 성찰해 문제점과 개선 방안을 쓰고, 언어 공동체의 담화 관습과 다양한 관점을 존중하는 태도를 드러내도록 합니다. 국어생활과 공동체 단원 수업 중에 진행됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ"],
    summary: "정기시험 2회 60%(선택형) · 수행 3개 40%(심화탐구 에세이·미래사회논평·리딩 로그)",
    intro:
      "2학년 영어는 1~12반 모두 영어Ⅱ이며, 정기시험 1·2차 30%씩과 수행평가 40%(심화탐구 에세이 20%, 미래사회논평 15%, 리딩 로그 5%)로 성적이 나옵니다. 죽전고 영어Ⅱ 과외의 첫 논의는 읽기 유형 학습과 두 번의 영어 글쓰기를 어떤 순서로 배치할지입니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 100점", course: "영어Ⅱ" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점", course: "영어Ⅱ" },
      { name: "심화탐구 에세이", kind: "task", weight: 20, timing: "8월5주", method: "논술형", course: "영어Ⅱ" },
      { name: "미래사회논평", kind: "task", weight: 15, timing: "10월2주", method: "논술형", course: "영어Ⅱ" },
      { name: "리딩 로그", kind: "task", weight: 5, timing: "8월3주-11월3주", course: "영어Ⅱ" },
    ],
    notes: [
      {
        title: "진도표의 두 갈래",
        body: "교과서는 8월 1단원 Connecting Through Pop Culture, 9월 5주~10월 1주 4단원 Act Now for our Oceans!, 10월 2~3주 5단원 Shaping a Brighter Future 순입니다. 8월 말~9월과 10월 4주~11월에는 Unit 4~18(요지·주제·제목, 함축의미, 어법·어휘, 빈칸추론, 무관한 문장, 글의 순서, 문단요약)을 두 차례 다룹니다.",
      },
      {
        title: "1차와 2차의 평가 요소 차이",
        body: "1차는 세부 정보, 주제·요지, 화자나 필자의 심정·의도 추론에 더해 쓰기 과업을 협력적으로 수행하는 요소가 적혀 있습니다. 2차 요소는 다양한 말이나 글의 의미 파악, 전개 방식이나 구조 파악, 심정·의도 추론이며 쓰기 과업 항목은 빠져 있습니다. 두 시험 모두 선택형입니다.",
      },
      {
        title: "에세이와 논평이 요구하는 글",
        body: "8월 5주 심화탐구 에세이는 사실적 정보를 설명하고, 매체와 전략을 활용해 정보를 창의적으로 전달하며, 듣거나 읽은 내용을 글로 표현하는 과제입니다. 10월 2주 미래사회논평은 타당한 근거와 적절한 표현으로 주장하는 글을 쓰고 경험이나 사건을 서술하는 요소를 봅니다. 논술형 35%가 이 두 편에서 나옵니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  {
    schoolSlug: "jukjeon-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ"],
    summary: "정기시험 2회 60%(1차 논술형 24점) · 수행 4개 40%(사고력평가 2회·주제탐구·포트폴리오)",
    intro:
      "죽전고등학교 2학년 미적분Ⅰ은 수행평가가 극한과 연속 사고력평가, 미분 사고력평가, 주제탐구 활동, 포트폴리오의 네 영역이고 학기 논술형 반영은 39.2%입니다. 상담은 1차 시험의 논술형 24점과 두 번의 사고력평가 시기를 함께 놓고 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9.17.-9.23.", method: "선택형 76점(22.8%)·논술형 24점(7.2%)", course: "미적분Ⅰ" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11.30.-12.4.", method: "선택형 100점", course: "미적분Ⅰ" },
      { name: "극한과 연속 사고력평가", kind: "task", weight: 12, timing: "8월5주", method: "논술형", course: "미적분Ⅰ" },
      { name: "미분 사고력평가", kind: "task", weight: 12, timing: "10월5주", method: "논술형", course: "미적분Ⅰ" },
      { name: "미적분 주제탐구 활동", kind: "task", weight: 8, timing: "10월1주", method: "논술형", course: "미적분Ⅰ" },
      { name: "미적분활동 포트폴리오작성", kind: "task", weight: 8, timing: "8월2주-11월3주", course: "미적분Ⅰ" },
    ],
    notes: [
      {
        title: "1차는 극한·미분, 2차는 미분 활용과 적분",
        body: "1차 평가 요소는 함수의 극한과 연속성, 미분계수, 미분가능성과 연속성 비교, 도함수, 접선의 방정식, 평균값 정리, 증가·감소와 극대·극소입니다. 2차는 그래프 그리기, 방정식·부등식과 속도·가속도에의 활용, 부정적분과 정적분, 정적분으로 구하는 넓이와 이동 거리입니다.",
      },
      {
        title: "미분 사고력평가는 2차 범위 일부를 먼저 봅니다",
        body: "10월 5주 미분 사고력평가의 성취기준은 [12미적Ⅰ-02-01]~[02-10]이고, 이 가운데 [02-07]~[02-10]은 2차 정기시험 범위에도 들어 있습니다. 8월 5주 극한과 연속 사고력평가는 [01-01]~[01-04]만 다룹니다. 두 평가 모두 논술형이라 풀이 과정을 쓰는 연습이 필요한 시기가 시험 전에 한 번씩 옵니다.",
      },
      {
        title: "주제탐구와 포트폴리오",
        body: "10월 1주 주제탐구 활동(8%)은 함수의 극한과 연속성 이해, 미분 활용을 요소로 하는 논술형 과제입니다. 포트폴리오(8%)는 8월 2주부터 11월 3주까지 극한·연속성과 미적분 활용 내용을 쌓아 가는 영역으로, 수행 네 영역 중 유일하게 논술형 반영이 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("죽전고등학교")],
  },
  // ───────────────────────── 1학년 ─────────────────────────
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차시험 30%씩 · 수행 40%(문법 10·쓰기 및 듣기·말하기 10·읽기·쓰기 과정평가 20)",
    intro:
      "계산중학교 1학년 국어는 1·2차시험이 선택형·단답형으로만 60%를 채우고, 서술형과 논술형은 모두 수행평가 세 영역에서 나옵니다. 상담에서는 9월 4주 품사 과제와 학기 내내 쌓이는 읽고 쓰기 포트폴리오 일정부터 맞춰 봅니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월 1주", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형·단답형" },
      { name: "문법", kind: "task", weight: 10, timing: "9월 4주", method: "서술형 · 품사의 종류와 특성" },
      {
        name: "쓰기 및 듣기・말하기",
        kind: "task",
        weight: 10,
        timing: "수시",
        method: "서술형 · 학습 내용 정리 및 듣기·말하기 참여(서술·논술, 구술·발표, 프로젝트, 포트폴리오)",
      },
      { name: "읽기・쓰기 과정평가", kind: "task", weight: 20, timing: "수시", method: "논술형 · 읽고 쓰기 포트폴리오" },
    ],
    notes: [
      {
        title: "품사 과제는 분류와 분석 두 갈래",
        body: "문법 수행평가는 [9국04-03] 품사의 종류와 특성을 다루며, 채점 요소가 '품사의 분류'와 '품사 지식 활용하여 국어자료 분석하기' 두 가지로 5점씩입니다. 분류 항목에는 단어를 특성에 맞게 나눠 비주얼 씽킹으로 표현하는 기준이 들어 있어, 품사 이름을 외우는 데서 그치지 않고 실제 문장 속 단어를 근거를 들어 나눠 보는 연습이 계획과 맞습니다.",
      },
      {
        title: "듣기·말하기 점수에 연극 활동이 들어갑니다",
        body: "쓰기 및 듣기·말하기 영역의 '듣기·말하기 참여' 기준에는 토의·토론과 함께 연극 활동이 명시되어 있고, 배역의 성격과 상황을 이해해 목소리·표정·몸짓으로 대사를 표현하는지, 모둠 준비에 협력하는지를 봅니다. 나머지 절반은 단원별 학습 내용을 짜임새 있게 정리하는 '학습 내용 구조화'입니다.",
      },
      {
        title: "포트폴리오는 활동지 누락 개수로 단계가 갈립니다",
        body: "읽기·쓰기 과정평가(읽고 쓰기 포트폴리오)는 6점부터 20점까지 2점 간격이며, 채점 단계가 정해진 활동지 가운데 몇 개가 빠졌는지(1~2개, 3개, 4~5개 등)와 함께 나뉩니다. 수시로 쌓이는 영역이라 시험 기간에도 활동지를 빠짐없이 마무리해 두는 것이 이 20%와 직접 연결됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차시험 60%(선택형·단답형) · 9월 논술능력평가 20% · 11월 서술능력평가 20%",
    intro:
      "계산중학교 1학년 수학은 정기시험 두 번이 선택형·단답형으로 60%이고, 논술형 20%와 서술형 20%는 모두 수행평가에서 나옵니다. 상담에서는 9월 기본 도형 논술과 11월 입체도형 서술을 각각 언제부터 준비할지부터 정합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10.6 ~ 10.7 중", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12.8 ~ 12.10 중", method: "선택형·단답형" },
      { name: "논술능력평가", kind: "task", weight: 20, timing: "9.1 ~ 9.30 중", method: "논술형 · 점, 직선, 평면의 위치 관계" },
      {
        name: "서술능력평가",
        kind: "task",
        weight: 20,
        timing: "11.1 ~ 11.30 중",
        method: "서술형 · 다면체와 회전체 이해하기 / 입체도형의 겉넓이와 부피 구하기",
      },
    ],
    notes: [
      {
        title: "논술은 추론과 논리성을 따로 채점",
        body: "9월 논술능력평가는 [9수03-01] 점, 선, 면, 각과 위치 관계가 범위이고, '문제해결 추론'과 '논리성의 오류 유무'를 각각 10점 만점 5단계로 매깁니다. 답의 정확성과 별도로 서술 과정의 논리성과 표현력이 점수가 되므로, 위치 관계를 기호와 문장으로 함께 설명해 보는 연습이 필요합니다.",
      },
      {
        title: "서술능력평가는 해결 비율로 점수가 정해집니다",
        body: "11월 서술능력평가는 다면체·회전체의 성질과 입체도형의 겉넓이·부피가 범위이며, 문제 상황에 맞는 답을 올바른 수학적 기호로 제시한 비율(90% 초과, 80% 초과 …)에 따라 4점부터 20점까지 2점 간격으로 매깁니다. 기호 사용이 채점 문구 안에 함께 들어 있습니다.",
      },
      {
        title: "통계적 탐구는 학기말 점수 밖에서 평가",
        body: "6단원 통계 가운데 [9수04-04] 통계적 탐구(공학 도구로 자료를 수집·분석하고 해석하기)는 정기시험·수행평가가 아닌 구술·발표와 프로젝트로 성취 수준을 확인합니다. 같은 단원의 대푯값, 도수분포표·히스토그램, 상대도수는 정기시험 평가 방법에 표시되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차시험 30%씩 · 수행 40%(독서과정평가 10·논술형 프로젝트 20·말하기 10)",
    intro:
      "계산중학교 1학년 영어는 Lesson 5~8을 배우며 정기시험 두 번이 선택형·단답형으로 60%를 차지합니다. 수행평가 40% 가운데 절반이 9~11월 논술형 프로젝트라, 상담에서는 영어 글쓰기에서 언어형식을 몇 가지나 정확히 쓰는지부터 확인합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월 1주", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형·단답형" },
      { name: "독서과정평가", kind: "task", weight: 10, timing: "수시", method: "서술형 · 친숙한 주제에 관해 읽고 질문에 답하기" },
      { name: "논술형 프로젝트", kind: "task", weight: 20, timing: "9월~11월", method: "논술형 · 친숙한 주제에 관한 글쓰기" },
      { name: "말하기", kind: "task", weight: 10, timing: "8월~12월", method: "서술형 · 친숙한 주제에 관해 말하기(구술·발표)" },
    ],
    notes: [
      {
        title: "글쓰기 최고 단계는 언어형식 3가지 이상",
        body: "논술형 프로젝트의 최고 단계는 친숙한 주제의 글을 다양한 어휘로 쓰면서 언어형식을 3가지 이상 정확히 활용하고 문법 오류가 없는 경우이고, 2가지 활용은 한 단계 아래(18점)입니다. 기본 점수 12점에 2점 간격이라, 배운 문법 형식을 글에 의도적으로 넣어 보는 연습이 점수 단계와 바로 이어집니다.",
      },
      {
        title: "독서과정평가는 요지·세부 정보·함축 의미",
        body: "독서과정평가는 길고 복잡한 담화나 글에서 요지를 파악하고, 사실·맥락 정보로 세부 정보를 3가지 이상 찾고, 문맥으로 어휘·어구의 함축 의미를 추론하는지를 10점 만점으로 봅니다. 성취기준이 [9영01-02]~[9영01-09], [9영02-03]~[9영02-11]로 넓어 특정 Lesson에 한정되지 않습니다.",
      },
      {
        title: "말하기는 8월부터 12월까지 이어집니다",
        body: "말하기 영역은 경험이나 계획, 일이나 사건의 순서·원인과 결과 같은 논리적 관계를 설명하는지와 함께 매체 활용과 정보 윤리 준수까지 채점 기준에 들어 있습니다. 평가 방법에 구술·발표와 서술·논술이 같이 표시되어 있어, 말할 내용을 먼저 글로 정리해 두는 방식이 계획의 평가 방식과 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "12월 2차시험 한 번 60% · 서술 및 발표 20% · 논술 20%(11월 4주)",
    intro:
      "계산중학교 1학년 사회는 2학기 정기시험이 12월 2주 2차시험 한 번뿐이고, 이 시험이 선택형·단답형으로 60%를 차지합니다. 상담에서는 민주주의·정치 단원의 서술 및 발표 과제와 11월 4주 법·인권 논술을 시험 범위와 함께 묶어 일정을 짭니다.",
    assessments: [
      { name: "2차시험", kind: "exam", weight: 60, timing: "12월 2주", method: "선택형·단답형" },
      { name: "서술 및 발표", kind: "task", weight: 20, method: "서술형 10%·기타 10%" },
      { name: "논술", kind: "task", weight: 20, timing: "11월 4주", method: "논술형" },
    ],
    notes: [
      {
        title: "시험 표시가 있는 단원은 9~12단원",
        body: "교수학습 계획표에서 정기시험 표시가 있는 단원은 9. 민주주의와 시민부터 12. 인권과 기본권까지입니다. 11월 4주부터 배우는 7. 인간과 사회생활과 8. 다양한 문화의 이해는 정기시험·수행평가가 아닌 별도 평가 기준과 방법으로 성취 수준을 확인하도록 되어 있습니다.",
      },
      {
        title: "서술 및 발표는 사례 분석 두 가지",
        body: "서술 및 발표 과제의 채점 요소는 '민주주의 사례 분석'(제시된 내용 요소를 모두 담은 보고서)과 '정치 참여 방법 분석'(주어진 조건을 적용한 사례 분석과 설명)으로 10점씩이고, 기본 점수는 12점입니다. 성취기준은 민주주의 단원과 정치과정 단원([9사(일사)03-01]~[9사(일사)04-03])에 걸쳐 있습니다.",
      },
      {
        title: "논술은 서론·본론·결론 구성까지 채점",
        body: "11월 4주 논술은 법과 인권 단원([9사(일사)05-01]~[9사(일사)06-03])의 사회 문제를 다루며, '주장과 근거의 타당성'과 '논술문의 완성도'가 10점씩입니다. 완성도 기준에 서론·본론·결론 구성과 문단별 중심 내용이 명시되어 있어, 쓰기 전에 개요를 세워 보는 연습이 이 기준과 맞닿아 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차시험 30%씩 · 수행 40%(학습 과정 10·과학 논술 20·탐구 활동 10)",
    intro:
      "계산중학교 1학년 과학은 10월·12월 정기시험이 선택형·단답형 60%이고, 수행평가 40% 가운데 과학 논술 20%가 11월 태양계 단원에서 나옵니다. 상담에서는 9월 상태 변화 탐구 활동과 11월 논술 사이의 진도 일정부터 맞춥니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월", method: "선택형·단답형" },
      { name: "학습 과정", kind: "task", weight: 10, timing: "수시", method: "기타 · 포트폴리오 제작, 관리하기" },
      {
        name: "과학 논술",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "논술형 · 태양계 행성을 특징에 따라 분류하고, 달의 위상 설명하기",
      },
      {
        name: "탐구 활동",
        kind: "task",
        weight: 10,
        timing: "9월",
        method: "물질의 상태변화를 입자모형으로 표현하고, 사례를 설명하기",
      },
    ],
    notes: [
      {
        title: "논술 배점의 절반은 행성 분류",
        body: "11월 과학 논술은 [9과07-01]과 [9과07-04]가 범위이며, 행성을 목성형·지구형으로 분류하고 특징을 설명하는 항목이 10점, 달의 위상 5점, 일식과 월식 5점입니다. 일식·월식 항목에는 개기월식 때 달이 붉게 보이는 원인을 설명하는 기준이 들어 있습니다.",
      },
      {
        title: "탐구 활동은 입자 모형으로 상태 변화 표현",
        body: "9월 탐구 활동은 주어진 입자모형 재료로 상태 변화를 표현(입자의 개수·종류·위치)하는 항목 4점, 일상 속 상태변화 사례를 5개 이상 설명하는 항목 3점, 상태변화와 열에너지 출입 관계 3점으로 나뉩니다. 2학기 첫 단원인 Ⅳ. 물질의 상태 변화에서 치르는 과제입니다.",
      },
      {
        title: "학습 과정은 활동지·발표·참여",
        body: "학습 과정 10%는 [9과04-01]~[9과07-04] 전 범위에서 수업 활동지를 매회 완성하는지(포트폴리오 4점), 발표 및 경청(3점), 학습 참여도(3점)를 수시로 봅니다. 시험 범위 정리와 별개로 단원마다 활동지를 채워 두어야 하는 영역입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },

  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차시험 30%씩 · 문학 감상 및 표현 20% · 읽기·쓰기 과정평가 20%(둘 다 논술형)",
    intro:
      "계산중학교 2학년 국어는 수행평가 두 영역이 모두 논술형이라 학기 점수의 40%가 글로 쓴 결과물에서 나옵니다. 상담에서는 9월 문학 단원의 편지 쓰기 과제와 10월 2주 1차시험 범위를 먼저 확인합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월 2주", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형·단답형" },
      {
        name: "문학 감상 및 표현",
        kind: "task",
        weight: 20,
        timing: "9월",
        method: "논술형 · 사회·문화적 상황을 바탕으로 등장 인물에게 편지 쓰기",
      },
      { name: "읽기‧쓰기 과정평가", kind: "task", weight: 20, timing: "수시", method: "논술형 · 읽고 쓰기 포트폴리오" },
    ],
    notes: [
      {
        title: "편지 쓰기 과제가 보는 네 가지",
        body: "문학 감상 및 표현은 [9국05-05] 작품에 반영된 사회·문화적 상황을 이해하며 감상하기가 성취기준이고, 채점 요소는 사회·문화적 맥락의 이해와 반영, 인물의 심리와 처지에 대한 공감, 핵심 소재 및 상징 활용, 형식 및 분량입니다. 최고 단계는 작품 속 역사적 사건과 시대 상황을 편지 내용 전반에 드러내는 것입니다.",
      },
      {
        title: "포트폴리오는 독서 공유까지 채점",
        body: "읽고 쓰기 포트폴리오는 [9국02-01] 사회적 독서와 [9국03-06] 생각과 느낌이 드러나는 글쓰기를 묶은 과제로, 자료의 맥락 파악과 견해 서술 외에 자신의 글을 독자와 공유하고 피드백을 받아들이는 태도도 채점 문구에 들어 있습니다. 배점은 6점부터 20점까지 2점 간격입니다.",
      },
      {
        title: "1차시험 전후로 갈리는 진도",
        body: "진도표에서 10월 2주 이전에는 1단원(읽기 과정 점검, 복합양식 자료로 글쓰기)과 2단원(작품의 사회·문화적 상황, 갈등 조정하며 말하기)이 놓여 있고, 피동·인용 표현을 다루는 3단원은 10월 2주부터, 매체 단원인 4단원은 11월 3주부터 시작합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "정기시험 2회 60% · 9월 서술능력평가 20% · 11월 논술능력평가 20%(둘 다 도형)",
    intro:
      "계산중학교 2학년 수학 수행평가는 두 과제 모두 도형 단원에서 나옵니다. 9월에는 삼각형·사각형의 성질, 11월에는 닮음과 피타고라스 정리로 선분의 길이와 각의 크기를 구하므로, 상담에서는 증명과 정당화를 어디까지 익혔는지부터 봅니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10.6 ~ 10.7 중", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12.8 ~ 12.10 중", method: "선택형·단답형" },
      {
        name: "서술능력평가",
        kind: "task",
        weight: 20,
        timing: "9.1 ~ 9.30 중",
        method: "서술형 · 도형의 성질을 이용하여 주어진 선분의 길이와 각의 크기 구하기",
      },
      {
        name: "논술능력평가",
        kind: "task",
        weight: 20,
        timing: "11.3 ~ 11.28 중",
        method: "논술형 · 도형의 닮음과 피타고라스 정리를 이용하여 주어진 선분의 길이와 각의 크기 구하기",
      },
    ],
    notes: [
      {
        title: "두 과제 모두 해결 비율 한 항목으로 채점",
        body: "서술능력평가와 논술능력평가는 채점 요소가 '문제해결 추론' 하나이며, 조건에 맞게 올바른 수학적 기호를 써서 해결한 비율(90% 초과 100% 이하가 20점)에 따라 6점부터 20점까지 2점 간격으로 매깁니다. 수학적 기호 사용이 해결 비율 문구 안에 함께 들어 있습니다.",
      },
      {
        title: "평가 기준에 증명과 정당화가 들어 있습니다",
        body: "서술능력평가([9수03-09]~[9수03-11])의 최고 단계 기준은 삼각형과 사각형의 성질, 외심과 내심의 성질을 증명하고 이를 이용해 길이와 각을 구하는 것이고, 논술능력평가([9수03-12]~[9수03-15])는 삼각형의 닮음 조건과 피타고라스 정리를 정당화하는 것까지 포함합니다.",
      },
      {
        title: "확률은 정기시험에만 표시",
        body: "6단원 확률(경우의 수, 확률의 뜻과 기본 성질)은 11월 23일부터 배우는 단원으로, 계획표에 수행평가 표시 없이 정기시험 표시만 되어 있습니다. 12월 8~10일 2차시험을 앞두고 새로 시작하는 단원이라 진도와 시험 준비가 겹치는 구간입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차시험 30%씩 · 여행지 홍보 글쓰기 20%(11월 1주, 논술형) · 학습내용 서술하기 20%",
    intro:
      "계산중학교 2학년 영어는 정기시험 60%가 선택형·단답형이고, 수행평가 두 영역이 20%씩입니다. 11월 1주 여행지 홍보 글은 초고와 최종본을 모두 내야 하므로, 상담에서는 Lesson 7 진도와 초고 제출 시점부터 맞춥니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월 초 (10.6.~10.7.)", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월 2주 (12.8.~12.10.)", method: "선택형·단답형" },
      {
        name: "우리나라 여행지 홍보하는 글쓰기",
        kind: "task",
        weight: 20,
        timing: "11월 1주",
        method: "논술형 · 우리나라 여행지를 홍보하는 논술형 글쓰기",
      },
      { name: "학습내용 서술하기", kind: "task", weight: 20, timing: "수시", method: "서술형 · 자기주도학습 형태의 포트폴리오" },
    ],
    notes: [
      {
        title: "홍보 글의 채점 조건",
        body: "여행지 홍보 글은 수행과정, 내용, 언어사용, 분량이 5점씩입니다. 내용은 여행지 정보, 선택 이유, 활동과 행사, 맺음말 네 조건을, 언어사용은 주어·동사 수 일치, It~to부정사 또는 5형식 문장 등 여섯 조건을 보고, 분량은 완결된 문장 12개 이상이 최고 단계입니다.",
      },
      {
        title: "초고와 피드백 반영도 점수입니다",
        body: "수행과정 항목은 초고와 최종본을 기한 안에 모두 내고 받은 피드백을 반영해 고쳤는지를 봅니다. 완성본의 영어 표현과 별개로 제출 일정과 수정 과정이 5점을 차지하며, 평가 방법에는 서술·논술과 함께 프로젝트가 표시되어 있습니다.",
      },
      {
        title: "학습내용 서술하기는 5~8단원 포트폴리오",
        body: "학습내용 서술하기는 5~8단원의 학습지와 과제를 모은 포트폴리오로, 어휘 이해도가 10점(학습한 어휘의 90% 이상 이해가 최고 단계), 구성 및 제출 이행도 5점, 준비물 지참과 활동지 관리를 보는 참여도 및 성실성 5점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "1차시험 없음 · 12월 2차시험 50% · 세계사 논술 20%·역사 SNS 20%·포트폴리오 10%",
    intro:
      "계산중학교 2학년 사회과 평가는 역사 과목으로, 1차시험 없이 12월 2차시험 한 번이 50%이고 나머지 50%가 수행평가입니다. 상담에서는 10월 세계사 논술과 11월 역사 SNS 만들기의 단원 범위를 시험 범위와 나란히 놓고 봅니다.",
    assessments: [
      { name: "2차시험", kind: "exam", weight: 50, timing: "12월", method: "선택형·단답형" },
      { name: "세계사 논술", kind: "task", weight: 20, timing: "10월 중", method: "논술형" },
      { name: "역사 SNS 만들기", kind: "task", weight: 20, timing: "11월 중", method: "서술형" },
      { name: "포트폴리오", kind: "task", weight: 10, timing: "수시", method: "서술형" },
    ],
    notes: [
      {
        title: "세계사 논술은 해결 방안 3가지 이상이 기준",
        body: "세계사 논술은 [9역04-03]~[9역05-03] 범위의 사건 원인과 결과를 분석하고 영향과 의미를 평가하는 과제로, 역사 사실 이해·자료 해석 8점, 역사적 판단력·문제 해결 능력 8점, 태도 4점입니다. 판단력 항목의 최고 단계는 문제 상황을 분석해 타당한 해결 방안을 3가지 이상 근거와 함께 제시하는 것입니다.",
      },
      {
        title: "SNS 과제는 한 시대를 골라 표현",
        body: "역사 SNS 만들기는 한 시대를 골라 그 시대의 상황, 정치적 사건, 관련 국가와 인물, 주요 개념을 SNS 형식으로 표현하는 과제이고, 충족한 평가 요소 수에 따라 4점부터 20점까지 매깁니다. 시각적 표현의 적절성과 역사적 오류 여부도 평가 요소에 들어 있습니다.",
      },
      {
        title: "7단원 일부 성취기준은 별도 평가",
        body: "진도는 4단원 오스만 제국과 유럽 사회의 근대적 변화(8월)에서 시작해 7단원 현대 세계의 전개(10월 29일~11월 28일)까지 이어집니다. 7단원의 [9역07-02] 민주주의·인권 신장 노력과 [9역07-03] 세계화의 양상은 정기시험·수행평가가 아닌 별도 기준으로 성취 수준을 확인합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차시험 30%씩 · 학습 과정 10% · 탐구 활동 10%(11월) · 과학 논술 20%(9월)",
    intro:
      "계산중학교 2학년 과학은 9월 동물과 에너지 단원에서 과학 논술 20%를, 11월 전기와 자기 단원에서 탐구 활동 10%를 봅니다. 정기시험 60%와 함께 상담에서는 9월 논술이 다루는 기관계 범위부터 확인합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형·단답형" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월", method: "선택형·단답형" },
      { name: "학습 과정", kind: "task", weight: 10, timing: "수시", method: "서술형 4%·기타 6% · 포트폴리오 제작, 관리하기" },
      { name: "탐구 활동", kind: "task", weight: 10, timing: "11월", method: "서술형 6%·기타 4% · 전기 회로의 특성 탐구하기" },
      { name: "과학 논술", kind: "task", weight: 20, timing: "9월", method: "논술형 · 에너지 생성 과정 논술하기" },
    ],
    notes: [
      {
        title: "논술은 운동할 때 몸의 변화를 설명",
        body: "과학 논술은 소화·순환·호흡 등 기관계([9과13-01]~[9과13-03], [9과13-05])의 기능과 상호 작용을 세포 호흡·에너지 생성과 연결해 운동할 때 나타나는 몸의 변화를 설명하는 과제입니다. 과학 개념 이해 8점, 과학적 사고 및 설명 7점, 생활 사례 적용 5점으로, 인과 관계 제시와 생활 사례 연결이 따로 채점됩니다.",
      },
      {
        title: "탐구 활동은 회로를 직접 구성하고 측정",
        body: "11월 탐구 활동은 [9과14-02]·[9과14-03] 범위에서 전기 회로를 구성해 전류와 전압을 측정하는 항목 4점, 전류·전압·저항의 관계와 저항의 직렬·병렬연결 특징을 이해하고 적용하는 항목 6점입니다. 7단원 전기와 자기 진도(10월 1주~11월 2주) 안에서 치르는 과제입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "11월 2학기 시험 한 번 60% · 문법 20%(10월, 서술형) · 읽기·쓰기 과정평가 20%(논술형)",
    intro:
      "계산중학교 3학년 국어는 2학기 정기시험이 11월 한 번뿐이며 선택형으로 60%를 차지합니다. 상담에서는 10월 문법 수행평가(문장의 짜임)와 같은 시기에 배우는 3단원부터 먼저 정리합니다.",
    assessments: [
      { name: "2학기 시험", kind: "exam", weight: 60, timing: "11월", method: "선택형" },
      { name: "문법", kind: "task", weight: 20, timing: "10월", method: "서술형" },
      { name: "읽기·쓰기 과정평가", kind: "task", weight: 20, timing: "수시", method: "논술형" },
    ],
    notes: [
      {
        title: "문법은 홑문장·겹문장과 문장의 짜임",
        body: "문법 수행평가는 [9국04-06] 문장의 짜임과 양상이 범위로, 문장 성분과 홑문장·겹문장의 구조 이해(지식 8점), 안은문장의 종류와 이어진문장의 결합 방식을 분석해 표현 의도에 맞는 문장을 구성하기(기능 8점), 참여 및 협력(태도 4점)으로 채점합니다. 3단원 진도(10월 6일~23일)와 같은 시기입니다.",
      },
      {
        title: "11월 이후 진도는 자기·동료평가",
        body: "진도표에서 정기시험 표시는 10월 30일까지 배우는 1~4단원 앞부분에 있고, 11월 2일부터 다시 이어지는 각 단원 뒷부분(읽기 과정 점검, 통일 시대의 국어, 관찰·조사 글쓰기와 쓰기 윤리, 토론에서 논박하기 등)은 자기평가 및 동료평가로 표시되어 있습니다.",
      },
      {
        title: "과정평가는 학습지 수행 정도로 단계 구분",
        body: "읽기·쓰기 과정평가는 [9국02-01]·[9국03-01]을 묶어 국어 지식 및 개념 이해 8점, 활동지 작성 8점, 참여 및 협력 4점으로 보며, 활동지 항목은 학습지 과제를 완벽히, 2/3 이상, 1/3 이상, 1/3 미만 수행했는지로 단계를 나눕니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "11월 시험 한 번 60%(선택형) · 서술·논술 30%(9~10월) · 수학적 의사소통 10%",
    intro:
      "계산중학교 3학년 수학은 11월 정기시험 한 번이 60%이고, 수행평가 40% 가운데 30%가 삼각비와 원의 성질을 다루는 서술·논술입니다. 상담에서는 9~10월 서술·논술과 11월 시험이 같은 두 단원에서 나온다는 점부터 맞춥니다.",
    assessments: [
      { name: "2학기 시험", kind: "exam", weight: 60, timing: "11월", method: "선택형" },
      { name: "서술·논술", kind: "task", weight: 30, timing: "9월~10월", method: "서술 10%·논술 20%" },
      { name: "수학적 의사소통", kind: "task", weight: 10, timing: "수시", method: "활동지 및 학습지 완성도·태도" },
    ],
    notes: [
      {
        title: "서술·논술은 해결과 표현이 15점씩",
        body: "서술·논술은 [9수04-17]~[9수04-20] 범위에서 문제 이해 및 정보 활용(15점)과 풀이과정 표현능력(15점)을 1점 간격으로 매기고, 기본 점수는 10점입니다. 진도표에는 서술이 4단원 삼각비, 논술이 5단원 원의 성질에 표시되어 있고, 표현능력 최고 단계는 수학적 기호를 정확히 써서 풀이를 체계적으로 서술한 경우입니다.",
      },
      {
        title: "통계 단원은 시험 뒤에 배웁니다",
        body: "진도표상 6단원 통계(중앙값·최빈값·평균, 분산과 표준편차, 산점도와 상관관계)는 11월 2일부터 배우며 자기평가 및 동료평가로 표시되어 있습니다. 정기시험과 수행평가 표시는 4단원 삼각비와 5단원 원의 성질에만 있어, 11월 시험 준비 범위가 이 두 단원으로 모입니다.",
      },
      {
        title: "의사소통 10점은 활동지와 참여 태도",
        body: "수학적 의사소통은 삼각비와 원의 성질 수업에서 쓰는 활동지 및 학습지의 완성도 5점과 활동 참여 태도 5점으로 매기며, 2점부터 10점까지 1점 간격입니다. 평가 개요에는 시기가 '수시'로 적혀 있어 단원 진행 중 활동지를 꾸준히 완성해 두는 것이 이 항목과 연결됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "11월 시험 한 번 60% · 그래프 분석 글쓰기 20%(논술형) · 학습지 활용 영작하기 20%",
    intro:
      "계산중학교 3학년 영어는 11월 2~4일 2학기 고사 한 번이 60%이고, 수행평가 두 영역이 20%씩입니다. 상담에서는 그래프 데이터를 영어로 기술하는 논술형 과제와 수시로 쌓이는 학습지 영작을 나눠 준비 순서를 정합니다.",
    assessments: [
      { name: "2학기시험", kind: "exam", weight: 60, timing: "11월", method: "선택형" },
      {
        name: "그래프 분석 글쓰기",
        kind: "task",
        weight: 20,
        method: "논술형 · 핵심 어휘와 핵심 문법을 활용한 논리적 글쓰기",
      },
      {
        name: "학습지 활용 영작하기",
        kind: "task",
        weight: 20,
        timing: "수시",
        method: "서술형 · 핵심 어휘 및 문법을 활용하여 문장 영작하기",
      },
    ],
    notes: [
      {
        title: "그래프 글쓰기는 분석·언어·조건 충족",
        body: "그래프 분석 글쓰기는 [9영04-01] 대상이나 상황을 묘사하는 문장 쓰기가 성취기준이며, 그래프 데이터 분석과 관련 사실 기술(내용 및 분석력 5점), 언어 형식과 오류(언어 및 문법 사용 5점), 제시된 과제 완성 조건의 충족 비율(과제 완성 10점)로 채점합니다. 배점은 6점부터 20점까지입니다.",
      },
      {
        title: "영작 학습지는 제출 비율이 절반",
        body: "학습지 활용 영작하기 20점 가운데 10점은 주어진 과제와 학습지를 얼마나 완수해 제출했는지(100%, 90% 이상 …)로 정해지고, 언어 및 문법 사용 5점, 수업 발표 및 참여도 5점입니다. 성취기준은 Lesson 5~7의 듣기·말하기·읽기·쓰기 전반에 걸쳐 있습니다.",
      },
      {
        title: "11월 고사 이후 진도는 자기·동료평가",
        body: "진도표에서 11월 5일 이후의 Lesson 7 읽기, Lesson 8 듣기·말하기·읽기, Special Lesson은 자기평가 및 동료평가로 표시되어 있고, 이 범위 성취기준은 정기시험·수행평가가 아닌 별도 기준으로 평가합니다. 10월 15일~11월 4일 구간에는 Lesson 8 쓰기 활동에도 정기시험 표시가 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회 11월 시험 60%·논술 20%·서술 20% / 역사 11월 시험 70%·논술 20%·포트폴리오 10%",
    intro:
      "계산중학교 3학년은 사회(지리 영역)와 역사를 함께 배우며, 두 과목 모두 11월 정기시험 한 번을 선택형으로 치릅니다. 시험 비중이 사회 60%, 역사 70%로 달라 상담에서는 과목별 수행평가 일정(사회 8월 논술, 역사 10월 논술)부터 나눠 봅니다.",
    assessments: [
      { name: "2학기 시험", kind: "exam", weight: 60, timing: "11월", method: "선택형", course: "사회" },
      { name: "논술", kind: "task", weight: 20, timing: "8월", method: "논술형", course: "사회" },
      { name: "서술", kind: "task", weight: 20, timing: "10월", method: "서술형", course: "사회" },
      { name: "2학기 시험", kind: "exam", weight: 70, timing: "11월", method: "선택형", course: "역사" },
      { name: "논술", kind: "task", weight: 20, timing: "10월", method: "논술형", course: "역사" },
      { name: "포트폴리오", kind: "task", weight: 10, timing: "수시", course: "역사" },
    ],
    notes: [
      {
        title: "사회: 기후 변화 논술과 도시 서술",
        body: "사회 논술은 [9사(지리)10-01] 기후 변화의 원인과 지역 변화, 해결을 위한 노력을 다루고 문제에 대한 이해·내용의 논리성·문제 해결력·분량의 적절성을 5점씩 봅니다. 10월 서술은 도시 단원([9사(지리)08-01]~[9사(지리)08-04])에서 도시 내부 지역 분화 개념을 바탕으로 주제에 맞게 작성하는지를 봅니다.",
      },
      {
        title: "역사: 논술 범위는 사림부터 조선 후기 정치까지",
        body: "역사 논술은 [9역10-02] 사림 세력, [9역10-04] 왜란과 호란, [9역11-01] 조선 후기 정치 운영과 제도 개혁이 범위이며, 논술 주제에 맞는 객관적 사실을 근거로 서술했는지와 자료 제시가 적절한지를 봅니다. 포트폴리오는 4~5단원 학습지 정리와 과제 수행 결과를 2점부터 10점까지 매깁니다.",
      },
      {
        title: "11월 2일 이후 진도는 두 과목 모두 자기·동료평가",
        body: "두 과목 모두 11월 2일 이후 진도는 자기평가 및 동료평가로 표시되어 있습니다. 사회는 글로벌 경제 활동과 지역 변화, 환경 단원 후반부, 지역화 전략과 통일, 더불어 사는 세계가, 역사는 조선 후기 학문·예술과 사회 변화, 6단원 근현대 사회의 전개가 여기에 해당합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "11월 시험 한 번 60% · 학습 과정 10% · 탐구 활동 10%(10월) · 과학 논술 20%(9월)",
    intro:
      "계산중학교 3학년 과학은 11월 정기시험 한 번이 60%이고, 수행평가는 9월 유전 단원 논술, 10월 전자기 유도 탐구, 수시 학습 과정으로 나뉩니다. 상담에서는 9월 가계도 논술과 생식과 유전 단원 진도부터 맞춥니다.",
    assessments: [
      { name: "2학기 시험", kind: "exam", weight: 60, timing: "11월", method: "선택형" },
      { name: "학습 과정", kind: "task", weight: 10, timing: "수시" },
      { name: "탐구 활동", kind: "task", weight: 10, timing: "10월", method: "서술형" },
      { name: "과학 논술", kind: "task", weight: 20, timing: "9월", method: "논술형" },
    ],
    notes: [
      {
        title: "논술은 멘델 원리와 가계도",
        body: "과학 논술은 [9과21-04]·[9과21-05]가 범위로, 멘델 유전 원리로 사람의 유전을 설명하는 개념 이해, 가계도 해석, 가계도 분석이 6점씩이고 글의 논리적 구성이 2점입니다. 개념 이해 항목은 제시문에서 찾아 제시한 요소 개수(6가지부터 1가지 이하까지)로 단계를 나눕니다.",
      },
      {
        title: "탐구 활동은 발전기 원리 실험",
        body: "10월 탐구 활동은 [9과22-02] 자석의 운동으로 전류가 생기는 현상과 역학적 에너지가 전기 에너지로 전환되는 과정을 실험으로 다루며, 개념 이해, 탐구 활동 보고서와 결론 도출, 실험 장치 설치와 수행, 실험 태도와 실험실 안전규칙 준수를 봅니다.",
      },
      {
        title: "Ⅶ·Ⅷ 단원은 자기·동료평가",
        body: "진도표에서 정기시험·수행평가 표시는 Ⅴ. 생식과 유전과 Ⅵ. 에너지 전환과 보존에 있고, 14주부터 배우는 Ⅶ. 별과 우주와 Ⅷ. 과학기술과 인류 문명은 자기평가 및 동료평가로 표시되어 있습니다. 학습 과정 10%의 성취기준 범위도 [9과21-01]~[9과22-03]입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("계산중학교")],
  },
  // ───────── 1학년 ─────────
  {
    schoolSlug: "mugeo-middle-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "정기시험 2회 60% · 수행 2개 40%(독서 구술평가·주장하는 글쓰기)",
    intro:
      "무거중학교 1학년 국어는 10월·12월 정기시험이 각 30%, 9월 독서 구술평가와 11월 주장하는 글쓰기가 각 20%입니다. 상담에서는 1차 시험의 서‧논술형 40점과 두 수행의 채점 요소부터 함께 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "독서 구술평가", kind: "task", weight: 20, timing: "9월 중", method: "구술 평가" },
      { name: "주장하는 글쓰기", kind: "task", weight: 20, timing: "11월 중", method: "프로젝트 평가" },
    ],
    notes: [
      {
        title: "서‧논술형은 1차 시험에만 있습니다",
        body: "1차 정기시험(10월 3주)은 선택형 60점과 서‧논술형 40점으로 나뉘지만, 2차 정기시험(12월 3주)은 선택형 100점에 서‧논술형이 0점입니다. 1차 시험의 관련 성취기준은 품사, 문학 속의 갈등, 토의, 요약하며 읽기이므로 이 단원들을 글로 답하는 연습이 1차 대비의 중심이 됩니다.",
      },
      {
        title: "독서 구술평가는 근거를 말로 정리하는 평가",
        body: "9월 독서 구술평가는 '문학 속의 갈등' 단원과 연결됩니다. 채점 요소는 갈등의 진행과 해결 과정 이해, 소설 상황을 자신의 삶이나 현실 사회 문제와 연결해 근거 제시하기, 적절한 성량과 속도로 답하기, 구술 연습에서 친구의 질문과 답변에 참여하는 태도 네 가지입니다.",
      },
      {
        title: "주장하는 글쓰기의 채점 기준",
        body: "11월 주장하는 글쓰기는 개요 작성, 타당한 근거의 개수(3개 이상이면 상), 서론-본론-결론의 문단 구성, 간결하고 통일성 있는 표현을 봅니다. 평가방법 칸에 서술·논술과 프로젝트가 함께 체크되어 있어 개요부터 완성 글까지의 과정이 평가 대상입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "정기시험 2회 60% · 수행 2개 40%(나눔 물건 소개·직업 박람회 포스터)",
    intro:
      "1학년 영어 수행은 9월 5주 '자신이 가지고 있는 무료 나눔 물건 소개하기'(서술 및 구술형)와 10월 5주 '미래 직업 박람회 포스터 만들기'(프로젝트)가 각 20%입니다. 상담에서는 두 과제에 지정된 문법 요소와 1차 시험 서‧논술형부터 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "자신이 가지고 있는 무료 나눔 물건 소개하기", kind: "task", weight: 20, timing: "9월 5주", method: "서술 및 구술형 평가" },
      { name: "미래 직업 박람회 포스터 만들기", kind: "task", weight: 20, timing: "10월 5주", method: "프로젝트 평가" },
    ],
    notes: [
      {
        title: "과제마다 지정된 문법이 다릅니다",
        body: "나눔 물건 소개하기(Lesson 6)는 to부정사의 명사적 용법이나 that절을, 직업 박람회 포스터(Lesson 7)는 to부정사의 부사적 용법이나 시간 접속사를 올바르게 쓰는지 '언어 사용' 20점으로 봅니다. 두 과제 모두 초고와 최종본을 내고 피드백을 반영했는지가 '과제 완성도' 30점입니다.",
      },
      {
        title: "말하기와 시각 자료도 채점에 들어갑니다",
        body: "첫 과제는 평가방법에 서술·논술과 구술·발표가 함께 체크되어 있고, 발음과 머뭇거림 없는 발표를 보는 '전달력과 유창성'이 30점입니다. 두 번째 과제는 포스터의 그림·상징이 글 내용과 일치하는지를 따로 채점합니다. 정기시험 서‧논술형 40점은 1차(10월 3주)에만 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "정기시험 2회 60% · 논술형 수행 2개 40%(문제해결 전략·평면도형)",
    intro:
      "무거중 1학년 수학은 정기시험 60%에 논술형 평가 두 개 40%가 더해집니다. 수행 두 개가 모두 식과 풀이 과정을 쓰는 형식이라, 상담에서는 풀이를 끝까지 적는 습관과 1차 시험 서‧논술형 40점을 같이 점검합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "영역별 문제해결 전략 적용하기", kind: "task", weight: 20, timing: "9~10월", method: "논술형 평가" },
      { name: "평면도형 문제해결하기", kind: "task", weight: 20, timing: "11월", method: "논술형 평가" },
    ],
    notes: [
      {
        title: "9~10월 수행: 정비례·반비례와 작도",
        body: "첫 수행의 평가영역은 '정비례와 반비례'와 '작도와 합동'입니다. 정비례·반비례 문제를 올바른 식과 풀이 과정으로 해결하는지, 선분과 각, 조건에 맞는 삼각형을 순서대로 정확하게 작도하는지가 다섯 개의 채점 요소로 적혀 있습니다.",
      },
      {
        title: "11월 수행: 평면도형의 성질",
        body: "두 번째 수행은 다각형의 대각선과 내각의 크기, 원의 둘레와 넓이, 부채꼴의 호의 길이와 넓이 문제를 식과 풀이 과정으로 해결하는지 봅니다. 같은 평면도형 단원이 2차 정기시험(12월 3주) 범위에도 들어가지만, 2차 시험은 선택형 100점으로만 구성됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "정기시험 2회 60% · 프로젝트 수행 2개 40%(마인드맵·법 타이포그래피)",
    intro:
      "1학년 사회는 정기시험 두 번이 각 30%이고, 9월과 11월에 프로젝트 평가가 20%씩 있습니다. 상담은 1차 시험 서‧논술형 40점 대비와, 단원 개념을 시각 자료로 정리하는 두 과제의 채점 요소를 맞추는 데서 출발합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "인간과 사회생활 마인드맵으로 표현해 보기", kind: "task", weight: 20, timing: "9월", method: "프로젝트 평가" },
      { name: "일상생활에서 적용되는 법 타이포그래피로 완성해 보기", kind: "task", weight: 20, timing: "11월", method: "프로젝트 평가" },
    ],
    notes: [
      {
        title: "두 프로젝트 모두 개념을 그림으로 정리합니다",
        body: "9월 과제는 '7. 인간과 사회생활' 단원을 마인드맵으로, 11월 과제는 '11. 일상생활과 법' 단원을 타이포그래피로 완성합니다. 마인드맵은 사회화와 정체성, 지위와 역할, 사회 갈등과 차별을 다루는 내용의 정확성이 40점이고, 타이포그래피는 법의 의미와 목적 이해와 자료를 바탕으로 한 완성이 각 30점입니다.",
      },
      {
        title: "서술형 대비는 10월 전에",
        body: "1차 정기시험(10월 3주)은 선택형 60점과 서‧논술형 40점, 2차 정기시험(12월 3주)은 선택형 100점입니다. 9월 마인드맵 과제의 '인간과 사회생활' 단원이 1차 시험 범위에도 들어 있어, 과제로 정리한 개념을 문장으로 설명해 보는 것이 1차 서‧논술형 준비와 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "정기시험 2회 60% · 수행 2개 40%(상태변화 프로젝트·힘 탐구실험 보고서)",
    intro:
      "1학년 과학 수행 두 개는 모두 9월(2주·5주)에 있고, 정기시험은 10월 3주와 12월 3주에 각 30%입니다. 상담에서는 9월에 몰린 실험·프로젝트 일정과 1차 시험 서‧논술형 40점을 먼저 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "상태변화 프로젝트", kind: "task", weight: 20, timing: "9월 2주", method: "프로젝트 평가" },
      { name: "여러가지 힘 탐구실험 보고서", kind: "task", weight: 20, timing: "9월 5주", method: "탐구실험 평가" },
    ],
    notes: [
      {
        title: "수행 40%가 1차 시험 전에 끝납니다",
        body: "상태변화 프로젝트는 9월 2주, 여러가지 힘 탐구실험 보고서는 9월 5주로 잡혀 있어, 진도표의 1차 정기시험(10.13~10.15)보다 앞서 수행이 모두 마무리됩니다. 두 평가 모두 평가방법 칸에 프로젝트와 실험·실습이 함께 체크되어 있습니다.",
      },
      {
        title: "두 과제의 채점 요소",
        body: "상태변화 프로젝트는 상태가 변할 때의 질량·부피 측정, 입자모형으로 설명하기, 실생활 예 제시, 그 예를 넣어 일기 쓰기로 이어집니다. 힘 탐구실험 보고서는 탄성력과 마찰력을 측정해 특징을 설명하고, 중력과 부력은 타이포그래피로 표현한 뒤 설명하는지를 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },

  // ───────── 2학년 ─────────
  {
    schoolSlug: "mugeo-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "정기시험 2회 60% · 서술·논술형 수행 2개 40%(작품 감상·광고 평가)",
    intro:
      "무거중학교 2학년 국어 수행은 두 개 모두 서술·논술형 평가로, '작품 속의 삶 감상하기'(9월 중)와 '광고 평가하기'(9월~10월 중)가 각 20%입니다. 상담은 1차 정기시험(10월 3주) 서‧논술형 40점과 이 두 글쓰기 과제의 채점 항목을 함께 보는 데서 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "작품 속의 삶 감상하기", kind: "task", weight: 20, timing: "9월 중", method: "서술·논술형 평가" },
      { name: "광고 평가하기", kind: "task", weight: 20, timing: "9월~10월 중", method: "서술·논술형 평가" },
    ],
    notes: [
      {
        title: "작품 감상은 시대 배경과 작가 의도에 배점이 큽니다",
        body: "'문학 속의 삶' 단원 과제는 작품 내용 파악(20점), 작품에 반영된 사회문화적 상황 3가지 이상 정리(30점), 작가 의도에 대한 가상 인터뷰 질문·답변 2가지 이상(30점), 자신의 감상 정리(20점)로 채점합니다. 줄거리 요약보다 배경과 의도를 찾는 항목의 비중이 더 높습니다.",
      },
      {
        title: "광고는 세 가지 기준으로 평가합니다",
        body: "'글과 자료 평가하며 읽기' 단원 과제는 광고의 제작 의도 파악, 타당성·신뢰성·표현 방법의 적절성 세 기준으로 평가하기, 보완할 점 2가지 이상 제시, 그 내용을 반영한 광고 수정으로 이어집니다. 두 수행 모두 9~10월로 잡혀 있어 1차 정기시험(10.13~10.15) 준비 기간과 시기가 가깝습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "정기시험 2회 60%(두 회차 모두 서‧논술형 40점) · 서술·논술형 수행 2개 40%",
    intro:
      "2학년 영어는 이 학교 국어·영어·수학·사회·과학 평가표 가운데 2차 정기시험에도 서‧논술형 40점이 있는 유일한 경우입니다. 수행은 예술 작품 감상 프로젝트와 필수 문장 활용 글쓰기(11월 2주)가 각 20%이므로, 상담에서는 두 시험의 서술형 대비부터 계획합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "예술 작품 감상 프로젝트", kind: "task", weight: 20, method: "서술･논술형 평가" },
      { name: "필수 문장 활용 글쓰기", kind: "task", weight: 20, timing: "11월 2주", method: "서술･논술형 평가" },
    ],
    notes: [
      {
        title: "예술 작품 감상 프로젝트",
        body: "Lesson 5와 연결된 과제로, 초고·1차과제·최종본 제출과 피드백 반영(수행 과정 20점), 작품 장면 묘사·감상평과 그 이유·작품 해석(내용 50점), 관계대명사 사용을 포함한 언어 사용을 채점합니다. 반영 비율 표의 시기와 진도표상 위치가 서로 달라 이 과제의 시기는 적지 않았습니다.",
      },
      {
        title: "필수 문장 활용 글쓰기는 영작이 절반",
        body: "Lesson 5~7에서 주어진 영어 문장을 영작하고 해석하는 능력이 50점(16~20개 문장이면 상), 그 문장을 활용해 주제에 맞게 쓴 글이 50점입니다. 교과서 핵심 문장을 정확하게 쓸 수 있는지가 점수의 절반을 차지하는 구조입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "정기시험 2회 60% · 논술형 수행 2개 40%(삼각형·사각형, 닮음·피타고라스)",
    intro:
      "2학년 수학은 10월 3주와 11월 3주에 논술형 수행평가가 하나씩(각 20%) 있고, 정기시험 두 번이 각 30%입니다. 상담에서는 증명과 풀이를 서술하는 수행 기준과 1차 시험 서‧논술형 40점을 함께 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "삼각형과 사각형 성질 문제 해결하기", kind: "task", weight: 20, timing: "10월 3주", method: "논술형 평가" },
      { name: "영역별 문제해결 전략 적용하기", kind: "task", weight: 20, timing: "11월 3주", method: "논술형 평가" },
    ],
    notes: [
      {
        title: "10월 수행에는 증명이 들어갑니다",
        body: "'삼각형과 사각형 성질 문제 해결하기'는 이등변삼각형의 두 밑각이 같음을 증명하기, 합동인 직각삼각형과 합동 조건 찾기, 외심·내심의 성질 적용, 평행사변형·직사각형·마름모·정사각형의 성질 서술 다섯 항목으로 채점합니다. 1차 정기시험과 같은 10월 3주에 잡혀 있습니다.",
      },
      {
        title: "11월 수행은 닮음과 피타고라스 정리",
        body: "'영역별 문제해결 전략 적용하기'의 평가영역은 'Ⅴ. 도형의 닮음과 피타고라스 정리'입니다. 닮음 조건 설명, 평행선 사이 선분의 길이의 비, 무게중심을 이용한 중선의 길이나 넓이, 피타고라스 정리 적용을 봅니다. 그 뒤 2차 정기시험(12월 3주)은 선택형 100점으로만 구성됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "역사: 정기시험 2회 60% · 수행 2개 40%(타이포셔너리·세계사 프로젝트)",
    intro:
      "무거중 2학년 사회 계열 과목은 역사입니다. 정기시험 두 번이 각 30%이고, 10월 4주 타이포셔너리 만들기와 11월 4주 세계사 프로젝트 학습이 각 20%입니다. 상담에서는 두 수행이 같은 단원에서 나온다는 점부터 짚습니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "타이포셔너리 만들기", kind: "task", weight: 20, timing: "10월 4주", method: "서·논술형 평가" },
      { name: "세계사 프로젝트 학습", kind: "task", weight: 20, timing: "11월 4주", method: "프로젝트 평가" },
    ],
    notes: [
      {
        title: "두 수행이 한 단원에서 나옵니다",
        body: "타이포셔너리 만들기와 세계사 프로젝트 학습의 평가영역은 모두 'Ⅴ. 제국주의와 국민 국가 건설 운동'입니다. 첫 과제는 주제(키워드) 선정, 마인드맵 작성, 구상 의도 설명, 타이포셔너리 표현을 채점하고, 두 번째 과제는 유럽·아메리카의 국민 국가 체제, 산업화와 제국주의, 아시아의 국민 국가 건설 운동을 나눠 봅니다.",
      },
      {
        title: "사건을 서로 연결해 설명하는 기준",
        body: "세계사 프로젝트의 상 기준은 시민 혁명을 국민 국가 형성과, 서양의 산업화를 제국주의 정책과 연결해 이해하는 것입니다. 1차 정기시험(10월 3주)은 선택형 60점·서‧논술형 40점, 2차(12월 3주)는 선택형 100점이므로, 원인과 결과를 잇는 서술은 1차 시험과 이 수행에서 주로 확인됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "정기시험 2회 60% · 수행 2개 40%(광합성 실험 설계·주제 탐구 보고서)",
    intro:
      "무거중 2학년 과학 수행은 9월 1주 광합성 실험 설계와 9월 5주 주제 탐구 보고서로, 둘 다 1차 정기시험 전에 끝납니다. 상담에서는 학기 초 수행 일정과 변인 설정 같은 실험 설계 기준부터 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "광합성에 영향을 미치는 요인 탐구 실험 설계", kind: "task", weight: 20, timing: "9월 1주", method: "탐구 실험 설계" },
      { name: "주제 탐구 보고서", kind: "task", weight: 20, timing: "9월 5주", method: "주제 탐구" },
    ],
    notes: [
      {
        title: "광합성 실험 설계에서 보는 것",
        body: "'식물과 에너지' 단원 과제는 탐구 문제와 가설 설정, 조작·종속 변인과 통제 변인 3가지 이상 설정, 예상 결과를 표나 그래프로 표현하기, 가설과 연결한 결론 도출을 채점합니다. 평가방법은 서술·논술과 포트폴리오로, 설계와 예측을 글로 쓰는 과제입니다.",
      },
      {
        title: "주제 탐구 보고서는 소화 단원",
        body: "두 번째 과제의 평가영역은 'Ⅵ. 동물과 에너지'로, 식품 속 영양소의 검출 방법과 결과 해석, 소화 기관의 구조와 기능, 소화 과정과 소화 효소의 작용을 봅니다. 정기시험은 1차(10월 3주)에만 서‧논술형 40점이 있고 2차(12월 3주)는 선택형 100점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },

  // ───────── 3학년 ─────────
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "정기시험 2회 60%(2차 11월 3주) · 수행 2개 40%(시 해석 논술·말하기 구술)",
    intro:
      "무거중학교 3학년 국어는 2차 정기시험이 11월 3주로 1·2학년보다 한 달 빠릅니다. 수행은 9월 '다양한 방법으로 시 해석하기'(논술형)와 10월 '청중을 고려하여 말하기'(구술 평가)가 각 20%이며, 상담은 이 일정에 맞춰 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "다양한 방법으로 시 해석하기", kind: "task", weight: 20, timing: "9월", method: "논술형 평가" },
      { name: "청중을 고려하여 말하기", kind: "task", weight: 20, timing: "10월", method: "구술 평가" },
    ],
    notes: [
      {
        title: "한 편의 시를 여러 관점으로",
        body: "'1. 문학의 샘' 단원 과제는 내재적 관점으로 해석한 시를 삽화로 표현했는지, 문학의 해석 방법을 다양하게 활용해 감상했는지, 해석 방법에 맞는 근거를 들었는지(30점)를 봅니다. 감상 내용 자체보다 어떤 관점으로 읽었는지와 그 근거가 채점의 중심입니다.",
      },
      {
        title: "말하기는 시간까지 채점합니다",
        body: "'청중을 고려하여 말하기'는 2분 10초 이상 2분 50초 이하로 말해야 '주어진 시간' 항목에서 상(20점)을 받습니다. 그 밖에 청중을 향한 시선과 표정, 말하기 불안 대처(30점), 내용의 적절성과 체계를 봅니다. 10월은 1차 정기시험(10.13~10.15)이 있는 달이기도 합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "정기시험 2회 60% · 서술·논술형 수행 2개 40%(친환경 광고문·필수 문장 글쓰기)",
    intro:
      "3학년 영어 수행은 9월 2주 친환경 제품 광고문 쓰기와 10월 5주 필수 문장 활용 글쓰기로, 둘 다 서술·논술형 20%입니다. 상담에서는 두 영작 과제의 채점 항목과 1차 시험(10월 3주) 서‧논술형 40점을 같이 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점" },
      { name: "친환경 제품을 홍보 하는 광고문 쓰기", kind: "task", weight: 20, timing: "9월 2주", method: "서술,논술형 평가" },
      { name: "필수 문장 활용 글쓰기", kind: "task", weight: 20, timing: "10월 5주", method: "서술,논술형 평가" },
    ],
    notes: [
      {
        title: "광고문은 정보와 자기 주장을 함께",
        body: "친환경 제품 하나를 골라 정보를 조사하고 홍보 광고문으로 옮기는 과제입니다(Lesson 5). 채점은 세 갈래로, 초고에서 최종본까지 고쳐 쓴 과정과 피드백 반영이 20점, 제품 정보와 친환경에 대한 자기 견해가 내용 점수, 주어·동사를 갖춘 문장과 어법·철자가 언어 사용 점수입니다.",
      },
      {
        title: "필수 문장 글쓰기와 2차 시험",
        body: "교과서 Lesson 5~7의 필수 문장을 영어로 옮기고 뜻을 풀이하는 부분(16~20개 문장이면 상)과, 그 문장을 넣어 주제 글을 완성하는 부분(50점)으로 나뉩니다. 과제를 마치면 11월 3주(11.16~11.18) 2차 정기시험이 이어지고, 2차 시험지에는 선택형 100점 칸만 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "정기시험 2회 60% · 논술형 수행 2개 40%(도형 문제·영역별 문제해결전략)",
    intro:
      "무거중 3학년 수학은 1차(10월 3주)와 2차(11월 3주) 정기시험이 각 30%, 논술형 수행 두 개가 각 20%입니다. 상담에서는 삼각비·원의 성질·통계 단원을 올바른 식과 풀이 과정으로 서술하는 기준부터 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "도형 문제 해결하기", kind: "task", weight: 20, method: "논술형 평가" },
      { name: "영역별 문제해결전략 적용하기", kind: "task", weight: 20, timing: "11월 3주", method: "논술형 평가" },
    ],
    notes: [
      {
        title: "첫 수행: 삼각비와 원과 직선",
        body: "'도형 문제 해결하기'는 삼각비의 뜻과 삼각비의 표 활용, 삼각비를 활용한 문제, 원의 현과 접선에 대한 성질을 올바른 식과 풀이 과정으로 서술하는지 봅니다. 반영 비율 표의 시기와 진도표상 위치가 달라 이 과제의 시기는 적지 않았습니다.",
      },
      {
        title: "두 번째 수행은 2차 시험과 같은 주",
        body: "'영역별 문제해결전략 적용하기'는 원주각과 중심각, 원의 접선과 현이 이루는 각, 평균·중앙값·최빈값, 분산과 표준편차, 상관관계를 다룹니다. 2차 정기시험과 같은 11월 3주에 잡혀 있고, 2차 시험은 선택형 100점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회·역사 각각 정기 60%(2차 11월 3주) · 수행 2개 40%",
    intro:
      "3학년은 사회와 역사를 따로 평가합니다. 두 과목 모두 1차(10월 3주)·2차(11월 3주) 정기시험이 각 30%이고 수행이 20%씩 두 개입니다. 상담에서는 사회의 프로젝트 두 개와 역사의 조사·논술 과제 일정을 한꺼번에 정리합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점", course: "사회" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점(서‧논술형 0점)", course: "사회" },
      { name: "인구 정책 뉴스 대본 만들기", kind: "task", weight: 20, timing: "9월", method: "프로젝트 평가", course: "사회" },
      { name: "환경 문제 마인드맵으로 표현해 보기", kind: "task", weight: 20, timing: "10월", method: "프로젝트 평가", course: "사회" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점", course: "역사" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점", course: "역사" },
      { name: "조선의 과학기술 조사하기", kind: "task", weight: 20, timing: "9월", method: "프로젝트 평가", course: "역사" },
      { name: "조선 후기의 가상 일기 쓰기", kind: "task", weight: 20, timing: "10~11월", method: "논술형 평가", course: "역사" },
    ],
    notes: [
      {
        title: "사회: 뉴스 대본과 마인드맵",
        body: "9월 '인구 정책 뉴스 대본 만들기'는 'Ⅶ. 인구 변화와 인구 문제' 단원에서 인구 문제의 원인과 현황 분석, 정책의 필요성과 기대 효과, 앵커·기자·인터뷰를 갖춘 대본 구성을 봅니다. 10월 환경 문제 마인드맵은 원인·영향·해결 방안을 다루는 내용의 정확성이 40점으로 가장 큽니다.",
      },
      {
        title: "역사: 조사 과제와 가상 일기",
        body: "9월 '조선의 과학기술 조사하기'(프로젝트)는 'Ⅳ. 조선의 성립과 발전', 10~11월 가상 일기 쓰기(논술형)는 'Ⅴ. 조선 사회의 변동' 단원입니다. 일기 과제는 의미 있는 사건과 선정 기준, 시대 배경 자료, 인물을 통한 시대 묘사, 사건에 대한 평가와 시사점을 채점합니다.",
      },
      {
        title: "두 과목 모두 서‧논술형은 1차 시험에만",
        body: "사회와 역사의 1차 정기시험은 선택형 60점·서‧논술형 40점이고, 2차는 선택형 100점입니다. 3학년 2차 정기시험은 진도표상 11.16~11.18이어서, 10월 수행(사회 마인드맵, 역사 가상 일기)과 2차 시험 준비 기간이 바로 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  {
    schoolSlug: "mugeo-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "정기시험 2회 60% · 수행 2개 40%(세포 분열 실험 보고서·유전 원리 탐구)",
    intro:
      "3학년 과학 수행 두 개는 모두 'Ⅴ. 생식과 유전' 단원에서 나옵니다. 9월 실험 보고서(실험·실습)와 9~10월 유전 원리 탐구 활동(서술·논술)이 각 20%이며, 상담에서는 이 단원과 1차 시험 서‧논술형 40점을 묶어서 봅니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월 3주", method: "선택형 60점·서‧논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월 3주", method: "선택형 100점(서‧논술형 0점)" },
      { name: "실험 보고서", kind: "task", weight: 20, timing: "9월", method: "실험･실습" },
      { name: "유전 원리 탐구 활동", kind: "task", weight: 20, timing: "9~10월", method: "서술·논술" },
    ],
    notes: [
      {
        title: "실험 보고서는 세포 분열 모형",
        body: "9월 실험 보고서는 체세포 분열과 감수 분열 모형 비교, 체세포 분열과 생식세포 분열 모형 표현, 염색체와 유전자의 관계 설명을 채점합니다. 모든 분열 단계에서 염색체의 행동을 올바르게 표현해야 상 기준에 닿습니다.",
      },
      {
        title: "유전 원리 탐구는 멘델의 실험",
        body: "두 번째 과제는 멘델이 완두를 실험 재료로 고른 이유, 상동 염색체·대립형질·대립유전자의 관계, 표현형과 유전자형, 순종과 잡종 구분, 한 쌍의 대립 형질 교배 결과를 도표로 나타내기를 봅니다. 이어지는 2차 정기시험(11.16~11.18)은 선택형 100점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("무거중학교")],
  },
  // ───────── 1학년 (공통과목) ─────────
  {
    schoolSlug: "daedeok-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "중간·기말 60%(선택형 100점) · 수행 40%(독서일지·독서논술·구술, 모두 서·논술형)",
    intro:
      "대덕고 1학년 공통국어2는 중간·기말고사가 각 30%이고 두 시험 모두 선택형 100점입니다. 학기 서·논술형 40%는 수행평가 세 영역에서 모두 나오므로, 상담은 한 권의 책으로 이어지는 독서일지·독서논술·구술평가의 흐름부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 100점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점" },
      { name: "독서일지", kind: "task", weight: 10, timing: "8 ~ 9월", method: "서·논술형" },
      { name: "독서논술", kind: "task", weight: 15, timing: "9 ~ 11월", method: "서·논술형" },
      { name: "구술평가", kind: "task", weight: 15, timing: "11 ~ 12월", method: "서·논술형" },
    ],
    notes: [
      {
        title: "한 권의 책으로 이어지는 세 수행",
        body: "독서일지는 사회 문제를 다룬 지정 도서 가운데 고른 책으로 4차시 동안 질문 2개씩 답을 씁니다. 독서논술은 모둠 토의를 거쳐 교사가 낸 질문 7개(필수 6개, 선택 1개)에 답하고, 구술평가는 앞 시간에 쓴 독서논술 자료를 바탕으로 발표합니다. 앞 단계의 결과물이 다음 평가의 재료가 됩니다.",
      },
      {
        title: "구술평가는 듣는 태도도 점수입니다",
        body: "구술평가 15점은 발표 1회당 5점씩 두 번(제비뽑기 질문 1회, 스스로 고른 질문 1회)과 듣기 태도 5점으로 나뉩니다. 듣는 학생은 '구술평가 상호평가지'를 쓰고 작성 비율에 따라 점수가 정해집니다. 이 계획서는 과제형 수행평가를 금지하고 수행평가를 수업 시간 안에 실시한다고 적고 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "중간·기말 60%(선택형 75·서술형 25) · 수행 40%(미디어 읽기 15·아이디어 25)",
    intro:
      "1학년 공통영어2는 중간(10월)·기말(12월)고사가 각 30%이고, 시험마다 서술형 25점이 들어갑니다. 수행평가 비중은 세상을 바꾸는 아이디어(10~11월)가 25%로 비판적 미디어 읽기(9월) 15%보다 크며, 상담은 시험 서술형과 영문 글쓰기 수행을 함께 봅니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 75점·서술형 25점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 75점·서술형 25점" },
      { name: "비판적 미디어 읽기", kind: "task", weight: 15, timing: "9월" },
      { name: "세상을 바꾸는 아이디어", kind: "task", weight: 25, timing: "10~11월", method: "서・논술형" },
    ],
    notes: [
      {
        title: "영문 기사 비평을 다섯 번 이상",
        body: "비판적 미디어 읽기는 관심 분야의 영문 기사를 스크랩해 비판적으로 읽고 주어진 양식의 영문 보고서를 5차시에 걸쳐 5회 이상 완성하는 활동과, 가짜뉴스로부터 자신을 지키는 전략 3가지를 영문으로 쓰는 1차시 활동으로 이뤄집니다. 이 영역의 서·논술형 반영 비율은 '-'입니다.",
      },
      {
        title: "연구계획서에서 제안하는 글로",
        body: "세상을 바꾸는 아이디어는 1차시에 주제·배경·목적·핵심 질문·의견 5개 항목의 영문 연구계획서를 쓰고, 다음 차시에 그 계획서에 맞춘 제안하는 글을 영어로 완성합니다. 학기 서·논술형 40%는 두 시험의 7.5%씩과 이 과제 25%를 더한 값입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "중간·기말 60%(선택형 90·서술형 10) · 수행 40%(집합 표현 15·창의 융합 보고서 25)",
    intro:
      "대덕고등학교 1학년 공통수학2는 중간·기말고사가 각 30%이고, 시험마다 선택형 90점과 서술형 10점입니다. 수행 두 영역 중 12월 창의 융합 수학 보고서가 25%, 10월 집합 표현하기가 15%이므로, 상담에서는 비중이 큰 12월 보고서의 주제 범위부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 90점·서술형 10점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 90점·서술형 10점" },
      { name: "집합 표현하기", kind: "task", weight: 15, timing: "10월" },
      { name: "창의 융합 수학 보고서", kind: "task", weight: 25, timing: "12월", method: "서·논술형" },
    ],
    notes: [
      {
        title: "집합 표현하기의 네 가지 과제",
        body: "10월 수행은 주어진 집합을 조건제시법에서 원소나열법으로, 원소나열법에서 조건제시법으로 바꾸고, 벤 다이어그램으로 나타내고, 벤 다이어그램으로 증명하는 네 가지를 봅니다. 이 영역은 서·논술형으로 분류되지 않아 학기 서·논술형 31%는 시험의 3%씩과 보고서 25%로 채워집니다.",
      },
      {
        title: "창의 융합 수학 보고서는 수업 중 500자 이상",
        body: "도형의 방정식, 집합과 명제, 함수와 그래프 가운데 주제를 정해 수업 중 500자 이상의 탐구보고서를 쓰고 발표까지 합니다. 교과서·도서·자료 출력물·인터넷 매체를 참고자료로 쓸 수 있지만, 보고서 작성 자체는 수업 시간에 이뤄집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2", "한국사2"],
    summary: "통합사회2·한국사2 각각 중간·기말 60%(선택형 100점) · 수행 2개 40%",
    intro:
      "1학년 사회 계열은 통합사회2와 한국사2가 따로 평가되며, 두 과목 모두 중간·기말고사가 선택형 100점으로 각 30%입니다. 서술 평가는 수행평가에서만 이뤄지므로 상담은 네 개의 탐구·프로젝트 과제를 중심으로 진행합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 100점", course: "통합사회2" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점", course: "통합사회2" },
      { name: "기본권 문제 탐구", kind: "task", weight: 20, timing: "10월", method: "서‧논술형", course: "통합사회2" },
      { name: "사진 분석을 활용한 장소 마케팅 프로젝트", kind: "task", weight: 20, timing: "9~10월", method: "서‧논술형(서·논술형 반영 10%)", course: "통합사회2" },
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 100점", course: "한국사2" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점", course: "한국사2" },
      { name: "한국사 인사이트 프로젝트", kind: "task", weight: 20, timing: "10월", method: "서·논술형", course: "한국사2" },
      { name: "한국사 타임라인 큐레이터", kind: "task", weight: 20, timing: "11월", method: "서·논술형", course: "한국사2" },
    ],
    notes: [
      {
        title: "통합사회2: 기본권 사례와 장소 마케팅",
        body: "기본권 문제 탐구는 기본권이 침해된 사례를 조사해 헌법상 제도적 장치와 시민 참여 방안을 1차시 탐구 결과지로 정리합니다. 장소 마케팅 프로젝트는 지역을 상징하는 사진 3장 이상을 분석해 슬로건을 만들고 다음 차시에 홍보물을 제작하며, 20% 가운데 10%만 서·논술형으로 반영됩니다.",
      },
      {
        title: "한국사2: 소논문과 연표",
        body: "한국사 인사이트 프로젝트는 한국사2 범위에서 고른 주제로 주제 선정·자료 조사·글쓰기의 3차시에 걸쳐 소논문 형식의 글을 씁니다. 한국사 타임라인 큐레이터는 한 주제와 관련된 역사적 사건 4가지를 탐구해 연대순 연표로 만들고, 사건 설명과 선정 이유를 함께 적습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "중간·기말 60%(선택형 80·단답형 20) · 수행 40%(지질 시대 프로젝트·중화 반응 탐구)",
    intro:
      "통합과학2 중간·기말고사는 각 30%로, 선택형 80점에 단답형 20점이 더해지고 서·논술형 반영은 없습니다. 수행은 8~9월 지질 시대 탐구 프로젝트와 10월 중화 반응 온도 변화 탐구가 각 20%이며, 상담은 단답형 대비와 실험 보고서 작성 기준을 함께 봅니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 80점·단답형 20점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 80점·단답형 20점" },
      { name: "지질 시대 탐구 프로젝트", kind: "task", weight: 20, timing: "8-9월", method: "서・논술형" },
      { name: "중화 반응에서의 온도 변화 탐구", kind: "task", weight: 20, timing: "10월", method: "서・논술형(서·논술형 반영 10%)" },
    ],
    notes: [
      {
        title: "지질 시대 프로젝트는 3차시 모둠 활동",
        body: "1차시 모둠원 역할 분배와 자료 조사, 2차시 지질시대의 환경·번성했던 생물·대멸종 원인을 담은 포스터 작성, 3차시 요약정리 순서로 진행되고 매 차시 결과물을 제출합니다. 관련 성취기준은 지구 환경 변화가 생물다양성에 미치는 영향을 추론하는 것입니다.",
      },
      {
        title: "중화 반응 실험은 보고서의 분석이 서술 영역",
        body: "1차시에 화학 실험 안전 교육과 기구 사용법을 익히고, 2차시에 실험 수행·결과 도출·보고서 작성까지 마칩니다. 보고서 가운데 '결과 분석'과 '오차 분석 및 고찰'이 서·논술형 영역(10점)으로 지정되어 있어, 측정값을 해석하는 문장이 점수와 직접 연결됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },

  // ───────── 2학년 (선택과목) ─────────
  {
    schoolSlug: "daedeok-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["독서와 작문", "주제 탐구 독서"],
    summary: "독서와 작문·주제 탐구 독서 모두 중간·기말 60%(선택형 100점) · 수행 40%",
    intro:
      "2학년 국어 선택과목 가운데 독서와 작문(1~10반)과 주제 탐구 독서(1·7·8반)를 정리했습니다. 두 과목 모두 중간·기말고사가 선택형 100점이고 수행 배분은 30·10과 10·10·20으로 달라, 상담은 수강 과목을 확인하는 데서 시작합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 100점", course: "독서와 작문" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점", course: "독서와 작문" },
      { name: "사회적 쟁점을 탐구하고 매체 제작하기", kind: "task", weight: 30, timing: "9~10월", method: "서·논술형", course: "독서와 작문" },
      { name: "관심 주제에 대해 설명하는 글쓰기", kind: "task", weight: 10, course: "독서와 작문" },
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 100점", course: "주제 탐구 독서" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점", course: "주제 탐구 독서" },
      { name: "독후 질문 목록 상호 공유 활동 소감문 쓰기", kind: "task", weight: 10, timing: "9~11월", method: "서·논술형", course: "주제 탐구 독서" },
      { name: "읽기 기반 주제 연계 확장형 탐구 활동 소감문 쓰기", kind: "task", weight: 10, timing: "9~11월", method: "서·논술형", course: "주제 탐구 독서" },
      { name: "챕터 깊이 읽기 프로젝트 보고서 쓰기", kind: "task", weight: 20, timing: "9~11월", method: "서·논술형", course: "주제 탐구 독서" },
    ],
    notes: [
      {
        title: "독서와 작문: 쟁점 매체와 설명문",
        body: "사회적 쟁점 과제(30%)는 주변의 사회 문제를 골라 원인·현황·관련된 사람들의 입장을 자료로 파악하고, 자신의 입장과 실천 가능한 해결 방안을 글과 매체로 표현하는지 봅니다. 설명하는 글쓰기(10%)는 정의·예시·비교·대조·원인과 결과 같은 설명 방법을 독자에 맞게 쓰는지와 문단 구성을 평가합니다.",
      },
      {
        title: "주제 탐구 독서: 고른 책 한 권에서 세 편의 글",
        body: "세 수행이 모두 9~11월에 걸친 서·논술형입니다. 교사가 추천·선별한 단행본 가운데 학생이 관심 도서를 고르고, 수업 중 읽기·질문 만들기·질문 목록 공유를 거쳐 소감문 두 편과 챕터 깊이 읽기 프로젝트 보고서를 씁니다. 보고서 하나가 20%로 가장 큽니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ", "영어 발표와 토론"],
    summary: "영어Ⅱ 중간·기말 60%·수행 40% / 영어 발표와 토론 기말 40%·수행 60%",
    intro:
      "대덕고 2학년 영어Ⅱ(1~10반)는 중간·기말고사가 각 30%이고 시험마다 서술형 25점이 있습니다. 6반이 듣는 영어 발표와 토론은 12월 기말고사 한 번이 40%이고 발표 중심 수행이 60%라서, 상담은 어느 과목을 듣는지부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 75점·서술형 25점", course: "영어Ⅱ" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 75점·서술형 25점", course: "영어Ⅱ" },
      { name: "Writing a Career Reflection", kind: "task", weight: 20, timing: "9월", method: "서·논술형", course: "영어Ⅱ" },
      { name: "Persuasive Proposal Speech", kind: "task", weight: 20, timing: "10월", course: "영어Ⅱ" },
      { name: "기말고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 75점·서술형 25점", course: "영어 발표와 토론" },
      { name: "발표문 작성", kind: "task", weight: 10, timing: "8~9월", method: "서·논술형", course: "영어 발표와 토론" },
      { name: "구술 발표", kind: "task", weight: 20, timing: "9월", course: "영어 발표와 토론" },
      { name: "이야기 작성", kind: "task", weight: 10, timing: "10~11월", method: "서·논술형", course: "영어 발표와 토론" },
      { name: "이야기 발표", kind: "task", weight: 20, timing: "10~11월", course: "영어 발표와 토론" },
    ],
    notes: [
      {
        title: "영어Ⅱ: 진로 성찰지와 청원 발표",
        body: "9월 성찰지 과제(Writing a Career Reflection)는 희망 진로나 관심 분야의 영문 글을 읽고 2차시에 걸쳐 영어 성찰지를 초안부터 완성본까지 씁니다. 10월 청원 발표(Persuasive Proposal Speech)는 학교·지역사회·환경 개선을 위한 청원 주제를 정해 영어 대본을 쓰고 발표하는 과제로, 서·논술형으로는 반영되지 않습니다.",
      },
      {
        title: "영어 발표와 토론: 쓰기와 발표가 짝을 이룹니다",
        body: "발표문 작성(8~9월)에 이어 사회 문제의 해결 방안을 설득력 있게 제안하는 구술 발표(9월)가 있고, 삶의 터닝 포인트를 다룬 이야기 작성(10~11월)에 이어 이야기 구조 5단계에 맞춘 이야기 발표가 있습니다. 쓰기 두 개가 각 10%, 발표 두 개가 각 20%입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  {
    schoolSlug: "daedeok-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅱ"],
    summary: "미적분Ⅱ: 중간·기말 60%(선택형 80·단답형 20) · 서·논술형 수행 2개 40%(10월)",
    intro:
      "2학년 미적분Ⅱ(1~5반, 8~10반)는 두 번의 정기시험(각 30%)이 모두 선택형 80점·단답형 20점 구성입니다. 서·논술형 수행 두 개가 모두 10월에 잡혀 있어, 상담은 10월 중간고사와 수행 일정이 겹치는 부분부터 정리합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "10월", method: "선택형 80점·단답형 20점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 80점·단답형 20점" },
      { name: "실생활 속 미적분 탐구 프로젝트", kind: "task", weight: 20, timing: "10월", method: "서·논술형" },
      { name: "W.I.N.(What If Not) 문제 제기", kind: "task", weight: 20, timing: "10월", method: "서·논술형" },
    ],
    notes: [
      {
        title: "탐구 프로젝트는 보고서와 2분 발표",
        body: "수열의 극한, 미분법, 적분법과 관련된 주제를 골라 500자 이상의 심화 탐구보고서를 쓰고, 다음 차시에 2분 동안 발표합니다. 교과서·도서·인터넷 자료 출력물 같은 참고자료를 쓸 수 있으며 1차시 결과물은 제출합니다.",
      },
      {
        title: "W.I.N.은 조건을 바꿔 새 문제를 만드는 과제",
        body: "수업에서 배운 정의·성질·공식·문제 가운데 하나를 스스로 골라 'What If Not' 전략으로 조건을 바꾼 질문을 던지고, 새 문제를 만들어 해결하는 과정을 보고서로 씁니다. 주어진 문제를 푸는 것보다 문제를 다시 세우는 과정이 평가 대상입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("대덕고등학교")],
  },
  // 2026-11-02 26차 batch: 부산 하단제2동(건국고·하단중)·대구 범어4동(정화여고·경신중) — 학교알리미 2026-2 평가계획
  {
    schoolSlug: "geonguk-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "1·2회 고사 각 30%(서·논술형 30점 이상) · 수행 2개 40%(카드 뉴스·소설 비평문)",
    intro:
      "건국고등학교 1학년 공통국어2는 1·2회 고사가 30%씩, 수행평가 두 과제가 20%씩입니다. 9월 카드 뉴스와 10월 비평문이 1회 고사 앞뒤로 이어지므로, 상담에서는 9월 5주 1회 고사 범위와 두 수행 일정을 함께 맞춥니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "관심분야의 책을 소개하는 카드 뉴스 만들기 (한 학기 한 권 책 읽기)", kind: "task", weight: 20, timing: "9월", method: "모둠 도서 선정·개별 독서 일지·모둠 카드뉴스 제작 및 발표" },
      { name: "소설 속 사회상을 바탕으로 비평문 작성하기", kind: "task", weight: 20, timing: "10월", method: "개별 쓰기 계획·초고쓰기 및 고쳐쓰기" },
    ],
    notes: [
      {
        title: "5단원은 두 회차 모두 범위에 들어갑니다",
        body: "반영 비율표의 평가요소 칸에서 1회 고사는 ‘2. 우리 삶을 비추는 한국 문학’과 ‘5. 문제를 해결하는 지혜’, 2회 고사는 3·4단원과 함께 다시 5단원을 적고 있습니다. 5단원은 10월 비평문 과제의 단원이기도 해서, 이 단원의 작문 성취기준이 두 시험과 수행평가에 걸쳐 쓰입니다.",
      },
      {
        title: "비평문 배점의 절반은 마지막 글쓰기",
        body: "소설 비평문 채점기준표는 중심 사건·인물 심리 파악 20점, 소설 속 사회적 문제 파악과 관련 기사문 검색 30점, 자신의 견해·근거의 타당성·글의 짜임을 보는 비평문 작성 50점으로 나뉩니다. 기사문에서 찾은 내용을 자신의 견해를 받치는 근거로 연결하는 것이 마지막 단계의 평가요소입니다.",
      },
      {
        title: "카드 뉴스는 모둠과 개별 단계가 섞여 있습니다",
        body: "한 학기 한 권 읽기로 운영되는 카드 뉴스 과제는 모둠이 관심 분야 도서를 고르는 단계(20점), 각자 독서 일지를 쓰는 단계(30점), 모둠이 카드 뉴스를 기획·제작(40점)하고 발표(10점)하는 단계로 구성됩니다. 독서 일지에는 인상 깊은 부분과 친구들과 이야기하고 싶은 부분을 근거와 함께 적도록 되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "1·2회 고사 각 30%(서·논술형 30점 이상) · 수행 2개 40%(학습노트·실생활 탐구)",
    intro:
      "건국고등학교 1학년 공통수학2는 1·2회 고사 60%와 학습노트 정리·실생활 수학적 탐구 두 수행평가 40%로 이루어집니다. 두 시험의 단원 범위가 일부 겹치게 적혀 있어, 수학 상담에서는 회차별 성취기준 범위부터 확인합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "자기주도적 학습노트 정리", kind: "task", weight: 20, timing: "매 중단원 마무리", method: "개별 학습노트 작성·팀별 피드백 및 멘토 멘티 활동" },
      { name: "실생활 수학적 탐구", kind: "task", weight: 20, timing: "12월 1주", method: "진로 관련 수학 개념 적용·수학적 모델링·활동지 제출 및 발표" },
    ],
    notes: [
      {
        title: "원의 방정식과 명제는 두 회차에 나뉩니다",
        body: "평가요소 칸에서 1회 고사는 Ⅰ~Ⅳ단원, 2회 고사는 Ⅱ·Ⅳ·Ⅴ·Ⅵ단원으로 적혀 있어 Ⅱ. 원의 방정식과 도형의 이동, Ⅳ. 명제가 양쪽에 나옵니다. 성취기준으로 보면 1회 고사는 [10공수2-01-01]~[01-05]와 [02-01]~[02-05], 2회 고사는 [01-05]~[01-07], [02-06]~[02-08], [03-01]~[03-05]여서 단원 중간에서 범위가 끊깁니다.",
      },
      {
        title: "학습노트는 중단원마다 쌓입니다",
        body: "자기주도적 학습노트 정리는 중단원이 끝날 때마다 단원별 중요 개념과 오답률 높은 문제 위주로 노트를 쓰고, 팀별 피드백과 멘토·멘티 활동으로 이어집니다. 채점은 개념 정리 30점, 풀이 과정 30점, 포트폴리오 완성도 40점이며, 학습지가 빠질수록 완성도 점수가 낮아지도록 기준이 적혀 있습니다.",
      },
      {
        title: "12월 탐구 보고서는 주제 선정이 40점",
        body: "실생활 수학적 탐구는 12월에 진로와 관련된 수학 개념을 찾아 수학적 모델링으로 해결하고 활동지를 내고 발표하는 과제입니다. 주제 선정 40점은 공통수학2 단원과의 연계성을, 보고서 40점은 수학적 개념과 용어를 활용한 논리성을 봅니다. 연결할 단원을 먼저 정해 두는 것이 주제 선정 기준과 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "1·2회 고사 각 30% · 수행 3개 40%(듣기 10·어휘 20·쓰기 및 말하기 10)",
    intro:
      "건국고등학교 1학년 공통영어2는 1회 고사(Lesson 1~2)와 2회 고사(Lesson 3~4)가 30%씩이고, 수행평가는 듣기·어휘·쓰기 및 말하기 세 영역 40%입니다. 영어 상담에서는 학기 내내 이어지는 어휘 테스트 구간부터 확인합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서술형(서·논술형 30점 이상)" },
      { name: "듣기", kind: "task", weight: 10, method: "시도교육청 공동 주관 영어듣기능력평가 점수 반영" },
      { name: "어휘력(voca portfolio)", kind: "task", weight: 20, timing: "학기 중 수시", method: "5단계 어휘 테스트" },
      { name: "쓰기 및 말하기", kind: "task", weight: 10, timing: "10월 3주 ~ 11월 1주", method: "진로 희망 직업 소개 글 작성·발표 및 질문받기" },
    ],
    notes: [
      {
        title: "어휘 영역은 부교재 강 단위로 나뉩니다",
        body: "voca portfolio는 5단계로, 교과서 1~4과와 부교재 21강~50강을 구간별로 나눠 클래스 카드로 학습한 뒤 평가합니다. 단계마다 테스트 평균에 따라 점수가 정해지며 평균 90점 이상이 100점입니다. 어휘 20%는 수행평가 가운데 가장 큰 영역이어서, 과마다 지정된 강의 단어를 그 구간 안에 정리해 두는 것이 이 영역과 바로 이어집니다.",
      },
      {
        title: "직업 소개 글이 쓰기 및 말하기의 70점",
        body: "쓰기 및 말하기 영역은 10월 3주~11월 1주에 진로 희망 직업을 조사해 소개하는 글을 쓰고(70점) 반 학우들 앞에서 발표하며 질문을 받는(30점) 두 단계입니다. 글은 완성도·내용 적합성·어휘 사용의 적절성을, 발표는 유창성·전달력과 경청하는 태도 및 적극적 질문을 봅니다.",
      },
      {
        title: "듣기는 교육청 시험 점수를 그대로",
        body: "듣기 10%는 별도 과제 없이 전국 16개 시도교육청 공동 주관 영어듣기능력평가(고1) 2학기 시험 점수를 그대로 반영하며, 20문항 모두 객관식으로 문항당 5점입니다. 계획서는 이 영역의 성취기준을 세부 정보 파악부터 함축 의미 추론까지 [10공영2-01-01]~[01-05]로 적고 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["한국사2"],
    summary: "1·2회 고사 각 30%(서·논술형 30점 이상) · 수행 2개 40%(탐구보고서·활동지 포트폴리오)",
    intro:
      "건국고등학교 1학년 한국사2는 1·2회 고사가 30%씩, 주제별 탐구보고서와 활동지 포트폴리오가 20%씩입니다. 9월에 1회 고사와 탐구보고서가 같은 단원으로 겹치므로, 상담에서는 Ⅰ단원 학습과 보고서 일정부터 맞춥니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "주제별 탐구보고서", kind: "task", weight: 20, timing: "9월", method: "개별 탐구보고서 작성 및 발표" },
      { name: "활동지 포트폴리오", kind: "task", weight: 20, timing: "8월~11월", method: "교과서 활용 수업 내용 정리(4회)" },
    ],
    notes: [
      {
        title: "1회 고사는 Ⅰ단원만 다룹니다",
        body: "반영 비율표에서 1회 고사 범위는 Ⅰ. 일제 식민 통치와 민족 운동, 2회 고사는 Ⅱ. 대한민국의 발전과 Ⅲ. 오늘날의 대한민국입니다. 9월 탐구보고서도 국내외 민족 운동의 흐름을 다루는 [10한사2-01-03] 성취기준이어서, 9월에는 Ⅰ단원이 시험과 보고서에 함께 쓰입니다.",
      },
      {
        title: "활동지 포트폴리오는 25점씩 네 번",
        body: "활동지 포트폴리오는 8~11월에 네 번, 회당 25점으로 채점됩니다. 기준은 내용의 충실성, 내용의 정확성, 기한 내 제출 세 가지이고 충족한 개수에 따라 25·23·21점, 미제출은 19점입니다. 기한 내 제출이 기준 가운데 하나로 들어 있어 회차마다 제출 시점이 점수에 직접 반영됩니다.",
      },
      {
        title: "탐구보고서는 작성과 발표가 반씩",
        body: "주제별 탐구보고서는 주제 선정과 자료 수집 뒤 보고서를 쓰고 발표하는 2단계 과제로, 주제에 대한 지식과 이해 50점, 의견과 작성 소감 발표 50점입니다. 발표 단계는 보고서 내용을 누락 없이 기억해 정확한 발음과 전달력으로 말하는지를 보므로, 작성한 보고서를 직접 설명할 수 있게 정리해 두어야 합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "1·2회 고사 각 30%(서·논술형 30점 이상) · 수행 2개 40%(산·염기 실험·지질시대 프로젝트)",
    intro:
      "건국고등학교 1학년 통합과학2는 1·2회 고사가 30%씩, 산과 염기 탐구 실험과 지질시대 프로젝트가 20%씩입니다. 두 시험의 단원 칸이 같게 적혀 있어, 과학 상담에서는 회차별 성취기준 목록과 9월·10~11월 수행 일정을 함께 맞춥니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "산과 염기 탐구 실험", kind: "task", weight: 20, timing: "10월 ~ 11월", method: "모둠 실험 관찰·결론 도출 및 보고서 작성" },
      { name: "지질시대 환경과 생물 제작 프로젝트", kind: "task", weight: 20, timing: "9월", method: "모둠·개별 제작 및 발표" },
    ],
    notes: [
      {
        title: "실험 보고서가 40점을 차지합니다",
        body: "산과 염기 탐구 실험은 성질 관찰과 혼합 시 온도·액성 변화 관찰 두 단계에서 각각 실험 수행 20점과 실험 태도 10점을, 마지막 단계에서 결론 도출과 결과 보고서 40점을 매깁니다. 보고서는 분석 문항별 배점표를 따르고, 성취기준은 중화 반응에서 나타나는 온도와 지시약 색 변화를 다루는 [10통과2-01-04]입니다.",
      },
      {
        title: "시험 범위는 성취기준 번호로 나뉩니다",
        body: "평가요소 칸은 1·2회 고사 모두 ‘I. 변화와 다양성 – III. 과학과 미래 사회’로 같지만, 성취기준 칸에는 1회 고사에 [10통과2-01-01]~[01-03]과 [02-03]·[02-04], 2회 고사에 [01-04]·[01-05]와 [02-01]·[02-02]가 따로 들어 있습니다. [02-05]와 [03-01]~[03-04]는 두 회차에 모두 적혀 있습니다.",
      },
      {
        title: "지질시대 프로젝트는 발표 계획서까지",
        body: "지질시대 환경과 생물 제작 프로젝트는 9월에 2차시로 진행되며, 제작 단계에서 탐구 내용 30점과 독창성 30점, 발표 단계에서 40점을 봅니다. 발표 점수는 발표 계획서를 제출하고 탐구 동기와 탐구 내용을 설명했는지로 나뉘어, 제작물과 함께 계획서도 채점 대상에 들어갑니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["독서와 작문", "독서토론과 글쓰기"],
    summary: "독서와 작문 시험 60%·수행 40%(독서 포트폴리오·제안서) / 독서토론과 글쓰기 시험 60%·수행 40%",
    intro:
      "건국고등학교 2학년 독서와 작문(1~7반)과 독서토론과 글쓰기(A·C반)는 모두 정기시험 60%·수행평가 40%이고, 두 과목 모두 한 학기 한 권 읽기 포트폴리오가 20%입니다. 상담에서는 포트폴리오 다음에 오는 두 번째 글쓰기 과제의 형식부터 구분합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, method: "선택형+서·논술형(서·논술형 30점 이상)", course: "독서와 작문" },
      { name: "2회 고사", kind: "exam", weight: 30, method: "선택형+서·논술형(서·논술형 30점 이상)", course: "독서와 작문" },
      { name: "포트폴리오 (한 학기 한 권 읽기)", kind: "task", weight: 20, timing: "8~9월", method: "수업 일기 쓰기·책 대화하기·모둠 보고서 쓰기", course: "독서와 작문" },
      { name: "독서 기반 문제 해결 제안서 쓰기", kind: "task", weight: 20, timing: "10~11월 중", method: "자료 탐색·주제 통합적 독서·제안서 작성 및 고쳐쓰기", course: "독서와 작문" },
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)", course: "독서토론과 글쓰기" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)", course: "독서토론과 글쓰기" },
      { name: "포트폴리오 (한 학기 한 권 읽기)", kind: "task", weight: 20, timing: "9월~10월", method: "수업 일기 쓰기·책 대화하기·모둠 보고서 쓰기", course: "독서토론과 글쓰기" },
      { name: "글쓰기 프로젝트", kind: "task", weight: 20, timing: "11월~12월", method: "쓰기 계획·초고쓰기 및 고쳐쓰기·참여 태도", course: "독서토론과 글쓰기" },
    ],
    notes: [
      {
        title: "제안서는 여러 자료를 엮어 읽는 과제",
        body: "독서와 작문의 독서 기반 문제 해결 제안서(10~11월)는 문제 설정과 자료 탐색 30점, 주제 통합적 독서와 해결 방안 설계 35점, 제안서 작성과 고쳐쓰기 35점으로 채점됩니다. 첫 단계의 만점 기준은 출처가 명확한 자료를 3개 이상 선별하는 것이고, 둘째 단계는 자료들 사이의 관점과 근거 차이를 비교·분석하는지를 봅니다.",
      },
      {
        title: "두 과목의 독서 포트폴리오는 같은 틀입니다",
        body: "두 과목의 한 학기 한 권 읽기 포트폴리오는 수업 일기 쓰기 40점, 이야깃거리를 10개 이상 적어 오는 책 대화하기 30점, 모둠 보고서 작성 30점으로 채점 틀이 같습니다. 다만 시기는 독서와 작문이 8~9월, 독서토론과 글쓰기가 9~10월로 한 달가량 차이가 납니다.",
      },
      {
        title: "글쓰기 프로젝트는 고쳐쓰기를 따로 채점합니다",
        body: "독서토론과 글쓰기의 글쓰기 프로젝트(11~12월)는 쓰기 맥락과 논설문 구조를 고려한 계획 30점, 개요 조직과 초고 작성 25점, 응집성·통일성·근거의 타당성을 따지는 고쳐쓰기 25점, 시간 안에 완료하는 참여 태도 20점입니다. 초고와 수정본이 각각 채점되어 고쳐 쓰는 과정 자체가 점수에 들어갑니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ"],
    summary: "1·2회 고사 각 30%(서·논술형 30점 이상) · 수행 2개 40%(주제 탐구 프로젝트·도서 발표)",
    intro:
      "건국고등학교 2학년 미적분Ⅰ(1~7반)은 1·2회 고사가 30%씩, 주제 탐구 프로젝트와 도서 발표 활동이 20%씩입니다. 2회 고사의 성취기준 범위가 1회 고사 범위를 포함하도록 적혀 있어, 상담에서는 회차별 시험 범위와 8~10월·11~12월 수행 일정부터 확인합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서·논술형(서·논술형 30점 이상)" },
      { name: "주제 탐구 프로젝트 활동", kind: "task", weight: 20, timing: "8월~10월", method: "모둠 교과 내용 분석·개별 사례 탐색·활동지 제출" },
      { name: "도서 발표 활동", kind: "task", weight: 20, timing: "11월~12월", method: "도서·동영상 탐색·수학 알고리즘 정리·수학 칼럼 작성" },
    ],
    notes: [
      {
        title: "2회 고사는 처음부터 끝까지",
        body: "반영 비율표의 성취기준 칸은 1회 고사를 [12미적Ⅰ-01-01]~[02-06], 2회 고사를 [12미적Ⅰ-01-01]~[03-06]으로 적고 있어, 2회 고사에는 함수의 극한부터 적분까지가 모두 들어갑니다. 1회 고사 이후 배우는 미분의 활용과 적분만이 아니라 앞 범위도 다시 시험에 포함된다는 뜻입니다.",
      },
      {
        title: "주제 탐구는 팀원에게 설명하는 단계가 40점",
        body: "주제 탐구 프로젝트(8~10월)는 모둠에서 교과 내용을 분석해 팀원에게 설명하는 단계 40점, 인터넷으로 사례를 조사해 활동지를 쓰는 단계 40점, 기간 내 활동지 제출 20점입니다. 40점 기준이 팀원에게 2회 이상 정확히 설명하는 것이라, 그래프 개형·방정식과 부등식·속도와 가속도 내용을 말로 풀어낼 수 있어야 합니다.",
      },
      {
        title: "도서 발표는 수학 칼럼으로 마무리됩니다",
        body: "11~12월 도서 발표 활동은 곡선으로 둘러싸인 도형의 넓이와 속도·거리 성취기준을 다룹니다. 도서·동영상을 3개 이상 탐색해 정리하는 단계 30점, 내용을 분류해 자신만의 수학적 알고리즘으로 재해석하는 단계 30점, 정확한 수학 용어로 칼럼을 써서 기간 내 제출·발표하는 단계 40점으로 채점됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  {
    schoolSlug: "geonguk-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ", "영미문학 읽기"],
    summary: "영어Ⅱ 시험 60%·수행 40%(표현·어휘·듣기) / 영미문학 읽기 시험 60%·Reading·Writing 40%",
    intro:
      "건국고등학교 2학년 영어Ⅱ는 1회 고사(Unit 1~2)와 2회 고사(Unit 3~4)가 30%씩이고 수행평가는 표현·어휘·듣기 세 영역 40%입니다. 영미문학 읽기는 시험 60%에 Reading·Writing Project가 20%씩이어서, 상담에서는 수강 과목별 과제 시기부터 맞춥니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 30, method: "선택형+서술형(서·논술형 30점 이상)", course: "영어Ⅱ" },
      { name: "2회 고사", kind: "exam", weight: 30, method: "선택형+서술형(서·논술형 30점 이상)", course: "영어Ⅱ" },
      { name: "표현(나만의 글로벌 가이드북 제작)", kind: "task", weight: 10, timing: "11월 4주 ~ 12월 1주", method: "도시 소개 슬라이드 작성·발표, 피드백 주고받기", course: "영어Ⅱ" },
      { name: "어휘력(voca portfolio)", kind: "task", weight: 20, timing: "학기 중 수시", method: "핵심어휘마스터 4회", course: "영어Ⅱ" },
      { name: "듣기", kind: "task", weight: 10, timing: "9월 9일", method: "시도교육청 공동 주관 영어듣기능력평가 점수 반영", course: "영어Ⅱ" },
      { name: "1회 고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서술형(서·논술형 30점 이상)", course: "영미문학 읽기" },
      { name: "2회 고사", kind: "exam", weight: 30, timing: "12월 2주", method: "선택형+서술형(서·논술형 30점 이상)", course: "영미문학 읽기" },
      { name: "Reading Project", kind: "task", weight: 20, timing: "9월 3주", method: "문학 작품 보고서·발표용 슬라이드 작성, 모둠 피드백", course: "영미문학 읽기" },
      { name: "Writing Project", kind: "task", weight: 20, timing: "11월 4주", method: "The Giver 독후감·작별 편지·다른 결말 쓰기 중 택 1", course: "영미문학 읽기" },
    ],
    notes: [
      {
        title: "영어Ⅱ 어휘 테스트는 교과서 과와 함께 갑니다",
        body: "영어Ⅱ 어휘력 영역(핵심어휘마스터)은 교과서 1~4과에 부교재 1강~12강을 세 강씩 묶어 네 번 평가하고, 시기는 8~12월 수시입니다. 회차 점수는 테스트 평균 95점 이상이 100점이며 구간이 내려갈 때마다 5점씩 줄어듭니다. 20%로 수행평가 중 비중이 가장 커서 과 진도에 맞춰 해당 강 어휘를 정리하는 흐름과 맞물립니다.",
      },
      {
        title: "가이드북 과제는 학기 말에 놓입니다",
        body: "영어Ⅱ 표현 영역은 11월 4주~12월 1주에 Unit 4 본문을 배운 뒤, 소개하고 싶은 도시의 특색이 드러나는 슬라이드를 만들어 발표하는 과제입니다. 70점은 도시 특색 전달과 어휘·어법 사용을, 30점은 구성원끼리 공유하고 피드백을 주고받는 참여도와 경청 태도를 봅니다.",
      },
      {
        title: "영미문학 읽기는 Unit별 장르가 다릅니다",
        body: "영미문학 읽기 1회 고사 범위는 Unit 1. Exploring Poetry와 Unit 2. Uncovering Fiction, 2회 고사는 Unit 3. Bringing Drama to Life와 Unit 4. Dreaming Beyond Reality입니다. 11월 4주 Writing Project는 The Giver를 읽고 독후감·작별 편지·다른 결말 중 하나를 쓰는 70점 과제와 모둠 피드백 30점으로 이루어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("건국고등학교")],
  },
  // ───────────────────────── 1학년 ─────────────────────────
  {
    schoolSlug: "hadan-middle-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 30%씩(서답형 50점) · 진솔한 글 쓰기 15%(10월) · 한 학기 한 권 읽기 25%(11월)",
    intro:
      "하단중학교 1학년 국어는 중간·기말고사 모두 100점 가운데 50점이 서답형이고, 수행평가 40%는 10월 글쓰기 15%와 11월 한 학기 한 권 읽기 25%로 나뉩니다. 상담에서는 비중이 더 큰 독서 과제의 독서일지 흐름부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 50점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 50점" },
      {
        name: "경험을 담은 진솔한 글 쓰기",
        kind: "task",
        weight: 15,
        timing: "10월",
        method: "글의 적절한 소재 찾기 · 내용 선정과 조직 · 진솔한 경험이 잘 드러나게 글쓰기",
      },
      {
        name: "한 학기 한 권 읽기",
        kind: "task",
        weight: 25,
        timing: "11월",
        method: "논술형 · 독서일지 작성, 줄거리와 등장인물 파악, 탐구 주제 정리와 발표",
      },
    ],
    notes: [
      {
        title: "독서 과제 25%는 매시간 쓰는 독서일지에서 출발",
        body: "한 학기 한 권 읽기의 평가요소 첫 줄은 '독서일지를 매시간 성실하게 작성하기'이고, 이어서 인물이 갈등을 해결하는 과정이 드러나도록 줄거리와 등장인물을 파악하는지, 작품의 탐구 주제와 인상적인 내용을 정리해 발표하는지를 봅니다. 진도표에는 11월 3주에 인물의 특성과 갈등 유형을 분석하는 논술형 평가로 적혀 있습니다.",
      },
      {
        title: "10월 글쓰기는 소재 선정이 첫 항목",
        body: "경험을 담은 진솔한 글 쓰기는 [9국03-05] 삶과 경험을 바탕으로 정서를 진솔하게 표현하는 글쓰기가 성취기준이며, 10월 1주부터 3주까지 이어지는 1(2) 단원 수업 안에서 치릅니다. 평가요소는 글의 적절한 소재 찾기, 내용 선정과 조직, 경험이 잘 드러나게 쓰기 순서라 의미 있는 장면을 먼저 골라 두는 것이 출발점입니다.",
      },
      {
        title: "중간은 품사·어휘, 기말은 새말·추론·주장",
        body: "중간고사 성취기준은 품사([9국04-03]), 어휘의 양상([9국04-07]), 성장을 다룬 문학([9국05-03])입니다. 기말고사는 단어의 짜임과 새말([9국04-02]), 추론하며 읽기([9국02-03]), 주장하는 글쓰기([9국03-03]), 진솔한 글쓰기([9국03-05])로 넘어갑니다. 서답형이 절반이라 문법 개념도 문장으로 풀어 쓰는 연습이 필요합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "중간·기말 30%씩(서답형 40점) · 도형 프로젝트 20%(9~10월) · 통계 프로젝트 20%(11월)",
    intro:
      "1학년 수학 수행평가는 도형 프로젝트와 통계 프로젝트가 20%씩이고, 정기시험 두 번은 100점 중 40점을 서답형으로 냅니다. 기말고사가 11월 5주로 잡혀 있어, 상담에서는 같은 달 통계 프로젝트와 기말 준비가 겹치는 구간부터 나눠 봅니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "11월 5주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "도형 프로젝트",
        kind: "task",
        weight: 20,
        timing: "9~10월",
        method: "기본 도형의 작도 · 삼각형의 작도 · 기호 표현성 · 입체도형의 성질",
      },
      {
        name: "통계 프로젝트",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "통계적 탐구 문제 설정 및 자료 분석 · 태도 및 참여도 · 전달력과 발표력",
      },
    ],
    notes: [
      {
        title: "도형 프로젝트는 세 번에 걸쳐 진행",
        body: "진도표에서 도형 프로젝트는 9월 1주 기본 도형의 작도, 9월 2주 삼각형의 작도, 10월 5주 입체도형 미니북 만들기로 세 차례 수행평가 표시가 붙어 있습니다. 평가요소에 '기호 표현성'이 따로 들어 있어, 작도 결과만이 아니라 작도한 과정을 기호로 정확히 적었는지도 점수에 포함됩니다.",
      },
      {
        title: "통계 프로젝트는 공학 도구로 자료를 모읍니다",
        body: "11월 4주 통계 프로젝트는 [9수04-02]~[9수04-04] 범위에서 자료를 수집해 표나 그래프로 나타내고 대푯값을 구할 때 공학도구를 쓰도록 되어 있습니다. 평가요소는 통계적 탐구 문제 설정 및 자료 분석, 태도 및 참여도, 전달력과 발표력이라 결과를 설명하는 발표까지 준비해야 합니다.",
      },
      {
        title: "통계적 탐구 성취기준은 프로젝트에만",
        body: "중간고사 성취기준은 기본 도형과 작도, 다각형의 성질([9수03-01]~[9수03-05])이고, 기말고사는 원과 부채꼴, 입체도형, 자료의 정리와 해석([9수03-06]~[9수04-03])입니다. [9수04-04] 통계적 탐구는 기말고사 쪽 성취기준에서는 빠져 있고 통계 프로젝트에서만 다룹니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "중간·기말 30%씩 · 영어듣기 10%(9월) · 러닝로그 10%(8~11월) · 여행지 소개하기 20%",
    intro:
      "1학년 영어 수행평가는 9월 시도교육청 주관 영어듣기평가 10%, 8~11월 내내 쌓는 러닝로그 10%, 9~10월 여행지 소개하기 20% 세 가지입니다. 상담에서는 대본 작성과 전달까지 채점하는 여행지 소개하기를 Lesson 4 진도에 맞춰 먼저 챙깁니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 40점" },
      { name: "영어듣기", kind: "task", weight: 10, timing: "9월", method: "전국시도 교육청 주관 영어듣기평가" },
      { name: "러닝로그", kind: "task", weight: 10, timing: "8~11월", method: "읽기 · 쓰기" },
      {
        name: "여행지 소개하기",
        kind: "task",
        weight: 20,
        timing: "9~10월",
        method: "대본 완성도 · 내용 적합성 · 전달력 · 언어 사용",
      },
    ],
    notes: [
      {
        title: "여행지 소개는 대본 완성도가 첫 요소",
        body: "여행지 소개하기(20%)의 평가요소는 대본 완성도, 내용 적합성, 전달력, 언어 사용 네 가지이고 성취기준은 [9영02-03]·[9영02-04]·[9영02-08]입니다. 진도표에서 9월과 10월에 수행평가로 표시되어 있으며, 같은 시기 수업이 Lesson 4 The Joy of Traveling과 Lesson 5로 이어집니다.",
      },
      {
        title: "러닝로그는 12월 전에 마감됩니다",
        body: "러닝로그(10%)는 읽기와 쓰기를 평가요소로 하며 진도표의 8월부터 11월까지 매달 수행평가로 적혀 있고, 12월 Lesson 8 이후에는 관찰평가와 형성평가만 남습니다. 넉 달 동안 나눠 쌓이는 기록이라 시험 기간에도 빠뜨리지 않고 채워 두는 쪽이 이 10%와 바로 이어집니다.",
      },
      {
        title: "Lesson 5는 두 시험에 모두 걸칩니다",
        body: "중간고사 평가요소는 Lesson 3 Let's Be Positive부터 Lesson 5 Think like Sherlock Holmes!까지, 기말고사는 Lesson 5부터 Lesson 8 Be Smart Online까지입니다. 두 시험 모두 100점 중 서답형이 40점이고, Lesson 5가 양쪽 범위에 함께 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "중간·기말 30%씩(선택형·서답형 50:50) · 선거와 민주정치 프로젝트 20% · 법 보고서 20%(11월)",
    intro:
      "1학년 사회는 정기시험을 선택형과 서답형 50%씩으로 출제하도록 방침에 적혀 있고, 수행평가 두 개는 각각 시험 범위 단원과 맞물려 있습니다. 상담에서는 개학 직후 8월 3주부터 9월 1주까지 이어지는 선거와 민주정치 프로젝트 일정부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 50점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 50점" },
      {
        name: "선거와 민주정치 프로젝트",
        kind: "task",
        weight: 20,
        timing: "8월 ~ 9월",
        method: "선거의 의미와 기능, 정당의 활동 조사 · 정치 주체와 정치 과정 작성 · 지방자치제도와 시민참여활동 조사",
      },
      {
        name: "법의종류와특징 보고서",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "법의 의미·특징·목적 이해 · 일상생활 속 법 · 재판의 종류와 공정한 재판을 위한 제도",
      },
    ],
    notes: [
      {
        title: "프로젝트는 10단원 수업 세 주에 걸쳐",
        body: "진도표에서 8월 3주 선거와 민주정치, 8월 4주 정치 주체의 역할과 정치과정, 9월 1주 지방자치와 시민참여 수업까지 세 차시 연속으로 '수행평가 연계' 표시가 붙습니다. 정당의 활동 조사, 정치 과정 작성, 시민참여활동 조사가 각각 평가요소로 나뉘어 있어 조사한 내용을 단계별로 정리해 두는 것이 필요합니다.",
      },
      {
        title: "법 보고서는 기말 범위와 겹칩니다",
        body: "법의종류와특징 보고서는 11월 1~3주 법의 의미와 목적, 법의 종류와 사회법, 재판의 의미와 공정한 재판 수업과 연계되며 성취기준은 [9사(일사)05-01]·[9사(일사)05-02]·[9사(일사)05-03]입니다. 같은 내용이 기말고사 평가요소에도 들어 있어, 보고서 준비가 12월 1주 시험 대비와 이어집니다.",
      },
      {
        title: "7단원과 9단원은 시험 평가요소 밖",
        body: "중간고사 평가요소는 문화(8단원)와 선거·정치과정·지방자치(10단원), 기말고사는 법·재판·인권·근로자의 권리입니다. 11월 4주부터 배우는 7단원 사회화와 12월 3~5주의 9단원 정치와 민주주의는 진도표상 형성·관찰·자기평가만 예정되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "중간·기말 30%씩(서답형 40점) · 용수철 무게 측정 20%(9월) · 기체 부피 변화 관찰 20%(10월)",
    intro:
      "1학년 과학 수행평가 40%는 9월 용수철 무게 측정과 10월 기체 부피 변화 관찰, 두 실험 과제로만 채워집니다. 상담에서는 Ⅴ단원 힘과 Ⅵ단원 기체 진도에 맞춰 실험 결과를 결론과 입자 모형으로 정리하는 연습이 되어 있는지부터 봅니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "용수철을 이용한 무게 측정",
        kind: "task",
        weight: 20,
        timing: "9월",
        method: "용수철 실험 장치를 이용한 탐구 설계 및 수행 · 결론 도출 · 문제에 다양하게 적용",
      },
      {
        name: "기체의 부피 변화 관찰",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "압력계로 압력에 따른 부피 측정 · 압력과 부피 관계 표현 · 입자 모형 표현 · 생활 속 사례 설명",
      },
    ],
    notes: [
      {
        title: "방침상 실험 평가가 20% 이상",
        body: "평가 방침에는 수행평가를 학기 성적의 40% 이상, 그 가운데 실험 평가를 20% 이상 실시한다고 되어 있고, 이번 학기 수행평가 두 개가 모두 실험입니다. 9월 1주 보고서 평가는 용수철 저울로 무게를 측정하는 과제로, 탐구 설계·결론 도출·문제 적용을 평가요소로 둡니다.",
      },
      {
        title: "기체 실험은 입자 모형 설명까지 포함",
        body: "10월 2주 보고서 평가는 실험으로 기체의 압력과 부피 관계를 알아내고 이를 입자 모형으로 설명하는지를 봅니다([9과06-02]). 평가요소에 압력계 측정, 관계 표현, 입자 모형 표현, 생활 속 사례 설명이 함께 있어 측정값을 그래프와 그림으로 옮기는 과정까지 준비해야 합니다.",
      },
      {
        title: "기말에는 태양계 단원이 들어갑니다",
        body: "기말고사 평가요소는 기체의 압력·온도와 부피에 더해 태양계를 이루는 천체, 천체 망원경과 관측, 태양에서 일어나는 현상과 지구에 미치는 영향까지입니다. 12월에 배우는 Ⅶ-2 지구와 달의 운동은 기말 성취기준에서 빠져 있으며, 수업 중 구술·서술형 평가로 확인합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },

  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 30%씩(서답형 40점) · 경험이 드러난 시 쓰기 20%(10월) · 한 학기 한 권 읽기 20%(11월)",
    intro:
      "2학년 국어 수행평가는 10월 시 창작과 11월 책 대화 뒤 에세이 쓰기이며, 두 과제 모두 4단원 반어·풍자·역설 수업 안에 놓여 있습니다. 상담에서는 표현 방법을 직접 써 보는 시 쓰기와 9월 5주 중간고사의 음운 범위를 함께 점검합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "경험이 드러난 시 쓰기",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "표현 방법의 독창성 · 내용의 완결성 · 내용 구성 및 유창성",
      },
      {
        name: "한 학기 한 권 읽기",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "읽기 참여도 · 내용의 충실성 · 모둠 대화 참여도 및 질문의 적절성 · 내용 구성 및 표현 방법",
      },
    ],
    notes: [
      {
        title: "시 쓰기는 반어·풍자·역설 단원 끝에",
        body: "진도표 10월 5주 쓰기 평가는 다양한 표현 방법을 활용해 시의 내용과 관련된 자신의 가치 있는 경험을 담은 시를 창작하는 과제입니다. 성취기준은 [9국01-04]와 [9국05-06]이고, 평가요소가 표현 방법의 독창성, 내용의 완결성, 내용 구성 및 유창성이라 배운 표현 기법을 시 안에 직접 넣어 보는 연습과 맞닿아 있습니다.",
      },
      {
        title: "책 대화 참여 자체가 채점 요소",
        body: "한 학기 한 권 읽기는 11월 2주 '책 읽고 책 대화하기에 참여한 후 에세이 쓰기'로 진행됩니다. 평가요소에 내용의 충실성과 표현 방법 외에 읽기 참여도, 모둠 대화 참여도 및 질문의 적절성이 들어 있어, 에세이 완성본만이 아니라 대화 시간에 어떤 질문을 던졌는지도 점수에 반영됩니다.",
      },
      {
        title: "음운은 중간, 훈민정음은 기말",
        body: "중간고사 평가요소는 문학에 반영된 사회·문화적 상황, 음운의 개념과 최소 대립쌍, 자음·모음 체계, 복합양식 글의 타당성과 신뢰성입니다. 10월 1~3주에 배우는 훈민정음 창제 배경·원리와 한글 표기 방식은 기말고사로 넘어가고, 공감·갈등 조정 대화도 기말 평가요소에 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "중간·기말 30%씩(서답형 40점) · 도형의 성질 정당화하기 25%(9월) · 개념탐구 포트폴리오 15%",
    intro:
      "하단중학교 2학년 수학에서 가장 큰 수행평가는 9월 '도형의 성질 정당화하기' 25%이고, 나머지 15%는 8~11월 활동지를 모으는 개념탐구 포트폴리오입니다. 상담에서는 이등변삼각형과 외심·내심의 성질을 논리적으로 설명하는 서술부터 점검합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "11월 5주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "도형의 성질 정당화하기",
        kind: "task",
        weight: 25,
        timing: "9월",
        method: "논리적으로 설명하기 · 수학 기호 바르게 표현하기",
      },
      {
        name: "개념탐구 포트폴리오",
        kind: "task",
        weight: 15,
        timing: "8월~11월",
        method: "개념 활동지 작성 완성도 · 문제풀이 활동지 작성 완성도",
      },
    ],
    notes: [
      {
        title: "정당화 과제의 범위는 삼각형의 성질",
        body: "도형의 성질 정당화하기는 [9수03-09]~[9수03-11]이 성취기준으로, 9월 1~2주의 이등변삼각형 성질, 직각삼각형 합동조건, 삼각형의 외심과 내심 수업과 같은 시기에 치릅니다. 채점 항목이 '논리적으로 설명하기'와 '수학 기호 바르게 표현하기'라서 결론보다 근거를 순서대로 적는 서술이 핵심입니다.",
      },
      {
        title: "포트폴리오는 활동지 두 종류의 완성도",
        body: "개념탐구 포트폴리오는 개념 활동지와 문제풀이 활동지를 얼마나 완성했는지로 매기며, 진도표 9·10·11월에 모두 수행평가로 표시됩니다. 성취기준이 일차함수와 삼각형의 성질([9수02-16]~[9수03-11]), 닮음부터 확률까지([9수03-12]~[9수04-06]) 두 묶음으로 적혀 있어 학기 전체 단원을 아우릅니다.",
      },
      {
        title: "확률은 기말 직전 4주 동안",
        body: "기말고사(11월 5주) 평가요소는 사각형 사이의 관계, 도형의 닮음, 삼각형의 무게중심, 피타고라스 정리, 경우의 수, 확률입니다. 진도표상 8단원 경우의 수와 확률이 11월 1~4주에 배치되어 있어 새 단원 진도와 시험 준비가 같은 달에 겹치고, 12월에는 4~8단원 복습 퀴즈가 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "중간·기말 30%씩 · 영어듣기 10%(9월) · 영어구술평가 15%(10월) · 러닝로그 15%(8~11월)",
    intro:
      "2학년 영어는 중간고사가 Lesson 4~5, 기말고사가 Lesson 6~7을 다루며 두 시험 모두 100점 중 40점이 서답형입니다. 상담에서는 10월 Lesson 6 진도 중에 치르는 영어구술평가의 대본 준비부터 일정을 잡습니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 40점" },
      { name: "영어듣기", kind: "task", weight: 10, timing: "9월", method: "식별, 이해, 세부 내용 파악 등" },
      {
        name: "영어구술평가",
        kind: "task",
        weight: 15,
        timing: "10월",
        method: "대본 완성도 · 내용 적합성 · 전달력 · 언어 사용",
      },
      { name: "러닝로그", kind: "task", weight: 15, timing: "8~11월", method: "읽기 · 쓰기" },
    ],
    notes: [
      {
        title: "구술평가 점수는 대본에서 시작",
        body: "영어구술평가(15%)의 평가요소는 대본을 얼마나 완성했는지에서 시작해 내용이 주제에 맞는지, 전달력, 언어 사용으로 이어지고 성취기준은 [9영02-03]·[9영02-04]·[9영02-06]입니다. 10월 Lesson 6 The Greatest Love for All 수업 기간에 치르므로, 말하기 연습에 앞서 대본을 정확한 문장으로 완성해 두는 것이 첫 단계입니다.",
      },
      {
        title: "러닝로그 15%는 넉 달 누적",
        body: "러닝로그는 읽기·쓰기를 평가요소로 8월 Lesson 4부터 11월 Lesson 7까지 매달 수행평가로 적혀 있습니다. 12월 1~2주의 Lesson 8 Time Travel은 관찰평가와 형성평가만 계획되어 있고 정기시험 평가요소에도 없어, 학기 점수에 들어가는 범위는 Lesson 7까지입니다.",
      },
      {
        title: "9월에 듣기평가와 중간고사가 함께",
        body: "영어듣기(10%)는 9월에 치르며 듣기 성취기준 [9영01-01]~[9영01-08] 전체가 범위이고, 평가요소는 식별, 이해, 세부 내용 파악 등입니다. 같은 달 5주에 중간고사가 있어 Lesson 5 The City as a Canvas 진도, 듣기평가, 시험 준비가 한 달 안에 모입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "역사 중간·기말 30%씩(서답형 50점) · 타이포셔너리 제작 20%(10월) · 역사 신문 제작 20%(11월)",
    intro:
      "2학년 사회과 평가는 역사 과목으로 하며, 정기시험 두 번은 서답형 배점이 각각 100점 중 50점으로 정해져 있습니다. 준비 순서는 5단원 제국주의와 국민 국가 건설을 마친 직후 10월 1주에 만드는 역사 타이포셔너리를 기준으로 잡습니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 50점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 50점" },
      {
        name: "역사 타이포셔너리 제작",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "주제 선정 · 키워드 마인드맵 구성 · 창의적인 타이포셔너리 제작",
      },
      {
        name: "역사 신문 제작",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "머리기사 작성 · 인터뷰 작성 · 홍보 광고 제작 · 조화로운 역사 신문 구성",
      },
    ],
    notes: [
      {
        title: "타이포셔너리는 중간고사 범위를 다시 씁니다",
        body: "역사 타이포셔너리는 10월 1주에 5단원에서 배운 역사적 사건 하나를 골라 만드는 결과물 평가이며, 성취기준 [9역05-01]~[9역05-03]이 중간고사와 같습니다. 평가요소는 주제 선정, 선정한 키워드로 마인드맵 구성, 창의적인 타이포셔너리 제작이라 시험 공부한 개념을 키워드로 묶어 보는 작업이 됩니다.",
      },
      {
        title: "역사 신문은 6단원 전체를 묶는 과제",
        body: "역사 신문 제작은 11월 2주에 세계 대전과 사회 변동 단원([9역06-01]·[9역06-02])을 아우르는 신문을 만드는 과제입니다. 머리기사 작성, 인터뷰 작성, 홍보 광고 제작, 조화로운 신문 구성이 평가요소라, 사건을 기사 형식과 인물 인터뷰로 바꿔 쓰는 글쓰기가 함께 요구됩니다.",
      },
      {
        title: "기말 범위는 냉전 체제 형성까지",
        body: "기말고사 평가요소는 6-1 제1차 세계 대전부터 6-3 전쟁 범죄에 맞선 평화 유지 노력, 7-1 냉전 체제와 제3세계의 형성까지입니다. 12월 3주부터 배우는 7-2 민주주의와 인권의 확산, 2월의 7-3 세계화와 지역 세계의 변화는 기말고사 성취기준에서 빠지고, 수업 중 자기·동료평가와 논술형 평가로 다룹니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "중간·기말 30%씩(서답형 40점) · 전기와 자기 실험 20%(9월) · 식물과 에너지 탐구 20%(10월)",
    intro:
      "2학년 과학은 전기와 자기, 별과 우주 두 단원을 같은 주에 나란히 배우고, 수행평가는 9월 전기 실험과 10월 광합성 실험 설계가 20%씩입니다. 상담에서는 저항·전류·전압 관계를 실험 자료로 해석하는 보고서부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "전기와 자기 실험",
        kind: "task",
        weight: 20,
        timing: "9월",
        method: "자료 수집 · 자료 변환 및 해석 · 결론 도출 · 개념 정리 · 개념 적용",
      },
      {
        name: "식물과 에너지 탐구",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "가설 설정 · 변인 통제 · 실험 설계의 타당성 · 실험 안전 수칙",
      },
    ],
    notes: [
      {
        title: "전기 실험은 측정 자료를 해석하는 과제",
        body: "전기와 자기 실험은 [9과14-02] 범위로, 진도표 9월 1주 실험·실습 평가에서 실험을 통해 저항, 전류, 전압 사이의 관계를 이끌어내는지를 봅니다. 평가요소가 자료 수집, 자료 변환 및 해석, 결론 도출, 개념 정리, 개념 적용 다섯 가지라 측정값을 표와 그래프로 바꿔 관계를 끌어내는 단계가 중심입니다.",
      },
      {
        title: "광합성 탐구는 실험을 직접 설계",
        body: "10월 1주 보고서 평가는 환경 요인과 광합성의 관계를 탐구하는 실험을 학생이 설계하는 과제입니다([9과12-01]). 가설 설정, 변인 통제, 실험 설계의 타당성, 실험 안전 수칙이 평가요소이고, 바로 앞 9월 4주에 광합성에 필요한 물질과 산물을 확인하는 실험 보고서 수업이 있습니다.",
      },
      {
        title: "별과 우주는 두 시험에 나뉘어 출제",
        body: "중간고사 평가요소에는 전기·자기와 광합성 과정 외에 별까지의 거리 구하기, 표면 온도와 색의 관계가 들어 있습니다. 기말고사는 광합성 환경 요인부터 소화·순환·호흡·배설과 세포호흡까지, 그리고 우리은하 구조, 성운과 성단, 우주 팽창이 범위라 두 줄로 진행되는 진도를 시험별로 나눠 정리해야 합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "hadan-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "10월 5주 기말고사 한 번 40%(서답형 50점) · 시집 해석 30% · 한 학기 한 권 읽기 30%(둘 다 9월)",
    intro:
      "3학년 국어는 2학기 정기시험이 10월 5주 기말고사 한 번(40%)이고, 수행평가 60%는 9월 한 달에 두 과제가 연달아 있습니다. 상담에서는 9월 1~2주 시집 비평문과 9월 3~4주 읽기 과정 점검 과제를 시험보다 먼저 준비합니다.",
    assessments: [
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 50점" },
      {
        name: "시집 읽고 해석하기",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "논술형 · 근거 들어 시 해석하기, 시 해석을 바탕으로 비평문 쓰기",
      },
      {
        name: "한 학기 한 권 읽기",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "서술형 · 읽기 과정 점검하며 읽기, 우수 작품 선정하여 요약하기",
      },
    ],
    notes: [
      {
        title: "시집 과제의 결과물은 비평문",
        body: "시집 읽고 해석하기는 [9국05-05] 사회·문화적 배경을 바탕으로 한 작품 이해와 [9국05-07] 근거의 차이에 따른 해석 비교가 성취기준이며, 진도표에 논술형 수행평가로 적혀 있습니다. 근거를 제시해 시를 다양하게 해석한 뒤 그 해석을 바탕으로 비평문을 쓰는 순서라, 해석의 근거를 시 구절에서 찾아 적는 연습이 먼저입니다.",
      },
      {
        title: "한 권 읽기는 점검과 요약",
        body: "한 학기 한 권 읽기는 9월 3~4주 '능동적으로 읽기' 단원에서 서술형 수행평가로 치르며, [9국02-03] 글 내용 요약과 [9국02-09] 읽기 과정 점검·조정이 성취기준입니다. 평가요소는 읽기 과정을 점검하며 읽기, 우수 작품을 선정하여 요약하기로 정리되어 있습니다.",
      },
      {
        title: "11월 이후 단원은 학기 점수 밖",
        body: "기말고사 평가요소는 작품의 사회·문화적 배경, 해석의 근거, 문장의 짜임과 양상, 관점과 형식의 차이 파악입니다. 시험 뒤 11월의 보고하는 글 쓰기(진로탐색 보고서), 주장하는 글 쓰기, 12월의 자신감 있게 말하기는 기말고사 성취기준과 겹치지 않습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "기말고사 한 번 40%(10월 5주) · 삼각비로 높이 구하기 30%(9월) · 개념탐구 포트폴리오 30%",
    intro:
      "3학년 수학은 정기시험은 10월 5주에 치르는 기말고사뿐이고, 학기 점수의 60%가 수행평가 두 개에 30%씩 나뉩니다. 상담에서는 9월 3~4주 학교 안에서 실제 높이를 구하는 삼각비 과제와 기말 범위인 원의 성질 진도를 함께 봅니다.",
    assessments: [
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "학교에서 삼각비로 높이 구하기",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "삼각비의 활용 · 자기 성찰 및 기록",
      },
      {
        name: "개념탐구 포트폴리오",
        kind: "task",
        weight: 30,
        timing: "8~10월",
        method: "대푯값과 산포도, 상관관계, 삼각비, 원의 성질 개념 정리",
      },
    ],
    notes: [
      {
        title: "높이 구하기는 성찰 기록도 평가",
        body: "학교에서 삼각비로 높이 구하기는 [9수04-18] 삼각비를 활용한 문제 해결이 성취기준이며, 진도표 9월 3주 삼각비의 활용과 4주 대단원 마무리 시간에 진행됩니다. 삼각비의 활용 외에 '자기 성찰 및 기록'이 별도 평가요소라 계산 결과와 함께 측정 과정을 돌아본 기록도 남겨야 합니다.",
      },
      {
        title: "포트폴리오에는 통계 단원이 포함",
        body: "개념탐구 포트폴리오는 8월 3~4주 대푯값, 분산과 표준편차, 산점도와 상관관계부터 10월 원주각의 활용까지 매주 이어지고, 성취기준도 [9수05-06]~[9수05-08]과 [9수04-17]~[9수04-20]입니다. 통계 단원은 기말고사 성취기준에 없어 이 포트폴리오로만 학기 점수에 들어갑니다.",
      },
      {
        title: "기말 뒤 두 달은 3학년 총정리",
        body: "진도표상 11~12월은 다항식의 곱셈, 인수분해, 이차방정식, 이차함수, 통계, 삼각비, 원의 성질 총정리가 이어지고 평가 방법은 관찰평가와 퀴즈를 이용한 평가입니다. 학기 성적에 반영되는 평가는 10월 5주 기말고사로 마무리됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "기말고사 40%(10월 5주) · 영어듣기 10%(9월 3일) · 구술평가 25%(9월) · 영어독서 25%(9~10월)",
    intro:
      "3학년 영어는 학기 점수의 60%가 9~10월 수행평가 세 가지에서 나오고, 10월 5주 기말고사가 40%입니다. 상담에서는 9월 2주 구술평가와 9월 4주~10월 1주 영어독서가 연달아 이어지는 일정부터 정리합니다.",
    assessments: [
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 40점" },
      { name: "영어듣기", kind: "task", weight: 10, timing: "9월 3일", method: "전국시도 교육청 주관 영어듣기평가" },
      {
        name: "영어구술평가",
        kind: "task",
        weight: 25,
        timing: "9월",
        method: "대본 완성도 · 내용 적합성 · 전달력 · 언어 사용",
      },
      {
        name: "영어독서",
        kind: "task",
        weight: 25,
        timing: "9~10월",
        method: "독후 활동지 내용 완성도 · 내용 적합성 · 표현의 우수성 · 언어 사용",
      },
    ],
    notes: [
      {
        title: "기말 평가요소에 듣기평가 대본이 있습니다",
        body: "기말고사 평가요소는 My Roles in Society, Environmental Innovations, Take Part in the Economy 세 단원과 '2025학년도 2회 영어듣기평가 대본'입니다. 서답형은 완성형·단답형·서술형·논술형으로 출제하고 만점의 40% 이상을 반영하며, 10월 5주부터 배우는 7·8단원은 시험 범위 밖입니다.",
      },
      {
        title: "구술평가는 9월 2주, 대본부터",
        body: "영어구술평가(25%)는 9월 2주에 치르며 성취기준은 [9영01-02]·[9영02-06]입니다. 대본·내용 적합성·전달력·언어 사용 네 요소를 보므로 발표 연습 전에 대본 문장을 다듬어 두어야 하며, 바로 앞 9월 1주에 영어듣기평가가 있습니다.",
      },
      {
        title: "영어독서는 독후 활동지로 평가",
        body: "영어독서(25%)는 9월 4주와 10월 1주 두 차례 수업에 걸쳐 진행되고, 읽기·쓰기 성취기준 [9영03-02]·[9영03-04]·[9영04-02]·[9영04-05]가 범위입니다. 독후 활동지의 내용 완성도, 내용 적합성, 표현의 우수성, 언어 사용을 보므로 읽은 내용을 영어 문장으로 정리하는 분량이 점수와 연결됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회·역사 모두 10월 5주 기말 40% · 사회 영역보고서·지역화전략 30%씩 / 역사 신문·일기 30%씩",
    intro:
      "하단중 3학년은 사회와 역사를 함께 배우며, 두 과목 모두 정기시험은 10월 5주 기말고사(40%) 하나이고 수행평가 두 개가 30%씩입니다. 9월과 10월에 과목마다 과제가 하나씩 있어 상담에서는 네 과제의 주차부터 한 표로 정리합니다.",
    assessments: [
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 50점", course: "사회" },
      {
        name: "영역보고서",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "독도 보고서·통일의 필요성 보고서 작성, 영역보고서 완성",
        course: "사회",
      },
      {
        name: "지역화전략 프로젝트",
        kind: "task",
        weight: 30,
        timing: "10월",
        method: "지역 브랜드·지리적 표시제·지역 축제 사례 자료수집, 프로젝트 작성",
        course: "사회",
      },
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 50점", course: "역사" },
      {
        name: "역사 신문 제작",
        kind: "task",
        weight: 30,
        timing: "9월 중",
        method: "머리기사 작성 · 인터뷰 작성 · 홍보 광고 제작 · 조화로운 역사 신문 구성",
        course: "역사",
      },
      {
        name: "역사 일기 쓰기",
        kind: "task",
        weight: 30,
        timing: "10월 중",
        method: "인물 설정 · 인상 깊었던 일 3가지 · 느낀 감정 3가지 · 연관성 · 그림일기 작성",
        course: "역사",
      },
    ],
    notes: [
      {
        title: "사회: 독도 보고서와 지역 브랜드 조사",
        body: "사회 영역보고서는 9월 1~3주 우리나라의 영역과 독도, 국토 통일 수업과 연계되어 독도의 위치·자연환경·가치와 우리 영역임을 알 수 있는 자료를 모아 독도 보고서와 통일의 필요성 보고서를 씁니다. 10월 1~3주 지역화전략 프로젝트는 지역 브랜드, 지리적 표시제, 지역 축제 사례를 수집해 작성합니다.",
      },
      {
        title: "역사: 4단원은 신문, 5단원은 그림일기",
        body: "역사 신문 제작은 9월 4주에 4단원 조선의 성립과 발전을 아우르는 신문을 만드는 과제로 머리기사, 인터뷰, 홍보 광고를 씁니다. 10월 4주 역사 일기 쓰기는 5-1~5-2 단원 시기의 인물이 되어 인상 깊었던 일 3가지와 느낀 감정 3가지를 정하고 그 연관성을 그림일기로 표현하며, 성취기준은 [9역11-01]·[9역11-02]입니다.",
      },
      {
        title: "기말 뒤 두 과목의 진도",
        body: "사회는 10월 5주부터 국내 총생산과 경제 성장, 물가와 실업, 환율, 국제 사회, 도시 단원이 형성평가로 이어지고, 역사는 5-3 학문과 예술의 새로운 경향, 5-4 생활과 문화의 새로운 양상, 6단원 근현대 사회가 토론·구술·서술형·결과물 평가로 이어집니다. 어느 과목이든 이 구간은 10월 5주 시험 범위 뒤에 놓입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  {
    schoolSlug: "hadan-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "기말고사 한 번 40%(10월 5주, 서답형 40점) · 세포분열 실험 30%(9월) · 별과 우주 탐구 30%(10월)",
    intro:
      "3학년 과학은 기말고사 한 번(40%)과 실험·탐구 과제 두 개(30%씩)로 학기 점수가 정해집니다. 상담에서는 9월 1주 생식세포 분열 관찰 보고서와 10월 4주 별자리 탐사 계획서가 각각 어느 단원 진도에 붙어 있는지부터 확인합니다.",
    assessments: [
      { name: "기말고사", kind: "exam", weight: 40, timing: "10월 5주", method: "선택형+서답형 · 서답형 40점" },
      {
        name: "세포분열 실험",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "체세포 분열 단계별 특징 설명 · 생식세포 관찰결과를 분석하여 분열 단계 파악",
      },
      {
        name: "별과 우주 탐구",
        kind: "task",
        weight: 30,
        timing: "10월",
        method: "별의 거리 추론 · 최단 탐사 항로 수립 · 관측 색상으로 별의 표면 온도 분석",
      },
    ],
    notes: [
      {
        title: "세포분열 실험은 관찰 결과 분석",
        body: "세포분열 실험은 [9과21-02] 범위로, 진도표 9월 1주에 생식세포 분열 과정의 염색체 행동을 관찰하고 체세포 분열과 비교하는 보고서를 작성하는 방식입니다. 채점은 체세포 분열 단계별 특징 설명과 생식세포 관찰 결과로 각 분열 단계 파악으로 나뉘어 있어 현미경 관찰 사진을 단계별로 구분하는 연습과 맞닿아 있습니다.",
      },
      {
        title: "별과 우주 탐구는 탐사 계획서",
        body: "10월 4주 보고서 평가는 주어진 정보로 별의 특성을 추론하고 별자리 탐사 계획서를 쓰는 과제입니다([9과23-01]). 평가요소는 별의 거리 추론, 최단 탐사 항로 수립, 관측 색상을 통한 표면 온도 분석으로, 앞선 10월 2~4주 연주 시차와 별의 색 수업 내용을 그대로 적용합니다.",
      },
      {
        title: "기말 범위와 시험 뒤 단원",
        body: "기말고사 평가요소는 염색체·세포 분열·수정과 발생, 멘델 유전과 사람의 유전, 일·위치 에너지·운동 에너지와 역학적 에너지 보존입니다. 11~12월의 우주 팽창과 우주 탐사, 전기 에너지 발생과 이용, 과학 기술과 인류 문명은 시험이 끝난 뒤 배우는 단원으로 기말 평가요소에 들어 있지 않습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("하단중학교")],
  },
  // ───────── 1학년 ─────────
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "정기시험 2회 60%(서·논술형 35점씩) · 수행 2개 40%(주제 탐구·실생활 모델링)",
    intro:
      "공통수학2는 중간·기말시험이 각 30%로 선택형 65점과 서·논술형 35점을 치르고, 10월 주제 탐구와 11월 함수 모델링이 20%씩 논술형으로 반영됩니다. 정화여고 1학년 수학 상담은 도형의 방정식·집합과 명제 범위의 중간시험과 탐구 보고서 주제를 연결하는 것에서 출발합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 29일 ~ 10월 2일", method: "선택형 65점(19.5%)·서·논술형 35점(10.5%)" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 65점(19.5%)·서·논술형 35점(10.5%)" },
      { name: "기하와 논리를 활용한 주제 탐구하기", kind: "task", weight: 20, timing: "10월", method: "논술형" },
      { name: "함수를 이용한 실생활 모델링 하기", kind: "task", weight: 20, timing: "11월", method: "논술형" },
    ],
    notes: [
      {
        title: "중간은 도형·집합, 기말은 명제 후반과 함수",
        body: "중간시험 성취기준은 [10공수2-01-01]~[10공수2-02-03]으로 Ⅰ. 도형의 방정식과 Ⅱ. 집합과 명제의 집합 부분이고, 기말은 [10공수2-02-04]~[10공수2-03-05]로 명제부터 Ⅲ. 함수까지입니다. 서·논술형 35점이 두 시험 모두에 있어 풀이 과정을 쓰는 연습은 학기 내내 필요합니다.",
      },
      {
        title: "주제 탐구는 1·2단원 전체에서 고릅니다",
        body: "수행평가 1은 관심 있는 수학 내용을 정해 탐구하고 보고서와 추후 탐구 계획을 쓰는 과제로, 반영 성취기준이 [10공수2-01-01]~[10공수2-02-08]입니다. 수학적 개념의 이해와 적용 30, 탐구 내용의 적절성 30, 결과물의 우수성 40으로 채점하며, 진도표에는 10월 마지막 주(10.26.~10.30.)에 실시로 표시되어 있습니다.",
      },
      {
        title: "모델링 과제의 세 단계",
        body: "수행평가 2는 변화하는 실생활 주제를 골라 변화 과정을 표로 정리하고, 변화량을 좌표평면에 나타낸 뒤, 좌표에 가장 근접한 함수를 찾아 미래를 예측하는 순서입니다. 반영 성취기준은 Ⅲ. 함수 [10공수2-03-01]~[10공수2-03-05]이고, AI는 자료 조사와 브레인스토밍에만 허용됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2", "한국사2"],
    summary: "통합사회2·한국사2 모두 정기시험 2회 60% · 논술형 수행 2개 40%",
    intro:
      "1학년 사회 영역은 통합사회2와 한국사2 두 과목이 각각 정기시험 60%, 논술형 수행평가 40%입니다. 정화여고 사회 과외 상담은 9월 초 불평등 분석 보고서, 10월 인구 탐구 보고서, 10월 3주 또는 수시로 잡힌 한국사 인물 탐구 계획서 2건이 어떤 순서로 이어지는지부터 정리합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 29일 ~ 10월 2일", method: "선택형 60점(18%)·서·논술형 40점(12%)", course: "통합사회2" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 60점(18%)·서·논술형 40점(12%)", course: "통합사회2" },
      { name: "사회 속 불평등 분석 및 나만의 정의관 수립하기", kind: "task", weight: 20, timing: "9월 1~2주", method: "논술형", course: "통합사회2" },
      { name: "인구 변화에 따른 문제 탐구 보고서 작성하기", kind: "task", weight: 20, timing: "10월 4주", method: "논술형", course: "통합사회2" },
      { name: "중간시험", kind: "exam", weight: 30, timing: "9.29.~10.2.", method: "선택형 65점(19.5%)·서·논술형 35점(10.5%)", course: "한국사2" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12.8.~12.11.", method: "선택형 65점(19.5%)·서·논술형 35점(10.5%)", course: "한국사2" },
      { name: "일제강점기 인물 탐구 계획서 만들기", kind: "task", weight: 20, timing: "10월 3주 또는 수시", method: "논술형", course: "한국사2" },
      { name: "한국현대사 속 인물 탐구 계획서 만들기", kind: "task", weight: 20, timing: "10월 3주 또는 수시", method: "논술형", course: "한국사2" },
    ],
    notes: [
      {
        title: "통합사회2 두 보고서의 채점 무게",
        body: "불평등 과제는 사례 선정 20, 다양한 정의관으로 분석 30, 해결 방안의 타당성 30, 나만의 정의관 수립 20으로 채점합니다. 인구 과제는 지역을 정해 저출산·고령화·인구 이동 같은 변화를 분석하고 해결 방안을 제안하며, 원인·현황 분석과 해결 방안이 각 30점, 주제 선정과 근거 자료가 각 20점입니다.",
      },
      {
        title: "한국사2 계획서는 논증 구조를 봅니다",
        body: "두 인물 탐구 계획서는 논제 설정, 탐구 방법 구상, 계획서 작성 순으로 진행되고 채점 요소도 같습니다. 논제 설정 40점, 검증된 사료와 연구성과물(논문·저서) 제시 20점, 가설(잠정 결론) 제시 20점, 가설의 논증 구조 20점이며 가장 높은 단계는 전제 3개가 모두 결론을 뒷받침하는 경우입니다.",
      },
      {
        title: "한국사2 시험 범위의 경계",
        body: "한국사2 중간시험 성취기준은 [10한사2-01-01]~[10한사2-02-02]로 일제 식민 통치와 민족 운동, 정부 수립과 6·25 전쟁까지이고, 기말은 [10한사2-02-03]~[10한사2-03-03]으로 민주화 과정과 산업화, 외환 위기, 평화 실현 방안을 다룹니다. 일제강점기 계획서는 중간 범위, 현대사 계획서는 두 시험 범위에 걸칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "정기시험 2회 60%(서·논술형 34점씩) · 수행 2개 40%(이온 이동 탐구·2040 미래 사회 프로젝트)",
    intro:
      "통합과학2는 중간·기말시험이 30%씩이고 각 시험에서 서·논술형이 34점을 차지합니다. 수행평가는 이온 이동 탐구 실험과 2040년 미래 사회 의사결정 프로젝트가 20%씩이며, 정화여고 과학 상담은 10월 3주부터 11월 2주까지 이어지는 두 과제의 연속 일정을 먼저 봅니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 29일 ~ 10월 2일", method: "선택형 66점(19.8%)·서·논술형 34점(10.2%)" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 66점(19.8%)·서·논술형 34점(10.2%)" },
      { name: "[기초 탐구형] 전기장에 따른 이온의 이동과 산·염기성의 관계 탐구", kind: "task", weight: 20, timing: "10월 3 ~ 4주", method: "탐구형" },
      { name: "[기초 프로젝트형] 과학으로 설계하는 2040년 미래 사회: 근거 기반 과학적 의사결정 프로젝트", kind: "task", weight: 20, timing: "10월 5주 ~ 11월 2주", method: "프로젝트형" },
    ],
    notes: [
      {
        title: "이온 이동 탐구는 실험과 모형 설명입니다",
        body: "산성·염기성을 띠는 이온의 이동을 실험으로 확인하고 입자 모형으로 원리를 설명하는 과제로, 성취기준 [10통과2-01-04] 산·염기와 중화 반응에 근거합니다. 실험 수행 25, 결과 해석 25, 입자 모형을 활용한 현상 설명 30, 실험 안전 수칙 준수 20으로 채점해 모형 그림과 서술의 비중이 가장 큽니다.",
      },
      {
        title: "미래 사회 프로젝트의 진행 순서",
        body: "미래 사회 문제를 골라 해결에 쓸 과학기술을 탐색·고안하고, 근거 자료를 분석해 장점과 문제점을 따진 뒤 최종 의사결정을 하고 설계안을 발표합니다. 과학 원리 설명, 근거 자료 활용, 영향과 쟁점 분석, 해결방안과 의사결정이 각 20점이고 내용 구성과 발표·질의응답이 각 10점입니다.",
      },
      {
        title: "정기시험 단원 범위",
        body: "관련 대단원은 중간시험이 Ⅰ. 변화와 다양성과 Ⅱ. 환경과 에너지, 기말시험이 Ⅰ·Ⅱ에 Ⅲ. 과학과 미래 사회를 더한 범위입니다. 프로젝트 과제의 성취기준 [10통과2-03-01]~[10통과2-03-04](감염병·빅데이터·인공지능·과학 윤리)는 기말 범위의 Ⅲ단원과 그대로 겹칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },

  // ───────── 2학년 ─────────
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["주제 탐구 독서"],
    summary: "정기시험 2회 60%(서·논술형 40점씩) · 수행 2개 40%(주제 탐구 책 읽기·보고서 쓰기)",
    intro:
      "정화여자고등학교 2학년 주제 탐구 독서는 9월 중간시험과 12월 기말시험이 30%씩이고, 10월에 진로·학업 관련 책 읽기와 탐구 보고서 쓰기가 20%씩 논술형으로 반영됩니다. 상담은 학생이 고를 탐구 주제와 책을 먼저 정해 두 과제를 한 흐름으로 잇는 데서 시작합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월", method: "선택형 60점(18%)·서·논술형 40점(12%)" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점(18%)·서·논술형 40점(12%)" },
      { name: "학업과 진로 탐색을 위한 주제 탐구 책 읽기", kind: "task", weight: 20, timing: "10월", method: "논술형" },
      { name: "학업과 진로 탐색을 위한 주제 탐구 보고서 쓰기", kind: "task", weight: 20, timing: "10월", method: "논술형" },
    ],
    notes: [
      {
        title: "책 읽기 과제는 독서일지가 60점입니다",
        body: "첫 과제는 관심 있는 학습·진로 분야를 탐색해 주제를 정하고, 관련 책을 골라 깊이 읽으며 인상 깊은 구절과 그 이유, 자신의 생각을 기록하는 순서입니다. 주제 선정 20점, 탐구 계획 세우기 20점, 독서일지 쓰기 60점으로 채점하므로 구절 선택의 이유를 탐구 주제와 연결해 쓰는 부분이 가장 무겁습니다.",
      },
      {
        title: "보고서는 추가 자료로 관점을 세우는 과제입니다",
        body: "두 번째 과제는 주제 관련 자료를 더 찾아 읽고, 책과 자료를 종합해 관점을 형성한 뒤 보고서로 쓰는 것입니다. 추가자료 선정 10점, 관점 형성의 명료성 30점, 탐구 결과의 타당성 40점, 서론-본론-결론 구조를 보는 글의 논리성 20점이며, 두 과제 모두 AI 활용이 허용되지 않습니다.",
      },
      {
        title: "시험 범위와 과제 단원의 관계",
        body: "중간시험 관련 대단원은 1. 미래를 설계하는 나와 2. 관심 분야를 읽는 힘이고, 기말시험은 3. 정보를 탐색하는 눈과 4. 확장하며 소통하는 길입니다. 책 읽기 과제는 중간 범위의 2단원과 성취기준 [12주탐01-01]~[01-04]를, 보고서 과제는 기말 범위의 4단원과 [12주탐01-05]·[01-06]을 공유합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ"],
    summary: "정기시험 2회 60%(서·논술형 40점씩) · 수행 2개 40%(찬반 논증 글쓰기·발표 30%·영어듣기 10%)",
    intro:
      "2학년 영어Ⅱ는 중간·기말시험 30%씩에 찬반 이슈 논증 글쓰기와 발표 30%, 영어듣기 10%가 더해집니다. 정화여고 영어Ⅱ 상담은 8월 말부터 9월 2주, 10월 3주로 나뉜 논증 글쓰기·발표 일정과 레슨 순서가 섞인 시험 범위를 함께 확인하는 것으로 시작합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 29일 ~ 10월 2일", method: "선택형 60점(18%)·서·논술형 40점(12%)", course: "영어Ⅱ" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 60점(18%)·서·논술형 40점(12%)", course: "영어Ⅱ" },
      { name: "찬반 이슈에 대한 논증하는 영어 글쓰기 및 발표", kind: "task", weight: 30, timing: "8월 말일 ~ 9월 2주, 10월 3주", method: "논·구술형", course: "영어Ⅱ" },
      { name: "영어듣기", kind: "task", weight: 10, timing: "9월 9일(수)", method: "선택형", course: "영어Ⅱ" },
    ],
    notes: [
      {
        title: "시험 범위가 교과서 순서와 다릅니다",
        body: "중간시험 관련 단원은 Lesson 4 Voice Your Thoughts, Lesson 5 Beauty of Literature, Lesson 1이고, 기말시험은 Lesson 2 Traveling Green, Lesson 3 Art in Life, Lesson 6 Voyage Across the Universe입니다. 진도표도 8월에 Lesson 4부터 시작하므로 교재를 레슨 번호 순으로 정리하면 범위가 어긋납니다.",
      },
      {
        title: "논증 글쓰기는 기기 없이 씁니다",
        body: "자료 조사와 개요 작성 단계에서는 AI를 쓸 수 있지만, 실제 영어 글쓰기 시간에는 스마트 기기를 볼 수 없어 AI를 활용할 수 없다고 적혀 있습니다. 쓰기 60점 가운데 내용 및 구성 20점의 최상위 기준은 서론에 입장이 드러나고 서론-본론-결론 구조와 근거 3개 이상을 갖추는 것입니다.",
      },
      {
        title: "발표 40점의 구성",
        body: "발표는 에세이의 핵심 주장과 논거를 구어체로 재구성해 말하는 발화 내용 및 유창성 20점, 자료에 의존하지 않는 전달력과 상호작용 10점, PPT 등 발표 자료 활용 10점으로 나뉩니다. 영어듣기 10%는 교육청 영어듣기 평가 점수를 그대로 반영하며 9월 9일로 잡혀 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },
  {
    schoolSlug: "jeonghwayeoja-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["확률과 통계", "미적분Ⅱ"],
    summary: "확률과 통계·미적분Ⅱ 모두 정기시험 60%(단답형 5점 포함) · 수행 2개 40%",
    intro:
      "2학년 수학 계획서인 확률과 통계와 미적분Ⅱ는 정기시험마다 선택형 60점, 단답형 5점, 서·논술형 35점을 치르고 수행평가 두 개가 20%씩입니다. 정화여고 수학 상담은 과목별로 프로젝트형 1개와 논술형 1개가 놓인 시기를 시험 범위와 맞춰 보는 것부터 합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, method: "선택형 60점(18%)·단답형 5점(1.5%)·서·논술형 35점(10.5%)", course: "확률과 통계" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 60점(18%)·단답형 5점(1.5%)·서·논술형 35점(10.5%)", course: "확률과 통계" },
      { name: "조건부확률을 이용한 나만의 추천 알고리즘 만들기", kind: "task", weight: 20, timing: "10월 중순", method: "프로젝트형", course: "확률과 통계" },
      { name: "통계 포스터 만들고 결과 해석하기", kind: "task", weight: 20, timing: "11월 중순", method: "논술형", course: "확률과 통계" },
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 29일 ~ 10월 2일", method: "선택형 60점(18%)·단답형 5점(1.5%)·서·논술형 35점(10.5%)", course: "미적분Ⅱ" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 8일 ~ 12월 11일", method: "선택형 60점(18%)·단답형 5점(1.5%)·서·논술형 35점(10.5%)", course: "미적분Ⅱ" },
      { name: "블록코딩으로 콜라츠 추측 확인하기", kind: "task", weight: 20, timing: "9월 초", method: "프로젝트형", course: "미적분Ⅱ" },
      { name: "미적분 현상 분석 보고서 작성하기", kind: "task", weight: 20, timing: "11월 말", method: "논술형", course: "미적분Ⅱ" },
    ],
    notes: [
      {
        title: "확률과 통계 두 과제의 결과물",
        body: "추천 알고리즘 과제는 영화·음악·여행·음식 등에서 사용자 현황을 표로 정리하고 조건부확률을 구해 알고리즘을 만드는 것으로, 결과의 완성도 40점이 가장 큽니다. 통계 포스터는 주제를 정하고 공학도구로 자료를 분석해 포스터와 결과 해석을 내며, 자료 분석의 타당성과 결과 해석이 각 30점입니다.",
      },
      {
        title: "미적분Ⅱ는 개학 직후 코딩 과제가 먼저 옵니다",
        body: "콜라츠 과제는 블록코딩으로 여러 초깃값의 수열을 만들어 1에 도달하는지 표·그래프로 분석하며, 성취기준은 수열의 수렴·발산 [12미적Ⅱ-01-01]입니다. 자료 탐구와 결과 분석이 40점이고 사례 확인과 수학적 증명의 차이를 이해했는지도 봅니다. 진도표상 실시 주는 8.31.~9.4.이고 AI는 허용되지 않습니다.",
      },
      {
        title: "미적분Ⅱ 보고서와 기말 범위",
        body: "11월 말 보고서는 관심 분야에서 미적분이 쓰이는 사례를 조사해 실생활 현상을 분석하는 과제로, 속도·가속도, 입체도형의 부피, 속도와 거리 성취기준을 반영합니다. 중간시험은 Ⅰ. 수열의 극한과 Ⅱ. 미분법, 기말은 Ⅱ. 미분법과 Ⅲ. 적분법이 관련 대단원이라 보고서 내용이 기말 범위와 겹칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("정화여자고등학교")],
  },
  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 30%씩(서‧논술형 각 10.5%) · 점검·조정하며 읽기 20% · 자료 활용 글쓰기 20%",
    intro:
      "경신중학교 2학년 국어는 정기시험 두 번이 각 30%이고, 회차마다 그 안의 10.5%가 서‧논술형입니다. 수행평가 두 개는 모두 논술형이라, 상담에서는 9월 읽기 점검 과제와 11월 2주차 자료 활용 글쓰기 일정부터 맞춰 봅니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17~18일", method: "선택형 19.5%·서‧논술형 10.5%" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 7~9일", method: "선택형 19.5%·서‧논술형 10.5%" },
      { name: "점검·조정하며 읽기", kind: "task", weight: 20, method: "논술형 · 읽기 과정 점검·조정" },
      {
        name: "자료를 활용하여 글 쓰기",
        kind: "task",
        weight: 20,
        timing: "11월 2주차",
        method: "논술형 · 복합양식 자료를 활용한 글쓰기",
      },
    ],
    notes: [
      {
        title: "읽기 과제는 다섯 단계를 20점씩",
        body: "점검·조정하며 읽기는 [9국02-08]이 근거이며, 글의 내용 예측하기, 중심 내용 확인하기, 예측한 내용 확인하기, 단어의 뜻 파악하기, 더 알고 싶은 정보 찾아보기를 각각 20점으로 채점합니다. 읽을 글을 스스로 고르는 데서 출발하고, 개인의 사고 과정을 측정한다는 이유로 AI 활용은 허용되지 않습니다.",
      },
      {
        title: "글쓰기에서 AI는 자료 조사까지만",
        body: "자료를 활용하여 글 쓰기는 자료의 선정 및 활용, 내용의 적절성, 조직의 체계성, 표현의 명료성이 25점씩입니다. 자료 조사에는 AI를 제한적으로 쓸 수 있으나 결과물을 그대로 옮기지 않고 검토·수정해 자기 글로 써야 한다고 적혀 있고, 바로 전 주에는 복합양식 자료로 짧은 글을 쓰는 형성평가가 놓여 있습니다.",
      },
      {
        title: "중간과 기말이 다루는 단원",
        body: "수업은 국어A·국어B 두 갈래로 진행됩니다. 9월 중간시험은 점검하며 읽기·발표 단원과 음운·문자 체계 단원을, 12월 기말시험은 반어·역설·풍자를 쓰는 개성적 표현, 영상 제작, 복합양식 자료를 평가하며 읽고 쓰기를 범위로 잡고 있습니다. 서‧논술형은 두 시험 모두 35점 만점 영역입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "중간 30%(서술형 15) · 기말 30%(서술형 6) · 실생활 문제 논술 20% · 수학적 사실 분석 20%",
    intro:
      "경신중학교 2학년 수학 중간시험은 선택형과 서술형이 50점씩 반반이지만, 기말시험은 선택형 80점·서술형 20점으로 구성이 바뀝니다. 상담에서는 9월 말과 12월 초 두 번에 나눠 치르는 수학적 사실 분석 과제의 범위부터 정리합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17일~9월 18일", method: "선택형 15%·서술형 15%" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 7일~12월 9일", method: "선택형 24%·서술형 6%" },
      {
        name: "실생활 문제를 수학적으로 해결하기",
        kind: "task",
        weight: 20,
        timing: "10월~11월 중",
        method: "논술형 · 상황을 수학적 기호·수식으로 나타내 해결하고 생각 표현하기",
      },
      {
        name: "다양한 문제에서 수학적 사실 분석하기",
        kind: "task",
        weight: 20,
        timing: "9월~12월 중",
        method: "서술형 · 교과서 개념·예제 문제를 분석해 수학적 요소 발견하기",
      },
    ],
    notes: [
      {
        title: "실생활 문제 과제는 네 문항 구조",
        body: "실생활 문제를 수학적으로 해결하기는 문제의 이해 및 분석(8점×4문항), 문제 해결력(9점×4문항), 자신의 생각 표현력(8점×4문항)으로 채점하며 AI 사용은 전면 금지입니다. 성취기준은 이등변삼각형부터 평행선 사이 선분의 길이의 비([9수03-09]~[9수03-14])까지이고, 진도표에서는 11월 첫 주 단원 마무리 수업과 함께 놓여 있습니다.",
      },
      {
        title: "분석 과제는 두 차례로 나뉩니다",
        body: "다양한 문제에서 수학적 사실 분석하기는 진도표에 9월 21~25일 주(2-1, 도형의 성질)와 11월 30일~12월 4일 주(2-2, 닮음과 피타고라스 정리부터 확률까지) 두 번 표시되어 있습니다. 교과서 개념·예제·대단원 마무리 문제를 분석하는 과제로, 수학적 개념 이해와 수학적 원리 활용이 50점씩입니다.",
      },
      {
        title: "기말 범위에 확률 단원이 들어갑니다",
        body: "12월 기말시험 성취기준은 도형의 닮음([9수03-12]~[9수03-14])과 경우의 수·확률([9수04-05]~[9수04-06])이며, 확률 단원은 11월 9일 주에 시작합니다. 확률 진도는 12월 첫 주까지 이어지고 같은 주에 2-2 분석 과제가 있어, 확률 개념 정리를 과제 준비와 함께 묶어 두는 것이 진도와 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회·역사 모두 중간·기말 30%씩 · 사회 논술 과제 2개 · 역사 기사 쓰기·진정서 쓰기 20%씩",
    intro:
      "경신중학교 2학년은 사회와 역사를 따로 평가하며, 두 과목 모두 9월·12월 정기시험이 30%씩이고 수행평가 두 개가 20%씩입니다. 상담에서는 10월 초에 겹치는 사회 시장 원리 과제와 역사 냉전 특집 기사 쓰기 일정부터 나란히 놓고 봅니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17, 18일", method: "선택형 21%·서‧논술형 9%", course: "사회" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 7일~9일", method: "선택형 18%·서‧논술형 12%", course: "사회" },
      {
        name: "자료를 활용한 공간 분석과 해결 방안 제시하기",
        kind: "task",
        weight: 20,
        timing: "10월 말 ~ 11월 초",
        method: "논술형",
        course: "사회",
      },
      {
        name: "시장의 원리를 이해하고 주어진 문제 해결하기",
        kind: "task",
        weight: 20,
        timing: "10월 1주 ~ 10월 3주",
        method: "논술형",
        course: "사회",
      },
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17일 ~ 9월 18일", method: "선택형 19.5%·서‧논술형 10.5%", course: "역사" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 7일 ~ 12월 9일", method: "선택형 19.5%·서‧논술형 10.5%", course: "역사" },
      { name: "냉전 특집 기사 쓰기", kind: "task", weight: 20, timing: "9월 말~ 10월 초", method: "논술형", course: "역사" },
      { name: "인권 운동가 관점 진정서 쓰기", kind: "task", weight: 20, timing: "11월 중", method: "프로젝트형", course: "역사" },
    ],
    notes: [
      {
        title: "사회: 지역 불균형 과제는 해결 방안이 30점",
        body: "자료를 활용한 공간 분석과 해결 방안 제시하기는 [9사(지리)09-04] 수도권과 비수도권의 지역 불균형이 주제이며, 자료의 선정 및 신뢰성 15점, 공간적 차이 분석 30점, 원인 및 문제점 분석 25점, 해결 방안 제시 30점입니다. 통계자료를 직접 골라 분석하는 과제이고 AI는 활용하지 않습니다.",
      },
      {
        title: "사회: 시장 과제는 그래프와 균형가격",
        body: "10월 시장 원리 과제는 [9사(일사)09-02]를 근거로 경제 법칙의 이해와 활용이 각 30점, 시장 가격 원리의 이해와 이를 활용한 창의적 문제 해결이 각 20점입니다. 진도표 피드백 항목에 표와 그래프 표현, 균형가격·균형거래량 도출과 근거 설명이 적혀 있어, 수요·공급 그래프를 직접 그려 설명하는 연습과 맞닿아 있습니다.",
      },
      {
        title: "역사: 두 글쓰기 모두 자료 해석이 40점",
        body: "냉전 특집 기사 쓰기([9역07-01])와 인권 운동가 관점 진정서 쓰기([9역07-02])는 지식과 이해 30점, 자료 분석 및 해석 40점, 의사소통 30점으로 같은 틀이며 AI는 전면 금지입니다. 진정서는 흑인 민권·여성·노동 운동 중 하나를 골라 국제 인권 위원회를 설득하는 글이고, 두 과제 범위는 정기시험 성취기준과 겹치지 않습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "중간·기말 30%씩(서‧논술형 각 10.8%) · 광합성 제안서 20%(9월) · 별 관측 설득 글쓰기 20%(11월)",
    intro:
      "경신중학교 2학년 과학 수행평가는 두 개 모두 논술형으로, 9월에는 광합성 단원, 11월 말에는 별과 우주 단원에서 치릅니다. 기말시험 범위가 동물과 에너지·전기와 자기·별과 우주 세 단원에 걸치므로, 상담에서는 11월 과제 시점과 기말 대비 일정을 함께 확인합니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17일 ~ 9월 18일", method: "선택형 19.2%·서‧논술형 10.8%" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "12월 7일 ~ 12월 9일", method: "선택형 19.2%·서‧논술형 10.8%" },
      {
        name: "자료 분석을 통한 환경 요인과 광합성의 관계 탐구 및 제안서 작성",
        kind: "task",
        weight: 20,
        timing: "9월 2주~3주",
        method: "논술형",
      },
      {
        name: "우주 관측 자료 해석을 통한 별의 특성 분석 및 타당한 근거를 갖춘 설득하는 글쓰기",
        kind: "task",
        weight: 20,
        timing: "11월 4주~5주",
        method: "논술형",
      },
    ],
    notes: [
      {
        title: "광합성 제안서는 실험 설계가 40점",
        body: "9월 과제는 특정 지역의 환경 데이터에서 식물 생장의 제한 요인을 찾아 변인을 통제한 실험을 설계하고, 광합성량 자료를 해석한 뒤 환경 제어 제안서를 쓰는 흐름입니다. 탐구 문제 파악 및 실험 설계 40점, 자료 해석 및 과학적 원리 논증 30점, 과학 정보 이해 및 해결 방안 제시 30점이며 AI 사용은 금지됩니다.",
      },
      {
        title: "별 관측 과제는 논술 항목이 40점",
        body: "11월 과제는 연주시차·절대 등급·색 자료로 탐사 조건에 맞는 별을 고르고, 겉보기 등급과 절대 등급을 비교해 특정 거리의 별을 찾은 다음 우주 탐사의 타당성을 설득하는 글을 쓰는 순서입니다. 개념 조직 30점, 관측 자료 해석 30점, 영향을 다각도로 분석하는 논술 40점으로 나뉩니다.",
      },
      {
        title: "연계 형성평가가 과제보다 먼저 나옵니다",
        body: "진도표에는 8월 말 환경 요인 탐구 보고서와 9월 초 테라리움 기체 제어 전략이 '수행평가1 연계' 형성평가로, 11월 9일 주 관측 별 데이터 분석·거리 판별 연습이 '수행평가2 연계'로 표시되어 있습니다. 수행평가 직전 수업 활동이 같은 과제 구조를 미리 다루도록 짜여 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "중간 30%·기말 30%(10월 26~28일) · 삼각비 측정 과제 40%(9월 4주, 논술형)",
    intro:
      "경신중학교 3학년 수학 수행평가는 클리노미터로 학교 동상의 높이를 구하는 과제 하나이며, 이 과제가 40%를 차지합니다. 기말시험이 10월 26~28일에 치러지므로 상담에서는 9월 삼각비 과제와 10월 원주각·통계 진도를 한 흐름으로 묶어 봅니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 17일 ~ 9월 18일", method: "선택형 15%·서술형 15%" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "10월 26일 ~ 10월 28일", method: "선택형 24%·서술형 6%" },
      {
        name: "삼각비를 활용한 물체의 길이 구하기",
        kind: "task",
        weight: 40,
        timing: "9월 4주",
        method: "논술형 · 클리노미터 제작, 올려본각 측정, 동상 높이 계산",
      },
    ],
    notes: [
      {
        title: "측정 과제의 40점은 풀이 표현",
        body: "삼각비를 활용한 물체의 길이 구하기는 클리노미터 제작하고 측정하기 30점, 삼각비를 이용한 높이 계산 30점, 문제 해결 과정을 논리적으로 표현하기 40점입니다. 8월 31일~9월 4일 주 수업에서 같은 방식으로 학교 건물 높이를 구하는 형성평가가 '수행평가1 연계'로 먼저 진행되고, 과제에서 AI 활용은 금지됩니다.",
      },
      {
        title: "두 시험의 서술형 비중이 다릅니다",
        body: "중간시험은 삼각비와 원과 직선 단원([9수04-17]~[9수04-19])에서 선택형·서술형이 50점씩이고, 기말시험은 원주각과 통계(대푯값·산포도·상관관계) 단원에서 선택형 80점·서술형 20점입니다. 같은 30%라도 서술형 반영이 15%와 6%로 갈리므로 회차별로 풀이 서술 연습량을 다르게 잡는 근거가 됩니다.",
      },
      {
        title: "기말 이후는 복습과 진로탐색주간",
        body: "10월 기말시험 뒤 11월에는 실생활 삼각비, 원의 성질 표현하기, 통계 포스터 만들기처럼 자기평가·동료평가로 표시된 복습 활동이 이어지고, 11월 23일 주부터는 진도표가 진로탐색주간으로 채워져 있습니다. 학기 점수에 들어가는 평가는 10월 말까지 모두 끝나는 일정입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "정기시험은 10월 말 기말 한 번 60%(서‧논술형 21%) · 병자호란 논술 40%",
    intro:
      "경신중학교 3학년 사회과 평가는 역사 과목으로, 중간시험 없이 10월 말 기말시험 한 번이 60%이고 나머지 40%가 병자호란을 다룬 논술 한 편입니다. 상담에서는 왜란·호란 단원 수업과 이어지는 논술 준비를 조선 건국부터 조선 사회의 변동 단원까지인 기말 범위와 함께 잡습니다.",
    assessments: [
      { name: "기말시험", kind: "exam", weight: 60, timing: "10월 말", method: "선택형 39%·서‧논술형 21%" },
      { name: "병자호란의 기록, 백성의 눈으로 다시 쓰다", kind: "task", weight: 40, method: "논술형" },
    ],
    notes: [
      {
        title: "논술은 농민의 입장에서 제안하기",
        body: "병자호란 과제는 [9역10-04]를 근거로, 왜란 이후 조선의 상황을 자료로 파악하고 최명길과 윤집의 주장을 백성의 삶이라는 맥락에서 비교한 뒤 조선 농민의 입장에서 후금(청)과의 관계에 대한 의견을 근거와 함께 제안하는 글입니다. 역사적 사실 정확성 30점, 맥락 분석 및 서술 조직화 30점, 제안의 논리적 타당성 40점입니다.",
      },
      {
        title: "형성평가가 논술의 밑작업",
        body: "9월 7일 주 수업에서 그래프로 왜란 후 조선 상황을 분석하고 척화론과 주화론을 비교해 농민 입장에 감정이입하는 형성평가를 한 뒤, 다음 수업 주에 이를 바탕으로 수행평가를 진행하도록 짜여 있습니다. '후금, 청, 명분, 실리' 같은 용어를 당시 맥락에 맞게 이해하는 것이 과제 흐름의 첫 단계입니다.",
      },
      {
        title: "기말 범위와 그 뒤의 단원",
        body: "기말시험 성취기준은 [9역10-01]~[9역11-04]로, 조선의 통치 체제·사림·조선 전기 문화·왜란과 호란에서 붕당과 세도 정치·농민 봉기·학문과 예술·서민 문화까지 이어집니다. 10월 26일 주부터 배우는 근·현대 사회의 전개 단원은 동료평가·자기평가로만 표시되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
  {
    schoolSlug: "gyeongsin-middle-school-daegu-suseong",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "중간(9월 18일)·기말(10월 28일) 30%씩 · 세포 분열 실험 설계 논술 40%(9월)",
    intro:
      "경신중학교 3학년 과학은 과학A·과학B 두 갈래 수업이 나란히 진행되고, 정기시험 두 번과 세포 분열 실험 설계 논술 하나로 학기 점수가 정해집니다. 상담에서는 9월 논술과 중간시험이 같은 생식과 유전 단원 앞부분에서 나온다는 점부터 짚습니다.",
    assessments: [
      { name: "중간시험", kind: "exam", weight: 30, timing: "9월 18일", method: "선택형 19.2%·서‧논술형 10.8%" },
      { name: "기말시험", kind: "exam", weight: 30, timing: "10월 28일", method: "선택형 19.2%·서‧논술형 10.8%" },
      {
        name: "세포 분열 실험 설계 및 결론 도출 논술하기",
        kind: "task",
        weight: 40,
        timing: "9월 중",
        method: "논술형 · 실험 설계, 원리 설명, 결론 도출",
      },
    ],
    notes: [
      {
        title: "논술 배점은 실험 설계가 40점",
        body: "세포 분열 실험 설계 및 결론 도출 논술하기는 [9과21-01]·[9과21-02]를 근거로 실험 설계하기 40점, 원리 설명하기 30점, 결론 도출하기 30점이며 AI는 쓰지 않습니다. 8월 말부터 염색체·체세포 분열 수업마다 같은 이름의 형성평가가 이어지고, 9월 7일 주 생식세포 형성 과정 수업에 수행평가가 표시되어 있습니다.",
      },
      {
        title: "한 시험에 두 단원이 묶입니다",
        body: "중간시험은 세포 분열·발생([9과21-01]~[9과21-03])과 별과 우주([9과23-01]~[9과23-04])를, 10월 28일 기말시험은 멘델 유전·사람의 유전([9과21-04]·[9과21-05])과 에너지 전환과 보존([9과22-01]~[9과22-03])을 다룹니다. 갈래별 수업 진도가 한 시험에 합쳐지므로 단원별로 범위를 나눠 정리해 두는 편이 계획표와 맞습니다.",
      },
      {
        title: "11월부터는 점수에 들지 않는 활동",
        body: "기말시험 뒤에는 골드버그 장치 고안, 화성 기지 장소 찾기, 과학기술과 인류 문명 단원이 이어지지만 진도표의 평가 유형은 비어 있거나 자기평가·동료평가로만 적혀 있습니다. 정기시험·수행평가 표시는 10월 19~23일 주 수업까지에만 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경신중학교")],
  },
];

/** 학년 range allowed for a 학교급. */
export const GRADE_RANGE: Record<"초등학교" | "중학교" | "고등학교", number> = { 초등학교: 6, 중학교: 3, 고등학교: 3 };

export function isPublishedGradeSubject(c: SchoolGradeSubjectContent | undefined): c is SchoolGradeSubjectContent {
  return Boolean(c && c.status === "published" && c.notes.length > 0 && c.assessments.length > 0);
}

export function getSchoolGradeSubjectContent(
  schoolSlug: string,
  grade: number,
  subjectSlug: string
): SchoolGradeSubjectContent | undefined {
  const c = schoolGradeSubjectContents.find(
    (x) => x.schoolSlug === schoolSlug && x.grade === grade && x.subjectSlug === subjectSlug
  );
  return isPublishedGradeSubject(c) ? c : undefined;
}

/** Published entries for one school and 학년, in subjects.ts order is applied by the caller. */
export function getSchoolGradeEntries(schoolSlug: string, grade: number): SchoolGradeSubjectContent[] {
  return schoolGradeSubjectContents.filter((x) => x.schoolSlug === schoolSlug && x.grade === grade && isPublishedGradeSubject(x));
}

/** 학년 numbers that have at least one published entry for the school (ascending). */
export function getSchoolGrades(schoolSlug: string): number[] {
  return [...new Set(schoolGradeSubjectContents.filter((x) => x.schoolSlug === schoolSlug && isPublishedGradeSubject(x)).map((x) => x.grade))].sort(
    (a, b) => a - b
  );
}
