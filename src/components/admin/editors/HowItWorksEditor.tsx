"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

interface HowItWorksData {
  content: {
    en: { heading: string; steps: { title: string; bullets: string[] }[] };
    ar: { heading: string; steps: { title: string; bullets: string[] }[] };
  };
  badge: { label: string; labelAr: string };
  image: string;
}

export default function HowItWorksEditor({ initialData }: { initialData: HowItWorksData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/how-it-works", {
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

  const updateStepEn = (idx: number, key: string, val: string | string[]) => {
    setData((p) => {
      const steps = [...p.content.en.steps];
      steps[idx] = { ...steps[idx], [key]: val };
      return { ...p, content: { ...p.content, en: { ...p.content.en, steps } } };
    });
  };

  const updateStepAr = (idx: number, key: string, val: string | string[]) => {
    setData((p) => {
      const steps = [...p.content.ar.steps];
      steps[idx] = { ...steps[idx], [key]: val };
      return { ...p, content: { ...p.content, ar: { ...p.content.ar, steps } } };
    });
  };

  const addStep = () => {
    setData((p) => ({
      ...p,
      content: {
        en: { ...p.content.en, steps: [...p.content.en.steps, { title: "", bullets: [""] }] },
        ar: { ...p.content.ar, steps: [...p.content.ar.steps, { title: "", bullets: [""] }] },
      },
    }));
  };

  const removeStep = (idx: number) => {
    setData((p) => ({
      ...p,
      content: {
        en: { ...p.content.en, steps: p.content.en.steps.filter((_, i) => i !== idx) },
        ar: { ...p.content.ar, steps: p.content.ar.steps.filter((_, i) => i !== idx) },
      },
    }));
  };

  const addBullet = (stepIdx: number) => {
    setData((p) => {
      const enSteps = [...p.content.en.steps];
      enSteps[stepIdx] = { ...enSteps[stepIdx], bullets: [...enSteps[stepIdx].bullets, ""] };
      const arSteps = [...p.content.ar.steps];
      arSteps[stepIdx] = { ...arSteps[stepIdx], bullets: [...arSteps[stepIdx].bullets, ""] };
      return {
        ...p,
        content: {
          en: { ...p.content.en, steps: enSteps },
          ar: { ...p.content.ar, steps: arSteps },
        },
      };
    });
  };

  const removeBullet = (stepIdx: number, bulletIdx: number) => {
    setData((p) => {
      const enSteps = [...p.content.en.steps];
      enSteps[stepIdx] = {
        ...enSteps[stepIdx],
        bullets: enSteps[stepIdx].bullets.filter((_, i) => i !== bulletIdx),
      };
      const arSteps = [...p.content.ar.steps];
      arSteps[stepIdx] = {
        ...arSteps[stepIdx],
        bullets: arSteps[stepIdx].bullets.filter((_, i) => i !== bulletIdx),
      };
      return {
        ...p,
        content: {
          en: { ...p.content.en, steps: enSteps },
          ar: { ...p.content.ar, steps: arSteps },
        },
      };
    });
  };

  return (
    <div className="space-y-5">
      <BilingualInput
        label="Section Heading"
        valueEn={data.content.en?.heading || ""}
        valueAr={data.content.ar?.heading || ""}
        onChangeEn={(v) => setData((p) => ({ ...p, content: { ...p.content, en: { ...p.content.en, heading: v } } }))}
        onChangeAr={(v) => setData((p) => ({ ...p, content: { ...p.content, ar: { ...p.content.ar, heading: v } } }))}
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
      <ImageUploader
        label="Section Image"
        currentImage={data.image}
        onUpload={(url) => setData((p) => ({ ...p, image: url }))}
      />

      {/* Steps */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-[#2e263d]">Steps</label>
        {data.content.en.steps.map((step, idx) => (
          <div key={idx} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 relative">
            <button
              type="button"
              onClick={() => removeStep(idx)}
              className="absolute top-2 right-2 p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="text-[11px] text-[#a0a5af] font-medium mb-2">Step {idx + 1}</div>
            <BilingualInput
              label="Title"
              valueEn={step.title}
              valueAr={data.content.ar.steps[idx]?.title || ""}
              onChangeEn={(v) => updateStepEn(idx, "title", v)}
              onChangeAr={(v) => updateStepAr(idx, "title", v)}
            />
            <div className="mt-3 space-y-2">
              <label className="text-[12px] text-[#6b7280]">Bullets</label>
              {step.bullets.map((bullet, bi) => (
                <div key={bi} className="flex gap-2 items-start">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input
                      value={bullet}
                      onChange={(e) => {
                        const bullets = [...step.bullets];
                        bullets[bi] = e.target.value;
                        updateStepEn(idx, "bullets", bullets);
                      }}
                      placeholder="English bullet"
                      className="px-3 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                    <input
                      value={data.content.ar.steps[idx]?.bullets[bi] || ""}
                      onChange={(e) => {
                        const arBullets = [...(data.content.ar.steps[idx]?.bullets || [])];
                        arBullets[bi] = e.target.value;
                        updateStepAr(idx, "bullets", arBullets);
                      }}
                      dir="rtl"
                      placeholder="Arabic bullet"
                      className="px-3 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBullet(idx, bi)}
                    className="mt-1 p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBullet(idx)}
                className="flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Bullet
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Step
        </button>
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
