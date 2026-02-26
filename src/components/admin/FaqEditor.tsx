"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FaqItem {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  sortOrder: number;
  categoryId: string;
}

interface FaqCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  sortOrder: number;
  isHomepage: boolean;
  questions: FaqItem[];
}

// ─── Category Form ────────────────────────────────────────────────────────────

interface CategoryFormValues {
  nameEn: string;
  nameAr: string;
  sortOrder: number;
  isHomepage: boolean;
}

interface CategoryFormProps {
  initial?: FaqCategory;
  onSave: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
}

function CategoryForm({ initial, onSave, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      nameEn: initial?.nameEn ?? "",
      nameAr: initial?.nameAr ?? "",
      sortOrder: initial?.sortOrder ?? 0,
      isHomepage: initial?.isHomepage ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="nameEn">Name (EN)</Label>
          <Input
            id="nameEn"
            placeholder="General Questions"
            {...register("nameEn", { required: "Required" })}
          />
          {errors.nameEn && (
            <p className="text-red-500 text-xs">{errors.nameEn.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nameAr">Name (AR)</Label>
          <Input
            id="nameAr"
            dir="rtl"
            placeholder="أسئلة عامة"
            {...register("nameAr", { required: "Required" })}
          />
          {errors.nameAr && (
            <p className="text-red-500 text-xs">{errors.nameAr.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            className="w-24"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            id="isHomepage"
            type="checkbox"
            className="w-4 h-4 rounded"
            {...register("isHomepage")}
          />
          <Label htmlFor="isHomepage" className="cursor-pointer">
            Show on Homepage
          </Label>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : (
            <Check className="w-3.5 h-3.5 mr-1" />
          )}
          Save Category
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Item Form ────────────────────────────────────────────────────────────────

interface ItemFormValues {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  sortOrder: number;
  categoryId: string;
}

interface ItemFormProps {
  initial?: FaqItem;
  categories: FaqCategory[];
  defaultCategoryId?: string;
  onSave: (data: ItemFormValues) => Promise<void>;
  onCancel: () => void;
}

function ItemForm({
  initial,
  categories,
  defaultCategoryId,
  onSave,
  onCancel,
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    defaultValues: {
      questionEn: initial?.questionEn ?? "",
      questionAr: initial?.questionAr ?? "",
      answerEn: initial?.answerEn ?? "",
      answerAr: initial?.answerAr ?? "",
      sortOrder: initial?.sortOrder ?? 0,
      categoryId: initial?.categoryId ?? defaultCategoryId ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Question (EN)</Label>
          <Input
            placeholder="What is...?"
            {...register("questionEn", { required: "Required" })}
          />
          {errors.questionEn && (
            <p className="text-red-500 text-xs">{errors.questionEn.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Question (AR)</Label>
          <Input
            dir="rtl"
            placeholder="ما هو...؟"
            {...register("questionAr", { required: "Required" })}
          />
          {errors.questionAr && (
            <p className="text-red-500 text-xs">{errors.questionAr.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Answer (EN)</Label>
          <Textarea
            rows={3}
            placeholder="The answer in English..."
            {...register("answerEn", { required: "Required" })}
          />
          {errors.answerEn && (
            <p className="text-red-500 text-xs">{errors.answerEn.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Answer (AR)</Label>
          <Textarea
            rows={3}
            dir="rtl"
            placeholder="الإجابة بالعربية..."
            {...register("answerAr", { required: "Required" })}
          />
          {errors.answerAr && (
            <p className="text-red-500 text-xs">{errors.answerAr.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("categoryId", { required: "Required" })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameEn}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-xs">{errors.categoryId.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input
            type="number"
            className="w-24"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : (
            <Check className="w-3.5 h-3.5 mr-1" />
          )}
          Save Question
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main FaqEditor ───────────────────────────────────────────────────────────

interface FaqEditorProps {
  initialCategories: FaqCategory[];
}

export default function FaqEditor({ initialCategories }: FaqEditorProps) {
  const [categories, setCategories] = useState<FaqCategory[]>(initialCategories);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [addingItemToCategoryId, setAddingItemToCategoryId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reload = async () => {
    const res = await fetch("/api/admin/faq/categories");
    if (res.ok) {
      const data: FaqCategory[] = await res.json();
      setCategories(data);
    }
  };

  // ─── Category CRUD ────────────────────────────────────────────────────────

  const handleAddCategory = async (data: CategoryFormValues) => {
    const res = await fetch("/api/admin/faq/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reload();
      setAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (id: string, data: CategoryFormValues) => {
    const res = await fetch(`/api/admin/faq/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reload();
      setEditingCategoryId(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its questions?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/faq/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      await reload();
    }
    setDeletingId(null);
  };

  // ─── Item CRUD ────────────────────────────────────────────────────────────

  const handleAddItem = async (data: ItemFormValues) => {
    const res = await fetch("/api/admin/faq/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reload();
      setAddingItemToCategoryId(null);
    }
  };

  const handleUpdateItem = async (id: string, data: ItemFormValues) => {
    const res = await fetch(`/api/admin/faq/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reload();
      setEditingItemId(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/faq/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      await reload();
    }
    setDeletingId(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage categories and questions shown on the FAQ page.
          </p>
        </div>
        <Button onClick={() => setAddingCategory(true)} disabled={addingCategory}>
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {addingCategory && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              onSave={handleAddCategory}
              onCancel={() => setAddingCategory(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Category List */}
      {categories.length === 0 && !addingCategory && (
        <div className="text-center py-16 text-gray-400">
          No categories yet. Click &quot;Add Category&quot; to get started.
        </div>
      )}

      {categories.map((category) => {
        const isExpanded = expandedIds.has(category.id);
        const isEditingCategory = editingCategoryId === category.id;
        const isAddingItem = addingItemToCategoryId === category.id;

        return (
          <Card key={category.id} className="overflow-hidden">
            {/* Category Header */}
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 bg-gray-50 border-b transition-colors",
                isExpanded ? "border-gray-200" : "border-transparent"
              )}
            >
              <button
                onClick={() => toggleExpand(category.id)}
                className="flex items-center gap-2 flex-1 text-left min-w-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="font-medium text-gray-800 truncate">
                  {category.nameEn}
                </span>
                <span className="text-gray-400 text-sm truncate hidden sm:block">
                  / {category.nameAr}
                </span>
                <Badge variant="secondary" className="ml-1 shrink-0">
                  {category.questions.length} Q
                </Badge>
                {category.isHomepage && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
                    Homepage
                  </Badge>
                )}
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => {
                    setEditingCategoryId(
                      editingCategoryId === category.id ? null : category.id
                    );
                    if (!isExpanded) toggleExpand(category.id);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deletingId === category.id}
                >
                  {deletingId === category.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Category Edit Form */}
            {isEditingCategory && (
              <div className="px-4 py-4 border-b bg-amber-50/30">
                <CategoryForm
                  initial={category}
                  onSave={(data) => handleUpdateCategory(category.id, data)}
                  onCancel={() => setEditingCategoryId(null)}
                />
              </div>
            )}

            {/* Questions List */}
            {isExpanded && (
              <CardContent className="p-0">
                {category.questions.length === 0 && !isAddingItem && (
                  <p className="text-gray-400 text-sm text-center py-6">
                    No questions in this category yet.
                  </p>
                )}

                {category.questions.map((item) => {
                  const isEditingItem = editingItemId === item.id;

                  return (
                    <div key={item.id} className="border-b last:border-b-0">
                      {isEditingItem ? (
                        <div className="p-4 bg-amber-50/20">
                          <ItemForm
                            initial={item}
                            categories={categories}
                            onSave={(data) => handleUpdateItem(item.id, data)}
                            onCancel={() => setEditingItemId(null)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 group">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm leading-snug">
                              {item.questionEn}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                              {item.answerEn}
                            </p>
                            <p className="text-gray-400 text-xs mt-1 dir-rtl text-right">
                              {item.questionAr}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() =>
                                setEditingItemId(
                                  editingItemId === item.id ? null : item.id
                                )
                              }
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Item Form */}
                {isAddingItem && (
                  <div className="p-4 bg-blue-50/30 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      New Question
                    </p>
                    <ItemForm
                      categories={categories}
                      defaultCategoryId={category.id}
                      onSave={handleAddItem}
                      onCancel={() => setAddingItemToCategoryId(null)}
                    />
                  </div>
                )}

                {/* Add Question Button */}
                {!isAddingItem && (
                  <div className="px-4 py-3 border-t bg-gray-50/50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAddingItemToCategoryId(category.id);
                        setEditingItemId(null);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Question
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
