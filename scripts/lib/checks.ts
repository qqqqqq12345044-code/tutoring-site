import { BASE_URL } from "./server";

async function getHtml(path: string): Promise<{ status: number; html: string }> {
  const res = await fetch(`${BASE_URL}${path}`);
  const html = await res.text();
  return { status: res.status, html };
}

function extractLinks(html: string): string[] {
  const links = new Set<string>();
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    links.add(m[1]);
  }
  return [...links];
}

function extractTag(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

export interface CrawlResult {
  brokenLinks: string[];
  duplicateTitles: string[];
  duplicateDescriptions: string[];
  checkedPages: number;
}

/** Crawls every sitemap URL, checks internal links resolve, and flags duplicate title/description among indexed pages. */
export async function crawlSitemapAndLinks(sitemapPaths: string[]): Promise<CrawlResult> {
  const brokenLinks = new Set<string>();
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  const discoveredLinks = new Set<string>();

  for (const path of sitemapPaths) {
    const { status, html } = await getHtml(path);
    if (status !== 200) {
      brokenLinks.add(path);
      continue;
    }
    const title = extractTag(html, /<title>([^<]*)<\/title>/);
    const description = extractTag(html, /<meta name="description" content="([^"]*)"/);
    if (title) {
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title)!.push(path);
    }
    if (description) {
      if (!descriptions.has(description)) descriptions.set(description, []);
      descriptions.get(description)!.push(path);
    }
    for (const link of extractLinks(html)) {
      if (!link.startsWith("/api/")) discoveredLinks.add(link);
    }
  }

  for (const link of discoveredLinks) {
    if (sitemapPaths.includes(link)) continue; // already checked above
    const { status } = await getHtml(link);
    if (status >= 400) brokenLinks.add(link);
  }

  const duplicateTitles = [...titles.entries()].filter(([, paths]) => paths.length > 1).map(([t]) => t);
  const duplicateDescriptions = [...descriptions.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([d]) => d);

  return {
    brokenLinks: [...brokenLinks],
    duplicateTitles,
    duplicateDescriptions,
    checkedPages: sitemapPaths.length + discoveredLinks.size,
  };
}

export async function checkSearchSmoke(): Promise<boolean> {
  const { status, html } = await getHtml("/regions");
  return status === 200 && html.includes("영통중학교");
}

export interface ConsultSmokeResult {
  ok: boolean;
  details: string[];
}

export async function checkConsultApiSmoke(): Promise<ConsultSmokeResult> {
  const details: string[] = [];
  let ok = true;

  const validRes = await fetch(`${BASE_URL}/api/consult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contactName: "검증스크립트",
      phone: "010-0000-0000",
      grade: "중2",
      subject: "수학",
      lessonType: "visit",
      province: "경기",
      agree: "on",
    }),
  });
  const validBody = await validRes.json();
  if (validRes.status !== 200 || !validBody.ok) {
    ok = false;
    details.push(`valid submission expected 200/ok:true, got ${validRes.status} ${JSON.stringify(validBody)}`);
  }

  const missingRes = await fetch(`${BASE_URL}/api/consult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactName: "검증스크립트" }),
  });
  if (missingRes.status !== 400) {
    ok = false;
    details.push(`missing-fields submission expected 400, got ${missingRes.status}`);
  }

  const malformedRes = await fetch(`${BASE_URL}/api/consult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not-json",
  });
  if (malformedRes.status !== 400) {
    ok = false;
    details.push(`malformed body expected 400, got ${malformedRes.status}`);
  }

  return { ok, details };
}
