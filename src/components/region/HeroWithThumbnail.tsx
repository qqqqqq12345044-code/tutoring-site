import type { ReactNode } from "react";
import StudyThumbnail from "@/components/StudyThumbnail";
import type { ThumbnailMotif } from "@/lib/thumbnails";

/**
 * Hero body (h1 + intro) with the study-object thumbnail on the right from md up — the same grid
 * the program page and the 행정동 pages use. Mobile keeps the existing policy: thumbnail hidden.
 */
export default function HeroWithThumbnail({ motif, children }: { motif: ThumbnailMotif; children: ReactNode }) {
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-8 items-center">
      <div className="max-w-2xl">{children}</div>
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border-subtle">
        <StudyThumbnail motif={motif} />
      </div>
    </div>
  );
}
