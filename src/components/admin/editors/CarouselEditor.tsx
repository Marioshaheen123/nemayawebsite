"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import ArrayEditor from "../ui/ArrayEditor";
import SaveButton from "../ui/SaveButton";

interface CarouselData {
  cards: { en: { image: string; title: string; description: string }[]; ar: { image: string; title: string; description: string }[] };
  heading: { en: { bold: string; rest: string }; ar: { bold: string; rest: string } };
  badge: { label: string; labelAr: string };
}

export default function CarouselEditor({ initialData }: { initialData: CarouselData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/carousel", {
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

  const pairedCards = data.cards.en.map((c, i) => ({
    image: c.image,
    titleEn: c.title,
    titleAr: data.cards.ar[i]?.title || "",
    descEn: c.description,
    descAr: data.cards.ar[i]?.description || "",
  }));

  const updateCards = (items: typeof pairedCards) => {
    setData((p) => ({
      ...p,
      cards: {
        en: items.map((i) => ({ image: i.image, title: i.titleEn, description: i.descEn })),
        ar: items.map((i) => ({ image: i.image, title: i.titleAr, description: i.descAr })),
      },
    }));
  };

  return (
    <div className="space-y-5">
      <BilingualInput
        label="Heading (bold part)"
        valueEn={data.heading.en?.bold || ""}
        valueAr={data.heading.ar?.bold || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, bold: v } } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, bold: v } } }))}
      />
      <BilingualInput
        label="Heading (rest)"
        valueEn={data.heading.en?.rest || ""}
        valueAr={data.heading.ar?.rest || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, heading: { ...p.heading, en: { ...p.heading.en, rest: v } } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, heading: { ...p.heading, ar: { ...p.heading.ar, rest: v } } }))}
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

      <ArrayEditor
        label="Carousel Cards"
        items={pairedCards}
        onUpdate={updateCards}
        createItem={() => ({ image: "", titleEn: "", titleAr: "", descEn: "", descAr: "" })}
        addLabel="Add Card"
        renderItem={(item, _i, onChange) => (
          <div className="space-y-3">
            <ImageUploader
              label="Card Image"
              currentImage={item.image}
              onUpload={(url) => onChange({ ...item, image: url })}
            />
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

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
