import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const full = [{ name: "홈", href: "/" }, ...items];

  return (
    <nav aria-label="breadcrumb" className="text-sm text-text-muted">
      <JsonLd data={breadcrumbSchema(full.map((i) => ({ name: i.name, url: i.href })))} />
      <ol className="flex flex-wrap items-center gap-1">
        {full.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />}
            {index === full.length - 1 ? (
              <span className="text-text-main font-medium">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand transition-colors">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
