import FadeIn from "./FadeIn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <FadeIn className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-bold tracking-widest text-brand uppercase">{eyebrow}</span>
      )}
      <h2 className="text-2xl md:text-[2.15rem] font-extrabold text-navy whitespace-pre-line leading-[1.3] md:leading-[1.25] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-[15px] md:text-lg max-w-2xl whitespace-pre-line leading-relaxed">
          {description}
        </p>
      )}
    </FadeIn>
  );
}
