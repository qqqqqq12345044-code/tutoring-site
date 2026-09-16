# Brand assets (교과설계소)

Drop the final brand files in here using these exact names. Each one is
already wired up in code (see `src/config/site.ts` → `siteConfig.brand`,
consumed via `publicAssetExists()` in `src/lib/brand.ts`) — no code changes
needed to activate them, just add the file.

**Status: v1 populated.** All five files below now exist — a first-pass
"ㄱㄱ" geometric mark (two rotated corner brackets, Navy #142B52 + Blue
#2563EB). To replace with a different final design, overwrite the file in
place; no code changes are needed either way.

| File                    | Used in                                              | Notes |
| ------------------------ | ----------------------------------------------------- | ----- |
| `logo-symbol.svg`        | Header logo mark                                      | Square/round mark, replaces the `GraduationCap` icon fallback. Recommend a square SVG (viewbox 1:1), transparent background. |
| `logo-horizontal.svg`    | Footer brand block                                    | Wide lockup (mark + wordmark), dark text — built for a white background. Footer renders it on the navy background, so it's wrapped in a small white chip (`Footer.tsx`); keep that wrapper if this file stays dark-on-transparent. |
| `favicon.svg`            | Browser tab icon (in addition to `src/app/favicon.ico`) | Square SVG, simple shapes only (favicons render tiny). |
| `apple-touch-icon.png`   | iOS home-screen icon                                  | 180x180px PNG, no transparency (iOS ignores alpha), safe-area padding. |
| `og-default.png`         | Default Open Graph / social share image                | 1200x630px PNG. |

Until a file exists at its path, the site falls back to the current
icon+text treatment — nothing breaks, nothing needs to be toggled.

`src/app/favicon.ico` is the guaranteed baseline favicon and is left as-is;
`favicon.svg` here is additive and only used once present.
