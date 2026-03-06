"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import SaveButton from "@/components/admin/ui/SaveButton";

interface BankOption {
  value: string;
  en: string;
  ar: string;
}

export default function BankOptionsEditor({
  initialData,
}: {
  initialData: { banks: BankOption[] };
}) {
  const [banks, setBanks] = useState<BankOption[]>(initialData.banks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<BankOption>({ value: "", en: "", ar: "" });

  const updateBank = (idx: number, field: keyof BankOption, val: string) => {
    setBanks((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: val } : b)));
    setSaved(false);
  };

  const addBank = () => {
    if (!draft.value.trim() || !draft.en.trim() || !draft.ar.trim()) return;
    const newBank = { ...draft, value: draft.value.toUpperCase().replace(/[^A-Z0-9_]/g, "") };
    setBanks((prev) => {
      // Always insert before "OTHER" so it stays last
      const otherIdx = prev.findIndex((b) => b.value === "OTHER");
      if (otherIdx >= 0) {
        const next = [...prev];
        next.splice(otherIdx, 0, newBank);
        return next;
      }
      return [...prev, newBank];
    });
    setDraft({ value: "", en: "", ar: "" });
    setSaved(false);
  };

  const removeBank = (idx: number) => {
    setBanks((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
    if (editIdx === idx) setEditIdx(null);
  };

  const moveBank = (idx: number, dir: -1 | 1) => {
    const next = [...banks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    // Don't allow moving past "OTHER" — it must stay last
    if (dir === 1 && next[target].value === "OTHER") return;
    if (dir === -1 && next[idx].value === "OTHER") return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBanks(next);
    setSaved(false);
    if (editIdx === idx) setEditIdx(target);
    else if (editIdx === target) setEditIdx(idx);
  };

  const handleSave = async () => {
    setSaving(true);
    // Ensure "OTHER" is always last before saving
    const sorted = [...banks.filter((b) => b.value !== "OTHER"), ...banks.filter((b) => b.value === "OTHER")];
    if (JSON.stringify(sorted) !== JSON.stringify(banks)) setBanks(sorted);
    try {
      const res = await adminFetch("/api/admin/bank-options", {
        method: "PATCH",
        body: JSON.stringify({ banks: sorted }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
    } catch {
      alert("Failed to save bank options");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#2e263d]">Bank Options</h2>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Manage withdrawal bank transfer options. {banks.length} bank{banks.length !== 1 ? "s" : ""} configured.
          </p>
        </div>
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>

      {/* Table */}
      <div className="border border-[#e0e3e8] rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_100px] bg-[#f6f7f9] border-b border-[#e0e3e8] px-3 py-2.5">
          <span className="text-[11px] font-semibold text-[#a0a5af] uppercase tracking-wider">#</span>
          <span className="text-[11px] font-semibold text-[#a0a5af] uppercase tracking-wider">Code</span>
          <span className="text-[11px] font-semibold text-[#a0a5af] uppercase tracking-wider">English Name</span>
          <span className="text-[11px] font-semibold text-[#a0a5af] uppercase tracking-wider text-right">Arabic Name</span>
          <span className="text-[11px] font-semibold text-[#a0a5af] uppercase tracking-wider text-center">Actions</span>
        </div>

        {/* Bank rows */}
        {banks.map((bank, idx) => (
          <div key={idx}>
            {/* Display row */}
            <div
              className={`grid grid-cols-[40px_1fr_1fr_1fr_100px] items-center px-3 py-2.5 transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
              } ${editIdx === idx ? "bg-accent/5" : "hover:bg-[#f0f2f5]"} ${
                idx < banks.length - 1 ? "border-b border-[#eef0f3]" : ""
              }`}
            >
              <span className="text-[12px] text-[#a0a5af] font-medium">{idx + 1}</span>

              {editIdx === idx ? (
                <>
                  <input
                    type="text"
                    value={bank.value}
                    onChange={(e) => updateBank(idx, "value", e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                    className="px-2 py-1 border border-[#d0d4dc] rounded text-[13px] text-[#2e263d] w-full max-w-[140px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                    placeholder="CODE"
                  />
                  <input
                    type="text"
                    value={bank.en}
                    onChange={(e) => updateBank(idx, "en", e.target.value)}
                    dir="ltr"
                    className="px-2 py-1 border border-[#d0d4dc] rounded text-[13px] text-[#2e263d] w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                    placeholder="English name"
                  />
                  <input
                    type="text"
                    value={bank.ar}
                    onChange={(e) => updateBank(idx, "ar", e.target.value)}
                    dir="rtl"
                    className="px-2 py-1 border border-[#d0d4dc] rounded text-[13px] text-[#2e263d] w-full text-right focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                    placeholder="الاسم بالعربية"
                  />
                </>
              ) : (
                <>
                  <span className="text-[12px] font-mono text-[#6b7280] bg-[#eef0f3] px-1.5 py-0.5 rounded w-fit">{bank.value}</span>
                  <span className="text-[13px] text-[#2e263d]">{bank.en}</span>
                  <span className="text-[13px] text-[#2e263d] text-right" dir="rtl">{bank.ar}</span>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-0.5">
                <button
                  onClick={() => moveBank(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-[#e8ecf1] disabled:opacity-20 transition-colors"
                  title="Move up"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button
                  onClick={() => moveBank(idx, 1)}
                  disabled={idx === banks.length - 1}
                  className="p-1 rounded hover:bg-[#e8ecf1] disabled:opacity-20 transition-colors"
                  title="Move down"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <button
                  onClick={() => setEditIdx(editIdx === idx ? null : idx)}
                  className={`p-1 rounded transition-colors ${editIdx === idx ? "bg-accent/10 text-accent" : "hover:bg-[#e8ecf1] text-[#6b7280]"}`}
                  title={editIdx === idx ? "Done editing" : "Edit"}
                >
                  {editIdx === idx ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  )}
                </button>
                <button
                  onClick={() => removeBank(idx)}
                  className="p-1 rounded hover:bg-red-50 text-[#c0c4cc] hover:text-[#ff4c51] transition-colors"
                  title="Remove"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {banks.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[#a0a5af]">
            No banks configured. Add one below.
          </div>
        )}
      </div>

      {/* Add new bank row */}
      <div className="border border-dashed border-[#d0d4dc] rounded-xl p-4 bg-[#fafbfc]">
        <p className="text-[12px] font-medium text-[#6b7280] mb-3 uppercase tracking-wider">Add New Bank</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[11px] text-[#a0a5af] mb-1 block">Code</span>
            <input
              type="text"
              value={draft.value}
              onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "") }))}
              placeholder="e.g. ALRAJHI"
              className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#a0a5af] mb-1 block">English Name</span>
            <input
              type="text"
              value={draft.en}
              onChange={(e) => setDraft((d) => ({ ...d, en: e.target.value }))}
              placeholder="Bank name"
              dir="ltr"
              className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic Name</span>
            <input
              type="text"
              value={draft.ar}
              onChange={(e) => setDraft((d) => ({ ...d, ar: e.target.value }))}
              placeholder="اسم البنك"
              dir="rtl"
              className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>
        <button
          onClick={addBank}
          disabled={!draft.value.trim() || !draft.en.trim() || !draft.ar.trim()}
          className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Bank
        </button>
      </div>

      {/* Bottom save */}
      <div className="pt-3 border-t border-[#e8ecf1] flex justify-end">
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}
