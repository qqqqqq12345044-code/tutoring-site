import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { publicAssetExists } from "@/lib/brand";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Omit to leave robots unset (defaults to index, follow). Pass explicitly to declare a page noindex. */
  robots?: { index: boolean; follow: boolean };
}

/** Shared default OG/Twitter image descriptor, reused by layout.tsx as the site-wide fallback for pages that skip buildMetadata(). */
export const ogImage = publicAssetExists(siteConfig.brand.ogImage)
  ? [
      {
        url: siteConfig.brand.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} | ${siteConfig.tagline}`,
      },
    ]
  : undefined;

/** Site-wide RSS feed (src/app/rss.xml/route.ts), advertised via <link rel="alternate">. */
export const rssFeed = [{ url: "/rss.xml", title: `${siteConfig.brandName} 학습 정보` }];

export function buildMetadata({ title, description, path, robots }: BuildMetadataInput): Metadata {
  const url = `${siteConfig.domain}${path}`;
  const fullTitle = title.includes(siteConfig.brandName)
    ? title
    : `${title} - ${siteConfig.brandName}`;

  return {
    title,
    description,
    // Page-level alternates replace layout.tsx's, so the RSS discovery link is repeated here.
    alternates: { canonical: url, types: { "application/rss+xml": rssFeed } },
    ...(robots ? { robots: { index: robots.index, follow: robots.follow } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brandName,
      locale: "ko_KR",
      type: "website",
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: ogImage } : {}),
    },
  };
}
