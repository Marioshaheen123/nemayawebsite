"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

export default function AboutVisionEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setCard = (lang: "en" | "ar", index: number, key: string, val: string) =>
    setData((p: any) => {
      const cards = [...p.cards[lang]];
      cards[index] = { ...cards[index], [key]: val };
      return { ...p, cards: { ...p.cards, [lang]: cards } };
    });

  const setImage = (index: number, url: string) =>
    setData((p: any) => {
      const images = [...p.images];
      images[index] = url;
      return { ...p, images };
    });

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/vision", {
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

      {/* Title */}
      <BilingualTextarea label="Vision Title" valueEn={data.title.en || ""} valueAr={data.title.ar || ""} onChangeEn={(v) => setData((p: any) => ({ ...p, title: { ...p.title, en: v } }))} onChangeAr={(v) => setData((p: any) => ({ ...p, title: { ...p.title, ar: v } }))} />

      {/* 4 Vision Cards */}
      {(data.cards.en || []).map((_: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3">
          <div className="text-[11px] text-[#a0a5af] font-medium">Card #{i + 1}</div>
          <BilingualInput label="Title" valueEn={data.cards.en[i]?.title || ""} valueAr={data.cards.ar[i]?.title || ""} onChangeEn={(v) => setCard("en", i, "title", v)} onChangeAr={(v) => setCard("ar", i, "title", v)} />
          <BilingualTextarea label="Description" valueEn={data.cards.en[i]?.desc || ""} valueAr={data.cards.ar[i]?.desc || ""} onChangeEn={(v) => setCard("en", i, "desc", v)} onChangeAr={(v) => setCard("ar", i, "desc", v)} />
          <ImageUploader label={`Card ${i + 1} Image`} currentImage={data.images[i] || ""} onUpload={(url) => setImage(i, url)} />
        </div>
      ))}

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
