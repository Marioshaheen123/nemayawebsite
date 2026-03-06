"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import SaveButton from "../ui/SaveButton";

interface LabelsData {
  heroTitle: { en: string; ar: string };
  watchNowLabel: { en: string; ar: string };
  moreVideoLabel: { en: string; ar: string };
  keyTakeawaysLabel: { en: string; ar: string };
  directLinkLabel: { en: string; ar: string };
}

export default function VideoLabelsEditor({ initialData }: { initialData: LabelsData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setField = (field: keyof LabelsData, lang: "en" | "ar", val: string) =>
    setData((p) => ({ ...p, [field]: { ...p[field], [lang]: val } }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/videos/labels", {
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
        label="Page Hero Title"
        valueEn={data.heroTitle.en}
        valueAr={data.heroTitle.ar}
        onChangeEn={(v) => setField("heroTitle", "en", v)}
        onChangeAr={(v) => setField("heroTitle", "ar", v)}
      />
      <BilingualInput
        label="Watch Now Button"
        valueEn={data.watchNowLabel.en}
        valueAr={data.watchNowLabel.ar}
        onChangeEn={(v) => setField("watchNowLabel", "en", v)}
        onChangeAr={(v) => setField("watchNowLabel", "ar", v)}
      />
      <BilingualInput
        label="More Video Label"
        valueEn={data.moreVideoLabel.en}
        valueAr={data.moreVideoLabel.ar}
        onChangeEn={(v) => setField("moreVideoLabel", "en", v)}
        onChangeAr={(v) => setField("moreVideoLabel", "ar", v)}
      />
      <BilingualInput
        label="Key Takeaways Label"
        valueEn={data.keyTakeawaysLabel.en}
        valueAr={data.keyTakeawaysLabel.ar}
        onChangeEn={(v) => setField("keyTakeawaysLabel", "en", v)}
        onChangeAr={(v) => setField("keyTakeawaysLabel", "ar", v)}
      />
      <BilingualInput
        label="Direct Link Label"
        valueEn={data.directLinkLabel.en}
        valueAr={data.directLinkLabel.ar}
        onChangeEn={(v) => setField("directLinkLabel", "en", v)}
        onChangeAr={(v) => setField("directLinkLabel", "ar", v)}
      />
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
