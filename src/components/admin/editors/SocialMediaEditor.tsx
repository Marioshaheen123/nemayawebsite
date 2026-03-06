"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

export default function SocialMediaEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setContent = (lang: "en" | "ar", key: string, val: any) =>
    setData((p: any) => ({ ...p, content: { ...p.content, [lang]: { ...p.content[lang], [key]: val } } }));

  const setChannel = (index: number, key: string, val: any) => {
    setData((p: any) => {
      const channels = [...p.channels];
      channels[index] = { ...channels[index], [key]: val };
      return { ...p, channels };
    });
  };

  const addChannel = () => {
    setData((p: any) => ({
      ...p,
      channels: [
        ...p.channels,
        { image: "", titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", ctaTextEn: "", ctaTextAr: "", ctaUrl: "" },
      ],
    }));
  };

  const removeChannel = (index: number) => {
    setData((p: any) => ({
      ...p,
      channels: p.channels.filter((_: any, i: number) => i !== index),
    }));
  };

  const moveChannel = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.channels.length) return;
    setData((p: any) => {
      const channels = [...p.channels];
      [channels[index], channels[newIndex]] = [channels[newIndex], channels[index]];
      return { ...p, channels };
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/social-media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Page Content */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2">Page Content</h3>

      <BilingualInput label="Hero Title" valueEn={data.content?.en?.heroTitle || ""} valueAr={data.content?.ar?.heroTitle || ""} onChangeEn={(v) => setContent("en", "heroTitle", v)} onChangeAr={(v) => setContent("ar", "heroTitle", v)} />

      <BilingualInput label="Section Heading" valueEn={data.content?.en?.sectionHeading || ""} valueAr={data.content?.ar?.sectionHeading || ""} onChangeEn={(v) => setContent("en", "sectionHeading", v)} onChangeAr={(v) => setContent("ar", "sectionHeading", v)} />

      <BilingualTextarea label="Section Description" valueEn={data.content?.en?.sectionDescription || ""} valueAr={data.content?.ar?.sectionDescription || ""} onChangeEn={(v) => setContent("en", "sectionDescription", v)} onChangeAr={(v) => setContent("ar", "sectionDescription", v)} rows={3} />

      {/* Contact Section */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Contact Section</h3>

      <BilingualInput label="Contact Title" valueEn={data.content?.en?.contactTitle || ""} valueAr={data.content?.ar?.contactTitle || ""} onChangeEn={(v) => setContent("en", "contactTitle", v)} onChangeAr={(v) => setContent("ar", "contactTitle", v)} />

      <BilingualTextarea label="Contact Description" valueEn={data.content?.en?.contactDescription || ""} valueAr={data.content?.ar?.contactDescription || ""} onChangeEn={(v) => setContent("en", "contactDescription", v)} onChangeAr={(v) => setContent("ar", "contactDescription", v)} rows={2} />

      <BilingualInput label="Contact CTA Text" valueEn={data.content?.en?.contactCtaText || ""} valueAr={data.content?.ar?.contactCtaText || ""} onChangeEn={(v) => setContent("en", "contactCtaText", v)} onChangeAr={(v) => setContent("ar", "contactCtaText", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Contact CTA URL</label>
        <input type="text" value={data.content?.en?.contactCtaUrl || ""} onChange={(e) => { setContent("en", "contactCtaUrl", e.target.value); setContent("ar", "contactCtaUrl", e.target.value); }} placeholder="/contact" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      {/* Social Media Channels */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Social Media Channels</h3>

      {(data.channels || []).map((channel: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#a0a5af] font-medium">Channel #{i + 1}</div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveChannel(i, -1)} disabled={i === 0} className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              </button>
              <button type="button" onClick={() => moveChannel(i, 1)} disabled={i === data.channels.length - 1} className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <button type="button" onClick={() => removeChannel(i)} className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>

          <ImageUploader label="Channel Image" currentImage={channel.image || ""} onUpload={(url) => setChannel(i, "image", url)} />

          <BilingualInput label="Title" valueEn={channel.titleEn || ""} valueAr={channel.titleAr || ""} onChangeEn={(v) => setChannel(i, "titleEn", v)} onChangeAr={(v) => setChannel(i, "titleAr", v)} />

          <BilingualTextarea label="Description" valueEn={channel.descriptionEn || ""} valueAr={channel.descriptionAr || ""} onChangeEn={(v) => setChannel(i, "descriptionEn", v)} onChangeAr={(v) => setChannel(i, "descriptionAr", v)} rows={3} />

          <BilingualInput label="CTA Button Text" valueEn={channel.ctaTextEn || ""} valueAr={channel.ctaTextAr || ""} onChangeEn={(v) => setChannel(i, "ctaTextEn", v)} onChangeAr={(v) => setChannel(i, "ctaTextAr", v)} />

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">CTA URL</label>
            <input type="text" value={channel.ctaUrl || ""} onChange={(e) => setChannel(i, "ctaUrl", e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
          </div>
        </div>
      ))}

      <button type="button" onClick={addChannel} className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Channel
      </button>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
