import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { publicAssetExists } from "@/lib/brand";

const serviceLinks = [
  { label: "과목별 과외", href: "/subjects" },
  { label: "학년별 과외", href: "/grades" },
  { label: "지역별 과외", href: "/regions" },
  { label: "학습가이드", href: "/guide" },
];

const consultLinks = [
  { label: "무료상담", href: "/consult" },
  { label: "카카오톡 상담", href: siteConfig.kakaoUrl },
];

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
];

function LinkGroup({ heading, links }: { heading: string; links: typeof serviceLinks }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">{heading}</p>
      <div className="mt-4 flex flex-col gap-2.5 text-sm">
        {links.map((link) =>
          link.href.startsWith("http") ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors w-fit"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white transition-colors w-fit"
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  const hasLogoHorizontal = publicAssetExists(siteConfig.brand.logoHorizontal);

  return (
    <footer className="bg-navy text-white">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8 lg:gap-16">
          <div className="max-w-sm">
            {hasLogoHorizontal && (
              <div className="inline-flex w-fit items-center rounded-lg bg-white px-3 py-2 mb-3">
                <Image
                  src={siteConfig.brand.logoHorizontal}
                  alt=""
                  width={153}
                  height={32}
                  className="h-7 w-auto"
                  loading="eager"
                />
              </div>
            )}
            <p className="text-lg font-bold">{siteConfig.brandName}</p>
            <p className="mt-1.5 text-sm font-medium text-white/80">{siteConfig.slogan}</p>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">{siteConfig.tagline}</p>
            {siteConfig.phone && (
              <p className="mt-4 text-sm text-white/70">상담 문의 {siteConfig.phoneDisplay}</p>
            )}
          </div>

          <LinkGroup heading="서비스" links={serviceLinks} />
          <LinkGroup heading="상담" links={consultLinks} />
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/50">
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
          {siteConfig.businessName && (
            <p>
              {siteConfig.businessName}
              {siteConfig.businessRegistrationNumber &&
                ` · 사업자등록번호 ${siteConfig.businessRegistrationNumber}`}
              {siteConfig.businessAddress && ` · ${siteConfig.businessAddress}`}
            </p>
          )}
          <p>&copy; {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
