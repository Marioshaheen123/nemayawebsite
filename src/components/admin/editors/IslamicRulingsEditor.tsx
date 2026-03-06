"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

interface RulingItemData {
  id?: string;
  titleEn: string;
  titleAr: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  muftiEn: string;
  muftiAr: string;
}

interface RulingSectionData {
  id?: string;
  nameEn: string;
  nameAr: string;
  items: RulingItemData[];
}

interface IslamicRulingsData {
  heroTitle: { en: string; ar: string };
  sectionLabels: {
    en: { question: string; answer: string; mufti: string };
    ar: { question: string; answer: string; mufti: string };
  };
  sections: RulingSectionData[];
}

export default function IslamicRulingsEditor({
  initialData,
}: {
  initialData: IslamicRulingsData;
}) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/islamic-rulings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const refreshed = await adminFetch("/api/admin/islamic-rulings");
        if (refreshed.ok) {
          const freshData = await refreshed.json();
          setData(freshData);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }, [data]);

  // ── Section helpers ──────────────────────────────────────────────

  const addSection = () => {
    setData((p) => ({
      ...p,
      sections: [
        ...p.sections,
        { id: `new_${Date.now()}`, nameEn: "", nameAr: "", items: [] },
      ],
    }));
  };

  const removeSection = (idx: number) => {
    setData((p) => ({
      ...p,
      sections: p.sections.filter((_, i) => i !== idx),
    }));
  };

  const moveSectionUp = (idx: number) => {
    if (idx === 0) return;
    setData((p) => {
      const next = [...p.sections];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return { ...p, sections: next };
    });
  };

  const moveSectionDown = (idx: number) => {
    setData((p) => {
      if (idx === p.sections.length - 1) return p;
      const next = [...p.sections];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { ...p, sections: next };
    });
  };

  const updateSection = (idx: number, patch: Partial<RulingSectionData>) => {
    setData((p) => {
      const next = [...p.sections];
      next[idx] = { ...next[idx], ...patch };
      return { ...p, sections: next };
    });
  };

  // ── Item helpers ─────────────────────────────────────────────────

  const addItem = (sIdx: number) => {
    setData((p) => {
      const next = [...p.sections];
      next[sIdx] = {
        ...next[sIdx],
        items: [
          ...next[sIdx].items,
          {
            titleEn: "",
            titleAr: "",
            questionEn: "",
            questionAr: "",
            answerEn: "",
            answerAr: "",
            muftiEn: "",
            muftiAr: "",
          },
        ],
      };
      return { ...p, sections: next };
    });
  };

  const removeItem = (sIdx: number, iIdx: number) => {
    setData((p) => {
      const next = [...p.sections];
      next[sIdx] = {
        ...next[sIdx],
        items: next[sIdx].items.filter((_, i) => i !== iIdx),
      };
      return { ...p, sections: next };
    });
  };

  const moveItemUp = (sIdx: number, iIdx: number) => {
    if (iIdx === 0) return;
    setData((p) => {
      const next = [...p.sections];
      const items = [...next[sIdx].items];
      [items[iIdx - 1], items[iIdx]] = [items[iIdx], items[iIdx - 1]];
      next[sIdx] = { ...next[sIdx], items };
      return { ...p, sections: next };
    });
  };

  const moveItemDown = (sIdx: number, iIdx: number) => {
    setData((p) => {
      const next = [...p.sections];
      const items = [...next[sIdx].items];
      if (iIdx === items.length - 1) return p;
      [items[iIdx], items[iIdx + 1]] = [items[iIdx + 1], items[iIdx]];
      next[sIdx] = { ...next[sIdx], items };
      return { ...p, sections: next };
    });
  };

  const updateItem = (
    sIdx: number,
    iIdx: number,
    patch: Partial<RulingItemData>
  ) => {
    setData((p) => {
      const next = [...p.sections];
      const items = [...next[sIdx].items];
      items[iIdx] = { ...items[iIdx], ...patch };
      next[sIdx] = { ...next[sIdx], items };
      return { ...p, sections: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Hero Title ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[15px] font-semibold text-[#2e263d] mb-4">
          Page Hero Title
        </h3>
        <BilingualInput
          label="Hero Title"
          valueEn={data.heroTitle?.en || ""}
          valueAr={data.heroTitle?.ar || ""}
          onChangeEn={(v) =>
            setData((p) => ({ ...p, heroTitle: { ...p.heroTitle, en: v } }))
          }
          onChangeAr={(v) =>
            setData((p) => ({ ...p, heroTitle: { ...p.heroTitle, ar: v } }))
          }
        />
      </div>

      {/* ── Section Labels ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[15px] font-semibold text-[#2e263d] mb-4">
          Section Labels
        </h3>
        <div className="space-y-4">
          <BilingualInput
            label="Question Label"
            valueEn={data.sectionLabels?.en?.question || ""}
            valueAr={data.sectionLabels?.ar?.question || ""}
            onChangeEn={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  en: { ...p.sectionLabels.en, question: v },
                },
              }))
            }
            onChangeAr={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  ar: { ...p.sectionLabels.ar, question: v },
                },
              }))
            }
          />
          <BilingualInput
            label="Answer Label"
            valueEn={data.sectionLabels?.en?.answer || ""}
            valueAr={data.sectionLabels?.ar?.answer || ""}
            onChangeEn={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  en: { ...p.sectionLabels.en, answer: v },
                },
              }))
            }
            onChangeAr={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  ar: { ...p.sectionLabels.ar, answer: v },
                },
              }))
            }
          />
          <BilingualInput
            label="Mufti Label"
            valueEn={data.sectionLabels?.en?.mufti || ""}
            valueAr={data.sectionLabels?.ar?.mufti || ""}
            onChangeEn={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  en: { ...p.sectionLabels.en, mufti: v },
                },
              }))
            }
            onChangeAr={(v) =>
              setData((p) => ({
                ...p,
                sectionLabels: {
                  ...p.sectionLabels,
                  ar: { ...p.sectionLabels.ar, mufti: v },
                },
              }))
            }
          />
        </div>
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#2e263d]">
            Ruling Sections ({data.sections.length})
          </h3>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Section
          </button>
        </div>

        {data.sections.map((section, sIdx) => (
          <SectionBlock
            key={section.id || sIdx}
            section={section}
            sIdx={sIdx}
            totalSections={data.sections.length}
            onUpdate={(patch) => updateSection(sIdx, patch)}
            onRemove={() => removeSection(sIdx)}
            onMoveUp={() => moveSectionUp(sIdx)}
            onMoveDown={() => moveSectionDown(sIdx)}
            onAddItem={() => addItem(sIdx)}
            onRemoveItem={(iIdx) => removeItem(sIdx, iIdx)}
            onMoveItemUp={(iIdx) => moveItemUp(sIdx, iIdx)}
            onMoveItemDown={(iIdx) => moveItemDown(sIdx, iIdx)}
            onUpdateItem={(iIdx, patch) => updateItem(sIdx, iIdx, patch)}
          />
        ))}

        {data.sections.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-[#d1d5db] p-8 text-center">
            <p className="text-[13px] text-[#9ca3af]">
              No sections yet. Click &ldquo;Add Section&rdquo; to create one.
            </p>
          </div>
        )}
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}

// ── Section Block ───────────────────────────────────────────────────

function SectionBlock({
  section,
  sIdx,
  totalSections,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddItem,
  onRemoveItem,
  onMoveItemUp,
  onMoveItemDown,
  onUpdateItem,
}: {
  section: RulingSectionData;
  sIdx: number;
  totalSections: number;
  onUpdate: (patch: Partial<RulingSectionData>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddItem: () => void;
  onRemoveItem: (iIdx: number) => void;
  onMoveItemUp: (iIdx: number) => void;
  onMoveItemDown: (iIdx: number) => void;
  onUpdateItem: (iIdx: number, patch: Partial<RulingItemData>) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f9fafb] border-b border-[#e8ecf1]">
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="text-[14px] font-semibold text-[#2e263d]">
            Section #{sIdx + 1}
            {section.nameEn ? `: ${section.nameEn}` : ""}
          </span>
          <span className="text-[12px] text-[#9ca3af] ml-1">
            ({section.items.length} item{section.items.length !== 1 ? "s" : ""})
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={sIdx === 0}
            className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move section up"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={sIdx === totalSections - 1}
            className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move section down"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
            title="Delete section"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section body */}
      {!collapsed && (
        <div className="p-6 space-y-5">
          {/* Section name */}
          <BilingualInput
            label="Section Name"
            valueEn={section.nameEn}
            valueAr={section.nameAr}
            onChangeEn={(v) => onUpdate({ nameEn: v })}
            onChangeAr={(v) => onUpdate({ nameAr: v })}
          />

          {/* Items */}
          <div className="space-y-3">
            <label className="text-[13px] font-medium text-[#2e263d]">
              Ruling Items
            </label>

            {section.items.map((item, iIdx) => (
              <div
                key={iIdx}
                className="relative bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4"
              >
                {/* Item controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onMoveItemUp(iIdx)}
                    disabled={iIdx === 0}
                    className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveItemDown(iIdx)}
                    disabled={iIdx === section.items.length - 1}
                    className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(iIdx)}
                    className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="text-[11px] text-[#a0a5af] font-medium mb-2">
                  #{iIdx + 1}
                </div>

                <div className="space-y-3">
                  <BilingualInput
                    label="Title"
                    valueEn={item.titleEn}
                    valueAr={item.titleAr}
                    onChangeEn={(v) => onUpdateItem(iIdx, { titleEn: v })}
                    onChangeAr={(v) => onUpdateItem(iIdx, { titleAr: v })}
                  />
                  <BilingualTextarea
                    label="Question"
                    valueEn={item.questionEn}
                    valueAr={item.questionAr}
                    onChangeEn={(v) => onUpdateItem(iIdx, { questionEn: v })}
                    onChangeAr={(v) => onUpdateItem(iIdx, { questionAr: v })}
                    rows={3}
                  />
                  <BilingualTextarea
                    label="Answer"
                    valueEn={item.answerEn}
                    valueAr={item.answerAr}
                    onChangeEn={(v) => onUpdateItem(iIdx, { answerEn: v })}
                    onChangeAr={(v) => onUpdateItem(iIdx, { answerAr: v })}
                    rows={4}
                  />
                  <BilingualInput
                    label="Mufti"
                    valueEn={item.muftiEn}
                    valueAr={item.muftiAr}
                    onChangeEn={(v) => onUpdateItem(iIdx, { muftiEn: v })}
                    onChangeAr={(v) => onUpdateItem(iIdx, { muftiAr: v })}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddItem}
              className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Ruling Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
