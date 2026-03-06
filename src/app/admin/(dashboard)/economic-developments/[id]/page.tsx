"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import EconDevArticleForm from "@/components/admin/editors/EconDevArticleForm";

export default function EditEconDevArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/economic-developments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-8 text-center">
        <p className="text-[14px] text-red-500">Article not found or failed to load.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-8 flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-[13px] text-[#6b7280]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <EconDevArticleForm
        dbId={data.id}
        initialData={{
          slug: data.slug,
          imageUrl: data.imageUrl,
          imageAltEn: data.imageAltEn || "",
          imageAltAr: data.imageAltAr || "",
          titleEn: data.titleEn,
          titleAr: data.titleAr,
          excerptEn: data.excerptEn,
          excerptAr: data.excerptAr,
          bodyEn: data.bodyEn,
          bodyAr: data.bodyAr,
          day: data.day,
          monthEn: data.monthEn,
          monthAr: data.monthAr,
          readTimeEn: data.readTimeEn,
          readTimeAr: data.readTimeAr,
          featured: data.featured,
          published: data.published,
          sortOrder: data.sortOrder,
          category: data.category || "",
          tags: data.tags || "",
          metaTitleEn: data.metaTitleEn || "",
          metaTitleAr: data.metaTitleAr || "",
          metaDescriptionEn: data.metaDescriptionEn || "",
          metaDescriptionAr: data.metaDescriptionAr || "",
          ogImageUrl: data.ogImageUrl || "",
          keywords: data.keywords || "",
        }}
      />
    </div>
  );
}
