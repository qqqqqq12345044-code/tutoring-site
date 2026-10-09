import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { publicAssetExists } from "@/lib/brand";
import { ogImagePath, type ThumbnailMotif } from "@/lib/thumbnails";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Omit to leave robots unset (defaults to index, follow). Pass explicitly to declare a page noindex. */
  robots?: { index: boolean; follow: boolean };
  /**
   * Category thumbnail (src/lib/thumbnails.ts). Its OG PNG (public/assets/og/<motif>.png) is used only
   * when the file actually exists; otherwise the site-wide og-default.png stays in place.
   */
  image?: ThumbnailMotif;
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

function resolveOgImage(image: ThumbnailMotif | undefined, alt: string) {
  if (image) {
    const url = ogImagePath(image);
    if (publicAssetExists(url)) return [{ url, width: 1200, height: 630, alt }];
  }
  return ogImage;
}

export function buildMetadata({ title, description, path, robots, image }: BuildMetadataInput): Metadata {
  const url = `${siteConfig.domain}${path}`;
  const fullTitle = title.includes(siteConfig.brandName)
    ? title
    : `${title} - ${siteConfig.brandName}`;
  const images = resolveOgImage(image, fullTitle);

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
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}
