"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

export default function AboutValuesEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setHeading = (lang: "en" | "ar", key: string, val: string) =>
    setData((p: any) => ({ ...p, heading: { ...p.heading, [lang]: { ...p.heading[lang], [key]: val } } }));

  const setValue = (lang: "en" | "ar", index: number, key: string, val: string) =>
    setData((p: any) => {
      const values = [...p.values[lang]];
      values[index] = { ...values[index], [key]: val };
      return { ...p, values: { ...p.values, [lang]: values } };
    });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/values", {
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

      {/* Heading (4 parts) */}
      <BilingualInput label="Heading part 1" valueEn={data.heading.en.part1 || ""} valueAr={data.heading.ar.part1 || ""} onChangeEn={(v) => setHeading("en", "part1", v)} onChangeAr={(v) => setHeading("ar", "part1", v)} />
      <BilingualInput label="Heading bold 1" valueEn={data.heading.en.bold1 || ""} valueAr={data.heading.ar.bold1 || ""} onChangeEn={(v) => setHeading("en", "bold1", v)} onChangeAr={(v) => setHeading("ar", "bold1", v)} />
      <BilingualInput label="Heading part 2" valueEn={data.heading.en.part2 || ""} valueAr={data.heading.ar.part2 || ""} onChangeEn={(v) => setHeading("en", "part2", v)} onChangeAr={(v) => setHeading("ar", "part2", v)} />
      <BilingualInput label="Heading bold 2" valueEn={data.heading.en.bold2 || ""} valueAr={data.heading.ar.bold2 || ""} onChangeEn={(v) => setHeading("en", "bold2", v)} onChangeAr={(v) => setHeading("ar", "bold2", v)} />

      {/* Value Items */}
      <label className="text-[13px] font-medium text-[#2e263d] block">Values</label>
      {(data.values.en || []).map((_: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3">
          <div className="text-[11px] text-[#a0a5af] font-medium">Value #{i + 1}</div>
          <BilingualInput label="Label" valueEn={data.values.en[i]?.label || ""} valueAr={data.values.ar[i]?.label || ""} onChangeEn={(v) => setValue("en", i, "label", v)} onChangeAr={(v) => setValue("ar", i, "label", v)} />
          <BilingualTextarea label="Description" valueEn={data.values.en[i]?.desc || ""} valueAr={data.values.ar[i]?.desc || ""} onChangeEn={(v) => setValue("en", i, "desc", v)} onChangeAr={(v) => setValue("ar", i, "desc", v)} />
        </div>
      ))}

      {/* Background Image */}
      <ImageUploader label="Values Background Image" currentImage={data.image || ""} onUpload={(url) => setData((p: any) => ({ ...p, image: url }))} />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
