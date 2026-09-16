import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { publicAssetExists } from "@/lib/brand";
import { mainNav, isNavGroup } from "@/data/nav";
import PrimaryButton from "@/components/ui/PrimaryButton";
import MobileMenu from "@/components/layout/MobileMenu";

export default function Header() {
  const hasLogoSymbol = publicAssetExists(siteConfig.brand.logoSymbol);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border-subtle">
      <div className="container-page flex items-center justify-between h-16 md:h-18">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {hasLogoSymbol ? (
            <Image
              src={siteConfig.brand.logoSymbol}
              alt={siteConfig.brandShortName}
              width={36}
              height={36}
              className="rounded-xl"
              priority
            />
          ) : (
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-navy text-white">
              <GraduationCap className="w-5 h-5" />
            </span>
          )}
          <span className="text-lg font-bold text-navy">{siteConfig.brandShortName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {mainNav.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-text-main rounded-lg hover:bg-brand-light hover:text-brand transition-colors"
              >
                {item.label}
              </Link>
              {isNavGroup(item) && (
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                  <div className="min-w-[180px] rounded-2xl border border-border-subtle bg-white shadow-lg p-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-sm rounded-lg text-text-main hover:bg-brand-light hover:text-brand transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <PrimaryButton href="/consult" className="hidden md:inline-flex">
            무료 상담
          </PrimaryButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
