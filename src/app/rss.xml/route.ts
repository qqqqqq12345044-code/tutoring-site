import { siteConfig } from "@/config/site";
import { guideArticles, guideCategories } from "@/data/guide";
import { grades } from "@/data/grades";
import { subjects } from "@/data/subjects";
import { getSubGradeContent, isPublishedContent as isSubGradePublished } from "@/data/subGradeContent";
import { getSubjectTopicContent, isPublishedContent as isSubjectTopicPublished } from "@/data/subjectTopicContent";

/**
 * RSS feed of informational content only — guide articles plus the published
 * sub-grade (/grade/x/y) and subject-topic (/subject/x/y) explainers.
 * Not a copy of sitemap.xml: region/school landing pages are deliberately left
 * out (sitemap = every indexable URL, RSS = readable learning content).
 *
 * pubDate = the date each entry was first published: guide articles carry their
 * own publishedAt; other entries use the map below, taken from git history
 * (first commit that added it). Entries without a known date fall back to
 * DEFAULT_DATE — update this map when adding content.
 */
export const dynamic = "force-static";

const DEFAULT_DATE = "2026-09-28";

const PUBLISHED_ON: Record<string, string> = {
  // subGradeContent.ts — c6628c1 / 0afab7a / 2026-10 추가분
  "sub-grade:elementary/6": "2026-09-22",
  "sub-grade:middle/3": "2026-09-22",
  "sub-grade:high/1": "2026-09-22",
  "sub-grade:high/3": "2026-09-22",
  "sub-grade:elementary/1": "2026-10-02",
  "sub-grade:elementary/2": "2026-10-02",
  "sub-grade:elementary/3": "2026-10-02",
  // subjectTopicContent.ts — c6628c1 (나머지는 0afab7a, DEFAULT_DATE)
  "topic:english/vocab": "2026-09-22",
  "topic:math/suneung": "2026-09-22",
  "topic:math/school-exam": "2026-09-22",
  "topic:korean/grammar": "2026-09-22",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
  // KST midnight, so the feed date matches the Korean calendar date in git history.
  return new Date(`${date}T00:00:00+09:00`).toUTCString();
}

interface FeedItem {
  title: string;
  path: string;
  description: string;
  category: string;
  date: string;
}

function collectItems(): FeedItem[] {
  const items: FeedItem[] = [];

  for (const a of guideArticles) {
    items.push({
      title: a.title,
      path: `/guide/${a.slug}`,
      description: a.excerpt,
      category: guideCategories.find((c) => c.slug === a.categorySlug)?.name ?? "학습가이드",
      date: a.publishedAt,
    });
  }

  for (const g of grades) {
    for (const sg of g.subGrades) {
      const content = getSubGradeContent(g.slug, sg.slug);
      if (!isSubGradePublished(content)) continue;
      items.push({
        title: `${sg.label} 공부, 무엇을 챙겨야 할까 — ${content.notes.map((n) => n.title).join(" · ")}`,
        path: `/grade/${g.slug}/${sg.slug}`,
        description: content.intro,
        category: `${g.name} 학년별 학습`,
        date: PUBLISHED_ON[`sub-grade:${g.slug}/${sg.slug}`] ?? DEFAULT_DATE,
      });
    }
  }

  for (const s of subjects) {
    for (const t of s.topics) {
      const content = getSubjectTopicContent(s.slug, t.slug);
      if (!isSubjectTopicPublished(content)) continue;
      items.push({
        title: `${s.name} ${t.title} 학습법`,
        path: `/subject/${s.slug}/${t.slug}`,
        description: content.intro,
        category: `${s.name} 공부법`,
        date: PUBLISHED_ON[`topic:${s.slug}/${t.slug}`] ?? DEFAULT_DATE,
      });
    }
  }

  return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function GET() {
  const items = collectItems();
  const lastBuild = items[0]?.date ?? DEFAULT_DATE;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(`${siteConfig.brandName} 학습 정보`)}</title>
<link>${siteConfig.domain}</link>
<description>${escapeXml("초·중·고 학년별·과목별 공부 방법과 학습가이드")}</description>
<language>ko</language>
<lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
<atom:link href="${siteConfig.domain}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `<item>
<title>${escapeXml(item.title)}</title>
<link>${siteConfig.domain}${item.path}</link>
<guid isPermaLink="true">${siteConfig.domain}${item.path}</guid>
<description>${escapeXml(item.description)}</description>
<category>${escapeXml(item.category)}</category>
<pubDate>${toRfc822(item.date)}</pubDate>
</item>`
  )
  .join("\n")}
</channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
