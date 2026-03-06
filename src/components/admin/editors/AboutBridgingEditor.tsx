"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

export default function AboutBridgingEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setContent = (lang: "en" | "ar", key: string, val: string) =>
    setData((p: any) => ({ ...p, content: { ...p.content, [lang]: { ...p.content[lang], [key]: val } } }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/bridging", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  return (
    <div className="space-y-5">
      {/* Title */}
      <BilingualInput label="Title" valueEn={data.content.en.title || ""} valueAr={data.content.ar.title || ""} onChangeEn={(v) => setContent("en", "title", v)} onChangeAr={(v) => setContent("ar", "title", v)} />

      {/* Paragraphs */}
      <BilingualTextarea label="Paragraph 1" valueEn={data.content.en.p1 || ""} valueAr={data.content.ar.p1 || ""} onChangeEn={(v) => setContent("en", "p1", v)} onChangeAr={(v) => setContent("ar", "p1", v)} rows={4} />
      <BilingualTextarea label="Paragraph 2" valueEn={data.content.en.p2 || ""} valueAr={data.content.ar.p2 || ""} onChangeEn={(v) => setContent("en", "p2", v)} onChangeAr={(v) => setContent("ar", "p2", v)} rows={4} />

      {/* CTA */}
      <BilingualInput label="CTA Button Text" valueEn={data.content.en.cta || ""} valueAr={data.content.ar.cta || ""} onChangeEn={(v) => setContent("en", "cta", v)} onChangeAr={(v) => setContent("ar", "cta", v)} />

      {/* Image */}
      <ImageUploader label="Section Image" currentImage={data.image || ""} onUpload={(url) => setData((p: any) => ({ ...p, image: url }))} />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
