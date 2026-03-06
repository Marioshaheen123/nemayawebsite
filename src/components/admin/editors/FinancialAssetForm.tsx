"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";

interface InstrumentRow {
  nameEn: string; nameAr: string; symbol: string; spread: string; leverage: string; hours: string; sortOrder: number;
}
interface AdvantageRow {
  titleEn: string; titleAr: string; descEn: string; descAr: string; sortOrder: number;
}
interface FaqRow {
  questionEn: string; questionAr: string; answerEn: string; answerAr: string; sortOrder: number;
}

interface AssetFormData {
  slug: string;
  nameEn: string; nameAr: string;
  headlineEn: string; headlineAr: string;
  descriptionEn: string; descriptionAr: string;
  imageUrl: string;
  statsEn: string; statsAr: string;
  whatIsEn: string; whatIsAr: string;
  sortOrder: number;
  metaTitleEn: string; metaTitleAr: string;
  metaDescriptionEn: string; metaDescriptionAr: string;
  ogImageUrl: string; keywords: string;
  instruments: InstrumentRow[];
  advantages: AdvantageRow[];
  faqs: FaqRow[];
}

const EMPTY_INSTRUMENT: InstrumentRow = { nameEn: "", nameAr: "", symbol: "", spread: "", leverage: "", hours: "", sortOrder: 0 };
const EMPTY_ADVANTAGE: AdvantageRow = { titleEn: "", titleAr: "", descEn: "", descAr: "", sortOrder: 0 };
const EMPTY_FAQ: FaqRow = { questionEn: "", questionAr: "", answerEn: "", answerAr: "", sortOrder: 0 };

function parseJsonArray(val: string): string[] {
  try { const a = JSON.parse(val); return Array.isArray(a) ? a : []; } catch { return []; }
}

function buildInitial(d?: any): AssetFormData {
  if (!d) return {
    slug: "", nameEn: "", nameAr: "", headlineEn: "", headlineAr: "",
    descriptionEn: "", descriptionAr: "", imageUrl: "",
    statsEn: "", statsAr: "", whatIsEn: "", whatIsAr: "",
    sortOrder: 0, metaTitleEn: "", metaTitleAr: "",
    metaDescriptionEn: "", metaDescriptionAr: "", ogImageUrl: "", keywords: "",
    instruments: [], advantages: [], faqs: [],
  };
  return {
    slug: d.slug || "",
    nameEn: d.nameEn || "", nameAr: d.nameAr || "",
    headlineEn: d.headlineEn || "", headlineAr: d.headlineAr || "",
    descriptionEn: d.descriptionEn || "", descriptionAr: d.descriptionAr || "",
    imageUrl: d.imageUrl || "",
    statsEn: parseJsonArray(d.statsEn).join(", "),
    statsAr: parseJsonArray(d.statsAr).join(", "),
    whatIsEn: parseJsonArray(d.whatIsEn).join("\n\n"),
    whatIsAr: parseJsonArray(d.whatIsAr).join("\n\n"),
    sortOrder: d.sortOrder || 0,
    metaTitleEn: d.metaTitleEn || "", metaTitleAr: d.metaTitleAr || "",
    metaDescriptionEn: d.metaDescriptionEn || "", metaDescriptionAr: d.metaDescriptionAr || "",
    ogImageUrl: d.ogImageUrl || "", keywords: d.keywords || "",
    instruments: (d.instruments || []).map((i: any) => ({
      nameEn: i.nameEn, nameAr: i.nameAr, symbol: i.symbol,
      spread: i.spread, leverage: i.leverage, hours: i.hours, sortOrder: i.sortOrder || 0,
    })),
    advantages: (d.advantages || []).map((a: any) => ({
      titleEn: a.titleEn, titleAr: a.titleAr, descEn: a.descEn, descAr: a.descAr, sortOrder: a.sortOrder || 0,
    })),
    faqs: (d.faqs || []).map((f: any) => ({
      questionEn: f.questionEn, questionAr: f.questionAr, answerEn: f.answerEn, answerAr: f.answerAr, sortOrder: f.sortOrder || 0,
    })),
  };
}

function toPayload(form: AssetFormData) {
  return {
    ...form,
    statsEn: JSON.stringify(form.statsEn.split(",").map((s) => s.trim()).filter(Boolean)),
    statsAr: JSON.stringify(form.statsAr.split(",").map((s) => s.trim()).filter(Boolean)),
    whatIsEn: JSON.stringify(form.whatIsEn.split("\n\n").map((s) => s.trim()).filter(Boolean)),
    whatIsAr: JSON.stringify(form.whatIsAr.split("\n\n").map((s) => s.trim()).filter(Boolean)),
    metaTitleEn: form.metaTitleEn || null,
    metaTitleAr: form.metaTitleAr || null,
    metaDescriptionEn: form.metaDescriptionEn || null,
    metaDescriptionAr: form.metaDescriptionAr || null,
    ogImageUrl: form.ogImageUrl || null,
    keywords: form.keywords || null,
  };
}

// ─── Styles ──────────────────────────────────────────────────────
const inputCls = "w-full border border-[#e0e3e8] rounded-lg px-3 py-2 text-[13px] text-[#2e263d] placeholder:text-[#a0a5af] focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-[12px] font-medium text-[#6b7280] mb-1";
const sectionCls = "bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-4";

export default function FinancialAssetForm({ mode, initialData }: { mode: "create" | "edit"; initialData?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<AssetFormData>(buildInitial(initialData));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

  const set = <K extends keyof AssetFormData>(key: K, value: AssetFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const payload = toPayload(form);
      const url = mode === "create" ? "/api/admin/financial-assets" : `/api/admin/financial-assets/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Save failed");
        setStatus("error");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/financial-assets/${data.id}`);
      } else {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch {
      setErrorMsg("Network error");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  // ─── Nested list helpers ───────────────────────────────────────
  const updateInstrument = (idx: number, key: keyof InstrumentRow, val: string | number) => {
    const next = [...form.instruments];
    next[idx] = { ...next[idx], [key]: val };
    set("instruments", next);
  };
  const addInstrument = () => set("instruments", [...form.instruments, { ...EMPTY_INSTRUMENT, sortOrder: form.instruments.length }]);
  const removeInstrument = (idx: number) => set("instruments", form.instruments.filter((_, i) => i !== idx));

  const updateAdvantage = (idx: number, key: keyof AdvantageRow, val: string | number) => {
    const next = [...form.advantages];
    next[idx] = { ...next[idx], [key]: val };
    set("advantages", next);
  };
  const addAdvantage = () => set("advantages", [...form.advantages, { ...EMPTY_ADVANTAGE, sortOrder: form.advantages.length }]);
  const removeAdvantage = (idx: number) => set("advantages", form.advantages.filter((_, i) => i !== idx));

  const updateFaq = (idx: number, key: keyof FaqRow, val: string | number) => {
    const next = [...form.faqs];
    next[idx] = { ...next[idx], [key]: val };
    set("faqs", next);
  };
  const addFaq = () => set("faqs", [...form.faqs, { ...EMPTY_FAQ, sortOrder: form.faqs.length }]);
  const removeFaq = (idx: number) => set("faqs", form.faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5 max-w-[960px]">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/admin/financial-assets")} className="text-[13px] text-accent hover:underline cursor-pointer">
          &larr; Back to Assets
        </button>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-[12px] text-emerald-600">Saved!</span>}
          {status === "error" && <span className="text-[12px] text-red-500">{errorMsg}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving..." : mode === "create" ? "Create Asset" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ═══ General Info ═══ */}
      <div className={sectionCls}>
        <h3 className="text-[14px] font-semibold text-[#2e263d]">General Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. forex" />
          </div>
          <div>
            <label className={labelCls}>Sort Order</label>
            <input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name (EN)</label>
            <input className={inputCls} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Name (AR)</label>
            <input className={inputCls} dir="rtl" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Headline (EN)</label>
            <input className={inputCls} value={form.headlineEn} onChange={(e) => set("headlineEn", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Headline (AR)</label>
            <input className={inputCls} dir="rtl" value={form.headlineAr} onChange={(e) => set("headlineAr", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Description (EN)</label>
            <textarea className={inputCls} rows={3} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Description (AR)</label>
            <textarea className={inputCls} dir="rtl" rows={3} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input className={inputCls} value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/forex.png" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Stats (EN) <span className="text-[#a0a5af]">— comma-separated</span></label>
            <input className={inputCls} value={form.statsEn} onChange={(e) => set("statsEn", e.target.value)} placeholder="60+ pairs, Tight spreads" />
          </div>
          <div>
            <label className={labelCls}>Stats (AR) <span className="text-[#a0a5af]">— comma-separated</span></label>
            <input className={inputCls} dir="rtl" value={form.statsAr} onChange={(e) => set("statsAr", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ═══ What Is Section ═══ */}
      <div className={sectionCls}>
        <h3 className="text-[14px] font-semibold text-[#2e263d]">&ldquo;What Is&rdquo; Section <span className="text-[#a0a5af] font-normal">— separate paragraphs with blank lines</span></h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Content (EN)</label>
            <textarea className={inputCls} rows={6} value={form.whatIsEn} onChange={(e) => set("whatIsEn", e.target.value)} placeholder={"Paragraph one...\n\nParagraph two..."} />
          </div>
          <div>
            <label className={labelCls}>Content (AR)</label>
            <textarea className={inputCls} dir="rtl" rows={6} value={form.whatIsAr} onChange={(e) => set("whatIsAr", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ═══ Instruments Table ═══ */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#2e263d]">Instruments <span className="text-[#a0a5af] font-normal">({form.instruments.length})</span></h3>
          <button onClick={addInstrument} className="text-[12px] font-medium text-accent hover:text-accent-dark cursor-pointer">+ Add Instrument</button>
        </div>
        {form.instruments.length === 0 ? (
          <p className="text-[12px] text-[#a0a5af] py-4 text-center">No instruments. Click &ldquo;Add Instrument&rdquo; to add one.</p>
        ) : (
          <div className="space-y-3">
            {form.instruments.map((inst, idx) => (
              <div key={idx} className="bg-[#f9fafb] rounded-lg p-3 border border-[#e8ecf1] relative">
                <button onClick={() => removeInstrument(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-[16px] leading-none cursor-pointer">&times;</button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className={labelCls}>Name (EN)</label>
                    <input className={inputCls} value={inst.nameEn} onChange={(e) => updateInstrument(idx, "nameEn", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Name (AR)</label>
                    <input className={inputCls} dir="rtl" value={inst.nameAr} onChange={(e) => updateInstrument(idx, "nameAr", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <label className={labelCls}>Symbol</label>
                    <input className={inputCls} value={inst.symbol} onChange={(e) => updateInstrument(idx, "symbol", e.target.value)} placeholder="EUR/USD" />
                  </div>
                  <div>
                    <label className={labelCls}>Spread</label>
                    <input className={inputCls} value={inst.spread} onChange={(e) => updateInstrument(idx, "spread", e.target.value)} placeholder="0.1" />
                  </div>
                  <div>
                    <label className={labelCls}>Leverage</label>
                    <input className={inputCls} value={inst.leverage} onChange={(e) => updateInstrument(idx, "leverage", e.target.value)} placeholder="1:500" />
                  </div>
                  <div>
                    <label className={labelCls}>Hours</label>
                    <input className={inputCls} value={inst.hours} onChange={(e) => updateInstrument(idx, "hours", e.target.value)} placeholder="24/5" />
                  </div>
                  <div>
                    <label className={labelCls}>Order</label>
                    <input type="number" className={inputCls} value={inst.sortOrder} onChange={(e) => updateInstrument(idx, "sortOrder", parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Advantages ═══ */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#2e263d]">Advantages <span className="text-[#a0a5af] font-normal">({form.advantages.length})</span></h3>
          <button onClick={addAdvantage} className="text-[12px] font-medium text-accent hover:text-accent-dark cursor-pointer">+ Add Advantage</button>
        </div>
        {form.advantages.length === 0 ? (
          <p className="text-[12px] text-[#a0a5af] py-4 text-center">No advantages. Click &ldquo;Add Advantage&rdquo; to add one.</p>
        ) : (
          <div className="space-y-3">
            {form.advantages.map((adv, idx) => (
              <div key={idx} className="bg-[#f9fafb] rounded-lg p-3 border border-[#e8ecf1] relative">
                <button onClick={() => removeAdvantage(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-[16px] leading-none cursor-pointer">&times;</button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className={labelCls}>Title (EN)</label>
                    <input className={inputCls} value={adv.titleEn} onChange={(e) => updateAdvantage(idx, "titleEn", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Title (AR)</label>
                    <input className={inputCls} dir="rtl" value={adv.titleAr} onChange={(e) => updateAdvantage(idx, "titleAr", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Description (EN)</label>
                    <textarea className={inputCls} rows={2} value={adv.descEn} onChange={(e) => updateAdvantage(idx, "descEn", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Description (AR)</label>
                    <textarea className={inputCls} dir="rtl" rows={2} value={adv.descAr} onChange={(e) => updateAdvantage(idx, "descAr", e.target.value)} />
                  </div>
                </div>
                <div className="mt-2 w-24">
                  <label className={labelCls}>Order</label>
                  <input type="number" className={inputCls} value={adv.sortOrder} onChange={(e) => updateAdvantage(idx, "sortOrder", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ FAQ ═══ */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#2e263d]">FAQ <span className="text-[#a0a5af] font-normal">({form.faqs.length})</span></h3>
          <button onClick={addFaq} className="text-[12px] font-medium text-accent hover:text-accent-dark cursor-pointer">+ Add FAQ</button>
        </div>
        {form.faqs.length === 0 ? (
          <p className="text-[12px] text-[#a0a5af] py-4 text-center">No FAQs. Click &ldquo;Add FAQ&rdquo; to add one.</p>
        ) : (
          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#f9fafb] rounded-lg p-3 border border-[#e8ecf1] relative">
                <button onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-[16px] leading-none cursor-pointer">&times;</button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className={labelCls}>Question (EN)</label>
                    <input className={inputCls} value={faq.questionEn} onChange={(e) => updateFaq(idx, "questionEn", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Question (AR)</label>
                    <input className={inputCls} dir="rtl" value={faq.questionAr} onChange={(e) => updateFaq(idx, "questionAr", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Answer (EN)</label>
                    <textarea className={inputCls} rows={3} value={faq.answerEn} onChange={(e) => updateFaq(idx, "answerEn", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Answer (AR)</label>
                    <textarea className={inputCls} dir="rtl" rows={3} value={faq.answerAr} onChange={(e) => updateFaq(idx, "answerAr", e.target.value)} />
                  </div>
                </div>
                <div className="mt-2 w-24">
                  <label className={labelCls}>Order</label>
                  <input type="number" className={inputCls} value={faq.sortOrder} onChange={(e) => updateFaq(idx, "sortOrder", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ SEO ═══ */}
      <div className={sectionCls}>
        <button onClick={() => setSeoOpen(!seoOpen)} className="flex items-center gap-2 text-[14px] font-semibold text-[#2e263d] cursor-pointer w-full">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${seoOpen ? "rotate-90" : ""}`}>
            <path d="M9 18l6-6-6-6" />
          </svg>
          SEO Settings
        </button>
        {seoOpen && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Meta Title (EN)</label>
                <input className={inputCls} value={form.metaTitleEn} onChange={(e) => set("metaTitleEn", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Meta Title (AR)</label>
                <input className={inputCls} dir="rtl" value={form.metaTitleAr} onChange={(e) => set("metaTitleAr", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Meta Description (EN)</label>
                <textarea className={inputCls} rows={2} value={form.metaDescriptionEn} onChange={(e) => set("metaDescriptionEn", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Meta Description (AR)</label>
                <textarea className={inputCls} dir="rtl" rows={2} value={form.metaDescriptionAr} onChange={(e) => set("metaDescriptionAr", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>OG Image URL</label>
                <input className={inputCls} value={form.ogImageUrl} onChange={(e) => set("ogImageUrl", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Keywords <span className="text-[#a0a5af]">— comma-separated</span></label>
                <input className={inputCls} value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end gap-3 pb-8">
        {status === "saved" && <span className="text-[12px] text-emerald-600 self-center">Saved!</span>}
        {status === "error" && <span className="text-[12px] text-red-500 self-center">{errorMsg}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Asset" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
