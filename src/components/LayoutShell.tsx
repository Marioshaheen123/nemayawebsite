"use client";

import { useEffect } from "react";
import { useLang } from "@/context/LanguageContext";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { lang, dir } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.style.fontFamily =
      lang === "ar"
        ? "var(--font-kufi-arabic), sans-serif"
        : "var(--font-poppins), sans-serif";
  }, [lang, dir]);

  return <>{children}</>;
}
