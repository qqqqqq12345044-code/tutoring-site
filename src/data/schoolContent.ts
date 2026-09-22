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

  // 인천 미추홀구·연수구·남동구·부평구·계양구·강화군 — 이미 published된
  // schoolSubjectContent가 있는 학교인데 학교 단위(plain /school) 콘텐츠가
  // 없던 18곳 보강 (2026-09). 사실 관계(학교명·학교급·지역·과목 페이지 존재
  // 여부)는 전부 schools.ts / regions.ts / schoolSubjectContent.ts에서 그대로
  // 가져왔고, 순위·정원·입시 결과 등은 다루지 않는다.
  {
    schoolSlug: "michuhol-elementary-school",
    status: "published",
    intro:
      "인천숭의초등학교 학생을 위한 과외를 찾고 있다면, 인천 미추홀구에 위치한 초등학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "인천숭의초등학교 학생 안내",
        body: "인천숭의초등학교에 재학 중이라면, 국어과외 페이지의 학교별 콘텐츠(미추홀 초등 국어과외)를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "초등학생은 가정통신문과 알림장을 통해 학교 일정을 미리 챙기는 습관을 들이면 준비물이나 과제를 놓치는 일을 줄일 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "michuhol-middle-school",
    status: "published",
    intro:
      "관교중학교 학생을 위한 과외를 찾고 있다면, 인천 미추홀구에 위치한 중학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "관교중학교 학생 안내",
        body: "관교중학교에 재학 중이라면, 수학과외 페이지의 학교별 콘텐츠(미추홀 중등 수학과외)도 함께 확인해볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "자유학년(학기)제가 끝난 뒤 처음 치르는 지필고사는 이전과 평가 방식이 달라지므로, 학교 안내에 따라 시험 형식을 미리 확인해두는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "michuhol-high-school",
    status: "published",
    intro:
      "인천고등학교처럼 인천 미추홀구의 고등학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천고등학교 학생 안내",
        body: "인천고등학교 재학생은 영어과외 페이지(미추홀 고등 영어과외)의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "수시 전형을 고려한다면 정기고사 성적뿐 아니라 학생부에 기록되는 활동 내용도 학기 중에 틈틈이 챙겨두는 것이 좋습니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-elementary-school",
    status: "published",
    intro:
      "인천 연수구의 초등학교인 인천송도초등학교에 재학 중이라면, 학교급과 지역에 맞춘 과외 정보를 먼저 확인하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천송도초등학교 학생 안내",
        body: "인천송도초등학교와 관련해서는 수학과외 페이지(연수 초등 수학과외)에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "받아쓰기나 기본 연산처럼 반복이 필요한 학습은 짧더라도 매일 꾸준히 하는 방식이 벼락치기보다 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-middle-school",
    status: "published",
    intro:
      "영어과외를 찾는 연수중학교 학생이라면, 먼저 재학 중인 학교의 최근 시험 범위와 유형을 확인해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "연수중학교 학생 안내",
        body: "연수중학교 재학생은 지역별 과외 페이지(연수 중등 영어과외)에서 학교별 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "학교알리미에 공시되는 학업성취사항 자료를 참고하면 재학 중인 학교의 평가 경향을 가늠하는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "yeonsu-high-school",
    status: "published",
    intro:
      "수학과외를 알아보는 연수고등학교 학생이라면, 재학 중인 학교의 평가 방식부터 확인하고 계획을 세우는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "연수고등학교 학생 안내",
        body: "연수고등학교 학생이라면 수학과외 페이지(연수 고등 수학과외)의 학교별 콘텐츠도 함께 참고할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "3월 전국연합학력평가 결과는 실제 내신 성적은 아니지만, 취약 영역을 가늠해보는 참고 자료로 활용할 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-elementary-school",
    status: "published",
    intro:
      "인천 남동구 지역, 초등학교 과정인 인천구월초등학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "인천구월초등학교 학생 안내",
        body: "인천구월초등학교에 재학 중이라면, 영어과외 페이지의 학교별 콘텐츠(남동 초등 영어과외)를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "짧은 책이라도 꾸준히 읽고 내용을 말로 설명해보는 연습은 어휘력과 독해력을 함께 길러주는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-middle-school",
    status: "published",
    intro:
      "구월중학교 학생을 위한 과외를 찾고 있다면, 인천 남동구에 위치한 중학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "구월중학교 학생 안내",
        body: "구월중학교에 재학 중이라면, 국어과외 페이지의 학교별 콘텐츠(남동 중등 국어과외)도 함께 확인해볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "과목별로 담당 선생님의 출제 스타일이 다를 수 있어, 지난 시험지를 보관해두고 경향을 함께 살펴보는 것도 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "namdong-high-school",
    status: "published",
    intro:
      "인천남동고등학교처럼 인천 남동구의 고등학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천남동고등학교 학생 안내",
        body: "인천남동고등학교 재학생은 사회과외 페이지(남동 고등 사회과외)의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "발표나 보고서로 진행되는 수행평가는 제출 기한을 학기 초 계획표에 미리 표시해두면 막판에 몰리는 것을 막을 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-elementary-school",
    status: "published",
    intro:
      "인천 부평구의 초등학교인 인천갈산초등학교에 재학 중이라면, 학교급과 지역에 맞춘 과외 정보를 먼저 확인하는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "인천갈산초등학교 학생 안내",
        body: "인천갈산초등학교와 관련해서는 과학과외 페이지(부평 초등 과학과외)에 별도의 학교별 콘텐츠가 마련되어 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "방과후 활동과 개인 학습 시간을 구분해 하루 일과표를 함께 짜보면 스스로 계획하는 습관을 기르는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-middle-school",
    status: "published",
    intro:
      "부평중학교 학생을 위한 과외를 찾고 있다면, 인천 부평구에 위치한 중학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "부평중학교 학생 안내",
        body: "부평중학교에 재학 중이라면, 영어과외 페이지의 학교별 콘텐츠(부평 중등 영어과외)도 함께 확인해볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "수행평가 일정을 과목별로 따로 적어두는 캘린더를 만들어두면 겹치는 제출일을 미리 조정하는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "bupyeong-high-school",
    status: "published",
    intro:
      "부평고등학교에 재학 중이라면, 수학 학습을 시작하기 전에 최근 정기고사 범위와 난이도부터 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "부평고등학교 학생 안내",
        body: "부평고등학교 학생이라면 수학과외 페이지(부평 고등 수학과외)의 학교별 콘텐츠도 함께 참고할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "정시 위주로 준비한다면 내신 비중을 조정하는 대신 수능 과목 학습 시간을 우선 배분하는 방식도 고려할 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-elementary-school",
    status: "published",
    intro:
      "인천계산초등학교 학생을 위한 과외를 찾고 있다면, 인천 계양구에 위치한 초등학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "인천계산초등학교 학생 안내",
        body: "인천계산초등학교에 재학 중이라면, 국어과외 페이지의 학교별 콘텐츠(계양 초등 국어과외)를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "담임교사와의 상담 주간을 활용해 학습 태도나 교우 관계를 함께 점검해보면 가정 학습 계획을 세우는 데도 참고가 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-middle-school",
    status: "published",
    intro:
      "계산중학교 학생을 위한 과외를 찾고 있다면, 인천 계양구에 위치한 중학교 정보를 참고해 학습 계획을 세워보세요.",
    schoolSpecificNotes: [
      {
        title: "계산중학교 학생 안내",
        body: "계산중학교에 재학 중이라면, 사회과외 페이지의 학교별 콘텐츠(계양 중등 사회과외)도 함께 확인해볼 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "방학 기간에는 다음 학기 진도를 미리 보기보다, 직전 학기 시험에서 자주 틀린 과목을 우선 보충하는 편이 효율적일 수 있습니다.",
      },
    ],
  },
  {
    schoolSlug: "gyeyang-high-school",
    status: "published",
    intro:
      "계산고등학교처럼 인천 계양구의 고등학교에 다니는 학생은 지역·학교급 조건에 맞는 정보부터 확인하면 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "계산고등학교 학생 안내",
        body: "계산고등학교 재학생은 영어과외 페이지(계양 고등 영어과외)의 학교별 안내도 함께 확인해보는 것을 추천합니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "교과별 세부능력 및 특기사항은 수업 중 활동이 쌓여 기록되는 만큼, 평소 수업 참여도를 챙겨두는 것이 학기 말에 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-elementary-school",
    status: "published",
    intro:
      "인천 강화군 지역, 초등학교 과정인 강화초등학교 재학생을 위한 맞춤 정보입니다.",
    schoolSpecificNotes: [
      {
        title: "강화초등학교 학생 안내",
        body: "강화초등학교에 재학 중이라면, 수학과외 페이지의 학교별 콘텐츠(강화 초등 수학과외)를 참고 자료로 활용할 수 있습니다.",
      },
      {
        title: "초등학교 학습 관리 팁",
        body: "학기말에 치르는 단원평가나 수행 결과를 모아두면 다음 학년에서 어떤 부분을 다시 챙겨야 할지 가늠하는 데 도움이 됩니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-middle-school",
    status: "published",
    intro:
      "과학과외를 찾는 강화중학교 학생이라면, 먼저 재학 중인 학교의 최근 시험 범위와 유형을 확인해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "강화중학교 학생 안내",
        body: "강화중학교 재학생은 지역별 과외 페이지(강화 중등 과학과외)에서 학교별 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 학습 관리 팁",
        body: "과학처럼 개념과 계산이 함께 나오는 과목은 공식을 외우기 전에 원리를 이해했는지 스스로 점검해보는 것이 중요합니다.",
      },
    ],
  },
  {
    schoolSlug: "ganghwa-high-school",
    status: "published",
    intro:
      "강화고등학교에 재학 중이라면, 국어 학습을 시작하기 전에 최근 정기고사 범위와 난이도부터 점검해보는 것이 좋습니다.",
    schoolSpecificNotes: [
      {
        title: "강화고등학교 학생 안내",
        body: "강화고등학교 학생이라면 국어과외 페이지(강화 고등 국어과외)의 학교별 콘텐츠도 함께 참고할 수 있습니다.",
      },
      {
        title: "고등학교 학습 관리 팁",
        body: "모의고사 이후에는 정답률이 낮았던 유형을 표로 정리해두면 다음 시험에서 같은 실수를 줄이는 데 도움이 됩니다.",
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
