"use client";

import { useEffect } from "react";

function lightenHex(hex: string, amount = 60): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function darkenHex(hex: string, amount = 25): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function AccentColorInjector() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const s = document.documentElement.style;

        // Gradient variables — the source of truth
        const gFrom = data.gradientFrom || "#0a7f35";
        const gVia = data.gradientVia || "#12a544";
        const gTo = data.gradientTo || "#3ec95e";
        s.setProperty("--gradient-from", gFrom);
        s.setProperty("--gradient-via", gVia);
        s.setProperty("--gradient-to", gTo);
        s.setProperty("--gradient-hover-from", data.gradientHoverFrom || darkenHex(gFrom));
        s.setProperty("--gradient-hover-via", data.gradientHoverVia || darkenHex(gVia));
        s.setProperty("--gradient-hover-to", data.gradientHoverTo || darkenHex(gTo));

        // Derive flat fallback colors from gradient (via = mid tone)
        s.setProperty("--color-primary", gVia);
        s.setProperty("--color-primary-dark", gFrom);
        s.setProperty("--color-primary-light", gTo);
        s.setProperty("--color-accent", gVia);
        s.setProperty("--color-accent-dark", gFrom);
      })
      .catch(() => {});
  }, []);

  return null;
}
