"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a section in a fade-up-on-scroll-into-view effect (see .fade-up in
 * globals.css). Observes once and disconnects after the first reveal —
 * no repeated re-triggering while scrolling, kept cheap on mobile.
 */
export default function FadeIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Starts false on both server and client render (no typeof-window branch
  // in the initial value) so hydration never mismatches; the real reveal
  // only ever happens client-side, asynchronously, from the observer callback.
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-up ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
