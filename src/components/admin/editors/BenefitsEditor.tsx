"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import ArrayEditor from "../ui/ArrayEditor";
import SaveButton from "../ui/SaveButton";

interface BenefitsData {
  features: { en: { title: string; description: string }[]; ar: { title: string; description: string }[] };
  heading: { en: { before: string; bold: string }; ar: { before: string; bold: string } };
  ctaText: { en: string; ar: string };
  badge: { label: string; labelAr: string };
  images: { phone: string; centerLogo: string };
}

export default function BenefitsEditor({ initialData }: { initialData: BenefitsData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/benefits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }, [data]);

  // Combine en/ar feature arrays into paired items for editing
  const pairedFeatures = data.features.en.map((f, i) => ({
    titleEn: f.title,
    titleAr: data.features.ar[i]?.title || "",
    descEn: f.description,
    descAr: data.features.ar[i]?.description || "",
  }));

  const updateFeatures = (items: typeof pairedFeatures) => {
    setData((p) => ({
      ...p,
      features: {
        en: items.map((i) => ({ title: i.titleEn, description: i.descEn })),
        ar: items.map((i) => ({ title: i.titleAr, description: i.descAr })),
      },
    }));
  };

  return (
    <div className="space-y-5">
      <BilingualInput
        label="Section Heading (before bold)"
        valueEn={data.heading.en?.before || ""}
        valueAr={data.heading.ar?.before || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, before: v } } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, before: v } } }))}
      />
      <BilingualInput
        label="Section Heading (bold part)"
        valueEn={data.heading.en?.bold || ""}
        valueAr={data.heading.ar?.bold || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, bold: v } } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, bold: v } } }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (EN)</label>
          <input
            value={data.badge.label}
            onChange={(e) => setData((p) => ({ ...p, badge: { ...p.badge, label: e.target.value } }))}
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (AR)</label>
          <input
            value={data.badge.labelAr}
            onChange={(e) => setData((p) => ({ ...p, badge: { ...p.badge, labelAr: e.target.value } }))}
            dir="rtl"
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>
      <BilingualInput
        label="CTA Button Text"
        valueEn={typeof data.ctaText === "object" ? (data.ctaText as { en: string }).en || "" : ""}
        valueAr={typeof data.ctaText === "object" ? (data.ctaText as { ar: string }).ar || "" : ""}
        onChangeEn={(v) => setData((p) => ({ ...p, ctaText: { ...p.ctaText, en: v } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, ctaText: { ...p.ctaText, ar: v } }))}
      />

      <ArrayEditor
        label="Benefit Features"
        items={pairedFeatures}
        onUpdate={updateFeatures}
        createItem={() => ({ titleEn: "", titleAr: "", descEn: "", descAr: "" })}
        addLabel="Add Feature"
        renderItem={(item, _i, onChange) => (
          <div className="space-y-3">
            <BilingualInput
              label="Title"
              valueEn={item.titleEn}
              valueAr={item.titleAr}
              onChangeEn={(v) => onChange({ ...item, titleEn: v })}
              onChangeAr={(v) => onChange({ ...item, titleAr: v })}
            />
            <BilingualTextarea
              label="Description"
              valueEn={item.descEn}
              valueAr={item.descAr}
              onChangeEn={(v) => onChange({ ...item, descEn: v })}
              onChangeAr={(v) => onChange({ ...item, descAr: v })}
              rows={2}
            />
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <ImageUploader
          label="Phone Image"
          currentImage={data.images.phone}
          onUpload={(url) => setData((p) => ({ ...p, images: { ...p.images, phone: url } }))}
        />
        <ImageUploader
          label="Center Logo"
          currentImage={data.images.centerLogo}
          onUpload={(url) => setData((p) => ({ ...p, images: { ...p.images, centerLogo: url } }))}
        />
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
