/**
 * Prints the RED / AMBER / GREEN quality gate (scripts/lib/quality-gate.ts).
 * Read-only report; `--verbose` lists every row with its reasons.
 */
import { runQualityGate, summarizeQualityGate } from "./lib/quality-gate";

const rows = runQualityGate();
summarizeQualityGate(rows).forEach((l) => console.log(l));
if (process.argv.includes("--verbose")) {
  for (const r of rows) {
    console.log(`${r.grade.padEnd(5)} ${r.indexed ? "idx" : "---"} ${(r.nearest * 100).toFixed(0).padStart(3)}% ${r.path}  ${r.reasons.join("; ")}`);
  }
}
