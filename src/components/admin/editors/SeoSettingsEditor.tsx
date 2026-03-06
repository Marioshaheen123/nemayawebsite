"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import ImageUploader from "../ui/ImageUploader";
import SaveButton from "../ui/SaveButton";

interface SeoSettingsData {
  siteNameEn: string;
  siteNameAr: string;
  defaultTitleEn: string;
  defaultTitleAr: string;
  defaultDescriptionEn: string;
  defaultDescriptionAr: string;
  defaultOgImageUrl: string;
  googleVerification: string;
  analyticsId: string;
}

const DEFAULTS: SeoSettingsData = {
  siteNameEn: "Namaya",
  siteNameAr: "نمايا",
  defaultTitleEn: "Namaya - Invest Smart Now",
  defaultTitleAr: "نمايا - استثمر الآن بذكاء",
  defaultDescriptionEn: "",
  defaultDescriptionAr: "",
  defaultOgImageUrl: "",
  googleVerification: "",
  analyticsId: "",
};

export default function SeoSettingsEditor({
  initialData,
}: {
  initialData: Partial<SeoSettingsData>;
}) {
  const [data, setData] = useState<SeoSettingsData>({ ...DEFAULTS, ...initialData });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof SeoSettingsData, val: string) =>
    setData((p) => ({ ...p, [key]: val }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/seo-settings", {
        method: "POST",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-[20px] font-bold text-[#2e263d]">SEO Settings</h1>
        <p className="text-[13px] text-[#6b7280] mt-1">
          Configure global search engine optimization settings for your website
        </p>
      </div>

      {/* Site Identity */}
      <div className="bg-white border border-[#e0e3e8] rounded-xl p-5 space-y-4">
        <h2 className="text-[15px] font-semibold text-[#2e263d]">Site Identity</h2>
        <BilingualInput
          label="Site Name"
          valueEn={data.siteNameEn}
          valueAr={data.siteNameAr}
          onChangeEn={(v) => set("siteNameEn", v)}
          onChangeAr={(v) => set("siteNameAr", v)}
        />
        <BilingualInput
          label="Default Page Title"
          valueEn={data.defaultTitleEn}
          valueAr={data.defaultTitleAr}
          onChangeEn={(v) => set("defaultTitleEn", v)}
          onChangeAr={(v) => set("defaultTitleAr", v)}
        />
        <BilingualTextarea
          label="Default Meta Description"
          valueEn={data.defaultDescriptionEn}
          valueAr={data.defaultDescriptionAr}
          onChangeEn={(v) => set("defaultDescriptionEn", v)}
          onChangeAr={(v) => set("defaultDescriptionAr", v)}
          rows={3}
        />
        <ImageUploader
          label="Default OG Image (1200x630)"
          currentImage={data.defaultOgImageUrl}
          onUpload={(url) => set("defaultOgImageUrl", url)}
        />
      </div>

      {/* Verification & Analytics */}
      <div className="bg-white border border-[#e0e3e8] rounded-xl p-5 space-y-4">
        <h2 className="text-[15px] font-semibold text-[#2e263d]">Verification & Analytics</h2>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Google Search Console Verification Code
          </label>
          <input
            type="text"
            value={data.googleVerification}
            onChange={(e) => set("googleVerification", e.target.value)}
            placeholder="e.g. abc123xyz"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
          <p className="text-[11px] text-[#a0a5af]">
            Enter only the content value from the meta tag verification code
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#2e263d]">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={data.analyticsId}
            onChange={(e) => set("analyticsId", e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-[13px] font-semibold text-blue-800 mb-1">How SEO Works</h3>
        <ul className="text-[12px] text-blue-700 space-y-1">
          <li>- Each blog article, video, and economic development has its own SEO fields in its editor form</li>
          <li>- If SEO fields are left empty, the article title and excerpt are used automatically</li>
          <li>- The sitemap at <code className="bg-blue-100 px-1 rounded">/sitemap.xml</code> is generated automatically</li>
          <li>- The robots file at <code className="bg-blue-100 px-1 rounded">/robots.txt</code> blocks admin and auth pages from indexing</li>
          <li>- JSON-LD structured data is added to blog articles, FAQ, and financial asset pages</li>
        </ul>
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
