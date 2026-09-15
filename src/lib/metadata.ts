import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata({ title, description, path }: BuildMetadataInput): Metadata {
  const url = `${siteConfig.domain}${path}`;
  const fullTitle = title.includes(siteConfig.brandName)
    ? title
    : `${title} - ${siteConfig.brandName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brandName,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
