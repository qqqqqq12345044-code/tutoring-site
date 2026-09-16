"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { mainNav, isNavGroup } from "@/data/nav";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The panel is portaled to the end of <body>, so it isn't next in tab
  // order after the trigger button. Move focus into it on open (and back to
  // the trigger on close) so keyboard users land in the visible menu instead
  // of hidden page content, and let Escape close it like other overlays.
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const panel = open && (
    <div
      ref={panelRef}
      tabIndex={-1}
      className="fixed left-0 right-0 bottom-0 top-16 z-40 bg-white overflow-y-auto outline-none"
    >
      <nav aria-label="모바일 메뉴" className="container-page py-6 flex flex-col gap-1">
        {mainNav.map((item) => (
          <div key={item.label} className="border-b border-border-subtle py-1">
            {isNavGroup(item) ? (
              <>
                <button
                  type="button"
                  aria-expanded={openGroup === item.label}
                  onClick={() =>
                    setOpenGroup((cur) => (cur === item.label ? null : item.label))
                  }
                  className="flex items-center justify-between w-full py-3 text-base font-semibold text-navy"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openGroup === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openGroup === item.label && (
                  <div className="flex flex-col gap-1 pb-3 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="py-2 text-sm text-text-muted hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold text-navy"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
        <Link
          href="/consult"
          onClick={() => setOpen(false)}
          className="mt-4 flex items-center justify-center rounded-full bg-brand text-white font-semibold py-3.5"
        >
          무료 상담 신청하기
        </Link>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-navy hover:bg-brand-light transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {panel && typeof document !== "undefined" ? createPortal(panel, document.body) : null}
    </div>
  );
}
