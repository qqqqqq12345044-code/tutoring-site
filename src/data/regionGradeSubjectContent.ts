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
   * Where the entry's factual statements come from (e.g. "학교알리미 소재지",
   * "인천광역시 행정체제 개편 고시"). Required for the quality gate's GREEN
   * grade (scripts/lib/quality-gate.ts); an entry without sources is AMBER.
   */
  sources?: string[];
}

export const regionGradeSubjectContents: RegionGradeSubjectContent[] = [
  {
    regionSlug: "suwon",
    gradeSlug: "middle",
    subjectSlug: "math",
    status: "published",
    intro:
      "수원은 영통구·팔달구·장안구·권선구로 나뉘어 있어 같은 중학교 수학이라도 자녀가 다니는 구와 학교의 진도에 따라 학습 계획이 달라집니다. 지역 내 학교 정보를 먼저 확인하고 필요한 부분부터 학습합니다.",
    regionSpecificNotes: [
      {
        title: "수원 4개 구 학군 구조",
        body: "영통구·팔달구·장안구·권선구 각 구마다 배정 학교가 다르므로, 자녀가 다니는 구의 학교를 기준으로 진도와 시험 범위를 확인합니다.",
      },
      {
        title: "영통중학교 등 지역 내 학교 연계",
        body: "영통중학교처럼 수원 내 실제 재학 중인 학교가 있다면 해당 학교별 과외 페이지와 연결해 안내합니다.",
      },
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
      "서초에는 세화여자중학교처럼 여학생을 대상으로 하는 중학교가 있어, 학교 유형과 진도에 맞춰 영어 학습 방향을 정하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "여자중학교라는 학교 특성",
        body: "세화여자중학교는 여학생을 대상으로 하는 학교인 만큼, 학교 홈페이지 공지사항을 통해 최신 영어 교과서와 부교재 정보를 확인하는 것을 권장합니다.",
      },
      {
        title: "세화여자중학교 학생 안내",
        body: "세화여자중학교 학생이라면 학교별 과외 페이지에서 관련 안내를 확인해보세요.",
      },
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
      "양천은 목동중학교 등 여러 중학교가 있는 지역으로, 재학 중인 학교의 수학 진도와 시험 범위를 먼저 확인하고 취약 단원부터 학습하는 것이 중요합니다.",
    regionSpecificNotes: [
      {
        title: "목동중학교 학생 안내",
        body: "목동중학교에 재학 중이라면 학교별 과외 페이지에서 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "양천 지역 중학교 정보 비교",
        body: "목동중학교 외에 양천구에는 신목중학교·신서중학교 등 여러 중학교 정보가 있어, 재학 중인 학교를 기준으로 진도와 시험 범위를 확인하는 것이 정확합니다.",
      },
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
