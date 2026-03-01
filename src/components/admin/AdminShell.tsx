"use client";

import { useAdminLang } from "@/context/AdminLanguageContext";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { adminLang } = useAdminLang();
  return (
    <div dir={adminLang === "ar" ? "rtl" : "ltr"} className="flex h-screen bg-gray-50">
      {children}
    </div>
  );
}
