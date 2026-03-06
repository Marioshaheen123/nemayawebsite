"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

interface HeroData {
  heroContent: {
    en: { headlineBefore: string; headlineHighlight: string; subtitle: string; cta: string };
    ar: { headlineBefore: string; headlineHighlight: string; subtitle: string; cta: string };
  };
  heroImages: { background: string; person: string };
}

export default function HeroEditor({ initialData }: { initialData: HeroData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setEn = (key: string, val: string) =>
    setData((p) => ({ ...p, heroContent: { ...p.heroContent, en: { ...p.heroContent.en, [key]: val } } }));
  const setAr = (key: string, val: string) =>
    setData((p) => ({ ...p, heroContent: { ...p.heroContent, ar: { ...p.heroContent.ar, [key]: val } } }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/hero", {
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

  return (
    <div className="space-y-5">
      <BilingualInput
        label="Headline (before highlight)"
        valueEn={data.heroContent.en.headlineBefore || ""}
        valueAr={data.heroContent.ar.headlineBefore || ""}
        onChangeEn={(v) => setEn("headlineBefore", v)}
        onChangeAr={(v) => setAr("headlineBefore", v)}
      />
      <BilingualInput
        label="Headline (highlighted word)"
        valueEn={data.heroContent.en.headlineHighlight || ""}
        valueAr={data.heroContent.ar.headlineHighlight || ""}
        onChangeEn={(v) => setEn("headlineHighlight", v)}
        onChangeAr={(v) => setAr("headlineHighlight", v)}
      />
      <BilingualTextarea
        label="Subtitle"
        valueEn={data.heroContent.en.subtitle || ""}
        valueAr={data.heroContent.ar.subtitle || ""}
        onChangeEn={(v) => setEn("subtitle", v)}
        onChangeAr={(v) => setAr("subtitle", v)}
      />
      <BilingualInput
        label="CTA Button Text"
        valueEn={data.heroContent.en.cta || ""}
        valueAr={data.heroContent.ar.cta || ""}
        onChangeEn={(v) => setEn("cta", v)}
        onChangeAr={(v) => setAr("cta", v)}
      />
      <div className="grid grid-cols-2 gap-4">
        <ImageUploader
          label="Background Image"
          currentImage={data.heroImages.background}
          onUpload={(url) => setData((p) => ({ ...p, heroImages: { ...p.heroImages, background: url } }))}
        />
        <ImageUploader
          label="Person Image"
          currentImage={data.heroImages.person}
          onUpload={(url) => setData((p) => ({ ...p, heroImages: { ...p.heroImages, person: url } }))}
        />
      </div>
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
