"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminLang } from "@/context/AdminLanguageContext";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  nameEn: string;
  nameAr: string;
  priceEn: string;
  priceAr: string;
  periodEn: string;
  periodAr: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresLabelEn: string;
  featuresLabelAr: string;
  ctaEn: string;
  ctaAr: string;
  ctaStyle: string;
  bg: string;
  gradient: boolean;
  sortOrder: number;
}

interface PlanFeature {
  id?: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
}

type PlanFormValues = Omit<Plan, "id">;

// ─── Plan Form ────────────────────────────────────────────────────────────────

interface PlanFormProps {
  initial?: Plan;
  onSave: (data: PlanFormValues) => Promise<void>;
  onCancel: () => void;
}

function PlanForm({ initial, onSave, onCancel }: PlanFormProps) {
  const { adminLang } = useAdminLang();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    defaultValues: initial ?? {
      nameEn: "",
      nameAr: "",
      priceEn: "",
      priceAr: "",
      periodEn: "",
      periodAr: "",
      descriptionEn: "",
      descriptionAr: "",
      featuresLabelEn: "Features",
      featuresLabelAr: "المميزات",
      ctaEn: "Get Started",
      ctaAr: "ابدأ الآن",
      ctaStyle: "outline",
      bg: "#ffffff",
      gradient: false,
      sortOrder: 0,
    },
  });

  const field = (name: keyof PlanFormValues, required = true) =>
    register(name, required ? { required: "Required" } : {});

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5">
      {/* Name */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>Plan Name (EN)</Label>
          <Input placeholder="Standard" {...field("nameEn")} />
          {errors.nameEn && <p className="text-red-500 text-xs">{errors.nameEn.message}</p>}
          <input type="hidden" {...register("nameAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>اسم الخطة (AR)</Label>
          <Input dir="rtl" placeholder="قياسي" {...field("nameAr")} />
          {errors.nameAr && <p className="text-red-500 text-xs">{errors.nameAr.message}</p>}
          <input type="hidden" {...register("nameEn")} />
        </div>
      )}

      {/* Price */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>Price (EN)</Label>
          <Input placeholder="$99" {...field("priceEn")} />
          {errors.priceEn && <p className="text-red-500 text-xs">{errors.priceEn.message}</p>}
          <input type="hidden" {...register("priceAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>السعر (AR)</Label>
          <Input dir="rtl" placeholder="٩٩$" {...field("priceAr")} />
          {errors.priceAr && <p className="text-red-500 text-xs">{errors.priceAr.message}</p>}
          <input type="hidden" {...register("priceEn")} />
        </div>
      )}

      {/* Period */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>Period (EN)</Label>
          <Input placeholder="per month" {...field("periodEn")} />
          {errors.periodEn && <p className="text-red-500 text-xs">{errors.periodEn.message}</p>}
          <input type="hidden" {...register("periodAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>الفترة (AR)</Label>
          <Input dir="rtl" placeholder="في الشهر" {...field("periodAr")} />
          {errors.periodAr && <p className="text-red-500 text-xs">{errors.periodAr.message}</p>}
          <input type="hidden" {...register("periodEn")} />
        </div>
      )}

      {/* Description */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>Description (EN)</Label>
          <Textarea rows={2} placeholder="Ideal for beginners..." {...field("descriptionEn")} />
          {errors.descriptionEn && <p className="text-red-500 text-xs">{errors.descriptionEn.message}</p>}
          <input type="hidden" {...register("descriptionAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>الوصف (AR)</Label>
          <Textarea rows={2} dir="rtl" placeholder="مثالي للمبتدئين..." {...field("descriptionAr")} />
          {errors.descriptionAr && <p className="text-red-500 text-xs">{errors.descriptionAr.message}</p>}
          <input type="hidden" {...register("descriptionEn")} />
        </div>
      )}

      {/* Features Label */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>Features Label (EN)</Label>
          <Input placeholder="Features" {...field("featuresLabelEn")} />
          {errors.featuresLabelEn && <p className="text-red-500 text-xs">{errors.featuresLabelEn.message}</p>}
          <input type="hidden" {...register("featuresLabelAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>عنوان المميزات (AR)</Label>
          <Input dir="rtl" placeholder="المميزات" {...field("featuresLabelAr")} />
          {errors.featuresLabelAr && <p className="text-red-500 text-xs">{errors.featuresLabelAr.message}</p>}
          <input type="hidden" {...register("featuresLabelEn")} />
        </div>
      )}

      {/* CTA */}
      {adminLang === "en" ? (
        <div className="space-y-1.5">
          <Label>CTA Text (EN)</Label>
          <Input placeholder="Get Started" {...field("ctaEn")} />
          {errors.ctaEn && <p className="text-red-500 text-xs">{errors.ctaEn.message}</p>}
          <input type="hidden" {...register("ctaAr")} />
        </div>
      ) : (
        <div className="space-y-1.5" dir="rtl">
          <Label>نص الزر (AR)</Label>
          <Input dir="rtl" placeholder="ابدأ الآن" {...field("ctaAr")} />
          {errors.ctaAr && <p className="text-red-500 text-xs">{errors.ctaAr.message}</p>}
          <input type="hidden" {...register("ctaEn")} />
        </div>
      )}

      {/* Styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>CTA Style</Label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("ctaStyle", { required: "Required" })}
          >
            <option value="outline">Outline</option>
            <option value="solid">Solid</option>
            <option value="ghost">Ghost</option>
          </select>
          {errors.ctaStyle && <p className="text-red-500 text-xs">{errors.ctaStyle.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Background Color</Label>
          <div className="flex gap-2 items-center">
            <input type="color" className="h-9 w-12 rounded cursor-pointer" {...register("bg")} />
            <Input placeholder="#ffffff" {...register("bg")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input type="number" className="w-full" {...register("sortOrder", { valueAsNumber: true })} />
        </div>
      </div>

      {/* Gradient */}
      <div className="flex items-center gap-2">
        <input id="gradient" type="checkbox" className="w-4 h-4 rounded" {...register("gradient")} />
        <Label htmlFor="gradient" className="cursor-pointer">Use Gradient Background</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
          Save Plan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Features Editor ──────────────────────────────────────────────────────────

interface FeaturesEditorValues {
  features: PlanFeature[];
}

interface FeaturesEditorProps {
  initial: PlanFeature[];
  onSaved: (features: PlanFeature[]) => void;
}

function FeaturesEditor({ initial, onSaved }: FeaturesEditorProps) {
  const { adminLang } = useAdminLang();
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FeaturesEditorValues>({
    defaultValues: { features: initial },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "features",
  });

  const onSubmit = async (data: FeaturesEditorValues) => {
    const res = await fetch("/api/admin/plans/features", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: data.features.map((f, i) => ({ ...f, sortOrder: i })) }),
    });
    if (res.ok) {
      const saved = await res.json();
      onSaved(saved);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {fields.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">No features yet.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
          {adminLang === "en" ? (
            <>
              <Input
                placeholder="Feature label (EN)"
                {...register(`features.${index}.labelEn`, { required: true })}
              />
              <input type="hidden" {...register(`features.${index}.labelAr`)} />
            </>
          ) : (
            <>
              <Input
                dir="rtl"
                placeholder="الميزة (AR)"
                {...register(`features.${index}.labelAr`, { required: true })}
              />
              <input type="hidden" {...register(`features.${index}.labelEn`)} />
            </>
          )}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => index > 0 && move(index, index - 1)}
              className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              disabled={index === 0}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => index < fields.length - 1 && move(index, index + 1)}
              className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              disabled={index === fields.length - 1}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 shrink-0"
            onClick={() => remove(index)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append({ labelEn: "", labelAr: "", sortOrder: fields.length })}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Feature
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
          Save Features
        </Button>
      </div>
    </form>
  );
}

// ─── Main PlansEditor ─────────────────────────────────────────────────────────

interface PlansEditorProps {
  initialPlans: Plan[];
  initialFeatures: PlanFeature[];
}

export default function PlansEditor({ initialPlans, initialFeatures }: PlansEditorProps) {
  const { adminLang } = useAdminLang();
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [features, setFeatures] = useState<PlanFeature[]>(initialFeatures);
  const [addingPlan, setAddingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reloadPlans = async () => {
    const res = await fetch("/api/admin/plans");
    if (res.ok) setPlans(await res.json());
  };

  const handleAddPlan = async (data: PlanFormValues) => {
    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reloadPlans();
      setAddingPlan(false);
    }
  };

  const handleUpdatePlan = async (id: string, data: PlanFormValues) => {
    const res = await fetch(`/api/admin/plans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reloadPlans();
      setEditingPlanId(null);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    if (res.ok) await reloadPlans();
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Types / Plans</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage subscription plans and shared feature list.
          </p>
        </div>
        <Button onClick={() => setAddingPlan(true)} disabled={addingPlan}>
          <Plus className="w-4 h-4 mr-1" />
          Add Plan
        </Button>
      </div>

      {/* Add Plan Form */}
      {addingPlan && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanForm onSave={handleAddPlan} onCancel={() => setAddingPlan(false)} />
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      {plans.length === 0 && !addingPlan && (
        <div className="text-center py-16 text-gray-400">
          No plans yet. Click &quot;Add Plan&quot; to get started.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isEditing = editingPlanId === plan.id;

          return (
            <Card key={plan.id} className="overflow-hidden">
              {/* Plan card header with color preview */}
              <div
                className="h-2"
                style={{ background: plan.gradient ? `linear-gradient(135deg, ${plan.bg}, #12953d)` : plan.bg }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg" dir={adminLang === "ar" ? "rtl" : undefined}>
                      {adminLang === "en" ? plan.nameEn : plan.nameAr}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="secondary">#{plan.sortOrder}</Badge>
                    {plan.gradient && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        Gradient
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() =>
                        setEditingPlanId(isEditing ? null : plan.id)
                      }
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={deletingId === plan.id}
                    >
                      {deletingId === plan.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Summary when not editing */}
              {!isEditing && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm" dir={adminLang === "ar" ? "rtl" : undefined}>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        {adminLang === "en" ? "Price" : "السعر"}
                      </span>
                      <p className="font-semibold">
                        {adminLang === "en" ? plan.priceEn : plan.priceAr}{" "}
                        <span className="text-gray-400 font-normal">
                          {adminLang === "en" ? plan.periodEn : plan.periodAr}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">CTA Style</span>
                      <p className="font-medium">{plan.ctaStyle}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        {adminLang === "en" ? "Description" : "الوصف"}
                      </span>
                      <p className="text-gray-600 line-clamp-2">
                        {adminLang === "en" ? plan.descriptionEn : plan.descriptionAr}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}

              {/* Edit Form */}
              {isEditing && (
                <CardContent className="pt-0 border-t">
                  <div className="pt-4">
                    <PlanForm
                      initial={plan}
                      onSave={(data) => handleUpdatePlan(plan.id, data)}
                      onCancel={() => setEditingPlanId(null)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Shared Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shared Features</CardTitle>
          <p className="text-gray-500 text-sm">
            These features appear on all plans in the account types page.
          </p>
        </CardHeader>
        <CardContent>
          <FeaturesEditor initial={features} onSaved={setFeatures} />
        </CardContent>
      </Card>
    </div>
  );
}
