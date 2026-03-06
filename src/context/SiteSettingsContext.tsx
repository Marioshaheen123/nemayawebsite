"use client";

import { createContext, useContext, ReactNode } from "react";

interface SiteSettings {
  accentColor: string;
  accentColorDark: string;
  mainLogo: string;
  smallLogo: string;
}

const DEFAULTS: SiteSettings = {
  accentColor: "#057e33",
  accentColorDark: "#046b2b",
  mainLogo: "/images/nemayalogo.png",
  smallLogo: "/images/small logo.png",
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULTS);

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: Partial<SiteSettings>;
  children: ReactNode;
}) {
  const settings = { ...DEFAULTS, ...initialSettings };
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
