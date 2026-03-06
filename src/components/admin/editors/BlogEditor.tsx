"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

interface BlogArticle {
  id: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  imageUrl: string;
  day: string;
  monthEn: string;
  monthAr: string;
  readTimeEn: string;
  readTimeAr: string;
}

interface BlogData {
  sectionData: Record<string, unknown>;
  articles: BlogArticle[];
}

export default function BlogEditor({ initialData }: { initialData: BlogData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/homepage/blog", {
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

  const updateArticle = (index: number, updates: Partial<BlogArticle>) => {
    setData((p) => ({
      ...p,
      articles: p.articles.map((a, i) => (i === index ? { ...a, ...updates } : a)),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Section Data */}
      <BilingualInput
        label="Section Heading"
        valueEn={(data.sectionData as { headingEn?: string }).headingEn || ""}
        valueAr={(data.sectionData as { headingAr?: string }).headingAr || ""}
        onChangeEn={(v) =>
          setData((p) => ({ ...p, sectionData: { ...p.sectionData, headingEn: v } }))
        }
        onChangeAr={(v) =>
          setData((p) => ({ ...p, sectionData: { ...p.sectionData, headingAr: v } }))
        }
      />
      <BilingualInput
        label="Badge Label"
        valueEn={(data.sectionData as { badgeEn?: string }).badgeEn || ""}
        valueAr={(data.sectionData as { badgeAr?: string }).badgeAr || ""}
        onChangeEn={(v) =>
          setData((p) => ({ ...p, sectionData: { ...p.sectionData, badgeEn: v } }))
        }
        onChangeAr={(v) =>
          setData((p) => ({ ...p, sectionData: { ...p.sectionData, badgeAr: v } }))
        }
      />

      {/* Articles */}
      {data.articles.length > 0 && (
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Homepage Articles ({data.articles.length})
          </label>

          {data.articles.map((article, idx) => (
            <div
              key={article.id}
              className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4"
            >
              <div className="text-[11px] text-[#a0a5af] font-medium mb-2">
                Article {idx + 1}
              </div>
              <div className="space-y-3">
                <ImageUploader
                  label="Article Image"
                  currentImage={article.imageUrl}
                  onUpload={(url) => updateArticle(idx, { imageUrl: url })}
                />
                <BilingualInput
                  label="Title"
                  valueEn={article.titleEn}
                  valueAr={article.titleAr}
                  onChangeEn={(v) => updateArticle(idx, { titleEn: v })}
                  onChangeAr={(v) => updateArticle(idx, { titleAr: v })}
                />
                <BilingualTextarea
                  label="Excerpt"
                  valueEn={article.excerptEn}
                  valueAr={article.excerptAr}
                  onChangeEn={(v) => updateArticle(idx, { excerptEn: v })}
                  onChangeAr={(v) => updateArticle(idx, { excerptAr: v })}
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] text-[#6b7280]">Day</label>
                    <input
                      value={article.day}
                      onChange={(e) => updateArticle(idx, { day: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      placeholder="15"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[12px] text-[#6b7280]">Month (EN)</label>
                      <input
                        value={article.monthEn}
                        onChange={(e) => updateArticle(idx, { monthEn: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="Jan"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6b7280]">Month (AR)</label>
                      <input
                        value={article.monthAr}
                        onChange={(e) => updateArticle(idx, { monthAr: e.target.value })}
                        dir="rtl"
                        className="w-full mt-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="يناير"
                      />
                    </div>
                  </div>
                </div>
                <BilingualInput
                  label="Read Time"
                  valueEn={article.readTimeEn}
                  valueAr={article.readTimeAr}
                  onChangeEn={(v) => updateArticle(idx, { readTimeEn: v })}
                  onChangeAr={(v) => updateArticle(idx, { readTimeAr: v })}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.articles.length === 0 && (
        <p className="text-[13px] text-[#a0a5af] italic">
          No published blog articles found. Create articles in the Blog section first.
        </p>
      )}

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
