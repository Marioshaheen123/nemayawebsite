"use client";

import { useState, useEffect, type ReactNode } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface SectionPageWrapperProps {
  endpoint: string;
  basePath?: string;
  children: (data: any) => ReactNode;
}

export default function SectionPageWrapper({ endpoint, basePath = "/api/admin/homepage", children }: SectionPageWrapperProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = endpoint ? `${basePath}/${endpoint}` : basePath;
    adminFetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [endpoint, basePath]);

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-8 text-center">
        <p className="text-[14px] text-red-500">Failed to load section data. Please refresh the page.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-8 flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-[13px] text-[#6b7280]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      {children(data)}
    </div>
  );
}
