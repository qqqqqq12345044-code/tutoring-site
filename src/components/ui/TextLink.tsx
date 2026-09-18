import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 transition-colors duration-200 ease-out ${className}`}
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
