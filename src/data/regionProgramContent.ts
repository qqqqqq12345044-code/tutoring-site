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
