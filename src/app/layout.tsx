import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { publicAssetExists } from "@/lib/brand";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomCTA from "@/components/layout/MobileBottomCTA";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";

// favicon.ico (src/app/favicon.ico) is the guaranteed fallback; the SVG/apple
// variants only join metadata once the real files land in public/assets/brand.
const icons: Metadata["icons"] = {
  icon: publicAssetExists(siteConfig.brand.faviconSvg)
    ? [
        { url: siteConfig.brand.faviconSvg, type: "image/svg+xml" },
        { url: "/favicon.ico" },
      ]
    : "/favicon.ico",
  ...(publicAssetExists(siteConfig.brand.appleTouchIcon)
    ? { apple: siteConfig.brand.appleTouchIcon }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.tagline}`,
    template: `%s - ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  icons,
  // Site-wide default OG image; pages built via buildMetadata() override this
  // with the same image today, but any page that skips buildMetadata (e.g.
  // not-found) still gets a real image instead of no preview at all.
  ...(publicAssetExists(siteConfig.brand.ogImage)
    ? {
        openGraph: {
          siteName: siteConfig.brandName,
          locale: "ko_KR",
          type: "website",
          images: [siteConfig.brand.ogImage],
        },
      }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomCTA />
      </body>
    </html>
  );
}
