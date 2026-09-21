/**
 * School-level content for the plain /school/[schoolSlug] page — the
 * school-level counterpart of schoolSubjectContent.ts, reusing the same
 * published-content-gate pattern one level up (school, not school×subject).
 *
 * Key relationship (enforced by convention, not types):
 * - schoolSlug must be a School.slug from src/data/schools.ts.
 *
 * src/lib/indexability.ts's "school" case gates on isPublishedContent(): a
 * school only stays index+sitemap eligible once status is "published" AND
 * schoolSpecificNotes is non-empty. A "draft" entry, or no entry at all, is
 * noindex/out-of-sitemap — the common template still renders on the page,
 * just without the school-specific block, and search engines don't index it.
 *
 * Initial published set (2026-09): the ~30 schools that already have at
 * least one published src/data/schoolSubjectContent.ts entry, since those
 * are the schools this site already has verified, non-generic content for.
 * Every fact used here (region, school level, gender/specialized-type words
 * that are literally part of the official school name, and which subjects
 * have a dedicated school-subject page) comes straight from schools.ts /
 * regions.ts / schoolSubjectContent.ts — no invented difficulty, school
 * rankings, or admissions outcomes.
 */
export interface SchoolContent {
  schoolSlug: string;
  status: "draft" | "published";
  intro: string;
  schoolSpecificNotes: { title: string; body: string }[];
}

export const schoolContents: SchoolContent[] = [
  {
    schoolSlug: "gangnam-middle-school",
    status: "published",
    intro:
      "대치중학교 학생을 위한 과외를 찾고 있다면, 서울 강남구에 위치한 중학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "대치중학교 학생 안내",
        body: "대치중학교 학생이라면 영어과외·수학과외 페이지에서 학교별 맞춤 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교는 자유학기제 등 학기별 운영 방식이 학교마다 달라, 학교 자체 안내문을 먼저 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "gangnam-high-school",
    status: "published",
    intro:
      "개포고등학교처럼 서울 강남구의 고등학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "개포고등학교 학생 안내",
        body: "개포고등학교 재학생은 수학과외·영어과외 페이지의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교는 내신과 수능을 함께 준비해야 하므로, 두 일정을 구분한 학습 계획이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "yangcheon-middle-school",
    status: "published",
    intro:
      "목동중학교 재학생이 상담을 원한다면, 중학교라는 학교급과 서울 양천구라는 지역 조건을 함께 고려해 안내받을 수 있습니다.",
    schoolSpecificNotes: [
      {
        title: "목동중학교 학생 안내",
        body: "목동중학교에 재학 중이라면, 수학과외·영어과외 페이지의 학교별 콘텐츠를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교 내신은 지필고사와 수행평가 비중을 학교마다 다르게 반영하므로, 평가 계획서를 확인하고 학습 우선순위를 정하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "seocho-middle-school",
    status: "published",
    intro:
      "서울 서초구에 소재한 세화여자중학교(여자 중학교) 학생을 위해, 학년과 지역에 맞춘 학습 정보를 안내합니다.",
    schoolSpecificNotes: [
      {
        title: "세화여자중학교 학생 안내",
        body: "수학과외 페이지에 세화여자중학교 전용 학교별 안내가 마련되어 있으니 함께 참고해보세요.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교 시기에는 과목 수가 늘어나는 만큼, 과목별 학습 시간을 미리 배분해두는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "seocho-high-school",
    status: "published",
    intro:
      "세화고등학교(서울 서초구 소재 고등학교) 학생이라면, 아래 학교별·과목별 안내를 통해 필요한 정보를 확인할 수 있습니다.",
    schoolSpecificNotes: [
      {
        title: "세화고등학교 학생 안내",
        body: "영어과외 페이지를 통해 세화고등학교 재학생에게 맞춘 세부 안내를 받아볼 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 정기고사 성적은 대입과 직결되는 만큼, 시험 범위와 출제 유형을 학교별로 미리 파악해두는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "songpa-middle-school",
    status: "published",
    intro:
      "서울 송파구 지역, 중학교 과정인 가락중학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "가락중학교 학생 안내",
        body: "수학과외 페이지에서는 가락중학교 재학생을 위한 학교별 안내를 별도로 제공하고 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "학기 초 배부되는 가정통신문에서 시험 일정과 수행평가 기준을 미리 확인해두면 학습 계획을 세우기 수월합니다.",
      },
    ],
  },
  {
    schoolSlug: "songpa-high-school",
    status: "published",
    intro:
      "가락고등학교 학생이 과외를 알아본다면, 먼저 서울 송파구 지역과 고등학교 과정에 맞는 정보부터 확인하는 것이 효율적입니다.",
    schoolSpecificNotes: [
      {
        title: "가락고등학교 학생 안내",
        body: "가락고등학교와 관련해서는 영어과외 페이지에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교는 학년별로 모의고사 일정이 정해져 있어, 내신 시험과 겹치지 않도록 학습 계획을 나눠 세우는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "yangcheon-high-school",
    status: "published",
    intro:
      "과외를 알아보는 양천고등학교 학생이라면 우선 서울 양천구, 고등학교라는 조건에 맞는 정보부터 좁혀 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "양천고등학교 학생 안내",
        body: "학교별 맞춤 정보가 필요하다면 수학과외 페이지에서 양천고등학교 안내를 확인해보시기 바랍니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 수행평가는 학기 초 안내되는 평가 계획서에 기준이 명시되므로, 이를 확인하고 준비 방향을 정하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "mapo-middle-school",
    status: "published",
    intro:
      "마포중학교(중학교)에 다니고 있다면, 서울 마포구 지역 정보와 함께 학교별 안내를 살펴보는 것을 권합니다.",
    schoolSpecificNotes: [
      {
        title: "마포중학교 학생 안내",
        body: "현재 마포중학교에 대해서는 영어과외 페이지에 학교별 맞춤 콘텐츠가 등록되어 있어, 재학 중이라면 참고할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교 성적표를 받은 뒤에는 과목별 취약 단원을 정리해두면 다음 학기 학습 계획에 참고할 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "yeongtong-middle-school",
    status: "published",
    intro:
      "경기 수원 영통구의 중학교인 영통중학교에 재학 중이라면, 학교급과 지역에 맞춘 과외 정보를 먼저 확인하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "영통중학교 학생 안내",
        body: "영통중학교 재학생을 위한 세부 콘텐츠는 수학과외 페이지에서 별도로 확인할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "학원 진도와 학교 진도가 다를 수 있으므로, 두 일정을 구분해 학교 시험 범위를 우선 기준으로 삼는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "seongnam-middle-school",
    status: "published",
    intro:
      "서현중학교는 중학교 과정이며 경기 성남에 자리하고 있어, 해당 조건에 맞춘 안내를 함께 확인할 수 있습니다.",
    schoolSpecificNotes: [
      {
        title: "서현중학교 학생 안내",
        body: "학교별 맞춤 정보가 필요하다면 영어과외 페이지에서 서현중학교 안내를 확인해보시기 바랍니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교는 소풍·체육대회 같은 학사 일정이 잦은 편이라, 학사 일정표를 미리 확인해두면 학습 계획을 세우기 쉽습니다.",
      },
    ],
  },
  {
    schoolSlug: "yongin-high-school",
    status: "published",
    intro:
      "신갈고등학교는 경기 용인에 있는 고등학교로, 재학생을 위한 과목별 안내를 함께 제공하고 있습니다.",
    schoolSpecificNotes: [
      {
        title: "신갈고등학교 학생 안내",
        body: "신갈고등학교 재학생은 수학과외 페이지의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "학년이 올라갈수록 과목별 학습 시간 배분이 중요해지므로, 취약 과목부터 우선순위를 정해두는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "goyang-high-school",
    status: "published",
    intro:
      "경기 고양 소재 고양국제고등학교(국제고등학교) 재학생을 위해 학교·지역 맞춤 정보를 정리했습니다.",
    schoolSpecificNotes: [
      {
        title: "고양국제고등학교 학생 안내",
        body: "고양국제고등학교와 관련해서는 영어과외 페이지에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 시험 기간에는 과목별 시험 순서를 고려한 학습 일정표를 미리 짜두는 것이 효율적입니다.",
      },
    ],
  },
  {
    schoolSlug: "anyang-high-school",
    status: "published",
    intro:
      "경기 안양에서 외국어고등학교를 다니는 안양외국어고등학교 학생이라면, 아래에서 학교와 지역에 맞는 정보를 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "안양외국어고등학교 학생 안내",
        body: "안양외국어고등학교에 재학 중이라면, 수학과외 페이지의 학교별 콘텐츠를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "정기고사 이후에는 오답을 과목별로 정리해 다음 시험 대비 계획에 반영하는 것이 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "bucheon-middle-school",
    status: "published",
    intro:
      "경기 부천 지역, 중학교 과정인 부천중학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "부천중학교 학생 안내",
        body: "영어과외 페이지에 부천중학교 전용 학교별 안내가 마련되어 있으니 함께 참고해보세요.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교는 학기말에 다음 학년 예비 소집이나 진로 안내가 이뤄지는 경우가 많아, 관련 일정을 놓치지 않는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "jungdong-high-school",
    status: "published",
    intro:
      "중동고등학교는 서울 강남구에 있는 고등학교로, 재학생을 위한 과목별 안내를 함께 제공하고 있습니다.",
    schoolSpecificNotes: [
      {
        title: "중동고등학교 학생 안내",
        body: "중동고등학교 재학생을 위한 세부 콘텐츠는 수학과외 페이지에서 별도로 확인할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교는 학기 중간 상담을 통해 담임교사와 학습·진로 상황을 점검해볼 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "banpo-middle-school",
    status: "published",
    intro:
      "반포중학교처럼 서울 서초구의 중학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "반포중학교 학생 안내",
        body: "수학과외 페이지를 통해 반포중학교 재학생에게 맞춘 세부 안내를 받아볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "시험 기간에는 과목별 시험 순서를 확인해 벼락치기가 아닌 일정 배분 계획을 세우는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "jamsil-high-school",
    status: "published",
    intro:
      "잠실고등학교(고등학교)에 다니고 있다면, 서울 송파구 지역 정보와 함께 학교별 안내를 살펴보는 것을 권합니다.",
    schoolSpecificNotes: [
      {
        title: "잠실고등학교 학생 안내",
        body: "잠실고등학교 재학생은 수학과외 페이지의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 진학 이후에는 학교 자체 진도와 별도로 모의고사 대비 시간을 확보하는 것이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "sinseo-middle-school",
    status: "published",
    intro:
      "서울 양천구에서 중학교를 다니는 신서중학교 학생이라면, 아래에서 학교와 지역에 맞는 정보를 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "신서중학교 학생 안내",
        body: "신서중학교 재학생을 위한 세부 콘텐츠는 수학과외 페이지에서 별도로 확인할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교 수행평가는 발표·모둠활동 등 형태가 다양해, 평가 방식에 맞춰 준비 방법을 다르게 가져가는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "seongsan-middle-school",
    status: "published",
    intro:
      "서울 마포구 소재 성산중학교(중학교) 재학생을 위해 학교·지역 맞춤 정보를 정리했습니다.",
    schoolSpecificNotes: [
      {
        title: "성산중학교 학생 안내",
        body: "학교별 맞춤 정보가 필요하다면 수학과외 페이지에서 성산중학교 안내를 확인해보시기 바랍니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "학기 중간 상담 기간을 활용해 담임교사와 학습 상황을 점검해보는 것도 계획을 세우는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "jukjeon-high-school",
    status: "published",
    intro:
      "경기 용인 지역, 고등학교 과정인 죽전고등학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "죽전고등학교 학생 안내",
        body: "수학과외 페이지를 통해 죽전고등학교 재학생에게 맞춘 세부 안내를 받아볼 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "학교별로 사용하는 부교재나 프린트물이 다를 수 있어, 학교 자료를 기준으로 학습 범위를 확인하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "pyeongchon-high-school",
    status: "published",
    intro:
      "평촌고등학교처럼 경기 안양의 고등학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "평촌고등학교 학생 안내",
        body: "평촌고등학교와 관련해서는 수학과외 페이지에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 방학은 다음 학기 선행보다 이전 학기 취약 단원 보완에 우선 활용하는 방법도 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "daechi-elementary-school",
    status: "published",
    intro:
      "서울 강남구의 초등학교인 서울대치초등학교에 재학 중이라면, 학교급과 지역에 맞춘 과외 정보를 먼저 확인하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "서울대치초등학교 학생 안내",
        body: "서울대치초등학교와 관련해서는 수학과외 페이지에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "초등학생은 학기 초에 과목별 학습 습관을 먼저 잡아두면 학년이 올라가도 적응이 수월합니다.",
      },
    ],
  },
  {
    schoolSlug: "hyundai-high-school",
    status: "published",
    intro:
      "서울 강남구에서 고등학교를 다니는 현대고등학교 학생이라면, 아래에서 학교와 지역에 맞는 정보를 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "현대고등학교 학생 안내",
        body: "학교별 맞춤 정보가 필요하다면 영어과외 페이지에서 현대고등학교 안내를 확인해보시기 바랍니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "야간자율학습이나 보충수업 운영 방식은 학교마다 달라, 학교 시간표를 기준으로 개인 학습 시간을 배치하는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "eonnam-middle-school",
    status: "published",
    intro:
      "서울 서초구에 소재한 언남중학교(중학교) 학생을 위해, 학년과 지역에 맞춘 학습 정보를 안내합니다.",
    schoolSpecificNotes: [
      {
        title: "언남중학교 학생 안내",
        body: "영어과외 페이지를 통해 언남중학교 재학생에게 맞춘 세부 안내를 받아볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "방학 기간에는 다음 학기 진도를 가볍게 예습해두면 새 학기 적응이 수월해집니다.",
      },
    ],
  },
  {
    schoolSlug: "munjeong-middle-school",
    status: "published",
    intro:
      "과외를 알아보는 문정중학교 학생이라면 우선 서울 송파구, 중학교라는 조건에 맞는 정보부터 좁혀 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "문정중학교 학생 안내",
        body: "영어과외 페이지에 문정중학교 전용 학교별 안내가 마련되어 있으니 함께 참고해보세요.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "중학교에서는 오답노트를 과목별로 정리해두면 시험 직전 복습 시간을 줄일 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "sinmok-high-school",
    status: "published",
    intro:
      "서울 양천구 소재 신목고등학교(고등학교) 재학생을 위해 학교·지역 맞춤 정보를 정리했습니다.",
    schoolSpecificNotes: [
      {
        title: "신목고등학교 학생 안내",
        body: "신목고등학교 재학생은 영어과외 페이지의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교는 학년마다 평가 방식이 달라질 수 있어, 매 학기 초 최신 평가 계획을 다시 확인하는 것이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "sungmun-high-school",
    status: "published",
    intro:
      "서울 마포구에서 고등학교를 다니는 숭문고등학교 학생이라면, 아래에서 학교와 지역에 맞는 정보를 확인해보세요.",
    schoolSpecificNotes: [
      {
        title: "숭문고등학교 학생 안내",
        body: "숭문고등학교 재학생은 영어과외 페이지의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "정기고사 성적표를 받은 뒤 과목별 강약점을 정리해두면 다음 학기 학습 우선순위를 정하는 데 참고할 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "suwon-yeoja-high-school",
    status: "published",
    intro:
      "경기 수원 팔달구 지역, 여자 고등학교 과정인 수원여자고등학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "수원여자고등학교 학생 안내",
        body: "수원여자고등학교 학생이라면 영어과외 페이지에서 학교별 맞춤 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "고등학교 시험 준비는 단기 암기보다 학기 전체 진도를 고려한 누적 복습 계획이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "banpo-elementary-school",
    status: "published",
    intro:
      "서울 서초구 지역, 초등학교 과정인 서울반포초등학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "서울반포초등학교 학생 안내",
        body: "서울반포초등학교에 재학 중이라면, 영어과외 페이지의 학교별 콘텐츠를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "초등 저·고학년에 따라 학습량과 집중 시간이 다르므로, 학년에 맞는 학습 계획을 세우는 것이 중요합니다.",
      },
    ],
  },
];

export function getSchoolContent(schoolSlug: string): SchoolContent | undefined {
  return schoolContents.find((c) => c.schoolSlug === schoolSlug);
}

/** Whether a school entry is complete enough to be shown/indexed. */
export function isPublishedContent(content: SchoolContent | undefined): content is SchoolContent {
  return Boolean(content && content.status === "published" && content.schoolSpecificNotes.length > 0);
}
