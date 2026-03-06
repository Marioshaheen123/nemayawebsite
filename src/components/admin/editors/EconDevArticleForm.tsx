"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";
import SeoFields, { type SeoData, EMPTY_SEO } from "../ui/SeoFields";
import RichTextEditor from "../ui/RichTextEditor";
import WordCount from "../ui/WordCount";
import TagsInput from "../ui/TagsInput";
import { bodyToHtml } from "@/lib/body-utils";

interface ArticleData {
  slug: string;
  imageUrl: string;
  imageAltEn: string;
  imageAltAr: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  day: string;
  monthEn: string;
  monthAr: string;
  readTimeEn: string;
  readTimeAr: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  category: string;
  tags: string;
  // SEO
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  ogImageUrl: string;
  keywords: string;
}

const ECONDEV_CATEGORIES = [
  "Monetary Policy",
  "Markets",
  "Trade",
  "Development",
];

const EMPTY: ArticleData = {
  slug: "",
  imageUrl: "",
  imageAltEn: "",
  imageAltAr: "",
  titleEn: "",
  titleAr: "",
  excerptEn: "",
  excerptAr: "",
  bodyEn: "",
  bodyAr: "",
  day: "",
  monthEn: "",
  monthAr: "",
  readTimeEn: "",
  readTimeAr: "",
  featured: false,
  published: true,
  sortOrder: 0,
  category: "",
  tags: "",
  ...EMPTY_SEO,
};

export default function EconDevArticleForm({
  initialData,
  dbId,
}: {
  initialData?: ArticleData;
  dbId?: string;
}) {
  const router = useRouter();
  const isEdit = !!dbId;

  const init = initialData
    ? { ...initialData, bodyEn: bodyToHtml(initialData.bodyEn), bodyAr: bodyToHtml(initialData.bodyAr) }
    : EMPTY;

  const [data, setData] = useState<ArticleData>(init);
  const [bodyEn, setBodyEn] = useState(init.bodyEn);
  const [bodyAr, setBodyAr] = useState(init.bodyAr);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof ArticleData, val: any) =>
    setData((p) => ({ ...p, [key]: val }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const payload = { ...data, bodyEn, bodyAr };
      const url = isEdit
        ? `/api/admin/economic-developments/${dbId}`
        : "/api/admin/economic-developments";
      const method = isEdit ? "PATCH" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (!isEdit) {
          const created = await res.json();
          router.push(`/admin/economic-developments/${created.id}`);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      }
    } finally {
      setSaving(false);
    }
  }, [data, bodyEn, bodyAr, isEdit, dbId, router]);

  return (
    <div className="space-y-5">
      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">
          Slug (URL identifier)
        </label>
        <input
          type="text"
          value={data.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="e.g. economic-update-jan-2026"
          className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Image */}
      <ImageUploader
        label="Article Image"
        currentImage={data.imageUrl}
        onUpload={(url) => set("imageUrl", url)}
      />
      <BilingualInput label="Image Alt Text" valueEn={data.imageAltEn} valueAr={data.imageAltAr} onChangeEn={(v) => set("imageAltEn", v)} onChangeAr={(v) => set("imageAltAr", v)} />

      {/* Title */}
      <BilingualInput
        label="Title"
        valueEn={data.titleEn}
        valueAr={data.titleAr}
        onChangeEn={(v) => set("titleEn", v)}
        onChangeAr={(v) => set("titleAr", v)}
      />

      {/* Excerpt */}
      <BilingualTextarea
        label="Excerpt"
        valueEn={data.excerptEn}
        valueAr={data.excerptAr}
        onChangeEn={(v) => set("excerptEn", v)}
        onChangeAr={(v) => set("excerptAr", v)}
        rows={3}
      />

      {/* Body EN */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Body (English)</label>
        <RichTextEditor value={bodyEn} onChange={setBodyEn} dir="ltr" />
        <WordCount html={bodyEn} />
      </div>

      {/* Body AR */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Body (Arabic)</label>
        <RichTextEditor value={bodyAr} onChange={setBodyAr} dir="rtl" />
        <WordCount html={bodyAr} />
      </div>

      {/* Date */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Day</label>
          <input
            type="text"
            value={data.day}
            onChange={(e) => set("day", e.target.value)}
            placeholder="10"
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

      {/* Read Time */}
      <BilingualInput
        label="Read Time"
        valueEn={data.readTimeEn}
        valueAr={data.readTimeAr}
        onChangeEn={(v) => set("readTimeEn", v)}
        onChangeAr={(v) => set("readTimeAr", v)}
      />

      {/* Category & Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Category</label>
          <select value={data.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
            <option value="">— None —</option>
            {ECONDEV_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">Tags</label>
          <TagsInput value={data.tags} onChange={(v) => set("tags", v)} />
        </div>
      </div>

      {/* Meta fields row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Sort Order
          </label>
          <input
            type="number"
            value={data.sortOrder}
            onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Featured
          </label>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 rounded border-[#e0e3e8] text-accent focus:ring-accent/20"
            />
            <span className="text-[13px] text-[#6b7280]">
              {data.featured ? "Featured" : "Normal"}
            </span>
          </label>
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Published
          </label>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 rounded border-[#e0e3e8] text-accent focus:ring-accent/20"
            />
            <span className="text-[13px] text-[#6b7280]">
              {data.published ? "Published" : "Draft"}
            </span>
          </label>
        </div>
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
        onChange={(key, val) => set(key as keyof ArticleData, val)}
        titleFallback={{ en: data.titleEn, ar: data.titleAr }}
        descriptionFallback={{ en: data.excerptEn, ar: data.excerptAr }}
      />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
