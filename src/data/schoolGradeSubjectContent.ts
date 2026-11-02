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
  // 2026-11-02 27차 batch: 경남 창원 봉암동(창신고·창신중)·강원 원주 반곡관설동(영서고·반곡중) — 학교알리미 2026-2 평가계획
  {
    schoolSlug: "changsin-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "1·2차 정기시험 각 30% · 수행 2개 40%(모델링 프로젝트·명제 분석 서술)",
    intro:
      "창신고등학교 1학년 공통수학2는 10월·12월 정기시험이 각 30%, 모델링 프로젝트와 명제 분석 서술 과제가 각 20%입니다. 10월에 1차 시험과 명제 과제가 함께 잡혀 있어, 상담에서는 도형의 방정식과 집합·명제 범위를 어떤 순서로 정리할지부터 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점" },
      { name: "도형과 함수를 이용한 모델링 및 문제 만들기", kind: "task", weight: 20, timing: "11월", method: "프로젝트" },
      { name: "조건과 명제의 논리적 분석", kind: "task", weight: 20, timing: "10월", method: "서술·논술" },
    ],
    notes: [
      {
        title: "1차는 도형·집합, 2차는 함수",
        body: "평가요소 칸에서 1차 시험은 선분의 내분점, 두 직선의 수직 조건, 원의 방정식과 그래프, 두 집합의 포함관계, ‘모든’·‘어떤’을 포함한 명제까지이고, 2차 시험은 합성함수, 역함수의 존재 조건, 유리함수와 무리함수의 그래프와 성질입니다. 두 회차 모두 서·논술형이 40점이어서 풀이를 식으로 끝까지 쓰는 연습이 회차마다 필요합니다.",
      },
      {
        title: "명제 과제는 반례와 대우까지 씁니다",
        body: "10월 ‘조건과 명제의 논리적 분석’은 진리집합의 포함관계, 명제와 그 역의 참·거짓 판단, 참이면 증명하고 거짓이면 반례 제시, 필요조건·충분조건, 대우, 조건을 고쳐 새 명제 만들기를 항목별로 채점하며, 명제와 역의 검증이 각 20점입니다. 1차 시험과 같은 달이라 명제 단원은 시험과 과제를 한 번에 정리하는 편이 일정에 맞습니다.",
      },
      {
        title: "모델링 과제는 문제를 직접 출제합니다",
        body: "11월 프로젝트는 도형의 방정식이나 유리·무리함수를 적용할 실생활 소재를 고르고(20점), 좌표평면에 옮겨 식과 정의역·치역을 유도한 뒤(30점), 그 식으로 문제를 만들고(25점) 풀이 과정을 제시하는(25점) 순서로 채점됩니다. 2차 시험 범위인 유리·무리함수가 과제에도 들어가 그래프 그리기가 양쪽에 함께 쓰입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "1·2차 정기시험 각 30%(서·논술형 40점) · 영어 말하기 발표 1개 40%",
    intro:
      "1학년 공통영어2의 수행평가는 과제 하나가 40%를 모두 차지합니다. 1학기 탐구 내용을 바탕으로 사회현상에 대한 의견을 영어로 발표하는 10~11월 과제이므로, 상담에서는 1학기 탐구 자료와 발표 원고를 언제 준비할지부터 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점" },
      {
        name: "1학기 때 실시한 탐구 내용을 바탕으로 특정 사회현상에 대한 나의 생각이나 의견을 영어로 말하기",
        kind: "task",
        weight: 40,
        timing: "10 ~ 11월",
        method: "서술·발표",
      },
    ],
    notes: [
      {
        title: "발표 70점, 준비 과정 30점",
        body: "채점표는 발표 자체에 70점(내용 구성·내용 전달력·정확성과 유창성 각 20점, 청중과의 소통 10점), 발표 과정에 30점(자료조사 15점, 의견정리 15점)을 둡니다. 의견정리는 조사한 통계·매체 자료를 바탕으로 자신의 생각을 우리말로 정리하는 항목이어서, 영어 원고에 앞서 한국어로 논지를 세우는 순서가 채점 구조와 같습니다.",
      },
      {
        title: "1차는 읽기, 2차는 쓰기 항목",
        body: "평가요소를 비교하면 1차 시험은 세부 정보, 주제나 요지, 글의 전개 방식이나 구조 파악, 읽기 전략 적용 같은 읽기 항목이고, 2차 시험은 사실적 정보를 글로 전달하기, 읽은 내용을 요약해 기술하기, 어휘·표현 점검처럼 쓰는 항목입니다. 진도표에는 8~9월 Lesson 1·2, 10~12월 Lesson 3·4가 배치되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "1·2차 정기시험 각 30% · 수행 2개 40%(피지컬 컴퓨팅 보고서·과학 윤리 토론)",
    intro:
      "통합과학2는 정기시험 두 번이 60%이고, 피지컬 컴퓨팅 데이터 측정 보고서와 과학 윤리 찬반 토론이 각 20%입니다. 두 수행평가가 모두 10월~11월에 진행되어 1차 시험 시기와 겹치므로, 상담에서는 이 구간의 과제 일정부터 살핍니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점" },
      {
        name: "피지컬 컴퓨팅 장치를 활용한 실시간 생활 데이터 측정 보고서 작성 및 발표",
        kind: "task",
        weight: 20,
        timing: "10월 ~ 11월",
        method: "실험･실습 프로젝트 구술･발표",
      },
      {
        name: "과학 윤리 주제 쟁점 분석 및 근거 기반 찬반 심층 토론",
        kind: "task",
        weight: 20,
        timing: "10월 ~ 11월",
        method: "서술·논술 구술·발표",
      },
    ],
    notes: [
      {
        title: "보고서에는 활동 기록이 필요합니다",
        body: "피지컬 컴퓨팅 과제는 주제의 적합성 30점, 보고서 작성 능력 40점, 탐구산출물 발표 30점으로 나뉘고, 보고서에서는 프로그래밍을 활용한 데이터 수집·처리 과정의 서술을 봅니다. 활동 사진이나 영상을 첨부하지 않으면 AI로만 작성한 것으로 판단해 기본 점수를 준다고 적혀 있어, 측정 장면을 기록해 두는 것이 제출 요건입니다.",
      },
      {
        title: "토론은 개요와 개인 입장문까지 채점",
        body: "과학 윤리 토론은 핵심 용어 정의와 찬반 근거를 담은 토론 개요(40점), 규칙을 지키며 질문·반론·응답에 참여하는 정도(30점), 토론 뒤 자신의 입장을 근거와 연결해 정리한 글(30점)로 평가합니다. 2차 시험 평가요소에도 ‘과학 논리의 중요성 논증하기’가 있어 근거를 세워 주장하는 연습이 시험과 과제에 함께 쓰입니다.",
      },
      {
        title: "회차별 평가요소",
        body: "1차 시험은 환경변화와 생물의 다양성, 생활 주변의 변화 관측, 수소 핵융합 반응, 에너지 전환 과정이 평가요소이고, 2차 시험은 산과 염기를 혼합할 때의 변화, 온실효과 대처 방안, 신재생 에너지 활용 방안, 과학 논리의 중요성입니다. 두 수행평가의 성취기준은 10월부터 배우는 Ⅲ단원 ‘과학과 미래 사회’에 속합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["한국사2"],
    summary: "1·2회 정기시험 각 30% · 근대사/현대사 사건 재구성 서·논술 40%",
    intro:
      "1학년 한국사2는 10월·12월 정기시험이 각 30%이고, 수행평가는 9월~11월의 ‘근대사/현대사 역사적 사건 재구성하기’ 한 과제가 40%입니다. 상담에서는 과제에 쓸 근대사·현대사 사건을 각각 무엇으로 정할지부터 함께 정리합니다.",
    assessments: [
      { name: "1회 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점" },
      { name: "2회 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점" },
      { name: "근대사/현대사 역사적 사건 재구성하기", kind: "task", weight: 40, timing: "9월~11월", method: "서·논술형" },
    ],
    notes: [
      {
        title: "사건을 3인칭 관찰자 시점으로 다시 씁니다",
        body: "과제는 교과서에 나오는 근대사 사건과 현대사 사건을 하나씩 정해 각각 50점으로 채점합니다. 50점은 연도를 포함한 배경·원인, 구체적 용어와 인물 이름이 담긴 사건 과정, 사건의 영향까지 모두 3인칭 관찰자 시점으로 서술한 경우이고, 영향이 빠지면 40점, 배경·원인까지만 쓰면 20점으로 단계가 나뉩니다.",
      },
      {
        title: "두 회차에 일제 강점기와 현대사가 나뉩니다",
        body: "1회 시험 평가요소는 일제 식민 통치 정책과 식민지 경제 구조의 변화, 대한민국 정부 수립 과정, 6.25 전쟁과 분단의 고착화, 민주화 운동의 전개이고, 2회 시험은 국내외 민족 운동, 사회·문화 변화와 대중운동, 독립 국가 건설 운동, 산업화의 성과와 영향, 6월 민주 항쟁 이후 민주화, 외환 위기와 사회·문화의 변화 등입니다. 회차마다 일제 강점기와 현대사가 함께 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["화법과 언어", "주제 탐구 독서"],
    summary: "두 과목 모두 시험 60% · 화법과 언어 토의 40% / 주제 탐구 독서 프로젝트·포트폴리오 40%",
    intro:
      "2학년 국어 선택과목인 화법과 언어와 주제 탐구 독서는 모두 10월·12월 정기시험이 각 30%입니다. 수행평가는 화법과 언어가 토의 과제 하나(40%), 주제 탐구 독서가 프로젝트와 포트폴리오 두 개(각 20%)여서, 상담에서는 수강 과목에 따라 8~11월 과제 일정부터 나눠 봅니다.",
    assessments: [
      { name: "1회 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점", course: "화법과 언어" },
      { name: "2회 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점", course: "화법과 언어" },
      { name: "공동체의 문제를 해결하는 토의", kind: "task", weight: 40, timing: "10월~11월", method: "서·논술형", course: "화법과 언어" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점", course: "주제 탐구 독서" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점", course: "주제 탐구 독서" },
      {
        name: "주제 탐구 독서 프로젝트 ― 관심 분야 자료 비교·종합을 통한 관점 형성",
        kind: "task",
        weight: 20,
        timing: "9월~11월",
        method: "프로젝트",
        course: "주제 탐구 독서",
      },
      {
        name: "분야별 글 분석 포트폴리오 ― 구조와 문단 기능 파악을 통한 분석적 읽기",
        kind: "task",
        weight: 20,
        timing: "8월~11월",
        method: "포트폴리오",
        course: "주제 탐구 독서",
      },
    ],
    notes: [
      {
        title: "화법과 언어 시험은 언어 탐구가 중심입니다",
        body: "화법과 언어 1회 시험 평가요소는 표준 발음과 음운 변동, 품사와 문장 구조, 단어의 짜임과 의미 관계, 고대 국어부터 현대 국어까지의 변화이고, 2회는 발음·음운과 품사·문장 구조에 화자의 태도를 나타내는 어휘·문법 요소, 국어 생활 성찰이 더해집니다. 음운과 문장 구조가 두 회차에 모두 적혀 있어 1회 범위를 2회 전에 다시 보게 됩니다.",
      },
      {
        title: "토의 과제는 대안 분석에 배점이 몰립니다",
        body: "화법과 언어의 토의 수행평가는 자료를 탐색해 문제의 본질과 출처를 정리하는 단계 40점, 판단 준거를 세워 대안들의 장단점을 분석·평가하는 단계 40점, 가장 합리적인 대안과 실행 방법을 제시하는 단계 20점으로 채점됩니다. 평가 방법이 서·논술형이어서 토의 과정을 글로 정리한 기록이 채점 대상입니다.",
      },
      {
        title: "주제 탐구 독서는 두 시험의 평가요소가 같습니다",
        body: "주제 탐구 독서는 1차와 2차 시험의 성취기준([12주탐01-03], [12주탐01-04])과 평가요소가 똑같이 적혀 있으며, 글의 구조와 문단 기능, 핵심·부수 정보 구별, 정보의 신뢰성 판단, 추론과 적용을 다룹니다. 8월부터 쌓는 포트폴리오도 구조도 작성과 문단 기능 파악을 채점해, 포트폴리오 기록이 시험 준비와 같은 방향입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ"],
    summary: "1·2회 정기시험 각 30% · 수행 2개 40%(개념 탐구 에세이·그래프 분석)",
    intro:
      "2학년 미적분Ⅰ은 10월·12월 정기시험이 각 30%, 10월 개념 탐구 에세이와 11월 그래프 분석 과제가 각 20%입니다. 2회 시험이 미분 후반부터 적분까지를 다루므로, 상담에서는 미분 단원을 두 시험에 걸쳐 어떻게 이어 갈지부터 정합니다.",
    assessments: [
      { name: "1회 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점" },
      { name: "2회 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점" },
      { name: "미적분 본질 탐구 에세이", kind: "task", weight: 20, timing: "10월", method: "서술 논술형 평가" },
      { name: "함수의 연속성과 미분을 활용한 그래프 분석", kind: "task", weight: 20, timing: "11월", method: "서술 논술형 평가" },
    ],
    notes: [
      {
        title: "미분의 활용은 두 시험에 모두 들어갑니다",
        body: "1회 시험 평가요소는 함수의 극한과 연속부터 미분계수, 도함수, 접선의 방정식, 평균값 정리, 증가·감소와 극대·극소, 그래프 개형, 방정식·부등식, 속도와 가속도까지이고, 2회 시험은 평균값 정리부터 다시 시작해 부정적분, 정적분, 넓이, 속도와 거리로 이어집니다. 성취기준으로도 [12미적02-05]~[12미적02-10]이 두 회차에 겹칩니다.",
      },
      {
        title: "그래프 분석은 세부 항목 충족 개수로 채점",
        body: "11월 과제는 구간별 다항함수를 주고 연결점의 좌·우극한과 함숫값으로 연속을 판단하기(30점), 좌·우미분계수로 미분 가능성을 판단하고 접선을 구하기(30점), 도함수 부호로 증감과 극값을 찾아 그래프에 표시하기(40점)를 세부 항목을 몇 개 충족했는지로 채점합니다. 연결점에서 극한과 미분계수를 따로 계산하는 절차가 그대로 배점 항목입니다.",
      },
      {
        title: "에세이는 개념 하나를 골라 깊게",
        body: "10월 에세이는 미적분 영역에서 개념 하나를 골라 정의를 수식으로 제시하고 특징을 설명하는 부분(40점), 성질과 다른 수학 개념과의 관계를 분석하는 부분(40점), 개념이 필요한 이유와 수학적 의미를 정리하는 부분(20점)으로 나뉩니다. 1회 시험과 같은 달이어서 시험 범위 안의 개념을 고르면 준비가 겹칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  {
    schoolSlug: "changsin-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어 독해와 작문", "심화영어"],
    summary: "두 과목 모두 시험 60% · 논술형 쓰기 2개 40%(분석 글·이메일 / 북 리포트·제안서)",
    intro:
      "2학년 영어 선택과목인 영어 독해와 작문과 심화영어는 모두 10월·12월 정기시험 각 30%에 논술형 쓰기 과제 두 개(각 20%)를 더하는 구성입니다. 과제 형식이 분석적 글, 이메일, 북 리포트, 제안서로 서로 달라 상담에서는 수강 과목의 글 형식부터 확인합니다.",
    assessments: [
      { name: "1회 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점", course: "영어 독해와 작문" },
      { name: "2회 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점", course: "영어 독해와 작문" },
      {
        name: "디지털 기술과 관련된 현상이나 사실을 기반으로 분석적 글쓰기",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "논술형",
        course: "영어 독해와 작문",
      },
      {
        name: "환경 문제를 개선하기 위한 행동을 요청하는 이메일 작성하기",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "논술형",
        course: "영어 독해와 작문",
      },
      { name: "1회 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 60점·서·논술형 40점", course: "심화영어" },
      { name: "2회 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 60점·서·논술형 40점", course: "심화영어" },
      { name: "나의 성장을 위한 원서 소개하는 북 리포트 쓰기", kind: "task", weight: 20, timing: "9~12월", method: "논술형", course: "심화영어" },
      { name: "사회적 문제 해결을 위한 AI로봇 기획 제안서 쓰기", kind: "task", weight: 20, timing: "9월~12월", method: "논술형", course: "심화영어" },
    ],
    notes: [
      {
        title: "분석적 글은 네 부분 구성을 봅니다",
        body: "영어 독해와 작문의 분석적 글쓰기는 서론(주제 개요와 사실적 근거), 본론1(현상의 원인), 본론2(발생 가능한 문제점), 결론(해결책과 제안) 네 요소가 들어갔는지로 내용 40점을 매기고, 표현의 유창성과 언어의 정확성에 각 30점을 둡니다. 일부나 전체를 한글로 쓰면 정확성 항목이 10점으로 정해져 있습니다.",
      },
      {
        title: "이메일은 형식 요소가 40점",
        body: "환경 문제 개선을 요청하는 이메일은 수신자, 인사, 내용, 맺음말을 모두 갖추었는지가 40점으로 가장 크고, 문제점·해결 방법·행위자를 브레인스토밍해 개요를 짜는 단계와 어휘·언어 형식 사용이 각 30점입니다. 영어 독해와 작문의 두 쓰기 과제는 모두 10월~11월이라 1회 시험 시기와 겹칩니다.",
      },
      {
        title: "심화영어 과제는 9월부터 12월까지",
        body: "심화영어 두 과제는 평가 시기가 9월부터 12월까지입니다. 북 리포트는 원서를 소개하는 이유, 인상 깊은 부분, 배운 점, 인용문을 활용한 감정·생각 표현, 언어의 정확성을 각 20점으로 보고, AI 로봇 제안서는 이름·목표 사용자와 사회문제·사용법·기능·광고문구 다섯 항목을 모두 썼는지에 40점을 둡니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신고등학교")],
  },
  // ───────────────────────── 1학년 ─────────────────────────
  {
    schoolSlug: "changsin-middle-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 35%씩(선택 28점·서술 72점) · 정보 전달 글쓰기 15% · 갈등 문학 감상 15%",
    intro:
      "창신중학교 1학년 국어는 중간·기말고사가 각각 100점 가운데 72점을 서술형으로 출제해, 정기시험 70%의 대부분이 직접 쓴 답안에서 결정됩니다. 상담에서는 기말 범위에 함께 묶인 문학 단원과 11월 갈등 문학 감상 과제를 한 흐름으로 준비하는 것부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "기말고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 28점·서술형 72점" },
      {
        name: "정보를 전달하는 글 쓰기",
        kind: "task",
        weight: 15,
        method: "쓰기 영역 · 아이북·태블릿으로 워드 작성 후 구글 클래스 업로드",
      },
      { name: "갈등을 담은 문학 감상하기", kind: "task", weight: 15, timing: "11월", method: "문학 영역" },
    ],
    notes: [
      {
        title: "글쓰기 과제의 네 가지 채점 기준",
        body: "정보를 전달하는 글 쓰기는 [9국03-02]에 근거해 신뢰할 수 있는 사실에 기반한 내용, 서론-본론-결론 구조와 단락 간 연결, 정의·예시·비교·대조·분류 같은 설명 방법 활용, 감정과 단정적 의견을 뺀 객관적 어휘와 간결한 문장을 25점씩 봅니다. 쓰기 전에 개요를 세우고 단락마다 쓸 설명 방법을 정해 두는 연습이 이 기준과 맞닿습니다.",
      },
      {
        title: "문학 감상은 요약에서 자기 견해까지",
        body: "갈등을 담은 문학 감상하기([9국05-02])는 갈등의 진행과 해결 과정 요약, 인물의 행동이나 가치관을 타당한 근거로 평가하기, 작품과 관련된 질문을 던지고 답 찾기, 자신의 삶이나 사회 현실과 관련지은 견해 밝히기를 각 25점으로 채점합니다. 줄거리 정리는 네 항목 가운데 하나에 해당합니다.",
      },
      {
        title: "품사는 중간, 주장하는 글은 기말",
        body: "반영 비율 표의 평가내용을 보면 중간고사는 매체([9국06-01]), 읽기([9국02-02] 요약하기), 쓰기([9국03-02]), 문법([9국04-03] 품사)을 다루고, 기말고사는 듣기·말하기([9국01-07] 토의, [9국01-10] 언어폭력), 문학([9국05-02]), 쓰기([9국03-03] 주장하는 글)를 다룹니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차고사 35%씩(서술형 72점) · 10월 삼각형 작도 활동지 15% · 11월 정다면체 활동지 15%",
    intro:
      "1학년 수학 수행평가는 활동지 두 장으로, 10월에는 삼각형의 작도를, 11월에는 정다면체를 다룹니다. 1·2차고사도 각각 서술형이 72점이라, 상담에서는 작도 순서와 꼭짓점·모서리 개수 구하는 방법을 말로 설명하는 연습을 시험 준비와 묶어 봅니다.",
    assessments: [
      { name: "1차고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "2차고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 28점·서술형 72점" },
      { name: "활동지1", kind: "task", weight: 15, timing: "10월", method: "개별평가 · 삼각형의 작도([9수03-03])" },
      { name: "활동지2", kind: "task", weight: 15, timing: "11월", method: "개별평가 · 정다면체 탐구하기([9수03-07])" },
    ],
    notes: [
      {
        title: "작도 활동지는 세 조건과 설명",
        body: "활동지1은 세 변의 길이, 두 변의 길이와 그 끼인각, 한 변의 길이와 그 양 끝각이 주어진 삼각형을 각각 작도하는지와 세 가지 작도 방법을 설명할 수 있는지를 25점씩 봅니다. 그리는 것과 설명하는 것이 따로 채점되므로, 작도 순서를 문장으로 적어 보는 연습이 마지막 항목과 이어집니다.",
      },
      {
        title: "정다면체 활동지에는 모둠 협조 항목",
        body: "활동지2는 정다면체의 의미, 점과 꼭짓점·선과 모서리·면의 용어 구분과 개수, 꼭짓점과 모서리 개수를 구하는 방법의 이해에 더해 모둠원이 다 같이 다면체를 만들도록 서로 협조했는지를 25점씩 평가합니다. 네 항목 중 하나가 모둠 활동 태도입니다.",
      },
      {
        title: "2차고사 범위에 통계 단원이 들어갑니다",
        body: "반영 비율 표의 성취기준을 보면 1차고사는 [9수03-01]~[9수03-06](위치 관계, 평행선, 작도, 합동, 다각형, 부채꼴)이고, 2차고사는 입체도형([9수03-07]·[9수03-08])과 함께 대푯값, 도수분포표·히스토그램, 상대도수, 통계적 탐구([9수04-01]~[9수04-04])까지 포함합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "중간·기말 35%씩(선택 25점·서술 75점) · 힘 관찰 활동지 15% · 기체 압력·부피 활동지 15%",
    intro:
      "1학년 과학의 수행평가 30%는 학기 중 활동지 두 번입니다. 하나는 여러 가지 힘을 관찰·조사하고, 다른 하나는 기체의 압력과 부피 관계를 실험으로 확인하므로, 상담에서는 두 활동지에 공통으로 들어간 디지털 기기 활용과 실험 기록 방식부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 35, timing: "10월", method: "선택형 25점·서술형 75점" },
      { name: "기말고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 25점·서술형 75점" },
      { name: "활동지1", kind: "task", weight: 15, timing: "학기중", method: "개별평가 · 여러 가지 힘 관찰 및 조사하기" },
      { name: "활동지2", kind: "task", weight: 15, timing: "학기중", method: "개별평가 · 기체의 압력과 부피 관계 알아보기" },
    ],
    notes: [
      {
        title: "힘 활동지는 의미와 방향을 함께",
        body: "첫 번째 활동지는 중력, 탄성력, 부력 각각의 의미와 작용 방향을 설명하는지를 25점씩, 관찰·조사 과정에서 디지털 기기를 이용했는지를 25점으로 봅니다. 힘마다 '의미'와 '방향' 두 가지를 함께 설명해야 하는 구성이라, 세 힘을 같은 틀로 정리해 두면 채점 기준과 바로 대응합니다.",
      },
      {
        title: "기체 실험은 그래프와 생활 사례로",
        body: "두 번째 활동지는 실험 결과에서 기체의 압력과 부피 관계를 찾아내는지, 그 관계를 그래프로 표현하고 설명하는지, 결과를 일상생활 사례와 연결하는지, 안전을 지키며 디지털 기기로 실험 장면을 기록했는지를 25점씩 평가합니다. 성취기준 [9과06-02]의 탐구 활동도 압력과 부피 관계를 실험으로 알아보는 내용입니다.",
      },
      {
        title: "정기시험은 회차마다 서술형 75점",
        body: "중간·기말고사는 각각 100점 가운데 선택형 25점, 서술형 75점으로 구성되며, 반영 비율로는 회차마다 선택형 8.75%, 서술형 26.25%입니다. 중간고사는 10월, 1학년 기말고사는 12월로 적혀 있어 두 활동지는 이 사이 학기 중에 진행됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },

  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "changsin-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 35%씩(서술 72점) · 10월 독서활동 15% · 11월~12월 카드 뉴스 만들기 15%",
    intro:
      "2학년 국어 수행평가는 10월 독서활동과 11월~12월 카드 뉴스 제작으로 나뉩니다. 카드 뉴스 기간이 12월 기말고사와 겹치므로, 상담에서는 계획서와 낱장 개요를 언제까지 마칠지부터 정하고 서술형 72점이 걸린 기말 범위 정리와 일정을 나눕니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "기말고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 28점·서술형 72점" },
      { name: "독서활동", kind: "task", weight: 15, timing: "10월", method: "읽기 영역 · [9국02-08]" },
      {
        name: "카드 뉴스 만들기",
        kind: "task",
        weight: 15,
        timing: "11월~12월",
        method: "쓰기 영역 · 미리캔버스·캔바·PPT 등으로 제작해 구글 클래스룸 업로드",
      },
    ],
    notes: [
      {
        title: "독서활동은 읽기 전·중·후를 나눠 채점",
        body: "독서활동([9국02-08])은 읽기 전 목적을 고려한 실행 가능한 독서계획, 읽기 중 궁금한 점과 그 답, 읽은 후 독서 경험이 삶과 태도로 이어졌는지 돌아보는 감상문, 책의 핵심 내용을 정확하고 간결하게 정리하기를 각 25점으로 봅니다. 읽는 도중의 기록도 따로 점수가 매겨지는 구조입니다.",
      },
      {
        title: "카드 뉴스는 계획서와 6장 이상",
        body: "카드 뉴스 만들기([9국03-07])는 계획서의 주제·선정 이유·예상 독자·제목 설정 25점, 낱장별 개요 6장 이상 작성 25점, 주제와 목적에 맞게 자료를 조직한 카드 뉴스 6장 이상 제작 30점, 복합양식 자료를 활용한 디자인과 출처 제시 20점으로 항목마다 배점이 다릅니다. 출처 표기도 채점 문구에 들어 있습니다.",
      },
      {
        title: "중간과 기말의 평가 영역",
        body: "반영 비율 표의 평가내용에서 중간고사는 읽기([9국02-08]·[9국02-04]), 듣기·말하기([9국01-09] 갈등 조정하며 말하기), 문학([9국05-05])을, 기말고사는 문법([9국04-05] 피동·인용 표현), 쓰기([9국03-07]·[9국03-08]), 매체([9국06-05] 광고·홍보물 분석)를 다룹니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차고사 35%씩 · 10월 외심·내심 작도 활동지 15% · 11월 피타고라스 정리 활동지 15%",
    intro:
      "10월과 11월에 하나씩 있는 2학년 수학 활동지는 모두 손으로 작도하거나 도형을 나눠 채우는 과제입니다. 상담에서는 수직이등분선과 각의 이등분선 작도가 익숙한지, 그리고 경우의 수·확률까지 들어가는 12월 2차고사 범위를 함께 점검합니다.",
    assessments: [
      { name: "1차고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "2차고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 28점·서술형 72점" },
      {
        name: "활동지1",
        kind: "task",
        weight: 15,
        timing: "10월",
        method: "개별평가 · 삼각형의 외심과 내심을 작도하기([9수03-10])",
      },
      { name: "활동지2", kind: "task", weight: 15, timing: "11월", method: "개별평가 · 피타고라스 정리([9수03-15])" },
    ],
    notes: [
      {
        title: "외심·내심 활동지는 해결 항목 배점이 큽니다",
        body: "활동지1은 선분의 수직이등분선 작도 20점, 외심 관련 활동 해결 30점, 각의 이등분선 작도 20점, 내심 관련 활동 해결 30점입니다. 작도 자체보다 외심·내심을 이용한 활동 해결에 더 큰 배점이 놓여 있어, 작도한 점을 외심과 내심의 성질에 연결해 보는 과정이 점수와 직결됩니다.",
      },
      {
        title: "피타고라스 활동은 도형 분할",
        body: "활동지2는 피타고라스 정리를 정확히 아는지, 도형을 이용해 정리를 설명하는지, 다양한 분할 방법을 썼는지, 나눈 조각을 모두 사용해 빈틈없이 채워 넣었는지를 25점씩 봅니다. 성취기준 [9수03-15]가 정리를 '이해하고 정당화'하는 것이어서, 공식 대입보다 조각을 옮겨 설명하는 활동이 중심입니다.",
      },
      {
        title: "2차고사에는 경우의 수와 확률까지",
        body: "반영 비율 표에서 1차고사 성취기준은 이등변삼각형, 외심과 내심, 사각형의 성질([9수03-09]~[9수03-11])이고, 2차고사는 닮음과 평행선 사이 선분의 길이의 비, 피타고라스 정리([9수03-12]~[9수03-15])에 경우의 수와 확률([9수04-05]·[9수04-06])이 더해집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차고사 35%씩(서술형 75점) · 영어듣기평가 20% · 리플렛 프로젝트 10%",
    intro:
      "수행평가 30% 가운데 20%가 시·도 교육청 계획에 따른 영어듣기평가이고, 나머지 10%가 학기 중 리플렛 프로젝트입니다. 2학년 영어 1·2차고사는 모두 100점 중 75점이 서술형이어서, 상담에서는 문장을 직접 써 내는 답안 연습에 얼마나 시간을 둘지부터 정합니다.",
    assessments: [
      { name: "1차고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 25점·서술형 75점" },
      { name: "2차고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 25점·서술형 75점" },
      {
        name: "영어듣기평가",
        kind: "task",
        weight: 20,
        timing: "시,도 교육청 계획(9월)",
        method: "개별평가 · 20문제, 문항당 5점",
      },
      { name: "프로젝트", kind: "task", weight: 10, timing: "학기중", method: "개별·조별평가 · 캔바로 리플렛 제작" },
    ],
    notes: [
      {
        title: "듣기평가는 이해 영역 전체가 범위",
        body: "영어듣기평가는 [9영01-01]~[9영01-10] 이해 영역 성취기준 전체를 범위로 20문제를 문항당 5점으로 채점합니다. 연음이나 축약된 소리 식별부터 세부 정보·중심 내용 파악, 화자의 의도와 함축적 의미 추론까지 성취기준에 들어 있어, 정기시험과 따로 듣기 연습 시간을 확보해 두는 편이 계획과 맞습니다.",
      },
      {
        title: "리플렛 점수의 다섯 갈래",
        body: "프로젝트는 구성 요소의 체계성(맡은 주제를 5문장 이상으로 구성), 문법의 정확성, 시각 자료의 활용, 에듀테크 도구(캔바) 활용 능력을 개별로 20점씩 보고, 6가지 세부 주제로 만든 리플렛의 완성도와 일관성 20점은 조별로 매깁니다. 다섯 항목 중 하나만 조원 공동 점수입니다.",
      },
      {
        title: "회차별 성취기준 차이",
        body: "1차고사 성취기준에는 경험이나 계획 설명([9영02-04])과 상황·목적에 맞게 말하거나 쓰기([9영02-10])가, 2차고사에는 일이나 사건의 논리적 관계 설명([9영02-05])과 정보 윤리를 지키며 매체 활용하기([9영02-09])가 들어 있습니다. 세부 정보·중심 내용 파악과 의견 주장은 두 회차에 공통입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "1·2차시험 35%씩(서술형 72점) · 역사 인물 탐구보고서 2회 15%씩(9~12월 중)",
    intro:
      "창신중 2학년의 사회과 평가는 역사 과목이며, 수행평가는 9~12월 중 두 번의 탐구보고서(각 15%)로 둘 다 역사 인물 탐구 형식입니다. 상담에서는 첫 보고서의 지역 세계 교류 단원과 둘째 보고서의 제국주의 단원에서 다룰 인물을 미리 나눠 봅니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "2차시험", kind: "exam", weight: 35, timing: "12월", method: "선택형 28점·서술형 72점" },
      {
        name: "탐구보고서1",
        kind: "task",
        weight: 15,
        timing: "9~12월 중",
        method: "개별평가 · 역사 인물 탐구([9역04-01]~[9역04-03])",
      },
      {
        name: "탐구보고서2",
        kind: "task",
        weight: 15,
        timing: "9~12월 중",
        method: "개별평가 · 역사 인물 탐구([9역05-01]~[9역05-03])",
      },
    ],
    notes: [
      {
        title: "두 보고서의 단원 범위",
        body: "탐구보고서1은 지역 세계의 교류와 변화(송·몽골 제국 시기 교역권, 명·청·에도 막부·무굴 제국, 오스만 제국과 유럽의 근대적 변화)를, 탐구보고서2는 제국주의와 국민 국가 건설 운동(시민 혁명, 서양의 산업화와 제국주의, 아시아의 대응과 국민 국가 건설 노력)을 성취기준 범위로 삼습니다.",
      },
      {
        title: "채점은 주제 적합성과 분량",
        body: "두 보고서 모두 '주제에 맞는 내용 및 분량'을 기준으로 네 항목(20·20·30·30점)을 매기며, 가장 낮은 단계에도 10점이 배정되어 있고 미응시는 0점입니다. 고른 인물이 해당 단원 성취기준의 사건과 어떻게 이어지는지를 정해진 분량 안에 담는 것이 기준과 맞닿습니다.",
      },
      {
        title: "2차시험에는 세계 대전 단원까지",
        body: "반영 비율 표에서 1차시험은 [9역04-01]~[9역05-01], 2차시험은 [9역05-02]~[9역06-03]을 다룹니다. 2차시험에는 산업화와 제국주의, 아시아의 대응에 더해 세계 대전과 사회 변동 단원이 들어가며, 회차마다 100점 중 72점이 서술형입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "changsin-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "중간·기말 35%씩(서술 72점) · 9월 통일신문 만들기 15% · 11월 토론하기 15%",
    intro:
      "9월 21~23일 통일신문 만들기와 11월 9~13일 토론하기가 3학년 국어 수행평가 30%를 이룹니다. 토론 주간이 11월 기말고사와 같은 달이라, 상담에서는 입론 원고를 언제 완성할지와 기말 서술형 72점 대비를 어떻게 나눌지부터 이야기합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "기말고사", kind: "exam", weight: 35, timing: "11월", method: "선택형 28점·서술형 72점" },
      {
        name: "통일신문 만들기",
        kind: "task",
        weight: 15,
        timing: "9월",
        method: "문법 영역 · 아이북·태블릿으로 워드 작성 후 구글 클래스 업로드",
      },
      {
        name: "토론하기",
        kind: "task",
        weight: 15,
        timing: "11월",
        method: "듣기·말하기 영역 · 워드로 입론 작성 후 토론 진행",
      },
    ],
    notes: [
      {
        title: "통일신문은 북한어 사용 개수가 기준",
        body: "통일신문 만들기는 경기 상황에 맞는 북한 단어 5개 이상과 북한 특유의 문장 3개 이상을 정확히 쓰는지, 남북 단일팀의 화합과 통일의 가치를 전달하는지, 표제·부제·본문·기자명 등 기사 양식과 보도체 문장을 갖췄는지, 지정 분량과 맞춤법·띄어쓰기를 지켰는지를 25점씩 봅니다.",
      },
      {
        title: "토론은 입론부터 반론, 전달까지",
        body: "토론하기는 워드로 입론을 작성해 올린 뒤 그 입론을 바탕으로 토론을 진행하며, 주장 설정과 입론의 논리적 구성, 통계·사례·전문가 의견 같은 객관적 근거, 상대측 허점과 논리적 오류를 짚는 반론과 질문, 성량·속도·발음·시선 처리를 25점씩 평가합니다. 반론 항목이 있어 상대 입장의 논거도 미리 검토해 두어야 합니다.",
      },
      {
        title: "성취기준에 실린 단원 주제",
        body: "평가기준표에는 토론에서 타당한 근거로 논박하기([9국01-05]), 동일한 화제를 다룬 글의 관점 비교([9국02-06]), 관찰·조사·실험 글쓰기([9국03-03])와 쓰기 윤리([9국03-10]), 문장의 짜임([9국04-06])과 통일 시대의 국어([9국04-09]), 근거에 따른 작품 해석 비교([9국05-07]) 등이 실려 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차시험 35%씩(서술형 72점) · 9월 삼각비 활동지 15% · 10월 원의 성질 활동지 15%",
    intro:
      "3학년 수학 활동지는 9월 삼각비와 10월 원의 성질 단원에서 15%씩 반영됩니다. 클리노미터를 만들어 각을 재고 높이를 계산하는 과제가 먼저 오므로, 상담에서는 삼각비의 값을 구하고 이를 길이 계산에 쓰는 과정부터 확인합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점" },
      { name: "2차시험", kind: "exam", weight: 35, method: "선택형 28점·서술형 72점" },
      {
        name: "활동지1",
        kind: "task",
        weight: 15,
        timing: "9월",
        method: "개별평가 · 삼각비(클리노미터 제작, 각 측정, 높이 계산)",
      },
      {
        name: "활동지2",
        kind: "task",
        weight: 15,
        timing: "10월",
        method: "개별평가 · 원의 성질(두 현과 수직이등분선을 작도해 원 작도)",
      },
    ],
    notes: [
      {
        title: "클리노미터 활동은 측정과 계산",
        body: "삼각비 활동지는 클리노미터 제작, 각의 정확한 측정, 높이의 정확한 계산, 성실한 참여를 25점씩 봅니다. 평가기준표에서 [9수04-18]의 상 단계는 '삼각비를 활용하여 다양한 실생활 문제를 해결'하는 것으로, 측정한 각으로 실제 높이를 구하는 이 활동과 같은 방향입니다.",
      },
      {
        title: "원의 성질 활동은 작도 세 단계",
        body: "원의 성질 활동지는 두 현을 정확하게 작도했는지, 두 수직이등분선을 정확하게 작도했는지, 원을 정확하게 작도했는지와 활동 참여도를 25점씩 평가합니다. 평가기준표에서 같은 단원은 원의 현과 접선에 관한 성질([9수04-19])과 원주각의 성질([9수04-20])로 이루어져 있습니다.",
      },
      {
        title: "확률과 통계 영역도 평가기준에 있습니다",
        body: "평가기준표에는 기하 영역(삼각비, 원의 성질)과 함께 확률과 통계 영역의 대푯값과 산포도([9수05-06]·[9수05-07]: 중앙값·최빈값·평균, 분산과 표준편차), 상관관계([9수05-08]: 산점도)가 실려 있습니다. 두 활동지는 모두 기하 영역에서 나옵니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차시험 35%씩(서논술형 75점) · 듣기 20% · 속담활용 조언하기 활동지 10%",
    intro:
      "3학년 영어는 9월~10월 1차시험과 11월 2차시험이 각각 100점 중 75점을 서논술형으로 채웁니다. 수행평가는 듣기 20%와 속담을 활용해 조언하는 활동지 10%로, 상담에서는 상황에 맞는 속담을 고르고 자연스러운 조언 문장으로 잇는 연습부터 봅니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 35, timing: "9월~10월", method: "선택형 25점·서논술형 75점" },
      { name: "2차시험", kind: "exam", weight: 35, timing: "11월", method: "선택형 25점·서논술형 75점" },
      { name: "듣기", kind: "task", weight: 20, timing: "시,도 교육청 계획", method: "개별 평가 · 20문제, 문항당 5점" },
      {
        name: "활동지",
        kind: "task",
        weight: 10,
        timing: "학기중",
        method: "개별 평가 · 속담활용 조언하기 활동지 과업수행",
      },
    ],
    notes: [
      {
        title: "속담 활동지는 매칭·조언·언어·분량",
        body: "속담활용 조언하기 활동지는 상황과 속담 매칭의 정확도(내용의 적절성), 조언의 자연스러움과 맥락 부합도(의미 전달 및 논리성), 어법·철자·구두점(언어의 정확성), 제시된 분량과 작성 조건 충족(과제 완수도)을 25점씩 봅니다. 속담 뜻을 아는 것은 네 항목 가운데 첫 항목에 해당합니다.",
      },
      {
        title: "듣기는 한 번에 20%",
        body: "듣기 평가는 '영어 의사 소통 능력'을 평가기준으로 20문제, 문항당 5점이며 시기는 시·도 교육청 계획을 따릅니다. 반영 비율 20%로 활동지(10%)보다 큰 비중이라, 정기시험 대비와 별도로 듣기 문항 형식에 익숙해지는 시간을 학기 초에 잡아 두는 편이 일정과 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  {
    schoolSlug: "changsin-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회 지필 2회 35%씩·수행 3개 10%씩 / 역사 1·2차시험 35%씩·탐구보고서 2개 15%씩",
    intro:
      "3학년은 사회와 역사를 함께 배우며, 두 과목 모두 정기시험 2회가 35%씩이고 회차마다 서술·논술 문항이 72점입니다. 수행평가는 사회가 9월부터 11월까지 세 과제(각 10%), 역사가 인물 탐구보고서 두 번(각 15%)이라 상담에서는 과목별 제출 시기를 겹치지 않게 정리하는 일부터 합니다.",
    assessments: [
      { name: "1회 지필평가", kind: "exam", weight: 35, timing: "9월~10월", method: "선택형 28점·서·논술형 72점", course: "사회" },
      { name: "2회 지필평가", kind: "exam", weight: 35, timing: "10월~11월", method: "선택형 28점·서·논술형 72점", course: "사회" },
      { name: "국제 분쟁 특파원 기사", kind: "task", weight: 10, timing: "9월", method: "논술형 평가", course: "사회" },
      { name: "도시 공간 분석", kind: "task", weight: 10, timing: "10월", method: "포트폴리오", course: "사회" },
      {
        name: "지역 브랜딩",
        kind: "task",
        weight: 10,
        timing: "10월~11월",
        method: "지리적 표시제 사례 조사·캐릭터 디자인·홍보 설명서 작성",
        course: "사회",
      },
      { name: "1차시험", kind: "exam", weight: 35, timing: "9,10월", method: "선택형 28점·서술형 72점", course: "역사" },
      { name: "2차시험", kind: "exam", weight: 35, timing: "11월", method: "선택형 28점·서술형 72점", course: "역사" },
      { name: "탐구보고서1", kind: "task", weight: 15, timing: "9~11월 중", method: "개별평가 · 역사 인물 탐구", course: "역사" },
      { name: "탐구보고서2", kind: "task", weight: 15, timing: "9~11월 중", method: "개별평가 · 역사 인물 탐구", course: "역사" },
    ],
    notes: [
      {
        title: "사회: 분쟁 기사는 충족 항목 개수로 채점",
        body: "국제 분쟁 특파원 기사([9사(일사)11-01]·[9사(일사)11-02])는 분쟁 사례 조사 30점, 갈등 원인 분석과 해결 방안 제시 30점, 기사 작성 40점입니다. 기사 작성은 갈등 원인, 행위 주체의 활동, 공존과 평화적 해결 노력, 헤드라인·리드문·본문 양식, 객관적 전달력 가운데 몇 개를 만족하는지로 40점부터 10점까지 매깁니다.",
      },
      {
        title: "사회: 도시 분석과 지역 브랜딩",
        body: "도시 공간 분석은 도시 위치와 특성 30점, 지가와 접근성에 따른 도시 내부 구조를 실제 사례에 적용하기 30점, 차시별 활동지 제출과 자기 성찰 기록을 포함한 포트폴리오 40점입니다. 지역 브랜딩([9사(지리)11-02])은 지리적 표시제 사례 조사 30점, 지역 특색을 살린 캐릭터 디자인 40점, 캐릭터를 활용한 홍보 설명서 30점입니다.",
      },
      {
        title: "역사: 조선부터 근・현대까지",
        body: "역사 평가기준표는 조선의 성립과 발전, 조선 사회의 변동, 근・현대 사회의 전개 단원(사림 세력, 왜란과 호란, 조선 후기 정치 운영과 사회 변화, 대한민국 정부 수립, 민주주의 발전, 통일을 위한 노력 등)을 담고 있습니다. 두 탐구보고서는 모두 '역사 인물 탐구'로, '주제에 맞는 내용 및 분량'을 20·20·30·30점으로 매깁니다.",
      },
    ],
    sources: [schoolInfoPlanSource("창신중학교")],
  },
  // ───────── 1학년 ─────────
  {
    schoolSlug: "yeongseo-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "정기시험 1회 40%(2회고사, 서·논술 6점) · 수행 2개 60%(문학적인 글쓰기·주장하는 글쓰기)",
    intro:
      "영서고등학교 1학년 공통국어2는 12월 2회고사 한 번이 40%이고, 나머지 60%는 문학적인 글쓰기와 주장하는 글쓰기 두 편이 30%씩 채웁니다. 상담에서는 8~9월과 10월 1~3주에 놓인 두 글쓰기 일정부터 확인합니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 94점·논‧서술형 6점" },
      { name: "문학적인 글쓰기", kind: "task", weight: 30, timing: "8~9월", method: "논‧서술형" },
      { name: "주장하는 글쓰기", kind: "task", weight: 30, timing: "10월 1주~3주", method: "논‧서술형" },
    ],
    notes: [
      {
        title: "논·서술형 비중은 대부분 수행평가에서 나옵니다",
        body: "반영 비율 표의 논‧서술형 합계는 62.4%이고, 그중 2회고사 서·논술 6점이 차지하는 몫은 2.4%뿐이며 나머지 60%는 두 글쓰기 과제입니다. 정기시험은 94점이 선택형이어서, 글로 답하는 연습은 시험 기간보다 8월~10월 과제 기간에 맞춰 두는 편이 계획서 구조와 맞습니다.",
      },
      {
        title: "문학적인 글쓰기의 채점 요소",
        body: "자기 경험을 문학적 형상화 방법으로 표현하는 글로, 문학적 형상화 40점(비유·상징·수사법을 쓴 문장 표현, 3개 이상 문단 구성), 내용 선정 및 주제 의식 40점, 분량 20점으로 나뉩니다. 계획서는 AI로 생성한 내용을 서술하면 0점으로 처리한다고 적고 있습니다.",
      },
      {
        title: "주장하는 글쓰기와 시험 범위",
        body: "주장하는 글쓰기는 특정 주제의 영상이나 글을 감상한 뒤 자기 의견을 논리적으로 쓰는 과제로, 비평 40점·표현 40점·분량 20점으로 채점합니다. 성취기준은 10월 진도인 매체 자료 평가하며 읽기, 주제 통합적 읽기와 겹칩니다. 2회고사는 [10공국2-01-01]~[10공국2-06-02] 전체가 범위이고, 11~12월에는 맞춤법·국어의 변천과 협상 단원이 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "정기시험 1회 40%(논·서술 10점) · 수행 2개 60%(포트폴리오·수학 용어•개념의 뜻 작성하기)",
    intro:
      "1학년 공통수학2는 12월 2회고사(선택형 90점·논‧서술형 10점)가 40%이고, 포트폴리오와 수학 용어•개념의 뜻 작성하기가 각각 30%입니다. 영서고 수학 상담은 도형의 방정식부터 유리·무리함수까지 이어지는 한 학기 범위를 시험 한 번에 맞춰 어떻게 나눠 복습할지부터 정합니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 90점(36%)·논‧서술형 10점(4%)" },
      { name: "포트폴리오", kind: "task", weight: 30, timing: "12월" },
      { name: "수학 용어•개념의 뜻 작성하기", kind: "task", weight: 30, timing: "학기 중 (1회)", method: "서·논술형" },
    ],
    notes: [
      {
        title: "용어·개념 평가는 9개 항목을 씁니다",
        body: "각 학급마다 수학 용어·개념 9개를 정해 교과서에서 찾은 뜻을 평가지에 작성하고, 항목당 10점씩 90점에 느낀점 10점을 더해 100점으로 매깁니다. 정확한 용어를 쓰고 조건을 빠뜨리지 않아야 항목 만점이므로, 정의를 수학 기호로 정확히 적어 보는 연습이 이 영역과 바로 이어집니다.",
      },
      {
        title: "포트폴리오는 풀이과정 서술 비율로 채점합니다",
        body: "포트폴리오 채점표는 풀이과정 서술 비율이 90% 이상이면 100점이고, 비율 구간이 한 단계 내려갈 때마다 10점씩 낮아집니다. 정기시험 전까지의 학습범위에서 수업 중 실시하며 단계별 논리적 과정 투입을 중점으로 지도한다고 적혀 있어, 답보다 풀이 단계를 남기는 습관이 점수와 직결됩니다.",
      },
      {
        title: "2회고사 하나가 학기 전 범위를 다룹니다",
        body: "정기시험 성취기준은 [10공수2-01-01]~[10공수2-03-05]입니다. 진도표상 8~9월 평면좌표·직선의 방정식·원의 방정식·도형의 이동, 9~10월 집합과 명제(절대부등식 포함), 11~12월 함수·합성함수·역함수와 유리·무리함수 순으로 진행되고, 12월에 단원 총정리가 잡혀 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "정기시험 1회 40%(선택형 96점) · 수행 2개 60%(말하기 평가·쓰기평가)",
    intro:
      "공통영어2는 12월 2회고사가 40%(선택형 96점·논‧서술형 4점)이고, 말하기 평가와 쓰기평가(배움기록, 생각성장 활동지 작성)가 30%씩입니다. 영서고 1학년 영어 상담은 11월 한 달에 걸친 말하기 평가 준비와 교과서 세 단원의 본문 정리를 함께 계획합니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 96점(38.4%)·논‧서술형 4점(1.6%)" },
      { name: "말하기 평가", kind: "task", weight: 30, timing: "11월 1주~ 11월 5주" },
      { name: "쓰기평가 (배움기록, 생각성장 활동지 작성)", kind: "task", weight: 30, timing: "수시", method: "논‧서술형" },
    ],
    notes: [
      {
        title: "말하기 평가는 배운 문장을 활용합니다",
        body: "수업 시간에 배운 주요 문장을 바르게 활용해 말하는 평가로, 유창성 30점, 내용성 50점, 발표태도 20점으로 나뉩니다. 내용성은 계획한 문장을 8개 이상 말하면 만점이고 개수가 줄수록 단계적으로 낮아지므로, 말할 문장을 미리 정해 발음까지 연습해 두는 것이 채점 기준과 맞닿아 있습니다.",
      },
      {
        title: "쓰기평가는 학습일지 제출 비율로 매깁니다",
        body: "쓰기평가는 수업 내용을 요약한 학습일지를 수시로 작성하는 영역입니다. 단원별 핵심 주제와 문법적 특징을 정리하고 어휘 쓰임을 점검하는 활동이 들어가며, 학습일지를 90% 이상 제출하면 100점이고 제출 비율이 낮아질수록 점수가 내려갑니다. 학기 논‧서술형 31.6% 가운데 30%가 이 영역입니다.",
      },
      {
        title: "시험까지 다루는 교과서 단원",
        body: "진도표는 8~9월 Lesson 1 Shall We Dance?, 10~11월 Lesson 2 The Wonders of Korea, 12월 Lesson 3 Towards a Greener Tomorrow 순입니다. 단원마다 Visualizing What You Read, Compare and Contrast 같은 읽기 전략과 본문 어휘·문법을 다루며, 2회고사 성취기준은 [10공영2-01-01]~[10공영2-01-08]입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2"],
    summary: "정기시험 1회 40%(논·서술 20점) · 수행 2개 60%(사형제도 주장 글·인권과 선거권 고찰)",
    intro:
      "영서고등학교 1학년 통합사회2는 12월 2회고사 40% 가운데 20점이 논‧서술형이고, 수행평가는 인권과 선거권의 확대에 관한 고찰(9월)과 사형제도에 관한 나의 주장(10월)이 30%씩입니다. 상담은 두 글쓰기 과제가 이어지는 9~10월 일정부터 맞춥니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 80점(32%)·논‧서술형 20점(8%)" },
      { name: "사형제도에 관한 나의 주장", kind: "task", weight: 30, timing: "10월", method: "수행평가지 작성·한 편의 글 완성" },
      { name: "인권과 선거권의 확대에 관한 고찰", kind: "task", weight: 30, timing: "9월", method: "수행평가지 작성·보고서 완성" },
    ],
    notes: [
      {
        title: "사형제도 글은 논거 수가 배점을 가릅니다",
        body: "사형제도에 관한 나의 주장은 칸트와 베카리아의 형벌관 정리 20점, 해외 사례 조사 20점, 자기 주장 논증 30점, 상대 주장 검토 20점, 형식성 10점으로 채점합니다. 논거가 3가지 이상이면 30점, 1~2가지면 12점이라 차이가 큽니다. 진도표에서는 9~10월 정의 단원에서 형벌 정의와 자유주의·공동체주의 정의관을 다룹니다.",
      },
      {
        title: "인권·선거권 보고서는 시대 순 정리가 중심입니다",
        body: "9월 과제는 인권과 선거권의 확대 과정을 시간 흐름에 따라 정리하고, 미래 사회의 새로운 기본권과 참정권 확대 방향에 대한 자기 견해를 제시하는 보고서입니다. 인권 확대 과정 정리와 선거권 확대 과정 정리가 각각 40점이며, 8월 진도인 시민혁명과 인권의 발전, 헌법과 기본권 내용이 바탕이 됩니다.",
      },
      {
        title: "AI 활용 규칙과 시험 범위",
        body: "두 과제 모두 인공지능 보조는 허용하되 사용 여부와 출처를 밝혀야 하고, 생성형 인공지능의 표현 전체를 인용하면 10점을 감점한다고 적혀 있습니다. 2회고사 범위는 [10통사2-01-01]~[10통사2-05-03]으로, 11~12월 진도인 국제 무역·세계화·평화·인구와 에너지 단원까지 포함합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "정기시험 1회 40%(논·서술 10점) · 수행 2개 60%(과학 잡지 제작·멸종 위기 동물 이모티콘)",
    intro:
      "1학년 통합과학2는 12월 2회고사 40%와 수행평가 60%로 나뉘며, 수행은 9월 멸종 위기 동물 이모티콘 제작과 11월 과학 잡지 제작이 30%씩입니다. 영서고 과학 상담은 과학 잡지가 1·2단원 성취기준 11개에 걸쳐 있다는 점을 시험 대비와 함께 놓고 봅니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 90점·논‧서술형 10점" },
      { name: "과학 잡지 제작", kind: "task", weight: 30, timing: "11월", method: "논‧서술형" },
      { name: "멸종 위기 동물 이모티콘 제작", kind: "task", weight: 30, timing: "9월" },
    ],
    notes: [
      {
        title: "과학 잡지는 자료의 정확성에 배점이 큽니다",
        body: "과학 잡지 제작은 자료 조사 및 내용 작성 80점(주제 부합과 자료 다양성 40점, 과학적 타당성과 정확성 40점)과 논리적·창의적 구성 20점으로 채점합니다. 과학적 오류가 1~2개면 35점, 많으면 30점이어서 잡지에 넣을 근거 자료를 교과 개념과 대조해 확인하는 과정이 필요합니다. 계획서에는 AI를 자유롭게 활용한다고 적혀 있습니다.",
      },
      {
        title: "이모티콘 과제는 생물다양성 단원과 이어집니다",
        body: "9월 이모티콘 제작의 성취기준은 [10통과2-01-02] 하나로, 8월에 배우는 진화와 생물다양성 단원과 연결됩니다. 멸종 위기 동물 3종류 이상의 특징을 조사하면 자료 다양성 30점 만점이고, 조사 내용의 구체성과 분량 30점, 동물 특징과 전달하려는 감정을 드러낸 이모티콘 구성 40점이 더해집니다.",
      },
      {
        title: "2회고사는 세 단원을 모두 다룹니다",
        body: "정기시험 성취기준은 [10통과2-01-01]~[10통과2-03-04]입니다. 진도표상 변화와 다양성(진화, 산화·환원과 중화), 환경과 에너지(생태계, 지구 온난화·엘니뇨·사막화, 발전과 신재생 에너지), 과학과 미래 사회(감염병 진단, 빅데이터, 과학 윤리)가 차례로 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },

  // ───────── 2학년 ─────────
  {
    schoolSlug: "yeongseo-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["문학과 영상"],
    summary: "정기시험 1회 40%(논·서술 30점) · 수행 2개 60%(영화 비평문 쓰기·영화 소개하기)",
    intro:
      "영서고등학교 2학년 문학과 영상은 12월 2회고사 40% 중 30점이 논‧서술형이어서 학기 논‧서술형 반영이 72%입니다. 수행은 9월 영화 비평문 쓰기와 10월~11월 초 영화 소개하기가 30%씩이라, 상담은 두 과제에서 다룰 작품과 근거를 먼저 정리하는 데서 시작합니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 70점·논‧서술형 30점", course: "문학과 영상" },
      { name: "영화 비평문 쓰기", kind: "task", weight: 30, timing: "9월 1~4주", method: "논‧서술형", course: "문학과 영상" },
      { name: "영화 소개하기", kind: "task", weight: 30, timing: "10월 1주~11월 1주", method: "소개하는 말하기 또는 글쓰기", course: "문학과 영상" },
    ],
    notes: [
      {
        title: "비평문은 원작 소설과 영화를 함께 봅니다",
        body: "영화 비평문 쓰기는 문학을 원작으로 한 영화와 원작 소설을 함께 감상한 뒤 자신의 견해를 담아 쓰는 과제입니다. 분량 기준 40점(7줄 이상 만점)과 논증 구성 60점으로 나뉘며, 논증 구성은 소재·주제 이해를 바탕으로 한 견해와 근거의 타당성을 봅니다. AI로 생성한 내용을 쓰면 0점입니다.",
      },
      {
        title: "영화 소개하기는 말과 글 중 하나로 합니다",
        body: "10월 1주부터 11월 1주까지 진행되는 영화 소개하기는 자신의 기준으로 고른 영화나 문학 작품을 말하기 또는 글쓰기로 소개합니다. 글은 7줄 이상, 말하기는 5개 이상의 내용 문단이면 분량 40점 만점이고, 내용·주제·인상적인 점을 논리적으로 설명하는지가 60점입니다.",
      },
      {
        title: "2회고사 범위와 진도",
        body: "정기시험 성취기준은 [12문영-01-01]~[12문영-01-10]으로 과목 전체입니다. 진도는 8월 형상화 방법과 영향 관계, 9월 매체별 해석·비평과 같은 소재 비교, 10~11월 창작 요소와 기법, 12월 문학·영상 관련 문화적 소양 탐구로 이어집니다. 시험에도 서‧논술 30점이 있어 비평문에서 연습한 근거 쓰기가 답안 작성과 연결됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["세계문화와 영어"],
    summary: "정기시험 1회 40%(선택형 90점) · 수행 2개 60%(수업 과정 활동지 40%·관광지 소개 글 20%)",
    intro:
      "2학년 세계문화와 영어는 12월 2회고사 40%에, 수시로 쌓는 수업 과정 활동지 작성하기 40%와 우리 관광지에 대해 소개하는 글쓰기 20%가 더해집니다. 영서고 세계문화와 영어 상담에서는 비중이 가장 큰 활동지 기록을 학기 내내 어떻게 이어 갈지부터 이야기합니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 90점·논‧서술형 10점", course: "세계문화와 영어" },
      { name: "수업 과정 활동지 작성하기", kind: "task", weight: 40, timing: "수시", method: "쓰기평가", course: "세계문화와 영어" },
      { name: "우리 관광지에 대해 소개하는 글쓰기", kind: "task", weight: 20, method: "쓰기평가", course: "세계문화와 영어" },
    ],
    notes: [
      {
        title: "활동지는 제출 비율이 곧 점수입니다",
        body: "수업 과정 활동지는 배운 내용을 요약한 학습일지로, 단원별 핵심 주제와 문법적 특징, 어휘 쓰임을 정리하는 영역입니다. 90% 이상 제출하면 100점이고 구간마다 점수가 내려가며, 10% 미만이면 40점입니다. 수행평가 60% 가운데 40%가 이 기록에 걸려 있어 학기 전체 활동을 빠짐없이 남기는 것이 중요합니다.",
      },
      {
        title: "관광지 소개 글의 다섯 채점 영역",
        body: "우리 관광지에 대해 소개하는 글쓰기는 준비도 및 성실성, 과제 완성, 내용, 구성, 언어 사용을 각 20점으로 봅니다. 초안 작성 같은 선행활동과 누가기록물로 준비도를 확인하고, 제시된 단어 수와 제시어 사용 비율, 문법·철자 정확성을 따집니다. 성취기준은 문화적 산물에 담긴 전제·관점·가치관을 추론하는 [12세영01-05]입니다.",
      },
      {
        title: "단원 흐름과 시험 범위",
        body: "진도표는 8월 Cross-Cultural Encounters, 9월 Flavors of the World, 10~11월 Language: Insights into Diversity, 12월~1월 Travel: In Search of the Unseen 순입니다. 2회고사 성취기준은 [12세영01-01]~[12세영01-10] 전체이며, 문화 정보의 핵심 파악, 보편성·특수성 비교, 요약과 재구성 활동이 단원마다 반복됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  {
    schoolSlug: "yeongseo-high-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["한국사2"],
    summary: "정기시험 1회 40%(논·서술 10점) · 수행 2개 60%(역사책 포트폴리오 40%·역사 연표 20%)",
    intro:
      "한국사2는 1회고사 없이 12월 2회고사 한 번(40%)과 나만의 역사책 포트폴리오 40%, 역사 연표 제작 20%로 성적을 냅니다. 영서고 2학년 한국사 상담은 8월 3주부터 12월 1주까지 이어지는 포트폴리오 확인 횟수를 먼저 챙깁니다.",
    assessments: [
      { name: "2회고사", kind: "exam", weight: 40, timing: "12월", method: "선택형 90점·논‧서술형 10점", course: "한국사2" },
      { name: "나만의 역사책 포트폴리오", kind: "task", weight: 40, timing: "8월 3주 ~12월 1주", method: "포트폴리오, 논·서술형", course: "한국사2" },
      { name: "역사 연표 제작", kind: "task", weight: 20, timing: "10월 1주~12월 1주", method: "논·서술형", course: "한국사2" },
    ],
    notes: [
      {
        title: "포트폴리오는 교사 확인 15회가 기준입니다",
        body: "나만의 역사책은 매 차시 활동지를 작성해 누적하는 포트폴리오로, 교사 확인을 15회 받으면 100점이고 한 번 모자랄 때마다 3점씩 내려갑니다. 각 포트폴리오에 논·서술형 문항이 들어 있어 이 영역의 논·서술형 비율은 8%로 정해져 있습니다. 차시마다 기한 안에 확인을 받는 흐름을 놓치지 않는 것이 이 영역의 핵심입니다.",
      },
      {
        title: "연표는 사건 개념과 순서를 따로 채점합니다",
        body: "역사 연표 제작은 역사적 사건의 주요 개념을 자신만의 역사 용어로 재해석한 설명 50점과, 사건을 순서에 따라 연표에 올바르게 쓴 개수 50점으로 나뉩니다. 두 항목 모두 10개 이상이면 만점이어서, 식민 통치기부터 민주화 과정까지 사건을 시대 순으로 정리해 두면 2회고사 준비와도 겹칩니다.",
      },
      {
        title: "범위는 식민 통치부터 6월 민주 항쟁까지",
        body: "정기시험과 두 수행평가가 같은 성취기준 묶음을 씁니다. 진도는 8~9월 식민 통치 정책과 경제 구조 변화, 민족 운동, 10월 독립 국가 건설 운동과 대한민국 정부 수립, 11~12월 6·25 전쟁과 분단 고착화, 4·19 혁명에서 6월 민주 항쟁에 이르는 민주화 과정입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("영서고등학교")],
  },
  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "bangok-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2회고사 35%씩(선택형 95점·논서술형 5점) · 9월 작품 감상 서·논술 30%",
    intro:
      "반곡중학교 2학년 국어는 1회고사와 2회고사가 35%씩 70%를 차지하고, 수행평가는 9월 작품 감상 서·논술 한 과제(30%)뿐입니다. 상담에서는 두 시험의 범위가 어떻게 나뉘는지와 9월 감상문 일정부터 맞춰 봅니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 35, timing: "9~10월", method: "선택형 95점·논서술형 5점" },
      { name: "2회고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 95점·논서술형 5점" },
      {
        name: "사회문화적 상황을 바탕으로 작품 감상하기",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "서·논술 평가",
      },
    ],
    notes: [
      {
        title: "두 시험의 범위가 단원별로 갈립니다",
        body: "1회고사 성취기준은 작품에 반영된 사회·문화적 상황 감상[9국05-05]과 복합양식 글·자료 평가하며 읽기[9국02-04]이고, 2회고사는 복합양식 자료를 활용한 글쓰기·고쳐 쓰기, 피동·인용 표현, 점검·조정하며 읽기입니다. 12월~1월의 공감하며 대화하기, 갈등 조정 대화, 매체 자료의 재현 단원은 진도표에 정기시험 표시가 없습니다.",
      },
      {
        title: "감상문은 시대 배경과 인물을 엮어야 합니다",
        body: "9월 수행평가는 사회·문화적 상황 파악, 작품 내용 및 인물 이해, 내용 조직 및 표현의 완성도를 30점씩 보고 분량에 10점을 둡니다. 채점 유의 사항에는 역사적 배경을 단순히 제시하는 것만으로 높은 점수를 주지 않고 작품 속 인물이나 사건과의 관련성을 본다고 적혀 있으며, 인물 이해 기준에 만도와 진수의 수난이 명시되어 있습니다.",
      },
      {
        title: "상투적 표현은 20점 단계에 머뭅니다",
        body: "표현 완성도 기준에서 '재미있었다', '슬펐다', '전쟁은 나쁘다' 같은 상투적·추상적 표현이 많고 근거가 부족하면 30점 중 20점 단계입니다. 분량은 적절한 글자 크기와 자간으로 20줄 이상이어야 10점이므로, 작품 속 장면을 근거로 든 문장을 20줄 넘게 써 보는 연습이 이 기준과 맞닿아 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2회고사 30%씩 · 11월 닮음·피타고라스·확률 문제해결 능력평가 40%(8문항)",
    intro:
      "2학년 수학의 수행평가 40%는 11월에 한 번 치르는 문제해결 능력평가이고, 범위가 12월 2회고사와 같은 닮음·피타고라스 정리·경우의 수와 확률입니다. 반곡중학교의 이 구성에서는 11월 평가 준비를 2회고사 공부의 앞부분으로 묶어 계획을 세웁니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 30, timing: "9월~10월", method: "선택형 95점·논서술형 5점" },
      { name: "2회고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 95점·논서술형 5점" },
      {
        name: "도형의 닮음과 피타고라스 정리, 경우의 수와 확률 문제해결 능력평가",
        kind: "task",
        weight: 40,
        timing: "11월",
        method: "단답형 30%·서술형 70%(단답형 3문항, 서술형 5문항)",
      },
    ],
    notes: [
      {
        title: "1회고사는 일차함수부터 사각형까지",
        body: "1회고사 성취기준은 일차함수와 연립일차방정식의 관계([9수02-17]~[9수02-18])와 이등변삼각형·외심과 내심·사각형의 성질([9수03-09]~[9수03-11])입니다. 진도표에는 합동 조건을 수학 기호로 서술하기, 평행사변형·마름모·직사각형·정사각형의 성질과 조건을 바르게 서술하는지 평가한다는 문구가 있어, 증명 과정을 글로 써 보는 연습이 범위와 맞습니다.",
      },
      {
        title: "서술 문항은 여섯 항목 완료 개수로 채점",
        body: "서술형 5문항(삼각형과 평행선, 삼각형의 무게중심, 피타고라스 정리, 확률의 성질, 확률의 계산)은 각 14점이며, 탐구하기, 개념·원리·법칙 연결하기, 해결 방법 제시, 정당화하기, 계산하기, 올바른 정답 6개 항목 중 몇 개를 완료했는지에 따라 2점씩 내려갑니다. 정답만 적고 과정을 비우면 완료 항목 수가 줄어드는 구조입니다.",
      },
      {
        title: "단답 3문항은 일부 해결에도 5점",
        body: "단답형은 도형의 닮음·삼각형의 닮음 조건, 경우의 수, 확률의 뜻 세 요소에서 1문항씩 10점이고, 모두 해결하면 10점, 일부 해결하면 5점입니다. 8문항 가운데 서술형이 70점을 차지하므로, 11월 전에는 닮음과 확률 단원 문제를 풀이 과정까지 적어 보는 시간을 따로 두는 것이 배점 구조와 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2회고사 35%씩(선택형 85점·논서술형 15점) · 원어민 대화 말하기 10% · 문장 쓰기 20%",
    intro:
      "정기시험 두 번이 70%를 차지하는 반곡중학교 2학년 영어에서 수행평가 30%는 11월 원어민 교사와의 대화 말하기(10%)와 10~11월 조건에 맞는 문장 쓰기(20%)로 나뉩니다. 첫 상담 때는 문장 쓰기에 들어가는 문법 목록을 먼저 확인합니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 35, timing: "9월~10월", method: "선택형 85점·논서술형 15점" },
      { name: "2회고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 85점·논서술형 15점" },
      {
        name: "영어 의사소통 기능 말하기",
        kind: "task",
        weight: 10,
        timing: "11월",
        method: "구술·발표 · 원어민 교사와 대화하기",
      },
      {
        name: "문법에 맞는 문장 쓰기",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "서술 · 조건에 맞는 문장 쓰기 20문항",
      },
    ],
    notes: [
      {
        title: "문장 쓰기에 나오는 문법 구문",
        body: "문장 쓰기 과제는 가주어 it·진주어 to부정사(구), 「The+비교급~, the+비교급~」, 수일치, 지각동사, 목적격 관계대명사, 접속사 구문을 활용해 조건에 맞는 문장을 쓰는 20문항(문항당 5점)입니다. 조건·문법·철자 오류가 하나 늘 때마다 1점씩 내려가고, 어순 오류가 있으면 그 문항은 0점입니다.",
      },
      {
        title: "말하기는 다섯 기준이 20점씩",
        body: "11월 말하기는 교과서 듣기·말하기 영역의 방법 묻기, 상기시키기, 빈도 묻고 답하기, 강조하기, 반복·설명 요청하기 구문으로 원어민 교사와 대화하는 과제입니다. 정확성, 발음, 유창성, 이해도, 태도 중심 의사소통 능력을 각각 Poor 5점부터 Excellent 20점까지 매기며 기본 점수는 없습니다.",
      },
      {
        title: "정기시험 서·논술형은 회차마다 15점",
        body: "평가 방침에 정기시험은 선택형 85%, 서술·논술형 15%로 실시한다고 되어 있어, 1회고사와 2회고사 모두 100점 중 15점(학기말 5.25%씩)이 서·논술형입니다. 진도표의 Lesson 5 Language Use 차시가 가주어 It·진주어 to부정사 문장 쓰기와 「The+비교급, the+비교급」 그림 묘사하기를 다루므로, 수행평가 준비가 시험 서술형 대비와 겹칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "1·2회고사 35%씩(선택형 90점·논서술형 10점) · 10~11월 세계사 여행 계획서 30%",
    intro:
      "2학기 2학년 사회과 수업은 역사로 진행되며, 반곡중학교는 1회고사·2회고사 35%씩과 10~11월 세계사 여행 계획서 30%로 평가합니다. 여행 계획서는 유적 세 곳의 건립 시기·왕조·용도까지 요구하므로, 이 조사 일정이 상담의 첫 확인 사항입니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 35, timing: "9-10월", method: "선택형 90점·논서술형 10점" },
      { name: "2회고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 90점·논서술형 10점" },
      { name: "세계사 여행 계획서 작성하기", kind: "task", weight: 30, timing: "10~11월", method: "서·논술" },
    ],
    notes: [
      {
        title: "시험 범위는 산업화 단원에서 겹칩니다",
        body: "1회고사 성취기준은 [9역04-03]~[9역05-02]로 오스만 제국과 유럽의 근대적 변화, 시민 혁명, 산업화와 제국주의까지이고, 2회고사는 [9역05-02]~[9역07-01]로 아시아의 대응, 두 차례 세계 대전, 냉전까지입니다. [9역05-02] 서양의 산업화와 제국주의 정책이 양쪽 범위에 모두 들어 있습니다.",
      },
      {
        title: "관광지 한 곳마다 다섯 요소",
        body: "여행 계획서의 중심은 역사적 관광지 세 곳(각 25점, 총 75점)으로, 구글 지도에서 식별 가능한 명칭과 위치, 연도 단위의 건립 시기, 건립 당시 국가(왕조), 용도, 특징의 다섯 요소 가운데 몇 개를 충족했는지로 채점합니다. 여행 국가 선정 이유 세 가지는 그 나라의 역사적 특성을 들어야 5점씩입니다.",
      },
      {
        title: "맛집 소개도 주소와 음식까지",
        body: "나머지 10점은 관광지에서 1시간 이내 거리의 식당을 정확한 주소와 음식과 함께 제시하는 맛집 소개 두 곳(각 5점)입니다. 수행평가 범위가 [9역04-03]~[9역06-01]로 1회고사 범위와 세계 대전 단원 앞부분에 걸쳐 있어, 시험 공부로 정리한 시대·유적 지식이 계획서 작성에도 쓰입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2회고사 35%씩(선택형 85점·논서술형 15점) · 10월 거울 및 렌즈 원리 탐구 30%",
    intro:
      "반곡중학교 2학년 과학의 수행평가는 10월 거울 및 렌즈 원리 탐구 하나(30%)이고, 그 100점 가운데 70점이 서·논술형입니다. 정기시험 비중이 70%로 큰 만큼, 수업 계획은 두 시험 범위와 함께 빛의 반사·굴절을 그림과 문장으로 설명하는 연습을 나란히 둡니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 35, timing: "9월-10월", method: "선택형 85점·논서술형 15점" },
      { name: "2회고사", kind: "exam", weight: 35, timing: "12월", method: "선택형 85점·논서술형 15점" },
      {
        name: "거울 및 렌즈 원리 탐구",
        kind: "task",
        weight: 30,
        timing: "10월",
        method: "실험 보고서 작성 및 관련 문제 해결(서·논술형 70점)",
      },
    ],
    notes: [
      {
        title: "두 시험 범위 밖에 있는 지권 단원",
        body: "1회고사는 빛과 파동([9과10-01]~[9과10-04])과 식물과 에너지([9과12-01]~[9과12-03]), 2회고사는 동물과 에너지([9과13-01]~[9과13-05])와 별과 우주([9과15-01]~[9과15-04])가 성취기준으로 적혀 있습니다. 12월~1월에 배우는 지권의 변화 단원은 두 시험의 성취기준 목록에 들어 있지 않습니다.",
      },
      {
        title: "결론 도출은 그림과 서술을 함께",
        body: "실험 보고서의 결론 도출(40점)은 빛의 반사·굴절을 그림을 포함해 서술하는 문항 네 개(각 5점)와, 볼록·오목 거울과 볼록·오목 렌즈에 의한 상의 차이를 실험 결과와 함께 설명하는 문항 두 개(각 10점)입니다. 반사·굴절 문항은 그림만 맞거나 서술만 맞으면 5점 중 3점으로 내려갑니다.",
      },
      {
        title: "생활 속 예시와 실험 태도도 배점",
        body: "적용(30점)은 생활 속 거울·렌즈 현상 서술 3개를 상·중·하(10·5·0점)로 매기며, 특징과 예시를 모두 써야 상입니다. 탐구 과정 10점은 안전·기능·탐구·정리 네 가지 만족 개수로 정하고, 다른 모둠원과 토의하거나 교과서를 참고하면 총점에서 1점씩 감점됩니다. 괄호·빈칸 20개를 채우는 탐구 결과도 20점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "bangok-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "11월 지필고사 40% · 9~10월 문장 성분·짜임 분석 30% · 10월 시 해석하기 30%",
    intro:
      "반곡중학교 3학년 국어는 정기시험이 11월 지필고사 한 번(40%)뿐이고, 9~10월 문장 성분·짜임 분석과 10월 시 해석하기가 30%씩입니다. 문법 수행평가와 지필고사가 같은 문장의 짜임 단원을 다루기 때문에, 9월부터 문장 분석을 꾸준히 해 두면 두 평가를 함께 대비할 수 있습니다.",
    assessments: [
      { name: "지필고사", kind: "exam", weight: 40, timing: "11월", method: "선택형 95점·논서술형 5점" },
      { name: "문장 성분과 문장의 짜임 분석", kind: "task", weight: 30, timing: "9~10월", method: "형성평가 · 문법" },
      { name: "시 해석하기", kind: "task", weight: 30, timing: "10월", method: "서·논술형 · 문학" },
    ],
    notes: [
      {
        title: "문장 분석은 맞힌 개수가 곧 점수",
        body: "문장 성분 분석은 정확히 분석한 성분 하나에 1점씩 최대 40점, 문장의 짜임 분석은 홑문장·겹문장과 이어진문장·안은문장·안긴문장을 구분해 맞힌 개수×2점으로 최대 60점(30개)입니다. 단계 구간 없이 개수로 바로 환산되므로 문장 하나하나를 끝까지 분석해 보는 연습이 배점 방식과 맞습니다.",
      },
      {
        title: "시 해석은 창작 의도 파악에 60점",
        body: "시 해석하기는 장면 파악(20점)과 화자의 상황 파악(20점)에 더해 상징적 소재의 의미(15점), 사회·문화적 배경과 창작 의도 파악(25점), 효용론적 관점의 해석(20점)을 봅니다. 화자의 상황과 정서·태도는 시 구절을 근거로 들어 구체적으로 써야 20점이고, 장면은 5개 이상 찾아야 만점입니다.",
      },
      {
        title: "진도표의 정기시험 표시는 논증 단원까지",
        body: "지필고사 성취기준은 문장의 짜임[9국04-06], 사회·문화적 배경으로 작품 이해[9국05-05], 근거에 따른 해석 비교[9국05-07], 논증 방법 파악하며 읽기[9국02-05]입니다. 11월 이후의 비교하며 읽기, 청중을 고려하여 말하기, 설득 전략 분석하며 듣기, 보고하는 글 쓰기는 진도표에 정기시험 표시가 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "11월 지필고사 40% · 9월 이차함수·삼각비 30% · 10월 원의 성질 30%(각 10문항)",
    intro:
      "3학년 수학은 9월과 10월에 사고력 평가가 30%씩, 11월 지필고사가 40%입니다. 반곡중학교 계획에서 이차함수 단원은 9월 수행평가에만 들어가고 지필고사 성취기준에서는 빠져 있어, 이차함수 식 구하기를 9월 전에 마무리하는 것이 준비의 출발점입니다.",
    assessments: [
      { name: "지필고사", kind: "exam", weight: 40, timing: "11월", method: "선택형 80점·논서술형 20점" },
      {
        name: "이차함수와 그래프, 삼각비 사고력 평가",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "서논술형 평가(단답형 40%·서술형 60%, 10문항)",
      },
      {
        name: "원의 성질 사고력 평가",
        kind: "task",
        weight: 30,
        timing: "10월",
        method: "서논술형 평가(단답형 40%·서술형 60%, 10문항)",
      },
    ],
    notes: [
      {
        title: "앞 4문항과 뒤 6문항의 채점이 다릅니다",
        body: "두 사고력 평가는 모두 평가 요소별 1문항씩 10문항이며 기본점수 24점이 있습니다. 앞쪽 네 문항은 상·중·하가 10·5·0점이고, 과정을 논리적으로 서술해야 하는 뒤쪽 여섯 문항은 10·7·4점입니다. 표에 적힌 단답형 40%, 서술형 60%의 구분이 이 배점과 그대로 맞물립니다.",
      },
      {
        title: "10월 원의 성질은 원주각까지",
        body: "원의 성질 평가는 현의 길이, 접선의 길이, 원주각과 중심각의 관계, 접선과 현이 이루는 각에 더해 원에 내접·외접하는 삼각형, 두 접선이 이루는 각, 원에 내접하는 사각형, 접선을 이용한 원주각 문항으로 구성됩니다. 같은 단원([9수04-19]~[9수04-20])이 11월 지필고사 범위에도 들어 있습니다.",
      },
      {
        title: "지필고사의 통계는 분산·표준편차까지",
        body: "지필고사 성취기준은 삼각비([9수04-17]~[9수04-18]), 원의 성질([9수04-19]~[9수04-20]), 대푯값과 분산·표준편차([9수05-06]~[9수05-07])입니다. 11월에 배우는 산점도와 상관관계([9수05-08])는 목록에 없고, 그 뒤로는 취약시기 운영으로 중학교 수학 개념 복습과 클리노미터·도미노 같은 활동 수업이 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "11월 지필고사 40% · 듣기 cloze test 30%(수시 3회) · 친환경 제품 홍보 글쓰기 30%",
    intro:
      "11월 지필고사 한 번(40%) 외에 반곡중학교 3학년 영어의 60%는 수시로 세 번 보는 듣기 cloze test와 9~10월 친환경 제품 홍보 글쓰기가 절반씩 나눕니다. 단원마다 돌아오는 듣기 빈칸을 놓치지 않도록 듣기 대화문 복습 주기를 정하는 일부터 시작합니다.",
    assessments: [
      { name: "지필고사", kind: "exam", weight: 40, timing: "11월", method: "선택형 80점·논서술형 20점" },
      {
        name: "대화문 및 설명문 듣기(cloze test)",
        kind: "task",
        weight: 30,
        timing: "수시",
        method: "형성평가 · 대화문 빈칸 채우기",
      },
      { name: "친환경 제품 홍보하는 글쓰기", kind: "task", weight: 30, timing: "9-10월", method: "서논술형 평가" },
    ],
    notes: [
      {
        title: "듣기는 빈칸 하나에 1점",
        body: "듣기 cloze test는 각 단원 듣기 영역의 대화문을 듣고 빈칸에 알맞은 어휘나 표현을 넣어 대화문을 완성하는 방식으로, 단원마다 33~34개씩 세 번에 걸쳐 빈칸 100개를 출제하고 1개당 1점을 줍니다. 기본 점수가 없으므로 교과서 듣기 대화문의 표현을 그대로 받아 적는 연습이 점수와 바로 이어집니다.",
      },
      {
        title: "홍보 글에 넣어야 할 두 구문",
        body: "친환경 제품 홍보 글쓰기의 표현 영역(20점)은 to부정사의 의미상 주어를 포함한 문장과 관계부사 when·where·why·how 중 하나를 포함한 문장을 각각 한 문장 이상 쓰는지를 봅니다. 두 구문은 진도표에서 5단원 Environmental Innovations의 Grammar 차시에 함께 다루는 내용입니다.",
      },
      {
        title: "내용·문장 길이·어법도 따로 채점",
        body: "내용(30점)은 제품 이름, 재료, 환경에 도움이 되는 방식 세 조건을 모두 담아야 만점이고, 문장(30점)은 관사를 빼고 7단어 이상인 문장이 5개 이상이어야 합니다. 철자·어법은 오류가 포함된 문장이 0~2개일 때 20점이며, 이 과제에도 기본 점수가 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사"],
    summary: "사회·역사 모두 11월 지필고사 40% · 수행 2개 30%씩(사회 9·10월, 역사 9월)",
    intro:
      "3학년은 사회와 역사를 함께 배우고, 반곡중학교는 두 과목 모두 11월 지필고사 40%에 수행평가 두 개를 30%씩 둡니다. 사회의 9월 자산 관리 계획과 역사의 9월 과제 두 개가 같은 달에 겹치므로 9월 과제 일정을 먼저 맞춥니다.",
    assessments: [
      { name: "정기시험", kind: "exam", weight: 40, timing: "11월", method: "선택형 80점·논서술형 20점", course: "사회" },
      { name: "자산 관리 계획 세우기", kind: "task", weight: 30, timing: "9월", method: "서·논술형", course: "사회" },
      { name: "시장 균형 변동 보고서", kind: "task", weight: 30, timing: "10월", method: "서술형", course: "사회" },
      { name: "1회고사", kind: "exam", weight: 40, timing: "11월", method: "선택형 90점·논서술형 10점", course: "역사" },
      { name: "정치 변화 보고서 작성하기", kind: "task", weight: 30, timing: "9월", method: "서술·논술, 포트폴리오", course: "역사" },
      { name: "역사인물 분석하기", kind: "task", weight: 30, timing: "9월", method: "서술·논술(50점×2회)", course: "역사" },
    ],
    notes: [
      {
        title: "사회 과제는 연령대 수와 분석 단계로 채점",
        body: "자산 관리 계획 세우기는 3개 연령대의 인생 목표, 필요 비용, 자금 마련 계획을 몇 개 연령대까지 채웠는지로 점수가 정해지고, 자산 관리 방법 3가지의 특징과 장단점(30점), 180자 이상의 결론 분석(20점)이 더해집니다. 10월 시장 균형 변동 보고서는 기사 속 변동 요인→곡선 이동→새 균형 가격·거래량의 3단계 분석이 30점입니다.",
      },
      {
        title: "사회 지필고사는 물가·실업 단원까지",
        body: "사회 지필고사 성취기준은 경제 체제·기업·금융 생활([9사(일사)08-01]~[9사(일사)08-03]), 시장과 가격([9사(일사)09-01]~[9사(일사)09-03]), 국내 총생산과 물가·실업([9사(일사)10-01]~[9사(일사)10-02])입니다. 11월의 국제 거래와 환율, 이어지는 다국적 기업과 환경 단원은 목록에 없습니다.",
      },
      {
        title: "역사는 무신 정권 보고서와 인물 MBTI 추론",
        body: "정치 변화 보고서는 고려 중기 정치 변화를 다루며 무신 정권 관련 사실 작성이 72점(오류 하나당 4점 감점), 무신들이 받았던 차별 두 가지를 쓰는 원인 분석이 20점입니다. 역사인물 분석하기는 고려 인물의 업적을 조사하고 MBTI 유형을 근거와 함께 추론하는 과제로 50점씩 2회 실시합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  {
    schoolSlug: "bangok-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "11월 지필고사 40% · 9월 세포 분열 관찰·비교 30% · 9월 역학적 에너지 탐구 30%",
    intro:
      "반곡중학교 3학년 과학은 수행평가 두 개(각 30%)가 모두 9월에 있고, 11월 지필고사가 40%입니다. 생식과 유전, 역학적 에너지 두 실험 보고서가 한 달 안에 이어지므로 8월 진도부터 두 단원을 나란히 정리해 두는 편이 일정상 맞습니다.",
    assessments: [
      { name: "지필고사", kind: "exam", weight: 40, timing: "11월", method: "선택형 80점·논서술형 20점" },
      {
        name: "체세포 분열 관찰 및 세포 분열의 비교",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "탐구실험 평가·보고서 평가·동료 평가(서·논술형 40%)",
      },
      {
        name: "역학적 에너지 전환과 보존 탐구 활동",
        kind: "task",
        weight: 30,
        timing: "9월",
        method: "탐구실험 평가·보고서 평가·동료 평가(서·논술형 70%)",
      },
    ],
    notes: [
      {
        title: "세포 분열은 모식도 개수로 채점",
        body: "세포 분열 과제는 현미경으로 체세포 분열 단계를 찾는 관찰 외에, 체세포 분열 모식도 5개와 생식 세포 분열 모식도 9개를 올바르게 그린 개수, 단계별 특징을 기술한 개수로 점수가 정해집니다. 마지막 비교 문항은 2가 염색체 형성 여부, 분열 횟수, 딸세포 수, 염색체 수 변화, 분열 결과를 서술합니다.",
      },
      {
        title: "역학적 에너지는 계산 과정과 단위",
        body: "역학적 에너지 과제는 쇠구슬 질량·높이와 속력 측정, O·A·B점의 위치·운동·역학적 에너지를 구하는 과정을 적는 실험 부분과, 자유 낙하 때의 에너지 관계 설명·에너지 계산·바닥 도달 속력 구하기의 문제 해결 부분으로 나뉩니다. 문제 해결 세 문항은 각 20점이고, 측정과 속력 문항 모두 단위 표기가 조건에 들어 있습니다.",
      },
      {
        title: "지필고사는 별 단원 첫 부분까지",
        body: "지필고사 성취기준은 [9과21-01]부터 [9과23-01]까지로, 생식과 유전, 에너지 전환과 보존, 별(연주시차, 별의 밝기와 표면 온도)이 들어갑니다. 10월 이후 배우는 은하와 우주, 우주 탐사, 12월부터의 과학 기술과 인류 문명 단원은 이 범위 밖입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("반곡중학교")],
  },
  // 29차 전북 전주 완산구 노송동(전주고·전주신일중) — 학교알리미 2026-2 평가계획
  {
    schoolSlug: "jeonju-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "정기시험 2회 각 25%(회차별 서·논술형 20점 이상) · 수행 2개 50%(독서 감상문 20%·공동 보고서 30%)",
    intro:
      "공통국어2(1~12반)는 정기시험 두 번이 합쳐 50%이고 수행평가가 나머지 50%를 차지합니다. 전주고등학교 1학년 국어 상담은 9~10월의 소설 독서 감상문과 11~12월의 공동 보고서 쓰기·발표 일정을 맞추는 데서 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 25, method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)" },
      { name: "2차 정기시험", kind: "exam", weight: 25, method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)" },
      { name: "질문 생성을 기반으로 한 주체적 소설 이해 및 독서 감상문 쓰기 활동", kind: "task", weight: 20, timing: "9~10월", method: "서술, 포트폴리오" },
      { name: "정보의 타당성·신뢰성 평가가 반영된 주제 통합적 공동 보고서 쓰기 및 발표 활동", kind: "task", weight: 30, timing: "11~12월", method: "서술, 발표, 포트폴리오" },
    ],
    notes: [
      {
        title: "소설 감상문은 질문 생성에서 출발합니다",
        body: "독서 감상문 과제(20%)는 소설을 읽고 필자의 관점·의도·표현 방법을 파악하는 질문과 답변을 만들어 동료와 나누고, 인물·사건·배경의 관계에 대한 이해를 자신의 진로와 경험에 연결해 감상문으로 쓰는 활동입니다. 20점 단일 항목으로 채점되며 진도표에서는 9월 1주 ‘노찬성과 에반’ 수업에 수행평가 표시가 붙어 있습니다.",
      },
      {
        title: "공동 보고서는 보고서 20점과 발표 10점",
        body: "공동 보고서 과제(30%)는 11~12월에 진행되며 자료의 타당성·신뢰성을 평가해 쓴 공동 보고서 20점과 복합양식 자료를 활용한 발표 10점으로 나뉩니다. 보고서는 신뢰할 수 있는 정보를 종합하고 출처를 제시하는지를, 발표는 청중의 관심과 요구에 맞춘 구성과 질문 답변을 봅니다. 진도표의 12월 1주 공동 보고서 수업에는 수행평가 표시가 있습니다.",
      },
      {
        title: "서·논술형은 회차마다 20점 이상",
        body: "정기시험은 선택형이 70점 이하이고 서답형이 30점 이상이며, 서답형 중 서·논술형은 20점 이상으로 적혀 있어 학기말 반영비율로는 회차마다 7.5% 이상 중 서·논술형이 5% 이상입니다. 수행평가 두 과제는 모두 서술이 평가 방법에 들어 있어 쓰기 평가가 시험과 수행 양쪽에 걸칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "시험 2회 60%(회차별 서·논술형 20점 이상) · 수행 3개 40%(관찰평가 2개·서술 1개)",
    intro:
      "수행평가 세 영역 중 두 영역이 수업 중 관찰평가인 점이 전주고등학교 1학년 공통수학2(1~11반)의 특징입니다. 정기시험 두 번이 60%, 수행평가가 40%이고 서술 과제는 20%뿐이라서, 상담에서는 시험 범위와 함께 수업 중 풀이를 말로 설명하는 연습부터 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 20점 이상)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 20점 이상)" },
      { name: "수업밀착형 평가", kind: "task", weight: 10, timing: "수시", method: "관찰평가" },
      { name: "수업과제 평가", kind: "task", weight: 10, timing: "수시", method: "관찰평가" },
      { name: "수학적 렌즈로 바라본 세상", kind: "task", weight: 20, timing: "8월-12월", method: "서술" },
    ],
    notes: [
      {
        title: "관찰평가 두 영역이 수행평가의 절반입니다",
        body: "수업밀착형 평가와 수업과제 평가는 각각 10%이고 평가방법이 관찰평가, 시기는 수시입니다. 수업밀착형 평가는 수업 참여도와 발표로 의사소통 능력 등을 보고, 수업과제 평가는 문제 풀이 과정을 발표하고 설명하는 모습을 보며, 둘을 합치면 수행평가 40%의 절반입니다. 풀이를 말로 설명하는 습관이 이 두 영역과 바로 이어집니다.",
      },
      {
        title: "1차는 도형의 방정식, 2차는 함수와 그래프까지",
        body: "평가 개요표의 성취기준 범위에서 1차 정기시험은 도형의 방정식과 집합의 개념·연산 부분을, 2차 정기시험은 충분조건·필요조건, 대우와 귀류법 증명, 함수와 그래프를 포함합니다. 진도표상 유리함수는 11월 3~4주, 무리함수는 11월 4주~12월 1주에 배워 2차 범위의 끝부분이 됩니다.",
      },
      {
        title: "서·논술형은 시험에서 20점 이상, 수행에서는 렌즈 과제뿐",
        body: "정기시험은 회차마다 서답형 30점 이상 중 서·논술형이 20점 이상으로 적혀 있어 학기말 반영비율로 각 6% 이상입니다. 수행평가에서 서술로 표시된 영역은 ‘수학적 렌즈로 바라본 세상’(20%) 하나이며, 일상생활 속 수학적 내용을 찾아 탐구하는 활동으로 융합적 사고력과 수학적 표현 능력을 평가한다고 되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "정기시험 각 30%(서·논술형 30점 이상) · 수행 3개 40%(도표 서술·영문 편지·포트폴리오)",
    intro:
      "공통영어2(1~11반)는 서·논술형이 회차마다 30점 이상이라 정기시험 두 번(60%)에서도, 수행평가 세 영역(40%)에서도 영문 쓰기가 비중을 차지합니다. 전주고등학교 1학년 영어 상담은 쓰기 분량과 형식을 점검하는 데서 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 30점 이상)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 30점 이상)" },
      { name: "환경 관련 도표를 분석하고, 지속 가능한 미래를 위한 해결책 영문 서술하기", kind: "task", weight: 15, timing: "8~9월", method: "서술" },
      { name: "필수 어휘를 활용한 내 삶에 긍정적인 영향을 준 인물 대상 영문 편지 쓰기", kind: "task", weight: 15, method: "서술" },
      { name: "영문 독해를 통한 글의 구조 분석 및 주제에 대한 자신의 의견 서술하기", kind: "task", weight: 10, method: "포트폴리오" },
    ],
    notes: [
      {
        title: "도표 서술은 개요를 먼저 확인받습니다",
        body: "환경 관련 도표 과제(15%)는 8~9월에 진행되며, 학생이 직접 고른 도표를 분석해 영문으로 쓰되 글은 주제·도표 요약, 문제점·시사점 분석, 해결책 제안 순서로 구성하도록 안내되어 있습니다. 도표 자료와 개요는 쓰기 전에 교사의 확인을 받고 동료·교사 피드백을 반영해 최종본을 완성하며, 채점은 내용 및 구성 9점, 과제 완성 3점, 언어 사용 3점입니다.",
      },
      {
        title: "영문 편지의 큰 부분은 어휘 점수입니다",
        body: "인물 대상 영문 편지(15%)에서 평가 요소 ‘문맥에 맞는 적절한 어휘 활용하기’가 10점, 편지 쓰기가 5점입니다. 어휘 부분의 상위 채점 기준에는 어휘 앱 8회 테스트 평균 점수와 암기·리콜·스펠 학습 과정 이수 여부가 적혀 있어, 1학년 수준 필수 어휘를 앱으로 학습하고 점검하는 일이 이 과제의 큰 몫을 차지합니다.",
      },
      {
        title: "시험 범위는 단원 순서로 나뉩니다",
        body: "진도표의 정기시험 표시는 1차가 1단원 Bonding with Others와 4단원 Toward Sustainability에, 2차가 2단원 What Keeps Us Moving Forward와 3단원 Knowing Ourselves, Knowing Others에 붙어 있습니다. 9·10월 전국연합학력평가 항목의 수업도 같은 회차 표시와 함께 편성되어 있고, 포트폴리오(10%)는 교과서 1~4단원 구문 분석과 3·6월 모의고사 지문의 구조 개요를 채웁니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2"],
    summary: "정기시험 2회 각 30%(회차별 서·논술형 20점 이상) · 수행 2개 40%(인권 공익 광고 30%·공감록 10%)",
    intro:
      "통합사회2(계획서 학급 1~8반)는 정기시험이 60%이고, 수행평가 40% 중 30%가 인권 문제 해결 공익 광고 제작 한 과제입니다. 전주고등학교 1학년 사회 상담은 조사·광고 제작·발표로 나뉜 이 과제의 채점 요소를 맞추는 데서 출발합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 20점 이상)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상(서·논술형 20점 이상)" },
      { name: "인권 문제 해결을 위한 공익 광고 제작", kind: "task", weight: 30, method: "프로젝트, 발표" },
      { name: "공감록 작성 및 핵심 내용 정리", kind: "task", weight: 10, method: "보고서" },
    ],
    notes: [
      {
        title: "공익 광고는 세 부분이 10점씩입니다",
        body: "인권 문제 해결을 위한 공익 광고 제작은 30점 만점이며 인권 문제 조사 및 분석, 해결 방안 및 광고 제작, 보고서 제출 및 발표가 10점씩입니다. 국내 인권 문제와 인권지수로 확인되는 세계 인권 문제를 조사해 해결 방안을 찾은 뒤 광고를 만들어 발표하는 과제로, 연구 보고서나 통계자료 같은 신뢰할 수 있는 출처를 쓰고 인용할 때 출처를 적어야 합니다.",
      },
      {
        title: "1차는 인권·정의·세계화, 2차는 경제·지속가능발전",
        body: "개요표의 성취기준 범위로 1차 정기시험은 인권과 헌법, 정의의 의미와 분배적·교정적 정의, 세계화와 평화를 다루고, 2차 정기시험은 시장경제와 지속가능발전(자본주의의 전개, 합리적 선택, 금융 생활 설계, 국제 분업과 무역), 인구 문제와 에너지 자원을 포함합니다. 분배적·교정적 정의 성취기준은 두 회차 범위에 모두 적혀 있습니다.",
      },
      {
        title: "공감록은 10점짜리 보고서형 과제",
        body: "공감록 작성 및 핵심 내용 정리(10%)는 일상생활에서 공감한 내용을 정리하고 성찰해 생활에서 실천하며, 교과 학습의 핵심 내용을 정리해 문제로 만들어 보는 과제입니다. 평가 방법은 보고서로 표시되고, 과제를 수행하는 시간에는 AI를 허용된 범위에서만 쓸 수 있으며 전자기기와 인터넷 사용이 금지됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "시험 60%(서답형 20점 이상) · 수행 2개 40%(논술형 통합 사고력 20%·융합 탐구 보고서 20%)",
    intro:
      "수행평가가 논술형 통합 사고력 평가와 보고서형 융합 탐구, 글로 쓰는 두 과제 20%씩인 전주고등학교 1학년 통합과학2(1~12반)는 정기시험 두 번이 60%입니다. 과학 상담에서는 서술 분량과 제출 시기부터 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 80점 이하·서답형 20점 이상" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 80점 이하·서답형 20점 이상" },
      { name: "과학 주제 기반 통합 사고력 평가(논술평가)", kind: "task", weight: 20, timing: "수시", method: "논술형" },
      { name: "과학 개념 기반 융합 탐구", kind: "task", weight: 20, timing: "10월", method: "보고서 평가" },
    ],
    notes: [
      {
        title: "융합 탐구는 지구온난화 수업 뒤 10월에 있습니다",
        body: "과학 개념 기반 융합 탐구(20%)는 온실효과 강화로 인한 지구온난화의 메커니즘을 이해하고 지구 열수지 불균형을 해결하기 위한 기후공학 탐구활동을 해 보고서로 쓰는 과제이며, 평가 시기는 10월입니다. 진도표에서 관련 성취기준은 9월 5주~10월 1주에 ‘지구 환경 변화와 인간 생활’로 배우고, 평가기준에는 프로젝트와 구술발표 수행이 들어 있습니다.",
      },
      {
        title: "논술 평가는 네 가지 요소를 5점씩 봅니다",
        body: "과학 주제 기반 통합 사고력 평가(논술평가, 20%)는 통합과학 단원별 핵심 개념으로 현대 과학적 쟁점을 분석하고 과학적 근거에 기반한 해결 방안을 논술형 보고서로 쓰는 과제입니다. 수업 참여 및 과학적 태도, 융합 주제 탐색 능력, 서술(논술) 능력, 문제 해결 능력이 5점씩이며 시기는 수시로 적혀 있습니다. 인터넷·생성형 AI 결과물을 그대로 복제해 제출하는 것은 금지됩니다.",
      },
      {
        title: "정기시험은 선택형 80점 이하, 서답형 20점 이상",
        body: "정기시험은 회차마다 선택형이 80점 이하, 서답형이 20점 이상이어서 학기말 반영비율로 서답형이 6% 이상입니다. 개요표 범위에서 1차에는 지질시대, 산화와 환원, 산과 염기, 온실효과가, 2차에는 물질 변화의 에너지 출입, 태양 에너지, 신재생 에너지, 과학기술과 미래 사회가 들어갑니다. 진도표의 정기시험 표시에는 1차·2차 구분이 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["화법과 언어", "문학(체특)"],
    summary: "화법과 언어 시험 60%·수행 40%(연설 25%·문법 탐구 15%) / 문학(체특) 시험 60%·수행 40%",
    intro:
      "화법과 언어(1~11반)와 문학(체특)(12반)은 정기시험이 같은 60%이지만 수행평가 구성이 다릅니다. 전주고등학교 2학년 국어 선택과목 중 화법과 언어는 연설 25%와 기사문 문법 탐구 15%, 문학(체특)은 수필 쓰기와 시 발표 20%씩이라, 상담에서는 수강 과목별 말하기·글쓰기 시기부터 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상", course: "화법과 언어" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형 30점 이상", course: "화법과 언어" },
      { name: "다양한 자료와 설득 전략을 활용하여 연설하기", kind: "task", weight: 25, timing: "9월~10월", method: "서술·논술, 구술·발표, 포트폴리오", course: "화법과 언어" },
      { name: "기사문을 바탕으로 실제적 문법 탐구하고 문항 제작하기", kind: "task", weight: 15, timing: "8월~12월", method: "포트폴리오, 서술형", course: "화법과 언어" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월 5주", method: "선택형 70점 이하·서답형 30점 이상", course: "문학(체특)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월 1주", method: "선택형 70점 이하·서답형 30점 이상", course: "문학(체특)" },
      { name: "나의 경험 성찰하고 수필 쓰기", kind: "task", weight: 20, timing: "9월 중", method: "논술형", course: "문학(체특)" },
      { name: "나의 인생 시 발표하기", kind: "task", weight: 20, timing: "10월 중", method: "구술∙발표", course: "문학(체특)" },
    ],
    notes: [
      {
        title: "연설 과제는 연설문 15점, 연설 10점",
        body: "화법과 언어의 연설 과제(25%)는 연설문 작성 15점과 근거 자료·설득 전략을 활용한 연설 10점으로 나뉩니다. 연설문은 주제·목적·청중에 맞는 계획, 서론·본론·결론 구성, 이성적·감성적·공신력 설득 전략의 활용을 보며, 진도표에서는 9월 2~3주 ‘발표와 연설’ 수업에 수행평가 표시가 붙어 있습니다.",
      },
      {
        title: "문법 탐구는 분석과 문항 제작으로 나뉩니다",
        body: "기사문 문법 탐구(15%)는 기사문에 쓰인 문법 요소를 분석해 해설하는 5점과 그 요소로 문제를 만들고 정답 해설을 쓰는 10점으로 나뉩니다. 진도표에서 문장·단어(8월 4주~9월 1주), 발음(11월 1~2주), 담화(11월 3~4주) 단원에 수행평가 표시가 이어져, 시험 범위의 문법 내용이 문항 제작의 재료가 됩니다.",
      },
      {
        title: "문학(체특)은 9월 수필, 10월 시 발표",
        body: "문학(체특)은 12반 과목으로 정기시험 두 번이 60%이며, 진도표에 1차는 9월 5주, 2차는 12월 1주로 적혀 있습니다. 수행평가는 9월의 수필 쓰기(내용 10점·형식 10점, 논술형)와 10월의 시 발표(내용의 깊이와 진정성 10점·발표 태도와 전달력 10점)이며, 각각 자신의 경험을 성찰한 글쓰기와 특별한 의미가 있는 시를 자신의 삶과 연결한 발표입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["확률과 통계", "미적분Ⅱ", "이산수학"],
    summary: "확률과 통계·미적분Ⅱ·이산수학 모두 정기시험 2회 각 30% · 수행 2개 각 20%",
    intro:
      "확률과 통계, 미적분Ⅱ, 이산수학은 정기시험 60%에 20%짜리 수행평가가 두 개씩 붙는 같은 구조입니다. 전주고등학교 2학년 수학 상담에서는 수행평가가 프로젝트·서술형 탐구 과제인 점을 먼저 확인한 뒤 수강 과목별 시험 범위를 나눕니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "확률과 통계" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "확률과 통계" },
      { name: "모평균·모비율 추정 연계 AI 통계 포스터 제작하기", kind: "task", weight: 20, timing: "11월", method: "프로젝트", course: "확률과 통계" },
      { name: "확률적 사고 기반 실생활 확률 분석하기", kind: "task", weight: 20, timing: "9~10월", method: "서술", course: "확률과 통계" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "미적분Ⅱ" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "미적분Ⅱ" },
      { name: "도함수를 활용한 새로운 함수의 그래프 분석하기", kind: "task", weight: 20, method: "프로젝트", course: "미적분Ⅱ" },
      { name: "정적분을 활용한 자신만의 도형 넓이 구하기", kind: "task", weight: 20, timing: "11월", method: "서술", course: "미적분Ⅱ" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "이산수학" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)", course: "이산수학" },
      { name: "실생활의 다양한 이산적 상황을 점화식으로 표현하기", kind: "task", weight: 20, method: "프로젝트", course: "이산수학" },
      { name: "순열의 대칭 구조에 대한 독창적 제약 조건 설계 및 일반화 공식 유도", kind: "task", weight: 20, timing: "11월", method: "서술", course: "이산수학" },
    ],
    notes: [
      {
        title: "확률과 통계: 포스터는 11월 작성, 12월 발표",
        body: "확률과 통계는 진도표에 1차 정기시험이 9월 5주, 2차가 12월 2주로 적혀 있고, 1차 범위는 경우의 수와 확률, 2차 범위는 확률분포와 통계적 추정입니다. 포스터 과제는 11월 4주에 작성하고 12월 3~4주에는 통계포스터 발표 시간이 편성되어 있으며, 작성 전에 모평균을 추정하는 설문조사를 직접 실시해야 합니다.",
      },
      {
        title: "미적분Ⅱ: 두 과제 모두 문항을 직접 만듭니다",
        body: "미적분Ⅱ의 두 수행평가는 문항을 직접 만들어 풀이하는 과제입니다. 그래프 분석(20%)은 함수의 증가·감소, 극값, 오목·볼록, 변곡점을 분석해 접선의 방정식 문항을 만들고, 도형 넓이 과제(20%, 11월)는 정적분이 쓰이는 사례로 넓이 또는 부피 문항을 만들어 보고서나 카드뉴스로 발표합니다. 시험은 1차에 수열의 극한, 2차에 적분법이 범위에 들어갑니다.",
      },
      {
        title: "이산수학: 시험은 단원별로, 과제는 검증까지",
        body: "이산수학의 시험 범위는 진도표 기준으로 1차(9월)에 점화 관계와 알고리즘, 진법을, 2차(12월)에 부울 함수, 선택과 배열, 그래프를 다룹니다. 점화식 과제의 유의사항은 기존 문제의 숫자만 바꾸지 말고 실제 데이터나 새로운 상황으로 직접 문항을 제작하라는 것이고, 순열 과제는 일반화 공식을 작은 수에 대입해 검증하는 과정을 반드시 포함하도록 되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  {
    schoolSlug: "jeonju-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ"],
    summary: "시험 60%(회차별 서·논술형 20점 이상) · 수행 3개 40%(기사 요약 20%·말하기 10%·배움일지 10%)",
    intro:
      "전주고등학교 2학년 영어Ⅱ(1~11반)의 수행평가 40%는 영문 기사 요약문 쓰기 20%, 기사 기반 말하기 10%, 영어 배움일지 10%이고 정기시험은 60%입니다. 말하기가 요약문 쓰기에서 다룬 기사를 이어받으므로, 상담에서는 두 과제를 한 흐름으로 준비합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, method: "선택형 70점 이하·서답형(서·논술형) 30점 이상(서·논술형 20점 이상)" },
      { name: "영문 기사 분석 및 요약문 쓰기", kind: "task", weight: 20, timing: "8월-12월", method: "서술" },
      { name: "기사 분석 기반 영어 말하기: 뉴스 리포트 또는 전문가 인터뷰", kind: "task", weight: 10, timing: "9월-10월", method: "구술·발표" },
      { name: "영어 배움일지 작성하기", kind: "task", weight: 10, timing: "8월-12월", method: "포트폴리오" },
    ],
    notes: [
      {
        title: "말하기는 요약한 기사를 그대로 이어받습니다",
        body: "말하기 과제(10%)는 요약문 쓰기에서 다룬 기사를 바탕으로 뉴스 리포터 또는 전문가 인터뷰이 중 하나를 골라 2분 내외로 수행하며 9~10월에 진행됩니다. 평가 요소는 내용 이해 및 재구성 6점, 의사소통 능력 및 역할 수행도 4점이고, AI로 대본 전체를 만드는 것은 금지되며 대본을 그대로 읽는 것은 지양하되 키워드 중심 발표자료는 허용됩니다.",
      },
      {
        title: "요약문 20점 중 10점이 어휘·구문 표현입니다",
        body: "영문 기사 요약문 쓰기(20%)는 주제 및 주요 아이디어 초안 4점, 요약문 작성 6점, 어휘 및 구문 표현 능력 10점으로 나뉩니다. 어휘 항목은 어휘 앱 8회 테스트 평균과 학습 활동 참여로 채점되고, 번역기·요약 생성 AI는 어휘 의미를 확인하는 용도로만 허용되며 요약문 문장 생성에는 쓸 수 없습니다. 기사 문장을 옮기지 않고 자신의 어휘로 재구성해야 합니다.",
      },
      {
        title: "배움일지는 8~12월 내내 이어집니다",
        body: "영어 배움일지(10%)는 학습한 내용에 대한 성찰, 글의 개요도, 자신의 생각이나 추가 탐구, 지정 어법·표현 분석을 담는 포트폴리오로 8~12월에 걸쳐 진행되며 내용의 충실성 5점과 포트폴리오 완성도 5점으로 채점됩니다. 완성도 5점은 배움일지를 100% 제출하고 어법·표현을 분석한 경우이며, 진도표의 정기시험 표시는 1~4단원(8월 1주~11월 4주) 수업에 붙어 있고 5단원에는 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주고등학교")],
  },
  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차시험 25%씩 · 수행 50%(말하기 10·쓰기 20·이해 10·독서 10)",
    intro:
      "전주신일중학교 2학년 국어는 정기시험 두 번이 25%씩이고, 수행평가 네 영역이 8월부터 11월 사이에 나머지 50%를 나눕니다. 그중 쓰기가 20%로 가장 커서, 상담은 문학 작품 속 사회·문화적 이슈를 홍보/비평글로 쓰는 과제의 일정을 확인하는 데서 시작합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 25, timing: "10월", method: "선택형 80점 이하 · 서답형(서·논술형) 20점 이상" },
      { name: "2차시험", kind: "exam", weight: 25, timing: "11월~12월", method: "선택형 80점 이하 · 서답형(서·논술형) 20점 이상" },
      {
        name: "말하기",
        kind: "task",
        weight: 10,
        timing: "8월~11월",
        method: "구술·발표 · 주제 발표하기(발표 원고 작성 및 발표 듣기·평가 포함)",
      },
      {
        name: "쓰기",
        kind: "task",
        weight: 20,
        timing: "8월~11월",
        method: "논술 · 문학 작품 속 사회·문화적 이슈 분석 및 복합양식을 활용한 홍보/비평글 쓰기",
      },
      { name: "이해", kind: "task", weight: 10, timing: "8월~11월", method: "국어의 음운 체계 및 한글 창제 원리 탐구 보고서 작성하기" },
      {
        name: "독서",
        kind: "task",
        weight: 10,
        timing: "8월~11월",
        method: "문학·비문학·복합양식 매체 읽기 및 과정 중심 읽기 활동지 작성",
      },
    ],
    notes: [
      {
        title: "서답형은 두 시험 모두 20점 이상",
        body: "개요표는 1차시험과 2차시험 모두 선택형을 80점 이하, 서답형(서·논술형)을 20점 이상으로 정해 두었습니다. 진도표에서 1차 정기시험으로 표시된 구간은 8월 3주~9월 5주의 문학(시대의 거울)·발표·논증 글읽기·광고와 홍보물 분석 단원이고, 2차 정기시험으로 표시된 구간은 10월 1주~11월 4주의 음운과 문자·듣기 말하기 성찰·복합양식 읽기와 쓰기 단원입니다.",
      },
      {
        title: "쓰기 과제는 분석·표현·구성을 따로 봅니다",
        body: "쓰기 20%는 작품의 사회·문화적 상황과 광고·홍보물의 매체 표현 전략을 분석하는 항목, 이미지·텍스트·레이아웃 같은 복합양식 요소를 글로 엮는 효과성 항목, 서론-본론-결론 구조와 완성도 항목으로 채점 요소가 나뉩니다. '처음-중간-끝' 구조가 없거나 어법에 맞지 않거나 가독성이 떨어지면 각각 -1점입니다.",
      },
      {
        title: "말하기·이해·독서의 채점 항목",
        body: "말하기는 발표 내용의 조직 및 매체 활용 4점, 발표 태도 및 전달력 3점, 듣기 및 동료 평가 3점이며, 원고만 제출하면 전달력 항목이 1점입니다. 이해는 음운 체계의 이해 및 적용 4점, 한글 창제 원리 분석 3점, 탐구력 및 완성도 3점이고, 독서는 텍스트 분석력과 읽기 과정 및 태도(체크리스트 기반)가 5점씩입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차시험 30%씩(10월·12월) · 수행 40%(배움평가·수학포스터·수업밀착·탐구과정 10%씩)",
    intro:
      "전주신일중학교 2학년 수학은 정기시험이 10월과 12월에 30%씩이고, 수행평가 40%는 배움평가·수학포스터·수업밀착평가·탐구과정평가가 학기 중 10%씩 나눕니다. 네 영역의 비중이 같으므로, 상담에서는 시험 범위 진도와 포스터·기록물 제출 시점이 겹치지 않게 순서부터 잡습니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 70점 · 서답형(서·논술형) 30점" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "12월", method: "선택형 70점 · 서답형(서·논술형) 30점" },
      {
        name: "배움평가",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "서술·논술 · 서술·논술형 문제를 수학적 사고와 표현을 이용하여 해결하기",
      },
      {
        name: "수학포스터 만들기",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "프로젝트 · 자주 발생하는 수학적 오류의 원인을 탐색하고 틀린 사고 과정과 올바른 풀이 과정을 비교 분석하기",
      },
      {
        name: "수업밀착평가",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "구술·발표 · 수업에 능동적으로 참여하고 학습 준비를 철저히 하며 자기 주도 학습 기록물을 성실히 작성하기",
      },
      {
        name: "탐구과정평가",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "포트폴리오 · 학습 내용 정리와 풀이 과정·원리를 담은 학습 과정 기록물 작성(1차 5점 + 2차 5점 합산)",
      },
    ],
    notes: [
      {
        title: "시험 범위는 도형 단원과 확률로 갈립니다",
        body: "개요표는 1차시험에 [9수03-09]~[9수03-13](이등변삼각형, 외심과 내심, 사각형의 성질, 도형의 닮음, 삼각형의 닮음 조건)을, 2차시험에 [9수03-14]·[9수03-15]·[9수04-05]·[9수04-06](평행선 사이 선분의 길이의 비, 피타고라스 정리, 경우의 수와 확률)을 배정합니다. 두 시험 모두 서답형(서·논술형)이 30점입니다.",
      },
      {
        title: "수학포스터는 오답 원인과 수정 과정을 채점",
        body: "수학포스터는 자주 발생하는 수학적 오류의 원인을 찾고 틀린 사고 과정과 올바른 풀이를 비교 분석하는 프로젝트로, 오류 원인 분석 5점과 사고 과정 비교 및 수정 5점으로 채점합니다. 원인을 ‘계산 실수’나 ‘문제를 잘못 읽음’처럼 단편적으로만 적으면 5점 중 3점 단계에 해당합니다.",
      },
      {
        title: "배움평가는 해결 비율, 탐구과정은 1·2차 합산",
        body: "배움평가는 문제 해결 정도가 90% 이상이면 10점이고 10%p 내려갈 때마다 1점씩 줄어 40% 미만이 4점입니다. 수업밀착평가의 자기 주도 학습 기록에는 단원 마무리 문제해결과 오답 분석 노트가 포함되고, 탐구과정평가는 1차 평가 5점과 2차 평가 5점을 합산해 포트폴리오로 평가합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "1·2차시험 30%씩 · 활동평가 20%(8월~12월) · 포트폴리오 20%(9월~11월)",
    intro:
      "전주신일중학교 2학년 역사는 1차시험이 [9역05-01]~[9역05-03], 2차시험이 [9역06-01]~[9역07-01]로 범위가 나뉘고, 수행평가는 활동평가와 포트폴리오가 20%씩입니다. 상담에서는 두 과제의 진행 시기를 시험 범위와 나란히 놓고 봅니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, method: "선택형 70점 이하 · 서답형(서·논술형) 30점 이상" },
      { name: "2차시험", kind: "exam", weight: 30, method: "선택형 70점 이하 · 서답형(서·논술형) 30점 이상" },
      {
        name: "활동평가",
        kind: "task",
        weight: 20,
        timing: "8월~12월",
        method: "발표(수업 참여도 및 내용 이해도 평가) 10점 / 활동지(학습 내용의 구조화 능력 평가) 10점",
      },
      {
        name: "포트폴리오",
        kind: "task",
        weight: 20,
        timing: "9월~11월",
        method: "주제탐구(교과연계) 10점 / 보고서 작성(세계대전 역사 신문 기사 작성하기) 10점",
      },
    ],
    notes: [
      {
        title: "시험 범위는 Ⅴ단원과 Ⅵ·Ⅶ단원으로 갈립니다",
        body: "개요표는 1차시험에 [9역05-01]~[9역05-03](시민 혁명과 국민 국가, 산업화와 제국주의, 아시아의 국민 국가 건설 운동)을, 2차시험에 [9역06-01]~[9역07-01](세계 대전, 전쟁 범죄와 평화 유지 노력, 아시아·아프리카 민족 운동, 냉전과 제3세계)을 배정합니다. 진도표는 두 시험 모두 단답·서술형 문항을 30% 적용한다고 적고 있습니다.",
      },
      {
        title: "활동평가는 발표와 나만의 노트 10점씩",
        body: "활동평가 20점은 발표(수업 참여도와 내용 이해도)와 활동지(나만의 노트) 10점씩입니다. 두 항목 모두 충족한 평가 요소의 개수로 점수가 정해져, 전부 충족하면 10점, 3개 9점, 2개 7~8점, 1개 5~6점입니다. 노트의 평가 요소에는 마인드맵과 보석맵으로 교과 내용을 구조화하는 항목이 들어 있습니다.",
      },
      {
        title: "포트폴리오는 신문 기사와 주제탐구 두 편",
        body: "포트폴리오 20점은 세계대전 역사 신문 기사 작성(보고서, 400자 이상)과 교과 연계 주제탐구(본문 300자)가 10점씩입니다. 각각 다섯 요소 가운데 충족한 개수로 채점하는데, 주제탐구에는 교과서에서 자세히 다루지 않은 내용을 찾아 쓰는 요소와 참고 문헌·사이트를 제시하는 요소가 포함됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차시험 30%씩(10월·11~12월) · 서·논술형 20% · 창의표현 10% · 수업 밀착형 평가 10%",
    intro:
      "전주신일중학교 2학년 과학은 1차시험(10월)에서 4·5단원, 2차시험(11~12월)에서 6·7단원을 다루고, 수행평가 40% 가운데 서·논술형이 20%입니다. 8~12월 내내 이어지는 수행평가 세 영역을 단원 진도에 맞춰 나눠 두는 일이 상담의 첫 작업입니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 70점 · 서답형 30점" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "11~12월", method: "선택형 70점 · 서답형 30점" },
      {
        name: "서·논술형",
        kind: "task",
        weight: 20,
        timing: "8~12월",
        method: "서술·논술 · 제시된 지문을 읽고 해당하는 과학적 원리를 정확하게 서술하기",
      },
      { name: "창의표현", kind: "task", weight: 10, timing: "8~12월", method: "화학식과 모형" },
      { name: "수업 밀착형 평가", kind: "task", weight: 10, timing: "8~12월", method: "교과서 및 활동지 준비, 활동지 작성" },
    ],
    notes: [
      {
        title: "단원별 시험 범위와 서답형 30점",
        body: "시험 범위는 1차가 [9과11-01]~[9과11-04](4단원 물질의 구성)와 [9과12-01]~[9과12-03](5단원 식물과 에너지), 2차가 [9과13-01]~[9과13-05](6단원 동물과 에너지)와 [9과14-01]~[9과14-04](7단원 전기와 자기)입니다. 서답형은 시험마다 30점이고, 학기말 반영 비율로는 9%씩입니다.",
      },
      {
        title: "서·논술형 20점의 네 묶음",
        body: "서·논술형은 제시된 지문을 읽고 과학적 원리를 서술하는 과제로, 광합성 6점, 식물의 호흡과 광합성의 관계 4점, 소화와 순환 6점, 호흡과 배설 4점의 네 묶음입니다. 6점 묶음은 3문제 중 옳게 서술한 수에 따라 6·5·4점으로 나뉘고, 가장 낮은 단계는 2점입니다.",
      },
      {
        title: "창의표현은 화학식과 모형, 수업밀착은 체크리스트",
        body: "창의표현 ‘화학식과 모형’은 실험 과정 수행하기 4점, 실험 결과 및 결론 도출하기 3점, 과학적 원리 설명하기 3점입니다. 수업 밀착형 평가는 교과서·활동지 준비 체크리스트의 체크 횟수(0~2회 4점, 3~4회 3점, 5회 이상 2점)와 활동지 빈칸 수(0~3개 6점, 4~6개 4점, 7개 이상 2점)를 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차시험 25%씩 · 쓰기 20%(9월 3주, 소설 시점 바꾸어 쓰기) · 말하기·이해·독서 10%씩",
    intro:
      "전주신일중학교 3학년 국어 계획서에는 수행평가 시기가 고입일정에 따라 바뀔 수 있다고 적혀 있습니다. 9월 3주 소설 ‘기억 속의 들꽃’ 시점 바꾸어 쓰기(쓰기 20%)에서 11월 4주 말하기까지 이어지므로, 정기시험 25%씩 두 번과 함께 현재 날짜부터 확인합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 25, timing: "10월", method: "선택형 80점 이하 · 서답형(서·논술형) 20점 이상" },
      { name: "2차시험", kind: "exam", weight: 25, timing: "11월~12월", method: "선택형 80점 이하 · 서답형(서·논술형) 20점 이상" },
      { name: "말하기", kind: "task", weight: 10, timing: "11월 4주", method: "구술·발표 · 주제 발표하기(글쓰기 포함)" },
      {
        name: "쓰기",
        kind: "task",
        weight: 20,
        timing: "9월 3주",
        method: "논술 · 소설 ‘기억 속의 들꽃’ 시점 바꾸어 쓰기 및 다시쓰기, 주제 도출하기",
      },
      {
        name: "이해",
        kind: "task",
        weight: 10,
        timing: "10월 5주",
        method: "구술·발표 · 문장 성분 이해하기, 문장의 짜임과 양상 탐구하기, 표현 의도에 맞게 문장 활용하기",
      },
      {
        name: "독서",
        kind: "task",
        weight: 10,
        timing: "상시",
        method: "포트폴리오 · 관점·사회문화적 맥락·문학 해석의 관점·논증 방식을 고려하여 읽기, 수업 전반의 읽기 과정평가(체크리스트)",
      },
    ],
    notes: [
      {
        title: "시점 바꾸어 쓰기는 네 구간 5점씩",
        body: "쓰기 20%는 ‘기억 속의 들꽃’의 발단, 전개, 위기/절정, 결말을 각각 시점을 바꾸어 쓰는 네 구간이며 구간마다 5점입니다. 최고 단계는 인물·사건·배경과 개연성을 고려해 시점을 효과적으로 바꾼 경우이고, 분량이 부족하고 주제를 드러내는 데 미흡하면 3점 단계입니다. 소설의 흐름을 고려하지 않은 창작은 감점 항목에 들어 있습니다.",
      },
      {
        title: "말하기·이해·독서는 항목별 배점이 정해져 있습니다",
        body: "말하기는 주장의 명확성과 내용의 통일성 4점, 근거의 적절성 3점, 쓰기 및 발표 태도 3점이고, 이해는 문장성분 이해 4점, 문장의 호응 3점, 겹문장의 양상 3점입니다. 독서는 문제해결과정으로서의 읽기/쓰기와 읽기/쓰기 과정 점검이 5점씩이며 둘 다 상시 평가로 표시됩니다.",
      },
      {
        title: "시험 범위와 일정 변경 문구",
        body: "진도표의 시험 표시를 보면 1차는 8월 4주~9월 5주 ‘문학의 샘’·‘너의 생각, 나의 생각’ 단원, 2차는 10월 2주~11월 4주 ‘탐구하는 우리’·‘세상을 보는 눈’ 단원에 붙어 있습니다. 쓰기·이해·말하기 행에는 ‘3학년 고입일정과 관련하여 시기변경될 수 있음’이 적혀 있어, 위의 날짜는 변경될 수 있는 계획 값입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차시험 30%씩 · 배움평가 20%(서술·논술) · 수업밀착평가 10% · 탐구과정평가 10%",
    intro:
      "전주신일중학교 3학년 수학은 수행평가 40% 가운데 20%가 배움평가이고, 이 점수는 1차 평가 10점과 2차 평가 10점의 합입니다. 서술형평가 표시가 9월 원의 성질 단원과 11월 대푯값과 산포도 단원에 있어, 상담에서는 두 단원의 서술 연습을 시험 준비와 함께 짭니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 70점 · 서답형(서·논술형) 30점" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "11월~12월", method: "선택형 70점 · 서답형(서·논술형) 30점" },
      {
        name: "배움평가",
        kind: "task",
        weight: 20,
        timing: "학기 중",
        method: "서술·논술 · 서술·논술형 문제를 수학적 사고와 표현을 이용하여 해결하기(1차 10점 + 2차 10점 합산)",
      },
      {
        name: "수업밀착평가",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "구술·발표 · 수업에 능동적으로 참여하고 학습 준비를 철저히 하며 자기 주도 학습 기록물을 성실히 작성하기",
      },
      {
        name: "탐구과정평가",
        kind: "task",
        weight: 10,
        timing: "학기 중",
        method: "포트폴리오 · 학습 내용 정리와 풀이 과정·원리를 담은 학습 과정 기록물 작성(1차 5점 + 2차 5점 합산)",
      },
    ],
    notes: [
      {
        title: "시험은 삼각비·원의 성질과 원주각·통계로 나뉩니다",
        body: "1차시험에는 [9수04-17]~[9수04-19](삼각비의 뜻과 활용, 원의 현과 접선의 성질), 2차시험에는 [9수04-20] 원주각과 [9수05-06]~[9수05-08](대푯값, 분산과 표준편차, 산점도와 상관관계)이 배정되어 있습니다. 12월 1주 이후 진도표 행은 삼각비·원의 성질·상관관계를 다시 보는 복습과정으로 표시됩니다.",
      },
      {
        title: "배움평가 20점은 두 번의 서술형평가 합산",
        body: "배움평가는 1차 평가 10점과 2차 평가 10점을 더한 점수입니다. 진도표의 서술형평가 표시는 9월 3주~5주 원의 성질 행(삼각비의 활용과 원의 현·접선 성질)과 11월 2주~3주 대푯값과 산포도 행 두 곳이며, 채점은 ‘수학적 문제 해결 활동’ 한 항목으로, 해결 정도 구간 7단계에 따라 4점부터 만점 10점까지 매깁니다.",
      },
      {
        title: "수업밀착평가와 탐구과정평가의 구성",
        body: "수업밀착평가는 수업 참여도 및 학습 준비성 5점과 자기주도 학습 기록 및 성찰 5점으로 이뤄지고, 기록 항목은 단원별 확인 문제의 해결과 오답 정리·풀이 과정 기록을 봅니다. 탐구과정평가는 학습 내용 정리와 풀이 과정·원리를 담은 기록물을 빠짐없이 쓰는 포트폴리오이며 1차·2차 5점씩입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  {
    schoolSlug: "jeonjusinil-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차시험 30%씩 · 서논술형 20% · 창의표현(가계도) 10% · 수업 밀착형 평가 10%",
    intro:
      "전주신일중학교 3학년 과학의 창의표현은 ‘가계도 분석 및 나만의 가계도 제작하기’ 과제이고, 서논술형 20%와 수업 밀착형 평가 10%가 함께 8~12월 수행평가를 이룹니다. 두 정기시험 범위에 5단원 생식과 유전이 걸쳐 있어, 상담에서는 이 단원 진도부터 점검합니다.",
    assessments: [
      { name: "1차시험", kind: "exam", weight: 30, timing: "10월", method: "선택형 70점 · 서답형 30점" },
      { name: "2차시험", kind: "exam", weight: 30, timing: "11~12월", method: "선택형 70점 · 서답형 30점" },
      {
        name: "서·논술형",
        kind: "task",
        weight: 20,
        timing: "8~12월",
        method: "서술·논술 · 제시된 지문을 읽고 해당하는 과학적 원리를 정확하게 서술하기",
      },
      { name: "창의표현", kind: "task", weight: 10, timing: "8~12월", method: "가계도 분석 및 나만의 가계도 제작하기" },
      { name: "수업 밀착형 평가", kind: "task", weight: 10, timing: "8~12월", method: "교과서 및 활동지 준비, 활동지 작성" },
    ],
    notes: [
      {
        title: "시험 범위는 신경계·호르몬, 생식과 유전, 별과 우주",
        body: "개요표 기준 1차시험(10월)은 [9과20-01]~[9과20-03]과 [9과21-01]~[9과21-02], 2차시험(11~12월)은 [9과21-01]~[9과21-05]와 [9과23-01]~[9과23-04]입니다. 진도표에서는 감각기관·신경계가 8월, 호르몬과 세포 분열·염색체가 9월, 생식과 발생이 10월, 멘델 유전·가계도 분석과 7단원 별과 우주가 11~12월 구간에 놓여 있습니다.",
      },
      {
        title: "서논술형은 네 문제, 6·4·6·4점",
        body: "서논술형 20점은 네 문제로 이뤄지며 1번과 3번이 6점, 2번과 4번이 4점입니다. 6점 문제는 ‘전체 3문제’ 중 모두 옳게 서술하면 6점, 2문제면 5점, 1문제면 4점이고, 옳게 서술하지 못하거나 응시하지 않으면 2점입니다. 성취기준은 [9과20-01]~[9과20-03], [9과21-01]~[9과21-05]로 적혀 있습니다.",
      },
      {
        title: "가계도 제작 과제와 수업 밀착형 평가",
        body: "가계도 제작 과제는 먼저 자료를 과학 이론에 기초해 분석(4점)한 뒤, 그 결과로 가계도를 제작(3점)하고 질문에 대한 원리를 설명(3점)하는 순서로 채점됩니다. 수업 밀착형 평가 10점은 준비물 항목 4점과 활동지 작성 항목 6점으로 구성되며, 활동지 작성은 빈칸 수로 단계가 갈립니다.",
      },
    ],
    sources: [schoolInfoPlanSource("전주신일중학교")],
  },
  // 29차 경북 안동 서구동(안동여고·경안여중) — 학교알리미 2026-2 평가계획
  // ───────── 1학년 ─────────
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "정기시험 2회 50%(선다형) · 수행 2개 50%(관심 주제 발표·훈민정음 발표)",
    intro:
      "안동여고 1학년 공통국어2는 1·2차 정기시험이 25%씩 선다형이고, 수행평가는 청중을 고려한 발표(10월)와 훈민정음 발표(11월)가 25%씩입니다. 상담은 두 발표 일정과 시험 범위를 한 장에 놓고 어느 쪽부터 손볼지 정하는 일에서 시작합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 25, timing: "9~10월", method: "선다형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 25, timing: "12월", method: "선다형 100점" },
      { name: "청중을 고려한 관심 주제 발표하기", kind: "task", weight: 25, timing: "10월", method: "서술·논술, 구술발표" },
      { name: "훈민정음의 가치와 특징 발표하기", kind: "task", weight: 25, timing: "11월", method: "서술·논술, 구술발표" },
    ],
    notes: [
      {
        title: "서술·구술은 수행평가 쪽에 있습니다",
        body: "정기시험 1·2차의 평가방법은 선다형 100점이고, 서술·논술과 구술발표는 수행평가 두 영역의 평가방법으로 적혀 있습니다. 두 과제 모두 교사 관찰 및 기록이 함께 표시되어 있어, 작성물과 발표가 한 과제 안에서 함께 채점됩니다. 선다형 정리와 발표 준비를 따로 나누어 두는 편이 표의 구조와 맞습니다.",
      },
      {
        title: "1차와 2차의 성취기준이 다릅니다",
        body: "1차 정기시험은 한국 문학사의 흐름 속 작품 수용·해석, 국어의 변화, 복합양식 자료에 담긴 필자의 관점과 의도 평가를 성취기준으로 둡니다. 2차에는 한글 맞춤법의 원리, 주제 통합적 읽기, 사회적 독서 활동이 더해집니다. 진도표에서 문학 단원은 8월과 10월, 언어와 매체 단원은 9월과 11월에 나뉘어 있습니다.",
      },
      {
        title: "발표 과제 두 개의 채점 항목",
        body: "관심 주제 발표는 발표 계획 30점, 발표 내용 구성 20점, 발표문 작성 20점, 발표 30점으로 채점하며 제출 기한을 넘기면 하루 2점씩 최대 3일 감점합니다. 훈민정음 발표는 훈민정음의 가치 이해, 중세국어의 특징 이해, 매체 활용 자료 제작의 창의성, 발표력이 25점씩입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "정기시험 2회 60%(선다형·단답형) · 수행 3개 40%(뉴스 글쓰기 20·기사 소개 10·영상 청취 10)",
    intro:
      "공통영어2는 정기시험 1·2차가 30%씩이고, 수행평가 40% 가운데 20%가 영어 뉴스 주제를 탐구해 쓰는 서술·논술 과제입니다. 1학년 영어 상담은 영어 뉴스를 쓰는 과제와 기사 소개 발표를 먼저 확인한 뒤 11월 영상 청취, 12월 시험으로 이어 붙입니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형/단답형 100점" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형/단답형 100점" },
      { name: "영어 뉴스 주제를 탐구하여 자신의 관점을 영어로 작성하기", kind: "task", weight: 20, timing: "9월~10월", method: "서술·논술" },
      { name: "영어 뉴스 기사의 핵심 내용과 쟁점을 요약하여 소개하기", kind: "task", weight: 10, method: "구술·발표" },
      { name: "환경을 주제로 한 영어 영상을 시청하고 핵심 내용과 세부 정보 파악하기", kind: "task", weight: 10, timing: "11월", method: "서술·논술" },
    ],
    notes: [
      {
        title: "서·논술형은 뉴스 쓰기 한 곳에 모입니다",
        body: "서논술형 반영 비율 20%는 영어 뉴스 주제를 쓰는 과제 한 곳에서 나오고, 두 번의 정기시험은 선다형/단답형입니다. 이 쓰기 과제는 150단어 이상이면 과제 완성도 40점을 모두 받고, 언어 사용 10점은 It is(was) ~ that ~ 강조 구문을 어법과 철자에 맞게 쓰는지로 채점합니다. 내용 25점, 어휘 및 표현 25점이 나머지입니다.",
      },
      {
        title: "말하기·듣기 과제의 배점 구성",
        body: "기사 소개는 시각 자료를 활용해 1분 분량으로 발표하며, 발화의 정확성 및 유창성이 40점으로 가장 크고 대본에 의존하는 정도가 채점에 들어갑니다. 영상 과제는 주제 및 요지 파악 50점, 세부 정보 파악 25점, 내용 요약 25점으로 나뉘어 요지를 잡는 비중이 큽니다.",
      },
      {
        title: "시험 범위와 진도표",
        body: "1·2차 정기시험의 성취기준은 [10공영2-01-01]~[01-08]로 같게 적혀 있으며 세부 정보, 주제·요지, 심정·의도 추론, 논리적 관계, 함축적 의미, 전개 방식 파악 등 이해 영역입니다. 진도표에서 Lesson 1~2는 8~9월, Lesson 3~4는 10~11월이고 12월은 보충독해 자료 수업입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "정기시험 2회 60%(회차별 서·논술형 20점) · 수행 2개 40%(개념 탐구 구술·수학적 모델링)",
    intro:
      "1학년 공통수학2는 정기시험 회차마다 선다형 80점과 서·논술형 20점이 들어가고, 수행평가 두 영역은 20%씩입니다. 서·논술형 평가 반영 비율이 모두 합쳐 32%인 만큼, 안동여고 수학 상담은 풀이 과정을 글로 쓰는 연습을 어느 단원에 붙일지부터 정합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형 80점(24%)·서·논술형 20점(6%)" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형 80점(24%)·서·논술형 20점(6%)" },
      { name: "수학적 개념 탐구 및 구술 발표", kind: "task", weight: 20, method: "구술·발표" },
      { name: "실생활 속에 내포된 요소의 수학적 모델링 및 문제 해결", kind: "task", weight: 20, method: "서술·논술" },
    ],
    notes: [
      {
        title: "서·논술형 32%는 세 곳에서 나옵니다",
        body: "서·논술형 평가 반영 비율 32%는 1차 6%, 2차 6%, 실생활 모델링 과제 20%를 더한 값이고, 구술·발표 과제에는 서·논술형 비율이 표시되어 있지 않습니다. 정기시험은 회차마다 선다형 80점(24%)과 서·논술형 20점(6%)이 따로 매겨집니다.",
      },
      {
        title: "시험 범위는 단원 순서대로 이어집니다",
        body: "성취기준 표에서 1차는 [10공수2-01-01]~[02-02], 2차는 [02-01]~[03-05]로 적혀 있어 집합 관련 두 항목이 두 회차에 걸칩니다. 진도표는 8월 도형의 방정식, 9~10월 집합과 명제, 11월 이후 함수와 그래프(합성·역함수, 유리·무리함수) 순서입니다.",
      },
      {
        title: "두 수행평가의 채점 요소와 작성 방식",
        body: "개념 탐구는 수학적 개념의 이해와 적용 40점, 탐구 과정 및 문제해결력 40점, 의사소통 및 과정의 진실성 20점입니다. 모델링 과제는 수학적 모델링 40점, 문제 해결 및 개념 적용 40점, 과정의 논리성 및 진실성 20점입니다. 두 과제 모두 정규 수업 시간에 자필로 쓰고 스마트 기기는 쓸 수 없으며, 교사의 1:1 질문이 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2", "한국사2"],
    summary: "통합사회2·한국사2 모두 정기시험 2회 60% · 수행 2개 40%(프로젝트·보고서)",
    intro:
      "안동여고 1학년 사회 영역은 통합사회2와 한국사2 모두 정기시험 1·2차가 30%씩, 수행평가 2개가 20%씩입니다. 서논술형 반영이 통합사회2는 34%, 한국사2는 20%라서 상담은 과목별 서술 과제의 일정과 채점 항목부터 맞춰 봅니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9~10월", method: "선다형, 서답형", course: "통합사회2" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형, 서답형", course: "통합사회2" },
      { name: "미래 사회의 경제적 쟁점 분석과 정책 대안 설계 프로젝트", kind: "task", weight: 20, timing: "10~11월", method: "서술·논술, 프로젝트", course: "통합사회2" },
      { name: "지속가능한 사회를 위한 인구 변화 대응 프로젝트", kind: "task", weight: 20, method: "서술·논술, 프로젝트, 구술·발표", course: "통합사회2" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형 단답형", course: "한국사2" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형 단답형", course: "한국사2" },
      { name: "교과서를 통해 역사력 탐구력을 기르는 역사 여행 계획서 쓰기", kind: "task", weight: 20, timing: "9월~10월", method: "서·논술형 평가", course: "한국사2" },
      { name: "역사 속에서 내 진로를 탐구하는 역사 직업 탐구 보고서 작성하기", kind: "task", weight: 20, timing: "11월~12월", method: "프로젝트", course: "한국사2" },
    ],
    notes: [
      {
        title: "통합사회2의 서논술형 34%의 구성",
        body: "통합사회2 서논술형 34%는 경제 쟁점 프로젝트 20%와 인구 변화 대응 프로젝트의 보고서 몫 14%를 더한 값입니다. 인구 프로젝트는 보고서 70점(주제 선정 10, 자료 활용 15, 문제 진단 15, 기존 정책 분석 15, 정책 제안 15)과 발표 30점으로 이뤄집니다.",
      },
      {
        title: "통합사회2 시험 범위와 경제 프로젝트",
        body: "성취기준 표의 1차 목록에는 사회 불평등 [10통사2-02-03]과 시장경제·세계화·미래 단원 항목이, 2차 목록에는 인권 [01-01]~[01-03]과 정의 [02-01]·[02-02]가 들어 있습니다. 경제 쟁점 프로젝트는 경제 현상 분석 35점, 경제 개념 및 원리의 적용 30점, 정책 대안의 타당성 및 창의성 35점으로 채점합니다.",
      },
      {
        title: "한국사2는 시기별로 과제가 나뉩니다",
        body: "한국사2의 서논술형 20%는 역사 여행 계획서에서 나오며, 이 과제는 1차 시험 범위와 같은 일제강점기 성취기준([10한사2-01-01]~[01-05])을 다룹니다. 역사 직업 탐구 보고서는 해방기 이후 내용을 다룹니다. 두 과제 모두 형식의 적절성 40점, 내용의 충실성 40점, 기한 내 제출 20점으로 채점합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학탐구실험2"],
    summary: "정기시험 없음 · 수행 2개 100%(유사과학 탐구 50·외래생물 탐구 50)",
    intro:
      "안동여고 1학년 과학탐구실험2는 정기시험 없이 수행평가 두 영역이 50%씩이고, 유사과학 탐구 활동지는 서술·논술로, 외래생물 탐구는 프로젝트로 평가합니다. 두 과제의 평가 시기가 모두 8~10월이라, 상담은 그 기간 안에서 주제 선정과 자료 조사 일정을 잡는 일부터 합니다.",
    assessments: [
      { name: "유사과학의 주장과 과학적 근거 탐구", kind: "task", weight: 50, timing: "8~10월", method: "서술·논술" },
      { name: "외래생물의 생태계 영향과 생물다양성 보전 방안 탐구", kind: "task", weight: 50, timing: "8~10월", method: "프로젝트" },
    ],
    notes: [
      {
        title: "서논술형은 유사과학 활동지에서 나옵니다",
        body: "서논술형 반영 비율 30%는 유사과학 탐구에서 학생이 작성하는 활동지에서 나오며, 외래생물 탐구에는 서논술형 비율이 없습니다. 활동지는 탐구 주제 선정·자료 조사 및 과학적 근거 활용 40점, 과학적 분석의 타당성 및 오류 추론 30점, 비판적 태도 및 실천 방안 30점으로 채점하고 뒤의 두 항목이 서·논술형입니다.",
      },
      {
        title: "외래생물 탐구의 세 가지 채점 항목",
        body: "외래생물 정보시스템으로 외래생물과 생태계교란 생물 여부를 확인하는 항목이 30점, 우리 지역의 외래생물 조사와 생태계 영향·생물다양성 훼손 조사가 30점, 조사 결과의 포스터 표현·과학적 의사소통·보전 방안 제안이 40점입니다. 지역 분포는 신뢰할 수 있는 자료로 확인해 근거를 제시해야 합니다.",
      },
      {
        title: "수업 흐름과 평가 시기",
        body: "진도표는 8월 생활 속 과학 원리를 찾아 포스터로 만드는 활동, 9월 유사과학 사례 비평 글쓰기와 국내 유입 외래생물 조사, 10월 놀이기구 가속도 측정과 충격 흡수 장치 제작, 11월 이후 첨단 과학 기술과 센서 순입니다. 평가 시기 8~10월은 앞의 세 달 수업과 겹칩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },

  // ───────── 2학년 ─────────
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["문학"],
    summary: "정기시험 2회 50%(선다형) · 수행 2개 50%(작품 분석·감상, 재구성·창작)",
    intro:
      "2학년 문학은 정기시험 1·2차가 25%씩 선다형이고, 서술·논술로 평가하는 수행평가 두 영역이 25%씩입니다. 안동여고 상담은 시험 범위인 한국 문학사 단원과 작품 분석·재구성 과제의 채점 요소를 나란히 놓고 어느 쪽 준비를 먼저 할지 정하는 것에서 출발합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 25, timing: "9월~10월", method: "선다형", course: "문학" },
      { name: "2차 정기시험", kind: "exam", weight: 25, timing: "12월", method: "선다형", course: "문학" },
      { name: "문학 작품 분석 및 감상", kind: "task", weight: 25, method: "서술·논술", course: "문학" },
      { name: "문학 작품의 재구성과 창작", kind: "task", weight: 25, method: "서술·논술", course: "문학" },
    ],
    notes: [
      {
        title: "서술형 평가는 수행 두 영역이 맡습니다",
        body: "정기시험은 두 회 모두 선다형으로 적혀 있고, 서술·논술 평가는 수행평가 두 영역의 평가방법입니다. 두 과제 모두 교사 관찰 및 기록이 함께 표시되어 있습니다. 문학에서는 시험 대비와 별개로 글로 작품을 분석하고 창작하는 연습이 수행평가 점수로 곧바로 이어지는 구조입니다.",
      },
      {
        title: "1차와 2차 정기시험의 성취기준",
        body: "1차는 문학의 가치와 갈래·맥락([12문학01-01]·[01-02]), 한국 문학의 범위와 시대 상황([01-03]·[01-04]), 내용과 형식·감상과 비평([01-06]·[01-07])입니다. 2차에는 한국·외국 작품 비교([01-05]), 재구성·창작과 매체([01-08]·[01-09]), 자아 성찰과 공동체([01-10]~[01-12])가 새로 들어가고 [01-03]·[01-04]는 양쪽에 적혀 있습니다.",
      },
      {
        title: "두 과제의 채점 항목",
        body: "분석·감상은 내용과 형식, 작가 분석, 사회·문화적 배경 분석, 상호 텍스트성 분석, 작품 감상을 20점씩 보며 감상문은 1000자 이상이어야 20점 구간입니다. 재구성·창작은 원작의 해석, 형식의 유사성, 표현의 참신성, 주제의 형상화, 문장의 완성도를 20점씩 보고 원작 시의 운율과 발상을 살린 패러디를 기준으로 합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ", "영어 발표와 토론"],
    summary: "영어Ⅱ 정기시험 60%·수행 3개 40% / 영어 발표와 토론 수행 4개 100%",
    intro:
      "안동여고 2학년 영어는 영어Ⅱ가 정기시험 60%에 수행평가 3개 40%이고, 영어 발표와 토론은 정기시험 없이 수행평가 4개로 100%를 채웁니다. 영어Ⅱ의 서논술형 30%가 영상 의견 작성과 11월 주장하는 글쓰기에서 나오므로, 상담은 두 쓰기 과제의 일정부터 정리합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형, 단답형 100점", course: "영어Ⅱ" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형, 단답형 100점", course: "영어Ⅱ" },
      { name: "Pop Culture를 주제로 영어 토론 및 인터뷰하기", kind: "task", weight: 10, timing: "8~9월", method: "구술·발표", course: "영어Ⅱ" },
      { name: "건강, 과학, 질병에 관한 영어 영상을 시청하고 의견 작성하기", kind: "task", weight: 10, timing: "9~10월", method: "서술", course: "영어Ⅱ" },
      { name: "사회적 쟁점에 대한 주장하는 글쓰기", kind: "task", weight: 20, timing: "11월", method: "논술", course: "영어Ⅱ" },
      { name: "발표와 토론의 기본 원리 및 개념 서술하기", kind: "task", weight: 30, timing: "8월", method: "서술형", course: "영어 발표와 토론" },
      { name: "우리 사회의 변화와 미래에 대해 발표하기", kind: "task", weight: 20, timing: "10월", method: "구술·발표", course: "영어 발표와 토론" },
      { name: "인상 깊은 경험을 바탕으로 청중의 행동 변화 제안하기", kind: "task", weight: 20, timing: "9월", method: "구술·발표", course: "영어 발표와 토론" },
      { name: "사회적 쟁점 선정하여 토론하기", kind: "task", weight: 30, timing: "9월", method: "토의·토론", course: "영어 발표와 토론" },
    ],
    notes: [
      {
        title: "영어Ⅱ 시험은 같은 성취기준을 두 번 봅니다",
        body: "영어Ⅱ 1·2차 정기시험은 모두 선다형, 단답형이고 성취기준도 [12영Ⅱ-01-01]~[01-05]와 [02-01]로 같게 적혀 있습니다. 서논술형 30%는 영상 시청 후 의견 작성 10%와 주장하는 글쓰기 20%의 합입니다. 진도표는 8~9월 Lesson 1·2, 10~11월 Lesson 3·4, 12월 이후 Lesson 5 순입니다.",
      },
      {
        title: "영어Ⅱ 수행평가의 배점 구성",
        body: "토론·인터뷰는 Pop Culture 개념 이해 등 다섯 요소가 20점씩입니다. 영상 과제는 6개 질문의 세부 정보 파악 60점, 의견 표현 20점, 주제·요지 20점이고, 글쓰기는 150단어 이상 기준의 과제 완성도 40점, 근거 3개 이상을 요구하는 내용의 적절성 40점, 어휘 및 문법 정확성 20점입니다.",
      },
      {
        title: "영어 발표와 토론은 발표 요건이 구체적입니다",
        body: "8월 서술형은 발표 원리 4문항 40점과 토론 원리 6문항 60점입니다. 10월 사회 변화 발표는 시각 자료 3장 이상으로 3~4분을 채울 때 자료 활용 및 발표 구성 25점을 받고, 9월 청중 행동 변화 발표는 2~3분 분량이 기준입니다. 토론은 4회의 발언 기회를 기준으로 참여도와 주장·근거를 채점합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  {
    schoolSlug: "andongyeoja-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ", "기하"],
    summary: "미적분Ⅰ·기하 모두 정기시험 2회 60%(회차별 서·논술형 20점) · 수행 2개 40%",
    intro:
      "2학년 수학 가운데 미적분Ⅰ과 기하는 정기시험 1·2차가 30%씩, 수행평가 2개가 20%씩이고 서·논술형 반영 비율도 32%로 같습니다. 안동여고 상담에서는 미적분Ⅰ의 10~12월 탐구 과제 두 개와, 기하의 이차곡선 서술 과제·벡터 프로젝트를 시험 범위와 맞춰 보는 일이 첫 순서입니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형 80점(24%)·서·논술형 20점(6%)", course: "미적분Ⅰ" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형 80점(24%)·서·논술형 20점(6%)", course: "미적분Ⅰ" },
      { name: "일상생활 속 수학적 원리 탐구 및 창의적 산출물 제작", kind: "task", weight: 20, timing: "10월~12월", method: "서술·논술", course: "미적분Ⅰ" },
      { name: "수학적 사고 확장을 위한 독서 탐구 프로젝트", kind: "task", weight: 20, timing: "10~12월", method: "서술·논술, 프로젝트", course: "미적분Ⅰ" },
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월~10월", method: "선다형 80점(24%)·서·논술형 20점(6%)", course: "기하" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선다형 80점(24%)·서·논술형 20점(6%)", course: "기하" },
      { name: "공학도구를 활용한 이차곡선 관찰, 질문, 증명하기", kind: "task", weight: 20, method: "서술·논술", course: "기하" },
      { name: "벡터의 연산을 이용하여 감정 표현하기", kind: "task", weight: 20, timing: "10~11월", method: "프로젝트", course: "기하" },
    ],
    notes: [
      {
        title: "미적분Ⅰ의 시험 범위",
        body: "미적분Ⅰ 1차의 성취기준은 [12미적Ⅰ-01-01]~[02-08]로 극한·연속과 미분, 2차는 [02-07]~[03-06]으로 증감·극대극소와 그래프, 방정식·부등식 활용, 부정적분·정적분입니다. 서·논술형 평가 반영 비율 32%는 1차 6%, 2차 6%, 첫 번째 수행평가 20%를 합한 값으로 표에 적혀 있습니다.",
      },
      {
        title: "미적분Ⅰ 수행평가 두 개의 채점 요소",
        body: "일상생활 속 수학적 원리 탐구는 수학적 모델링 30점, 수학 개념 이해 30점, 표현 및 전달 20점, 완성도 20점입니다. 독서 탐구 프로젝트는 수학 관련 도서에서 미적분 개념을 찾아 탐구 질문을 세우는 과제로, 수학 개념 이해 30점, 탐구의 심화 및 확장 30점, 표현 및 전달 20점, 완성도 20점입니다.",
      },
      {
        title: "기하는 범위와 과제가 단원별로 갈립니다",
        body: "기하 1차는 이차곡선과 공간도형([12기하01-01]~[02-03]), 2차는 공간좌표와 벡터([02-04]~[03-05])입니다. 이차곡선 과제는 관찰 결과 작성 30점, 질문 도출 30점, 공식·대입 증명 40점이고, 벡터 과제는 덧셈·뺄셈·실수배로 감정을 표현하는 세 활동을 30점씩, 상황 표현력 및 시각화 10점으로 봅니다.",
      },
    ],
    sources: [schoolInfoPlanSource("안동여자고등학교")],
  },
  // ───────────────────────── 1학년 ─────────────────────────
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차 정기시험 30%씩 · 마찰력 비교 실험 20% · 변화하는 달의 위상 표현하기 20%(과정중심평가)",
    intro:
      "경안여자중학교 1학년 과학의 수행평가는 마찰력 비교 실험과 달의 위상 표현이 각각 20%이고, 정기시험은 두 번 모두 선택형입니다. 두 과제 모두 평가 요소 네 가지가 25점씩이라, 상담에서는 10월 실험의 사전 계획표와 11월 달의 위상 그리기의 준비 순서부터 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "마찰력 비교하기",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "실험·실습 및 서·논술형평가 · 사전 계획, 수행, 기록, 결과 분석 및 서술",
      },
      {
        name: "변화하는 달의 위상 표현하기",
        kind: "task",
        weight: 20,
        timing: "11월",
        method: "과정중심평가 · 위상 그림, 명칭, 순서, 원리 설명",
      },
    ],
    notes: [
      {
        title: "마찰력 실험은 계획·수행·기록·분석이 25점씩",
        body: "10월 마찰력 비교는 [9과05-02]가 성취기준이며, 사전 계획표(물체 2개, 재질·표면 상태 2개, 예상 순위 2개의 6칸), 실험 수행, 11개 항목의 데이터 기록표, 5개 항목의 결과 분석·서술에 각각 25점이 배정됩니다. 분석은 실험 결과를 과학 개념에 맞게 기재한 항목 수로 단계가 갈립니다.",
      },
      {
        title: "달의 위상은 그림·명칭·순서·원리 설명",
        body: "11월 달의 위상 표현하기는 [9과07-04]를 근거로 위상 그림의 정확성, 위상 명칭 표기, 위상 순서 배열, 태양-지구-달의 위치를 근거로 한 원리 설명에 같은 25점 배점을 둡니다. 앞의 세 요소는 8~6단계, 5~3단계, 2단계 이하를 정확히 해낸 정도로 단계를 나눕니다.",
      },
      {
        title: "정기시험 성취기준은 힘과 태양계가 양쪽에 걸칩니다",
        body: "1차 성취기준은 [9과05-01]·[9과05-02]·[9과07-01]·[9과07-02]로 힘의 표시와 평형, 중력·탄성력·마찰력·부력, 태양계 천체, 태양 활동입니다. 2차는 알짜힘과 운동 상태, 기체의 압력과 부피, 지구의 자전·공전, 달의 위상과 일식·월식을 다룹니다. 마찰력 과제는 1차, 달의 위상 과제는 2차 시험 목록에 같은 성취기준이 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차 정기시험 30%씩 · My Grammar Journal 20%(포트폴리오) · 세계의 음식 소개 글쓰기 20%(서·논술형)",
    intro:
      "경안여자중학교 1학년 영어는 Lesson 5~8과 Special Lesson으로 진행되고, 수행평가 두 영역이 모두 직접 써서 내는 과제입니다. 9월부터 11월까지 이어지는 포트폴리오와 10~11월 글쓰기가 겹치므로, 상담에서는 Lesson 7 진도와 두 과제의 마감 시점을 먼저 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "My Grammar Journal 작성",
        kind: "task",
        weight: 20,
        timing: "9월~11월",
        method: "포트폴리오 · 어법 찾기, 의미와 형태 설명, 예문 쓰기",
      },
      {
        name: "세계의 음식 소개 글쓰기",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "서·논술형 · 문장, 사실적 정보, 어휘·어법·철자, 이미지와 출처",
      },
    ],
    notes: [
      {
        title: "Journal 점수의 60%는 예문 쓰기에 있습니다",
        body: "My Grammar Journal은 글에 사용된 6개 어법을 찾아 제시하기 20점, 의미와 형태 설명하기 20점, 어법을 활용한 예문 쓰기 60점으로 짜여 있습니다. 예문은 6개 어법 중 5~6개를 정확하고 적절하게 활용해 상황과 목적에 맞고 의미가 명확해야 60점이어서, 배점이 쓰기 쪽에 몰려 있습니다.",
      },
      {
        title: "음식 소개 글은 네 요소를 30·30·30·10으로 채점",
        body: "세계의 음식 소개 글쓰기는 주제와 목적에 맞는 문장 5개, 음식에 관한 사실적 정보 4가지, 어휘·어법·철자 오류가 0~1개인 정확성이 30점씩이고, 이미지와 출처 제시가 10점입니다. 진도표의 Lesson 7 활동에도 이미지 활용, 출처 제시, 정보 윤리와 저작권 준수가 함께 적혀 있습니다.",
      },
      {
        title: "시험 성취기준과 수행평가 번호가 겹칩니다",
        body: "정기시험 성취기준은 1차가 세부 정보·논리적 관계·의도 추론 등 듣기·읽기 중심의 [9영01-02]·[9영01-04]·[9영01-06]~[9영01-08]과 [9영02-02]~[9영02-04], 2차가 [9영02-05]~[9영02-11]입니다. 수행평가의 [9영02-03]은 1차 목록에, [9영02-09]·[9영02-10]은 2차 목록에도 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },

  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차 정기시험 30%씩 · 사연 쓰기 20%(서·논술형) · 노래 찾기 10% · 광고 평가하기 10%",
    intro:
      "경안여자중학교 2학년 국어는 수행평가 세 가지 중 사연 쓰기만 서·논술형이고 20%를 차지합니다. 노래 찾기와 광고 평가하기가 10%씩이어서, 상담에서는 사연 쓰기의 독서일지·개요·본문 세 부분을 어떻게 마감할지부터 점검합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "등장인물의 입장에서 사연 쓰기",
        kind: "task",
        weight: 20,
        method: "서·논술형 · 독서일지, 사연의 개요, 사연 작성",
      },
      {
        name: "사회·문화적 상황이 드러나는 노래 찾기",
        kind: "task",
        weight: 10,
        method: "포트폴리오 · 노랫말과 관련 사회·문화적 상황 파악",
      },
      {
        name: "광고 평가하기",
        kind: "task",
        weight: 10,
        timing: "9~10월",
        method: "광고의 표현 방법과 제작자 의도 평가",
      },
    ],
    notes: [
      {
        title: "사연 쓰기는 세 부분의 충실도로 단계가 갈립니다",
        body: "등장인물의 입장에서 사연 쓰기는 [9국05-05]와 [9국01-04]가 성취기준이고, 평가 요소는 '상대방의 감정과 입장에 공감하기' 하나입니다. 독서일지 항목, 사연의 개요, 사연 본문을 모두 충실히 쓰면 100점, 미흡한 부분이 한 곳이면 80점, 두 곳이면 60점, 세 곳이면 40점입니다.",
      },
      {
        title: "노래 찾기와 광고 평가하기의 100점 기준",
        body: "노래 찾기는 사회·문화적 상황이 드러나는 노랫말 전체를 쓰고 그 상황과 노래가 사회에 전하는 의미를 파악하면 100점이며, 노랫말을 일부만 쓰면 60점 이하입니다. 광고 평가하기는 표현 방법·제작자 의도·내용의 타당성·표현의 적절성·적절한 자료 다섯 가지 중 부족한 부분이 하나면 80점입니다.",
      },
      {
        title: "정기시험 성취기준은 단원별로 나뉩니다",
        body: "1차 성취기준은 작품에 반영된 사회·문화적 상황 감상([9국05-05]), 공감하며 대화하기([9국01-04]), 음운 체계와 문자 체계([9국04-01])입니다. 2차는 복합양식 글 읽기([9국02-04])와 쓰기([9국03-07]), 반어·풍자·역설 창작([9국05-06]), 영상매체자료 제작([9국06-03])으로 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "1·2차 정기시험 30%씩 · 타이포셔너리 20%(제작형) · 양차 세계대전 분석 글쓰기 20%(서·논술형)",
    intro:
      "경안여자중학교 2학년 사회과 평가는 역사 과목이며, 정기시험은 선택형 60%, 수행평가는 제작형과 서·논술형이 20%씩입니다. 9~10월 타이포셔너리는 시민 혁명·산업화·제국주의 단원, 11~12월 글쓰기는 세계대전 단원이 범위여서 상담에서는 단원별 일정을 나란히 놓습니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "타이포셔너리",
        kind: "task",
        weight: 20,
        timing: "9~10월",
        method: "기타(제작형 평가) · 개념 구조화, 시각화, 표현 의도 설명",
      },
      {
        name: "양차 세계대전에 대한 사고력 분석 글쓰기",
        kind: "task",
        weight: 20,
        timing: "11~12월",
        method: "서·논술형 평가",
      },
    ],
    notes: [
      {
        title: "타이포셔너리는 구조화 30점, 시각화 40점, 설명 30점",
        body: "타이포셔너리는 주제와 관련된 역사 용어와 인과관계를 마인드맵으로 구조화하기 30점, 키워드를 시각적 상징과 기호로 표현하기 40점, 표현 의도를 구체적 역사 용어와 인과관계로 설명하기 30점입니다. 시각화 항목의 20점 단계에 역사적 의미 없이 단순 도식화·미술적 표현에 그친 경우가 적혀 있어, 그림 자체보다 역사적 의미와의 연결이 기준입니다.",
      },
      {
        title: "세계대전 글쓰기는 전쟁 범죄 성찰이 40점",
        body: "양차 세계대전 글쓰기는 1차 세계대전의 원인과 세계 질서 변화 30점, 2차 세계대전의 배경과 전개 과정 30점, 전쟁 범죄 성찰과 인권·평화 실현 노력 40점으로 채점합니다. 마지막 항목의 최고 단계는 전쟁 범죄 사례를 비판적으로 평가하고 오늘날 평화의 의미까지 논리적으로 서술한 경우입니다.",
      },
      {
        title: "정기시험 성취기준은 4단원에서 7단원까지",
        body: "1차 성취기준은 [9역04-02]·[9역04-03], [9역05-01]~[9역05-03], [9역06-01]이고, 2차는 [9역05-03], [9역06-01]~[9역06-03], [9역07-01]~[9역07-03]입니다. 진도는 8월 Ⅳ. 지역 세계의 교류와 변화에서 12월 Ⅶ. 현대 세계의 전개와 과제까지 이어지며, 2차 범위에는 전쟁 범죄·민족 운동·냉전·세계화가 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1·2차 정기시험 30%씩 · 문제해결 서술형 20%(9월·12월) · 내심·외심 작도 10% · 배움기록장 10%",
    intro:
      "경안여자중학교 2학년 수학 수행평가는 내심·외심 작도 10%, 문제해결 서술형 20%(9월·12월 두 번), 수학배움기록장 10%입니다. 정기시험은 1차가 삼각형·사각형의 성질, 2차가 닮음·피타고라스 정리·확률이어서, 상담에서는 서술형 두 번과 시험 범위를 한 장의 일정으로 맞춥니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "삼각형의 내심과 외심 작도",
        kind: "task",
        weight: 10,
        timing: "9월",
        method: "프로젝트 · 내심과 외심을 이해하고 작도하기",
      },
      {
        name: "문제해결 서술형",
        kind: "task",
        weight: 20,
        timing: "9월, 12월(2회)",
        method: "서·논술형 · 풀이 과정을 논리적으로 서술하고 정답 찾기",
      },
      {
        name: "수학배움기록장",
        kind: "task",
        weight: 10,
        timing: "9~12월",
        method: "포트폴리오 · 단원별 핵심 내용 작성과 문제 해결",
      },
    ],
    notes: [
      {
        title: "작도 과제의 100점은 40·30·30으로 나뉩니다",
        body: "삼각형의 내심과 외심 작도는 [9수03-10]에 따라 성질의 이해 및 정당화 40점, 내심과 내접원 작도 30점, 외심과 외접원 작도 30점입니다. 작도 쪽은 이등분선 또는 수직이등분선, 교점 표시, 원 그리기가 각각 10점이고, 교점을 찾고도 기호 표시가 빠지면 5점으로 내려갑니다.",
      },
      {
        title: "서술형은 열 개 문항군이 10점씩입니다",
        body: "문제해결 서술형의 채점표는 이등변삼각형, 직각삼각형의 합동, 평행사변형 두 항목, 사각형 사이의 관계, 평행선과 선분의 길이의 비, 무게중심, 경우의 수·확률 세 항목으로 10개 문항군이 10점씩입니다. 대부분의 문항군에 풀이 과정 서술 점수와 정답 점수가 따로 정해져 있습니다.",
      },
      {
        title: "배움기록장은 개념과 문제를 함께 채점",
        body: "수학배움기록장은 삼각형의 성질, 사각형의 성질, 닮음과 평행선 사이의 선분의 길이비, 무게중심과 피타고라스 정리, 경우의 수와 확률 다섯 영역이 20점씩입니다. 영역마다 [개념] 핵심 개념을 오류 없이 쓰고 [문제] 주어진 문제의 80% 이상을 올바른 풀이로 해결해야 20점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "1·2차 정기시험 30%씩 · 광합성 서술형 15% · 전압·전류 서술형 15% · AI 소화계 노래 10%",
    intro:
      "경안여자중학교 2학년 과학은 서술형 수행평가 두 개가 15%씩이고, 둘 다 센서로 얻은 데이터를 표나 그래프로 정리해 결론을 쓰는 과제입니다. 상담에서는 센서 측정값을 그래프로 옮기고 결론까지 쓰는 순서를 8~9월 광합성, 9~10월 전압·전류 일정에 맞춰 짭니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9~10월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "인공지능을 활용한 소화계 노래 만들기",
        kind: "task",
        weight: 10,
        timing: "10~11월",
        method: "프로젝트 · 소화계 개념, AI 활용 가사, 발표와 상호 평가",
      },
      {
        name: "광합성에 필요한 물질과 생산된 물질 알아보기",
        kind: "task",
        weight: 15,
        timing: "8~9월",
        method: "서술형 · 센서 데이터 분석과 결론 작성",
      },
      {
        name: "전압과 전류 사이의 관계 알아보기",
        kind: "task",
        weight: 15,
        timing: "9~10월",
        method: "서술형 · 전압·전류 측정, 그래프 작성, 결과 해석",
      },
    ],
    notes: [
      {
        title: "광합성 과제는 산소·이산화 탄소 센서 데이터를 읽습니다",
        body: "광합성에 필요한 물질과 생산된 물질 알아보기는 [9과12-01] 범위로, 장치 구성과 디지털 센서 활용, 데이터 분석과 그래프 해석, 원리 도출과 결론 작성, 탐구 의지와 생명 존중 실천에 25점씩 배정됩니다. 최고 단계는 투명 밀폐 장치에 두 기체 센서를 연결해 10분 동안 안정적으로 데이터를 모으고 농도 변화를 수치로 설명하는 것입니다.",
      },
      {
        title: "전압·전류 과제는 니크롬선 두 종류를 측정합니다",
        body: "전압과 전류 사이의 관계 알아보기([9과14-02])는 장치 구성, 데이터 측정·기록, 그래프 작성, 결과 해석이 25점씩입니다. 짧은 니크롬선과 긴 니크롬선 모두 전압을 1V씩 올려 0V에서 4V까지 전류를 A 단위로 재고, 가로축 전압·세로축 전류 그래프에 두 선을 구분해 추세선까지 그려야 최고 단계입니다.",
      },
      {
        title: "소화계 노래 배점과 정기시험 일정",
        body: "소화계 노래는 과학 개념의 정확성 30점, AI 활용과 가사 창의성 20점, 발표와 상호 평가 20점, 기관계 간 상호작용 및 체계성 30점이며 동료평가가 포함됩니다. 진도표에는 1차 정기시험이 9월 28일~10월 1일(Ⅴ·Ⅶ단원), 2차가 12월 8~10일(Ⅵ·Ⅷ단원)로 적혀 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1·2차 정기시험 30%씩 · 읽기 포트폴리오 20% · 꿈(미래 직업) 에세이 20%(서·논술형)",
    intro:
      "경안여자중학교 2학년 영어의 수행평가는 읽기 포트폴리오와 미래 직업 에세이가 20%씩이고, 에세이에는 관계대명사와 수동태가 필수 언어 형식으로 제시됩니다. 상담에서는 에세이의 10문장 이상 기준과 서론·본론·결론 다섯 항목을 먼저 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "친숙한 주제에 대한 글을 읽고 질의 응답을 통해 글의 주제 및 세부정보 파악하는 포트폴리오 작성",
        kind: "task",
        weight: 20,
        timing: "8~12월(수시)",
        method: "포트폴리오",
      },
      {
        name: "“자신의 꿈(미래 직업)”에 대한 에세이 쓰기",
        kind: "task",
        weight: 20,
        timing: "8~12월",
        method: "서·논술형 · 서론·본론·결론 5개 항목과 제시된 언어 형식 2가지",
      },
    ],
    notes: [
      {
        title: "에세이는 25점짜리 기준 네 개",
        body: "미래 직업 에세이는 글의 구성(10문장 이상이 25점), 내용의 적절성과 구체성, 언어사용(모든 문장을 완성형으로), 조건충족이 같은 비중의 네 기준입니다. 내용은 서론의 꿈과 계기, 본론의 직업 특징·원하는 이유·노력과 계획, 결론의 다짐과 미래의 모습 등 5개 항목을 모두 채워야 25점입니다.",
      },
      {
        title: "조건충족은 관계대명사와 수동태 두 가지",
        body: "조건충족 25점은 제시된 언어 형식 2가지(관계대명사, 수동태)를 오류 없이 쓰면 25점, 두 가지를 쓰되 약간의 오류가 있으면 20점, 한 가지만 오류 없이 쓰면 15점입니다. 진도표에는 11월 Lesson 8 행에 이 에세이가 서·논술형 수행평가 연계로 적혀 있습니다.",
      },
      {
        title: "포트폴리오는 분량 비율과 글의 질을 함께 봅니다",
        body: "읽기 포트폴리오는 완성도, 내용의 적절성과 구체성, 언어사용, 글의 구성이 각각 25점이고, 완성도는 전체 분량 대비 작성한 비율로 매겨 90% 이상이 25점입니다. 성취기준 [9영02-01]~[9영02-06]은 1차 시험의 말하기·쓰기 성취기준과, 에세이의 [9영02-07]~[9영02-11]은 2차 시험의 번호와 같습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "1·2차 정기시험 30%씩 · 독서 감상문 20%(서·논술형) · 책 대화 20%(과정 중심)",
    intro:
      "경안여자중학교 3학년 국어는 독서 감상문과 책 대화가 모두 10~11월에 진행되고, 두 영역이 같은 [9국02-01]·[9국05-01] 성취기준을 씁니다. 정기시험은 선택형 두 번이 60%여서, 상담에서는 같은 시기의 두 결과물과 2차 시험 범위를 한 일정에 놓고 봅니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월-10월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월", method: "선택형" },
      {
        name: "독서 감상문",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "서·논술형 · 책과 관련된 삶과 경험을 쓴 감상문",
      },
      {
        name: "책 대화",
        kind: "task",
        weight: 20,
        timing: "10월~11월",
        method: "과정 중심 · 제시된 항목에 맞게 작성",
      },
    ],
    notes: [
      {
        title: "독서 감상문은 내용 50점, 표현 및 구성 50점",
        body: "내용의 최고 단계는 책과 관련된 자신의 삶과 경험을 구체적이고 진솔하게 쓰고 감상문의 주제가 분명한 글입니다. 표현 및 구성에는 글을 고쳐 쓰는 과정과 쓰기 윤리 준수가 들어 있어, 고쳐쓰기를 하지 않은 경우는 20점 단계로 내려갑니다.",
      },
      {
        title: "책 대화는 제시 항목 다섯 가지를 채우는 형식",
        body: "책 대화도 내용 50점과 형식 50점입니다. 수행 과제에 등장인물 탐구, 인상 깊은 구절과 장면, 자신의 경험, 새로 알게 된 점, 궁금한 점이 제시 항목으로 적혀 있고, 내용의 최고 단계는 이 항목들을 모두 쓴 경우입니다. 평가 방법 칸에는 기타가 체크되어 있습니다.",
      },
      {
        title: "정기시험 성취기준은 읽기·토론에서 설득·통일 시대 국어로",
        body: "1차 성취기준은 읽기와 문제 해결([9국02-01]), 토론에서 논박하기([9국01-05]), 음운의 체계([9국04-02]), 문학 활동([9국05-01])입니다. 2차에는 설득 전략을 분석하며 듣기([9국01-09]), 과거의 삶이 반영된 작품 감상([9국05-06]), 근거를 들어 글쓰기([9국03-04]), 통일 시대의 국어([9국04-09])가 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "1차 10월·2차 11월 정기시험 30%씩 · 환율 변동 분석 20%(프로젝트) · 가상 여행 일기 20%(서·논술형)",
    intro:
      "경안여자중학교 3학년 사회에서 환율 변동 분석은 8월, 가상 여행 일기는 9~10월에 평가하고, 정기시험은 1차 10월과 2차 11월로 이어집니다. 상담에서는 도시 단원의 일기 과제가 1차 시험 범위와 겹치는 점을 먼저 짚습니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월", method: "선택형" },
      {
        name: "환율의 변동 분석하기",
        kind: "task",
        weight: 20,
        timing: "8월",
        method: "프로젝트 · 외화의 수요·공급 변동과 환율 변화 분석",
      },
      {
        name: "가상 여행 일기 작성하기",
        kind: "task",
        weight: 20,
        timing: "9~10월",
        method: "서·논술형 · 도시 선정, 특색 소개, 정보의 구체적 반영",
      },
    ],
    notes: [
      {
        title: "환율 분석은 네 항목이 25점씩",
        body: "환율의 변동 분석하기는 [9사(일사)10-03]을 근거로 외화의 수요·공급 변동 분석, 변동 요인 분석, 수요·공급 그래프를 정확한 방향으로 이동시키기, 환율 변화(상승·하락) 예측이 25점씩입니다. 네 항목 모두 4개를 정확히 해내면 25점이고, 하나 줄 때마다 5점씩 내려갑니다.",
      },
      {
        title: "가상 여행 일기는 일정과 활동 서술이 40점",
        body: "가상 여행 일기는 [9사(지리)08-01]에 따라 도시 선정의 적절성 30점, 도시 특색 소개 30점, 도시 정보의 구체적 반영 40점으로 채점합니다. 마지막 항목은 도시의 특징과 여행 일정 및 활동을 구체적이고 충실하게 서술해야 40점이라, 가장 큰 배점이 일정과 활동 서술에 있습니다.",
      },
      {
        title: "시험 범위는 국제 관계·인구에서 도시·경제·환경으로",
        body: "1차 성취기준은 환율([9사(일사)10-03]), 국제 사회([9사(일사)11-01]~[9사(일사)11-03]), 인구([9사(지리)07-01]~[9사(지리)07-03])와 도시 단원 앞부분이고, 2차는 도시 문제, 글로벌 경제 활동, 환경 문제에 걸친 [9사(지리)08-02]~[9사(지리)10-03]입니다. [9사(지리)08-02]는 두 시험에 모두 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "1차 9월·2차 11월 정기시험 30%씩 · 문제 해결 서술형 20% · 삼각비 직소퍼즐 10% · 배움기록장 10%",
    intro:
      "경안여자중학교 3학년 수학의 수행평가는 문제 해결 서술형 20%, 삼각비 직소퍼즐 10%, 수학배움기록장 10%입니다. 서술형이 9~10월 두 번이라 상담에서는 1차 정기시험(9월)과 겹치는 삼각비 서술 준비와 10월 원의 성질 서술 준비를 나눠 잡습니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월", method: "선택형" },
      {
        name: "문제 해결 서술형",
        kind: "task",
        weight: 20,
        timing: "9~10월(2회)",
        method: "서술형평가 · 풀이 과정을 논리적으로 서술하고 정답 찾기",
      },
      {
        name: "삼각비 직소퍼즐",
        kind: "task",
        weight: 10,
        timing: "9월",
        method: "프로젝트 · 삼각비 문제를 해결해 직소퍼즐 완성하기",
      },
      {
        name: "수학배움기록장",
        kind: "task",
        weight: 10,
        timing: "8~11월",
        method: "포트폴리오 · 단원별 핵심 내용 작성과 문제 해결",
      },
    ],
    notes: [
      {
        title: "서술형은 9월 삼각비 50점, 10월 원의 성질 50점",
        body: "문제 해결 서술형은 9월분이 삼각비의 뜻·활용·삼각비표 문항군 다섯 개, 10월분이 현의 성질, 원주각의 성질, 접선과 현이 이루는 각 문항군 다섯 개이며 각각 10점씩 합쳐 100점입니다. 문항마다 식을 세운 경우 3점, 값을 구한 경우 2점처럼 단계별 점수가 정해져 있습니다.",
      },
      {
        title: "직소퍼즐은 핵심 내용 30, 해결력 30, 완성도 40",
        body: "삼각비 직소퍼즐은 사인·코사인·탄젠트의 뜻과 특수한 각의 삼각비 값 같은 핵심 내용 30점, 삼각비 값을 구하는 문제의 해결 비율 30점(80% 이상이 만점 단계), 타지아벨 직소퍼즐의 완성도 40점입니다. 성취기준은 [9수04-17]·[9수04-18]입니다.",
      },
      {
        title: "통계는 2차 시험 목록과 배움기록장에만 있습니다",
        body: "수학배움기록장은 삼각비, 원과 직선, 원주각, 대푯값과 산포도, 상관관계 다섯 영역이 20점씩입니다. 정기시험 성취기준은 1차가 [9수04-17]~[9수04-19], 2차가 [9수04-19]·[9수04-20]과 통계 [9수05-06]~[9수05-08]이라, 통계는 1차 목록에 없고 2차 목록에만 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  {
    schoolSlug: "gyeonganyeoja-middle-school",
    grade: 3,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "1차 9~10월·2차 11월 정기시험 30%씩 · 좌우명 포스터 글쓰기 20%(서·논술형) · 학습노트 20%",
    intro:
      "경안여자중학교 3학년 영어는 학습노트를 8월부터 11월까지 20회에 걸쳐 모으고, 좌우명 포스터 글쓰기는 10월에 한 번 평가합니다. 상담에서는 노트의 어휘·듣기·말하기·문법·리딩 다섯 영역이 단원마다 쌓이는 방식과 포스터의 10문장 이상 조건을 먼저 확인합니다.",
    assessments: [
      { name: "1차 정기시험", kind: "exam", weight: 30, timing: "9~10월", method: "선택형" },
      { name: "2차 정기시험", kind: "exam", weight: 30, timing: "11월", method: "선택형" },
      {
        name: "자신의 좌우명을 포스터로 완성하고 소개하는 글쓰기",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "서·논술형 · 내용, 구성, 언어사용, 조건충족",
      },
      {
        name: "핵꿀잼English 학습노트 제작하기",
        kind: "task",
        weight: 20,
        timing: "8월~11월(20회)",
        method: "포트폴리오 · 5~8단원 활동지",
      },
    ],
    notes: [
      {
        title: "포스터 글쓰기는 25점짜리 네 기준",
        body: "좌우명 포스터 글쓰기의 배점은 내용의 적절성과 구체성, 구성(도입부-본문-정리부), 언어사용, 조건충족 각 25점입니다. 조건충족은 10문장 이상, 각 문장 7단어 이상, 대소문자 규칙, 문장부호의 네 가지를 모두 지켜야 25점이고, 내용·구성·언어사용의 0점 단계에는 AI를 활용해 내용을 그대로 베끼거나 작성하지 않은 경우가 들어 있습니다.",
      },
      {
        title: "학습노트는 다섯 영역을 단원마다 5점씩 쌓습니다",
        body: "핵꿀잼English 학습노트는 어휘, 듣기·말하기, 문법, 리딩1, 리딩2가 영역별 20점입니다. 5~8단원마다 영역당 활동지를 모두 완성하면 5점, 일부 미완성이면 3점, 빈약하거나 미제출이면 1점이고, 학습지는 항목별 수업 활동이 끝난 뒤 바로 확인한다고 적혀 있어 단원마다 마감이 돌아옵니다.",
      },
      {
        title: "시험 표시는 Lesson 5·6과 7·8 묶음에 있습니다",
        body: "진도표에서 1차 정기시험은 Lesson 5·6 묶음, 2차는 Lesson 7·8 묶음에 표시되어 있고 두 시험 모두 성취기준이 [9영03-01]~[9영03-09]로 같게 적혀 있습니다. 2차 이후 11월부터 12월까지는 Special lesson으로 학기 정리와 성찰, 개별 배움과 성장 보고서 작성 활동이 이어집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("경안여자중학교")],
  },
  // 28차 충북 청주 상당구 탑대성동(일신여고·일신여중) — 학교알리미 2026-2 평가계획
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통국어2"],
    summary: "중간·기말 각 25%(선택형) · 수행 3개 50%(독서 보고서 30%·발표 10%·성장 기록 10%)",
    intro:
      "일신여자고등학교 1학년 공통국어2는 중간·기말고사가 각 25%로 모두 선택형이고, 수행평가 세 과제가 합쳐 50%입니다. 서·논술형은 9~10월 독서 보고서(30%)에만 있어서, 상담에서는 보고서와 발표 일정부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 25, timing: "9월", method: "선택형 100점" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월", method: "선택형 100점" },
      { name: "주제 통합적 독서 보고서 작성하기", kind: "task", weight: 30, timing: "9~10월", method: "서·논술, 포트폴리오" },
      { name: "청중을 고려하여 발표하기", kind: "task", weight: 10, timing: "9~10월", method: "구술‧발표" },
      { name: "배움과 성장 기록하기", kind: "task", weight: 10, timing: "8~12월", method: "프로젝트, 포트폴리오" },
    ],
    notes: [
      {
        title: "서·논술형은 독서 보고서 한 곳에 모입니다",
        body: "평가 비율표의 서·논술형 행에서 중간·기말고사는 각각 0%이고, 주제 통합적 독서 보고서 30%만 서·논술 방식으로 표시되어 있습니다. 정기시험은 두 회 모두 선택형 100점이어서, 글로 쓰는 평가는 9~10월 보고서 하나에 집중되어 있는 구조입니다.",
      },
      {
        title: "보고서는 조건 8개를 몇 개 채웠는지로 채점됩니다",
        body: "독서 보고서는 제시된 조건 8개를 모두 충족하면 30점이고, 하나 줄 때마다 3점씩 낮아집니다. 조건에는 서로 다른 관점과 형식의 글(자료)을 두 가지 이상 제시했는지, 비교·분석 과정이 드러나는지, 읽기 과정 활동지를 모두 작성해 제출했는지가 들어 있어 수업 중 활동지 작성이 점수와 직접 이어집니다.",
      },
      {
        title: "독서 활동에서 보고서와 발표가 이어집니다",
        body: "진도표에는 8월 3주에 주제 통합적 독서 활동 계획이, 10월 4주에 매체를 활용한 독서 결과 발표가 수행평가로 적혀 있어 보고서(30%)와 발표(10%)가 독서 활동과 맞물려 있음을 알 수 있습니다. 발표 채점 조건에는 청중 특성 고려, 매체 자료 활용, 정해진 발표 시간 준수가 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통영어2"],
    summary: "중간·기말 각 25%(선택형) · 수행 3개 50%(에세이 20%·러닝로그 20%·듣기 10%)",
    intro:
      "심화탐구 에세이, 자기주도 러닝로그, 듣기 평가가 수행평가 50%를 이루고 정기시험은 선택형 25%씩인 것이 일신여자고등학교 1학년 공통영어2의 구성입니다. 서·논술형 40%가 수행평가 두 과제에 있어, 에세이 영작 일정과 러닝로그 작성부터 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 25, timing: "9월", method: "선택형 100점 만점" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월", method: "선택형 100점 만점" },
      { name: "심화탐구 에세이", kind: "task", weight: 20, timing: "10월~11월", method: "서·논술" },
      { name: "자기주도 러닝로그", kind: "task", weight: 20, method: "서·논술, 포트폴리오" },
      { name: "듣기 평가", kind: "task", weight: 10, timing: "9월", method: "시·도교육청 주관 영어듣기능력평가 일괄 평가" },
    ],
    notes: [
      {
        title: "서·논술형 40%는 모두 수행평가에 있습니다",
        body: "계획서는 서·논술형 쓰기 평가를 수행평가에서 시행하고 한 학기 환산점 100점 중 40%를 반영한다고 적고 있으며, 표에서는 심화탐구 에세이 20%와 자기주도 러닝로그 20%가 이에 해당합니다. 정기시험은 두 회 모두 선택형이고, 평가 유의 사항에는 필요에 따라 전국연합학력평가 기출문제와 외부 지문을 활용할 수 있다는 문장이 있습니다.",
      },
      {
        title: "에세이는 일곱 가지 구성 요소를 확인합니다",
        body: "심화탐구 에세이는 환경 문제의 원인 분석과 대안 제시에 초점을 둔 비판적 글쓰기입니다. 채점 요소는 제목, 서론 두 부분(문제 소개·실제 사례), 본론 세 부분(원인 분석·첫 번째 해결책·근거를 갖춘 두 번째 해결책), 결론 요약의 7가지이며, 만점 20점에서 충족하지 못한 요소 하나마다 2점이 빠집니다.",
      },
      {
        title: "러닝로그는 장수, 듣기는 정답 문항 수로 점수가 정해집니다",
        body: "자기주도 러닝로그는 수업 시간에 배운 내용을 바탕으로 학습 내용과 활동을 정리한 장수로 채점하며 7장이면 20점, 6장이면 18점입니다. 완성도가 미미한 페이지가 있으면 2점이 감점됩니다. 듣기 평가(10%)는 시·도교육청 주관 평가에 따라 일괄 시행하며 20문항을 모두 맞히면 10점, 18~19문항이면 9점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["공통수학2"],
    summary: "중간·기말 각 20% · 수행 4개 60%(문제 만들기 20·에듀테크 15·팀 프로젝트 15·학습노트 10)",
    intro:
      "정기시험 두 번이 20%씩인 데 비해 수행평가 네 과제가 60%를 차지하는 것이 일신여자고등학교 1학년 공통수학2의 구성입니다. 서·논술형 20%는 문제 만들기에만 있어, 상담에서는 10월 수행 두 건과 회차별 단원 범위를 먼저 확인합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 20, timing: "9월", method: "선택형 100점" },
      { name: "기말고사", kind: "exam", weight: 20, timing: "12월", method: "선택형 100점" },
      { name: "문제 만들기", kind: "task", weight: 20, timing: "10월", method: "서·논술" },
      { name: "에듀테크 활용탐구", kind: "task", weight: 15, timing: "10월", method: "서·논술, 기타" },
      { name: "팀 프로젝트", kind: "task", weight: 15, timing: "11월", method: "서·논술, 구술‧발표, 토의‧토론, 프로젝트" },
      { name: "자기주도 학습노트", kind: "task", weight: 10, method: "서·논술, 포트폴리오" },
    ],
    notes: [
      {
        title: "서술형 풀이는 정기시험이 아니라 문제 만들기에서 봅니다",
        body: "서·논술형 행에서 중간·기말고사는 0%이고 문제 만들기 20%만 서·논술형으로 표시되어 있습니다. 진도표상 중간평가 전에는 평면좌표와 직선의 방정식, 원의 방정식, 도형의 이동이, 기말평가 전에는 집합과 명제, 함수와 그래프(합성함수·역함수·유리함수·무리함수)가 배치되어 두 회차의 단원이 나뉩니다.",
      },
      {
        title: "문제 만들기는 풀이 완성도의 배점이 가장 큽니다",
        body: "교과서 개념을 응용한 문제를 직접 만들고 풀이 과정을 서술하는 과제로, 20점은 개념을 복합적으로 활용한 문제인지(5점), 문제에 수학적 오류가 없는지(4점), 풀이가 논리적이고 오류가 없는지(8점), 문제와 풀이의 내용과 글씨가 명확한지(3점)로 나뉩니다. 진도표에는 10월 4주에 문제 만들기 평가가 적혀 있습니다.",
      },
      {
        title: "에듀테크 탐구는 10월, 팀 프로젝트는 11월입니다",
        body: "에듀테크 활용탐구(15%)는 주어진 조건에 맞는 그래프를 공학도구로 표현하는 과제로 진도표 10월 5주에, 팀 프로젝트(15%)는 11월 3주에 배치되어 있습니다. 팀 프로젝트의 채점 조건은 개념의 타당한 활용, 협업 참여, 1인 1내용 작성과 1인 1발표, 구조화, 내용의 일관성이며 5가지를 모두 충족하면 15점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2", "한국사2"],
    summary: "통합사회2 시험 50%·수행 3개 50% / 한국사2 시험 50%·수행 2개 50%(인물 인터뷰 30%)",
    intro:
      "일신여자고등학교 1학년 사회 영역은 통합사회2와 한국사2 모두 정기시험 50%, 수행평가 50%입니다. 수행평가는 통합사회2가 세 과제(20·15·15%), 한국사2가 글쓰기 20%와 인물 인터뷰 30%로 달라서 과목별 수행 일정부터 정리합니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 25, timing: "9월", method: "선택형 100점", course: "통합사회2" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월", method: "선택형 100점", course: "통합사회2" },
      { name: "인권 침해 사례 탐구하기", kind: "task", weight: 20, timing: "10월", method: "서·논술", course: "통합사회2" },
      { name: "정의의 시선으로 바라본 세상", kind: "task", weight: 15, timing: "10~11월", method: "프로젝트, 보고서", course: "통합사회2" },
      { name: "세계도시 탐구 보고서", kind: "task", weight: 15, timing: "10~11월", method: "프로젝트", course: "통합사회2" },
      { name: "중간고사", kind: "exam", weight: 25, timing: "9월", method: "선택형 100점", course: "한국사2" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월", method: "선택형 100점", course: "한국사2" },
      { name: "역사 주제 탐구 글쓰기", kind: "task", weight: 20, timing: "10월", method: "서·논술", course: "한국사2" },
      { name: "역사 인물 역할 인터뷰", kind: "task", weight: 30, timing: "11월", method: "구술‧발표, 프로젝트", course: "한국사2" },
    ],
    notes: [
      {
        title: "통합사회2는 10월 인권 사례 과제부터 시작합니다",
        body: "통합사회2 수행평가 중 서·논술형 20%는 10월 인권 침해 사례 탐구하기에만 있습니다. 내용 구성 10점은 사례 제시, 자료 분석, 헌법 조문 제시, 본인 의견 서술, 분량의 5가지 조건으로 채점되고, 의사소통 7점은 본인이 조사한 사례의 발표와 모둠원 사례 2가지 이상 정리를 봅니다. 기한 준수가 3점입니다.",
      },
      {
        title: "정의관 과제와 세계도시 보고서는 10~11월입니다",
        body: "정의의 시선으로 바라본 세상(15%)은 수업에서 배운 4가지 정의관을 한 사회 문제에 각각 적용해 해결 방안을 비교하는 과제이고, 조건 10개를 모두 충족하면 15점입니다. 세계도시 탐구 보고서(15%)는 4가지 질문(6점)과 지역화 전략 5가지 질문(6점)에 서술하고, 평가 시간 45분 안에 내면 기한 3점을 받습니다.",
      },
      {
        title: "한국사2 두 과제의 범위는 진도표 전체입니다",
        body: "한국사2는 진도표상 중간평가 전에 Ⅰ단원(일제의 식민지 지배 정책~일제 침략 전쟁과 광복을 위한 노력)이, 기말평가 전에 Ⅱ·Ⅲ단원이 배치됩니다. 10월 글쓰기와 11월 인물 인터뷰는 둘 다 Ⅰ-1부터 Ⅲ-3까지를 범위로 적혀 있고, 글쓰기는 500자 이상이어야 분량 5점을 받습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "중간·기말 각 30%(서·논술형 34점 포함) · 수행 2개 40%(자유탐구 발표·과학 쟁점 토론)",
    intro:
      "일신여자고등학교 1학년 통합과학2는 중간·기말고사가 각 30%이고 회차마다 100점 중 34점이 서·논술형이며, 수행평가는 자유탐구주제 발표와 사회적 쟁점 토론이 20%씩입니다. 상담에서는 서술형 답안 작성과 10월 수행 두 건을 함께 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월", method: "선택형 66점·서·논술형 34점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 66점·서·논술형 34점" },
      { name: "자유탐구주제 발표", kind: "task", weight: 20, timing: "10월", method: "구술‧발표, 토의‧토론" },
      { name: "과학 기술 및 과학 관련 사회적 쟁점 토론", kind: "task", weight: 20, timing: "10월", method: "토의‧토론, 프로젝트, 기타" },
    ],
    notes: [
      {
        title: "서·논술형이 정기시험 안에 들어 있습니다",
        body: "중간·기말고사는 각각 선택형 66점과 서·논술형 34점이며 서·논술형 비율은 회차당 10.2%, 합계 20.4%로 적혀 있습니다. 수행평가의 서·논술형은 0%입니다. 진도표상 중간평가 전에는 지질 시대, 생물의 진화, 산화와 환원, 전기 에너지 생산이, 기말평가 전에는 생물과 환경, 생태계 평형, 과학기술의 발전과 한계가 배치되어 있습니다.",
      },
      {
        title: "자유탐구주제 발표는 조건 7가지로 채점합니다",
        body: "교과서 개념 중 관심 있는 분야의 주제를 골라 탐구하고 청중의 질문에 답하는 과제로, 교사평가와 동료평가가 함께 이루어집니다. 조건은 과학적 사실·원리의 올바른 이해, 연구자 윤리, 탐구 방법 적용, 결론 도출, 발표 시간 3분~10분, A4 1페이지 이상의 분량 등 7가지이며 모두 충족하면 20점입니다.",
      },
      {
        title: "토론은 6개 조건과 작성 시간으로 점수가 나뉩니다",
        body: "과학 기술 및 과학 관련 사회적 쟁점 토론은 과학기술 하나를 골라 유용성과 한계를 각각 한 가지 이상 서술하고, 사회적 쟁점에 찬성 또는 반대 입장을 과학적 근거 한 가지 이상으로 뒷받침하는 6개 조건에서 최대 15점이 매겨집니다. 수업시간 50분 안에 작성을 마쳤는지가 5점으로 더해집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["독서와 작문"],
    summary: "중간·기말 각 30%(선택형) · 수행 2개 40%(진로 독서 서평 20%·매체 활용 도서 소개 20%)",
    intro:
      "독서와 작문은 정기시험 두 번이 각 30%로 모두 선택형이고, 서평 쓰기와 매체 활용 도서 소개하기가 20%씩입니다. 일신여자고등학교 2학년 상담에서는 서·논술형 20%가 서평 쓰기에 있다는 점을 보고 독서일지와 서평 작성 일정을 먼저 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월", method: "선택형 100점" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점" },
      { name: "작문 맥락을 고려하여 진로 독서 서평 쓰기", kind: "task", weight: 20, timing: "9~10월", method: "서·논술, 포트폴리오" },
      { name: "매체 활용 도서 소개하기", kind: "task", weight: 20, method: "서·논술, 구술‧발표, 기타" },
    ],
    notes: [
      {
        title: "정기시험 성취기준은 15개 전체가 적혀 있습니다",
        body: "평가 비율표의 성취기준 칸에는 중간·기말고사 모두 12독작01-01~12독작01-15가 적혀 있고, 정기시험은 선택형 100점입니다. 진도표상 중간평가 전에는 독서와 작문의 이해, 읽기와 고쳐쓰기, 인문·예술 분야 글이, 기말평가 전에는 사회·문화와 과학·기술 분야 글, 다양한 유형의 글쓰기, 공동체를 생각하는 독서와 작문이 배치되어 있습니다.",
      },
      {
        title: "서평 쓰기는 포트폴리오 7점이 함께 들어갑니다",
        body: "진로 독서 서평 쓰기(20점)는 서·논술형 20%가 표시된 유일한 과제입니다. 최종 서평 10점은 처음-중간-끝 구성, 핵심 내용 2~3문장 소개, 저자의 문제의식에 대한 견해나 사회와의 연관, 논리적 근거, 명료한 전달의 5개 조건으로 보고, 분량 3점과 포트폴리오 7점이 더해집니다. 포트폴리오는 독서일지 1·2와 개인 감상문 질문 8개를 빠짐없이 작성했는지를 봅니다.",
      },
      {
        title: "도서 소개는 발표문과 매체 자료를 둘 다 냅니다",
        body: "매체 활용 도서 소개하기(20점)는 독서 감상을 바탕으로 발표문을 쓰고 매체 자료를 활용해 발표하는 과제입니다. 내용·형식 10점, 분량 3점(2분 말하기 분량의 70% 이상), 발표 실행 5점, 자료 충실도 2점으로 나뉘며, PPT와 발표문을 모두 제출해야 자료 항목 2점을 받습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 2,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["미적분Ⅰ", "고급대수"],
    summary: "미적분Ⅰ 시험 60%·수행 2개 40%(주제탐구·서술형) / 고급대수(8~10반) 시험 60%·수행 2개 40%",
    intro:
      "일신여자고등학교 2학년 미적분Ⅰ과 고급대수는 모두 정기시험 60%, 수행평가 40%이고, 수행평가는 탐구 보고서와 서술형 평가 두 건으로 짜여 있습니다. 서술형 평가가 둘 다 11월이어서 상담에서는 수강 과목에 맞춰 탐구 일정과 11월 서술형 일정부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월", method: "선택형 100점", course: "미적분Ⅰ" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 100점", course: "미적분Ⅰ" },
      { name: "주제탐구", kind: "task", weight: 20, timing: "9, 10월", method: "구술‧발표, 프로젝트", course: "미적분Ⅰ" },
      { name: "서술형 문제해결", kind: "task", weight: 20, timing: "11월", method: "서·논술", course: "미적분Ⅰ" },
      { name: "중간고사", kind: "exam", weight: 30, timing: "9월", method: "선택형 90점·서답형 10점", course: "고급대수" },
      { name: "기말고사", kind: "exam", weight: 30, timing: "12월", method: "선택형 90점·서답형 10점", course: "고급대수" },
      { name: "주제탐구활동", kind: "task", weight: 20, timing: "10월", method: "프로젝트", course: "고급대수" },
      { name: "개념 서술 및 논술하기", kind: "task", weight: 20, timing: "11월", method: "서·논술", course: "고급대수" },
    ],
    notes: [
      {
        title: "미적분Ⅰ의 서술형은 11월 수행평가 한 번입니다",
        body: "미적분Ⅰ 정기시험은 두 회 모두 선택형이고, 서·논술형 20%는 11월 서술형 문제해결에만 있습니다. 이 평가는 총 7문항으로 문항마다 정답 1점과 풀이 과정 1점, 모두 14개 평가요소를 보며 전부 충족하면 20점, 하나 부족할 때마다 1점씩 줄어듭니다. 평균값 정리와 극대·극소, 그래프 개형은 진도표상 10월 3주 이후 단원이라 중간평가 뒤에 배웁니다.",
      },
      {
        title: "주제탐구는 보고서와 인터뷰로 이루어집니다",
        body: "미적분Ⅰ 주제탐구(20%)는 수업 시간에 수학 탐구 활동을 하고 보고서를 쓴 뒤 탐구 내용에 대한 인터뷰에 참여하는 과제입니다. 보고서에서는 주제와 선정 이유, 미적분Ⅰ 개념의 정확한 제시, 근거 자료를 보고, 인터뷰 4점은 탐구한 내용·활용한 수학 개념·개념이 쓰인 방법을 모두 설명할 수 있는지로 매겨집니다.",
      },
      {
        title: "고급대수는 8~10반 과목이며 범위가 둘로 나뉩니다",
        body: "고급대수의 정기시험은 선택형 90점과 서답형 10점입니다. 중간고사는 12고대01-01~02-02(벡터공간, 가우스 소거법·역행렬), 기말고사는 02-03~03-06(행렬식, 선형변환, 고윳값과 대각화)이 범위입니다. 11월 개념 서술 및 논술하기는 3문제의 풀이 과정 12개를 모두 적합하게 쓰면 18점이고 20분 안에 내면 2점이 더해집니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  {
    schoolSlug: "ilsinyeoja-high-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어Ⅱ"],
    summary: "중간·기말 각 25%(선택형) · 수행 3개 50%(뉴스 기사 요약문 20%·러닝로그 20%·듣기평가 10%)",
    intro:
      "영어Ⅱ는 중간·기말고사가 각 25%의 선택형이고, 수행평가 50% 안에서 뉴스 기사 요약문과 러닝로그가 20%씩, 듣기평가가 10%입니다. 일신여자고등학교 2학년 상담에서는 서·논술형이 요약문에만 있다는 점을 놓고 10~11월 쓰기 일정부터 맞춥니다.",
    assessments: [
      { name: "중간고사", kind: "exam", weight: 25, timing: "9월", method: "선택형 100점" },
      { name: "기말고사", kind: "exam", weight: 25, timing: "12월", method: "선택형 100점" },
      { name: "뉴스 기사 요약문 작성하기", kind: "task", weight: 20, timing: "10~11월", method: "서·논술" },
      { name: "자기주도 러닝로그", kind: "task", weight: 20, timing: "10~11월", method: "서·논술, 포트폴리오" },
      { name: "듣기평가", kind: "task", weight: 10, timing: "9월", method: "시·도교육청 주관 영어듣기능력평가 일괄 평가" },
    ],
    notes: [
      {
        title: "서·논술형은 뉴스 기사 요약문에만 있습니다",
        body: "계획서는 서·논술형 쓰기 평가를 수행평가에서만 실시하고 한 학기 환산점 100점 중 20%를 반영한다고 적고 있으며, 표에서는 뉴스 기사 요약문 작성하기가 이에 해당합니다. 정기시험은 중간·기말 모두 선택형 100점입니다. 진도표상 중간평가 전에는 Lesson 1~2, 기말평가 전에는 Lesson 3~4가 배치되어 있습니다.",
      },
      {
        title: "요약문은 정확히 쓴 문항 수로 채점합니다",
        body: "뉴스 기사 요약문(20점)은 기사를 읽고 전반적인 주제와 주요 논점을 담은 요약문을, 주어진 글쓰기 형식에 맞춰 어휘·어법상 이해 가능하게 영작하는 과제입니다. 문법과 철자 오류 없이 정확히 서술한 문항 수에 따라 7문항 20점, 6문항 18점, 5문항 16점으로 내려갑니다. 진도표에는 10월 3~4주에 세부 주제 선정과 개요·초고 작성, 10월 5주에 건강 관련 뉴스 요약 작성 과정이 적혀 있습니다.",
      },
      {
        title: "러닝로그는 분량, 듣기평가는 정답 수가 기준입니다",
        body: "자기주도 러닝로그(20%)는 배운 내용을 바탕으로 학습 내용과 활동을 정리한 분량이 7장이면 20점에서 시작해 한 장 줄 때마다 2점씩 내려가고, 완성도가 미미한 페이지는 페이지당 2점이 감점됩니다. 듣기평가(10%)는 시·도교육청이 주관하는 전국 영어듣기능력평가로 일괄 평가하고 20문항이 모두 정답이면 10점입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자고등학교")],
  },
  // ───────────────────────── 2학년 ─────────────────────────
  {
    schoolSlug: "ilsinyeoja-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사①"],
    summary: "3·4차 시험 25%씩 · 일기 쓰기 20%(9월)·용어사전 20%(11월)·카드 제작 10%(10월)",
    intro:
      "일신여자중학교 2학년 사회과는 역사①로 평가하며, 정기시험 두 번이 선택형 50%이고 수행평가 세 과제가 9월·10월·11월에 하나씩 놓입니다. 시험 범위가 두 회차에 걸쳐 이어지는 구간이 있어, 상담에서는 과제 시기와 범위가 겹치는 달부터 짚어 봅니다.",
    assessments: [
      { name: "3차 정기시험", kind: "exam", weight: 25, timing: "10월 4주", method: "선택형" },
      { name: "4차 정기시험", kind: "exam", weight: 25, timing: "12월 3주", method: "선택형" },
      { name: "역사 일기 쓰기", kind: "task", weight: 20, timing: "9월", method: "서·논술형 · 근대 국가 형성 시기의 역사 인물이 되어 역사 일기 쓰기" },
      { name: "역사용어사전 만들기", kind: "task", weight: 20, timing: "11월", method: "역사 용어 및 개념을 설명하는 나만의 사전 만들기" },
      {
        name: "역사 카드 제작활동",
        kind: "task",
        weight: 10,
        timing: "10월",
        method: "기타(제작활동) · 역사 인물을 조사해 관련 사건과 지식을 알리는 카드 만들기",
      },
    ],
    notes: [
      {
        title: "시험 범위는 단원 중간에서 이어집니다",
        body: "3차는 [9역04-02]~[9역05-03], 4차는 [9역05-03]~[9역07-01]로 표시되어 있어 [9역05-03](아시아와 아프리카의 민족운동)이 두 회차에 걸칩니다. 진도표로는 3차가 Ⅳ단원 지역 세계의 교류부터 Ⅴ단원까지, 4차가 Ⅴ단원 03부터 Ⅵ단원 세계 대전과 Ⅶ단원 냉전 체제까지입니다.",
      },
      {
        title: "일기 쓰기는 충족한 요소의 개수로 갈립니다",
        body: "역사 일기 쓰기는 [9역05-01]을 근거로 근대 국가 형성 시기의 인물이 되어 쓰는 글입니다. 제한시간과 분량, 역사 인식의 오류 여부, 시대 상황 이해, 근거의 사실성 등 일곱 요소 가운데 6가지 이상을 채우면 20점, 5가지는 18점이며 한 요소가 줄 때마다 2점씩 내려갑니다.",
      },
      {
        title: "사전과 카드는 내용의 정확성이 공통 요소",
        body: "용어사전(11월 20%)은 역사 용어와 개념을 설명하는 나만의 사전이고, 카드 제작활동(10월 10%)은 인물을 조사해 사건과 지식을 알리는 카드입니다. 두 과제 모두 제한시간 내 완성과 오개념·인식 오류가 없는지가 평가 요소에 들어 있어, 조사한 내용을 먼저 검토하는 순서가 계획과 맞습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자중학교")],
  },

  // ───────────────────────── 3학년 ─────────────────────────
  {
    schoolSlug: "ilsinyeoja-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회", "역사②"],
    summary: "사회 시험 60%·꾸러미 20%·탐구 20% / 역사② 시험 50%·일기 20%·사전 20%·카드 10%",
    intro:
      "3학년 사회과는 지리 단원을 다루는 사회와 역사② 두 과목으로 나뉘며, 일신여자중학교에서는 각각 3차 정기시험 한 번씩만 치릅니다. 시험 비중이 사회 60%, 역사② 50%로 다르니 과목별 수행평가 시기를 따로 적어 놓고 상담을 시작합니다.",
    assessments: [
      { name: "3차 정기시험", kind: "exam", weight: 60, timing: "10월 5주", method: "선택형", course: "사회" },
      {
        name: "사회적 개념 및 문제해결 탐구",
        kind: "task",
        weight: 20,
        method: "서·논술형 · 기본 개념 및 문제 해결 능력 평가",
        course: "사회",
      },
      { name: "학습 꾸러미", kind: "task", weight: 20, timing: "10월 1주", method: "포트폴리오 · 학습 꾸러미 완성하기", course: "사회" },
      { name: "3차 정기시험", kind: "exam", weight: 50, timing: "10월 4주", method: "선택형", course: "역사②" },
      {
        name: "역사 일기 쓰기",
        kind: "task",
        weight: 20,
        timing: "9월~10월",
        method: "서·논술형 · 왜란과 호란 시기의 역사 인물이 되어 역사 일기 쓰기",
        course: "역사②",
      },
      {
        name: "역사용어사전 만들기",
        kind: "task",
        weight: 20,
        timing: "10월",
        method: "역사 용어 및 개념을 설명하는 나만의 사전 만들기",
        course: "역사②",
      },
      {
        name: "역사 카드 제작활동",
        kind: "task",
        weight: 10,
        timing: "9월",
        method: "기타(제작활동) · 조선 전기에 제작된 문화재를 조사해 설명하는 카드 만들기",
        course: "역사②",
      },
    ],
    notes: [
      {
        title: "사회 시험 범위는 Ⅸ~Ⅻ단원 지리 영역",
        body: "사회 3차 정기시험의 성취기준은 [9사(지리)09-01]~[9사(지리)12-03]이고, 진도표에는 3차 정기시험이 10월 26일~28일로 적혀 있습니다. 11월 2주부터 이어지는 수업은 교과서 진도가 끝난 뒤 경제 성취기준을 변형해 진행하는 진로 연계 교육 활동으로 편성되어 있습니다.",
      },
      {
        title: "사회 수행평가는 미충족 항목의 개수로 채점",
        body: "사회적 개념 및 문제해결 탐구(서·논술형)와 학습 꾸러미(포트폴리오)는 충족하지 못한 항목이 0개면 20점, 1개면 18점으로 2점씩 내려가 7개 이상이면 6점입니다. 탐구는 제한시간·분량·자료 활용 등을, 꾸러미는 기한 내 제출과 수업 순서대로의 정리를 확인 항목에 둡니다.",
      },
      {
        title: "역사② 과제는 다루는 시기가 서로 다릅니다",
        body: "일기 과제는 왜란과 호란 시기 인물([9역10-04]~[9역11-01]), 카드 제작은 조선 전기 문화재([9역10-03]), 용어사전은 [9역10-02]~[9역11-04] 전체가 범위입니다. 3차 정기시험도 같은 [9역10-02]~[9역11-04]로, 사림 세력 단원부터 Ⅴ단원 4. 생활과 문화의 새로운 양상까지입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자중학교")],
  },
  {
    schoolSlug: "ilsinyeoja-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "3차 정기시험 60% · 체세포 분열 글쓰기 20% · 역학적 에너지 탐구활동 20%(둘 다 수시)",
    intro:
      "일신여자중학교 3학년 과학에서 정기시험은 선택형 3차 한 번으로 60%를 차지하고, 나머지 40%는 수시로 진행되는 글쓰기와 탐구 두 영역이 20%씩 나눕니다. 서술할 내용이 체세포 분열과 에너지 전환으로 갈리므로, 상담에서는 두 과제의 평가 요소를 먼저 대조합니다.",
    assessments: [
      { name: "3차 정기시험", kind: "exam", weight: 60, method: "선택형" },
      {
        name: "체세포 분열 과학 글쓰기",
        kind: "task",
        weight: 20,
        timing: "수시",
        method: "서·논술형 · 체세포 분열의 핵 분열 과정을 서술하기",
      },
      {
        name: "역학적 에너지 탐구활동",
        kind: "task",
        weight: 20,
        timing: "수시",
        method: "역학적 에너지 보존 예측하기, 역학적 에너지가 전기 에너지로 전환되는 과정 설명하기",
      },
    ],
    notes: [
      {
        title: "글쓰기는 여섯 요소 중 충족한 개수로 단계가 정해집니다",
        body: "체세포 분열 과학 글쓰기는 [9과21-02]를 근거로 핵 분열 과정을 서술합니다. 전기부터 말기까지의 특징, 양파 뿌리 끝부분을 쓰는 까닭, 염색된 대상, 단계별 세포 표시, 분열 전 세포가 더 많은 까닭, 서론·본론·결론 구성의 여섯 요소가 모두 충족되면 20점이고 하나 모자랄 때마다 2점씩 낮아집니다.",
      },
      {
        title: "탐구활동은 에너지 전환을 설명하는 데 초점",
        body: "역학적 에너지 탐구활동은 [9과22-01]·[9과22-02]가 근거이고 평가 방법에 논술과 실험·실습이 함께 표시됩니다. 위치 에너지와 운동 에너지의 전환 계산, 간이 발전기를 흔들 때 LED에 불이 들어오는 까닭, 자석의 거리를 달리할 때 유도 전류의 방향을 양식에 맞춰 쓰는 것이 평가 요소입니다.",
      },
      {
        title: "두 과제와 맞닿는 진도 시기",
        body: "진도표에서 [9과21-02] 체세포 분열은 9월 1~2주, [9과22-01]은 10월 3~4주, [9과22-02] 전기 에너지의 발생은 11월 1~2주에 다룹니다. 두 수행평가의 평가 시기는 모두 '수시'이고, 정기시험은 [9과21-01]~[9과23-03]을 성취기준 범위로 표시합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자중학교")],
  },
  {
    schoolSlug: "ilsinyeoja-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "3·4차 시험 30%씩 · 시 쓰기 20%(9월 5주~10월 2주) · 갈등 조정 대화 프로젝트 20%",
    intro:
      "일신여자중학교 2학년 국어는 8월 4주 갈등 조정 대화 프로젝트로 수행평가를 시작해 10월 2주 시 쓰기로 마칩니다. 정기시험은 3차(10월)·4차(12월)가 선택형 30%씩이므로, 상담에서는 먼저 놓인 대화 프로젝트의 글쓰기 단계가 어디까지인지부터 확인합니다.",
    assessments: [
      { name: "3차 정기시험", kind: "exam", weight: 30, timing: "10월", method: "선택형" },
      { name: "4차 정기시험", kind: "exam", weight: 30, timing: "12월", method: "선택형" },
      {
        name: "사회·문화적 상황을 반영한 시 쓰기 서·논술형",
        kind: "task",
        weight: 20,
        timing: "9월 5주~10월 2주",
        method: "서·논술형 · 운율과 감각적 심상, 사회·문화적 상황을 담은 시 쓰기",
      },
      {
        name: "갈등 조정 대화 프로젝트",
        kind: "task",
        weight: 20,
        timing: "8월 4주~9월 4주",
        method: "프로젝트 · 갈등을 조정하는 대화의 방법과 필요성을 설명하는 글 쓰기",
      },
    ],
    notes: [
      {
        title: "시 쓰기는 사회·문화적 상황이 중심 요소",
        body: "시 쓰기는 [9국05-05]가 성취기준이고 서·논술형 20%로 표시됩니다. 운율이 드러나는 시구, 다양한 감각적 심상, 사회·문화적 상황을 드러내는 시어, 그 상황 속 자신의 경험을 담은 정서 표현 등 다섯 요소를 모두 채우면 20점, 4개는 17점으로 3점씩 내려갑니다.",
      },
      {
        title: "대화 프로젝트는 글 한 편으로 마무리됩니다",
        body: "갈등 조정 대화 프로젝트의 근거는 [9국01-04] 공감하며 대화하기, [9국01-09] 갈등 조정, [9국04-05] 인용 표현 등입니다. 평가 요소의 마지막이 '갈등을 조정하는 대화의 필요성을 주장하는 한 편의 글 완성'이고, 진도표 9월 3~4주 복합양식 자료로 글쓰기가 같은 과제로 연결됩니다.",
      },
      {
        title: "3차와 4차는 성취기준이 나뉩니다",
        body: "3차(10월)는 공감하며 대화하기, 갈등을 조정하는 대화, 복합양식 자료로 글쓰기, 피동·인용 표현과 문학 속의 삶에 해당하는 여섯 성취기준이고, 4차(12월)는 [9국02-04], [9국02-08], [9국05-05], [9국06-05]입니다. 글과 자료 평가하며 읽기와 매체 자료 분석은 4차 쪽입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자중학교")],
  },
  {
    schoolSlug: "ilsinyeoja-middle-school",
    grade: 3,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "3차 시험 60%(10월 5주) · 문장의 짜임 분석 20% · 시 분석 프로젝트 20%",
    intro:
      "일신여자중학교 3학년 국어의 2학기 정기시험은 3차 한 번(10월 5주, 선택형)입니다. 시 분석 프로젝트가 9월 1주, 문장의 짜임 분석이 9월 4주부터 시작되어 시험보다 먼저 끝나므로, 과제 두 개를 시험 전 한 덩어리로 보고 순서를 정합니다.",
    assessments: [
      { name: "3차 정기시험", kind: "exam", weight: 60, timing: "10월 5주", method: "선택형" },
      {
        name: "문장의 짜임 분석 서·논술형",
        kind: "task",
        weight: 20,
        timing: "9월 4주~10월 1주",
        method: "서·논술형 · 주어진 문장의 짜임을 분석하고 분석 근거 서술하기",
      },
      {
        name: "시 분석 프로젝트",
        kind: "task",
        weight: 20,
        timing: "9월 1주~9월 3주",
        method: "프로젝트 · 근거의 차이에 따른 다양한 해석을 들어 시 분석하기",
      },
    ],
    notes: [
      {
        title: "문장의 짜임 과제는 조건이 세 가지",
        body: "[9국04-06]이 근거이고 조건은 세 가지입니다. 제시된 문장에서 홑문장과 겹문장을 구별하고 판단 근거를 쓸 것, 겹문장이면 이어진 문장·안은문장과 명사절·관형절·부사절·서술절·인용절 같은 세부 유형까지 쓸 것, 문법 표지 등의 개념 용어로 논리적으로 서술할 것입니다.",
      },
      {
        title: "시 분석은 네 관점과 근거 제시를 봅니다",
        body: "[9국05-07]을 근거로 내재적 관점, 작품과 작가, 작품과 현실, 작품과 독자의 관계라는 네 관점에서 시를 해석하고 자신의 해석을 뒷받침하는 근거를 타당하게 제시했는지가 요소입니다. 다섯 요소 충족이 20점, 네 개가 17점으로 3점씩 내려가며, 진도표 9월 1~3주 '시집 읽고 해석하기'와 같은 시기입니다.",
      },
      {
        title: "3차 성취기준과 11월 이후 단원",
        body: "정기시험에는 [9국02-09], [9국03-03], [9국03-10], [9국04-06], [9국05-05], [9국05-07] 여섯 성취기준이 표시되어 능동적으로 읽기, 보고하는 글쓰기, 문장의 짜임, 허생전과 시집 읽기를 가리킵니다. 11월 이후 단원인 자신감 있게 말하기, 비교하며 읽기, 주장하는 글쓰기의 성취기준은 이 목록에 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("일신여자중학교")],
  },
  // 28차 충남 천안 동남구 병천면(병천고·병천중) — 학교알리미 2026-2 평가계획
  // ───────── 1학년 ─────────
  {
    schoolSlug: "byeongcheon-high-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합사회2"],
    summary: "정기시험 2회 40% · 수행 3개 60%(노동권 구제 보고서·신문기사 분석 활동·국제무역 성사 계획서)",
    intro:
      "1학년 통합사회2는 1·2회고사가 20%씩, 수행평가 세 영역이 20%씩이며 수행 60%가 모두 서·논술형입니다. 병천고 사회 상담의 첫 단계는 9월 5주 노동권 보고서에서 11월 2주 무역 계획서까지 세 과제의 시기를 시험 범위와 대조하는 일입니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 20, timing: "10월 3주", method: "선택형 80점 이하·서답형 20점 이상" },
      { name: "2회고사", kind: "exam", weight: 20, timing: "12월 2주", method: "선택형 80점 이하·서답형 20점 이상" },
      { name: "노동권 구제 보고서", kind: "task", weight: 20, timing: "9월 5주", method: "서·논술형(반영 20%)" },
      { name: "신문기사 분석 활동", kind: "task", weight: 20, timing: "10월 3주, 12월 1주", method: "서·논술형(반영 20%)" },
      { name: "국제무역 성사 계획서", kind: "task", weight: 20, timing: "11월 2주", method: "서·논술형(반영 20%)" },
    ],
    notes: [
      {
        title: "10월 3주에 시험과 기사 분석이 겹칩니다",
        body: "신문기사 분석 활동은 10월 3주와 12월 1주 두 차례이고, 10월 3주는 1회고사와 같은 주입니다. 1·2회고사는 선택형 80점 이하와 서답형 20점 이상으로 나뉘며 시험 칸의 서·논술형 반영비율은 ‘·’입니다. 서·논술형 60%는 세 수행평가가 20%씩 나눠 맡습니다.",
      },
      {
        title: "회고사별 평가 요소",
        body: "1회는 인권과 헌법의 의미와 국내외 인권 문제, 자본주의의 전개 과정과 합리적 선택, 다양한 양상의 세계화와 국제 사회의 갈등입니다. 2회는 다양한 정의관과 정의로운 사회의 필요성, 금융생활 계획과 국제 무역의 발생 과정, 세계의 인구·자원 문제와 자신의 미래 삶의 방향까지 이어집니다.",
      },
      {
        title: "세 과제가 요구하는 글",
        body: "노동권 보고서는 근로계약서 2편에서 근로기준법에 어긋나는 조항 5개와 사유를 찾고, 기사 속 침해된 헌법상 노동권을 연결해 새 조항을 제안합니다. 기사 분석은 기사 3편의 구조화·요약, 어휘 찾기, 견해 작성이고, 무역 계획서는 절대우위·비교우위와 제시된 4개 계획서의 제1국·제2국 기회비용 서술입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천고등학교")],
  },
  {
    schoolSlug: "byeongcheon-high-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["통합과학2"],
    summary: "정기시험 2회 40%(선택형) · 수행 2개 60%(산과 염기 실험 탐구·미래 사회 문제 논증)",
    intro:
      "1학년 통합과학2는 1·2회고사가 20%씩 선택형이고 수행평가 두 영역이 30%씩이며, 서·논술형 40%는 모두 수행에서 나옵니다. 병천고 과학 상담에서는 두 과제의 성취기준이 1·2회고사 범위의 어디와 겹치는지를 먼저 대조합니다.",
    assessments: [
      { name: "1회고사", kind: "exam", weight: 20, timing: "10월 3주", method: "선택형 100점" },
      { name: "2회고사", kind: "exam", weight: 20, timing: "12월 2주", method: "선택형 100점" },
      { name: "산과 염기 실험 탐구", kind: "task", weight: 30, timing: "9월 3주", method: "서술·논술 및 실험·실습(서·논술형 10%)" },
      { name: "미래 사회 문제 해결을 위한 과학의 역할 논증", kind: "task", weight: 30, method: "서술·논술(서·논술형 30%)" },
    ],
    notes: [
      {
        title: "서·논술형 40%의 출처",
        body: "시험 두 회의 서·논술형 반영이 0%여서 서·논술형 40%는 두 수행에서만 채워집니다. 산과 염기 실험 탐구가 10%, 미래 사회 문제 해결을 위한 과학의 역할 논증이 30%입니다. 둘 다 반영 비율은 30%이지만 서·논술형으로 환산되는 몫이 다르고, 실험 탐구는 평가 방법에 실험·실습도 함께 표시되어 있습니다.",
      },
      {
        title: "산과 염기 탐구는 10점 만점 척도입니다",
        body: "실험 수행 4점과 탐구 결과 및 정리 6점으로 나뉩니다. 혼합 용액의 온도를 정확히 측정하고 BTB 용액의 색 변화를 기록하는지, 염산과 수산화 나트륨 수용액의 부피별 온도 변화를 그래프로 나타내고 그 까닭을 화학적 원리로 서술하는지를 봅니다. 성취기준 [10통과2-01-04]는 1회고사 범위에도 있습니다.",
      },
      {
        title: "미래 사회 논증과 2회고사 범위",
        body: "미래 사회 문제 상황을 2가지 이상 구체적으로 제시하면 4점, 해결 방안을 4가지 이상 구체적으로 제시하면 6점인 10점 척도입니다. 성취기준 [10통과2-03-01]~[03-04] 가운데 앞의 셋은 2회고사 범위인 생태계와 환경 변화, 에너지 전환과 활용, 과학기술의 활용 쪽에도 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천고등학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 1,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "시험 2회 40% · 수행 60%(독서감상문 10월·품사/단어 탐구 11월·주장하는 글 12월)",
    intro:
      "병천중학교 1학년 국어는 정기시험 두 번이 선택형으로 40%를 채우고, 수행평가 세 영역이 10월·11월·12월에 한 달씩 이어져 60%를 차지합니다. 상담에서는 성장소설 독서감상문의 읽기 일정과 쓰는 날짜부터 정하고, 나머지 두 과제를 시험 범위에 맞춰 이어 붙입니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월", method: "선택형" },
      { name: "성장소설을 읽고 독서감상문 쓰기", kind: "task", weight: 20, timing: "10월", method: "서술형" },
      { name: "품사 및 단어의 짜임 탐구 문제 해결하기", kind: "task", weight: 20, timing: "11월", method: "포트폴리오" },
      { name: "주장하는 글 쓰기", kind: "task", weight: 20, timing: "12월", method: "서술형·논술형" },
    ],
    notes: [
      {
        title: "독서감상문은 충족한 항목 수로 점수가 갈립니다",
        body: "독서감상문은 작품 내용 정리, 인상 깊은 장면과 그 이유, 성장 과정을 근거로 한 주제 파악, 자신의 삶 성찰, 깨달은 점의 표현, 짜임새 있는 구성을 봅니다. 충족한 항목이 여섯 개면 100점이고 하나 줄 때마다 10점씩 내려가며, 평가 유의사항에는 AI 활용 금지가 적혀 있습니다.",
      },
      {
        title: "단어 과제와 2회 고사가 같은 성취기준을 씁니다",
        body: "11월 단어 과제는 [9국04-03] 품사의 종류와 특성, [9국04-02] 단어의 짜임을 다루는데, 12월 2회 고사의 성취기준 목록에도 같은 두 항목이 있습니다. 채점 요소에 품사를 나누는 기준 세 가지(의미, 기능, 형태)를 정확히 제시하는 항목이 있어, 이 단원을 한 번 정리해 두면 과제와 시험 두 곳에 쓰입니다.",
      },
      {
        title: "10월과 11월에는 정기시험이 없습니다",
        body: "정기시험은 1회 고사가 9월, 2회 고사가 12월이어서 10월과 11월은 수행평가만 치르는 구성입니다. 12월에는 주장하는 글 쓰기(조건과 분량, 명확한 주장, 타당한 근거 두 개 이상, 체계적 조직 등)와 2회 고사가 같은 달에 놓입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 1,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "시험 2회 40%(선택형) · 풀이 과정 20% · 평면도형 서술형 20%(10월) · 입체도형 서술형 20%(11월)",
    intro:
      "병천중학교 1학년 수학은 정기시험 두 번이 모두 선택형이어서 서술형 평가가 수행평가 두 과제(10월 평면도형, 11월 입체도형)에만 있습니다. 수업 일정은 수시로 쌓는 풀이 과정 정리 20%와 서술형 두 과제의 단원 범위를 한 장에 놓고 짜는 데서 출발합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월 4주", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월 3주", method: "선택형" },
      { name: "문제풀이 과정 작성하기", kind: "task", weight: 20, timing: "수시", method: "포트폴리오" },
      { name: "평면도형 문제 해결하기", kind: "task", weight: 20, timing: "10월", method: "서술형" },
      { name: "입체도형 문제 해결하기", kind: "task", weight: 20, timing: "11월", method: "서술형" },
    ],
    notes: [
      {
        title: "서술형이 들어가는 곳은 수행평가 두 과제",
        body: "정기시험은 두 번 모두 선택형 100%이고 서답형 칸이 비어 있어, 서술형은 평면도형 문제 해결하기(10월)와 입체도형 문제 해결하기(11월)에서만 나옵니다. 계획표의 서·논술형 비율도 이 두 과제에 20%씩 표시되어 있습니다.",
      },
      {
        title: "풀이 과정 정리는 단원마다 붙은 과제",
        body: "문제풀이 과정 작성하기는 단원별로 개념을 정리하고 풀이 과정을 오류 없이 적었는지를 열네 개 채점 요소로 확인하며, 13개 이상 만족하면 100점입니다. 요소에는 정다면체가 5가지뿐인 이유를 쓰는 항목이 있고, 진도표에는 Ⅴ 도형의 기초부터 Ⅶ 입체도형까지 단원마다 이 과제 표시가 붙어 있습니다.",
      },
      {
        title: "시험 범위는 두 구간으로 나뉩니다",
        body: "1회 고사는 점·선·면·각, 위치 관계, 평행선의 성질, 작도, 삼각형의 합동 조건이 범위이고, 2회 고사는 다각형, 부채꼴, 다면체·회전체, 겉넓이와 부피, 대푯값과 도수분포를 다룹니다. 8.6 실생활 자료의 정리와 해석은 진도표에서 2회 고사 표시 뒤에 놓입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 1,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "시험 2회 40% · 해외여행 상품 기획 20%(9월 1주) · 문화 홍보문 20%(10월 2주) · 인권 보고서 20%",
    intro:
      "1학년 사회는 한 학기에 세계 지리(Ⅰ~Ⅵ)와 일반사회(Ⅶ~Ⅻ)를 함께 다루고, 1회 고사가 앞쪽 범위, 2회 고사가 뒤쪽 범위를 맡습니다. 병천중학교 수행평가 세 과제는 9월 해외여행 상품 기획으로 시작하므로, 첫 확인 사항은 그 과제의 날짜입니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월 4주", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월 3주", method: "선택형" },
      {
        name: "해외여행 상품 기획하기",
        kind: "task",
        weight: 20,
        timing: "9월 1주",
        method: "여행 국가의 특성 파악 · 관광 코스 탐색과 소개글 작성 · 기획 내용 발표",
      },
      {
        name: "일상생활 속 다양한 문화 홍보문 작성하기",
        kind: "task",
        weight: 20,
        timing: "10월 2주",
        method: "주변 문화 조사 · 자랑할 만한 문화를 홍보문 양식으로 작성",
      },
      {
        name: "인권 침해 사례조사 및 해결 방안 보고서 작성하기",
        kind: "task",
        weight: 20,
        method: "인권 침해 사례 조사 · 종류·내용·원인 정리 · 해결 방안을 보고서로 작성",
      },
    ],
    notes: [
      {
        title: "정기시험 범위가 지리와 일반사회로 갈립니다",
        body: "1회 고사(9월 4주)는 세계화 시대와 아시아, 유럽, 아프리카, 아메리카, 오세아니아와 극지방까지 지리 성취기준 전체이고, 2회 고사(12월 3주)는 인간과 사회생활부터 인권과 기본권까지 일반사회 성취기준 전체입니다. 두 시험 모두 선택형 100%입니다.",
      },
      {
        title: "앞의 두 과제는 단원 진도와 같은 시기",
        body: "해외여행 상품 기획하기(9월 1주)는 세계 지리 Ⅰ~Ⅵ 단원에서 배운 지역 특성을 근거로 여행 국가를 정하고, 관광 코스와 소개글을 쓴 뒤 발표합니다. 문화 홍보문(10월 2주)은 진도표에서 같은 10월에 배우는 Ⅷ. 다양한 문화의 이해와 이어집니다.",
      },
      {
        title: "인권 보고서는 2회 고사 범위의 단원 내용",
        body: "인권 침해 사례조사 및 해결 방안 보고서는 사례 제시, 침해의 종류와 유형 분석, 발생 원인 파악, 해결 방법 제시, 보고서 작성, 발표를 채점 요소로 삼습니다. 성취기준 [9사(일사)06-01]~[9사(일사)06-03]은 12월 2회 고사 범위에도 들어 있고, 채점표 맨 아래 칸에 고의적 미제출·백지 제출은 30점으로 적혀 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 1,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "시험 2회 40% · 부력 탐구보고서 30%(10월 4주) · 기체 압력·부피 변화 표현 30%(11월 2주)",
    intro:
      "병천중학교 1학년 과학은 수행평가 60%가 모두 실험·보고서형 과제 두 개(10월 4주 부력, 11월 2주 압력과 부피)이고, 정기시험 두 번이 나머지 40%입니다. 수업 계획은 실험 단원이 시험 범위와 겹치는 지점을 가려내는 일에서 시작합니다.",
    assessments: [
      {
        name: "1회 고사",
        kind: "exam",
        weight: 20,
        timing: "9월 4주",
        method: "선택형 70% 이하 · 서답형(단답형) 30% 이상",
      },
      {
        name: "2회 고사",
        kind: "exam",
        weight: 20,
        timing: "12월 3주",
        method: "선택형 70% 이하 · 서답형(단답형) 30% 이상",
      },
      {
        name: "물속에서의 부력 측정 탐구보고서 작성",
        kind: "task",
        weight: 30,
        timing: "10월 4주",
        method: "서·논술형, 실험실습, 보고서평가",
      },
      {
        name: "압력에 따른 기체의 부피 변화 표현",
        kind: "task",
        weight: 30,
        timing: "11월 2주",
        method: "서·논술형, 실험실습, 보고서평가",
      },
    ],
    notes: [
      {
        title: "부력 보고서는 다섯 항목으로 나뉩니다",
        body: "물속에서의 부력 측정 탐구보고서는 100점이 무게 측정 20, 부력의 크기 계산 20, 부력의 방향 10, 잠긴 부피에 따른 부력 변화 서술 30, 중력과 부력 비교 20으로 나뉩니다. 서술 항목은 탐구 결과와 관련지어 쓰면 30점이고, 관련짓지 못하면 20점입니다.",
      },
      {
        title: "기체 과제는 그래프와 입자 모형까지 요구합니다",
        body: "압력에 따른 기체의 부피 변화 표현은 실험 수행과 측정값 기록 20, 압력–부피 그래프 20, 관계 설명 30, 기체 입자 모형 20, 부피 변화 이유 10으로 채점됩니다. 모형은 피스톤 위치, 입자 5개, 화살표를 모두 맞게 그려야 20점이고, 이유에는 ‘입자 사이의 거리’ 또는 ‘빈 공간’이 들어가야 합니다.",
      },
      {
        title: "힘 단원은 두 시험의 범위 목록에 모두 있습니다",
        body: "진도표에서 Ⅴ-1 여러 가지 힘은 8월부터 12월까지 거의 모든 줄에 다른 단원과 함께 올라 있고, 부력이 속한 [9과05-02]는 1회와 2회 고사 범위 목록에 모두 있습니다. 기체의 압력과 부피 관계([9과06-02])는 2회 고사 범위입니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 1,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "시험 2회 40%(선택형) · 듣기평가 20%(9월 1주) · 어휘·문장 쓰기 20% · 상황별 문제해결 20%",
    intro:
      "병천중학교 1학년 영어는 9월 1주 듣기평가로 시작해 10월 1주 어휘·문장 쓰기, 12월 2주 상황별 쓰기·말하기로 이어지는 수행평가 세 개가 60%입니다. 정기시험은 선택형 두 번(9월 4주, 12월 3주)이라, 상담에서는 Lesson 진도와 수행 일정을 달력에 나란히 놓고 봅니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월 4주", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월 3주", method: "선택형" },
      { name: "영어듣기평가", kind: "task", weight: 20, timing: "9월 1주", method: "듣기 20문항" },
      { name: "어휘와 문장 표현 쓰기", kind: "task", weight: 20, timing: "10월 1주", method: "서술·논술, 포트폴리오" },
      {
        name: "상황별 문제해결 작성하기",
        kind: "task",
        weight: 20,
        timing: "12월 2주",
        method: "서술·논술, 구술·발표, 포트폴리오",
      },
    ],
    notes: [
      {
        title: "듣기평가는 정답 개수 구간으로 점수를 매깁니다",
        body: "영어듣기평가는 20문항이고 18~20개를 맞히면 100점, 15~17개는 90점으로 세 문항 단위로 10점씩 내려가 2개 이하는 40점입니다. 평가 요소는 대화의 주제와 세부 사항, 목적, 화자 간 관계, 사건의 전후 관계 추론이며 정기시험보다 먼저 치릅니다.",
      },
      {
        title: "어휘 과제는 내용 50점과 언어 형식 50점",
        body: "어휘와 문장 표현 쓰기는 내용 구성 및 어휘 활용 50점과 언어 형식 50점으로 나뉩니다. 앞쪽은 Lesson 5, 6 주요 문장 15개 제시 중 13개 이상 완성하면 50점이고, 뒤쪽은 문법 문장 완성과 본문 해석, 상황별 문장 쓰기 채점 요소 가운데 8개 이상 이행하면 50점입니다.",
      },
      {
        title: "12월 과제는 쓰기와 말하기를 함께 봅니다",
        body: "상황별 문제해결 작성하기는 15개 제시 중 13개 이상 문장을 완성하거나 말하면 100점이고 2~0개면 40점입니다. 평가 방법에 서술·논술, 구술·발표, 포트폴리오가 함께 표시되어 있어 쓴 문장을 말로도 전달하는지를 같은 과제에서 확인합니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 2,
    subjectSlug: "korean",
    status: "published",
    planTerm: "2026-2",
    courses: ["국어"],
    summary: "시험 2회 40% · 독서감상문 20%(10월) · 음운·문자 탐구 20%(11월) · 복합양식 글쓰기 20%(12월)",
    intro:
      "병천중학교 2학년 국어는 수행평가 세 영역이 10월 독서감상문, 11월 음운·문자 탐구, 12월 복합양식 글쓰기 순으로 20%씩 이어집니다. 정기시험은 9월과 12월 선택형이라, 먼저 1회 고사 범위와 10월 독서감상문 준비 시점을 함께 정해 둡니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월", method: "선택형" },
      { name: "사회 문화적 상황이 반영된 책 읽고 독서 감상문 쓰기", kind: "task", weight: 20, timing: "10월", method: "서술형" },
      { name: "국어의 음운과 문자 탐구하기", kind: "task", weight: 20, timing: "11월", method: "포트폴리오" },
      { name: "복합양식 활용하여 글 쓰기", kind: "task", weight: 20, timing: "12월", method: "서술형·논술형" },
    ],
    notes: [
      {
        title: "독서감상문은 사회·문화적 상황이 중심입니다",
        body: "10월 독서감상문의 채점 요소는 작품 요약, 인상 깊은 장면(구절)과 이유, 사회 문화적 상황을 중심으로 한 이해와 주제 파악, 감동과 깨달음의 삶 연결, 창의적 표현, 짜임새 있는 구성입니다. 같은 [9국05-05]가 9월 1회 고사 성취기준에도 있고, 감상문은 AI 활용 금지로 안내됩니다.",
      },
      {
        title: "음운·문자 과제는 체계 분류에서 한글의 가치까지",
        body: "11월 과제는 자음 체계 분류, 단모음 체계 분류, 훈민정음 제자 원리 설명, 일상 단어의 표준 발음, 맞춤법 원리에 맞는 표기, 한글의 가치와 발전 방향 제시를 묻습니다. 포트폴리오로 표시되어 있고, 같은 [9국04-01]이 12월 2회 고사 성취기준에도 올라 있습니다.",
      },
      {
        title: "복합양식 글쓰기는 출처와 기호까지 채점",
        body: "12월 복합양식 글쓰기는 목적·주제에서 벗어난 내용이 없는지, 복합양식 자료의 특성을 고려한 내용 생성, 글 유형에 맞는 구성, 적절한 기호 활용, 조건과 분량 준수, 믿을 만하고 출처가 분명한 자료 수집을 따집니다. 이 과제도 AI의 도움 없이 쓰도록 안내됩니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 2,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["역사"],
    summary: "시험 2회 40% · 산업 혁명 토론문 20%(9월 1주) · 인권 회복 포스터 20%(10월 2주) · 역사 신문 20%",
    intro:
      "병천중학교 2학년 역사는 수행평가 세 과제(산업 혁명 토론문, 인권 회복 포스터, 세계사 역사 신문)가 20%씩이고 정기시험 두 번이 40%입니다. 상담은 9월 1주 토론문 일정과 9월 4주 1회 고사 범위를 나란히 놓고 준비 순서를 나누는 일로 시작합니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월 4주", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월 3주", method: "선택형" },
      {
        name: "산업 혁명의 장점과 단점 토론문 작성하기",
        kind: "task",
        weight: 20,
        timing: "9월 1주",
        method: "서술형·논술형",
      },
      {
        name: "인권 회복 포스터 만들기",
        kind: "task",
        weight: 20,
        timing: "10월 2주",
        method: "세계 대전 중·현대 사회의 인권 침해 사례와 해결 방안을 포스터로 제작하고 발표",
      },
      { name: "세계사 역사 신문 만들기", kind: "task", weight: 20, method: "서술형·논술형" },
    ],
    notes: [
      {
        title: "정기시험은 두 구간, 모두 선택형",
        body: "9월 4주 1회 고사의 범위는 제국주의와 국민 국가 건설 운동, 세계 대전과 국제 질서의 변화([9역05-01]~[9역06-01])이고, 12월 3주 2회 고사의 범위는 전쟁 범죄에 맞선 평화 유지 노력, 아시아·아프리카 민족 운동, 냉전, 민주주의와 인권, 세계화([9역06-02]~[9역07-03])입니다.",
      },
      {
        title: "토론문과 포스터는 서로 다른 단원에서 나옵니다",
        body: "토론문(9월 1주)은 산업혁명의 과정과 생태환경에 미친 영향을 분석해 자신의 주장을 토론문으로 쓰고 발표하는 과제입니다. 포스터(10월 2주)는 세계 대전 중 인권 침해 사례와 현대 사회의 사례를 각각 3가지 이상 제시하고 해결 방안을 포스터로 만들어 발표합니다.",
      },
      {
        title: "역사 신문은 1회 고사 단원을 다시 쓰는 과제",
        body: "세계사 역사 신문 만들기는 근대 국민 국가를 하나 골라 선정 이유, 성장 과정, 특징을 정리해 신문 형식으로 나타내고 발표하는 과제이며, 신문의 요소를 3가지 이상 활용했는지도 채점합니다. 성취기준이 [9역05-01]~[9역06-01]로 1회 고사 범위와 같습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 2,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "시험 2회 40% · 호흡 운동 탐구보고서 30%(9월 5주) · 전류·전압·저항 보고서 30%(10월 4주)",
    intro:
      "병천중학교 2학년 과학의 수행평가는 호흡 운동 모형 탐구(9월 5주)와 전류·전압·저항 실험(10월 4주) 두 편의 보고서이고 30%씩입니다. 정기시험 40%는 선택형과 단답형으로 구성되며, 호흡·배설 단원이 보고서와 시험에 모두 걸리므로 이 단원의 진도 시점을 가장 먼저 맞춥니다.",
    assessments: [
      {
        name: "1회 고사",
        kind: "exam",
        weight: 20,
        timing: "9월 4주",
        method: "선택형 70% 이하 · 서답형(단답형) 30% 이하",
      },
      {
        name: "2회 고사",
        kind: "exam",
        weight: 20,
        timing: "12월 3주",
        method: "선택형 70% 이하 · 서답형(단답형) 30% 이하",
      },
      {
        name: "호흡 운동의 원리 탐구보고서 작성",
        kind: "task",
        weight: 30,
        timing: "9월 5주",
        method: "서·논술형, 실험실습, 보고서평가",
      },
      {
        name: "저항 전류 전압 사이의 관계 탐구보고서 작성",
        kind: "task",
        weight: 30,
        timing: "10월 4주",
        method: "서·논술형, 실험실습, 보고서평가",
      },
    ],
    notes: [
      {
        title: "호흡 보고서는 모형 제작부터 비교까지",
        body: "호흡 운동 보고서는 모형 제작 10, 호흡계 기관 이름 쓰기 20, 큰 고무풍선을 당기거나 밀 때 작은 고무풍선의 부피 그리기 10, 원리 설명 30, 호흡계와 모형의 공통점·차이점 30으로 이루어집니다. 원리 설명은 탐구 결과와 관련지어야 30점이고 그렇지 않으면 20점입니다.",
      },
      {
        title: "전기 보고서는 그래프와 옴의 법칙을 묻습니다",
        body: "전류·전압·저항 보고서는 회로 구성 10, 전류의 세기 측정 10, 전류–전압·전류–저항 그래프 변환 20, 옴의 법칙 서술 30, 전압에 따른 전기 기구 변화 서술 30입니다. 마지막 항목은 전류의 세기 예측과 기구가 작동하지 않는 이유를 모두 써야 30점입니다.",
      },
      {
        title: "호흡 단원은 2회 고사 범위로 넘어갑니다",
        body: "호흡계 성취기준 [9과13-03]은 1회 고사 표시 뒤에 배우는 단원이라 2회 고사 범위에 들어가고, 1회 고사는 광합성, 식물의 호흡, 소화, 순환까지입니다. 2회 고사는 호흡·배설부터 전기와 자기, 별까지를 목록에 올려 두었습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 2,
    subjectSlug: "english",
    status: "published",
    planTerm: "2026-2",
    courses: ["영어"],
    summary: "시험 2회 40%(선택형) · 듣기평가 20%(9월 1주) · 어휘·문장 쓰기 20% · 쓰기와 말하기 20%(12월 2주)",
    intro:
      "병천중학교 2학년 영어의 정기시험은 9월 4주와 12월 3주 선택형 두 번이고, 그 사이에 듣기평가(9월 1주), 어휘와 문장 표현 쓰기(10월 1주), 쓰기와 말하기(12월 2주)가 20%씩 놓입니다. Lesson 5~8 구간을 달별로 끊어 과제 준비 시점을 정하는 것이 상담의 첫 작업입니다.",
    assessments: [
      { name: "1회 고사", kind: "exam", weight: 20, timing: "9월 4주", method: "선택형" },
      { name: "2회 고사", kind: "exam", weight: 20, timing: "12월 3주", method: "선택형" },
      { name: "영어듣기평가", kind: "task", weight: 20, timing: "9월 1주", method: "듣기 20문항" },
      { name: "어휘와 문장 표현 쓰기", kind: "task", weight: 20, timing: "10월 1주", method: "서술·논술, 포트폴리오" },
      {
        name: "단원 핵심 요소 활용 쓰기와 말하기",
        kind: "task",
        weight: 20,
        timing: "12월 2주",
        method: "서술·논술, 구술·발표, 포트폴리오",
      },
    ],
    notes: [
      {
        title: "평가 순서는 듣기, 시험, 쓰기, 말하기, 시험",
        body: "평가는 9월 1주 듣기평가, 9월 4주 1회 고사, 10월 1주 어휘와 문장 표현 쓰기, 12월 2주 쓰기와 말하기, 12월 3주 2회 고사 순입니다. 정기시험 두 회차는 모두 선택형 100%이고, 서·논술형은 수행평가의 어휘·문장 과제와 쓰기·말하기 과제에 표시되어 있습니다.",
      },
      {
        title: "듣기평가는 20문항, 체크 방법은 듣기뿐",
        body: "영어듣기평가는 대화의 주제와 세부 사항, 목적과 결과, 화자 간의 관계를 묻는 20문항으로 9월 1주에 치릅니다. 평가 방법에는 듣기만 표시되어 있고, 18~20문항을 맞히면 100점, 2문항 이하는 40점으로 적혀 있습니다.",
      },
      {
        title: "12월 과제는 발음과 억양까지 기대 수행에 포함",
        body: "단원 핵심 요소 활용 쓰기와 말하기는 정확한 단어 사용, 완전한 문장, 올바른 문장 형식과 문법, 정확한 발음과 억양을 기대 수행으로 두고, Lesson 7, 8 상황별 쓰기와 말하기 15개 제시 중 13개 이상이면 100점입니다. 자기성찰평가도 함께 표시되어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 3,
    subjectSlug: "math",
    status: "published",
    planTerm: "2026-2",
    courses: ["수학"],
    summary: "11월 2주 시험 한 번 40% · 풀이 과정 20%(수시) · 삼각비 서술 20%(9월) · 원의 성질 서술 20%(10월)",
    intro:
      "병천중학교 3학년 수학은 11월 2주 선택형 시험 한 번이 40%이고, 수행평가 60%는 수시로 쌓는 풀이 과정 정리와 9월 삼각비·10월 원의 성질 서술형으로 이루어집니다. 상담에서는 이차함수부터 통계까지 시험 범위가 네 단원이라는 점을 놓고 순서를 정합니다.",
    assessments: [
      { name: "2회 고사", kind: "exam", weight: 40, timing: "11월 2주", method: "선택형" },
      { name: "문제풀이 과정 작성하기", kind: "task", weight: 20, timing: "수시", method: "포트폴리오" },
      { name: "삼각비 문제 해결하기", kind: "task", weight: 20, timing: "9월", method: "서술형" },
      { name: "원의 성질 문제 해결하기", kind: "task", weight: 20, timing: "10월", method: "서술형" },
    ],
    notes: [
      {
        title: "산점도는 시험 표시 뒤에 배웁니다",
        body: "11월 2주 시험의 성취기준은 이차함수와 그래프, 삼각비, 원의 성질, 대푯값과 산포도이며 문항은 선택형 100%입니다. 진도표에서 3. 산점도와 상관관계([9수05-08])는 시험 표시 뒤에 오고, 그 다음에 Ⅳ~Ⅶ 단원 복습이 이어집니다.",
      },
      {
        title: "풀이 과정 정리는 28개 요소로 채점",
        body: "문제풀이 과정 작성하기는 채점 요소가 ①~㉘ 스물여덟 개로, 이차함수·삼각비·원·통계 단원마다 개념 정리, 스스로 문제 해결하기, 단원 마무리 문제 해결 과정 작성이 이어집니다. 26개 이상 만족하면 100점이고 23~25개는 90점이며, 시기는 ‘수시’로 적혀 있습니다.",
      },
      {
        title: "서술형 두 과제는 여섯 요소씩",
        body: "삼각비(9월)와 원의 성질(10월) 서술형은 각각 채점 요소 여섯 개를 모두 만족해야 100점이고, 충족 개수가 하나 줄면 10점씩 낮아집니다. 삼각비에는 특수각 값을 구하는 과정 설명과 실생활 문제 해결이, 원의 성질에는 접선과 현이 이루는 각을 상황을 나누어 기술하는 항목이 들어 있습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 3,
    subjectSlug: "social",
    status: "published",
    planTerm: "2026-2",
    courses: ["사회"],
    summary: "11월 2주 시험 한 번 40% · 서·논술형 수행 20%씩(9월 1주·9월 4주·11월 1주)",
    intro:
      "병천중학교 3학년 사회는 정기시험이 11월 2주 선택형 한 번이고, 서·논술형 수행평가 세 과제(9월 1주, 9월 4주, 11월 1주)가 20%씩입니다. 과제마다 따로 정해진 배점 구조를 먼저 읽고 시험 범위인 인구·도시·경제·환경 단원과 이어 붙이는 것이 시작입니다.",
    assessments: [
      { name: "2회 고사", kind: "exam", weight: 40, timing: "11월 2주", method: "선택형" },
      { name: "저출산·고령화 정책 제안과 표어·포스터 만들기", kind: "task", weight: 20, timing: "9월 1주", method: "서·논술형" },
      { name: "살고싶은 도시 설계 프로젝트", kind: "task", weight: 20, timing: "9월 4주", method: "서·논술형" },
      { name: "탄소중립 실천 계획 수립하기", kind: "task", weight: 20, timing: "11월 1주", method: "서·논술형" },
    ],
    notes: [
      {
        title: "서·논술형은 수행평가에서만 60%",
        body: "정기시험은 선택형 100%이고, 서·논술형은 세 수행평가 과제에 20%씩 표시되어 합계 60%입니다. 세 과제 모두 평가 유의사항에 AI 도구를 활용할 수 없다고 적혀 있고, 과제 시기는 9월 초와 9월 말, 11월 초로 나뉩니다.",
      },
      {
        title: "앞의 두 과제는 15·30·40·15 구조",
        body: "저출산·고령화 과제는 원인 분석 15점, 정책 제안의 타당성·구체성 30점, 표어·포스터의 전달력·창의성 40점, 내용 충실성 15점입니다. 도시 설계도 도시 내부 구조 15점, 살기 좋은 도시 조건 30점, 설계의 창의성 40점, 충실성 15점이며, 조건을 3~5가지 제시해야 30점입니다.",
      },
      {
        title: "탄소중립 과제와 시험 범위의 경계",
        body: "탄소중립 과제는 기후변화 원인 분석 15점, 생활·지역에 미치는 영향 30점, 실천계획의 구체성 40점, 충실성 15점이며 실천 항목을 3~5가지 제시해야 40점입니다. 시험 성취기준 목록에는 인구, 도시, 글로벌 경제, 기후 변화와 환경 단원이 있고 11. 세계 속의 우리나라는 없습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
  },
  {
    schoolSlug: "byeongcheon-middle-school",
    grade: 3,
    subjectSlug: "science",
    status: "published",
    planTerm: "2026-2",
    courses: ["과학"],
    summary: "시험 50%(11월 2주) · 가계도 분석 25%(9월 4주) · 가전제품 소비 전력 비교 25%(10월 2주)",
    intro:
      "병천중학교 3학년 과학은 정기시험과 수행평가가 50%씩이고, 시험 안에 서·논술형이 20% 이상 들어갑니다. 수행평가는 9월 4주 가계도 분석과 10월 2주 가전제품 소비 전력 비교 두 편이라, 그래서 서술형 두 과제와 시험의 서·논술 문항을 한 묶음으로 보고 준비 순서를 잡습니다.",
    assessments: [
      {
        name: "2회 고사",
        kind: "exam",
        weight: 50,
        timing: "11월 2주",
        method: "선택형 70% 이하 · 단답형 10% 이하 · 서·논술형 20% 이상",
      },
      { name: "사람의 유전과 가계도 분석하기", kind: "task", weight: 25, timing: "9월 4주", method: "서·논술형" },
      { name: "가전제품의 소비 전력 비교하기", kind: "task", weight: 25, timing: "10월 2주", method: "서·논술형" },
    ],
    notes: [
      {
        title: "시험 범위는 호르몬부터 우주 탐사까지",
        body: "정기시험은 11월 2주 한 번이고, 성취기준 목록은 호르몬([9과20-03])에서 우주 탐사([9과23-04])까지 자극과 반응, 생식과 유전, 에너지 전환과 보존, 별과 우주를 포함합니다. Ⅷ. 과학 기술과 인류 문명은 진도표에서 시험 표시 뒤에 배웁니다.",
      },
      {
        title: "가계도 분석 50점은 네 조건을 모두 채워야 합니다",
        body: "사람의 유전과 가계도 분석하기는 유전 연구 방법 20점, 사람의 형질 30점, 가계도 분석 50점입니다. 분석 항목은 가계도 기호 작성, 특정 유전 형질 구분, 올바른 유전자형 표기, 유전자 위치(성염색체 또는 상염색체) 판단의 네 조건을 모두 충족해야 50점이고, 조건 하나가 빠질 때마다 10점씩 낮아집니다.",
      },
      {
        title: "전력량 계산에는 단위와 사용 시간이 들어갑니다",
        body: "가전제품의 소비 전력 비교하기는 에너지 전환 과정 30점, 전력량 계산 및 비교 50점, 에너지 절약 방안 설계 20점입니다. 전력량 항목은 세 기기의 전력량을 올바른 단위와 함께 계산하고, 차이를 소비 전력과 사용 시간을 모두 넣어 서술해야 50점을 받습니다.",
      },
    ],
    sources: [schoolInfoPlanSource("병천중학교")],
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
