import { regions } from "@/data/regions";
import { schools, type School } from "@/data/schools";

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

const LEAD_FRAMES: ((regionName: string, summary: string) => string)[] = [
  (name, summary) => `${name}에는 현재 ${summary}의 학교 정보가 등록되어 있습니다.`,
  (name, summary) => `${name} 지역에는 ${summary}가 실제로 등록되어 있습니다.`,
  (name, summary) => `${name}에서 확인 가능한 학교는 ${summary}입니다.`,
  (name, summary) => `${name} 내 등록된 학교 정보를 보면 ${summary}가 있습니다.`,
  (name, summary) => `${name}에서 과외를 찾는다면 참고할 학교로 ${summary}가 등록되어 있습니다.`,
  (name, summary) => `${name}의 등록 학교 현황은 ${summary}입니다.`,
  (name, summary) => `${name}에서는 ${summary}의 재학 정보를 확인할 수 있습니다.`,
  (name, summary) => `${name} 소재 학교로는 ${summary}가 등록되어 있습니다.`,
];

const MID_FRAMES: (() => string)[] = [
  () => "학년이 올라갈수록 학교별 진도 차이가 커지는 경향이 있습니다.",
  () => "초·중·고 학교급에 따라 필요한 준비가 달라집니다.",
  () => "과목별로도 학교마다 다루는 부교재나 평가 방식이 다를 수 있습니다.",
  () => "전학이나 배정 변경으로 재학 학교가 바뀌는 경우도 있어 최신 정보 확인이 필요합니다.",
  () => "같은 학년이라도 학교 규모나 학급 수에 따라 수업 진행 속도가 다를 수 있습니다.",
  () => "학기 초 배부되는 학교 안내문을 함께 확인하면 도움이 됩니다.",
  () => "학교급이 바뀌는 시기에는 특히 학습 방식 적응이 중요합니다.",
  () => "지역 내 학교 수가 늘어나면서 학교별 정보 확인의 중요성도 커지고 있습니다.",
];

const TAIL_FRAMES: (() => string)[] = [
  () => "재학 중인 학교의 진도와 시험 일정을 먼저 확인하고, 학년과 과목에 맞는 학습 계획을 세우는 것이 중요합니다.",
  () => "학교별 시험 범위와 진도가 다를 수 있으니, 재학 중인 학교를 기준으로 학습 방향을 정하는 것이 좋습니다.",
  () => "학년과 재학 학교에 따라 준비할 내용이 달라지므로, 아래에서 필요한 정보를 확인해보세요.",
  () => "지역 안에서도 학교마다 시험 형식이 다를 수 있어, 재학 학교를 기준으로 계획을 세우는 것이 효과적입니다.",
  () => "학교와 학년에 맞는 학습 계획을 세우려면 아래 정보를 함께 확인하는 것이 도움이 됩니다.",
  () => "학교마다 진도와 평가 기준이 다를 수 있어, 재학 중인 학교를 기준으로 먼저 확인해보는 것을 권합니다.",
  () => "같은 지역이라도 학교별로 준비 방향이 달라질 수 있으니 아래에서 학교별 정보를 살펴보세요.",
  () => "학생의 학년과 재학 학교를 함께 고려해 학습 계획을 세우는 것이 효과적입니다.",
];

function tokenSimilarity(textA: string, textB: string): number {
  const a = textA.split(/\s+/).filter(Boolean);
  const b = textB.split(/\s+/).filter(Boolean);
  if (a.length === 0 || b.length === 0) return 0;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[a.length][b.length];
  return (2 * lcs) / (a.length + b.length);
}

function schoolSummary(relatedSchools: School[]): string {
  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    names: relatedSchools.filter((s) => s.level === level).map((s) => s.name),
  })).filter((g) => g.names.length > 0);
  return byLevel.map((g) => `${g.level} ${g.names.length}곳(${g.names.join("·")})`).join(", ");
}

/**
 * Greedily assigns a (lead, mid, tail) frame combo to every city-level
 * region that has at least one registered school, minimizing token
 * similarity against every region assigned before it. Pure function of the
 * static regions/schools data, so it's cheap to recompute per call (~18
 * regions today) and always gives the same result for the same data —
 * there's no per-region state to keep in sync.
 */
function computeAllIntros(): Map<string, string> {
  const cityRegionsWithSchools = regions
    .filter((r) => r.level === "city")
    .map((r) => ({ slug: r.slug, name: r.name, list: schools.filter((s) => s.cityRegionSlug === r.slug) }))
    .filter((r) => r.list.length > 0);

  const result = new Map<string, string>();
  const assigned: string[] = [];

  for (const r of cityRegionsWithSchools) {
    const summary = schoolSummary(r.list);
    let best: { intro: string; score: number } | null = null;

    outer: for (const lead of LEAD_FRAMES) {
      for (const mid of MID_FRAMES) {
        for (const tail of TAIL_FRAMES) {
          const intro = `${lead(r.name, summary)} ${mid()} ${tail()}`;
          let maxSim = 0;
          for (const prevIntro of assigned) {
            const sim = tokenSimilarity(intro, prevIntro);
            if (sim > maxSim) maxSim = sim;
          }
          if (!best || maxSim < best.score) best = { intro, score: maxSim };
          if (best.score === 0) break outer;
        }
      }
    }

    result.set(r.slug, best!.intro);
    assigned.push(best!.intro);
  }

  return result;
}

let cachedIntros: Map<string, string> | null = null;

/**
 * Builds the data-driven intro sentence for a city-level region page
 * (src/app/region/[province]/[city]/page.tsx), using only real registered
 * school names/counts — never a template with just the region name swapped.
 * Shared with scripts/lib/content-quality.ts's checkRegionPageContentQuality
 * so the validator checks exactly what the page renders.
 */
export function buildRegionSchoolIntro(regionSlug: string, regionName: string, relatedSchools: School[]): string {
  if (relatedSchools.length === 0) {
    return `${regionName}의 학교별 상세 정보는 순차적으로 등록하고 있습니다. 아래에서 학년별·과목별 과외 정보를 먼저 확인해보세요.`;
  }
  if (!cachedIntros) cachedIntros = computeAllIntros();
  return cachedIntros.get(regionSlug) ?? schoolSummary(relatedSchools);
}
