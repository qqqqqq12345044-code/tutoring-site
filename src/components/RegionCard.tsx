import Link from "next/link";
import { MapPin } from "lucide-react";
import { getChildren, getRegionUrl, type RegionNode } from "@/data/regions";

export default function RegionCard({ region }: { region: RegionNode }) {
  const children = getChildren(region.slug).slice(0, 6);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-6">
      <Link
        href={getRegionUrl(region.slug)}
        className="flex items-center gap-2 text-base font-bold text-navy hover:text-brand transition-colors duration-200 ease-out"
      >
        <MapPin className="w-4 h-4 text-brand" />
        {region.name}
      </Link>
      {children.length > 0 && (
        <p className="mt-3 text-sm text-text-muted leading-relaxed">
          {children.map((child, i) => (
            <span key={child.slug}>
              <Link href={getRegionUrl(child.slug)} className="hover:text-brand transition-colors duration-200 ease-out">
                {child.name}
              </Link>
              {i < children.length - 1 && " / "}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
