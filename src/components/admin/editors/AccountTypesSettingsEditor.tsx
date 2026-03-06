"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import SaveButton from "../ui/SaveButton";

interface SettingsData {
  heroTitle: { en: string; ar: string };
  pageHeading: {
    en: { before: string; bold: string };
    ar: { before: string; bold: string };
  };
}

export default function AccountTypesSettingsEditor({ initialData }: { initialData: SettingsData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/account-types/settings", {
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
        valueEn={data.heroTitle?.en || ""}
        valueAr={data.heroTitle?.ar || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, heroTitle: { ...p.heroTitle, en: v } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, heroTitle: { ...p.heroTitle, ar: v } }))}
      />

      <BilingualInput
        label="Page Heading (before bold)"
        valueEn={data.pageHeading?.en?.before || ""}
        valueAr={data.pageHeading?.ar?.before || ""}
        onChangeEn={(v) =>
          setData((p) => ({
            ...p,
            pageHeading: { ...p.pageHeading, en: { ...p.pageHeading.en, before: v } },
          }))
        }
        onChangeAr={(v) =>
          setData((p) => ({
            ...p,
            pageHeading: { ...p.pageHeading, ar: { ...p.pageHeading.ar, before: v } },
          }))
        }
      />

      <BilingualInput
        label="Page Heading (bold part)"
        valueEn={data.pageHeading?.en?.bold || ""}
        valueAr={data.pageHeading?.ar?.bold || ""}
        onChangeEn={(v) =>
          setData((p) => ({
            ...p,
            pageHeading: { ...p.pageHeading, en: { ...p.pageHeading.en, bold: v } },
          }))
        }
        onChangeAr={(v) =>
          setData((p) => ({
            ...p,
            pageHeading: { ...p.pageHeading, ar: { ...p.pageHeading.ar, bold: v } },
          }))
        }
      />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
