/**
 * Prints the RED / AMBER / GREEN quality gate (scripts/lib/quality-gate.ts).
 * Read-only report.
 *   --verbose   list every row with its reasons
 *   --dry-run   also grade status "draft" region×grade×subject entries as if
 *               published (candidates not yet switched on), and list them
 *   --classify  count the missing GREEN conditions across non-GREEN rows
 */
import { runQualityGate, summarizeQualityGate, type QualityRow } from "./lib/quality-gate";

const dryRun = process.argv.includes("--dry-run");
const rows = runQualityGate({ includeDrafts: dryRun });
summarizeQualityGate(rows).forEach((l) => console.log(l));

const line = (r: QualityRow) =>
  `${r.grade.padEnd(5)} ${r.draft ? "dft" : r.indexed ? "idx" : "---"} ${(r.nearest * 100).toFixed(0).padStart(3)}% ${r.path}  ${r.reasons.join("; ")}`;

if (process.argv.includes("--verbose")) rows.forEach((r) => console.log(line(r)));
else if (dryRun) rows.filter((r) => r.draft).forEach((r) => console.log(line(r)));

if (process.argv.includes("--classify")) {
  const categories: [string, RegExp][] = [
    ["출처 부족", /출처/],
    ["고유 note 부족", /note/],
    ["기존 페이지와 유사", /유사도/],
    ["지역·학교 데이터 부족", /등록 학교 0/],
    ["공통 가이드(playbook) 부족", /playbook/],
  ];
  for (const kind of ["region-subject", "region-grade-subject", "school-subject"] as const) {
    const bad = rows.filter((r) => r.kind === kind && r.grade !== "GREEN");
    const parts = categories.map(([name, re]) => `${name} ${bad.filter((r) => r.reasons.some((x) => re.test(x))).length}`);
    console.log(`${kind} (non-GREEN ${bad.length}): ${parts.join(" / ")}`);
  }
}
