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
  checkSchoolGate,
  checkSubGradeGate,
  checkSubjectTopicGate,
  checkSchoolSubjectGate,
  checkRegionProgramGate,
  checkProgramRouteCollisions,
  checkRegionGate,
  checkSitemapLastmod,
} from "./lib/route-inventory";
import { runQualityGate, summarizeQualityGate, checkQualityNoindexSync, checkSchoolSubjectNoindexHolds } from "./lib/quality-gate";
import {
  checkRegionGradeSubjectContentQuality,
  checkRegionPageContentQuality,
  checkRegionFaqContentQuality,
  checkSchoolContentQuality,
  checkSubGradeContentQuality,
  checkSubjectTopicContentQuality,
  checkSchoolSubjectContentQuality,
  checkRegionProgramContentQuality,
  checkGuideContentQuality,
  checkContentSources,
} from "./lib/content-quality";
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

    const plainSchoolGate = checkSchoolGate();
    if (!plainSchoolGate.ok) {
      configOk = false;
      configIssues.push(...plainSchoolGate.issues);
    }

    const schoolGate = checkSchoolSubjectGate();
    if (!schoolGate.ok) {
      configOk = false;
      configIssues.push(...schoolGate.issues);
    }

    const subGradeGate = checkSubGradeGate();
    if (!subGradeGate.ok) {
      configOk = false;
      configIssues.push(...subGradeGate.issues);
    }

    const subjectTopicGate = checkSubjectTopicGate();
    if (!subjectTopicGate.ok) {
      configOk = false;
      configIssues.push(...subjectTopicGate.issues);
    }

    const programGate = checkRegionProgramGate();
    if (!programGate.ok) {
      configOk = false;
      configIssues.push(...programGate.issues);
    }

    const regionGate = checkRegionGate();
    if (!regionGate.ok) {
      configOk = false;
      configIssues.push(...regionGate.issues);
    }

    const lastmod = checkSitemapLastmod();
    if (!lastmod.ok) {
      configOk = false;
      configIssues.push(...lastmod.issues.slice(0, 5));
    }

    const programCollisions = checkProgramRouteCollisions();
    if (!programCollisions.ok) {
      configOk = false;
      configIssues.push(...programCollisions.issues);
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

  const contentSources = checkContentSources();
  console.log(`Content sources: ${contentSources.ok ? "PASS" : "FAIL"}`);
  if (!contentSources.ok) contentSources.issues.forEach((i) => console.log(`  - ${i}`));

  const plainSchoolContentQuality = checkSchoolContentQuality();
  console.log(`Plain school content quality: ${plainSchoolContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!plainSchoolContentQuality.ok) plainSchoolContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const schoolContentQuality = checkSchoolSubjectContentQuality();
  console.log(`School content quality: ${schoolContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!schoolContentQuality.ok) schoolContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const programContentQuality = checkRegionProgramContentQuality();
  console.log(`Program content quality: ${programContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!programContentQuality.ok) programContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const regionPageContentQuality = checkRegionPageContentQuality();
  console.log(`Region page content quality: ${regionPageContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!regionPageContentQuality.ok) regionPageContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const subGradeContentQuality = checkSubGradeContentQuality();
  console.log(`Sub-grade content quality: ${subGradeContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!subGradeContentQuality.ok) subGradeContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const regionFaqContentQuality = checkRegionFaqContentQuality();
  console.log(`Region FAQ content quality: ${regionFaqContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!regionFaqContentQuality.ok) regionFaqContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const subjectTopicContentQuality = checkSubjectTopicContentQuality();
  console.log(`Subject topic content quality: ${subjectTopicContentQuality.ok ? "PASS" : "FAIL"}`);
  if (!subjectTopicContentQuality.ok) subjectTopicContentQuality.issues.forEach((i) => console.log(`  - ${i}`));

  const guideQuality = checkGuideContentQuality();
  console.log(
    `Guide content quality: ${guideQuality.ok ? "PASS" : "FAIL"} (min ${guideQuality.minChars}자, guide pair max ${(guideQuality.maxGuidePairSimilarity * 100).toFixed(0)}%, paragraph overlap max ${(guideQuality.maxParagraphOverlap * 100).toFixed(0)}%, studyGuide pair max ${(guideQuality.maxStudyGuidePairSimilarity * 100).toFixed(0)}%)`
  );
  if (!guideQuality.ok) guideQuality.issues.forEach((i) => console.log(`  - ${i}`));

  // RED pages must be held noindex (src/data/qualityNoindex.ts); AMBER stays informational.
  const qualityRows = runQualityGate();
  summarizeQualityGate(qualityRows).forEach((l) => console.log(`Quality gate ${l}`));
  const qualitySync = checkQualityNoindexSync(qualityRows);
  console.log(`Quality gate RED sync: ${qualitySync.ok ? "PASS" : "FAIL"}`);
  if (!qualitySync.ok) qualitySync.issues.forEach((i) => console.log(`  - ${i}`));
  const schoolHolds = checkSchoolSubjectNoindexHolds(qualityRows);
  console.log(`School×subject noindex holds: ${schoolHolds.ok ? "PASS" : "FAIL"}`);
  if (!schoolHolds.ok) schoolHolds.issues.forEach((i) => console.log(`  - ${i}`));

  // Informational only — known placeholders are tracked in docs/qa/remaining-placeholders.md.
  const fs = await import("fs");
  const siteConfigSrc = fs.readFileSync("src/config/site.ts", "utf-8");
  const remaining = KNOWN_PLACEHOLDERS.filter((p) => siteConfigSrc.includes(p));
  if (remaining.length > 0) {
    console.log(`Placeholders: ${remaining.length} known (see docs/qa/remaining-placeholders.md)`);
  }

  const pass =
    lintOk &&
    typeOk &&
    configOk &&
    contentQuality.ok &&
    contentSources.ok &&
    plainSchoolContentQuality.ok &&
    schoolContentQuality.ok &&
    programContentQuality.ok &&
    regionPageContentQuality.ok &&
    subGradeContentQuality.ok &&
    regionFaqContentQuality.ok &&
    subjectTopicContentQuality.ok &&
    guideQuality.ok &&
    qualitySync.ok &&
    schoolHolds.ok;
  console.log(`Quick validation: ${pass ? "PASS" : "FAIL"}`);

  writeCacheEntry("quick", pass, {
    lint: lintOk ? "PASS" : "FAIL",
    typecheck: typeOk ? "PASS" : "FAIL",
    config: configOk ? "PASS" : "FAIL",
    contentQuality: contentQuality.ok ? "PASS" : "FAIL",
    contentSources: contentSources.ok ? "PASS" : "FAIL",
    plainSchoolContentQuality: plainSchoolContentQuality.ok ? "PASS" : "FAIL",
    schoolContentQuality: schoolContentQuality.ok ? "PASS" : "FAIL",
    programContentQuality: programContentQuality.ok ? "PASS" : "FAIL",
    regionPageContentQuality: regionPageContentQuality.ok ? "PASS" : "FAIL",
    subGradeContentQuality: subGradeContentQuality.ok ? "PASS" : "FAIL",
    regionFaqContentQuality: regionFaqContentQuality.ok ? "PASS" : "FAIL",
    subjectTopicContentQuality: subjectTopicContentQuality.ok ? "PASS" : "FAIL",
    guideContentQuality: guideQuality.ok ? "PASS" : "FAIL",
    qualityRedSync: qualitySync.ok ? "PASS" : "FAIL",
    schoolSubjectHolds: schoolHolds.ok ? "PASS" : "FAIL",
  });

  process.exit(pass ? 0 : 1);
}

main();
