"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

const HIDDEN_PATHS = ["/consult", "/privacy", "/terms"];

export default function MobileBottomCTA() {
  const pathname = usePathname();
  const hidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (hidden) return null;

  const bar = (
    <div className="flex gap-2 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <a
        href={siteConfig.kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FEE500] text-[#191919] font-semibold py-3 text-sm whitespace-nowrap"
      >
        <MessageCircle className="w-4 h-4" />
        카카오 상담
      </a>
      <Link
        href="/consult"
        className="flex-1 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold py-3 text-sm whitespace-nowrap"
      >
        무료 상담
      </Link>
    </div>
  );

  return (
    <>
      {/* Spacer reserves scroll space so the fixed bar never covers footer content */}
      <div className="lg:hidden invisible" aria-hidden="true">
        {bar}
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-subtle">
        {bar}
      </div>
    </>
  );
}
