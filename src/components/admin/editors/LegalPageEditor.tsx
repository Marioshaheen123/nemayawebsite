"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "@/components/admin/ui/BilingualInput";
import BilingualTextarea from "@/components/admin/ui/BilingualTextarea";
import SaveButton from "@/components/admin/ui/SaveButton";

interface Section {
  id: string;
  titleEn: string;
  titleAr: string;
  paragraphsEn: string[];
  paragraphsAr: string[];
}

interface LegalPageData {
  heroTitle: { en: string; ar: string };
  sections: Section[];
}

interface Props {
  initialData: LegalPageData;
  pageType: "privacy" | "terms" | "deposit-withdrawal" | "website-verification" | "security-reliability";
}

function parseParagraphs(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return raw ? [raw] : [];
    }
  }
  return [];
}

export default function LegalPageEditor({ initialData, pageType }: Props) {
  const [heroTitle, setHeroTitle] = useState(initialData.heroTitle);
  const [sections, setSections] = useState<Section[]>(() =>
    initialData.sections.map((s: any) => ({
      id: s.id,
      titleEn: s.titleEn || "",
      titleAr: s.titleAr || "",
      paragraphsEn: parseParagraphs(s.paragraphsEn),
      paragraphsAr: parseParagraphs(s.paragraphsAr),
    }))
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.id))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const updateSection = useCallback((index: number, field: string, value: any) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addSection = useCallback(() => {
    const id = `new_${Date.now()}`;
    setSections((prev) => [
      ...prev,
      { id, titleEn: "", titleAr: "", paragraphsEn: [""], paragraphsAr: [""] },
    ]);
    setExpandedSections((prev) => new Set(prev).add(id));
  }, []);

  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveSection = useCallback((index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  // Paragraph operations
  const updateParagraph = useCallback(
    (sectionIdx: number, lang: "En" | "Ar", paraIdx: number, value: string) => {
      setSections((prev) => {
        const next = [...prev];
        const field = `paragraphs${lang}` as "paragraphsEn" | "paragraphsAr";
        const paras = [...next[sectionIdx][field]];
        paras[paraIdx] = value;
        next[sectionIdx] = { ...next[sectionIdx], [field]: paras };
        return next;
      });
    },
    []
  );

  const addParagraph = useCallback((sectionIdx: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[sectionIdx] = {
        ...next[sectionIdx],
        paragraphsEn: [...next[sectionIdx].paragraphsEn, ""],
        paragraphsAr: [...next[sectionIdx].paragraphsAr, ""],
      };
      return next;
    });
  }, []);

  const removeParagraph = useCallback((sectionIdx: number, paraIdx: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[sectionIdx] = {
        ...next[sectionIdx],
        paragraphsEn: next[sectionIdx].paragraphsEn.filter((_, i) => i !== paraIdx),
        paragraphsAr: next[sectionIdx].paragraphsAr.filter((_, i) => i !== paraIdx),
      };
      return next;
    });
  }, []);

  const moveParagraph = useCallback(
    (sectionIdx: number, paraIdx: number, direction: -1 | 1) => {
      setSections((prev) => {
        const next = [...prev];
        const sec = { ...next[sectionIdx] };
        const target = paraIdx + direction;

        const enParas = [...sec.paragraphsEn];
        const arParas = [...sec.paragraphsAr];
        if (target < 0 || target >= enParas.length) return prev;

        [enParas[paraIdx], enParas[target]] = [enParas[target], enParas[paraIdx]];
        [arParas[paraIdx], arParas[target]] = [arParas[target], arParas[paraIdx]];

        sec.paragraphsEn = enParas;
        sec.paragraphsAr = arParas;
        next[sectionIdx] = sec;
        return next;
      });
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        pageType,
        heroTitle,
        sections: sections.map((s) => ({
          id: s.id,
          titleEn: s.titleEn,
          titleAr: s.titleAr,
          paragraphsEn: JSON.stringify(s.paragraphsEn),
          paragraphsAr: JSON.stringify(s.paragraphsAr),
        })),
      };
      const res = await adminFetch("/api/admin/legal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSaved(true);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const pageLabelMap: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    "deposit-withdrawal": "Deposit & Withdrawal Policy",
    "website-verification": "Website Verification",
    "security-reliability": "Security & Reliability",
  };
  const pageLabel = pageLabelMap[pageType] || pageType;

  return (
    <div className="space-y-6">
      {/* Hero Title */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[15px] font-semibold text-[#2e263d] mb-4">
          Page Hero Title
        </h3>
        <BilingualInput
          label="Hero Title"
          valueEn={heroTitle.en}
          valueAr={heroTitle.ar}
          onChangeEn={(v) => setHeroTitle((p) => ({ ...p, en: v }))}
          onChangeAr={(v) => setHeroTitle((p) => ({ ...p, ar: v }))}
          placeholder={`e.g. ${pageLabel}`}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#2e263d]">
            Sections ({sections.length})
          </h3>
        </div>

        {sections.map((section, sIdx) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <div>
                    <span className="text-[14px] font-semibold text-[#2e263d]">
                      Section {sIdx + 1}
                    </span>
                    {section.titleEn && (
                      <span className="text-[13px] text-[#6b7280] ml-2">
                        — {section.titleEn}
                      </span>
                    )}
                  </div>
                </button>

                {/* Section controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSection(sIdx, -1)}
                    disabled={sIdx === 0}
                    className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveSection(sIdx, 1)}
                    disabled={sIdx === sections.length - 1}
                    className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeSection(sIdx)}
                    className="p-1.5 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove section"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Section body */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-[#e8ecf1]">
                  <div className="pt-5 space-y-5">
                    {/* Section title */}
                    <BilingualInput
                      label="Section Title"
                      valueEn={section.titleEn}
                      valueAr={section.titleAr}
                      onChangeEn={(v) => updateSection(sIdx, "titleEn", v)}
                      onChangeAr={(v) => updateSection(sIdx, "titleAr", v)}
                      placeholder="e.g. Information We Collect"
                    />

                    {/* Paragraphs */}
                    <div className="space-y-3">
                      <label className="text-[13px] font-medium text-[#2e263d]">
                        Paragraphs ({section.paragraphsEn.length})
                      </label>

                      {section.paragraphsEn.map((_, pIdx) => (
                        <div
                          key={pIdx}
                          className="relative bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4"
                        >
                          {/* Paragraph controls */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <button
                              onClick={() => moveParagraph(sIdx, pIdx, -1)}
                              disabled={pIdx === 0}
                              className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move up"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveParagraph(sIdx, pIdx, 1)}
                              disabled={pIdx === section.paragraphsEn.length - 1}
                              className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move down"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeParagraph(sIdx, pIdx)}
                              className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove paragraph"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>

                          <div className="text-[11px] text-[#a0a5af] font-medium mb-2">
                            Paragraph #{pIdx + 1}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[11px] text-[#a0a5af] mb-1 block">English</span>
                              <textarea
                                value={section.paragraphsEn[pIdx]}
                                onChange={(e) => updateParagraph(sIdx, "En", pIdx, e.target.value)}
                                rows={3}
                                dir="ltr"
                                className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-y"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic</span>
                              <textarea
                                value={section.paragraphsAr[pIdx] ?? ""}
                                onChange={(e) => updateParagraph(sIdx, "Ar", pIdx, e.target.value)}
                                rows={3}
                                dir="rtl"
                                className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => addParagraph(sIdx)}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Paragraph
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add section button */}
        <button
          onClick={addSection}
          className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Section
        </button>
      </div>

      {/* Save */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}
