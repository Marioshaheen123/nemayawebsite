"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Save, AlertCircle, CheckCircle2, Loader2, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useAdminLang } from "@/context/AdminLanguageContext";

interface ContentBlockEditorProps {
  blockKey: string;
  title?: string;
  description?: string;
}

type ToastType = "success" | "error" | null;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

// ─── Helpers ──────────────────────────────────────────────────

function prettifyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function isLongText(value: string): boolean {
  return value.length > 80 || value.includes("\n");
}

function isBilingualPair(obj: any): boolean {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  return keys.length === 2 && keys.includes("en") && keys.includes("ar");
}

function isBadgeObject(obj: any): boolean {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  return keys.includes("label") && keys.includes("labelAr") && keys.length <= 3;
}

// ─── Field Renderers ──────────────────────────────────────────

function StringField({ label, value, onChange, dir }: {
  label: string; value: string; onChange: (v: string) => void; dir?: string;
}) {
  if (isLongText(value)) {
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
          rows={3}
          className="resize-y text-sm"
        />
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="text-sm"
      />
    </div>
  );
}

function SingleLangField({ label, value, onChange, lang }: {
  label: string; value: string; onChange: (v: string) => void; lang: "en" | "ar";
}) {
  const useLarge = isLongText(value);
  const Field = useLarge ? Textarea : Input;
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Field
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        dir={lang === "ar" ? "rtl" : undefined}
        className={cn("text-sm", useLarge && "resize-y")}
        {...(useLarge ? { rows: 3 } : {})}
      />
    </div>
  );
}

// ─── Recursive Value Renderer ─────────────────────────────────

function ValueEditor({ value, onChange, path, depth = 0 }: {
  value: any; onChange: (v: any) => void; path: string; depth?: number;
}) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  if (typeof value === "string") {
    return <StringField label={prettifyKey(path)} value={value} onChange={onChange} />;
  }

  if (typeof value === "number") {
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">{prettifyKey(path)}</label>
        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="text-sm w-32" />
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="rounded" />
        <label className="text-sm text-gray-700">{prettifyKey(path)}</label>
      </div>
    );
  }

  if (value === null || value === undefined) {
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">{prettifyKey(path)}</label>
        <Input value="" onChange={(e) => onChange(e.target.value || null)} placeholder="(empty)" className="text-sm" />
      </div>
    );
  }

  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{prettifyKey(path)}</label>
        {value.map((item: string, i: number) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-xs text-gray-400 mt-2.5 w-5 shrink-0">{i + 1}</span>
            {isLongText(item) ? (
              <Textarea value={item} onChange={(e) => { const arr = [...value]; arr[i] = e.target.value; onChange(arr); }} rows={2} className="text-sm resize-y flex-1" />
            ) : (
              <Input value={item} onChange={(e) => { const arr = [...value]; arr[i] = e.target.value; onChange(arr); }} className="text-sm flex-1" />
            )}
            <Button variant="ghost" size="sm" onClick={() => onChange(value.filter((_: any, j: number) => j !== i))}>
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...value, ""])}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
        </Button>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">{prettifyKey(path)}</label>
        {value.map((item: any, i: number) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Item {i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => onChange(value.filter((_: any, j: number) => j !== i))}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
            </div>
            <ObjectFields obj={item} onChange={(updated) => { const arr = [...value]; arr[i] = updated; onChange(arr); }} depth={depth + 1} />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => {
          const template = value.length > 0
            ? Object.fromEntries(Object.keys(value[0]).map((k) => [k, typeof value[0][k] === "string" ? "" : value[0][k] === null ? null : Array.isArray(value[0][k]) ? [] : ""]))
            : {};
          onChange([...value, template]);
        }}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
        </Button>
      </div>
    );
  }

  if (typeof value === "object") {
    if (depth > 0) {
      return (
        <div className="space-y-2">
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {prettifyKey(path)}
          </button>
          {!collapsed && (
            <div className="pl-4 border-l-2 border-gray-200 space-y-3">
              <ObjectFields obj={value} onChange={onChange} depth={depth + 1} />
            </div>
          )}
        </div>
      );
    }
    return <ObjectFields obj={value} onChange={onChange} depth={depth} />;
  }

  return null;
}

function ObjectFields({ obj, onChange, depth = 0 }: {
  obj: Record<string, any>; onChange: (v: any) => void; depth?: number;
}) {
  const updateField = (key: string, val: any) => onChange({ ...obj, [key]: val });
  return (
    <div className="space-y-4">
      {Object.entries(obj).map(([key, val]) => (
        <ValueEditor key={key} value={val} onChange={(v) => updateField(key, v)} path={key} depth={depth + 1} />
      ))}
    </div>
  );
}

// ─── Top-Level Smart Renderer (language-aware) ────────────────

function SmartFormRenderer({ data, onChange }: {
  data: any; onChange: (v: any) => void;
}) {
  const { adminLang } = useAdminLang();

  // Case 1: Simple bilingual string { en: "...", ar: "..." }
  if (isBilingualPair(data) && typeof data.en === "string" && typeof data.ar === "string") {
    return (
      <SingleLangField
        label="Content"
        value={data[adminLang]}
        onChange={(v) => onChange({ ...data, [adminLang]: v })}
        lang={adminLang}
      />
    );
  }

  // Case 2: Badge object { label: "...", labelAr: "..." }
  if (isBadgeObject(data)) {
    const key = adminLang === "en" ? "label" : "labelAr";
    return (
      <SingleLangField
        label="Badge Label"
        value={data[key] || ""}
        onChange={(v) => onChange({ ...data, [key]: v })}
        lang={adminLang}
      />
    );
  }

  // Case 3: Bilingual object { en: { ... }, ar: { ... } }
  if (isBilingualPair(data) && typeof data.en === "object" && typeof data.ar === "object" && !Array.isArray(data.en)) {
    const langObj = data[adminLang] as Record<string, any>;
    const keys = Object.keys(data.en); // use EN keys as canonical

    return (
      <div className="space-y-4">
        {keys.map((key) => {
          const val = langObj[key];

          if (Array.isArray(val)) {
            return (
              <div key={key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{prettifyKey(key)}</label>
                <ValueEditor value={val} onChange={(v) => onChange({ ...data, [adminLang]: { ...langObj, [key]: v } })} path={key} depth={1} />
              </div>
            );
          }

          if (typeof val === "object" && val !== null) {
            return (
              <div key={key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{prettifyKey(key)}</label>
                <ObjectFields obj={val} onChange={(v) => onChange({ ...data, [adminLang]: { ...langObj, [key]: v } })} depth={2} />
              </div>
            );
          }

          if (typeof val === "string") {
            return (
              <SingleLangField
                key={key}
                label={prettifyKey(key)}
                value={val}
                onChange={(v) => onChange({ ...data, [adminLang]: { ...langObj, [key]: v } })}
                lang={adminLang}
              />
            );
          }

          return (
            <ValueEditor key={key} value={val} onChange={(v) => onChange({ ...data, [adminLang]: { ...langObj, [key]: v } })} path={key} depth={1} />
          );
        })}
      </div>
    );
  }

  // Case 4: Bilingual arrays { en: [...], ar: [...] }
  if (isBilingualPair(data) && Array.isArray(data.en) && Array.isArray(data.ar)) {
    return (
      <ValueEditor
        value={data[adminLang]}
        onChange={(v) => onChange({ ...data, [adminLang]: v })}
        path="items"
        depth={0}
      />
    );
  }

  // Case 5-8: Non-bilingual — show as-is
  if (typeof data === "string") return <StringField label="Value" value={data} onChange={onChange} />;
  if (typeof data === "number") return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">Value</label>
      <Input type="number" value={data} onChange={(e) => onChange(Number(e.target.value))} className="text-sm w-32" />
    </div>
  );
  if (typeof data === "object" && !Array.isArray(data)) return <ObjectFields obj={data} onChange={onChange} depth={0} />;
  if (Array.isArray(data)) return <ValueEditor value={data} onChange={onChange} path="items" depth={0} />;

  return null;
}

// ─── Main Component ───────────────────────────────────────────

export default function ContentBlockEditor({ blockKey, title, description }: ContentBlockEditorProps) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/content-blocks/${encodeURIComponent(blockKey)}`,
    fetcher
  );

  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  useEffect(() => {
    if (data?.valueJson !== undefined) {
      try { setFormData(JSON.parse(data.valueJson)); } catch { setFormData(null); }
    }
  }, [data]);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = useCallback((updated: any) => { setFormData(updated); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valueJson: JSON.stringify(formData) }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || "Save failed"); }
      await mutate();
      showToast("success", "Saved successfully.");
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "An error occurred.");
    } finally { setSaving(false); }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900">{title ?? blockKey}</CardTitle>
            {description && <CardDescription className="mt-1 text-sm text-gray-500">{description}</CardDescription>}
          </div>
          <Button onClick={handleSave} disabled={saving || isLoading || formData === null} size="sm" className="shrink-0">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex items-center gap-2 text-sm text-gray-500 py-8 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>}
        {error && !isLoading && <div className="text-sm text-gray-500 py-4 text-center">No existing data — a new block will be created on save.</div>}
        {!isLoading && formData !== null && <SmartFormRenderer data={formData} onChange={handleChange} />}
      </CardContent>
      {toast && (
        <div className={cn("absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm shadow-lg text-white transition-all", toast.type === "success" ? "bg-green-600" : "bg-red-600")}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}
    </Card>
  );
}
