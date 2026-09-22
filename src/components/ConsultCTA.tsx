import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface ConsultCTAProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  /** Set false to hide the secondary Kakao button (default: shown). */
  showKakao?: boolean;
}

export default function ConsultCTA({
  title,
  description,
  ctaLabel = "무료 상담받기",
  showKakao = true,
}: ConsultCTAProps) {
  return (
    <div className="rounded-2xl bg-brand-light px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div>
        <p className="text-lg md:text-xl font-bold text-navy">{title}</p>
        {description && <p className="mt-1.5 text-sm text-text-muted">{description}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
        <PrimaryButton href="/consult" size="lg">
          {ctaLabel}
        </PrimaryButton>
        {showKakao && (
          <a
            href={siteConfig.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FEE500] text-[#191919] font-semibold px-6 py-3.5 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            카카오톡 상담
          </a>
        )}
      </div>
    </div>
  );
}
