"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

export default function TradingPlatformsEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setContent = (lang: "en" | "ar", key: string, val: any) =>
    setData((p: any) => ({ ...p, content: { ...p.content, [lang]: { ...p.content[lang], [key]: val } } }));

  const setFeature = (lang: "en" | "ar", index: number, val: string) => {
    const features = [...(data.content[lang].features || [])];
    features[index] = val;
    setContent(lang, "features", features);
  };

  const addFeature = () => {
    setContent("en", "features", [...(data.content.en.features || []), ""]);
    setContent("ar", "features", [...(data.content.ar.features || []), ""]);
  };

  const removeFeature = (index: number) => {
    setContent("en", "features", (data.content.en.features || []).filter((_: any, i: number) => i !== index));
    // Need to update AR separately since setContent uses stale state
    setData((p: any) => ({
      ...p,
      content: {
        ...p.content,
        en: { ...p.content.en, features: p.content.en.features.filter((_: any, i: number) => i !== index) },
        ar: { ...p.content.ar, features: p.content.ar.features.filter((_: any, i: number) => i !== index) },
      },
    }));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/trading-platforms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  const featuresEn = data.content?.en?.features || [];
  const featuresAr = data.content?.ar?.features || [];

  return (
    <div className="space-y-5">
      <BilingualInput label="Heading" valueEn={data.content?.en?.heading || ""} valueAr={data.content?.ar?.heading || ""} onChangeEn={(v) => setContent("en", "heading", v)} onChangeAr={(v) => setContent("ar", "heading", v)} />

      <BilingualTextarea label="Bold Paragraph" valueEn={data.content?.en?.boldParagraph || ""} valueAr={data.content?.ar?.boldParagraph || ""} onChangeEn={(v) => setContent("en", "boldParagraph", v)} onChangeAr={(v) => setContent("ar", "boldParagraph", v)} rows={3} />

      <BilingualTextarea label="Paragraph" valueEn={data.content?.en?.paragraph || ""} valueAr={data.content?.ar?.paragraph || ""} onChangeEn={(v) => setContent("en", "paragraph", v)} onChangeAr={(v) => setContent("ar", "paragraph", v)} rows={3} />

      <BilingualInput label="Why Title" valueEn={data.content?.en?.whyTitle || ""} valueAr={data.content?.ar?.whyTitle || ""} onChangeEn={(v) => setContent("en", "whyTitle", v)} onChangeAr={(v) => setContent("ar", "whyTitle", v)} />

      {/* Features */}
      <label className="text-[13px] font-medium text-[#2e263d] block">Features</label>
      {featuresEn.map((_: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3 relative">
          <button type="button" onClick={() => removeFeature(i)} className="absolute top-2 right-2 p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="text-[11px] text-[#a0a5af] font-medium">Feature #{i + 1}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#a0a5af] mb-1 block">English</span>
              <input type="text" value={featuresEn[i] || ""} onChange={(e) => setFeature("en", i, e.target.value)} className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
            <div>
              <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic</span>
              <input type="text" value={featuresAr[i] || ""} onChange={(e) => setFeature("ar", i, e.target.value)} dir="rtl" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addFeature} className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Feature
      </button>

      <BilingualTextarea label="Closing Bold Text" valueEn={data.content?.en?.closingBold || ""} valueAr={data.content?.ar?.closingBold || ""} onChangeEn={(v) => setContent("en", "closingBold", v)} onChangeAr={(v) => setContent("ar", "closingBold", v)} rows={2} />

      <BilingualInput label="CTA Button Text" valueEn={data.content?.en?.cta || ""} valueAr={data.content?.ar?.cta || ""} onChangeEn={(v) => setContent("en", "cta", v)} onChangeAr={(v) => setContent("ar", "cta", v)} />

      {/* CTA URL */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">CTA Button URL</label>
        <input type="text" value={data.content?.en?.ctaUrl || ""} onChange={(e) => { setContent("en", "ctaUrl", e.target.value); setContent("ar", "ctaUrl", e.target.value); }} placeholder="https://..." className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUploader label="Mockup Image" currentImage={data.mockupImage || ""} onUpload={(url) => setData((p: any) => ({ ...p, mockupImage: url }))} />
        <ImageUploader label="Check Icon" currentImage={data.checkIcon || ""} onUpload={(url) => setData((p: any) => ({ ...p, checkIcon: url }))} />
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
