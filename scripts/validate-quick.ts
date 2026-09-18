/**
 * Fast, everyday validation for small changes. No server, no build —
 * just lint, typecheck, and a structural sanity check on the routing/SEO
 * config computed from live source (see scripts/lib/route-inventory.ts).
 */
import { spawnSync } from "child_process";
import {
  computeSummary,
  checkRegionGradeSubjectGate,
  checkSchoolDataIntegrity,
  checkSchoolSubjectGate,
} from "./lib/route-inventory";
import { checkRegionGradeSubjectContentQuality, checkSchoolSubjectContentQuality } from "./lib/content-quality";
import { writeCacheEntry } from "./lib/validation-cache";

const KNOWN_PLACEHOLDERS = ["example-tutoring.com", "1588-0000", "pf.kakao.com/_example"];

function run(label: string, cmd: string): boolean {
  const result = spawnSync(cmd, { stdio: "inherit", shell: true });
  const pass = result.status === 0;
  console.log(`${label}: ${pass ? "PASS" : "FAIL"}`);
  return pass;
}

async function main() {
  const lintOk = run("Lint", "npm run lint --silent");
  const typeOk = run("Typecheck", "npx tsc --noEmit");

  let configOk = true;
  const configIssues: string[] = [];
  try {
    const summary = computeSummary();
    if (summary.duplicateSitemapUrls.length > 0) {
      configOk = false;
      configIssues.push(`duplicate sitemap URLs: ${summary.duplicateSitemapUrls.join(", ")}`);
    }
    if (summary.indexSitemapMismatches.length > 0) {
      configOk = false;
      configIssues.push(
        `index/sitemap flag mismatch: ${summary.indexSitemapMismatches.slice(0, 5).join(", ")}` +
          (summary.indexSitemapMismatches.length > 5 ? ` (+${summary.indexSitemapMismatches.length - 5} more)` : "")
      );
    }

    const gate = checkRegionGradeSubjectGate();
    if (!gate.ok) {
      configOk = false;
      configIssues.push(...gate.issues);
    }

    const schoolIntegrity = checkSchoolDataIntegrity();
    if (!schoolIntegrity.ok) {
      configOk = false;
      configIssues.push(...schoolIntegrity.issues);
    }

    const schoolGate = checkSchoolSubjectGate();
    if (!schoolGate.ok) {
      configOk = false;
      configIssues.push(...schoolGate.issues);
    }
  } catch (err) {
    configOk = false;
    configIssues.push(`route-inventory threw: ${(err as Error).message}`);
  }
  console.log(`Config: ${configOk ? "PASS" : "FAIL"}`);
  if (!configOk) configIssues.forEach((i) => console.log(`  - ${i}`));

  const contentQuality = checkRegionGradeSubjectContentQuality();
  console.log(`Content quality: ${contentQuality.ok ? "PASS" : "FAIL"}`);
  if (!contentQuality.ok) contentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const schoolContentQuality = checkSchoolSubjectContentQuality();
  console.log(`School content quality: ${schoolContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!schoolContentQuality.ok) schoolContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  // Informational only — known placeholders are tracked in docs/qa/remaining-placeholders.md.
  const fs = await import("fs");
  const siteConfigSrc = fs.readFileSync("src/config/site.ts", "utf-8");
  const remaining = KNOWN_PLACEHOLDERS.filter((p) => siteConfigSrc.includes(p));
  if (remaining.length > 0) {
    console.log(`Placeholders: ${remaining.length} known (see docs/qa/remaining-placeholders.md)`);
  }

  const pass = lintOk && typeOk && configOk && contentQuality.ok && schoolContentQuality.ok;
  console.log(`Quick validation: ${pass ? "PASS" : "FAIL"}`);

  writeCacheEntry("quick", pass, {
    lint: lintOk ? "PASS" : "FAIL",
    typecheck: typeOk ? "PASS" : "FAIL",
    config: configOk ? "PASS" : "FAIL",
    contentQuality: contentQuality.ok ? "PASS" : "FAIL",
    schoolContentQuality: schoolContentQuality.ok ? "PASS" : "FAIL",
  });

  process.exit(pass ? 0 : 1);
}

main();
