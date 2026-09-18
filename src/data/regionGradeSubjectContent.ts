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
        title: "강남 지역 서술형 대비 방식",
        body: "중학교 영어 내신은 학교마다 서술형 문항 배점과 유형이 달라, 재학 중인 학교의 최근 시험 형식을 확인하고 대비하는 것이 효과적입니다.",
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
        title: "강남 지역 고등 수학 학습 우선순위",
        body: "고등학교 수학은 학교 내신과 모의고사 비중을 함께 고려해야 하므로, 재학 중인 학교의 시험 일정을 기준으로 학습 우선순위를 정합니다.",
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
        title: "양천 지역 수학 취약 단원 관리",
        body: "중학교 수학은 이전 학년 개념이 이어지는 과목이라, 재학 중인 학교의 진도를 기준으로 놓친 단원이 없는지 먼저 점검합니다.",
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
        title: "성남 지역 수학 학습 순서",
        body: "중학교 수학은 단원 간 연결이 강한 과목인 만큼, 재학 중인 학교의 진도표를 기준으로 학습 순서를 계획하는 것이 좋습니다.",
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
        title: "용인 지역 고등 영어 학습 방향",
        body: "고등학교 영어는 내신 서술형과 모의고사 독해를 함께 준비해야 하므로, 재학 중인 학교의 평가 방식을 먼저 확인합니다.",
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
        title: "고양 지역 수학 개념 점검",
        body: "중학교 수학은 이전 단원의 개념이 다음 단원으로 이어지므로, 재학 중인 학교의 진도에 맞춰 취약한 개념부터 확인합니다.",
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
        title: "부천중학교 학생 안내",
        body: "부천중학교에 다니는 학생은 학교별 과외 페이지도 함께 참고할 수 있습니다.",
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
