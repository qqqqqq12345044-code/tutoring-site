import { THUMB_H, THUMB_W, thumbnailMarkup, type ThumbnailMotif } from "@/lib/thumbnails";

/**
 * Decorative study-object illustration (books, pencils, notebooks …) for cards and page heroes.
 * Self-drawn SVG from src/lib/thumbnails.ts — no external image or license dependency.
 */
export default function StudyThumbnail({ motif, className = "" }: { motif: ThumbnailMotif; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${THUMB_W} ${THUMB_H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`block w-full h-auto ${className}`}
      // Static markup built from constants in src/lib/thumbnails.ts (no user input).
      dangerouslySetInnerHTML={{ __html: thumbnailMarkup(motif) }}
    />
  );
}
