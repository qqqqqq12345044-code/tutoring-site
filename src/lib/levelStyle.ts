/**
 * One visual identity per 학교급 so 초등·중등·고등 labels read clearly everywhere (solid, bold colors —
 * never a faint/transparent tint for text). Accepts grade slugs ("elementary"), short names ("초등")
 * and school levels ("초등학교").
 */
export interface LevelStyle {
  /** Solid text color for the level name. */
  text: string;
  /** Light background for chips/panels. */
  soft: string;
  /** Solid background (white text on top). */
  solid: string;
  /** Left/top accent border color. */
  border: string;
  /** Top accent border color only (safe to combine with a neutral border color). */
  top: string;
}

const STYLES: Record<"elementary" | "middle" | "high", LevelStyle> = {
  elementary: { text: "text-emerald-700", soft: "bg-emerald-50", solid: "bg-emerald-600", border: "border-emerald-500", top: "border-t-emerald-500" },
  middle: { text: "text-blue-700", soft: "bg-blue-50", solid: "bg-blue-600", border: "border-blue-600", top: "border-t-blue-600" },
  high: { text: "text-violet-700", soft: "bg-violet-50", solid: "bg-violet-600", border: "border-violet-600", top: "border-t-violet-600" },
};

const ALIASES: Record<string, keyof typeof STYLES> = {
  elementary: "elementary",
  초등: "elementary",
  초등학교: "elementary",
  초등학생: "elementary",
  middle: "middle",
  중등: "middle",
  중학교: "middle",
  중학생: "middle",
  high: "high",
  고등: "high",
  고등학교: "high",
  고등학생: "high",
};

export function levelStyle(level: string): LevelStyle {
  return STYLES[ALIASES[level] ?? "middle"];
}
