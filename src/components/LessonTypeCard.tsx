import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface LessonTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
}

export default function LessonTypeCard({
  icon: Icon,
  title,
  description,
  benefits,
  ctaLabel,
  ctaHref,
}: LessonTypeCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-white p-7 md:p-8">
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand">
        <Icon className="w-6 h-6" />
      </span>
      <div>
        <h3 className="text-xl font-bold text-navy">{title}</h3>
        <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{description}</p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-text-main">
            <Check className="w-4 h-4 text-brand mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      <PrimaryButton href={ctaHref} variant="outline" className="mt-2 w-full">
        {ctaLabel}
      </PrimaryButton>
    </div>
  );
}
