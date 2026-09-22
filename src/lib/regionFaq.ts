import { regions, getChildren } from "@/data/regions";
import { schools, type School } from "@/data/schools";
import { regionProgramContents, isPublishedContent as isRegionProgramPublished } from "@/data/regionProgramContent";
import { programs } from "@/data/programs";
import type { FAQ } from "@/data/faqs";

/**
 * Region-specific FAQ, derived only from real registered data (school
 * counts/names, sub-regions, published region×program content) — never a
 * template with just the region name swapped. Sibling to buildRegionSchoolIntro
 * (src/lib/regionIntro.ts): same "no fabricated regional facts" principle,
 * same gate (only regions with at least one registered school get FAQs at
 * all — see src/app/region/[province]/[city]/page.tsx), separate frame set
 * so the FAQ answer isn't a verbatim repeat of the page's intro paragraph.
 */

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

/**
 * lead × mid × tail gives 8×8×8 = 512 combinations — the same
 * combinatorial-diversity trick regionIntro.ts uses (a flat 8-entry array
 * wasn't enough distinct phrasing for ~20 regions to each land under the
 * 60% similarity threshold against every other region).
 */
const Q1_LEAD_FRAMES: ((name: string, summary: string, total: number) => string)[] = [
  (name, summary, total) => `${name}에 등록된 학교는 총 ${total}곳으로, ${summary}가 있습니다.`,
  (name, summary, total) => `현재까지 ${name}에서 확인된 학교는 ${summary} 총 ${total}곳입니다.`,
  (name, summary, total) => `${name} 학교 정보를 보면 ${summary}가 등록되어 있어 총 ${total}곳입니다.`,
  (name, summary, total) => `${name}은 ${summary} 등 총 ${total}곳의 학교 정보를 보유하고 있습니다.`,
  (name, summary, total) => `${summary}(총 ${total}곳)가 ${name} 지역 학교 정보로 등록되어 있습니다.`,
  (name, summary, total) => `${name}에서 확인할 수 있는 학교 정보는 ${summary}이며 총 ${total}곳입니다.`,
  (name, summary, total) => `${name} 소재 학교로 ${summary}가 등록되어 있어 총 ${total}곳 확인이 가능합니다.`,
  (name, summary, total) => `${name}에서는 ${summary}의 재학 정보를 확인할 수 있으며 총 ${total}곳입니다.`,
];

const Q1_MID_FRAMES: (() => string)[] = [
  () => "재학 중인 학교를 알려주시면",
  () => "상담 시 재학 학교를 말씀해주시면",
  () => "학교명을 먼저 알려주시면",
  () => "재학 학교 정보를 공유해주시면",
  () => "다니는 학교를 확인해주시면",
  () => "상담 과정에서 재학 학교를 말씀해주시면",
  () => "현재 재학 중인 학교를 알려주시면",
  () => "학교 이름을 알려주시면",
];

const Q1_TAIL_FRAMES: (() => string)[] = [
  () => "해당 학교의 진도와 시험 일정에 맞춰 안내해드립니다.",
  () => "더 정확한 학습 방향을 안내해드립니다.",
  () => "학교 진도에 맞춰 상담해드립니다.",
  () => "학교별 시험 범위에 맞춰 안내해드립니다.",
  () => "그에 맞는 구체적인 학습 계획을 세울 수 있습니다.",
  () => "상담이 한층 빨라집니다.",
  () => "학교 사정에 맞는 준비 방향을 알려드립니다.",
  () => "학교 일정에 맞춰 유연하게 상담해드립니다.",
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
 * Greedily assigns a Q1_ANSWER_FRAMES entry to every city-level region with
 * at least one registered school, minimizing token similarity against every
 * region assigned before it — same algorithm as regionIntro.ts's
 * computeAllIntros(), kept as a separate pass/frame-set so the FAQ answer
 * text never collides with the page's intro paragraph.
 */
function computeAllQ1Answers(): Map<string, string> {
  const cityRegionsWithSchools = regions
    .filter((r) => r.level === "city")
    .map((r) => ({ slug: r.slug, name: r.name, list: schools.filter((s) => s.cityRegionSlug === r.slug) }))
    .filter((r) => r.list.length > 0);

  const result = new Map<string, string>();
  const assigned: string[] = [];

  for (const r of cityRegionsWithSchools) {
    const summary = schoolSummary(r.list);
    let best: { text: string; score: number } | null = null;

    outer: for (const lead of Q1_LEAD_FRAMES) {
      for (const mid of Q1_MID_FRAMES) {
        for (const tail of Q1_TAIL_FRAMES) {
          const text = `${lead(r.name, summary, r.list.length)} ${mid()} ${tail()}`;
          let maxSim = 0;
          for (const prev of assigned) {
            const sim = tokenSimilarity(text, prev);
            if (sim > maxSim) maxSim = sim;
          }
          if (!best || maxSim < best.score) best = { text, score: maxSim };
          if (best.score === 0) break outer;
        }
      }
    }

    result.set(r.slug, best!.text);
    assigned.push(best!.text);
  }

  return result;
}

let cachedQ1Answers: Map<string, string> | null = null;

/**
 * Builds a data-derived FAQ list for a city-level region page. Only called
 * when relatedSchools.length > 0 (the same gate regionIntro.ts already uses) —
 * regions with no registered school data get no region-specific FAQ section
 * at all, rather than a generic filler entry.
 */
export function buildRegionFaqs(regionSlug: string, regionName: string, relatedSchools: School[]): FAQ[] {
  if (relatedSchools.length === 0) return [];
  if (!cachedQ1Answers) cachedQ1Answers = computeAllQ1Answers();

  const faqs: FAQ[] = [
    {
      slug: `region-${regionSlug}-schools`,
      question: `${regionName}에 등록된 학교는 어디인가요?`,
      answer: cachedQ1Answers.get(regionSlug) ?? schoolSummary(relatedSchools),
    },
  ];

  const districts = getChildren(regionSlug);
  if (districts.length > 0) {
    faqs.push({
      slug: `region-${regionSlug}-districts`,
      question: `${regionName} 안에서도 지역에 따라 과외 정보가 다른가요?`,
      answer: `${regionName}은 ${districts.map((d) => d.name).join("·")}로 나뉘어 있으며, 어느 지역에서든 방문 또는 화상으로 수업을 상담할 수 있습니다.`,
    });
  }

  const regionPrograms = programs.filter((p) =>
    isRegionProgramPublished(regionProgramContents.find((c) => c.regionSlug === regionSlug && c.programSlug === p.slug))
  );
  if (regionPrograms.length > 0) {
    faqs.push({
      slug: `region-${regionSlug}-programs`,
      question: `${regionName}에서 코딩·검정고시 같은 프로그램도 상담할 수 있나요?`,
      answer: `네, ${regionName}에서는 ${regionPrograms.map((p) => p.name).join("·")} 프로그램을 상담할 수 있습니다. 학생의 목표와 현재 수준에 맞춰 안내해드립니다.`,
    });
  }

  return faqs;
}
