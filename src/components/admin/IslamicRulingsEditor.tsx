"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminLang } from "@/context/AdminLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IslamicRulingItem {
  id: string;
  titleEn: string;
  titleAr: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  muftiEn: string;
  muftiAr: string;
  sortOrder: number;
  sectionId: string;
}

interface IslamicRulingSection {
  id: string;
  nameEn: string;
  nameAr: string;
  sortOrder: number;
  items: IslamicRulingItem[];
}

export default function IslamicRulingsEditor() {
  const { adminLang } = useAdminLang();
  const isAr = adminLang === "ar";
  const [sections, setSections] = useState<IslamicRulingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/islamic-rulings/sections");
      if (!res.ok) throw new Error("Failed to fetch sections");
      const data = await res.json();
      setSections(data);
      // Expand all sections by default
      setExpandedSections(new Set(data.map((s: IslamicRulingSection) => s.id)));
    } catch (err) {
      setError("Failed to load data. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleItem(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Section CRUD
  async function addSection() {
    try {
      const res = await fetch("/api/admin/islamic-rulings/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: "New Section",
          nameAr: "قسم جديد",
        }),
      });
      if (!res.ok) throw new Error("Failed to create section");
      const created = await res.json();
      setSections((prev) => [...prev, created]);
      setExpandedSections((prev) => new Set([...prev, created.id]));
      showSuccess("Section created.");
    } catch (err) {
      setError("Failed to create section.");
      console.error(err);
    }
  }

  async function saveSection(section: IslamicRulingSection) {
    setSaving(section.id);
    try {
      const res = await fetch(`/api/admin/islamic-rulings/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: section.nameEn,
          nameAr: section.nameAr,
          sortOrder: section.sortOrder,
        }),
      });
      if (!res.ok) throw new Error("Failed to save section");
      showSuccess("Section saved.");
    } catch (err) {
      setError("Failed to save section.");
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its items? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/islamic-rulings/sections/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete section");
      setSections((prev) => prev.filter((s) => s.id !== id));
      showSuccess("Section deleted.");
    } catch (err) {
      setError("Failed to delete section.");
      console.error(err);
    }
  }

  function updateSection(id: string, field: keyof IslamicRulingSection, value: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  // Item CRUD
  async function addItem(sectionId: string) {
    try {
      const res = await fetch("/api/admin/islamic-rulings/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          titleEn: "New Ruling",
          titleAr: "حكم جديد",
          questionEn: "",
          questionAr: "",
          answerEn: "",
          answerAr: "",
          muftiEn: "",
          muftiAr: "",
        }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const created = await res.json();
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, items: [...s.items, created] } : s
        )
      );
      setExpandedItems((prev) => new Set([...prev, created.id]));
      showSuccess("Ruling added.");
    } catch (err) {
      setError("Failed to add ruling.");
      console.error(err);
    }
  }

  async function saveItem(item: IslamicRulingItem) {
    setSaving(item.id);
    try {
      const res = await fetch(`/api/admin/islamic-rulings/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: item.titleEn,
          titleAr: item.titleAr,
          questionEn: item.questionEn,
          questionAr: item.questionAr,
          answerEn: item.answerEn,
          answerAr: item.answerAr,
          muftiEn: item.muftiEn,
          muftiAr: item.muftiAr,
          sortOrder: item.sortOrder,
        }),
      });
      if (!res.ok) throw new Error("Failed to save ruling");
      showSuccess("Ruling saved.");
    } catch (err) {
      setError("Failed to save ruling.");
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  async function deleteItem(sectionId: string, itemId: string) {
    if (!confirm("Delete this ruling? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/islamic-rulings/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete ruling");
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
        )
      );
      showSuccess("Ruling deleted.");
    } catch (err) {
      setError("Failed to delete ruling.");
      console.error(err);
    }
  }

  function updateItem(sectionId: string, itemId: string, field: keyof IslamicRulingItem, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)),
            }
          : s
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading Islamic rulings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Islamic Rulings</h1>
          <p className="text-gray-500 mt-1">
            {sections.length} section{sections.length !== 1 ? "s" : ""} &middot;{" "}
            {sections.reduce((acc, s) => acc + s.items.length, 0)} rulings
          </p>
        </div>
        <Button onClick={addSection}>
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
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
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No sections yet. Add your first section.</p>
            <Button variant="outline" onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <Card key={section.id} className="overflow-hidden">
                {/* Section Header */}
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 flex-1 text-left"
                      onClick={() => toggleSection(section.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                      <CardTitle className="text-base font-semibold text-gray-800" dir={isAr ? "rtl" : undefined}>
                        {(isAr ? section.nameAr : section.nameEn) || "Untitled Section"}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        {section.items.length} ruling{section.items.length !== 1 ? "s" : ""}
                      </Badge>
                    </button>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveSection(section)}
                        disabled={saving === section.id}
                      >
                        {saving === section.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        <span className="ml-1">Save</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-4 space-y-4">
                    {/* Section name field */}
                    <div className="pb-4 border-b border-gray-100">
                      {isAr ? (
                        <div className="space-y-2">
                          <Label>Section Name (Arabic)</Label>
                          <Input
                            value={section.nameAr}
                            onChange={(e) => updateSection(section.id, "nameAr", e.target.value)}
                            placeholder="اسم القسم بالعربية"
                            dir="rtl"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Section Name (English)</Label>
                          <Input
                            value={section.nameEn}
                            onChange={(e) => updateSection(section.id, "nameEn", e.target.value)}
                            placeholder="Section name in English"
                          />
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Rulings
                        </h3>
                        <Button size="sm" variant="outline" onClick={() => addItem(section.id)}>
                          <Plus className="w-3 h-3 mr-1" />
                          Add Ruling
                        </Button>
                      </div>

                      {section.items.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                          No rulings in this section yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {section.items.map((item) => {
                            const isItemExpanded = expandedItems.has(item.id);
                            return (
                              <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                              >
                                {/* Item Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                                  <button
                                    className="flex items-center gap-2 flex-1 text-left"
                                    onClick={() => toggleItem(item.id)}
                                  >
                                    {isItemExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium text-gray-700" dir={isAr ? "rtl" : undefined}>
                                      {(isAr ? item.titleAr : item.titleEn) || "Untitled Ruling"}
                                    </span>
                                  </button>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => saveItem(item)}
                                      disabled={saving === item.id}
                                    >
                                      {saving === item.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Save className="w-3 h-3" />
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => deleteItem(section.id, item.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Item Content */}
                                {isItemExpanded && (
                                  <div className="p-4 space-y-4">
                                    {/* Title */}
                                    {isAr ? (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Title (Arabic)</Label>
                                        <Input
                                          value={item.titleAr}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "titleAr", e.target.value)
                                          }
                                          placeholder="عنوان الحكم بالعربية"
                                          dir="rtl"
                                          className="text-sm"
                                        />
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Title (English)</Label>
                                        <Input
                                          value={item.titleEn}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "titleEn", e.target.value)
                                          }
                                          placeholder="Ruling title in English"
                                          className="text-sm"
                                        />
                                      </div>
                                    )}

                                    {/* Question */}
                                    {isAr ? (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Question (Arabic)</Label>
                                        <Textarea
                                          value={item.questionAr}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "questionAr", e.target.value)
                                          }
                                          placeholder="نص السؤال بالعربية"
                                          dir="rtl"
                                          className="text-sm min-h-[80px] resize-y"
                                        />
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Question (English)</Label>
                                        <Textarea
                                          value={item.questionEn}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "questionEn", e.target.value)
                                          }
                                          placeholder="Question text in English"
                                          className="text-sm min-h-[80px] resize-y"
                                        />
                                      </div>
                                    )}

                                    {/* Answer */}
                                    {isAr ? (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Answer (Arabic)</Label>
                                        <Textarea
                                          value={item.answerAr}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "answerAr", e.target.value)
                                          }
                                          placeholder="نص الجواب بالعربية"
                                          dir="rtl"
                                          className="text-sm min-h-[100px] resize-y"
                                        />
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Answer (English)</Label>
                                        <Textarea
                                          value={item.answerEn}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "answerEn", e.target.value)
                                          }
                                          placeholder="Answer text in English"
                                          className="text-sm min-h-[100px] resize-y"
                                        />
                                      </div>
                                    )}

                                    {/* Mufti */}
                                    {isAr ? (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Mufti (Arabic)</Label>
                                        <Input
                                          value={item.muftiAr}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "muftiAr", e.target.value)
                                          }
                                          placeholder="اسم المفتي بالعربية"
                                          dir="rtl"
                                          className="text-sm"
                                        />
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        <Label className="text-xs">Mufti (English)</Label>
                                        <Input
                                          value={item.muftiEn}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, "muftiEn", e.target.value)
                                          }
                                          placeholder="Mufti name in English"
                                          className="text-sm"
                                        />
                                      </div>
                                    )}

                                    <div className="flex justify-end pt-1">
                                      <Button
                                        size="sm"
                                        onClick={() => saveItem(item)}
                                        disabled={saving === item.id}
                                        className={cn(saving === item.id && "opacity-70")}
                                      >
                                        {saving === item.id ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : (
                                          <Save className="w-3 h-3 mr-1" />
                                        )}
                                        Save Ruling
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
