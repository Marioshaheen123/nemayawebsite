"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type AdminLang = "en" | "ar";

interface AdminLanguageContextValue {
  adminLang: AdminLang;
  toggleAdminLang: () => void;
  setAdminLang: (lang: AdminLang) => void;
}

const AdminLanguageContext = createContext<AdminLanguageContextValue>({
  adminLang: "en",
  toggleAdminLang: () => {},
  setAdminLang: () => {},
});

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [adminLang, setAdminLang] = useState<AdminLang>("en");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin-lang");
    if (stored === "en" || stored === "ar") {
      setAdminLang(stored);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("admin-lang", adminLang);
  }, [adminLang]);

  const toggleAdminLang = () => {
    setAdminLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <AdminLanguageContext.Provider value={{ adminLang, toggleAdminLang, setAdminLang }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLang() {
  return useContext(AdminLanguageContext);
}
