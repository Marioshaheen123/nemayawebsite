"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import SaveButton from "../ui/SaveButton";

function parseBenefits(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

interface PlanData {
  nameEn: string;
  nameAr: string;
  priceEn: string;
  priceAr: string;
  periodEn: string;
  periodAr: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresLabelEn: string;
  featuresLabelAr: string;
  ctaEn: string;
  ctaAr: string;
  ctaUrl: string;
  ctaStyle: string;
  bg: string;
  gradient: boolean;
  sortOrder: number;
  benefitsEn: string;
  benefitsAr: string;
}

const EMPTY: PlanData = {
  nameEn: "",
  nameAr: "",
  priceEn: "",
  priceAr: "",
  periodEn: "",
  periodAr: "",
  descriptionEn: "",
  descriptionAr: "",
  featuresLabelEn: "",
  featuresLabelAr: "",
  ctaEn: "",
  ctaAr: "",
  ctaUrl: "/register",
  ctaStyle: "outline",
  bg: "#ffffff",
  gradient: false,
  sortOrder: 0,
  benefitsEn: "[]",
  benefitsAr: "[]",
};

export default function AccountTypePlanForm({ initialData, dbId }: { initialData?: PlanData; dbId?: string }) {
  const router = useRouter();
  const isEdit = !!dbId;
  const [data, setData] = useState<PlanData>(initialData || EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof PlanData, val: any) => setData((p) => ({ ...p, [key]: val }));

  // Benefits state
  const benefitsEn = parseBenefits(data.benefitsEn);
  const benefitsAr = parseBenefits(data.benefitsAr);
  const maxLen = Math.max(benefitsEn.length, benefitsAr.length);

  const updateBenefit = (lang: "en" | "ar", index: number, value: string) => {
    const enArr = [...benefitsEn];
    const arArr = [...benefitsAr];
    if (lang === "en") enArr[index] = value;
    else arArr[index] = value;
    setData((p) => ({ ...p, benefitsEn: JSON.stringify(enArr), benefitsAr: JSON.stringify(arArr) }));
  };

  const addBenefit = () => {
    setData((p) => ({
      ...p,
      benefitsEn: JSON.stringify([...benefitsEn, ""]),
      benefitsAr: JSON.stringify([...benefitsAr, ""]),
    }));
  };

  const removeBenefit = (index: number) => {
    setData((p) => ({
      ...p,
      benefitsEn: JSON.stringify(benefitsEn.filter((_, i) => i !== index)),
      benefitsAr: JSON.stringify(benefitsAr.filter((_, i) => i !== index)),
    }));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/account-types/${dbId}` : "/api/admin/account-types";
      const method = isEdit ? "PATCH" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (!isEdit) {
          const created = await res.json();
          router.push(`/admin/account-types/${created.id}`);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      }
    } finally {
      setSaving(false);
    }
  }, [data, isEdit, dbId, router]);

  return (
    <div className="space-y-5">
      {/* Plan Name */}
      <BilingualInput
        label="Plan Name"
        valueEn={data.nameEn}
        valueAr={data.nameAr}
        onChangeEn={(v) => set("nameEn", v)}
        onChangeAr={(v) => set("nameAr", v)}
      />

      {/* Price */}
      <BilingualInput
        label="Price"
        valueEn={data.priceEn}
        valueAr={data.priceAr}
        onChangeEn={(v) => set("priceEn", v)}
        onChangeAr={(v) => set("priceAr", v)}
      />

      {/* Period */}
      <BilingualInput
        label="Period"
        valueEn={data.periodEn}
        valueAr={data.periodAr}
        onChangeEn={(v) => set("periodEn", v)}
        onChangeAr={(v) => set("periodAr", v)}
      />

      {/* Description */}
      <BilingualInput
        label="Description"
        valueEn={data.descriptionEn}
        valueAr={data.descriptionAr}
        onChangeEn={(v) => set("descriptionEn", v)}
        onChangeAr={(v) => set("descriptionAr", v)}
      />

      {/* Features Label */}
      <BilingualInput
        label="Features Label"
        valueEn={data.featuresLabelEn}
        valueAr={data.featuresLabelAr}
        onChangeEn={(v) => set("featuresLabelEn", v)}
        onChangeAr={(v) => set("featuresLabelAr", v)}
      />

      {/* CTA Button Text */}
      <BilingualInput
        label="CTA Button Text"
        valueEn={data.ctaEn}
        valueAr={data.ctaAr}
        onChangeEn={(v) => set("ctaEn", v)}
        onChangeAr={(v) => set("ctaAr", v)}
      />

      {/* CTA URL */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">CTA Button URL</label>
        <input
          type="text"
          value={data.ctaUrl}
          onChange={(e) => set("ctaUrl", e.target.value)}
          placeholder="/register"
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Style controls */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[12px] text-[#6b7280]">CTA Style</label>
          <select
            value={data.ctaStyle}
            onChange={(e) => set("ctaStyle", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-white"
          >
            <option value="outline">Outline</option>
            <option value="solid">Solid</option>
            <option value="white">White</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] text-[#6b7280]">Background</label>
          <input
            type="color"
            value={data.bg || "#ffffff"}
            onChange={(e) => set("bg", e.target.value)}
            className="w-full mt-1 h-[38px] border border-[#e0e3e8] rounded-lg cursor-pointer"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-[13px] text-[#2e263d] cursor-pointer">
            <input
              type="checkbox"
              checked={data.gradient}
              onChange={(e) => set("gradient", e.target.checked)}
              className="rounded border-[#e0e3e8] text-accent focus:ring-accent/20"
            />
            Gradient
          </label>
        </div>
      </div>

      {/* Sort Order */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Sort Order</label>
        <input
          type="number"
          value={data.sortOrder}
          onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Per-plan Benefits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-[#2e263d]">Benefits</label>
          <span className="text-[11px] text-[#a0a5af]">{benefitsEn.length} benefit{benefitsEn.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="bg-[#f9fafb] rounded-lg border border-[#e8ecf1] p-4 space-y-3">
          {maxLen === 0 && (
            <p className="text-[12px] text-[#a0a5af] text-center py-2">No benefits added yet.</p>
          )}
          {Array.from({ length: maxLen }).map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[11px] text-[#a0a5af] mt-2.5 w-5 shrink-0">{i + 1}.</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={benefitsEn[i] || ""}
                  onChange={(e) => updateBenefit("en", i, e.target.value)}
                  placeholder="Benefit (EN)"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <input
                  type="text"
                  value={benefitsAr[i] || ""}
                  onChange={(e) => updateBenefit("ar", i, e.target.value)}
                  placeholder="Benefit (AR)"
                  dir="rtl"
                  className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <button
                type="button"
                onClick={() => removeBenefit(i)}
                className="mt-2 p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addBenefit}
            className="flex items-center gap-1.5 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Benefit
          </button>
        </div>
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
