"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ArrayEditor from "../ui/ArrayEditor";
import SaveButton from "../ui/SaveButton";

interface FaqItemData {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

interface FaqData {
  heading: { en: Record<string, string>; ar: Record<string, string> };
  badge: { label: string; labelAr: string };
  categoryId: string | null;
  items: FaqItemData[];
}

export default function FaqEditor({ initialData }: { initialData: FaqData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/faq", {
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
      {/* Section Heading */}
      <BilingualInput
        label="Section Heading"
        valueEn={data.heading.en?.heading || ""}
        valueAr={data.heading.ar?.heading || ""}
        onChangeEn={(v) =>
          setData((p) => ({
            ...p,
            heading: { ...p.heading, en: { ...p.heading.en, heading: v } },
          }))
        }
        onChangeAr={(v) =>
          setData((p) => ({
            ...p,
            heading: { ...p.heading, ar: { ...p.heading.ar, heading: v } },
          }))
        }
      />

      {/* Badge */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (EN)</label>
          <input
            value={data.badge.label}
            onChange={(e) =>
              setData((p) => ({ ...p, badge: { ...p.badge, label: e.target.value } }))
            }
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (AR)</label>
          <input
            value={data.badge.labelAr}
            onChange={(e) =>
              setData((p) => ({ ...p, badge: { ...p.badge, labelAr: e.target.value } }))
            }
            dir="rtl"
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* FAQ Items */}
      <ArrayEditor
        label="FAQ Items"
        items={data.items}
        onUpdate={(items) => setData((p) => ({ ...p, items }))}
        createItem={() => ({ questionEn: "", questionAr: "", answerEn: "", answerAr: "" })}
        addLabel="Add Question"
        renderItem={(item, _i, onChange) => (
          <div className="space-y-3">
            <BilingualInput
              label="Question"
              valueEn={item.questionEn}
              valueAr={item.questionAr}
              onChangeEn={(v) => onChange({ ...item, questionEn: v })}
              onChangeAr={(v) => onChange({ ...item, questionAr: v })}
            />
            <BilingualTextarea
              label="Answer"
              valueEn={item.answerEn}
              valueAr={item.answerAr}
              onChangeEn={(v) => onChange({ ...item, answerEn: v })}
              onChangeAr={(v) => onChange({ ...item, answerAr: v })}
              rows={3}
            />
          </div>
        )}
      />

      {!data.categoryId && (
        <p className="text-[13px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          No homepage FAQ category found. Please create one in the database with{" "}
          <code className="text-[12px] bg-amber-100 px-1 py-0.5 rounded">isHomepage: true</code>.
        </p>
      )}

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
