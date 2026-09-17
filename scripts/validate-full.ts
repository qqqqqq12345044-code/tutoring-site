/**
 * Release/checkpoint validation. Reuses validate:quick, then builds,
 * spins up a real production server, and crawls the actual sitemap +
 * discovered internal links. Does NOT take Playwright screenshots —
 * visual/responsive review stays a separate, explicit command.
 */
import { spawnSync } from "child_process";
import { computeSummary, getSitemapPaths } from "./lib/route-inventory";
import { startServer, stopServer } from "./lib/server";
import { crawlSitemapAndLinks, checkSearchSmoke, checkConsultApiSmoke } from "./lib/checks";
import { BASELINE } from "./lib/baseline";

function runQuick(): boolean {
  const result = spawnSync("npx tsx scripts/validate-quick.ts", { stdio: "inherit", shell: true });
  return result.status === 0;
}

function runBuild(): boolean {
  const result = spawnSync("npm run build", { stdio: "pipe", shell: true });
  if (result.status !== 0) {
    console.log((result.stdout?.toString() ?? "") + (result.stderr?.toString() ?? ""));
  }
  console.log(`Build: ${result.status === 0 ? "PASS" : "FAIL"}`);
  return result.status === 0;
}

async function main() {
  const failures: string[] = [];

  const quickOk = runQuick();
  if (!quickOk) failures.push("quick validation");

  const buildOk = runBuild();
  if (!buildOk) failures.push("build");

  const summary = computeSummary();
  const routesOk = summary.totalRoutes === BASELINE.totalRoutes;
  const sitemapOk = summary.sitemapCount === BASELINE.sitemapCount;
  const noindexOk = summary.noindexCount === BASELINE.noindexCount;
  const integrityOk = summary.duplicateSitemapUrls.length === 0 && summary.indexSitemapMismatches.length === 0;

  console.log(`Routes: ${summary.totalRoutes} ${routesOk ? "PASS" : `FAIL (baseline ${BASELINE.totalRoutes})`}`);
  console.log(`Sitemap: ${summary.sitemapCount} ${sitemapOk ? "PASS" : `FAIL (baseline ${BASELINE.sitemapCount})`}`);
  console.log(`Noindex: ${summary.noindexCount} ${noindexOk ? "PASS" : `FAIL (baseline ${BASELINE.noindexCount})`}`);
  if (!routesOk || !sitemapOk || !noindexOk) {
    failures.push("route/sitemap/noindex count drift from baseline (scripts/lib/baseline.ts)");
  }
  if (!integrityOk) {
    failures.push("sitemap integrity (duplicates or index/sitemap flag mismatch)");
    if (summary.duplicateSitemapUrls.length) console.log(`  duplicate sitemap URLs: ${summary.duplicateSitemapUrls.join(", ")}`);
    if (summary.indexSitemapMismatches.length) console.log(`  index/sitemap mismatches: ${summary.indexSitemapMismatches.join(", ")}`);
  }

  if (!buildOk) {
    console.log("Broken links: SKIPPED (build failed)");
    console.log("Metadata duplicates: SKIPPED (build failed)");
    console.log("Consult API smoke: SKIPPED (build failed)");
    console.log("Search smoke: SKIPPED (build failed)");
  } else {
    const server = await startServer();
    try {
      const crawl = await crawlSitemapAndLinks(getSitemapPaths());
      const brokenOk = crawl.brokenLinks.length === BASELINE.brokenLinks;
      console.log(`Broken links: ${crawl.brokenLinks.length} ${brokenOk ? "PASS" : "FAIL"}`);
      if (!brokenOk) {
        failures.push("broken links");
        console.log(`  ${crawl.brokenLinks.join(", ")}`);
      }

      const dupCount = crawl.duplicateTitles.length + crawl.duplicateDescriptions.length;
      console.log(`Metadata duplicates: ${dupCount} ${dupCount === 0 ? "PASS" : "FAIL"}`);
      if (dupCount > 0) {
        failures.push("duplicate title/description");
        crawl.duplicateTitles.forEach((t) => console.log(`  duplicate title: "${t}"`));
        crawl.duplicateDescriptions.forEach((d) => console.log(`  duplicate description: "${d.slice(0, 60)}..."`));
      }

      const searchOk = await checkSearchSmoke();
      console.log(`Search smoke: ${searchOk ? "PASS" : "FAIL"}`);
      if (!searchOk) failures.push("search smoke");

      const consult = await checkConsultApiSmoke();
      console.log(`Consult API smoke: ${consult.ok ? "PASS" : "FAIL"}`);
      if (!consult.ok) {
        failures.push("consult API smoke");
        consult.details.forEach((d) => console.log(`  ${d}`));
      }
    } finally {
      stopServer(server);
    }
  }

  const pass = failures.length === 0;
  console.log(`FULL VALIDATION: ${pass ? "PASS" : "FAIL"}`);
  if (!pass) console.log(`Failed: ${failures.join(", ")}`);
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error("validate:full crashed:", err);
  process.exit(1);
});
