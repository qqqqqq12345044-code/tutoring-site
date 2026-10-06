import { neisSchoolSource, type ContentSource } from "@/data/sources";

/**
 * Region-specific content for a (region × grade × subject) combination —
 * only the part that is genuinely unique to the region. Grade-tier content
 * shared across all regions lives in gradeSubjectPlaybook.ts instead, so
 * this file can't be filled by copy-pasting the same explanation with the
 * region name swapped.
 *
 * Key relationships (enforced by convention, not types):
 * - regionSlug must be a city-level RegionNode.slug from src/data/regions.ts
 *   (not a province or district slug).
 * - gradeSlug must be a Grade.slug from src/data/grades.ts.
 * - subjectSlug must be a Subject.slug from src/data/subjects.ts.
 *
 * src/lib/indexability.ts's "region-grade-subject" case gates on
 * isPublishedContent(): an entry only makes the combination index+sitemap
 * eligible once status is "published" AND regionSpecificNotes is non-empty.
 * A "draft" entry, or one with no notes yet, is treated exactly like having
 * no entry at all — noindex, out of the sitemap, and not rendered on the page.
 */
export interface RegionGradeSubjectContent {
  regionSlug: string;
  gradeSlug: string;
  subjectSlug: string;
  status: "draft" | "published";
  intro: string;
  regionSpecificNotes: { title: string; body: string }[];
  /**
   * Where the entry's factual statements come from — official pages that were
   * actually opened (시청 연혁, 교육부 NEIS 학교기본정보, 학교 공식 연혁 등).
   * Shown to visitors in the page's "참고 자료" block (SourceList) and required for
   * the quality gate's GREEN grade (scripts/lib/quality-gate.ts); without it the entry is AMBER.
   */
  sources?: ContentSource[];
}

export const regionGradeSubjectContents: RegionGradeSubjectContent[] = [
  {
    regionSlug: "suwon",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "수원은 장안구·권선구·팔달구·영통구 4개 구로 이루어진 도시입니다. 교과설계소에 등록된 수원 중학교 4곳은 영통중학교·매향중학교·수원북중학교·화홍중학교로 4개 구에 한 곳씩 있어, 중학교 수학과외를 알아볼 때는 자녀의 학교가 어느 구에 있는지부터 확인하면 편합니다.",
    regionSpecificNotes: [
      {
        title: "수원 4개 구의 설치 순서",
        body: "수원시는 1988년 7월 1일 장안구와 권선구를, 1993년 2월 1일 팔달구를, 2003년 11월 24일 영통구를 설치해 지금의 4개 구가 되었습니다.",
      },
      {
        title: "등록 중학교는 4개 구에 한 곳씩",
        body: "영통중학교는 영통구 영통동, 매향중학교는 팔달구 매향동, 수원북중학교는 장안구 영화동, 화홍중학교는 권선구 권선동에 있습니다. 이 가운데 매향중학교만 사립이며, 1902년 설립되어 등록된 네 학교 중 가장 오래되었습니다.",
      },
    ],
    sources: [
      { label: "수원시청 영통구 — 연혁 (1988 장안·권선, 1993 팔달, 2003 영통 구 설치)", url: "https://yt.suwon.go.kr/_pcfg/?menuid=sub010201" },
      neisSchoolSource("영통중학교"),
      neisSchoolSource("매향중학교"),
      neisSchoolSource("수원북중학교"),
      neisSchoolSource("화홍중학교"),
    ],
  },
  {
    regionSlug: "suwon",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "수원은 수원고등학교를 비롯한 여러 고등학교가 있어, 재학 중인 학교의 내신 시험 범위와 모의고사 일정에 맞춰 수학 학습 계획을 조정하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "수원고등학교 등 지역 내 고등학교 연계",
        body: "수원고등학교처럼 수원 내 실제 재학 중인 학교가 있다면 해당 학교별 과외 페이지와 연결해 안내합니다.",
      },
      {
        title: "수원 4개 구 통학·배정 구조",
        body: "영통구·팔달구·장안구·권선구 등 거주 지역에 따라 배정 고등학교가 달라, 재학 중인 학교를 기준으로 진도와 시험 범위를 확인합니다.",
      },
    ],
  },
  {
    regionSlug: "gangnam",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "강남에는 대치중학교를 비롯한 여러 중학교가 있어, 재학 중인 학교의 영어 내신 범위와 서술형 출제 방식을 먼저 확인한 뒤 학습 계획을 세우는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "대치중학교 학생 안내",
        body: "대치중학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "강남 지역 학교 정보 연계",
        body: "강남에는 대치중학교와 함께 역삼중학교·압구정중학교 정보도 등록되어 있어, 재학 중인 학교의 영어 내신 방식을 비교해가며 준비할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "gangnam",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "강남은 개포고등학교를 포함해 고등학교가 여러 곳 있는 지역으로, 재학 중인 학교의 내신 시험 범위와 모의고사 일정에 맞춰 수학 학습 계획을 조정하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "개포고등학교 학생 안내",
        body: "개포고등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "강남 지역 고등 수학 참고 정보",
        body: "개포고등학교 외에도 강남에는 현대고등학교·중동고등학교 정보가 있어, 재학 중인 고등학교의 수학 내신 범위를 비교해 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "seocho",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "서초에는 학교 유형이 서로 다른 중학교가 등록되어 있습니다. 세화여자중학교는 사립 여학교, 반포중학교는 공립 남학교, 언남중학교는 공립 남녀공학이어서, 중학교 영어과외를 알아볼 때는 자녀 학교의 유형과 소재지부터 확인하는 것이 좋습니다.",
    regionSpecificNotes: [
      {
        title: "등록 중학교 3곳의 학교 유형",
        body: "세화여자중학교는 1978년 설립된 사립 여학교이고, 반포중학교는 1974년 설립된 공립 남학교입니다. 언남중학교는 1988년 설립된 공립 남녀공학입니다.",
      },
      {
        title: "반포동에 두 학교, 양재동에 한 학교",
        body: "세화여자중학교(신반포로 56-7)와 반포중학교(신반포로 67)는 모두 반포동에 있고, 언남중학교(동산로 55)는 양재동에 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("세화여자중학교"),
      neisSchoolSource("반포중학교"),
      neisSchoolSource("언남중학교"),
    ],
  },
  {
    regionSlug: "songpa",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "가락고등학교가 있는 송파에서 수학 과외를 찾는다면, 재학 중인 학교의 내신 범위를 먼저 확인하고 목표에 맞는 학습 계획을 세우는 것이 좋습니다.",
    regionSpecificNotes: [
      {
        title: "가락고등학교 학생 안내",
        body: "가락고등학교에 재학 중이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "송파 지역 학교급별 데이터 연계",
        body: "송파는 초등(서울송파초등학교)·중등(가락중학교)·고등(가락고등학교) 학교 정보가 함께 등록되어 있어, 학년이 바뀌어도 지역 내에서 이어서 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "yangcheon",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "양천의 중학교는 교명 속 동 이름과 실제 소재 동이 다른 경우가 있습니다. 목동중학교와 신서중학교는 신정동에 있고 신목중학교가 목동에 있어, 중학교 수학과외를 알아볼 때는 교명보다 소재지로 학교를 확인하는 편이 정확합니다.",
    regionSpecificNotes: [
      {
        title: "목동중학교는 목동이 아닌 신정동 소재",
        body: "목동중학교는 목동동로 172(신정동), 신서중학교는 중앙로 206(신정동)에 있고, 목동중앙로 88에 있는 신목중학교가 목동에 있습니다.",
      },
      {
        title: "강서양천교육지원청 관할의 양천구 학교",
        body: "양천구의 세 중학교는 모두 서울특별시강서양천교육지원청 관할의 공립 남녀공학 학교입니다. 같은 교육지원청 관할인 서울양천초등학교는 이름과 달리 양천구가 아닌 강서구 가양동에 있어, 교과설계소는 이 학교를 강서구 학교로 분류합니다.",
      },
    ],
    sources: [
      neisSchoolSource("목동중학교"),
      neisSchoolSource("신목중학교"),
      neisSchoolSource("신서중학교"),
      neisSchoolSource("서울양천초등학교"),
    ],
  },
  {
    regionSlug: "seongnam",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "성남은 서현중학교 등 여러 중학교가 있는 지역으로, 재학 중인 학교의 수학 단원별 진도를 확인한 뒤 취약한 부분부터 보완하는 학습 계획이 필요합니다.",
    regionSpecificNotes: [
      {
        title: "서현중학교 학생 안내",
        body: "서현중학교에 재학 중이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "성남 지역 중학교 정보 비교",
        body: "성남에는 서현중학교뿐 아니라 이매중학교·판교중학교 정보도 등록되어 있으니, 학교별 수학 진도 차이를 미리 비교해두면 계획을 세우기 쉬워집니다.",
      },
    ],
  },
  {
    regionSlug: "yongin",
    gradeSlug: "high",
    subjectSlug: "english",
    status: "published",
    intro:
      "용인은 신갈고등학교를 포함해 고등학교가 있는 지역으로, 재학 중인 학교의 영어 내신 범위와 모의고사 일정에 맞춰 학습 계획을 세우는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "신갈고등학교 학생 안내",
        body: "신갈고등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "용인 지역 고등학교 정보 비교",
        body: "용인에는 신갈고등학교 외에 죽전고등학교·수지고등학교 정보도 있어, 재학 중인 고등학교의 영어 내신·모의고사 방식을 비교해 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "goyang",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "고양은 백마중학교 등 여러 중학교가 있는 지역으로, 재학 중인 학교의 수학 진도를 확인하고 이전 학년 개념 중 놓친 부분을 함께 점검하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "백마중학교 학생 안내",
        body: "백마중학교에 재학 중이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "고양 지역 중학교 정보 비교",
        body: "고양 지역에는 백마중학교와 함께 행신중학교·일산중학교 정보도 있어, 전학이나 배정 변경이 있더라도 지역 내에서 계속 참고할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "anyang",
    gradeSlug: "high",
    subjectSlug: "english",
    status: "published",
    intro:
      "안양은 안양외국어고등학교처럼 외국어 교육에 특화된 고등학교가 있는 지역으로, 학교 유형에 따라 영어 학습 방향이 달라질 수 있어 재학 중인 학교를 기준으로 계획을 세우는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "외국어고라는 학교 특성",
        body: "안양외국어고등학교는 외국어 교육에 특화된 특수목적고등학교인 만큼, 일반고와는 영어 교과 편성이 다를 수 있어 학교 교육과정 안내를 함께 확인하는 것을 권장합니다.",
      },
      {
        title: "안양외국어고등학교 학생 안내",
        body: "안양외국어고등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 확인해보세요.",
      },
    ],
  },
  {
    regionSlug: "bucheon",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "부천은 부천중학교 등 여러 중학교가 있는 지역으로, 학교별 영어 진도와 시험 범위가 다를 수 있어 재학 중인 학교 정보부터 확인하는 것이 좋습니다.",
    regionSpecificNotes: [
      {
        title: "부천 지역 영어 학습 준비",
        body: "부천중학교를 포함해 부천 내 중학교들은 학교마다 영어 부교재와 수행평가 방식이 다를 수 있어, 학교 공지사항을 함께 확인하며 준비합니다.",
      },
      {
        title: "부천 지역 중학교 정보 비교",
        body: "부천중학교 외에도 부천에는 상동중학교·소사중학교 정보가 있어, 재학 중인 중학교의 영어 수행평가 방식을 확인하며 준비하는 것이 좋습니다.",
      },
    ],
  },

  // 2026-09 확장분 — 서울 마포구·강서구, 인천 6개 구/군 (마포구·강서구는 이미 학교별
  // 콘텐츠가 있는 학교를 우선 활용, 인천은 나무위키 구역별 학교 목록 대조 확인)
  {
    regionSlug: "mapo",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "마포구 지역의 중학교인 마포중학교 재학생이라면, 학교 진도에 맞춰 영어 취약 부분부터 보완하는 것이 효과적입니다.",
    regionSpecificNotes: [
      {
        title: "마포중학교 학생 안내",
        body: "학교별 과외 페이지에서 마포중학교 재학생을 위한 안내를 확인해보세요.",
      },
      {
        title: "마포구 지역 구조",
        body: "마포구는 마포중학교·숭문고등학교 등 여러 학교가 등록되어 있어, 재학 중인 학교의 최근 시험 형식을 기준으로 준비하는 것이 효과적입니다.",
      },
    ],
  },
  {
    regionSlug: "mapo",
    gradeSlug: "high",
    subjectSlug: "english",
    status: "published",
    intro:
      "마포구 지역의 고등학교인 숭문고등학교 재학생이라면, 학교 진도에 맞춰 영어 취약 부분부터 보완하는 것이 효과적입니다.",
    regionSpecificNotes: [
      {
        title: "숭문고등학교 학생 안내",
        body: "학교별 과외 페이지에서 숭문고등학교 재학생을 위한 안내를 확인해보세요.",
      },
      {
        title: "마포구 학교급별 연계",
        body: "숭문고등학교로 진학했다면 이전 학교급인 마포중학교 페이지의 안내도 함께 참고하면, 지역 내 학습 흐름을 비교하며 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "gangseo",
    gradeSlug: "elementary",
    subjectSlug: "math",
    status: "published",
    intro:
      "강서구는 서울양천초등학교 등 실제 재학 학교 정보가 등록된 지역으로, 수학 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "서울양천초등학교 학생 안내",
        body: "서울양천초등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "강서구 지역 구조",
        body: "강서구는 서울양천초등학교·마포고등학교처럼 교명과 실제 소재지가 다른 학교가 있어, 학교명이 아닌 실제 재학 학교를 기준으로 지역 정보를 확인하는 것이 중요합니다.",
      },
    ],
  },
  {
    regionSlug: "gangseo",
    gradeSlug: "high",
    subjectSlug: "korean",
    status: "published",
    intro:
      "강서구는 마포고등학교 등 실제 재학 학교 정보가 등록된 지역으로, 국어 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "마포고등학교 학생 안내",
        body: "마포고등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "강서구 지역 구조",
        body: "강서구는 학교명과 실제 위치가 일치하지 않는 학교가 있어, 국어 학습 계획을 세울 때도 등록된 실제 학교명을 기준으로 확인하는 것이 정확합니다.",
      },
    ],
  },
  {
    regionSlug: "michuhol",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "미추홀구 지역의 중학교인 관교중학교 재학생이라면, 학교 진도에 맞춰 수학 취약 부분부터 보완하는 것이 효과적입니다.",
    regionSpecificNotes: [
      {
        title: "관교중학교 학생 안내",
        body: "관교중학교 학생이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "미추홀구 지역 구조",
        body: "미추홀구는 관교중학교·인천고등학교 등 학교급별 정보가 함께 등록되어 있어, 학년이 바뀌어도 지역 내에서 이어서 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "michuhol",
    gradeSlug: "high",
    subjectSlug: "english",
    status: "published",
    intro:
      "미추홀구는 인천고등학교 등 실제 재학 학교 정보가 등록된 지역으로, 영어 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "인천고등학교 학생 안내",
        body: "인천고등학교 학생이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "미추홀구 학교급별 연계",
        body: "인천고등학교로 진학한 경우에도 이전 학교급인 관교중학교 페이지의 안내를 함께 살펴보면 지역 내 학습 흐름을 비교할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "yeonsu",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "연수구는 연수중학교 등 실제 재학 학교 정보가 등록된 지역으로, 영어 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "연수중학교 학생 안내",
        body: "연수중학교 학생이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "연수구 지역 구조",
        body: "연수구는 송도 등 신도시 개발로 학교가 계속 늘어나는 지역이라, 재학 중인 학교의 최신 공지사항을 함께 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    regionSlug: "yeonsu",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "연수구 지역의 고등학교인 연수고등학교 재학생이라면, 학교 진도에 맞춰 수학 취약 부분부터 보완하는 것이 효과적입니다.",
    regionSpecificNotes: [
      {
        title: "연수고등학교 학생 안내",
        body: "학교별 과외 페이지에서 연수고등학교 재학생을 위한 안내를 확인해보세요.",
      },
      {
        title: "연수구 지역 구조",
        body: "연수구는 송도국제도시 개발이 이어지며 학교 신설이 잦은 지역이라, 연수고등학교 재학생도 학교 홈페이지의 최신 공지를 함께 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    regionSlug: "namdong",
    gradeSlug: "middle",
    subjectSlug: "korean",
    status: "published",
    intro:
      "남동구는 구월중학교 등 실제 재학 학교 정보가 등록된 지역으로, 국어 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "구월중학교 학생 안내",
        body: "구월중학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "남동구 지역 구조",
        body: "남동구는 구월동을 중심으로 여러 학교가 밀집해 있어, 재학 중인 학교의 시험 범위를 우선 기준으로 학습 계획을 세우는 것이 좋습니다.",
      },
    ],
  },
  {
    regionSlug: "namdong",
    gradeSlug: "high",
    subjectSlug: "social",
    status: "published",
    intro:
      "남동구는 인천남동고등학교 등 실제 재학 학교 정보가 등록된 지역으로, 사회 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "인천남동고등학교 학생 안내",
        body: "인천남동고등학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "남동구 지역 구조",
        body: "남동구는 구월동 일대에 학교가 밀집해 있어, 인천남동고등학교 재학생도 학교별 사회 시험 범위를 우선 기준으로 삼아 계획을 세우는 것이 좋습니다.",
      },
    ],
  },
  {
    regionSlug: "bupyeong",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "부평중학교가 있는 부평구에서 영어과외를 찾는다면, 재학 중인 학교의 평가 방식을 먼저 확인하고 학습 계획을 세우는 것이 좋습니다.",
    regionSpecificNotes: [
      {
        title: "부평중학교 학생 안내",
        body: "부평중학교 학생이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "부평구 지역 구조",
        body: "부평구는 부평중학교·부평고등학교 등 학교급별 정보가 함께 등록되어 있어, 학년이 바뀌어도 지역 내에서 이어서 확인할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "bupyeong",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "부평구는 부평고등학교 등 실제 재학 학교 정보가 등록된 지역으로, 수학 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "부평고등학교 학생 안내",
        body: "학교별 과외 페이지에서 부평고등학교 재학생을 위한 안내를 확인해보세요.",
      },
      {
        title: "부평구 학교급별 연계",
        body: "부평고등학교로 진학한 경우에도 이전 학교급인 부평중학교 페이지의 안내를 함께 참고하면 지역 내 학습 흐름을 비교할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "gyeyang",
    gradeSlug: "middle",
    subjectSlug: "social",
    status: "published",
    intro:
      "계양구는 계산중학교 등 실제 재학 학교 정보가 등록된 지역으로, 사회 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "계산중학교 학생 안내",
        body: "계산중학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "계양구 지역 구조",
        body: "계양구는 계산동을 중심으로 여러 학교가 모여 있어, 재학 중인 학교의 평가 기준을 먼저 확인하고 학습 방향을 정하는 것이 좋습니다.",
      },
    ],
  },
  {
    regionSlug: "gyeyang",
    gradeSlug: "high",
    subjectSlug: "english",
    status: "published",
    intro:
      "계양구에는 계산고등학교를 포함한 고등학교 정보가 등록되어 있어, 재학 중인 학교를 기준으로 영어 학습 방향을 정하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "계산고등학교 학생 안내",
        body: "계산고등학교 학생이라면 학교별 과외 페이지도 함께 참고할 수 있습니다.",
      },
      {
        title: "계양구 학교급별 연계",
        body: "계산고등학교로 진학했다면 이전 학교급인 계산중학교 페이지의 안내도 함께 확인하면 지역 내 학습 방향을 비교할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "ganghwa",
    gradeSlug: "middle",
    subjectSlug: "science",
    status: "published",
    intro:
      "강화군은 강화중학교 등 실제 재학 학교 정보가 등록된 지역으로, 과학 학습을 시작하기 전에 재학 중인 학교의 진도와 시험 범위부터 확인하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "강화중학교 학생 안내",
        body: "강화중학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "강화군 지역 구조",
        body: "강화군은 도서 지역 특성상 학교 수가 많지 않아, 강화중학교·강화고등학교 재학생이라면 학교 자체 공지사항을 우선 확인하는 것이 효과적입니다.",
      },
    ],
  },
  {
    regionSlug: "ganghwa",
    gradeSlug: "high",
    subjectSlug: "korean",
    status: "published",
    intro:
      "강화군 지역의 고등학교인 강화고등학교 재학생이라면, 학교 진도에 맞춰 국어 취약 부분부터 보완하는 것이 효과적입니다.",
    regionSpecificNotes: [
      {
        title: "강화고등학교 학생 안내",
        body: "학교별 과외 페이지에서 강화고등학교 재학생을 위한 안내를 확인해보세요.",
      },
      {
        title: "강화군 지역 구조",
        body: "강화군은 학교 수가 많지 않은 도서 지역 특성이 있어, 강화고등학교 재학생도 학교 자체 공지사항을 우선 확인하며 준비하는 것이 효과적입니다.",
      },
    ],
  },

  // ── STEP 8 (2026-10-06): 1차 문서(위키백과 시·학교 문서)로 확인한 행정구 연혁·학교 소재지만 사용 ──
  // 새 후보는 먼저 status "draft"(noindex·sitemap 제외·미렌더링)로 두고
  // `npx tsx scripts/audit-quality.ts --dry-run` 으로 채점한 뒤, GREEN일 때만 "published" 로 전환한다.
  // 학교별 시험범위·성적·학군·합격률 등 확인되지 않은 정보는 쓰지 않는다.
  {
    regionSlug: "seongnam",
    gradeSlug: "middle",
    subjectSlug: "english",
    status: "published",
    intro:
      "성남에서 중학교 영어과외를 알아본다면 자녀의 학교가 성남 어느 구에 있는지부터 확인하는 것이 좋습니다. 교과설계소에 등록된 성남 중학교는 서현중학교·이매중학교·판교중학교이며, 세 학교 모두 분당구에 있습니다.",
    regionSpecificNotes: [
      {
        title: "성남시 구청 설치 연혁과 분당구 승격",
        body: "성남시는 1988년 7월 1일 수정출장소와 중원출장소를 설치했고, 1989년 5월 1일 이를 수정구청·중원구청으로 승격했습니다. 1991년 9월 17일에는 분당출장소를 분당구청으로 승격해(시조례 제1152호) 지금의 수정구·중원구·분당구 3개 구가 되었습니다.",
      },
      {
        title: "등록 중학교는 모두 분당구 소재",
        body: "서현중학교는 분당구 서현동에 1991년, 이매중학교는 분당구 이매동에 1992년, 판교중학교는 분당구 판교동에 2009년 설립된 공립 중학교입니다. 수정구·중원구 소재 중학교는 아직 등록되어 있지 않아, 두 구의 학생은 상담 때 재학 학교와 학년을 알려주셔야 시험 방식에 맞춰 안내할 수 있습니다.",
      },
    ],
    sources: [
      { label: "성남시청 — 성남시 연혁 (수정·중원출장소 설치, 구청 승격, 분당구청 승격)", url: "https://www.seongnam.go.kr/sn04030101" },
      neisSchoolSource("서현중학교"),
      neisSchoolSource("이매중학교"),
      neisSchoolSource("판교중학교"),
    ],
  },
  {
    regionSlug: "yongin",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "신갈중학교·죽전중학교·수지중학교가 등록된 용인은 구가 세 개인 도시입니다. 중학교 수학과외를 알아볼 때 자녀의 학교가 기흥구인지 수지구인지부터 정리해두면 상담이 한결 수월해집니다.",
    regionSpecificNotes: [
      {
        title: "2005년 3개 구청 설치와 수지출장소 승격",
        body: "용인시는 2001년 12월 24일 수지읍을 수지출장소로 승격한 데 이어, 2005년 10월 31일 처인구·기흥구·수지구 3개 구청을 설치해 3개 구 1읍 6면 22동 행정체제가 되었습니다.",
      },
      {
        title: "등록 중학교의 구별 분포",
        body: "신갈중학교는 기흥구 신갈동에, 죽전중학교와 수지중학교는 수지구 죽전동·풍덕천동에 있습니다. 처인구에 있는 중학교는 아직 등록되지 않았습니다.",
      },
    ],
    sources: [
      { label: "용인시청 — 용인시 연혁 (수지출장소 승격, 2005-10-31 3개 구청 설치)", url: "https://www.yongin.go.kr/home/yiIf/yiIfProd/yiIfProd02.jsp" },
      neisSchoolSource("신갈중학교"),
      neisSchoolSource("죽전중학교"),
      neisSchoolSource("수지중학교"),
    ],
  },
  {
    regionSlug: "bucheon",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "부천은 구가 사라졌다가 다시 생긴 이력이 있는 도시입니다. 부천중학교·상동중학교·소사중학교 학생이 중학교 수학과외를 알아볼 때 학교 위치는 지금의 구 기준으로 확인하면 됩니다.",
    regionSpecificNotes: [
      {
        title: "부천 일반구의 폐지와 2024년 재설치",
        body: "1993년 2월 중구가 오정구와 원미구로 나뉘고 경인철도 남쪽은 소사구가 되었습니다. 이 구들은 2016년 책임동제 실시로 폐지되었다가 2024년 1월 1일 구 설치와 일반동 전환으로 다시 설치되었습니다.",
      },
      {
        title: "원미구에 2곳, 소사구에 1곳",
        body: "부천중학교(중동)와 상동중학교(상동)는 원미구에, 소사중학교(소사본동)는 소사구에 있습니다. 부천시 행정구역 표에서도 중동·상동은 원미구, 소사본동은 소사구 소속입니다. 오정구 소재 학교는 등록 전입니다.",
      },
    ],
    sources: [
      { label: "부천시청 원미구 — 행정구역변천사 (1993 분구, 2016 폐지, 2024 재설치)", url: "https://wonmi.bucheon.go.kr/site/homepage/menu/viewMenu?menuid=170001002003001" },
      { label: "부천시청 소사구 — 행정구역변천사", url: "https://sosa.bucheon.go.kr/site/homepage/menu/viewMenu?menuid=171001002003001" },
      { label: "부천시청 — 부천시 행정구역 (구별 소속 동)", url: "https://www.bucheon.go.kr/site/homepage/menu/viewMenu?menuid=148009003" },
      neisSchoolSource("부천중학교"),
      neisSchoolSource("상동중학교"),
      neisSchoolSource("소사중학교"),
    ],
  },
  {
    regionSlug: "anyang",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "안양은 만안구와 동안구 두 개 구로만 이루어져 있습니다. 중학교 수학과외를 알아보는 안양 학생이라면 안양중학교·평촌중학교·호계중학교 중 어느 곳에 다니는지, 그 학교가 어느 구에 있는지를 함께 알려주시면 됩니다.",
    regionSpecificNotes: [
      {
        title: "1992년 구청이 설치된 만안구·동안구",
        body: "안양시 연혁에 따르면 1992년 10월 1일 만안·동안 출장소가 폐지되고 만안구청과 동안구청이 설치되어 지금의 2개 구가 되었습니다.",
      },
      {
        title: "설립 시기가 40여 년 벌어진 안양중·평촌중",
        body: "만안구 석수동의 안양중학교는 1940년대에, 동안구 평촌동의 평촌중학교는 1992년에 설립되어 설립 시기가 40여 년 차이 납니다. 같은 동안구의 호계중학교는 호계동에 1988년 설립된 공립 중학교입니다.",
      },
    ],
    sources: [
      { label: "안양시청 — 안양시 연혁 (1992-10-01 만안·동안구청 설치)", url: "https://www.anyang.go.kr/main/contents.do?key=289" },
      neisSchoolSource("안양중학교"),
      neisSchoolSource("평촌중학교"),
      neisSchoolSource("호계중학교"),
    ],
  },
  {
    regionSlug: "goyang",
    gradeSlug: "high",
    subjectSlug: "math",
    status: "published",
    intro:
      "고양에서 고등학교 수학과외를 찾는다면 고양시의 세 구를 하나씩 구분해서 학교 위치를 보는 것이 좋습니다. 교과설계소에 등록된 고양 고등학교는 행신고등학교(덕양구)·일산고등학교(일산서구)·고양국제고등학교(일산동구)로, 세 학교가 서로 다른 구에 있습니다.",
    regionSpecificNotes: [
      {
        title: "고양시 3개 구의 설치 연혁",
        body: "고양시는 1996년 3월 1일 덕양구와 일산구를 설치했고, 2005년 5월 16일 시조례 제892호에 따라 일산구를 일산동구와 일산서구로 분구해 지금의 3개 구가 되었습니다.",
      },
      {
        title: "일산고는 일산동구가 아닌 일산서구 소재",
        body: "일산고등학교는 일산동구가 아니라 일산서구 일산동에 있는 공립 고등학교로 1956년에 설립되었습니다. 행신고등학교는 덕양구 행신동에 1995년, 고양국제고등학교는 일산동구 식사동에 2011년 설립되었으며, 고양국제고등학교는 학교기본정보상 국제계열 특수목적고등학교로 분류되어 있습니다.",
      },
    ],
    sources: [
      { label: "고양시청 — 고양연혁 (1996 덕양구·일산구 설치, 2005-05-16 일산동·서구 분구)", url: "https://www.goyang.go.kr/www/www05/www05_1/www05_1_4.jsp" },
      neisSchoolSource("행신고등학교"),
      neisSchoolSource("일산고등학교"),
      neisSchoolSource("고양국제고등학교"),
    ],
  },
  {
    regionSlug: "songpa",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "송파에서 중학교 수학과외를 찾을 때는 학교 이름 속 지명과 실제 소재 동이 다를 수 있다는 점을 알아두면 좋습니다. 교과설계소에 등록된 송파 중학교는 가락중학교·잠실중학교·문정중학교입니다.",
    regionSpecificNotes: [
      {
        title: "교명과 소재 동이 다른 가락중·잠실중",
        body: "가락중학교는 가락동이 아니라 송파동 송이로에 있고, 잠실중학교는 잠실동이 아니라 신천동 올림픽로35길에 있습니다. 학교명만 보고 위치를 짐작하기보다 소재지를 직접 확인하는 편이 정확합니다.",
      },
      {
        title: "등록 중학교는 모두 공립, 설립 시기는 제각각",
        body: "잠실중학교는 1980년, 가락중학교는 1986년, 문정중학교는 1990년에 설립된 공립 중학교입니다. 문정중학교는 문정동 문정로에 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("가락중학교"),
      neisSchoolSource("잠실중학교"),
      neisSchoolSource("문정중학교"),
    ],
  },
];

export function getRegionGradeSubjectContent(
  regionSlug: string,
  gradeSlug: string,
  subjectSlug: string
): RegionGradeSubjectContent | undefined {
  return regionGradeSubjectContents.find(
    (c) => c.regionSlug === regionSlug && c.gradeSlug === gradeSlug && c.subjectSlug === subjectSlug
  );
}

/** Whether a region-grade-subject entry is complete enough to be shown/indexed. */
export function isPublishedContent(
  content: RegionGradeSubjectContent | undefined
): content is RegionGradeSubjectContent {
  return Boolean(content && content.status === "published" && content.regionSpecificNotes.length > 0);
}
