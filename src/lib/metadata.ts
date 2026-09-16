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

export function buildMetadata({ title, description, path, robots }: BuildMetadataInput): Metadata {
  const url = `${siteConfig.domain}${path}`;
  const fullTitle = title.includes(siteConfig.brandName)
    ? title
    : `${title} - ${siteConfig.brandName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(robots ? { robots: { index: robots.index, follow: robots.follow } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brandName,
      locale: "ko_KR",
      type: "website",
      ...(publicAssetExists(siteConfig.brand.ogImage)
        ? { images: [siteConfig.brand.ogImage] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
