"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import SaveButton from "@/components/admin/ui/SaveButton";

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  isActive: boolean;
  linkTemplate: string;
  amounts: number[];
  currency: string;
  currencySymbol: string;
}

interface PaymentConfig {
  providers: Provider[];
}

let counter = 0;
function newId() {
  return `provider_${Date.now()}_${++counter}`;
}

export default function PaymentSettingsEditor({ initialData }: { initialData: PaymentConfig }) {
  const [providers, setProviders] = useState<Provider[]>(initialData.providers || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateProvider = (index: number, updates: Partial<Provider>) => {
    setProviders((prev) => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)));
  };

  const setActive = (index: number) => {
    setProviders((prev) =>
      prev.map((p, i) => ({
        ...p,
        isActive: i === index,
      }))
    );
  };

  const removeProvider = (index: number) => {
    setProviders((prev) => prev.filter((_, i) => i !== index));
  };

  const moveProvider = (index: number, dir: -1 | 1) => {
    const next = [...providers];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProviders(next);
  };

  const addProvider = () => {
    setProviders((prev) => [
      ...prev,
      {
        id: newId(),
        name: "",
        enabled: true,
        isActive: prev.length === 0,
        linkTemplate: "",
        amounts: [500, 1000, 2000],
        currency: "USD",
        currencySymbol: "$",
      },
    ]);
  };

  const addAmount = (providerIndex: number) => {
    const p = providers[providerIndex];
    updateProvider(providerIndex, { amounts: [...p.amounts, 0] });
  };

  const updateAmount = (providerIndex: number, amountIndex: number, value: number) => {
    const p = providers[providerIndex];
    const next = [...p.amounts];
    next[amountIndex] = value;
    updateProvider(providerIndex, { amounts: next });
  };

  const removeAmount = (providerIndex: number, amountIndex: number) => {
    const p = providers[providerIndex];
    updateProvider(providerIndex, {
      amounts: p.amounts.filter((_, i) => i !== amountIndex),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providers }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#2e263d]">Payment Providers</h2>
        <button
          type="button"
          onClick={addProvider}
          className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Provider
        </button>
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12 bg-[#f9fafb] rounded-lg border border-dashed border-[#e0e3e8]">
          <p className="text-[14px] text-[#6b7280] mb-2">No payment providers configured</p>
          <button
            type="button"
            onClick={addProvider}
            className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            Add your first provider
          </button>
        </div>
      )}

      {providers.map((provider, pIdx) => (
        <div
          key={provider.id}
          className={`relative bg-[#f9fafb] border rounded-lg p-5 space-y-4 ${
            provider.isActive && provider.enabled
              ? "border-accent ring-1 ring-accent/20"
              : "border-[#e8ecf1]"
          }`}
        >
          {/* Provider header controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#a0a5af] font-medium">#{pIdx + 1}</span>
              {provider.isActive && provider.enabled && (
                <span className="text-[11px] font-medium text-white bg-accent px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveProvider(pIdx, -1)}
                disabled={pIdx === 0}
                className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                title="Move up"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveProvider(pIdx, 1)}
                disabled={pIdx === providers.length - 1}
                className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
                title="Move down"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeProvider(pIdx)}
                className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                title="Remove provider"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Provider name & enabled */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#2e263d]">Provider Name</label>
              <input
                type="text"
                value={provider.name}
                onChange={(e) => updateProvider(pIdx, { name: e.target.value })}
                placeholder="e.g. Telr, MyFatoorah"
                className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={provider.enabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    updateProvider(pIdx, {
                      enabled,
                      isActive: enabled ? provider.isActive : false,
                    });
                  }}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <span className="text-[13px] font-medium text-[#2e263d]">Enabled</span>
              </label>
              {provider.enabled && !provider.isActive && (
                <button
                  type="button"
                  onClick={() => setActive(pIdx)}
                  className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer py-2"
                >
                  Set as Active
                </button>
              )}
            </div>
          </div>

          {/* Link Template */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#2e263d]">
              Payment Link Template
            </label>
            <input
              type="text"
              value={provider.linkTemplate}
              onChange={(e) => updateProvider(pIdx, { linkTemplate: e.target.value })}
              placeholder="https://provider.com/pay?amount={amount}"
              dir="ltr"
              className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono"
            />
            <p className="text-[11px] text-[#a0a5af]">
              Use <code className="bg-[#e8ecf1] px-1 rounded text-[11px]">{"{amount}"}</code> as a placeholder for the deposit amount
            </p>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#2e263d]">Currency Code</label>
              <input
                type="text"
                value={provider.currency}
                onChange={(e) => updateProvider(pIdx, { currency: e.target.value })}
                placeholder="USD"
                className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#2e263d]">Currency Symbol</label>
              <input
                type="text"
                value={provider.currencySymbol}
                onChange={(e) => updateProvider(pIdx, { currencySymbol: e.target.value })}
                placeholder="$"
                className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          {/* Deposit Amounts */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[#2e263d]">Deposit Amounts</label>
            <div className="flex flex-wrap gap-2">
              {provider.amounts.map((amount, aIdx) => (
                <div key={aIdx} className="flex items-center gap-1 bg-white border border-[#e0e3e8] rounded-lg overflow-hidden">
                  <span className="text-[13px] text-[#a0a5af] pl-3">{provider.currencySymbol}</span>
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => updateAmount(pIdx, aIdx, Number(e.target.value))}
                    placeholder="0"
                    className="w-[80px] px-1 py-2 text-[13px] text-[#2e263d] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeAmount(pIdx, aIdx)}
                    className="p-1.5 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove amount"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addAmount(pIdx)}
                className="flex items-center gap-1 px-3 py-2 border border-dashed border-[#e0e3e8] rounded-lg text-[12px] text-accent hover:border-accent transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  );
}
