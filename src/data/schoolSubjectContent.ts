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

  // 신규 학교 데이터 확대에 따른 추가 published 콘텐츠
  {
    schoolSlug: "jungdong-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "중동고등학교 학생이 수학과외를 찾는다면, 학원 진도와 학교 자체 진도가 다를 수 있으므로 학교 시험 범위를 우선 기준으로 삼아 학습 계획을 세우는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "중동고등학교 학생 안내",
        body: "중동고등학교에 재학 중이라면 지역별 과외 페이지(강남 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "학원 진도와 학교 진도 구분",
        body: "중동고등학교를 포함해 학원이 밀집한 지역의 고등학교는 학원 선행 진도와 학교 자체 시험 범위가 다른 경우가 많아, 두 진도를 혼동하지 않고 학교 시험 범위를 우선 기준으로 학습하는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "banpo-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "반포중학교 학생이 수학과외를 찾는다면, 지필고사 범위뿐 아니라 수행평가 비중까지 함께 확인하고 학습 계획을 세우는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "반포중학교 학생 안내",
        body: "반포중학교에 재학 중이라면 지역별 과외 페이지(서초 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 수학 수행평가 병행",
        body: "반포중학교를 포함한 중학교 수학은 지필고사 외에 수행평가 비중도 적지 않아, 서술형 풀이 과정을 정리하는 연습을 함께 하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "jamsil-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "잠실고등학교 학생이 수학과외를 찾는다면, 기본 개념 문제와 심화 문제 중 어디에서 막히는지 먼저 구분하고 그에 맞는 학습 방식을 정하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "잠실고등학교 학생 안내",
        body: "잠실고등학교에 재학 중이라면 지역별 과외 페이지(송파 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 수학 심화 문제 접근",
        body: "잠실고등학교를 포함한 고등학교 수학은 기본 개념은 아는데 심화·응용 문제에서 막히는 경우가 많아, 문제를 단계별로 나눠 어느 단계에서 막히는지 확인하는 연습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "sinseo-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "신서중학교 학생이 수학과외를 찾는다면, 이전 학년 단원 중 확실히 이해하지 못한 부분을 먼저 점검하고 현재 진도와 연결해 학습하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "신서중학교 학생 안내",
        body: "신서중학교에 재학 중이라면 지역별 과외 페이지(양천 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 수학 취약 단원 점검",
        body: "신서중학교를 포함한 중학교 수학은 이전 단원 개념이 다음 단원 이해를 좌우하는 경우가 많아, 현재 진도에서 막히면 관련된 이전 단원부터 되짚어 확인하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "seongsan-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "성산중학교 학생이 수학과외를 찾는다면, 학교 시험 범위뿐 아니라 평소 수업 중 이해도를 함께 점검해 부족한 부분을 미리 채워가는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "성산중학교 학생 안내",
        body: "성산중학교에 재학 중이라면 지역별 과외 페이지(마포 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 수학 수업 이해도 점검",
        body: "성산중학교를 포함한 중학교 수학은 수업을 따라가는 것과 시험을 준비하는 것이 별개로 느껴질 수 있어, 평소 수업 내용을 스스로 설명할 수 있는지 주기적으로 점검하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "jukjeon-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "죽전고등학교 학생이 수학과외를 찾는다면, 문제 유형을 익힌 뒤에도 실전에서 같은 실수를 반복하지 않도록 오답을 관리하는 습관을 만드는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "죽전고등학교 학생 안내",
        body: "죽전고등학교에 재학 중이라면 지역별 과외 페이지(용인 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 수학 오답노트 활용",
        body: "죽전고등학교를 포함한 고등학교 수학은 유형을 안다고 풀이가 항상 맞는 것은 아니므로, 틀린 문제를 오답노트에 정리해 반복되는 실수 유형을 스스로 파악하는 것이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "pyeongchon-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "평촌고등학교 학생이 수학과외를 찾는다면, 시험 시간 안에 풀이 속도를 맞추지 못하는 것인지 개념 자체가 부족한 것인지부터 구분해 학습 방향을 정하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "평촌고등학교 학생 안내",
        body: "평촌고등학교에 재학 중이라면 지역별 과외 페이지(안양 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "평촌고등학교 수학 실전 시간 관리",
        body: "평촌고등학교를 포함한 고등학교 수학은 아는 문제인데도 시간이 부족해 못 푸는 경우가 있어, 평소 제한 시간을 두고 문제를 푸는 연습으로 실전 감각을 키우는 것이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "daechi-elementary-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "서울대치초등학교 학생이 수학과외를 찾는다면, 문제 풀이 속도보다 개념을 스스로 말로 설명할 수 있는지를 먼저 확인하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "서울대치초등학교 학생 안내",
        body: "서울대치초등학교에 재학 중이라면 지역별 과외 페이지(강남 초등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등학교 수학 개념 이해 확인",
        body: "서울대치초등학교를 포함한 초등학교 수학은 연산 정확도만큼 개념을 이해했는지가 중요해, 문제를 풀게 하기보다 왜 그렇게 푸는지 학생이 직접 설명하게 해보는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "hyundai-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "현대고등학교 학생이 영어과외를 찾는다면, 어휘와 문법을 알고 있어도 실제 지문에 적용하지 못하는 경우가 많아 독해 적용 연습을 함께 하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "현대고등학교 학생 안내",
        body: "현대고등학교에 재학 중이라면 지역별 과외 페이지(강남 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "현대고등학교 영어 독해 적용",
        body: "현대고등학교를 포함한 고등학교 영어는 어휘·문법을 따로 공부해도 지문 독해에서 막히는 경우가 많아, 배운 표현을 실제 지문에 적용해보는 연습을 병행하는 것이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "eonnam-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "언남중학교 학생이 영어과외를 찾는다면, 학년이 올라가며 늘어나는 어휘량을 문맥 속에서 익히고 문법 규칙을 독해에 바로 적용하는 연습이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "언남중학교 학생 안내",
        body: "언남중학교에 재학 중이라면 지역별 과외 페이지(서초 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 영어 어휘 확장 시기",
        body: "언남중학교를 포함한 중학교 영어는 학년이 올라갈수록 어휘량이 빠르게 늘어나, 단어를 따로 외우기보다 지문 속 문맥과 함께 익히는 것이 오래 기억하는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "munjeong-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "문정중학교 학생이 영어과외를 찾는다면, 학교 서술형 문항의 채점 기준을 먼저 확인하고 그에 맞춰 답안 작성을 연습하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "문정중학교 학생 안내",
        body: "문정중학교에 재학 중이라면 지역별 과외 페이지(송파 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "문정중학교 영어 서술형 채점 기준",
        body: "문정중학교를 포함한 중학교 영어 서술형은 정답 내용뿐 아니라 철자·어순 같은 세부 기준으로도 감점될 수 있어, 채점 기준을 기준으로 답안을 다시 확인하는 연습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "sinmok-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "신목고등학교 학생이 영어과외를 찾는다면, 문장이 길어질수록 해석이 막히지 않도록 구문 분석 훈련을 독해와 함께 진행하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "신목고등학교 학생 안내",
        body: "신목고등학교에 재학 중이라면 지역별 과외 페이지(양천 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 영어 구문 분석 훈련",
        body: "신목고등학교를 포함한 고등학교 영어는 문장 구조가 복잡해질수록 독해 속도가 느려지기 쉬워, 긴 문장을 끊어 읽는 구문 분석 훈련을 꾸준히 병행하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "sungmun-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "숭문고등학교 학생이 영어과외를 찾는다면, 지문 유형별로 시간 배분이 다르다는 점을 확인하고 실전과 같은 조건에서 독해 연습을 해보는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "숭문고등학교 학생 안내",
        body: "숭문고등학교에 재학 중이라면 지역별 과외 페이지(마포 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "숭문고등학교 영어 시간 관리",
        body: "숭문고등학교를 포함한 고등학교 영어 시험은 지문 유형에 따라 필요한 풀이 시간이 달라, 평소 문제를 풀 때부터 유형별 소요 시간을 기록해보는 것이 실전에 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "suwon-yeoja-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "수원여자고등학교 학생이 영어과외를 찾는다면, 여학생만 재학하는 학교 특성보다는 현재 독해·문법 실력을 먼저 확인하고 부족한 영역을 채워가는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "수원여자고등학교 학생 안내",
        body: "수원여자고등학교에 재학 중이라면 지역별 과외 페이지(수원 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "여자고등학교 학습 환경",
        body: "수원여자고등학교처럼 여학생만 재학하는 학교는 수행평가 방식이나 진도 속도가 남녀공학과 다를 수 있어, 학교 자체 공지를 통해 최신 평가 기준을 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "banpo-elementary-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "서울반포초등학교 학생이 영어과외를 찾는다면, 파닉스 이후 단계에서 리딩 습관을 만드는 것과 기초 문장 구조를 함께 익히는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "서울반포초등학교 학생 안내",
        body: "서울반포초등학교에 재학 중이라면 지역별 과외 페이지(서초 초등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등학교 영어 리딩 습관",
        body: "서울반포초등학교를 포함한 초등학교 영어는 파닉스를 마친 이후 꾸준한 리딩 습관을 들이는 것이 중요해, 짧은 지문이라도 매일 소리 내어 읽는 연습을 이어가는 것이 효과적입니다.",
      },
    ],
  },

  // 인천 미추홀구·연수구·남동구·부평구·계양구·강화군 (나무위키 구역별 학교 목록 대조 확인,
  // 2026-09 지역 확장분)
  {
    schoolSlug: "michuhol-elementary-school",
    subjectSlug: "korean",
    status: "published",
    intro:
      "인천숭의초등학교 학생이 국어과외를 찾는다면, 학교 진도와 최근 시험 범위를 먼저 확인하고 취약한 부분부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "인천숭의초등학교 학생 안내",
        body: "인천숭의초등학교에 재학 중이라면 지역별 과외 페이지(미추홀 초등 국어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 국어 학습 방향",
        body: "초등 국어는 어휘력과 독해력이 이후 전 과목 학습의 기초가 되므로, 짧은 글이라도 매일 읽고 내용을 스스로 요약해보는 연습이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "michuhol-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "관교중학교 재학생이 수학과외를 고려하고 있다면, 학교 진도에 맞춰 부족한 개념부터 채워나가는 방식이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "관교중학교 학생 안내",
        body: "미추홀 중등 수학과외 페이지에서 관교중학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "중등 수학 학습 방향",
        body: "중학교 수학은 단원 간 연결이 강한 과목이라, 현재 진도에서 막히면 관련된 이전 단원부터 되짚어 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "michuhol-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "인천고등학교에 재학 중이라면, 영어 학습을 시작하기 전에 학교 진도표를 기준으로 이전 단원 이해도를 먼저 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천고등학교 학생 안내",
        body: "미추홀 고등 영어과외 페이지에서 인천고등학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등 영어 학습 방향",
        body: "고등학교 영어는 문장 구조가 복잡해지는 만큼, 어휘 암기와 함께 긴 문장을 끊어 읽는 구문 분석 훈련을 병행하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-elementary-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "인천송도초등학교에 재학 중이라면, 수학 학습을 시작하기 전에 학교 진도표를 기준으로 이전 단원 이해도를 먼저 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천송도초등학교 학생 안내",
        body: "연수 초등 수학과외 페이지에서 인천송도초등학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 수학 학습 방향",
        body: "초등 수학은 연산 정확도만큼 개념 이해가 중요해, 문제를 풀게 하기보다 왜 그렇게 푸는지 스스로 설명하게 해보는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "영어과외를 알아보는 연수중학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "연수중학교 학생 안내",
        body: "연수 중등 영어과외 페이지에서 연수중학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "중등 영어 학습 방향",
        body: "중학교 영어는 서술형 문항 비중이 늘어나는 시기라, 문법 규칙을 암기하는 데서 그치지 않고 문장으로 직접 써보는 연습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "수학과외를 알아보는 연수고등학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "연수고등학교 학생 안내",
        body: "연수고등학교 학생이라면 지역별 과외 페이지(연수 고등 수학과외)도 함께 참고할 수 있습니다.",
      },
      {
        title: "고등 수학 학습 방향",
        body: "고등학교 수학은 기본 개념과 응용·심화 문제의 난이도 차이가 크므로, 어느 단계에서 막히는지 먼저 구분한 뒤 학습 방향을 정하는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-elementary-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "인천구월초등학교 재학생이 영어과외를 고려하고 있다면, 학교 진도에 맞춰 부족한 개념부터 채워나가는 방식이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "인천구월초등학교 학생 안내",
        body: "남동 초등 영어과외 페이지에서 인천구월초등학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 영어 학습 방향",
        body: "초등 영어는 파닉스 이후 리딩 습관을 들이는 시기이므로, 짧은 지문이라도 소리 내어 읽는 연습을 꾸준히 이어가는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-middle-school",
    subjectSlug: "korean",
    status: "published",
    intro:
      "국어과외를 알아보는 구월중학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "구월중학교 학생 안내",
        body: "남동 중등 국어과외 페이지에서 구월중학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "중등 국어 학습 방향",
        body: "중학교 국어는 문학·비문학 지문을 함께 다루는 만큼, 지문 유형별로 접근 방식을 구분해 연습하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-high-school",
    subjectSlug: "social",
    status: "published",
    intro:
      "인천남동고등학교 학생이 사회과외를 찾는다면, 학교 진도와 최근 시험 범위를 먼저 확인하고 취약한 부분부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "인천남동고등학교 학생 안내",
        body: "인천남동고등학교에 재학 중이라면 지역별 과외 페이지(남동 고등 사회과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등 사회 학습 방향",
        body: "고등학교 사회 탐구 과목은 개념 이해와 함께 최신 자료 해석 능력도 필요해, 교과서 개념을 자료 문제에 적용해보는 연습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-elementary-school",
    subjectSlug: "science",
    status: "published",
    intro:
      "인천갈산초등학교 학생이 과학과외를 찾는다면, 학교 진도와 최근 시험 범위를 먼저 확인하고 취약한 부분부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "인천갈산초등학교 학생 안내",
        body: "인천갈산초등학교에 재학 중이라면 지역별 과외 페이지(부평 초등 과학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 과학 학습 방향",
        body: "초등 과학은 실생활 현상과 연결해 이해하면 오래 기억에 남으므로, 개념을 배운 뒤 주변에서 비슷한 사례를 찾아보게 하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "부평중학교에 재학 중이라면, 영어 학습을 시작하기 전에 학교 진도표를 기준으로 이전 단원 이해도를 먼저 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "부평중학교 학생 안내",
        body: "지역별 과외 페이지(부평 중등 영어과외)에서도 부평중학교 재학생을 위한 안내를 함께 볼 수 있습니다.",
      },
      {
        title: "중등 영어 학습 방향",
        body: "중학교 영어는 서술형 문항 비중이 늘어나는 시기라, 문법 규칙을 암기하는 데서 그치지 않고 문장으로 직접 써보는 연습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "부평고등학교 학생이 수학과외를 찾는다면, 학교 시험 범위와 평소 수업 이해도를 함께 고려해 학습 계획을 세우는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "부평고등학교 학생 안내",
        body: "부평 고등 수학과외 페이지에서 부평고등학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등 수학 학습 방향",
        body: "고등학교 수학은 기본 개념과 응용·심화 문제의 난이도 차이가 크므로, 어느 단계에서 막히는지 먼저 구분한 뒤 학습 방향을 정하는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-elementary-school",
    subjectSlug: "korean",
    status: "published",
    intro:
      "국어과외를 알아보는 인천계산초등학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "인천계산초등학교 학생 안내",
        body: "계양 초등 국어과외 페이지에서 인천계산초등학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 국어 학습 방향",
        body: "초등 국어는 어휘력과 독해력이 이후 전 과목 학습의 기초가 되므로, 짧은 글이라도 매일 읽고 내용을 스스로 요약해보는 연습이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    subjectSlug: "social",
    status: "published",
    intro:
      "사회과외를 알아보는 계산중학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "계산중학교 학생 안내",
        body: "계양 중등 사회과외 페이지에서 계산중학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "중등 사회 학습 방향",
        body: "중학교 사회는 다루는 범위가 넓어지는 만큼, 단원별 핵심 개념을 먼저 정리한 뒤 세부 내용을 채워가는 방식이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "영어과외를 알아보는 계산고등학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "계산고등학교 학생 안내",
        body: "지역별 과외 페이지(계양 고등 영어과외)에서도 계산고등학교 재학생을 위한 안내를 함께 볼 수 있습니다.",
      },
      {
        title: "고등 영어 학습 방향",
        body: "고등학교 영어는 문장 구조가 복잡해지는 만큼, 어휘 암기와 함께 긴 문장을 끊어 읽는 구문 분석 훈련을 병행하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-elementary-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "강화초등학교 재학생이 수학과외를 고려하고 있다면, 학교 진도에 맞춰 부족한 개념부터 채워나가는 방식이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "강화초등학교 학생 안내",
        body: "지역별 과외 페이지(강화 초등 수학과외)에서도 강화초등학교 재학생을 위한 안내를 함께 볼 수 있습니다.",
      },
      {
        title: "초등 수학 학습 방향",
        body: "초등 수학은 연산 정확도만큼 개념 이해가 중요해, 문제를 풀게 하기보다 왜 그렇게 푸는지 스스로 설명하게 해보는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-middle-school",
    subjectSlug: "science",
    status: "published",
    intro:
      "과학과외를 알아보는 강화중학교 학생이라면, 먼저 최근 학교 시험에서 자주 틀리는 유형을 정리해보는 것을 추천합니다.",
    schoolSpecificNotes: [
      {
        title: "강화중학교 학생 안내",
        body: "강화 중등 과학과외 페이지에서 강화중학교 재학생에게 도움이 되는 지역 정보를 함께 확인할 수 있습니다.",
      },
      {
        title: "중등 과학 학습 방향",
        body: "중학교 과학은 개념과 계산이 함께 나오는 단원이 많아, 공식을 암기하기 전에 개념부터 이해했는지 확인하는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-high-school",
    subjectSlug: "korean",
    status: "published",
    intro:
      "강화고등학교에 재학 중이라면, 국어 학습을 시작하기 전에 학교 진도표를 기준으로 이전 단원 이해도를 먼저 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "강화고등학교 학생 안내",
        body: "강화고등학교 학생이라면 지역별 과외 페이지(강화 고등 국어과외)도 함께 참고할 수 있습니다.",
      },
      {
        title: "고등 국어 학습 방향",
        body: "고등학교 국어는 지문 길이와 정보량이 늘어나는 만큼, 제한 시간 안에 핵심 정보를 찾는 훈련을 꾸준히 병행하는 것이 좋습니다.",
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
