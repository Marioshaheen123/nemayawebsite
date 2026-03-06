"use client";

import { useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import BilingualInput from "../ui/BilingualInput";
import BilingualTextarea from "../ui/BilingualTextarea";
import SaveButton from "../ui/SaveButton";

interface FaqQuestionData {
  id?: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

interface FaqCategoryData {
  id?: string;
  nameEn: string;
  nameAr: string;
  isHomepage: boolean;
  questions: FaqQuestionData[];
}

interface FaqPageData {
  heroTitle: { en: string; ar: string };
  introText: {
    en: { left: string; right: string };
    ar: { left: string; right: string };
  };
  categories: FaqCategoryData[];
}

export default function FaqPageEditor({
  initialData,
}: {
  initialData: FaqPageData;
}) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const refreshed = await adminFetch("/api/admin/faq");
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

  // ── Category helpers ─────────────────────────────────────────────

  const addCategory = () => {
    setData((p) => ({
      ...p,
      categories: [
        ...p.categories,
        {
          id: `new_${Date.now()}`,
          nameEn: "",
          nameAr: "",
          isHomepage: false,
          questions: [],
        },
      ],
    }));
  };

  const removeCategory = (idx: number) => {
    setData((p) => ({
      ...p,
      categories: p.categories.filter((_, i) => i !== idx),
    }));
  };

  const moveCategoryUp = (idx: number) => {
    if (idx === 0) return;
    setData((p) => {
      const next = [...p.categories];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return { ...p, categories: next };
    });
  };

  const moveCategoryDown = (idx: number) => {
    setData((p) => {
      if (idx === p.categories.length - 1) return p;
      const next = [...p.categories];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { ...p, categories: next };
    });
  };

  const updateCategory = (idx: number, patch: Partial<FaqCategoryData>) => {
    setData((p) => {
      const next = [...p.categories];
      next[idx] = { ...next[idx], ...patch };
      return { ...p, categories: next };
    });
  };

  // ── Question helpers ─────────────────────────────────────────────

  const addQuestion = (cIdx: number) => {
    setData((p) => {
      const next = [...p.categories];
      next[cIdx] = {
        ...next[cIdx],
        questions: [
          ...next[cIdx].questions,
          { questionEn: "", questionAr: "", answerEn: "", answerAr: "" },
        ],
      };
      return { ...p, categories: next };
    });
  };

  const removeQuestion = (cIdx: number, qIdx: number) => {
    setData((p) => {
      const next = [...p.categories];
      next[cIdx] = {
        ...next[cIdx],
        questions: next[cIdx].questions.filter((_, i) => i !== qIdx),
      };
      return { ...p, categories: next };
    });
  };

  const moveQuestionUp = (cIdx: number, qIdx: number) => {
    if (qIdx === 0) return;
    setData((p) => {
      const next = [...p.categories];
      const questions = [...next[cIdx].questions];
      [questions[qIdx - 1], questions[qIdx]] = [
        questions[qIdx],
        questions[qIdx - 1],
      ];
      next[cIdx] = { ...next[cIdx], questions };
      return { ...p, categories: next };
    });
  };

  const moveQuestionDown = (cIdx: number, qIdx: number) => {
    setData((p) => {
      const next = [...p.categories];
      const questions = [...next[cIdx].questions];
      if (qIdx === questions.length - 1) return p;
      [questions[qIdx], questions[qIdx + 1]] = [
        questions[qIdx + 1],
        questions[qIdx],
      ];
      next[cIdx] = { ...next[cIdx], questions };
      return { ...p, categories: next };
    });
  };

  const updateQuestion = (
    cIdx: number,
    qIdx: number,
    patch: Partial<FaqQuestionData>
  ) => {
    setData((p) => {
      const next = [...p.categories];
      const questions = [...next[cIdx].questions];
      questions[qIdx] = { ...questions[qIdx], ...patch };
      next[cIdx] = { ...next[cIdx], questions };
      return { ...p, categories: next };
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

      {/* ── Intro Text ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[15px] font-semibold text-[#2e263d] mb-4">
          Intro Text
        </h3>
        <div className="space-y-4">
          <BilingualTextarea
            label="Left Column"
            valueEn={data.introText?.en?.left || ""}
            valueAr={data.introText?.ar?.left || ""}
            onChangeEn={(v) =>
              setData((p) => ({
                ...p,
                introText: {
                  ...p.introText,
                  en: { ...p.introText.en, left: v },
                },
              }))
            }
            onChangeAr={(v) =>
              setData((p) => ({
                ...p,
                introText: {
                  ...p.introText,
                  ar: { ...p.introText.ar, left: v },
                },
              }))
            }
            rows={3}
          />
          <BilingualTextarea
            label="Right Column"
            valueEn={data.introText?.en?.right || ""}
            valueAr={data.introText?.ar?.right || ""}
            onChangeEn={(v) =>
              setData((p) => ({
                ...p,
                introText: {
                  ...p.introText,
                  en: { ...p.introText.en, right: v },
                },
              }))
            }
            onChangeAr={(v) =>
              setData((p) => ({
                ...p,
                introText: {
                  ...p.introText,
                  ar: { ...p.introText.ar, right: v },
                },
              }))
            }
            rows={3}
          />
        </div>
      </div>

      {/* ── Categories ──────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#2e263d]">
            FAQ Categories ({data.categories.length})
          </h3>
          <button
            type="button"
            onClick={addCategory}
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
            Add Category
          </button>
        </div>

        {data.categories.map((category, cIdx) => (
          <CategoryBlock
            key={category.id || cIdx}
            category={category}
            cIdx={cIdx}
            totalCategories={data.categories.length}
            onUpdate={(patch) => updateCategory(cIdx, patch)}
            onRemove={() => removeCategory(cIdx)}
            onMoveUp={() => moveCategoryUp(cIdx)}
            onMoveDown={() => moveCategoryDown(cIdx)}
            onAddQuestion={() => addQuestion(cIdx)}
            onRemoveQuestion={(qIdx) => removeQuestion(cIdx, qIdx)}
            onMoveQuestionUp={(qIdx) => moveQuestionUp(cIdx, qIdx)}
            onMoveQuestionDown={(qIdx) => moveQuestionDown(cIdx, qIdx)}
            onUpdateQuestion={(qIdx, patch) =>
              updateQuestion(cIdx, qIdx, patch)
            }
          />
        ))}

        {data.categories.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-[#d1d5db] p-8 text-center">
            <p className="text-[13px] text-[#9ca3af]">
              No categories yet. Click &ldquo;Add Category&rdquo; to create one.
            </p>
          </div>
        )}
      </div>

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}

// ── Category Block ──────────────────────────────────────────────────

function CategoryBlock({
  category,
  cIdx,
  totalCategories,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddQuestion,
  onRemoveQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onUpdateQuestion,
}: {
  category: FaqCategoryData;
  cIdx: number;
  totalCategories: number;
  onUpdate: (patch: Partial<FaqCategoryData>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (qIdx: number) => void;
  onMoveQuestionUp: (qIdx: number) => void;
  onMoveQuestionDown: (qIdx: number) => void;
  onUpdateQuestion: (qIdx: number, patch: Partial<FaqQuestionData>) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Category header */}
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
            Category #{cIdx + 1}
            {category.nameEn ? `: ${category.nameEn}` : ""}
          </span>
          <span className="text-[12px] text-[#9ca3af] ml-1">
            ({category.questions.length} question
            {category.questions.length !== 1 ? "s" : ""})
          </span>
          {category.isHomepage && (
            <span className="text-[11px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium ml-1">
              Homepage
            </span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={cIdx === 0}
            className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move category up"
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
            disabled={cIdx === totalCategories - 1}
            className="p-1.5 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move category down"
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
            title="Delete category"
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

      {/* Category body */}
      {!collapsed && (
        <div className="p-6 space-y-5">
          {/* Category name */}
          <BilingualInput
            label="Category Name"
            valueEn={category.nameEn}
            valueAr={category.nameAr}
            onChangeEn={(v) => onUpdate({ nameEn: v })}
            onChangeAr={(v) => onUpdate({ nameAr: v })}
          />

          {/* Homepage toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={category.isHomepage}
                onChange={(e) => onUpdate({ isHomepage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#d1d5db] peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
            </label>
            <span className="text-[13px] text-[#6b7280]">
              Show on Homepage FAQ section
            </span>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <label className="text-[13px] font-medium text-[#2e263d]">
              Questions
            </label>

            {category.questions.map((question, qIdx) => (
              <div
                key={qIdx}
                className="relative bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4"
              >
                {/* Question controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onMoveQuestionUp(qIdx)}
                    disabled={qIdx === 0}
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
                    onClick={() => onMoveQuestionDown(qIdx)}
                    disabled={qIdx === category.questions.length - 1}
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
                    onClick={() => onRemoveQuestion(qIdx)}
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
                  #{qIdx + 1}
                </div>

                <div className="space-y-3">
                  <BilingualInput
                    label="Question"
                    valueEn={question.questionEn}
                    valueAr={question.questionAr}
                    onChangeEn={(v) =>
                      onUpdateQuestion(qIdx, { questionEn: v })
                    }
                    onChangeAr={(v) =>
                      onUpdateQuestion(qIdx, { questionAr: v })
                    }
                  />
                  <BilingualTextarea
                    label="Answer"
                    valueEn={question.answerEn}
                    valueAr={question.answerAr}
                    onChangeEn={(v) =>
                      onUpdateQuestion(qIdx, { answerEn: v })
                    }
                    onChangeAr={(v) =>
                      onUpdateQuestion(qIdx, { answerAr: v })
                    }
                    rows={4}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddQuestion}
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
              Add Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
