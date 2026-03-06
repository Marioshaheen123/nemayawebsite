"use client";

import { useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ScrollArrows from "@/components/admin/ScrollArrows";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="flex h-screen bg-[#f4f5fa] font-[family-name:var(--font-poppins)]" dir="ltr" lang="en">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <ScrollArrows containerRef={mainRef} />
      </div>
    </div>
  );
}
