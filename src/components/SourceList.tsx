import type { ContentSource } from "@/data/sources";

/**
 * "참고 자료" block — the same markup the guide articles used inline before,
 * extracted so region pages can show their `sources` too. Renders nothing when
 * a page has no sources, so it is safe to drop in unconditionally.
 */
export default function SourceList({
  sources,
  title = "참고 자료",
  className = "",
}: {
  sources: readonly ContentSource[] | undefined;
  title?: string;
  className?: string;
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <aside className={`rounded-2xl border border-border-subtle bg-white p-5 ${className}`.trim()}>
      <p className="text-sm font-bold text-navy">{title}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {sources.map((src) => (
          <li key={src.url} className="text-sm text-text-muted break-words">
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand underline-offset-2 hover:underline">
              {src.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
