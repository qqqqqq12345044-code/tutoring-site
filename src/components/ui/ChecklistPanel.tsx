import { Check } from "lucide-react";

export default function ChecklistPanel({
  items,
  columns = 2,
}: {
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-6 md:p-8">
      <ul className={`grid gap-x-8 gap-y-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-light text-brand shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </span>
            <p className="text-[15px] md:text-base text-text-main leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
