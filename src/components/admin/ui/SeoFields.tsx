"use client";

import { useState } from "react";
import BilingualInput from "./BilingualInput";
import BilingualTextarea from "./BilingualTextarea";
import ImageUploader from "./ImageUploader";

export interface SeoData {
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  ogImageUrl: string;
  keywords: string;
}

export const EMPTY_SEO: SeoData = {
  metaTitleEn: "",
  metaTitleAr: "",
  metaDescriptionEn: "",
  metaDescriptionAr: "",
  ogImageUrl: "",
  keywords: "",
};

interface SeoFieldsProps {
  data: SeoData;
  onChange: (key: keyof SeoData, value: string) => void;
  /** Shown as gray placeholder in the title fields */
  titleFallback?: { en?: string; ar?: string };
  /** Shown as gray placeholder in the description fields */
  descriptionFallback?: { en?: string; ar?: string };
}

export default function SeoFields({
  data,
  onChange,
  titleFallback,
  descriptionFallback,
}: SeoFieldsProps) {
  const [open, setOpen] = useState(false);

  // Character count helpers
  const titleEnLen = data.metaTitleEn.length;
  const titleArLen = data.metaTitleAr.length;
  const descEnLen = data.metaDescriptionEn.length;
  const descArLen = data.metaDescriptionAr.length;

  // Preview title/description (use override or fallback)
  const previewTitle = data.metaTitleAr || titleFallback?.ar || "Page Title";
  const previewDesc =
    data.metaDescriptionAr || descriptionFallback?.ar || "Page description will appear here...";

  return (
    <div className="border border-[#e0e3e8] rounded-xl overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f9fafb] hover:bg-[#f4f5fa] transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 text-[13.5px] font-semibold text-[#2e263d]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          SEO Settings
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="p-4 space-y-4 border-t border-[#e0e3e8]">
          {/* Google SERP Preview */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#a0a5af]">
              Search Preview
            </label>
            <div className="border border-[#e0e3e8] rounded-lg p-3 bg-white">
              <div className="text-[16px] text-[#1a0dab] font-medium leading-snug line-clamp-1" dir="rtl">
                {previewTitle}
              </div>
              <div className="text-[12px] text-[#006621] mt-0.5">
                namaya.com
              </div>
              <div className="text-[13px] text-[#545454] mt-1 line-clamp-2 leading-snug" dir="rtl">
                {previewDesc}
              </div>
            </div>
          </div>

          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#2e263d]">
                Meta Title
              </label>
              <span className="text-[11px] text-[#a0a5af]">
                EN: {titleEnLen}/60 &middot; AR: {titleArLen}/60
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#a0a5af] mb-1 block">English</span>
                <input
                  type="text"
                  value={data.metaTitleEn}
                  onChange={(e) => onChange("metaTitleEn", e.target.value)}
                  placeholder={titleFallback?.en || "Auto-generated from title"}
                  dir="ltr"
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all ${
                    titleEnLen > 60 ? "border-amber-400" : "border-[#e0e3e8]"
                  }`}
                />
              </div>
              <div>
                <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic</span>
                <input
                  type="text"
                  value={data.metaTitleAr}
                  onChange={(e) => onChange("metaTitleAr", e.target.value)}
                  placeholder={titleFallback?.ar || "يتم إنشاؤه تلقائياً من العنوان"}
                  dir="rtl"
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all ${
                    titleArLen > 60 ? "border-amber-400" : "border-[#e0e3e8]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#2e263d]">
                Meta Description
              </label>
              <span className="text-[11px] text-[#a0a5af]">
                EN: {descEnLen}/160 &middot; AR: {descArLen}/160
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#a0a5af] mb-1 block">English</span>
                <textarea
                  value={data.metaDescriptionEn}
                  onChange={(e) => onChange("metaDescriptionEn", e.target.value)}
                  placeholder={descriptionFallback?.en || "Auto-generated from excerpt"}
                  dir="ltr"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-y ${
                    descEnLen > 160 ? "border-amber-400" : "border-[#e0e3e8]"
                  }`}
                />
              </div>
              <div>
                <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic</span>
                <textarea
                  value={data.metaDescriptionAr}
                  onChange={(e) => onChange("metaDescriptionAr", e.target.value)}
                  placeholder={descriptionFallback?.ar || "يتم إنشاؤه تلقائياً من المقتطف"}
                  dir="rtl"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-y ${
                    descArLen > 160 ? "border-amber-400" : "border-[#e0e3e8]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* OG Image */}
          <ImageUploader
            label="Open Graph Image (1200x630)"
            currentImage={data.ogImageUrl}
            onUpload={(url) => onChange("ogImageUrl", url)}
          />

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">
              Keywords
            </label>
            <p className="text-[11px] text-[#a0a5af]">Comma-separated keywords for search engines</p>
            <input
              type="text"
              value={data.keywords}
              onChange={(e) => onChange("keywords", e.target.value)}
              placeholder="trading, investment, forex, stocks"
              className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
