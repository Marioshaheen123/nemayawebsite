"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

export default function AboutHeroEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setEn = (key: string, val: string) =>
    setData((p: any) => ({ ...p, heroContent: { ...p.heroContent, en: { ...p.heroContent.en, [key]: val } } }));
  const setAr = (key: string, val: string) =>
    setData((p: any) => ({ ...p, heroContent: { ...p.heroContent, ar: { ...p.heroContent.ar, [key]: val } } }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  return (
    <div className="space-y-5">
      <BilingualInput
        label="Title (first part)"
        valueEn={data.heroContent.en.title1 || ""}
        valueAr={data.heroContent.ar.title1 || ""}
        onChangeEn={(v) => setEn("title1", v)}
        onChangeAr={(v) => setAr("title1", v)}
      />
      <BilingualInput
        label="Title (highlighted / italic part)"
        valueEn={data.heroContent.en.title2 || ""}
        valueAr={data.heroContent.ar.title2 || ""}
        onChangeEn={(v) => setEn("title2", v)}
        onChangeAr={(v) => setAr("title2", v)}
      />
      <BilingualTextarea
        label="Subtitle"
        valueEn={data.heroContent.en.subtitle || ""}
        valueAr={data.heroContent.ar.subtitle || ""}
        onChangeEn={(v) => setEn("subtitle", v)}
        onChangeAr={(v) => setAr("subtitle", v)}
      />
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
