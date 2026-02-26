"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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

export default function ContentBlockEditor({
  blockKey,
  title,
  description,
}: ContentBlockEditorProps) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/content-blocks/${encodeURIComponent(blockKey)}`,
    fetcher
  );

  const [text, setText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Populate textarea once data loads
  useEffect(() => {
    if (data?.valueJson !== undefined) {
      try {
        const parsed = JSON.parse(data.valueJson);
        setText(JSON.stringify(parsed, null, 2));
      } catch {
        setText(data.valueJson);
      }
    }
  }, [data]);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (value: string) => {
    setText(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e: unknown) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleSave = async () => {
    // Validate JSON before saving
    try {
      JSON.parse(text);
    } catch (e: unknown) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      showToast("error", "Cannot save: JSON is invalid.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/content-blocks/${encodeURIComponent(blockKey)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ valueJson: text }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }

      await mutate();
      showToast("success", "Saved successfully.");
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const displayTitle = title ?? blockKey;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900">
              {displayTitle}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                {blockKey}
              </code>
            </div>
            {description && (
              <CardDescription className="mt-1.5 text-sm text-gray-500">
                {description}
              </CardDescription>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || isLoading || !!jsonError}
            size="sm"
            className="shrink-0"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        )}

        {error && !isLoading && (
          <div className="text-sm text-gray-500 py-4 text-center">
            No existing data — a new block will be created on save.
          </div>
        )}

        {!isLoading && (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
              rows={Math.max(8, text.split("\n").length + 2)}
              className={cn(
                "w-full font-mono text-xs leading-relaxed rounded-md border bg-gray-50 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#0e314c]/30 transition-colors",
                jsonError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:border-[#0e314c]/40"
              )}
              placeholder='{"en": "", "ar": ""}'
            />
            {jsonError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {jsonError}
              </p>
            )}
          </div>
        )}
      </CardContent>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm shadow-lg text-white transition-all",
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}
    </Card>
  );
}
