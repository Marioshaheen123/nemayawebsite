"use client";

import { useState } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";
import SaveButton from "@/components/admin/ui/SaveButton";
import ImageUploader from "@/components/admin/ui/ImageUploader";

interface WebsiteSettings {
  accentColor: string;
  accentColorDark: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  gradientHoverFrom: string;
  gradientHoverVia: string;
  gradientHoverTo: string;
  mainLogo: string;
  smallLogo: string;
}

function darkenHex(hex: string, amount = 25): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lightenHex(hex: string, amount = 60): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/* ── Search & Replace types ───────────────────────────────────────── */
interface SearchResult {
  type: "contentBlock" | "model";
  model?: string;
  id?: string;
  key?: string;
  field: string;
  path?: string;
  preview: string;
  matchCount: number;
}

const GRADIENT_DEFAULTS: Partial<WebsiteSettings> = {
  gradientFrom: "#0a7f35",
  gradientVia: "#12a544",
  gradientTo: "#3ec95e",
  gradientHoverFrom: "#086b2c",
  gradientHoverVia: "#0e8e3a",
  gradientHoverTo: "#34b552",
};

export default function WebsiteSettingsEditor({ initialData }: { initialData: WebsiteSettings }) {
  const [settings, setSettings] = useState<WebsiteSettings>({ ...GRADIENT_DEFAULTS, ...initialData } as WebsiteSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* Search & Replace state */
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searching, setSearching] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [replaceCount, setReplaceCount] = useState<number | null>(null);

  const update = (updates: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Auto-derive flat accent/primary from gradient middle color
      const toSave = {
        ...settings,
        accentColor: settings.gradientVia,
        accentColorDark: settings.gradientFrom,
      };
      const res = await adminFetch("/api/admin/website-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      if (!res.ok) throw new Error("Save failed");
      // Apply all CSS variables immediately
      const s = document.documentElement.style;
      s.setProperty("--gradient-from", settings.gradientFrom);
      s.setProperty("--gradient-via", settings.gradientVia);
      s.setProperty("--gradient-to", settings.gradientTo);
      s.setProperty("--gradient-hover-from", settings.gradientHoverFrom);
      s.setProperty("--gradient-hover-via", settings.gradientHoverVia);
      s.setProperty("--gradient-hover-to", settings.gradientHoverTo);
      // Flat fallbacks derived from gradient
      s.setProperty("--color-primary", settings.gradientVia);
      s.setProperty("--color-primary-dark", settings.gradientFrom);
      s.setProperty("--color-primary-light", settings.gradientTo);
      s.setProperty("--color-accent", settings.gradientVia);
      s.setProperty("--color-accent-dark", settings.gradientFrom);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save website settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setSelected(new Set());
    setReplaceCount(null);
    try {
      const res = await adminFetch("/api/admin/content-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
        setSelected(new Set(data.results.map((_: SearchResult, i: number) => i)));
      }
    } catch {
      alert("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const totalSelectedMatches = searchResults.reduce((sum, r, i) => selected.has(i) ? sum + r.matchCount : sum, 0);

  const handleReplace = async () => {
    const targets = searchResults.filter((_, i) => selected.has(i));
    if (targets.length === 0) return;
    if (!confirm(`Replace ${totalSelectedMatches} occurrence${totalSelectedMatches !== 1 ? "s" : ""} of "${searchQuery}" with "${replaceText}" in ${targets.length} location${targets.length !== 1 ? "s" : ""}?`)) return;
    setReplacing(true);
    setReplaceCount(null);
    try {
      const res = await adminFetch("/api/admin/content-replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery, replace: replaceText, targets }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplaceCount(data.replaced);
        // Auto re-search to show remaining matches
        const searchRes = await adminFetch("/api/admin/content-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery.trim() }),
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          setSearchResults(searchData.results || []);
          setSelected(new Set((searchData.results || []).map((_: SearchResult, i: number) => i)));
        }
      }
    } catch {
      alert("Replace failed");
    } finally {
      setReplacing(false);
    }
  };

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(searchResults.map((_, i) => i)));
  const deselectAll = () => setSelected(new Set());

  /* Group results by source */
  const grouped = searchResults.reduce<Record<string, { results: SearchResult[]; indices: number[] }>>((acc, r, i) => {
    const group = r.type === "contentBlock" ? `ContentBlock: ${r.key}` : `${r.model} (${r.id})`;
    if (!acc[group]) acc[group] = { results: [], indices: [] };
    acc[group].results.push(r);
    acc[group].indices.push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* ── Website Gradient Colors ──────────────────────────────── */}
      <section className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-1">Website Colors (Gradient)</h2>
        <p className="text-[12px] text-[#6b7280] mb-4">
          Controls the gradient used across the entire website — buttons, icons, links, badges, and all accent elements. The middle color is also used as the flat fallback.
        </p>

        <div className="space-y-4">
          {/* Normal state */}
          <div>
            <label className="text-[13px] font-medium text-[#2e263d] mb-2 block">Normal State</label>
            <div className="flex flex-wrap gap-4 items-end">
              {([
                ["gradientFrom", "From (dark)"],
                ["gradientVia", "Via (mid)"],
                ["gradientTo", "To (light)"],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <span className="text-[11px] text-[#a0a5af]">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={(e) => update({ [key]: e.target.value })}
                      className="w-[36px] h-[36px] rounded-lg border border-[#e0e3e8] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings[key]}
                      onChange={(e) => update({ [key]: e.target.value })}
                      className="w-[100px] px-2 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover state */}
          <div>
            <label className="text-[13px] font-medium text-[#2e263d] mb-2 block">Hover State</label>
            <div className="flex flex-wrap gap-4 items-end">
              {([
                ["gradientHoverFrom", "From (dark)"],
                ["gradientHoverVia", "Via (mid)"],
                ["gradientHoverTo", "To (light)"],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <span className="text-[11px] text-[#a0a5af]">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={(e) => update({ [key]: e.target.value })}
                      className="w-[36px] h-[36px] rounded-lg border border-[#e0e3e8] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings[key]}
                      onChange={(e) => update({ [key]: e.target.value })}
                      className="w-[100px] px-2 py-1.5 border border-[#e0e3e8] rounded-lg text-[12px] text-[#2e263d] font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <label className="text-[13px] font-medium text-[#2e263d] mb-2 block">Preview</label>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full text-white text-[14px] font-semibold transition-all"
                style={{ backgroundImage: `linear-gradient(to top, ${settings.gradientFrom}, ${settings.gradientVia}, ${settings.gradientTo})` }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = `linear-gradient(to top, ${settings.gradientHoverFrom}, ${settings.gradientHoverVia}, ${settings.gradientHoverTo})`)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = `linear-gradient(to top, ${settings.gradientFrom}, ${settings.gradientVia}, ${settings.gradientTo})`)}
              >
                CTA Button
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-[12px] text-white text-[14px] font-semibold transition-all"
                style={{ backgroundImage: `linear-gradient(to top, ${settings.gradientFrom}, ${settings.gradientVia}, ${settings.gradientTo})` }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = `linear-gradient(to top, ${settings.gradientHoverFrom}, ${settings.gradientHoverVia}, ${settings.gradientHoverTo})`)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = `linear-gradient(to top, ${settings.gradientFrom}, ${settings.gradientVia}, ${settings.gradientTo})`)}
              >
                Login Button
              </button>
              <div
                className="h-[8px] w-[120px] rounded-full"
                style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientVia}, ${settings.gradientTo})` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos ─────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-4">Website Logos</h2>
        <p className="text-[12px] text-[#6b7280] mb-4">
          Upload new logos to replace them across the entire website (header, footer, login, personal area, etc.)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploader
              label="Main Logo"
              currentImage={settings.mainLogo}
              onUpload={(url) => update({ mainLogo: url })}
            />
            <p className="text-[11px] text-[#a0a5af] mt-1">
              Used in header, footer, login pages, personal area, and admin panel
            </p>
          </div>
          <div>
            <ImageUploader
              label="Small Logo / Icon"
              currentImage={settings.smallLogo}
              onUpload={(url) => update({ smallLogo: url })}
            />
            <p className="text-[11px] text-[#a0a5af] mt-1">
              Used in section badges throughout the website
            </p>
          </div>
        </div>

      </section>

      {/* ── Save Settings ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <SaveButton saving={saving} saved={saved} onClick={handleSave} label="Save Settings" />
      </div>

      {/* ── Content Search & Replace ─────────────────────────────── */}
      <section className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h2 className="text-[15px] font-semibold text-[#2e263d] mb-1">Content Search & Replace</h2>
        <p className="text-[12px] text-[#6b7280] mb-4">
          Search for text across all website content (pages, blog, FAQ, videos, etc.) and replace it
        </p>

        {/* Search row */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search text (e.g. nemaya)"
            className="flex-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#2e263d] font-medium">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-[12px] text-accent hover:underline cursor-pointer">
                  Select All
                </button>
                <span className="text-[12px] text-[#a0a5af]">|</span>
                <button type="button" onClick={deselectAll} className="text-[12px] text-accent hover:underline cursor-pointer">
                  Deselect All
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto border border-[#e8ecf1] rounded-lg divide-y divide-[#e8ecf1]">
              {Object.entries(grouped).map(([group, { results: items, indices }]) => (
                <div key={group}>
                  <div className="px-3 py-2 bg-[#f9fafb] text-[12px] font-semibold text-[#6b7280] sticky top-0">
                    {group}
                  </div>
                  {items.map((r, idx) => {
                    const globalIdx = indices[idx];
                    return (
                      <label
                        key={globalIdx}
                        className="flex items-start gap-3 px-3 py-2.5 hover:bg-[#f9fafb] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(globalIdx)}
                          onChange={() => toggleSelect(globalIdx)}
                          className="mt-0.5 w-4 h-4 accent-accent cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] text-[#a0a5af]">{r.field}</span>
                          <p
                            className="text-[13px] text-[#2e263d] truncate"
                            dangerouslySetInnerHTML={{
                              __html: r.preview.replace(
                                new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
                                '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>'
                              ),
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-[#a0a5af] shrink-0">{r.matchCount}x</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Replace row */}
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace with..."
                className="flex-1 px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={handleReplace}
                disabled={replacing || selected.size === 0}
                className="px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50"
              >
                {replacing ? "Replacing..." : `Replace ${totalSelectedMatches} match${totalSelectedMatches !== 1 ? "es" : ""} in ${selected.size} location${selected.size !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {replaceCount !== null && (
          <div className="mt-3 flex items-center gap-2 text-[13px] text-accent font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Successfully replaced in {replaceCount} location{replaceCount !== 1 ? "s" : ""}
            {searchResults.length === 0 && " — no more matches found"}
          </div>
        )}
      </section>
    </div>
  );
}
