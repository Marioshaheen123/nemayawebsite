"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

export default function CustomerReviewsEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setContent = (lang: "en" | "ar", key: string, val: any) =>
    setData((p: any) => ({ ...p, content: { ...p.content, [lang]: { ...p.content[lang], [key]: val } } }));

  const setReview = (index: number, key: string, val: any) => {
    setData((p: any) => {
      const reviews = [...p.reviews];
      reviews[index] = { ...reviews[index], [key]: val };
      return { ...p, reviews };
    });
  };

  const addReview = () => {
    setData((p: any) => ({
      ...p,
      reviews: [...p.reviews, { stars: 5, badgeEn: "", badgeAr: "", textEn: "", textAr: "", authorEn: "", authorAr: "" }],
    }));
  };

  const removeReview = (index: number) => {
    setData((p: any) => ({ ...p, reviews: p.reviews.filter((_: any, i: number) => i !== index) }));
  };

  const moveReview = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.reviews.length) return;
    setData((p: any) => {
      const reviews = [...p.reviews];
      [reviews[index], reviews[newIndex]] = [reviews[newIndex], reviews[index]];
      return { ...p, reviews };
    });
  };

  const setVideo = (index: number, key: string, val: any) => {
    setData((p: any) => {
      const videos = [...p.videos];
      videos[index] = { ...videos[index], [key]: val };
      return { ...p, videos };
    });
  };

  const addVideo = () => {
    setData((p: any) => ({
      ...p,
      videos: [...p.videos, { youtubeUrl: "", captionEn: "", captionAr: "" }],
    }));
  };

  const removeVideo = (index: number) => {
    setData((p: any) => ({ ...p, videos: p.videos.filter((_: any, i: number) => i !== index) }));
  };

  const moveVideo = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.videos.length) return;
    setData((p: any) => {
      const videos = [...p.videos];
      [videos[index], videos[newIndex]] = [videos[newIndex], videos[index]];
      return { ...p, videos };
    });
  };

  const setFaq = (index: number, key: string, val: any) => {
    setData((p: any) => {
      const faqs = [...p.faqs];
      faqs[index] = { ...faqs[index], [key]: val };
      return { ...p, faqs };
    });
  };

  const addFaq = () => {
    setData((p: any) => ({
      ...p,
      faqs: [...p.faqs, { questionEn: "", questionAr: "", answerEn: "", answerAr: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setData((p: any) => ({ ...p, faqs: p.faqs.filter((_: any, i: number) => i !== index) }));
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.faqs.length) return;
    setData((p: any) => {
      const faqs = [...p.faqs];
      [faqs[index], faqs[newIndex]] = [faqs[newIndex], faqs[index]];
      return { ...p, faqs };
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/customer-reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  }, [data]);

  const UpDownRemove = ({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (i: number, d: -1 | 1) => void; onRemove: (i: number) => void }) => (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
      <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      <button type="button" onClick={() => onRemove(index)} className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Hero Section ────────────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2">Hero Section</h3>

      <BilingualInput label="Hero Title" valueEn={data.content?.en?.heroTitle || ""} valueAr={data.content?.ar?.heroTitle || ""} onChangeEn={(v) => setContent("en", "heroTitle", v)} onChangeAr={(v) => setContent("ar", "heroTitle", v)} />

      <BilingualTextarea label="Hero Subtitle" valueEn={data.content?.en?.heroSubtitle || ""} valueAr={data.content?.ar?.heroSubtitle || ""} onChangeEn={(v) => setContent("en", "heroSubtitle", v)} onChangeAr={(v) => setContent("ar", "heroSubtitle", v)} rows={2} />

      <BilingualInput label="CTA Button 1 Text" valueEn={data.content?.en?.heroCta1Text || ""} valueAr={data.content?.ar?.heroCta1Text || ""} onChangeEn={(v) => setContent("en", "heroCta1Text", v)} onChangeAr={(v) => setContent("ar", "heroCta1Text", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">CTA Button 1 URL</label>
        <input type="text" value={data.content?.en?.heroCta1Url || ""} onChange={(e) => { setContent("en", "heroCta1Url", e.target.value); setContent("ar", "heroCta1Url", e.target.value); }} placeholder="/register" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      <BilingualInput label="CTA Button 2 Text" valueEn={data.content?.en?.heroCta2Text || ""} valueAr={data.content?.ar?.heroCta2Text || ""} onChangeEn={(v) => setContent("en", "heroCta2Text", v)} onChangeAr={(v) => setContent("ar", "heroCta2Text", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">CTA Button 2 URL</label>
        <input type="text" value={data.content?.en?.heroCta2Url || ""} onChange={(e) => { setContent("en", "heroCta2Url", e.target.value); setContent("ar", "heroCta2Url", e.target.value); }} placeholder="/contact" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      {/* ── Trustpilot Settings ─────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Trustpilot Settings</h3>

      <BilingualInput label="Trustpilot Score" valueEn={data.content?.en?.trustpilotScore || ""} valueAr={data.content?.ar?.trustpilotScore || ""} onChangeEn={(v) => { setContent("en", "trustpilotScore", v); setContent("ar", "trustpilotScore", v); }} onChangeAr={(v) => { setContent("en", "trustpilotScore", v); setContent("ar", "trustpilotScore", v); }} />

      <BilingualInput label="Trustpilot Label" valueEn={data.content?.en?.trustpilotLabel || ""} valueAr={data.content?.ar?.trustpilotLabel || ""} onChangeEn={(v) => setContent("en", "trustpilotLabel", v)} onChangeAr={(v) => setContent("ar", "trustpilotLabel", v)} />

      <BilingualInput label="Trustpilot Total Text" valueEn={data.content?.en?.trustpilotTotal || ""} valueAr={data.content?.ar?.trustpilotTotal || ""} onChangeEn={(v) => setContent("en", "trustpilotTotal", v)} onChangeAr={(v) => setContent("ar", "trustpilotTotal", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Rating Distribution (JSON array: [5star%, 4star%, 3star%, 2star%, 1star%])</label>
        <input type="text" value={data.content?.en?.ratingBars || "[85,10,0,5,0]"} onChange={(e) => { setContent("en", "ratingBars", e.target.value); setContent("ar", "ratingBars", e.target.value); }} placeholder="[85,10,0,5,0]" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      {/* ── Reviews Section ─────────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Reviews Section</h3>

      <BilingualInput label="Reviews Section Title" valueEn={data.content?.en?.reviewsSectionTitle || ""} valueAr={data.content?.ar?.reviewsSectionTitle || ""} onChangeEn={(v) => setContent("en", "reviewsSectionTitle", v)} onChangeAr={(v) => setContent("ar", "reviewsSectionTitle", v)} />

      <BilingualInput label="Show More Button Text" valueEn={data.content?.en?.reviewsShowMore || ""} valueAr={data.content?.ar?.reviewsShowMore || ""} onChangeEn={(v) => setContent("en", "reviewsShowMore", v)} onChangeAr={(v) => setContent("ar", "reviewsShowMore", v)} />

      {(data.reviews || []).map((review: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#a0a5af] font-medium">Review #{i + 1}</div>
            <UpDownRemove index={i} total={data.reviews.length} onMove={moveReview} onRemove={removeReview} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">Stars (1-5)</label>
            <input type="number" min="1" max="5" value={review.stars || 5} onChange={(e) => setReview(i, "stars", parseInt(e.target.value) || 5)} className="w-[80px] px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
          </div>

          <BilingualInput label="Badge" valueEn={review.badgeEn || ""} valueAr={review.badgeAr || ""} onChangeEn={(v) => setReview(i, "badgeEn", v)} onChangeAr={(v) => setReview(i, "badgeAr", v)} />

          <BilingualTextarea label="Review Text" valueEn={review.textEn || ""} valueAr={review.textAr || ""} onChangeEn={(v) => setReview(i, "textEn", v)} onChangeAr={(v) => setReview(i, "textAr", v)} rows={3} />

          <BilingualInput label="Author Name" valueEn={review.authorEn || ""} valueAr={review.authorAr || ""} onChangeEn={(v) => setReview(i, "authorEn", v)} onChangeAr={(v) => setReview(i, "authorAr", v)} />
        </div>
      ))}

      <button type="button" onClick={addReview} className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Review
      </button>

      {/* ── Video Testimonials ──────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Video Testimonials</h3>

      <BilingualInput label="Videos Section Title" valueEn={data.content?.en?.videosSectionTitle || ""} valueAr={data.content?.ar?.videosSectionTitle || ""} onChangeEn={(v) => setContent("en", "videosSectionTitle", v)} onChangeAr={(v) => setContent("ar", "videosSectionTitle", v)} />

      {(data.videos || []).map((video: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#a0a5af] font-medium">Video #{i + 1}</div>
            <UpDownRemove index={i} total={data.videos.length} onMove={moveVideo} onRemove={removeVideo} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">YouTube URL</label>
            <input type="text" value={video.youtubeUrl || ""} onChange={(e) => setVideo(i, "youtubeUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
          </div>

          <BilingualInput label="Caption" valueEn={video.captionEn || ""} valueAr={video.captionAr || ""} onChangeEn={(v) => setVideo(i, "captionEn", v)} onChangeAr={(v) => setVideo(i, "captionAr", v)} />
        </div>
      ))}

      <button type="button" onClick={addVideo} className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Video
      </button>

      {/* ── FAQ Section ─────────────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">FAQ Section</h3>

      {(data.faqs || []).map((faq: any, i: number) => (
        <div key={i} className="bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#a0a5af] font-medium">FAQ #{i + 1}</div>
            <UpDownRemove index={i} total={data.faqs.length} onMove={moveFaq} onRemove={removeFaq} />
          </div>

          <BilingualInput label="Question" valueEn={faq.questionEn || ""} valueAr={faq.questionAr || ""} onChangeEn={(v) => setFaq(i, "questionEn", v)} onChangeAr={(v) => setFaq(i, "questionAr", v)} />

          <BilingualTextarea label="Answer" valueEn={faq.answerEn || ""} valueAr={faq.answerAr || ""} onChangeEn={(v) => setFaq(i, "answerEn", v)} onChangeAr={(v) => setFaq(i, "answerAr", v)} rows={3} />
        </div>
      ))}

      <button type="button" onClick={addFaq} className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add FAQ
      </button>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">CTA Banner</h3>

      <BilingualInput label="Banner Title" valueEn={data.content?.en?.ctaBannerTitle || ""} valueAr={data.content?.ar?.ctaBannerTitle || ""} onChangeEn={(v) => setContent("en", "ctaBannerTitle", v)} onChangeAr={(v) => setContent("ar", "ctaBannerTitle", v)} />

      <BilingualTextarea label="Banner Subtitle" valueEn={data.content?.en?.ctaBannerSubtitle || ""} valueAr={data.content?.ar?.ctaBannerSubtitle || ""} onChangeEn={(v) => setContent("en", "ctaBannerSubtitle", v)} onChangeAr={(v) => setContent("ar", "ctaBannerSubtitle", v)} rows={2} />

      <BilingualInput label="Banner CTA 1 Text" valueEn={data.content?.en?.ctaBtn1Text || ""} valueAr={data.content?.ar?.ctaBtn1Text || ""} onChangeEn={(v) => setContent("en", "ctaBtn1Text", v)} onChangeAr={(v) => setContent("ar", "ctaBtn1Text", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Banner CTA 1 URL</label>
        <input type="text" value={data.content?.en?.ctaBtn1Url || ""} onChange={(e) => { setContent("en", "ctaBtn1Url", e.target.value); setContent("ar", "ctaBtn1Url", e.target.value); }} placeholder="/register" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      <BilingualInput label="Banner CTA 2 Text" valueEn={data.content?.en?.ctaBtn2Text || ""} valueAr={data.content?.ar?.ctaBtn2Text || ""} onChangeEn={(v) => setContent("en", "ctaBtn2Text", v)} onChangeAr={(v) => setContent("ar", "ctaBtn2Text", v)} />

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-[#2e263d]">Banner CTA 2 URL</label>
        <input type="text" value={data.content?.en?.ctaBtn2Url || ""} onChange={(e) => { setContent("en", "ctaBtn2Url", e.target.value); setContent("ar", "ctaBtn2Url", e.target.value); }} placeholder="/contact" className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
      </div>

      {/* ── Disclaimer ──────────────────────────────────────── */}
      <h3 className="text-[15px] font-semibold text-[#2e263d] border-b border-[#e8ecf1] pb-2 pt-2">Disclaimer</h3>

      <BilingualTextarea label="Disclaimer Text" valueEn={data.content?.en?.disclaimerText || ""} valueAr={data.content?.ar?.disclaimerText || ""} onChangeEn={(v) => setContent("en", "disclaimerText", v)} onChangeAr={(v) => setContent("ar", "disclaimerText", v)} rows={2} />

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
