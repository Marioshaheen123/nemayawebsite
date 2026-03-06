"use client";

import { useState, useEffect, useCallback } from "react";

export default function ScrollArrows({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);

  const check = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanUp(el.scrollTop > 100);
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 100);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
  }, [containerRef, check]);

  const scroll = (dir: "up" | "down") => {
    containerRef.current?.scrollTo({
      top: dir === "up" ? 0 : containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!canUp && !canDown) return null;

  return (
    <div className="fixed bottom-6 right-8 flex flex-col gap-2 z-50">
      {canUp && (
        <button
          onClick={() => scroll("up")}
          className="w-10 h-10 rounded-full bg-white border border-[#e8ecf1] shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#f4f5fa] hover:border-accent/30 transition-all"
          aria-label="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
      {canDown && (
        <button
          onClick={() => scroll("down")}
          className="w-10 h-10 rounded-full bg-white border border-[#e8ecf1] shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#f4f5fa] hover:border-accent/30 transition-all"
          aria-label="Scroll to bottom"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
}
