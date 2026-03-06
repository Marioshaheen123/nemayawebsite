"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

export default function AboutSecurityEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setContent = (lang: "en" | "ar", key: string, val: string) =>
    setData((p: any) => ({ ...p, content: { ...p.content, [lang]: { ...p.content[lang], [key]: val } } }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/security", {
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

      {/* Title parts */}
      <BilingualInput label="Title part 1" valueEn={data.content.en.title1 || ""} valueAr={data.content.ar.title1 || ""} onChangeEn={(v) => setContent("en", "title1", v)} onChangeAr={(v) => setContent("ar", "title1", v)} />
      <BilingualInput label="Title bold part" valueEn={data.content.en.title2 || ""} valueAr={data.content.ar.title2 || ""} onChangeEn={(v) => setContent("en", "title2", v)} onChangeAr={(v) => setContent("ar", "title2", v)} />
      <BilingualInput label="Title part 3" valueEn={data.content.en.title3 || ""} valueAr={data.content.ar.title3 || ""} onChangeEn={(v) => setContent("en", "title3", v)} onChangeAr={(v) => setContent("ar", "title3", v)} />

      {/* Paragraphs */}
      <BilingualTextarea label="Paragraph 1" valueEn={data.content.en.p1 || ""} valueAr={data.content.ar.p1 || ""} onChangeEn={(v) => setContent("en", "p1", v)} onChangeAr={(v) => setContent("ar", "p1", v)} rows={4} />
      <BilingualTextarea label="Paragraph 2" valueEn={data.content.en.p2 || ""} valueAr={data.content.ar.p2 || ""} onChangeEn={(v) => setContent("en", "p2", v)} onChangeAr={(v) => setContent("ar", "p2", v)} rows={4} />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
