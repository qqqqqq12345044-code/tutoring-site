import { neisSchoolSource, type ContentSource } from "@/data/sources";

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
  /**
   * Where the entry's factual statements come from — official pages that were
   * actually opened (교육부 NEIS 학교기본정보, 학교 공식 홈페이지 등). Shown in the
   * page's "참고 자료" block (SourceList) and required for the quality gate's GREEN
   * grade (scripts/lib/quality-gate.ts); without it the entry is AMBER.
   */
  sources?: ContentSource[];
}

export const schoolSubjectContents: SchoolSubjectContent[] = [
  {
    schoolSlug: "gangnam-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "대치중학교는 이름과 달리 대치동이 아닌 강남구 도곡동 남부순환로378길에 있는 공립 중학교입니다. 영어과외 상담에서는 학교 위치와 함께 재학 학년, 최근 영어 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "교명과 다른 소재 동 — 도곡동",
        body: "대치중학교의 공식 주소는 강남구 남부순환로378길 39(도곡동)입니다. 같은 강남구에 등록된 서울대치초등학교는 양재천로 363(대치동)에 있어, 교명에 같은 지명이 들어가도 두 학교의 소재 동은 다릅니다.",
      },
      {
        title: "1986년 설립된 공립 남녀공학",
        body: "대치중학교는 1986년 설립된 공립 남녀공학 중학교이며 서울특별시강남서초교육지원청 관할입니다.",
      },
    ],
    sources: [
      neisSchoolSource("대치중학교"),
      neisSchoolSource("서울대치초등학교"),
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
      "목동중학교에서 수학과외를 알아본다면 학교 이름의 '목동'과 주소의 동 표기가 다르다는 점부터 알아두면 좋습니다. 목동중학교는 양천구 목동동로 172, 신정동에 있습니다.",
    schoolSpecificNotes: [
      {
        title: "목동동로에 있지만 동 표기는 신정동",
        body: "목동중학교의 공식 주소는 양천구 목동동로 172(신정동)입니다. 도로명에는 목동이 들어가지만 주소의 동 표기는 신정동이어서, 학교를 찾을 때 동 이름까지 함께 확인하는 편이 정확합니다.",
      },
      {
        title: "1981년 설립, 강서양천교육지원청 관할",
        body: "목동중학교는 1981년 설립된 공립 남녀공학 중학교로, 서울특별시강서양천교육지원청이 관할합니다.",
      },
    ],
    sources: [
      neisSchoolSource("목동중학교"),
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
      "세화고등학교는 서초구 반포동 신반포로 56-7에 있는 사립 남학교입니다. 영어과외 상담은 재학 학년과 학교 영어 시험 범위를 확인하는 데서 시작합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 자율고로 분류",
        body: "세화고등학교는 1986년 설립된 사립 남자 고등학교로, 교육부 학교기본정보에서 고등학교 구분이 '자율고'로 등록되어 있습니다.",
      },
      {
        title: "세화여자중학교와 같은 주소",
        body: "세화여자중학교도 같은 신반포로 56-7을 주소로 쓰고 있어, 학교 위치를 찾을 때 두 학교 이름을 구분해 확인하는 것이 좋습니다.",
      },
    ],
    sources: [
      neisSchoolSource("세화고등학교"),
      neisSchoolSource("세화여자중학교"),
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
      "가락고등학교는 교명의 '가락'과 달리 송파구 송파동 송이로 42에 있는 공립 고등학교입니다. 영어과외 상담에서는 재학 학년과 학교 영어 내신 범위를 함께 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "가락중학교와 같은 송이로",
        body: "가락고등학교(송이로 42)와 가락중학교(송이로 45)는 모두 가락동이 아닌 송파동 송이로에 있어, 학교 이름보다 주소로 위치를 확인하는 편이 정확합니다.",
      },
      {
        title: "1988년 설립된 공립 일반고",
        body: "가락고등학교는 1988년 설립된 공립 남녀공학으로, 교육부 학교기본정보에 일반고로 등록되어 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("가락고등학교"),
      neisSchoolSource("가락중학교"),
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
      "양천고등학교는 양천구 신정동 신정로14길에 있는 사립 남학교입니다. 수학과외 상담은 재학 학년과 학교 수학 시험 범위를 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "1984년 설립된 사립 남자 일반고",
        body: "양천고등학교는 1984년 설립되었고, 교육부 학교기본정보에 사립·남학교·일반고로 등록되어 있습니다.",
      },
      {
        title: "신정동에 모여 있는 양천구 등록 학교",
        body: "교과설계소에 등록된 양천구 학교 가운데 목동중학교·신서중학교·신목고등학교도 양천고등학교와 같은 신정동에 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("양천고등학교"),
      neisSchoolSource("목동중학교"),
      neisSchoolSource("신서중학교"),
      neisSchoolSource("신목고등학교"),
    ],
  },

  // 서울 마포구
  {
    schoolSlug: "mapo-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "마포중학교는 교명과 달리 마포구가 아닌 강서구 화곡로 403에 있는 사립 남학교입니다. 영어과외 상담에서는 재학 학년과 학교 영어 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "마포고등학교와 같은 주소",
        body: "마포중학교의 공식 주소는 강서구 화곡로 403으로, 마포고등학교의 주소(화곡로 403, 등촌동)와 같습니다. 교과설계소는 두 학교를 모두 강서구 학교로 분류합니다.",
      },
      {
        title: "1950년 설립된 사립 남자 중학교",
        body: "마포중학교는 교육부 학교기본정보에 설립일 1950년 6월 1일, 사립·남학교로 등록되어 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("마포중학교"),
      neisSchoolSource("마포고등학교"),
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
      "신갈고등학교는 이름과 달리 신갈동이 아닌 용인시 기흥구 상갈동(백남준로 13)에 있는 사립 고등학교입니다. 수학과외 상담에서는 학년별 학교 진도와 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "신갈중은 신갈동, 신갈고는 상갈동",
        body: "같은 이름이 들어간 신갈중학교는 기흥구 신갈동에 있지만, 신갈고등학교의 주소 동 표기는 상갈동입니다. 진학 전후로 두 학교 위치를 혼동하지 않도록 주소를 함께 확인하는 것이 좋습니다.",
      },
      {
        title: "1984년 설립된 사립 남녀공학 일반고",
        body: "신갈고등학교는 1984년 설립되었으며 교육부 학교기본정보에 사립·남녀공학·일반고로 등록되어 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("신갈고등학교"),
      neisSchoolSource("신갈중학교"),
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
      "안양외국어고등학교는 안양시 만안구 안양동에 있는 사립 외국어계열 특수목적고등학교입니다. 수학과외 상담은 재학 학년과 학교 수학 시험 범위를 확인하는 것부터 시작합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 외국어계열 특목고",
        body: "교육부 학교기본정보에 고등학교 구분 '특목고', 계열 '외국어계열'로 등록되어 있으며, 설립 구분은 사립, 남녀공학입니다.",
      },
      {
        title: "1996년 설립, 만안구 양화로",
        body: "1996년 설립되었고 주소는 만안구 양화로37번길 36(안양동)입니다. 교과설계소에 등록된 안양의 다른 고등학교인 평촌고등학교와 관양고등학교는 동안구에 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("안양외국어고등학교"),
      neisSchoolSource("평촌고등학교"),
      neisSchoolSource("관양고등학교"),
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
      "중동고등학교는 1906년 설립된 사립 남학교로, 지금은 강남구 일원동 일원로 7에 있습니다. 수학과외 상담에서는 재학 학년과 학교 수학 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 1906년 설립된 자율고",
        body: "교육부 학교기본정보에 중동고등학교의 설립일은 1906년 5월 10일, 사립·남학교, 고등학교 구분은 '자율고'로 등록되어 있습니다.",
      },
      {
        title: "강남구 등록 고등학교의 유형",
        body: "교과설계소에 등록된 강남구 고등학교 중 중동고등학교와 현대고등학교는 자율고, 개포고등학교는 공립 일반고로 등록되어 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("중동고등학교"),
      neisSchoolSource("현대고등학교"),
      neisSchoolSource("개포고등학교"),
    ],
  },
  {
    schoolSlug: "banpo-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "반포중학교는 서초구 반포동 신반포로 67에 있는 공립 남학교입니다. 수학과외 상담은 재학 학년과 최근 학교 수학 시험 범위를 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "1974년 설립된 공립 남자 중학교",
        body: "반포중학교는 1974년 설립되었고, 교육부 학교기본정보에 공립·남학교로 등록되어 있으며 서울특별시강남서초교육지원청이 관할합니다.",
      },
      {
        title: "남녀 구분이 모두 다른 서초구 등록 중학교",
        body: "교과설계소에 등록된 서초구 중학교 중 세화여자중학교는 사립 여학교, 언남중학교(양재동)는 공립 남녀공학이어서 반포중학교를 포함한 세 학교의 남녀 구분이 모두 다릅니다.",
      },
    ],
    sources: [
      neisSchoolSource("반포중학교"),
      neisSchoolSource("세화여자중학교"),
      neisSchoolSource("언남중학교"),
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
      "성산중학교는 교명과 달리 성산동이 아닌 마포구 합정동 성지1길에 있는 공립 중학교입니다. 수학과외 상담은 재학 학년과 학교 수학 진도를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "주소의 동 표기는 합정동",
        body: "성산중학교의 공식 주소는 마포구 성지1길 32-13(합정동)입니다. 교명에 들어간 성산과 주소의 동 이름이 달라, 학교를 찾을 때는 도로명 주소로 확인하는 편이 정확합니다.",
      },
      {
        title: "1968년 설립, 서부교육지원청 관할",
        body: "성산중학교는 1968년 설립된 공립 남녀공학 중학교로 서울특별시서부교육지원청이 관할합니다.",
      },
    ],
    sources: [
      neisSchoolSource("성산중학교"),
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
      "현대고등학교는 강남구 압구정동 압구정로 127에 있는 사립 고등학교입니다. 영어과외 상담에서는 재학 학년과 학교 영어 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 남녀공학 자율고",
        body: "교육부 학교기본정보에 현대고등학교는 사립·남녀공학이며 고등학교 구분 '자율고'로 등록되어 있습니다.",
      },
      {
        title: "1984년 설립, 서울특별시교육청 관할",
        body: "현대고등학교의 설립일은 1984년 12월 17일로 등록되어 있고, 서울특별시교육청이 관할합니다.",
      },
    ],
    sources: [
      neisSchoolSource("현대고등학교"),
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
      "숭문고등학교는 마포구 대흥동 숭문길 99에 있는 사립 남학교입니다. 영어과외 상담은 재학 학년과 학교 영어 시험 범위를 확인하는 것부터 시작합니다.",
    schoolSpecificNotes: [
      {
        title: "1946년 설립, 자율고로 등록",
        body: "숭문고등학교는 1946년 설립되었고 교육부 학교기본정보에 사립·남학교, 고등학교 구분 '자율고'로 등록되어 있습니다.",
      },
      {
        title: "마포구 등록 고등학교는 모두 사립 남학교",
        body: "교과설계소에 등록된 마포구 고등학교인 숭문고등학교와 광성고등학교(신수동)는 둘 다 사립 남학교입니다.",
      },
    ],
    sources: [
      neisSchoolSource("숭문고등학교"),
      neisSchoolSource("광성고등학교"),
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
      "인천숭의초등학교는 1937년 설립된 공립 초등학교로, 미추홀구 숭의동 장천로 99에 있습니다. 국어과외 상담은 학년과 현재 읽기·쓰기 수준을 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 1937년 설립",
        body: "교육부 학교기본정보에 인천숭의초등학교의 설립일은 1937년 4월 10일, 공립·남녀공학으로 등록되어 있으며 인천광역시남부교육지원청이 관할합니다.",
      },
      {
        title: "상급 학교의 남녀 구분",
        body: "같은 미추홀구에 등록된 관교중학교와 인천고등학교는 남학교여서, 상급 학교로 진학할 때 학교 유형을 함께 확인해두면 좋습니다.",
      },
    ],
    sources: [
      neisSchoolSource("인천숭의초등학교"),
      neisSchoolSource("관교중학교"),
      neisSchoolSource("인천고등학교"),
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
      "인천고등학교는 1895년 설립된 공립 남학교로, 미추홀구 주안동 경원대로 804에 있습니다. 영어과외 상담은 재학 학년과 학교 영어 시험 범위를 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 설립일 1895년 6월 27일",
        body: "교육부 학교기본정보에 인천고등학교의 설립일은 1895년 6월 27일, 공립·남학교·일반고로 등록되어 있습니다.",
      },
      {
        title: "같은 미추홀구의 관교중학교도 남학교",
        body: "교과설계소에 등록된 미추홀구 학교 중 관교중학교(관교동)도 남학교이고, 인천숭의초등학교(숭의동)는 남녀공학입니다.",
      },
    ],
    sources: [
      neisSchoolSource("인천고등학교"),
      neisSchoolSource("관교중학교"),
      neisSchoolSource("인천숭의초등학교"),
    ],
  },
  {
    schoolSlug: "yeonsu-elementary-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "인천송도초등학교는 연수구 옥련동 비류대로214번길에 있는 공립 초등학교입니다. 수학과외 상담은 학년과 현재 배우는 단원을 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "주소의 동 표기는 옥련동",
        body: "인천송도초등학교의 공식 주소는 연수구 비류대로214번길 21(옥련동)입니다. 교명만 보고 위치를 짐작하기보다 도로명 주소로 확인하는 것이 정확합니다.",
      },
      {
        title: "1948년 설립, 동부교육지원청 관할",
        body: "인천송도초등학교는 1948년 설립된 공립 남녀공학으로 인천광역시동부교육지원청이 관할합니다.",
      },
    ],
    sources: [
      neisSchoolSource("인천송도초등학교"),
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
      "강화초등학교는 1896년 설립된 공립 초등학교로, 강화군 강화읍 북문길 36에 있습니다. 수학과외 상담은 학년과 현재 학교 진도를 확인한 뒤 진행합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 설립일 1896년 2월 4일",
        body: "교육부 학교기본정보에 강화초등학교의 설립일은 1896년 2월 4일, 개교기념일은 같은 해 4월 1일로 등록되어 있습니다.",
      },
      {
        title: "강화교육지원청 관할, 강화읍의 학교",
        body: "인천광역시강화교육지원청 관할이며, 교과설계소에 등록된 강화고등학교도 같은 강화읍에 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("강화초등학교"),
      neisSchoolSource("강화고등학교"),
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

  // 2026-09 2차 확장 — 이미 plain schoolContent가 published된 학교 중 아직
  // school-subject 콘텐츠가 없는 과목을 선별 추가 (학교명만 바꾼 콘텐츠가
  // 되지 않도록 학교급/학교 유형별 실제 특성을 반영)
  {
    schoolSlug: "seocho-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "세화여자중학교는 서초구 반포동에 있는 사립 여학교입니다. 영어과외를 알아볼 때 재학 학년과 학교 시험 범위를 먼저 알려주시면 그에 맞춰 상담합니다.",
    schoolSpecificNotes: [
      {
        title: "1978년 설립된 사립 여자 중학교",
        body: "세화여자중학교는 1978년 설립되었고, 교육부 학교기본정보에 설립 구분 사립, 남녀공학 구분 '여'로 등록되어 있습니다.",
      },
      {
        title: "같은 신반포로의 반포중학교와 다른 학교 유형",
        body: "같은 반포동 신반포로에 있는 반포중학교(신반포로 67)는 공립 남학교여서, 같은 도로에 있어도 두 학교는 설립 구분과 남녀 구분이 서로 다릅니다.",
      },
    ],
    sources: [
      neisSchoolSource("세화여자중학교"),
      neisSchoolSource("반포중학교"),
    ],
  },
  {
    schoolSlug: "seocho-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "세화고등학교 학생이 수학과외를 찾는다면, 단원별 배점과 난이도 편차를 먼저 파악하고 배점이 큰 단원 위주로 학습 순서를 정하는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "세화고등학교 학생 안내",
        body: "세화고등학교에 재학 중이라면 지역별 과외 페이지(서초 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "세화고등학교 수학 오답 관리",
        body: "시험이 끝난 뒤에는 틀린 문제를 단원별로 분류해 정리해두면, 다음 시험에서 같은 실수를 반복하지 않는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "songpa-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "가락중학교 학생이 영어과외를 찾는다면, 평소 어휘 암기량과 독해 속도부터 점검한 뒤 학교 시험 준비로 이어가는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "가락중학교 학생 안내",
        body: "가락중학교에 재학 중이라면 지역별 과외 페이지(송파 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "가락중학교 영어 학습 우선순위",
        body: "가락중학교처럼 학년별 학습량이 꾸준히 늘어나는 학교는, 새 단원 진도를 나가기 전 지난 단원 어휘와 문법을 복습하는 루틴을 만들어두는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "songpa-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "가락고등학교 학생이 수학과외를 찾는다면, 최근 시험에서 자주 틀리는 단원을 먼저 파악하고 배점이 큰 단원 위주로 복습 계획을 세우는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "가락고등학교 학생 안내",
        body: "가락고등학교에 재학 중이라면 지역별 과외 페이지(송파 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "가락고등학교 수학 오답 관리",
        body: "가락고등학교처럼 시험 범위가 넓은 학교는 틀린 문제를 단원별로 분류해 정리해두면, 다음 시험 대비 시간을 크게 줄일 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "mapo-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "마포중학교 학생이 수학과외를 찾는다면, 평소 문제 풀이에 걸리는 시간과 자주 틀리는 유형부터 파악한 뒤 학습 계획을 세우는 것이 효과적입니다.",
    schoolSpecificNotes: [
      {
        title: "강서구 화곡로에 있는 마포중학교",
        body: "마포중학교는 교명과 달리 강서구 화곡로 403에 있어, 교과설계소는 이 학교를 마포구가 아닌 강서구 학교로 분류합니다.",
      },
      {
        title: "마포중학교 수학 유형별 약점 관리",
        body: "마포중학교처럼 시험 범위가 넓어지는 학교는, 유형별로 정답률을 기록해두면 다음 시험 전 취약한 부분만 집중적으로 복습할 수 있습니다.",
      },
    ],
    sources: [
      neisSchoolSource("마포중학교"),
    ],
  },
  {
    schoolSlug: "yeongtong-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "영통중학교 학생이 영어과외를 찾는다면, 학교 수행평가와 서술형 시험 방식을 먼저 확인하고 취약한 영역부터 보완하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "영통중학교 학생 안내",
        body: "영통중학교에 재학 중이라면 지역별 과외 페이지(수원 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "영통중학교 영어 수행평가 대비",
        body: "영통중학교를 포함한 중학교 영어는 수행평가 비중이 커지는 추세이므로, 지필고사 대비와 함께 말하기·쓰기 과제 준비도 함께 챙기는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "seongnam-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "서현중학교 학생이 수학과외를 찾는다면, 비슷한 유형에서 반복해서 틀리는 문제가 있는지 먼저 확인하고 원인을 찾아 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "서현중학교 학생 안내",
        body: "서현중학교에 재학 중이라면 지역별 과외 페이지(성남 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "서현중학교 수학 오답 관리",
        body: "서현중학교를 포함한 중학교 수학은 비슷한 유형에서 반복해서 틀리는 경우가 많아, 오답을 원인별로 구분해 기록하고 정기적으로 다시 확인하는 습관이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "yongin-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "신갈고등학교 학생이 영어과외를 찾는다면, 내신 서술형과 모의고사 독해를 함께 준비할 수 있도록 학습 계획을 세우는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "신갈고등학교 학생 안내",
        body: "신갈고등학교에 재학 중이라면 지역별 과외 페이지(용인 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "신갈고등학교 영어 내신·모의고사 병행",
        body: "신갈고등학교를 포함한 고등학교 영어는 학교 내신 서술형과 전국 단위 모의고사 독해 유형이 다르므로, 두 시험의 준비 방식을 구분해 계획을 세웁니다.",
      },
    ],
  },
  {
    schoolSlug: "goyang-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "고양국제고등학교는 고양시 일산동구 식사동에 있는 공립 국제계열 특수목적고등학교입니다. 수학과외 상담에서는 재학 학년과 학교 수학 시험 범위를 먼저 확인합니다.",
    schoolSpecificNotes: [
      {
        title: "학교기본정보상 국제계열 특목고",
        body: "교육부 학교기본정보에서 고양국제고등학교는 고등학교 구분 '특목고', 특수목적고 계열 '국제계열'로 등록되어 있습니다.",
      },
      {
        title: "2011년 설립된 공립 남녀공학",
        body: "고양국제고등학교는 2011년 설립된 공립 남녀공학으로, 주소는 일산동구 위시티4로 112(식사동)입니다.",
      },
    ],
    sources: [
      neisSchoolSource("고양국제고등학교"),
    ],
  },
  {
    schoolSlug: "anyang-high-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "안양외국어고등학교 학생이 영어과외를 찾는다면, 외국어고 교육과정의 높은 영어 비중을 고려해 학습 방향을 정하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "안양외국어고등학교 학생 안내",
        body: "안양외국어고등학교에 재학 중이라면 지역별 과외 페이지(안양 고등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "외국어고 영어 교육과정 특성",
        body: "안양외국어고등학교는 특수목적고등학교로 일반고보다 영어 수업 비중과 난이도가 높은 편이라, 학교 교육과정에 맞춘 수준별 학습이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "bucheon-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "부천중학교 학생이 수학과외를 찾는다면, 연산 정확도와 기본 개념 이해도를 먼저 확인한 뒤 학교 진도에 맞춰 학습을 이어가는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "부천중학교 학생 안내",
        body: "부천중학교에 재학 중이라면 지역별 과외 페이지(부천 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "부천중학교 수학 기초 점검",
        body: "부천중학교처럼 학년이 올라갈수록 단원 간 연계가 강해지는 학교는, 이전 학기 기본 개념을 확실히 다진 뒤 새 진도를 나가는 순서가 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "daechi-elementary-school",
    subjectSlug: "korean",
    status: "published",
    intro:
      "서울대치초등학교 학생이 국어과외를 찾는다면, 읽기 습관과 글의 핵심 내용을 정리하는 힘을 키우는 것부터 시작하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "서울대치초등학교 학생 안내",
        body: "서울대치초등학교에 재학 중이라면 지역별 과외 페이지(강남 초등 국어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "초등 국어 독해 습관 만들기",
        body: "서울대치초등학교를 포함한 초등학교 시기에는 지문을 읽고 스스로 핵심 내용을 정리해보는 연습을 꾸준히 반복하는 것이 중학교 국어 학습의 기초가 됩니다.",
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
