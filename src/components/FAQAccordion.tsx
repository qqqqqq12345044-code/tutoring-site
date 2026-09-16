"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/faqs";

export default function FAQAccordion({ items }: { items: FAQ[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(items[0]?.slug ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openSlug === item.slug;
        return (
          <div
            key={item.slug}
            className="rounded-2xl border border-border-subtle bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : item.slug)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.slug}`}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm md:text-base font-semibold text-navy">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-text-muted transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${item.slug}`}
                className="px-5 pb-4 text-sm text-text-muted leading-relaxed"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
