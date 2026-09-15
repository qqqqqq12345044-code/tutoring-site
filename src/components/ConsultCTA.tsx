import PrimaryButton from "@/components/ui/PrimaryButton";

interface ConsultCTAProps {
  title: string;
  description?: string;
  ctaLabel?: string;
}

export default function ConsultCTA({
  title,
  description,
  ctaLabel = "무료 상담받기",
}: ConsultCTAProps) {
  return (
    <div className="rounded-2xl bg-brand-light px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div>
        <p className="text-lg md:text-xl font-bold text-navy">{title}</p>
        {description && <p className="mt-1.5 text-sm text-text-muted">{description}</p>}
      </div>
      <PrimaryButton href="/consult" size="lg" className="shrink-0">
        {ctaLabel}
      </PrimaryButton>
    </div>
  );
}
