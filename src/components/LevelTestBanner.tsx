import { ClipboardCheck, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { consultHref, type ConsultContext } from "@/lib/consultContext";

interface LevelTestBannerProps {
  /** Subject/area of the current page, passed to /consult so the form starts prefilled. */
  context?: ConsultContext;
  /** Hide the 신청 button (e.g. on /consult, where the form is already on the page). */
  showApply?: boolean;
  className?: string;
  /** Always stack text above buttons (for narrow columns such as the home hero). */
  stacked?: boolean;
}

/**
 * 무료 레벨테스트 안내. Wording stays general on purpose: only "free level test is available" is a confirmed
 * fact — format, duration and target are not stated, so the copy must not invent them.
 */
export default function LevelTestBanner({ context, showApply = true, className = "", stacked = false }: LevelTestBannerProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-brand bg-white px-5 py-5 md:px-8 md:py-6 flex flex-col ${stacked ? "" : "md:flex-row md:items-center md:justify-between"} gap-4 shadow-sm ${className}`}
      data-analytics-location="level_test_banner"
    >
      <div className="flex items-start gap-3.5">
        <span className="hidden sm:flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-brand text-white">
          <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">이벤트</span>
            <span className="text-lg md:text-xl font-extrabold text-navy">무료 레벨테스트 진행중</span>
          </p>
          <p className="mt-1.5 text-sm text-text-main/80 leading-relaxed">
            상담을 신청하시면 학생의 현재 수준을 확인하는 레벨테스트를 무료로 받아보실 수 있습니다. 결과를 바탕으로
            수업 방향을 안내해드립니다.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
        {showApply && (
          <PrimaryButton href={consultHref(context)} size="md">
            무료 레벨테스트 신청
          </PrimaryButton>
        )}
        {siteConfig.phone && (
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand text-brand bg-white font-semibold px-5 py-3 text-sm whitespace-nowrap hover:bg-brand-light"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {siteConfig.phoneDisplay}
          </a>
        )}
      </div>
    </div>
  );
}
