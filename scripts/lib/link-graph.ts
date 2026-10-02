/**
 * Internal-link graph over the rendered site (needs a running server — see
 * scripts/lib/server.ts). Fetches every content route from
 * getAllContentRoutes(), keeps only links inside <main> (Header/Footer nav is
 * site-wide and would hide real orphans), and reports:
 *   - orphans: indexed pages that no *other indexed* page links to from <main>
 *     and that aren't in the site-wide Header/Footer nav
 *   - index→noindex links: links from indexed pages to noindex pages
 *     (crawl budget spent on pages we told search engines not to index)
 */
import { BASE_URL } from "./server";
import type { RouteEntry } from "./route-inventory";

export interface LinkGraphResult {
  orphans: string[];
  /** Total links (unique per source page) from indexed pages. */
  indexOutLinks: number;
  /** Of those, links pointing at noindex routes. */
  indexToNoindexLinks: number;
  /** Top noindex targets by number of indexed pages linking to them. */
  topNoindexTargets: { path: string; inbound: number }[];
  /** Per indexed source page, how many of its <main> links go to noindex pages (worst first). */
  worstSources: { path: string; noindex: number; total: number }[];
  inboundFromIndexed: Map<string, number>;
}

function hrefs(body: string): string[] {
  const links = new Set<string>();
  for (const m of body.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1].length > 1 ? m[1].replace(/\/$/, "") : m[1];
    links.add(decodeURIComponent(href));
  }
  return [...links];
}

function mainLinks(html: string): string[] {
  const start = html.indexOf("<main");
  const end = html.lastIndexOf("</main>");
  return hrefs(start >= 0 && end > start ? html.slice(start, end) : html);
}

/** Links in the layout chrome (everything outside <main>), identical on every page. */
function navLinks(html: string): Set<string> {
  const start = html.indexOf("<main");
  const end = html.lastIndexOf("</main>");
  if (start < 0 || end < start) return new Set();
  return new Set(hrefs(html.slice(0, start) + html.slice(end)));
}

async function fetchAll(paths: string[], concurrency = 8): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  let i = 0;
  async function worker() {
    while (i < paths.length) {
      const p = paths[i++];
      const res = await fetch(`${BASE_URL}${p}`);
      out.set(p, res.ok ? await res.text() : "");
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return out;
}

export async function buildLinkGraph(routes: RouteEntry[]): Promise<LinkGraphResult> {
  const byPath = new Map(routes.map((r) => [r.path, r]));
  const indexed = routes.filter((r) => r.index);
  const html = await fetchAll(indexed.map((r) => r.path));

  const inboundFromIndexed = new Map<string, number>();
  const noindexInbound = new Map<string, number>();
  const worstSources: LinkGraphResult["worstSources"] = [];
  let indexOutLinks = 0;
  let indexToNoindexLinks = 0;

  for (const src of indexed) {
    const links = mainLinks(html.get(src.path) ?? "").filter((l) => l !== src.path && byPath.has(l));
    let noindex = 0;
    for (const l of links) {
      indexOutLinks++;
      if (byPath.get(l)!.index) {
        inboundFromIndexed.set(l, (inboundFromIndexed.get(l) ?? 0) + 1);
      } else {
        noindex++;
        indexToNoindexLinks++;
        noindexInbound.set(l, (noindexInbound.get(l) ?? 0) + 1);
      }
    }
    worstSources.push({ path: src.path, noindex, total: links.length });
  }

  // "/" is the entry point, not an orphan by definition.
  const nav = navLinks(html.get("/") ?? "");
  const orphans = indexed.map((r) => r.path).filter((p) => p !== "/" && !nav.has(p) && !inboundFromIndexed.get(p));

  return {
    orphans,
    indexOutLinks,
    indexToNoindexLinks,
    topNoindexTargets: [...noindexInbound.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, inbound]) => ({ path, inbound })),
    worstSources: worstSources.sort((a, b) => b.noindex - a.noindex).slice(0, 10),
    inboundFromIndexed,
  };
}
