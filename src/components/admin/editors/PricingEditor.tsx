"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import ArrayEditor from "../ui/ArrayEditor";
import SaveButton from "../ui/SaveButton";

function parseBenefits(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

interface PlanItem {
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
  benefitsEn: string;
  benefitsAr: string;
}

interface FeatureItem {
  labelEn: string;
  labelAr: string;
}

interface PricingData {
  sectionHeading: { en: Record<string, string>; ar: Record<string, string> };
  sectionBadge: { label: string; labelAr: string };
  viewAllLabel: { en: string; ar: string };
  plans: PlanItem[];
  features: FeatureItem[];
}

function PlanBenefitsEditor({ benefitsEn, benefitsAr, onChange }: {
  benefitsEn: string;
  benefitsAr: string;
  onChange: (benefitsEn: string, benefitsAr: string) => void;
}) {
  const en = parseBenefits(benefitsEn);
  const ar = parseBenefits(benefitsAr);
  const maxLen = Math.max(en.length, ar.length);

  const updateBenefit = (lang: "en" | "ar", index: number, value: string) => {
    const enArr = [...en];
    const arArr = [...ar];
    if (lang === "en") enArr[index] = value;
    else arArr[index] = value;
    onChange(JSON.stringify(enArr), JSON.stringify(arArr));
  };

  const addBenefit = () => {
    onChange(JSON.stringify([...en, ""]), JSON.stringify([...ar, ""]));
  };

  const removeBenefit = (index: number) => {
    onChange(
      JSON.stringify(en.filter((_, i) => i !== index)),
      JSON.stringify(ar.filter((_, i) => i !== index))
    );
  };

  return (
    <div className="space-y-2 mt-2">
      <label className="text-[12px] font-medium text-[#6b7280]">Benefits (per plan)</label>
      {Array.from({ length: maxLen }).map((_, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="text"
              value={en[i] || ""}
              onChange={(e) => updateBenefit("en", i, e.target.value)}
              placeholder="Benefit (EN)"
              className="w-full px-3 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="text"
              value={ar[i] || ""}
              onChange={(e) => updateBenefit("ar", i, e.target.value)}
              placeholder="Benefit (AR)"
              dir="rtl"
              className="w-full px-3 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] text-right placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <button
            type="button"
            onClick={() => removeBenefit(i)}
            className="mt-1 p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addBenefit}
        className="flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Benefit
      </button>
    </div>
  );
}

export default function PricingEditor({ initialData }: { initialData: PricingData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/pricing", {
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
        valueEn={data.sectionHeading.en?.heading || ""}
        valueAr={data.sectionHeading.ar?.heading || ""}
        onChangeEn={(v) =>
          setData((p) => ({
            ...p,
            sectionHeading: { ...p.sectionHeading, en: { ...p.sectionHeading.en, heading: v } },
          }))
        }
        onChangeAr={(v) =>
          setData((p) => ({
            ...p,
            sectionHeading: { ...p.sectionHeading, ar: { ...p.sectionHeading.ar, heading: v } },
          }))
        }
      />

      {/* Badge */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (EN)</label>
          <input
            value={data.sectionBadge.label}
            onChange={(e) =>
              setData((p) => ({ ...p, sectionBadge: { ...p.sectionBadge, label: e.target.value } }))
            }
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-[#2e263d]">Badge (AR)</label>
          <input
            value={data.sectionBadge.labelAr}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                sectionBadge: { ...p.sectionBadge, labelAr: e.target.value },
              }))
            }
            dir="rtl"
            className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* View All Label */}
      <BilingualInput
        label="View All Button Label"
        valueEn={data.viewAllLabel.en || ""}
        valueAr={data.viewAllLabel.ar || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, viewAllLabel: { ...p.viewAllLabel, en: v } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, viewAllLabel: { ...p.viewAllLabel, ar: v } }))}
      />

      {/* Plans */}
      <ArrayEditor
        label="Plans"
        items={data.plans}
        onUpdate={(plans) => setData((p) => ({ ...p, plans }))}
        createItem={() => ({
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
          benefitsEn: "[]",
          benefitsAr: "[]",
        })}
        addLabel="Add Plan"
        renderItem={(item, _i, onChange) => (
          <div className="space-y-3">
            <BilingualInput
              label="Plan Name"
              valueEn={item.nameEn}
              valueAr={item.nameAr}
              onChangeEn={(v) => onChange({ ...item, nameEn: v })}
              onChangeAr={(v) => onChange({ ...item, nameAr: v })}
            />
            <BilingualInput
              label="Price"
              valueEn={item.priceEn}
              valueAr={item.priceAr}
              onChangeEn={(v) => onChange({ ...item, priceEn: v })}
              onChangeAr={(v) => onChange({ ...item, priceAr: v })}
            />
            <BilingualInput
              label="Period"
              valueEn={item.periodEn}
              valueAr={item.periodAr}
              onChangeEn={(v) => onChange({ ...item, periodEn: v })}
              onChangeAr={(v) => onChange({ ...item, periodAr: v })}
            />
            <BilingualInput
              label="Description"
              valueEn={item.descriptionEn}
              valueAr={item.descriptionAr}
              onChangeEn={(v) => onChange({ ...item, descriptionEn: v })}
              onChangeAr={(v) => onChange({ ...item, descriptionAr: v })}
            />
            <BilingualInput
              label="Features Label"
              valueEn={item.featuresLabelEn}
              valueAr={item.featuresLabelAr}
              onChangeEn={(v) => onChange({ ...item, featuresLabelEn: v })}
              onChangeAr={(v) => onChange({ ...item, featuresLabelAr: v })}
            />
            <BilingualInput
              label="CTA Button Text"
              valueEn={item.ctaEn}
              valueAr={item.ctaAr}
              onChangeEn={(v) => onChange({ ...item, ctaEn: v })}
              onChangeAr={(v) => onChange({ ...item, ctaAr: v })}
            />
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#6b7280]">CTA Button URL</label>
              <input
                type="text"
                value={item.ctaUrl || "/register"}
                onChange={(e) => onChange({ ...item, ctaUrl: e.target.value })}
                placeholder="/register"
                className="w-full px-3 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[12px] text-[#6b7280]">CTA Style</label>
                <select
                  value={item.ctaStyle}
                  onChange={(e) => onChange({ ...item, ctaStyle: e.target.value })}
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
                  value={item.bg || "#ffffff"}
                  onChange={(e) => onChange({ ...item, bg: e.target.value })}
                  className="w-full mt-1 h-[38px] border border-[#e0e3e8] rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-[13px] text-[#2e263d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.gradient}
                    onChange={(e) => onChange({ ...item, gradient: e.target.checked })}
                    className="rounded border-[#e0e3e8] text-accent focus:ring-accent/20"
                  />
                  Gradient
                </label>
              </div>
            </div>

            {/* Per-plan Benefits */}
            <PlanBenefitsEditor
              benefitsEn={item.benefitsEn || "[]"}
              benefitsAr={item.benefitsAr || "[]"}
              onChange={(bEn, bAr) => onChange({ ...item, benefitsEn: bEn, benefitsAr: bAr })}
            />
          </div>
        )}
      />

      {/* Plan Features (comparison rows) */}
      <ArrayEditor
        label="Plan Features (global fallback)"
        items={data.features}
        onUpdate={(features) => setData((p) => ({ ...p, features }))}
        createItem={() => ({ labelEn: "", labelAr: "" })}
        addLabel="Add Feature Row"
        renderItem={(item, _i, onChange) => (
          <BilingualInput
            label="Feature Label"
            valueEn={item.labelEn}
            valueAr={item.labelAr}
            onChangeEn={(v) => onChange({ ...item, labelEn: v })}
            onChangeAr={(v) => onChange({ ...item, labelAr: v })}
          />
        )}
      />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
