"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";
import SeoFields, { type SeoData, EMPTY_SEO } from "../ui/SeoFields";

interface VideoData {
  videoId: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  fullDescEn: string;
  fullDescAr: string;
  takeawaysEn: string; // JSON stringified array
  takeawaysAr: string;
  linkTextEn: string;
  linkTextAr: string;
  day: string;
  monthEn: string;
  monthAr: string;
  durationEn: string;
  durationAr: string;
  videoUrl: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
  // SEO
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  ogImageUrl: string;
  keywords: string;
}

const EMPTY_VIDEO: VideoData = {
  videoId: "",
  titleEn: "",
  titleAr: "",
  descEn: "",
  descAr: "",
  fullDescEn: "",
  fullDescAr: "",
  takeawaysEn: "[]",
  takeawaysAr: "[]",
  linkTextEn: "",
  linkTextAr: "",
  day: "",
  monthEn: "",
  monthAr: "",
  durationEn: "",
  durationAr: "",
  videoUrl: "",
  labelEn: "",
  labelAr: "",
  sortOrder: 0,
  ...EMPTY_SEO,
};

export default function VideoForm({
  initialData,
  dbId,
}: {
  initialData?: VideoData;
  dbId?: string;
}) {
  const router = useRouter();
  const isEdit = !!dbId;
  const [data, setData] = useState<VideoData>(initialData || EMPTY_VIDEO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Parse takeaways from JSON string
  const takeawaysEn: string[] = (() => {
    try { return JSON.parse(data.takeawaysEn); } catch { return []; }
  })();
  const takeawaysAr: string[] = (() => {
    try { return JSON.parse(data.takeawaysAr); } catch { return []; }
  })();

  const set = (key: keyof VideoData, val: string | number) =>
    setData((p) => ({ ...p, [key]: val }));

  const setTakeawayEn = (index: number, val: string) => {
    const next = [...takeawaysEn];
    next[index] = val;
    set("takeawaysEn", JSON.stringify(next));
  };

  const setTakeawayAr = (index: number, val: string) => {
    const next = [...takeawaysAr];
    next[index] = val;
    set("takeawaysAr", JSON.stringify(next));
  };

  const addTakeawayEn = () => set("takeawaysEn", JSON.stringify([...takeawaysEn, ""]));
  const addTakeawayAr = () => set("takeawaysAr", JSON.stringify([...takeawaysAr, ""]));

  const removeTakeawayEn = (index: number) =>
    set("takeawaysEn", JSON.stringify(takeawaysEn.filter((_, i) => i !== index)));
  const removeTakeawayAr = (index: number) =>
    set("takeawaysAr", JSON.stringify(takeawaysAr.filter((_, i) => i !== index)));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/videos/${dbId}` : "/api/admin/videos";
      const method = isEdit ? "PATCH" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (!isEdit) {
          const created = await res.json();
          router.push(`/admin/videos/${created.id}`);
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
      {/* Video ID */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Video ID (unique slug)</label>
        <input
          type="text"
          value={data.videoId}
          onChange={(e) => set("videoId", e.target.value)}
          placeholder="e.g. video-1"
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Title */}
      <BilingualInput
        label="Title"
        valueEn={data.titleEn}
        valueAr={data.titleAr}
        onChangeEn={(v) => set("titleEn", v)}
        onChangeAr={(v) => set("titleAr", v)}
      />

      {/* Short Description */}
      <BilingualTextarea
        label="Short Description"
        valueEn={data.descEn}
        valueAr={data.descAr}
        onChangeEn={(v) => set("descEn", v)}
        onChangeAr={(v) => set("descAr", v)}
      />

      {/* Full Description */}
      <BilingualTextarea
        label="Full Description"
        valueEn={data.fullDescEn}
        valueAr={data.fullDescAr}
        onChangeEn={(v) => set("fullDescEn", v)}
        onChangeAr={(v) => set("fullDescAr", v)}
        rows={4}
      />

      {/* Takeaways */}
      <div className="grid grid-cols-2 gap-4">
        {/* EN Takeaways */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#2e263d]">Key Takeaways (English)</label>
          {takeawaysEn.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={t}
                onChange={(e) => setTakeawayEn(i, e.target.value)}
                dir="ltr"
                className="flex-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={() => removeTakeawayEn(i)}
                className="p-1.5 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTakeawayEn}
            className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Takeaway
          </button>
        </div>

        {/* AR Takeaways */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#2e263d]">Key Takeaways (Arabic)</label>
          {takeawaysAr.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={t}
                onChange={(e) => setTakeawayAr(i, e.target.value)}
                dir="rtl"
                className="flex-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={() => removeTakeawayAr(i)}
                className="p-1.5 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTakeawayAr}
            className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Takeaway
          </button>
        </div>
      </div>

      {/* Link Text */}
      <BilingualInput
        label="Link Text"
        valueEn={data.linkTextEn}
        valueAr={data.linkTextAr}
        onChangeEn={(v) => set("linkTextEn", v)}
        onChangeAr={(v) => set("linkTextAr", v)}
      />

      {/* Date fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Day</label>
          <input
            type="text"
            value={data.day}
            onChange={(e) => set("day", e.target.value)}
            placeholder="e.g. 15"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <div className="col-span-2">
          <BilingualInput
            label="Month"
            valueEn={data.monthEn}
            valueAr={data.monthAr}
            onChangeEn={(v) => set("monthEn", v)}
            onChangeAr={(v) => set("monthAr", v)}
          />
        </div>
      </div>

      {/* Duration */}
      <BilingualInput
        label="Duration"
        valueEn={data.durationEn}
        valueAr={data.durationAr}
        onChangeEn={(v) => set("durationEn", v)}
        onChangeAr={(v) => set("durationAr", v)}
      />

      {/* Video URL */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Video URL</label>
        <input
          type="text"
          value={data.videoUrl}
          onChange={(e) => set("videoUrl", e.target.value)}
          placeholder="https://youtube.com/..."
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Label (optional badge) */}
      <BilingualInput
        label="Label (optional badge)"
        valueEn={data.labelEn}
        valueAr={data.labelAr}
        onChangeEn={(v) => set("labelEn", v)}
        onChangeAr={(v) => set("labelAr", v)}
      />

      {/* Sort Order */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Sort Order</label>
        <input
          type="number"
          value={data.sortOrder}
          onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
          className="w-[120px] px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* SEO */}
      <SeoFields
        data={{
          metaTitleEn: data.metaTitleEn,
          metaTitleAr: data.metaTitleAr,
          metaDescriptionEn: data.metaDescriptionEn,
          metaDescriptionAr: data.metaDescriptionAr,
          ogImageUrl: data.ogImageUrl,
          keywords: data.keywords,
        }}
        onChange={(key, val) => set(key as keyof VideoData, val)}
        titleFallback={{ en: data.titleEn, ar: data.titleAr }}
        descriptionFallback={{ en: data.descEn, ar: data.descAr }}
      />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
