import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "kakao";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-blue-700",
  secondary: "bg-navy text-white hover:bg-[#0f2140]",
  outline: "bg-white text-navy border border-border-subtle hover:bg-brand-light",
  kakao: "bg-[#FEE500] text-[#191919] hover:brightness-95",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

interface PrimaryButtonProps {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  type?: ComponentPropsWithoutRef<"button">["type"];
  onClick?: () => void;
}

export default function PrimaryButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type,
  onClick,
}: PrimaryButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
