/**
 * Internal-link audit against the current .next build (run `npm run build`
 * first). Prints orphan / index→noindex summary; exits 1 when orphans exist.
 */
import { getAllContentRoutes } from "./lib/route-inventory";
import { startServer, stopServer } from "./lib/server";
import { buildLinkGraph } from "./lib/link-graph";

async function main() {
  const routes = getAllContentRoutes();
  const server = await startServer();
  try {
    const g = await buildLinkGraph(routes);
    const ratio = g.indexOutLinks ? (g.indexToNoindexLinks / g.indexOutLinks) * 100 : 0;
    console.log(`Indexed pages: ${routes.filter((r) => r.index).length}`);
    console.log(`Orphans: ${g.orphans.length}`);
    g.orphans.forEach((o) => console.log(`  ${o}`));
    console.log(`Index→noindex links: ${g.indexToNoindexLinks}/${g.indexOutLinks} (${ratio.toFixed(1)}%)`);
    if (process.argv.includes("--verbose")) {
      console.log("Top noindex targets:");
      g.topNoindexTargets.forEach((t) => console.log(`  ${t.inbound}  ${t.path}`));
      console.log("Worst sources:");
      g.worstSources.forEach((s) => console.log(`  ${s.noindex}/${s.total}  ${s.path}`));
    }
    process.exitCode = g.orphans.length > 0 ? 1 : 0;
  } finally {
    stopServer(server);
  }
}
main();
