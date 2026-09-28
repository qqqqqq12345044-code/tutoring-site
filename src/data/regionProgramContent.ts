/**
 * Region-specific content for a (region × program) combination — the
 * program-track counterpart of schoolSubjectContent.ts, reusing the same
 * published-content-gate pattern.
 *
 * Key relationships (enforced by convention, not types):
 * - regionSlug must be a city-level RegionNode.slug from src/data/regions.ts.
 * - programSlug must be a Program.slug from src/data/programs.ts.
 *
 * src/lib/indexability.ts's "region-program" case gates on
 * isPublishedContent(): a combination only becomes index+sitemap eligible
 * once status is "published" AND regionSpecificNotes is non-empty. A "draft"
 * entry, or no entry at all, is treated the same — noindex, out of the
 * sitemap, and rendered with generic fallback copy only.
 */
export interface RegionProgramContent {
  regionSlug: string;
  programSlug: string;
  status: "draft" | "published";
  intro: string;
  regionSpecificNotes: { title: string; body: string }[];
}

export const regionProgramContents: RegionProgramContent[] = [
  {
    regionSlug: "suwon",
    programSlug: "coding",
    status: "published",
    intro:
      "수원에서 코딩과외를 찾는다면, 자녀의 학교급과 코딩 경험 유무를 먼저 확인하고 영통구·팔달구·장안구·권선구 어느 지역에서든 방문 또는 화상으로 수업을 상담할 수 있습니다.",
    regionSpecificNotes: [
      {
        title: "수원 지역 코딩과외 진행 방식",
        body: "수원은 4개 구 전역에서 방문·화상 수업이 모두 가능해, 자녀가 다니는 학교나 학원 일정에 맞춰 수업 시간을 조율할 수 있습니다.",
      },
      {
        title: "수원 학교 정보 연계",
        body: "영통중학교 등 수원 내 재학 학교 정보가 있다면 학교별 과외 페이지와 함께 참고해 방과 후 학습 계획을 세울 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "suwon",
    programSlug: "ged",
    status: "published",
    intro:
      "수원에서 검정고시를 준비한다면, 응시 예정인 급수(초졸·중졸·고졸)와 과목별 현재 실력을 먼저 확인하고 수원 4개 구 어디서든 방문 또는 화상으로 상담받을 수 있습니다.",
    regionSpecificNotes: [
      {
        title: "수원 지역 검정고시 준비 방식",
        body: "수원은 영통구·팔달구·장안구·권선구 전역에서 방문·화상 수업이 가능해, 거주 지역과 관계없이 응시 일정에 맞춰 과목별 집중 학습을 진행할 수 있습니다.",
      },
      {
        title: "단기 집중 준비 상담",
        body: "다음 회차 시험까지 남은 기간이 짧은 경우에도, 현재 성적을 기준으로 우선순위 과목을 정해 수원 지역 내에서 바로 학습을 시작할 수 있습니다.",
      },
    ],
  },
  {
    regionSlug: "gangnam",
    programSlug: "coding",
    status: "published",
    intro:
      "강남에서 코딩과외를 찾는다면, 자녀의 코딩 경험 유무와 관심 분야를 먼저 확인하고 방문 또는 화상 수업 중 편한 방식으로 상담받을 수 있습니다.",
    regionSpecificNotes: [
      {
        title: "강남 학교 정보 연계",
        body: "강남은 대치중학교·개포고등학교 등 여러 학교 정보가 등록되어 있어, 재학 중인 학교의 방과 후 시간에 맞춰 방문 또는 화상 수업을 조율할 수 있습니다.",
      },
      {
        title: "관심 분야 우선 상담",
        body: "블록 코딩부터 텍스트 언어까지 관심 분야와 학년이 다양하므로, 상담 시 현재 경험 수준을 먼저 알려주시면 도구와 진행 방식을 맞춰 안내해드립니다.",
      },
    ],
  },
  {
    regionSlug: "songpa",
    programSlug: "ged",
    status: "published",
    intro:
      "송파에서 검정고시를 준비한다면, 응시 예정인 급수(초졸·중졸·고졸)와 과목별 현재 실력을 먼저 확인하고 방문 또는 화상으로 상담받을 수 있습니다.",
    regionSpecificNotes: [
      {
        title: "송파 지역 검정고시 학습 방식",
        body: "송파는 방문·화상 수업을 모두 지원해, 학교를 그만두었거나 재학 중이 아닌 학생도 거주지에서 편하게 상담받을 수 있습니다.",
      },
      {
        title: "과목별 우선순위 상담",
        body: "검정고시는 과목별 배점과 난이도가 다르므로, 현재 실력을 기준으로 어떤 과목부터 집중할지 상담을 통해 정하는 것이 효율적입니다.",
      },
    ],
  },
  {
    regionSlug: "seocho",
    programSlug: "korean-language",
    status: "published",
    intro:
      "서초에서 한국어과외를 찾는다면, 학생의 한국어 수준과 학습 목적을 먼저 확인하고 방문 또는 화상으로 상담받을 수 있습니다.",
    regionSpecificNotes: [
      {
        title: "서초 지역 한국어과외 진행 방식",
        body: "서초는 방문·화상 수업이 모두 가능해, 세화여자중학교 등 재학 중인 학교 일정에 맞춰 수업 시간을 조율할 수 있습니다.",
      },
      {
        title: "학습 목적별 맞춤 상담",
        body: "학교 적응을 위한 기초 회화부터 학업을 위한 읽기·쓰기까지 목적에 따라 학습 방향이 달라지므로, 상담 시 목적을 먼저 알려주시면 정확한 안내가 가능합니다.",
      },
    ],
  },
];

export function getRegionProgramContent(
  regionSlug: string,
  programSlug: string
): RegionProgramContent | undefined {
  return regionProgramContents.find((c) => c.regionSlug === regionSlug && c.programSlug === programSlug);
}

/** Whether a region-program entry is complete enough to be shown/indexed. */
export function isPublishedContent(
  content: RegionProgramContent | undefined
): content is RegionProgramContent {
  return Boolean(content && content.status === "published" && content.regionSpecificNotes.length > 0);
}
