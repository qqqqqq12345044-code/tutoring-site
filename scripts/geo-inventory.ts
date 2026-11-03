/**
 * GEO/AEO rollout readiness inventory (docs/qa/geo-aeo-pilot-2026-11-03.md, "Rollout Readiness"). Read-only: classifies
 * every indexed GREEN school×학년×과목 page as a candidate for question-led answer blocks. Does not change any page.
 *
 *   npx tsx scripts/geo-inventory.ts [production-sitemap-paths.txt]
 *
 * PILOT          already has src/data/schoolGradeGeo.ts answers
 * HOLD           not in the Production sitemap given (work-only batch) — cannot be measured yet
 * NO_DATA        no row has 시기 or 평가 방법 → no "언제/어떻게" question can be answered from the plan
 * NEEDS_EVIDENCE fewer than half the rows have 시기 and 방법, or fewer than 2 notes
 * DUPLICATE_RISK Quality Gate masked nearest-neighbour ≥ 25% (within 5 points of the 30% GREEN line)
 * READY          everything else
 */
import fs from "fs";
import { schoolGradeSubjectContents, isPublishedGradeSubject } from "@/data/schoolGradeSubjectContent";
import { getSchoolGradeGeo } from "@/data/schoolGradeGeo";
import { getIndexability } from "@/lib/indexability";
import { runQualityGate } from "./lib/quality-gate";

const DUPLICATE_RISK = 0.25;
const sitemapFile = process.argv[2];
const prod = sitemapFile ? new Set(fs.readFileSync(sitemapFile, "utf8").split(/\r?\n/).filter(Boolean)) : undefined;
const qg = new Map(runQualityGate().filter((r) => r.kind === "school-grade-subject").map((r) => [r.path, r]));

const counts: Record<string, number> = {};
const lines: string[] = [];
for (const c of schoolGradeSubjectContents.filter(isPublishedGradeSubject)) {
  const path = `/school/${c.schoolSlug}/${c.grade}/${c.subjectSlug}`;
  if (!getIndexability("school-grade-subject", { schoolSlug: c.schoolSlug, schoolGrade: String(c.grade), subjectSlug: c.subjectSlug }).index) continue;
  const row = qg.get(path);
  const timed = c.assessments.filter((a) => a.timing).length;
  const method = c.assessments.filter((a) => a.method).length;
  const half = c.assessments.length / 2;
  const cls = getSchoolGradeGeo(c.schoolSlug, c.grade, c.subjectSlug)
    ? "PILOT"
    : prod && !prod.has(path)
      ? "HOLD"
      : timed === 0 && method === 0
        ? "NO_DATA"
        : timed < half || method < half || c.notes.length < 2
          ? "NEEDS_EVIDENCE"
          : (row?.nearest ?? 0) >= DUPLICATE_RISK
            ? "DUPLICATE_RISK"
            : "READY";
  counts[cls] = (counts[cls] ?? 0) + 1;
  lines.push([cls, path, `rows ${c.assessments.length}`, `timing ${timed}`, `method ${method}`, `notes ${c.notes.length}`, `nearest ${((row?.nearest ?? 0) * 100).toFixed(1)}%`].join("\t"));
}
lines.sort();
console.log(lines.join("\n"));
console.log(`TOTAL ${lines.length} ${Object.entries(counts).sort().map(([k, v]) => `${k} ${v}`).join(" / ")}${prod ? "" : " (no sitemap given: HOLD not evaluated)"}`);
