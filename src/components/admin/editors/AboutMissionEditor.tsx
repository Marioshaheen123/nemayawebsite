"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

export default function AboutMissionEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/about/mission", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  return (
    <div className="space-y-5">
      <BilingualTextarea
        label="Mission Title"
        valueEn={data.missionTitle.en || ""}
        valueAr={data.missionTitle.ar || ""}
        onChangeEn={(v) => setData((p: any) => ({ ...p, missionTitle: { ...p.missionTitle, en: v } }))}
        onChangeAr={(v) => setData((p: any) => ({ ...p, missionTitle: { ...p.missionTitle, ar: v } }))}
        rows={3}
      />
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
