import { dongTableSources, getDongsSharingLegalDong, type AdminDong } from "@/data/dongs";
import { schools, type School } from "@/data/schools";
import type { Subject } from "@/data/subjects";
import type { ContentSource } from "@/data/sources";

/**
 * Page content for 행정동 pages (/region/[province]/[city]/[dong]) and 행정동×과목 pages
 * (/region/[province]/[city]/[dong]/[subject]), built only from verified data:
 * - the city's official 행정동 table (src/data/dongs.ts — 법정동, 통·반),
 * - NEIS 학교기본정보 records of the schools resolved into the dong (src/data/schools.ts).
 *
 * No region "facts" (교육열, 학원 수, 성적, 학생 수 …) and no reviews are generated here.
 * The same builders feed the page and the quality gate (scripts/lib/quality-gate.ts), so the
 * gate measures exactly the dong-specific text a visitor sees. Shared layers rendered next to
 * it (subject study guide, grade×subject playbook, class process) are excluded from the gate,
 * the same way the other combination kinds exclude them.
 */

export interface DongNote {
  title: string;
  body: string;
}

export interface DongContent {
  intro: string;
  notes: DongNote[];
  sources: ContentSource[];
}

const LEVEL_ORDER: School["level"][] = ["초등학교", "중학교", "고등학교"];

const NEIS_SCHOOL_INFO = "https://open.neis.go.kr/hub/schoolInfo";

/** Registered schools whose road address resolved to this 행정동, in 초 → 중 → 고 order. */
export function getDongSchools(dong: AdminDong): School[] {
  return schools
    .filter((s) => s.cityRegionSlug === dong.citySlug && s.dongSlug === dong.slug)
    .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) || a.name.localeCompare(b.name, "ko"));
}

export function groupByLevel(list: School[]): { level: School["level"]; list: School[] }[] {
  return LEVEL_ORDER.map((level) => ({ level, list: list.filter((s) => s.level === level) })).filter((g) => g.list.length > 0);
}

/** "초등학교 2곳·중학교 1곳" */
function levelCounts(list: School[]): string {
  return groupByLevel(list)
    .map((g) => `${g.level} ${g.list.length}곳`)
    .join("·");
}

/** Street part of the road address, e.g. "호암로 47". */
function street(s: School): string {
  return s.official?.roadAddress.replace(/^경기도 의정부시 /, "") ?? "";
}

function schoolLabel(s: School): string {
  const o = s.official;
  if (!o) return s.name;
  const kind = [o.foundation, o.highSchoolType, o.coed === "남녀공학" ? undefined : o.coed].filter(Boolean).join("·");
  return `${s.name}(${kind}, ${street(s)})`;
}

function neisSource(s: School): ContentSource | undefined {
  if (!s.official) return undefined;
  return {
    label: `교육부 NEIS 학교기본정보 — ${s.name}`,
    url: `${NEIS_SCHOOL_INFO}?Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=${s.official.code}`,
  };
}

function dongSources(dong: AdminDong, list: School[]): ContentSource[] {
  const table = dongTableSources[dong.citySlug];
  return [...(table ? [table] : []), ...list.flatMap((s) => neisSource(s) ?? [])];
}

/** 법정동 composition + which other 행정동 share each 법정동 (official table only). */
function legalDongNote(dong: AdminDong): DongNote {
  const shared = getDongsSharingLegalDong(dong);
  const own = dong.legalDongs.filter((l) => !shared.some((g) => g.legalDong === l));
  const parts: string[] = [];
  for (const g of shared) {
    parts.push(`법정동 ${g.legalDong}은 ${dong.name} 외에 ${g.dongs.map((d) => d.name).join("·")}에도 걸쳐 있습니다.`);
  }
  if (own.length > 0) parts.push(`법정동 ${own.join("·")}은 ${dong.name}에만 속합니다.`);
  return {
    title: `${dong.legalDongs.join("·")}으로 찾을 때`,
    body: `${dong.name}은 법정동 ${dong.legalDongs.join("·")}을 관할하는 행정동입니다(통 ${dong.tong}개·반 ${dong.ban}개). ${parts.join(" ")} 주소에 적힌 동 이름이 법정동이라면 실제 행정동을 먼저 확인하세요.`,
  };
}

/** Facts that set this dong's schools apart (사립, 단성, 고교 유형, 최근 설립), only when present. */
function schoolProfileFacts(list: School[]): string[] {
  const facts: string[] = [];
  const privateSchools = list.filter((s) => s.official?.foundation === "사립");
  if (privateSchools.length > 0) facts.push(`사립학교는 ${privateSchools.map((s) => s.name).join("·")}입니다.`);
  const single = list.filter((s) => s.official && s.official.coed !== "남녀공학");
  if (single.length > 0) facts.push(`${single.map((s) => `${s.name}는 ${s.official!.coed}`).join(", ")}입니다.`);
  const special = list.filter((s) => s.official?.highSchoolType && s.official.highSchoolType !== "일반고");
  if (special.length > 0) facts.push(`${special.map((s) => `${s.name}는 ${s.official!.highSchoolType}`).join(", ")}로 분류됩니다.`);
  const recent = list.filter((s) => s.official && Number(s.official.founded.slice(0, 4)) >= 2010);
  if (recent.length > 0) facts.push(`${recent.map((s) => `${s.name}(${s.official!.founded.slice(0, 4)}년)`).join("·")}는 2010년 이후 설립된 학교입니다.`);
  return facts;
}

export function buildDongHubContent(dong: AdminDong, cityName: string): DongContent {
  const list = getDongSchools(dong);
  const levels = groupByLevel(list);
  const notes: DongNote[] = [
    {
      title: `${dong.name} 학교 ${list.length}곳`,
      body: levels.map((g) => `${g.level}: ${g.list.map(schoolLabel).join(", ")}.`).join(" "),
    },
  ];
  const facts = schoolProfileFacts(list);
  if (facts.length > 0) notes.push({ title: `${dong.name} 학교 구분`, body: facts.join(" ") });
  notes.push(legalDongNote(dong));

  return {
    intro: `${cityName} ${dong.name}은 법정동 ${dong.legalDongs.join("·")}에 걸친 행정동이며, NEIS 학교기본정보 기준 ${levelCounts(list)}이 주소상 이 동에 있습니다. 다니는 학교와 학년을 알려주시면 과목별 1:1 수업 방향을 함께 정리합니다.`,
    notes,
    sources: dongSources(dong, list),
  };
}

/**
 * Subject × 학교급 checkpoints shown next to the actual schools of that level in the dong.
 * Study-method advice only (no curriculum statistics or school-specific claims).
 */
const SUBJECT_LEVEL_CHECKPOINTS: Record<string, Partial<Record<School["level"], string>>> = {
  korean: {
    초등학교: "교과서 지문을 소리 내어 읽고 중심 문장을 찾는 연습, 받아쓰기·맞춤법 오류를 함께 점검합니다.",
    중학교: "문학 갈래별 개념어와 문법 단원을 학교 시험 범위에 맞춰 정리하고, 서술형 답안 쓰기를 따로 연습합니다.",
    고등학교: "교과서·부교재 지문 분석과 문법 개념 정리를 내신 범위에 맞추고, 비문학 독해 시간을 따로 확보합니다.",
  },
  english: {
    초등학교: "교과서 단원의 듣기·말하기 표현과 기초 어휘를 먼저 다지고, 파닉스·문장 읽기 수준을 확인합니다.",
    중학교: "학교 교과서 본문 암기에 그치지 않도록 문법 단원과 서술형 영작을 시험 범위에 맞춰 함께 준비합니다.",
    고등학교: "교과서·모의고사 지문의 구문 분석과 어휘를 내신 범위 중심으로 정리하고 서술형 변형 문제에 대비합니다.",
  },
  math: {
    초등학교: "연산 정확도와 단원별 개념 이해를 확인하고, 문장제 문제를 식으로 바꾸는 과정을 차근차근 연습합니다.",
    중학교: "학교 진도 단원의 개념 정의와 유형 풀이를 함께 다지고, 서술형 풀이 과정을 빠짐없이 쓰는 연습을 합니다.",
    고등학교: "내신 시험 범위의 개념 증명과 기출 유형을 정리하고, 오답 원인을 개념·계산·해석으로 나눠 관리합니다.",
  },
  social: {
    초등학교: "교과서의 지도·도표 읽기와 핵심 용어 뜻을 정확히 설명할 수 있는지 확인합니다.",
    중학교: "단원별 개념 흐름을 정리하고 자료 해석·서술형 문항에 쓸 근거 문장을 연습합니다.",
    고등학교: "선택 과목별 개념과 자료 분석 문항을 내신 범위에 맞춰 정리하고 서술형 답안 구성을 연습합니다.",
  },
  science: {
    초등학교: "실험 과정과 결과를 자기 말로 설명해 보고, 교과서 그림·표에 나온 개념을 함께 확인합니다.",
    중학교: "단원별 개념과 실험·탐구 문항을 연결해 정리하고, 그래프 해석 문제를 반복 연습합니다.",
    고등학교: "선택 과목의 개념 원리와 계산 문항을 내신 범위에 맞춰 정리하고 탐구 자료 해석을 연습합니다.",
  },
};

/** Subject-relevant school facts that exist in the official record (e.g. 과학계열 특목고 on science pages). */
function subjectSchoolFacts(subject: Subject, list: School[]): string[] {
  const facts: string[] = [];
  if (subject.slug === "science") {
    const sci = list.filter((s) => s.official?.highSchoolType === "특목고(과학계열)");
    if (sci.length > 0) facts.push(`${sci.map((s) => s.name).join("·")}는 NEIS 기준 과학계열 특수목적고등학교입니다.`);
  }
  const vocational = list.filter((s) => s.official?.highSchoolType === "특성화고");
  if (vocational.length > 0) {
    facts.push(`${vocational.map((s) => s.name).join("·")}는 특성화고로, 보통 교과 ${subject.name} 수업 범위를 학교 교육과정에서 먼저 확인합니다.`);
  }
  return facts;
}

export function buildDongSubjectContent(dong: AdminDong, cityName: string, subject: Subject): DongContent {
  const list = getDongSchools(dong);
  const levels = groupByLevel(list);
  const checkpoints = SUBJECT_LEVEL_CHECKPOINTS[subject.slug] ?? {};
  const notes: DongNote[] = levels.map((g) => ({
    title: `${dong.name} ${g.level} ${subject.name} 공부 포인트`,
    body: `${g.list.map(schoolLabel).join(", ")}. ${checkpoints[g.level] ?? ""}`.trim(),
  }));
  const facts = [...subjectSchoolFacts(subject, list), ...schoolProfileFacts(list)];
  if (facts.length > 0) notes.push({ title: `${dong.name} 학교 구분과 ${subject.name} 수업`, body: facts.join(" ") });
  notes.push(legalDongNote(dong));

  return {
    intro: `${cityName} ${dong.name}에서 ${subject.name}과외를 찾는 학생을 위한 안내입니다. 법정동 ${dong.legalDongs.join("·")}에 걸친 이 동에는 NEIS 학교기본정보 기준 ${levelCounts(list)}이 있어, 학교급별로 확인할 ${subject.name} 학습 포인트를 실제 학교 목록과 함께 정리했습니다.`,
    notes,
    sources: dongSources(dong, list),
  };
}
