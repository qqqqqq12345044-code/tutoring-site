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

