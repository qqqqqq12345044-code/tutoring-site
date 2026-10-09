/**
 * 학습 소품 일러스트 썸네일 — 사람 사진 대신 책·연필·노트·교재·학습 도구를 그린 자체 제작 SVG.
 *
 * 외부 이미지·라이선스 의존이 없도록 도형만으로 그린다. 같은 마크업을 두 곳에서 쓴다:
 * - 화면 카드 썸네일: src/components/StudyThumbnail.tsx (인라인 SVG, 장식용 aria-hidden)
 * - OG 이미지: scripts/generate-og-images.ts가 1200×630 PNG로 렌더링해 public/assets/og/에 저장
 *   (src/lib/metadata.ts는 해당 PNG가 실제로 있을 때만 사용하고, 없으면 og-default.png로 폴백)
 *
 * 좌표계는 400×210 (OG 1200×630과 같은 비율). 학교·지역별 개별 이미지는 만들지 않는다
 * (docs/qa/og-thumbnail-plan-2026-10-06.md §2) — 카테고리 단위로만 공유한다.
 */

export type ThumbnailMotif =
  | "korean"
  | "english"
  | "math"
  | "social"
  | "science"
  | "coding"
  | "nonsul"
  | "ged"
  | "korean-language"
  | "elementary"
  | "middle"
  | "high"
  | "guide"
  | "strategy"
  | "exam"
  | "region"
  | "school";

export const THUMB_W = 400;
export const THUMB_H = 210;

const NAVY = "#142B52";
const BLUE = "#2563EB";
const SKY = "#BFDBFE";
const PALE = "#EFF6FF";
const PAPER = "#FFFFFF";
const LINE = "#CBD5E1";
const AMBER = "#F59E0B";
const WOOD = "#E9D5B5";

/** 책상 상판 + 배경 */
function desk(bg = PALE): string {
  return `<rect width="400" height="210" fill="${bg}"/><rect y="168" width="400" height="42" fill="${WOOD}"/><rect y="168" width="400" height="4" fill="#D6BC94"/>`;
}

function pencil(x: number, y: number, len = 120, angle = -18, body = AMBER): string {
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect width="${len}" height="12" rx="2" fill="${body}"/><rect x="${len - 14}" width="14" height="12" fill="#F9A8D4"/><rect x="${len - 18}" width="4" height="12" fill="#94A3B8"/><polygon points="0,0 -16,6 0,12" fill="${WOOD}"/><polygon points="-10,3.7 -16,6 -10,8.3" fill="${NAVY}"/></g>`;
}

function closedBook(x: number, y: number, w: number, h: number, color: string): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${color}"/><rect x="${x + 4}" y="${y + h - 6}" width="${w - 8}" height="4" fill="${PAPER}" opacity="0.85"/>`;
}

function openBook(cx: number, y: number, w = 150, h = 74): string {
  const half = w / 2;
  const lines = [0, 1, 2, 3, 4]
    .map(
      (i) =>
        `<line x1="${cx - half + 14}" y1="${y + 16 + i * 11}" x2="${cx - 12}" y2="${y + 16 + i * 11}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>` +
        `<line x1="${cx + 12}" y1="${y + 16 + i * 11}" x2="${cx + half - 14}" y2="${y + 16 + i * 11}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`
    )
    .join("");
  return `<path d="M${cx - half - 6} ${y + 6} L${cx} ${y + 12} L${cx + half + 6} ${y + 6} L${cx + half + 6} ${y + h + 8} L${cx} ${y + h + 14} L${cx - half - 6} ${y + h + 8} Z" fill="${NAVY}"/><path d="M${cx - half} ${y} Q${cx - half / 2} ${y - 6} ${cx} ${y + 6} L${cx} ${y + h + 6} Q${cx - half / 2} ${y + h - 4} ${cx - half} ${y + h} Z" fill="${PAPER}"/><path d="M${cx + half} ${y} Q${cx + half / 2} ${y - 6} ${cx} ${y + 6} L${cx} ${y + h + 6} Q${cx + half / 2} ${y + h - 4} ${cx + half} ${y + h} Z" fill="${PAPER}"/>${lines}`;
}

function notebook(x: number, y: number, w: number, h: number, grid = false, cover = BLUE): string {
  let inner = "";
  if (grid) {
    for (let gx = x + 18; gx < x + w - 4; gx += 12) inner += `<line x1="${gx}" y1="${y + 6}" x2="${gx}" y2="${y + h - 6}" stroke="${SKY}" stroke-width="1.2"/>`;
    for (let gy = y + 12; gy < y + h - 4; gy += 12) inner += `<line x1="${x + 10}" y1="${gy}" x2="${x + w - 6}" y2="${gy}" stroke="${SKY}" stroke-width="1.2"/>`;
  } else {
    for (let gy = y + 18; gy < y + h - 6; gy += 13) inner += `<line x1="${x + 20}" y1="${gy}" x2="${x + w - 10}" y2="${gy}" stroke="${LINE}" stroke-width="2"/>`;
  }
  const rings = Array.from({ length: Math.floor((h - 12) / 16) }, (_, i) => `<circle cx="${x}" cy="${y + 12 + i * 16}" r="4" fill="none" stroke="${NAVY}" stroke-width="2.5"/>`).join("");
  return `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="6" fill="${cover}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${PAPER}"/>${inner}${rings}`;
}

function ruler(x: number, y: number, len: number, angle = 0): string {
  const ticks = Array.from({ length: Math.floor(len / 10) }, (_, i) => `<line x1="${6 + i * 10}" y1="0" x2="${6 + i * 10}" y2="${i % 2 ? 6 : 10}" stroke="${NAVY}" stroke-width="1.5"/>`).join("");
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect width="${len}" height="20" rx="2" fill="#FDE68A"/>${ticks}</g>`;
}

function flask(cx: number, y: number): string {
  return `<path d="M${cx - 12} ${y} h24 v34 l30 52 a10 10 0 0 1 -9 15 h-66 a10 10 0 0 1 -9 -15 l30 -52 Z" fill="${PAPER}" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/><path d="M${cx - 30} ${y + 66} h60 l12 20 a6 6 0 0 1 -5 9 h-74 a6 6 0 0 1 -5 -9 Z" fill="${BLUE}" opacity="0.85"/><rect x="${cx - 16}" y="${y - 6}" width="32" height="8" rx="3" fill="${NAVY}"/><circle cx="${cx - 6}" cy="${y + 78}" r="4" fill="${PAPER}" opacity="0.8"/><circle cx="${cx + 10}" cy="${y + 72}" r="3" fill="${PAPER}" opacity="0.8"/>`;
}

function globe(cx: number, cy: number, r = 46): string {
  return `<line x1="${cx}" y1="${cy + r}" x2="${cx}" y2="${cy + r + 18}" stroke="${NAVY}" stroke-width="5"/><rect x="${cx - 26}" y="${cy + r + 16}" width="52" height="8" rx="4" fill="${NAVY}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${SKY}"/><path d="M${cx - 30} ${cy - 22} q14 -10 26 -2 q8 8 -2 16 q-12 6 -6 18 q-14 4 -20 -8 q-6 -14 2 -24 Z" fill="#86EFAC"/><path d="M${cx + 8} ${cy + 10} q16 -6 24 6 q2 14 -10 18 q-14 -2 -14 -24 Z" fill="#86EFAC"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.36}" fill="none" stroke="${PAPER}" stroke-width="2" opacity="0.7"/><path d="M${cx + r + 8} ${cy - r + 4} A${r + 12} ${r + 12} 0 0 1 ${cx + r + 8} ${cy + r - 4}" fill="none" stroke="${NAVY}" stroke-width="4"/>`;
}

function mapSheet(x: number, y: number): string {
  return `<path d="M${x} ${y + 8} l50 -8 l50 8 l50 -8 v104 l-50 8 l-50 -8 l-50 8 Z" fill="${PAPER}" stroke="${LINE}" stroke-width="2"/><path d="M${x + 50} ${y} v104 M${x + 100} ${y + 8} v104" stroke="${LINE}" stroke-width="2"/><path d="M${x + 14} ${y + 70} q30 -40 60 -10 t62 -24" fill="none" stroke="${BLUE}" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"/><path d="M${x + 118} ${y + 20} a14 14 0 0 1 14 14 c0 12 -14 26 -14 26 s-14 -14 -14 -26 a14 14 0 0 1 14 -14 Z" fill="${BLUE}"/><circle cx="${x + 118}" cy="${y + 34}" r="5" fill="${PAPER}"/>`;
}

function laptop(x: number, y: number): string {
  return `<rect x="${x}" y="${y}" width="150" height="96" rx="8" fill="${NAVY}"/><rect x="${x + 8}" y="${y + 8}" width="134" height="80" rx="3" fill="#0F1E3A"/><text x="${x + 22}" y="${y + 58}" font-family="monospace" font-size="38" font-weight="700" fill="${SKY}">&lt;/&gt;</text><rect x="${x + 96}" y="${y + 24}" width="34" height="5" rx="2" fill="${BLUE}"/><rect x="${x + 96}" y="${y + 36}" width="24" height="5" rx="2" fill="#86EFAC"/><rect x="${x + 96}" y="${y + 48}" width="30" height="5" rx="2" fill="${AMBER}"/><path d="M${x - 16} ${y + 96} h182 l-8 12 h-166 Z" fill="#94A3B8"/>`;
}

function manuscript(x: number, y: number, w = 150, h = 112): string {
  let cells = "";
  for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) cells += `<rect x="${x + 10 + c * 15}" y="${y + 12 + r * 16}" width="13" height="13" fill="none" stroke="#FCA5A5" stroke-width="1.2"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${PAPER}" stroke="${LINE}" stroke-width="2"/>${cells}<rect x="${x + 11}" y="${y + 13}" width="11" height="11" fill="${NAVY}" opacity="0.18"/><rect x="${x + 26}" y="${y + 13}" width="11" height="11" fill="${NAVY}" opacity="0.18"/>`;
}

function fountainPen(x: number, y: number, angle = -30): string {
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect width="100" height="14" rx="7" fill="${NAVY}"/><rect x="70" y="-2" width="4" height="18" fill="${AMBER}"/><polygon points="0,1 -22,7 0,13" fill="#CBD5E1"/><line x1="-20" y1="7" x2="-4" y2="7" stroke="${NAVY}" stroke-width="1.5"/></g>`;
}

function diploma(x: number, y: number): string {
  return `<rect x="${x}" y="${y}" width="150" height="104" rx="4" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/><rect x="${x + 8}" y="${y + 8}" width="134" height="88" rx="2" fill="none" stroke="${SKY}" stroke-width="2"/><rect x="${x + 36}" y="${y + 22}" width="78" height="8" rx="3" fill="${NAVY}"/><rect x="${x + 24}" y="${y + 42}" width="102" height="5" rx="2" fill="${LINE}"/><rect x="${x + 24}" y="${y + 54}" width="88" height="5" rx="2" fill="${LINE}"/><circle cx="${x + 120}" cy="${y + 82}" r="14" fill="${AMBER}"/><path d="M${x + 112} ${y + 92} l-6 18 l10 -5 l6 9 l4 -18" fill="${BLUE}"/>`;
}

function calendar(x: number, y: number): string {
  let cells = "";
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const hit = (r === 2 && c === 3) || (r === 1 && c === 1);
      cells += `<rect x="${x + 10 + c * 22}" y="${y + 34 + r * 18}" width="18" height="14" rx="2" fill="${hit ? BLUE : PALE}"/>`;
    }
  return `<rect x="${x}" y="${y}" width="150" height="112" rx="8" fill="${PAPER}" stroke="${LINE}" stroke-width="2"/><rect x="${x}" y="${y}" width="150" height="26" rx="8" fill="${NAVY}"/><rect x="${x}" y="${y + 16}" width="150" height="10" fill="${NAVY}"/><rect x="${x + 30}" y="${y - 8}" width="8" height="18" rx="3" fill="#94A3B8"/><rect x="${x + 112}" y="${y - 8}" width="8" height="18" rx="3" fill="#94A3B8"/>${cells}<path d="M${x + 76} ${y + 74} l6 6 l12 -14" fill="none" stroke="${PAPER}" stroke-width="3" stroke-linecap="round"/>`;
}

function checklist(x: number, y: number): string {
  const rows = [0, 1, 2, 3]
    .map(
      (i) =>
        `<rect x="${x + 14}" y="${y + 20 + i * 22}" width="12" height="12" rx="2" fill="none" stroke="${NAVY}" stroke-width="2"/>` +
        (i < 3 ? `<path d="M${x + 16} ${y + 26 + i * 22} l3 4 l6 -8" fill="none" stroke="${BLUE}" stroke-width="2.5" stroke-linecap="round"/>` : "") +
        `<rect x="${x + 34}" y="${y + 23 + i * 22}" width="${70 - i * 8}" height="6" rx="3" fill="${LINE}"/>`
    )
    .join("");
  return `<rect x="${x}" y="${y}" width="120" height="112" rx="6" fill="${PAPER}" stroke="${LINE}" stroke-width="2"/><rect x="${x + 40}" y="${y - 6}" width="40" height="12" rx="4" fill="#94A3B8"/>${rows}`;
}

function lamp(x: number, y: number): string {
  return `<rect x="${x - 26}" y="${y + 112}" width="52" height="10" rx="4" fill="${NAVY}"/><path d="M${x} ${y + 112} L${x - 22} ${y + 50} L${x + 18} ${y + 16}" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x + 6} ${y + 4} l40 6 l-8 30 Z" fill="${BLUE}"/><path d="M${x + 42} ${y + 14} l-10 22 l40 50 l8 -60 Z" fill="#FEF3C7" opacity="0.7"/>`;
}

function crayons(x: number, y: number): string {
  const colors = ["#EF4444", AMBER, "#22C55E", BLUE, "#A855F7"];
  return colors
    .map(
      (c, i) =>
        `<g transform="translate(${x + i * 18} ${y}) rotate(${-6 + i * 3})"><rect width="13" height="62" rx="2" fill="${c}"/><polygon points="0,0 6.5,-14 13,0" fill="${c}" opacity="0.8"/><rect y="18" width="13" height="10" fill="${PAPER}" opacity="0.5"/></g>`
    )
    .join("");
}

function highlighter(x: number, y: number, angle = -12): string {
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect width="84" height="20" rx="5" fill="#FDE047"/><rect x="62" width="22" height="20" rx="4" fill="#CA8A04"/><polygon points="0,4 -12,8 -12,14 0,16" fill="#FACC15"/></g>`;
}

function schoolBuilding(x: number, y: number): string {
  const windows = [0, 1, 2, 3]
    .map((i) => `<rect x="${x + 14 + i * 34}" y="${y + 40}" width="20" height="18" rx="2" fill="${SKY}"/><rect x="${x + 14 + i * 34}" y="${y + 70}" width="20" height="18" rx="2" fill="${SKY}"/>`)
    .join("");
  return `<rect x="${x}" y="${y + 26}" width="148" height="86" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/><polygon points="${x - 6},${y + 28} ${x + 74},${y} ${x + 154},${y + 28}" fill="${NAVY}"/><circle cx="${x + 74}" cy="${y + 16}" r="7" fill="${PAPER}"/><line x1="${x + 74}" y1="${y + 12}" x2="${x + 74}" y2="${y + 16}" stroke="${NAVY}" stroke-width="1.5"/>${windows}<rect x="${x + 62}" y="${y + 86}" width="24" height="26" fill="${BLUE}"/>`;
}

function stack(x: number, y: number): string {
  return closedBook(x, y + 48, 150, 22, NAVY) + closedBook(x + 10, y + 26, 132, 22, BLUE) + closedBook(x + 4, y + 4, 140, 22, "#0EA5E9");
}

function speechBubble(x: number, y: number, label: string): string {
  return `<path d="M${x} ${y} h64 a10 10 0 0 1 10 10 v30 a10 10 0 0 1 -10 10 h-40 l-12 12 v-12 h-12 a10 10 0 0 1 -10 -10 v-30 a10 10 0 0 1 10 -10 Z" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/><text x="${x + 27}" y="${y + 33}" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="700" fill="${BLUE}">${label}</text>`;
}

const MOTIFS: Record<ThumbnailMotif, () => string> = {
  korean: () => desk() + openBook(190, 84, 170, 78) + pencil(300, 176, 90, -10),
  english: () => desk() + notebook(130, 56, 120, 108) + speechBubble(270, 34, "Aa") + pencil(70, 160, 80, -8, BLUE),
  math: () => desk() + notebook(110, 48, 150, 116, true) + ruler(56, 176, 150, -6) + pencil(270, 168, 100, -24),
  social: () => desk() + mapSheet(70, 52) + globe(300, 82, 44),
  science: () => desk() + flask(170, 52) + notebook(240, 92, 100, 72, true, NAVY),
  coding: () => desk() + laptop(130, 64) + pencil(300, 176, 70, -12, BLUE),
  nonsul: () => desk() + manuscript(110, 50) + fountainPen(300, 120),
  ged: () => desk() + diploma(80, 56) + stack(240, 98),
  "korean-language": () => desk() + openBook(170, 84, 150, 76) + speechBubble(290, 30, "가"),
  elementary: () => desk() + notebook(90, 64, 120, 100) + crayons(240, 100),
  middle: () => desk() + closedBook(100, 74, 120, 94, NAVY) + highlighter(240, 140) + closedBook(240, 90, 90, 18, BLUE),
  high: () => desk() + stack(70, 98) + lamp(300, 46),
  guide: () => desk() + openBook(150, 90, 150, 70) + checklist(270, 52),
  strategy: () => desk() + checklist(90, 52) + notebook(240, 66, 100, 96) + pencil(220, 176, 70, -10),
  exam: () => desk() + calendar(90, 52) + pencil(270, 160, 100, -30),
  region: () => desk() + mapSheet(124, 50),
  school: () => desk() + schoolBuilding(126, 50),
};

/** Inner SVG markup (no outer <svg>) for a motif, in the 400×210 coordinate space. */
export function thumbnailMarkup(motif: ThumbnailMotif): string {
  return MOTIFS[motif]();
}

export const thumbnailMotifs = Object.keys(MOTIFS) as ThumbnailMotif[];

/** Public path of the generated OG PNG for a motif (exists only after scripts/generate-og-images.ts ran). */
export function ogImagePath(motif: ThumbnailMotif): string {
  return `/assets/og/${motif}.png`;
}

const guideCategoryMotif: Record<string, ThumbnailMotif> = {
  "elementary-study": "elementary",
  "middle-naeshin": "middle",
  "high-naeshin": "high",
  suneung: "exam",
  "korean-study": "korean",
  "english-study": "english",
  "math-study": "math",
  "social-study": "social",
  "science-study": "science",
  "study-strategy": "strategy",
  "exam-prep": "exam",
  "nonsul-study": "nonsul",
  "coding-study": "coding",
  "ged-study": "ged",
};

export function motifForGuideCategory(categorySlug: string): ThumbnailMotif {
  return guideCategoryMotif[categorySlug] ?? "guide";
}

const slugMotifs = new Set<string>(thumbnailMotifs);

/** Subject / program / grade slug → motif (falls back to the generic study-guide motif). */
export function motifForSlug(slug: string): ThumbnailMotif {
  return slugMotifs.has(slug) ? (slug as ThumbnailMotif) : "guide";
}
