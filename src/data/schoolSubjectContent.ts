/**
 * School-specific content for a (school × subject) combination — the
 * school-level counterpart of regionGradeSubjectContent.ts, reusing the same
 * published-content-gate pattern.
 *
 * Key relationships (enforced by convention, not types):
 * - schoolSlug must be a School.slug from src/data/schools.ts.
 * - subjectSlug must be a Subject.slug from src/data/subjects.ts, and must
 *   appear in that school's availableSubjectSlugs.
 *
 * src/lib/indexability.ts's "school-subject" case gates on
 * isPublishedContent(): an entry only makes the combination index+sitemap
 * eligible once status is "published" AND schoolSpecificNotes is non-empty.
 * A "draft" entry, or one with no notes yet, is treated exactly like having
 * no entry at all — noindex, out of the sitemap, and not rendered on the page.
 */
export interface SchoolSubjectContent {
  schoolSlug: string;
  subjectSlug: string;
  status: "draft" | "published";
  intro: string;
  schoolSpecificNotes: { title: string; body: string }[];
}

export const schoolSubjectContents: SchoolSubjectContent[] = [
  {
    schoolSlug: "gangnam-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "대치중학교 학생이 영어과외를 찾는다면, 학교 내신 서술형 문항과 부교재 구성을 먼저 확인하고 취약한 영역부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "대치중학교 학생 안내",
        body: "대치중학교에 재학 중이라면 지역별 과외 페이지(강남 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 영어 내신 대비 방향",
        body: "중학교 영어 내신은 학교마다 서술형 문항 배점과 유형이 달라, 재학 중인 학교의 최근 시험 형식을 기준으로 준비하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "gangnam-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "개포고등학교 학생이 수학과외를 찾는다면, 학교 내신 시험 범위와 모의고사 일정을 함께 고려해 학습 우선순위를 정하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "개포고등학교 학생 안내",
        body: "개포고등학교에 재학 중이라면 지역별 과외 페이지(강남 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 수학 내신·모의고사 병행",
        body: "개포고등학교를 포함한 고등학교는 학교 자체 내신 시험과 전국 단위 모의고사를 함께 준비해야 하므로, 두 일정을 모두 반영한 학습 계획이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "yangcheon-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "목동중학교 학생이 수학과외를 찾는다면, 이전 학년에서 놓친 개념이 없는지 먼저 점검하고 학교 진도에 맞춰 학습을 이어가는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "목동중학교 학생 안내",
        body: "목동중학교에 재학 중이라면 지역별 과외 페이지(양천 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 수학 단원 연계 점검",
        body: "목동중학교를 포함한 중학교 수학은 단원 간 연결이 강한 과목이라, 재학 중인 학교의 진도표를 기준으로 이전 단원 개념부터 순서대로 점검합니다.",
      },
    ],
  },

  // 서울 강남구 추가
  {
    schoolSlug: "gangnam-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "대치중학교 학생이 수학과외를 찾는다면, 학교 시험 단원 구성과 최근 출제 경향을 먼저 파악한 뒤 취약한 단원부터 보완 계획을 세우는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "대치중학교 학생 안내",
        body: "대치중학교에 재학 중이라면 지역별 과외 페이지(강남 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "대치중학교 수학 내신 준비 방향",
        body: "대치중학교를 포함한 중학교 수학 내신은 지필고사와 수행평가 비중을 함께 반영하므로, 시험 범위뿐 아니라 평소 문제 풀이 과정에서 자주 틀리는 유형을 정리해두는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "gangnam-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "개포고등학교 학생이 영어과외를 찾는다면, 학교 내신 서술형 문항 유형과 모의고사 성적을 함께 확인하고 부족한 영역을 구분해 준비하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "개포고등학교 학생 안내",
        body: "개포고등학교에 재학 중이라면 지역별 과외 페이지(강남 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 영어 내신·수능 병행",
        body: "개포고등학교를 포함한 고등학교 영어는 학교 내신 서술형과 수능형 독해 문제를 함께 준비해야 하므로, 두 유형의 학습 비중을 나눠 계획을 세우는 것이 효과적입니다.",
      },
    ],
  },

  // 서울 서초구
  {
    schoolSlug: "seocho-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "세화여자중학교 학생이 수학과외를 찾는다면, 여학생 대상 학교라는 특성보다는 재학 중인 학년의 시험 범위와 현재 실력을 먼저 확인하고 학습 계획을 세우는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "세화여자중학교 학생 안내",
        body: "세화여자중학교에 재학 중이라면 지역별 과외 페이지(서초 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "여자중학교 수학 학습 환경",
        body: "세화여자중학교처럼 여학생만 재학하는 학교는 수업 진행 속도나 수행평가 방식이 남녀공학과 다를 수 있어, 학교 자체 안내를 통해 최신 평가 기준을 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "seocho-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "세화고등학교 학생이 영어과외를 찾는다면, 학교 자체 시험의 서술형 배점과 부교재 구성을 먼저 확인한 뒤 취약한 영역부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "세화고등학교 학생 안내",
        body: "세화고등학교에 재학 중이라면 지역별 과외 페이지(서초 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 영어 구문 분석 중요성",
        body: "세화고등학교를 포함한 고등학교 영어는 문장이 길어질수록 구문 분석이 독해 속도를 좌우하므로, 어휘 암기와 함께 문장 구조를 끊어 읽는 훈련을 병행하는 것이 도움이 됩니다.",
      },
    ],
  },

  // 서울 송파구
  {
    schoolSlug: "songpa-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "가락중학교 학생이 수학과외를 찾는다면, 학교 시험 범위에 맞춰 단원별 이해도를 점검하고 부족한 부분을 우선순위로 정해 학습하는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "가락중학교 학생 안내",
        body: "가락중학교에 재학 중이라면 지역별 과외 페이지(송파 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "송파 지역 학교급 연계 학습",
        body: "송파는 초등(서울송파초등학교)·중등(가락중학교)·고등(가락고등학교) 정보가 함께 등록되어 있어, 학년이 올라가도 같은 지역 내에서 이어서 학습 정보를 확인할 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "songpa-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "가락고등학교 학생이 영어과외를 찾는다면, 학교 내신 시험의 출제 범위와 서술형 채점 기준을 확인하고 이에 맞춰 준비하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "가락고등학교 학생 안내",
        body: "가락고등학교에 재학 중이라면 지역별 과외 페이지(송파 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "가락고등학교 영어 서술형 대비",
        body: "가락고등학교를 포함한 고등학교 영어 내신은 서술형 문항의 채점 기준이 학교마다 다르므로, 최근 기출 답안 예시를 확인하며 작성 연습을 하는 것이 효과적입니다.",
      },
    ],
  },

  // 서울 양천구 추가
  {
    schoolSlug: "yangcheon-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "목동중학교 학생이 영어과외를 찾는다면, 학교 교과서와 부교재 구성을 확인하고 서술형 문항 유형에 맞춰 준비하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "목동중학교 학생 안내",
        body: "목동중학교에 재학 중이라면 지역별 과외 페이지(양천 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 영어 어휘·문법 병행",
        body: "목동중학교를 포함한 중학교 영어는 어휘량이 늘어나는 시기인 만큼, 새 단어를 문맥 속에서 익히며 문법 규칙을 독해에 바로 적용하는 연습을 함께 하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "yangcheon-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "양천고등학교 학생이 수학과외를 찾는다면, 이전 학년 개념 중 취약한 부분이 있는지 먼저 진단하고 부족한 단원부터 우선순위를 정해 학습하는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "양천고등학교 학생 안내",
        body: "양천고등학교에 재학 중이라면 지역별 과외 페이지(양천 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "양천고등학교 수학 심화 학습 방향",
        body: "양천고등학교를 포함한 고등학교 수학은 기본 개념 문제뿐 아니라 응용·심화 문제 비중이 커지는 시기이므로, 유형을 익힌 뒤에는 스스로 풀이 과정을 설명할 수 있는지 점검하는 것이 도움이 됩니다.",
      },
    ],
  },

  // 서울 마포구
  {
    schoolSlug: "mapo-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "마포중학교 학생이 영어과외를 찾는다면, 학교 시험의 서술형 배점과 최근 출제 경향을 먼저 확인하고 취약한 유형부터 연습하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "마포중학교 학생 안내",
        body: "마포중학교에 재학 중이라면 지역별 과외 페이지(마포 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "마포중학교 영어 학습 계획",
        body: "마포중학교를 포함한 중학교 영어는 학기 초 배운 문법이 이후 서술형 문제에 그대로 활용되는 경우가 많아, 배운 문법을 주기적으로 복습하며 넘어가는 것이 중요합니다.",
      },
    ],
  },

  // 경기 수원시
  {
    schoolSlug: "yeongtong-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "영통중학교 학생이 수학과외를 찾는다면, 수원 영통구 지역 내 학교 진도를 기준으로 취약한 단원을 먼저 점검하고 학습을 이어가는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "영통중학교 학생 안내",
        body: "영통중학교에 재학 중이라면 지역별 과외 페이지(수원 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "수원 4개 구 학군 특성",
        body: "수원은 영통구·팔달구·장안구·권선구로 나뉘어 학교마다 진도와 시험 범위가 달라질 수 있어, 영통중학교 재학생은 학교 자체 안내를 우선 확인하는 것이 좋습니다.",
      },
    ],
  },

  // 경기 성남시
  {
    schoolSlug: "seongnam-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "서현중학교 학생이 영어과외를 찾는다면, 재학 중인 학년의 교과서 진도와 최근 시험 범위를 확인하고 취약한 영역을 먼저 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "서현중학교 학생 안내",
        body: "서현중학교에 재학 중이라면 지역별 과외 페이지(성남 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "서현중학교 영어 독해 학습",
        body: "서현중학교를 포함한 중학교 영어는 지문 길이가 점차 길어지는 시기이므로, 단어 암기에 더해 지문을 끊어 읽고 핵심 문장을 찾는 독해 훈련을 함께 진행하는 것이 좋습니다.",
      },
    ],
  },

  // 경기 용인시
  {
    schoolSlug: "yongin-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "신갈고등학교 학생이 수학과외를 찾는다면, 학교 내신 시험 범위를 먼저 파악하고 이전 학년에서 놓친 개념이 있는지 점검한 뒤 학습을 시작하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "신갈고등학교 학생 안내",
        body: "신갈고등학교에 재학 중이라면 지역별 과외 페이지(용인 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 수학 오답 관리",
        body: "신갈고등학교를 포함한 고등학교 수학은 유형을 안다고 해도 실제 시험에서 반복해 틀리는 경우가 많아, 오답을 따로 모아 같은 실수를 반복하지 않도록 관리하는 것이 중요합니다.",
      },
    ],
  },

  // 경기 고양시
  {
    schoolSlug: "goyang-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "고양국제고등학교 학생이 영어과외를 찾는다면, 국제고등학교 특성상 영어 학습량이 많은 만큼 내신과 수능 대비 비중을 구분해 계획을 세우는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "고양국제고등학교 학생 안내",
        body: "고양국제고등학교에 재학 중이라면 지역별 과외 페이지(고양 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "국제고등학교 영어 학습 특성",
        body: "국제고등학교는 일반고보다 영어 수업 비중과 원서 활용이 많은 편이라, 학교 진도를 따라가면서도 수능형 독해와 문법을 별도로 챙기는 것이 필요합니다.",
      },
    ],
  },

  // 경기 안양시
  {
    schoolSlug: "anyang-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "안양외국어고등학교 학생이 수학과외를 찾는다면, 외국어고등학교이지만 수학 내신 비중이 낮지 않은 만큼 학교 시험 범위에 맞춰 꾸준히 관리하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "안양외국어고등학교 학생 안내",
        body: "안양외국어고등학교에 재학 중이라면 지역별 과외 페이지(안양 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "외국어고등학교 수학 학습 특성",
        body: "외국어고등학교는 어문 계열 교과 비중이 높지만 수학도 내신 등급에 반영되므로, 다른 과목과의 학습 시간 배분을 고려해 계획을 세우는 것이 필요합니다.",
      },
    ],
  },

  // 경기 부천시
  {
    schoolSlug: "bucheon-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "부천중학교 학생이 영어과외를 찾는다면, 서술형 문제에서 사소한 문법 실수로 감점되는 경우가 많은 만큼 정확한 문장 구성 연습부터 시작하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "부천중학교 학생 안내",
        body: "부천중학교에 재학 중이라면 지역별 과외 페이지(부천 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "부천중학교 영어 서술형 대비",
        body: "부천중학교를 포함한 중학교 영어 서술형은 답의 내용이 맞아도 관사나 시제 같은 사소한 문법 오류로 감점되는 경우가 많아, 채점 기준에 맞춰 문장을 정확하게 쓰는 연습이 필요합니다.",
      },
    ],
  },
];

export function getSchoolSubjectContent(
  schoolSlug: string,
  subjectSlug: string
): SchoolSubjectContent | undefined {
  return schoolSubjectContents.find((c) => c.schoolSlug === schoolSlug && c.subjectSlug === subjectSlug);
}

/** Whether a school-subject entry is complete enough to be shown/indexed. */
export function isPublishedContent(
  content: SchoolSubjectContent | undefined
): content is SchoolSubjectContent {
  return Boolean(content && content.status === "published" && content.schoolSpecificNotes.length > 0);
}
