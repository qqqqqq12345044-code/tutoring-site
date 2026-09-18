import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface RelatedLink {
  label: string;
  href: string;
}

export default function RelatedLinks({
  title = "관련 페이지",
  links,
}: {
  title?: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-6">
      {title && <p className="text-sm font-bold text-navy">{title}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3.5 py-2 text-sm text-text-main transition-all duration-200 ease-out hover:border-brand hover:text-brand hover:shadow-sm motion-reduce:transition-none"
          >
            {link.label}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
