"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import SaveButton from "../ui/SaveButton";

export default function AboutBlogSectionEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/blog-section", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  return (
    <div className="space-y-5">
      {/* Badge */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (English)</label>
          <input type="text" value={data.badge.label || ""} onChange={(e) => setData((p: any) => ({ ...p, badge: { ...p.badge, label: e.target.value } }))} className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (Arabic)</label>
          <input type="text" value={data.badge.labelAr || ""} onChange={(e) => setData((p: any) => ({ ...p, badge: { ...p.badge, labelAr: e.target.value } }))} dir="rtl" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
        </div>
      </div>

      {/* Heading */}
      <BilingualInput label="Heading (before bold)" valueEn={data.heading.en.before || ""} valueAr={data.heading.ar.before || ""} onChangeEn={(v) => setData((p: any) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, before: v } } }))} onChangeAr={(v) => setData((p: any) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, before: v } } }))} />
      <BilingualInput label="Heading (bold part)" valueEn={data.heading.en.bold || ""} valueAr={data.heading.ar.bold || ""} onChangeEn={(v) => setData((p: any) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, bold: v } } }))} onChangeAr={(v) => setData((p: any) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, bold: v } } }))} />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
