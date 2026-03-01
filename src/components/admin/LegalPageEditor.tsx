"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminLang } from "@/context/AdminLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalSection {
  id: string;
  pageType: string;
  titleEn: string;
  titleAr: string;
  paragraphsEn: string;
  paragraphsAr: string;
  sortOrder: number;
}

interface LegalPageEditorProps {
  pageType: "privacyPolicy" | "terms";
  pageTitle: string;
}

export default function LegalPageEditor({ pageType, pageTitle }: LegalPageEditorProps) {
  const { adminLang } = useAdminLang();
  const isAr = adminLang === "ar";
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/legal?pageType=${pageType}`);
      if (!res.ok) throw new Error("Failed to fetch sections");
      const data = await res.json();
      setSections(data);
    } catch (err) {
      setError("Failed to load sections. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageType]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  function addSection() {
    const newSection: LegalSection = {
      id: `new-${Date.now()}`,
      pageType,
      titleEn: "",
      titleAr: "",
      paragraphsEn: "[]",
      paragraphsAr: "[]",
      sortOrder: sections.length,
    };
    setSections((prev) => [...prev, newSection]);
  }

  async function deleteSection(id: string) {
    if (id.startsWith("new-")) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    if (!confirm("Delete this section? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/legal/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSections((prev) => prev.filter((s) => s.id !== id));
      showSuccess("Section deleted.");
    } catch (err) {
      setError("Failed to delete section.");
      console.error(err);
    }
  }

  function updateSection(id: string, field: keyof LegalSection, value: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const payload = {
          pageType,
          titleEn: section.titleEn,
          titleAr: section.titleAr,
          paragraphsEn: section.paragraphsEn,
          paragraphsAr: section.paragraphsAr,
          sortOrder: i,
        };

        if (section.id.startsWith("new-")) {
          const res = await fetch("/api/admin/legal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Failed to create section: ${section.titleEn}`);
          const created = await res.json();
          setSections((prev) =>
            prev.map((s) => (s.id === section.id ? { ...s, id: created.id } : s))
          );
        } else {
          const res = await fetch(`/api/admin/legal/${section.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Failed to update section: ${section.titleEn}`);
        }
      }
      showSuccess("All sections saved successfully!");
      fetchSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save sections.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading sections...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-500 mt-1">
            {sections.length} section{sections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {successMsg}
        </div>
      )}

      {/* Sections */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 mb-4">No sections yet. Add your first section.</p>
            <Button variant="outline" onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className={cn(section.id.startsWith("new-") && "border-blue-200 bg-blue-50/30")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <CardTitle className="text-base font-semibold text-gray-700">
                      Section {index + 1}
                      {section.id.startsWith("new-") && (
                        <span className="ml-2 text-xs font-normal text-blue-500">(unsaved)</span>
                      )}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                {isAr ? (
                  <div className="space-y-2">
                    <Label htmlFor={`titleAr-${section.id}`}>Title (Arabic)</Label>
                    <Input
                      id={`titleAr-${section.id}`}
                      value={section.titleAr}
                      onChange={(e) => updateSection(section.id, "titleAr", e.target.value)}
                      placeholder="عنوان القسم بالعربية"
                      dir="rtl"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`titleEn-${section.id}`}>Title (English)</Label>
                    <Input
                      id={`titleEn-${section.id}`}
                      value={section.titleEn}
                      onChange={(e) => updateSection(section.id, "titleEn", e.target.value)}
                      placeholder="Section title in English"
                    />
                  </div>
                )}

                {/* Paragraphs */}
                {isAr ? (
                  <div className="space-y-2">
                    <Label htmlFor={`paragraphsAr-${section.id}`}>
                      Paragraphs (Arabic) — one per line
                    </Label>
                    <Textarea
                      id={`paragraphsAr-${section.id}`}
                      value={parseJsonToLines(section.paragraphsAr)}
                      onChange={(e) =>
                        updateSection(
                          section.id,
                          "paragraphsAr",
                          JSON.stringify(e.target.value.split("\n").filter(Boolean))
                        )
                      }
                      placeholder="أدخل كل فقرة في سطر جديد..."
                      dir="rtl"
                      className="min-h-[140px] resize-y"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`paragraphsEn-${section.id}`}>
                      Paragraphs (English) — one per line
                    </Label>
                    <Textarea
                      id={`paragraphsEn-${section.id}`}
                      value={parseJsonToLines(section.paragraphsEn)}
                      onChange={(e) =>
                        updateSection(
                          section.id,
                          "paragraphsEn",
                          JSON.stringify(e.target.value.split("\n").filter(Boolean))
                        )
                      }
                      placeholder="Enter each paragraph on a new line..."
                      className="min-h-[140px] resize-y"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sections.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button onClick={saveAll} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Sections
          </Button>
        </div>
      )}
    </div>
  );
}

function parseJsonToLines(json: string): string {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed.join("\n");
    return json;
  } catch {
    return json;
  }
}
