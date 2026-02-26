"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoFormValues {
  videoId: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  fullDescEn: string;
  fullDescAr: string;
  /** JSON array string, e.g. ["Item 1","Item 2"] */
  takeawaysEn: string;
  /** JSON array string in Arabic */
  takeawaysAr: string;
  linkTextEn: string;
  linkTextAr: string;
  day: string;
  monthEn: string;
  monthAr: string;
  durationEn: string;
  durationAr: string;
  videoUrl: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
}

interface VideoFormProps {
  /** If provided, form is in edit mode */
  initial?: VideoFormValues & { id: string };
}

// ─── Field pair helper (EN + AR side-by-side) ─────────────────────────────────

interface FieldPairProps {
  labelEn: string;
  labelAr: string;
  nameEn: string;
  nameAr: string;
  placeholderEn?: string;
  placeholderAr?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

function FieldPair({
  labelEn,
  labelAr,
  nameEn,
  nameAr,
  placeholderEn,
  placeholderAr,
  multiline,
  rows = 3,
  required = true,
  register,
  errors,
}: FieldPairProps) {
  const rules = required ? { required: "Required" } : {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label>{labelEn}</Label>
        {multiline ? (
          <Textarea
            rows={rows}
            placeholder={placeholderEn}
            {...register(nameEn, rules)}
          />
        ) : (
          <Input placeholder={placeholderEn} {...register(nameEn, rules)} />
        )}
        {errors[nameEn] && (
          <p className="text-red-500 text-xs">{errors[nameEn].message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>{labelAr}</Label>
        {multiline ? (
          <Textarea
            rows={rows}
            dir="rtl"
            placeholder={placeholderAr}
            {...register(nameAr, rules)}
          />
        ) : (
          <Input dir="rtl" placeholder={placeholderAr} {...register(nameAr, rules)} />
        )}
        {errors[nameAr] && (
          <p className="text-red-500 text-xs">{errors[nameAr].message}</p>
        )}
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function Section({ title }: { title: string }) {
  return (
    <div className="pt-2 pb-1 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ─── VideoForm ────────────────────────────────────────────────────────────────

export default function VideoForm({ initial }: VideoFormProps) {
  const router = useRouter();
  const isEditing = !!initial;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    defaultValues: initial ?? {
      videoId: "",
      titleEn: "",
      titleAr: "",
      descEn: "",
      descAr: "",
      fullDescEn: "",
      fullDescAr: "",
      takeawaysEn: "[]",
      takeawaysAr: "[]",
      linkTextEn: "",
      linkTextAr: "",
      day: "",
      monthEn: "",
      monthAr: "",
      durationEn: "",
      durationAr: "",
      videoUrl: "",
      labelEn: "",
      labelAr: "",
      sortOrder: 0,
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    // Validate JSON arrays before sending
    for (const key of ["takeawaysEn", "takeawaysAr"] as const) {
      const val = data[key];
      if (val && val.trim() !== "" && val.trim() !== "[]") {
        try {
          const parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
        } catch {
          setError(key, { message: "Must be a valid JSON array, e.g. [\"item1\",\"item2\"]" });
          return;
        }
      }
    }

    const url = isEditing
      ? `/api/admin/videos/${initial.id}`
      : "/api/admin/videos";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError("root", { message: json.error ?? "Something went wrong" });
      return;
    }

    router.push("/admin/videos");
    router.refresh();
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back button + title */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/videos")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Video" : "New Video"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing ? `Editing: ${initial.titleEn}` : "Fill in the details below."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global error */}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            {errors.root.message}
          </div>
        )}

        {/* ── Identity ─────────────────────────────────────────────────── */}
        <Section title="Identity" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Video ID (slug)</Label>
            <Input
              placeholder="intro-to-forex"
              {...register("videoId", {
                required: "Required",
                pattern: { value: /^[a-z0-9-_]+$/, message: "Lowercase letters, numbers, hyphens only" },
              })}
            />
            {errors.videoId && <p className="text-red-500 text-xs">{errors.videoId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Video URL</Label>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              {...register("videoUrl", { required: "Required" })}
            />
            {errors.videoUrl && <p className="text-red-500 text-xs">{errors.videoUrl.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* ── Titles ───────────────────────────────────────────────────── */}
        <Section title="Title" />
        <FieldPair
          labelEn="Title (EN)"
          labelAr="Title (AR)"
          nameEn="titleEn"
          nameAr="titleAr"
          placeholderEn="Introduction to Forex Trading"
          placeholderAr="مقدمة في تداول الفوركس"
          register={register}
          errors={errors}
        />

        {/* ── Labels ───────────────────────────────────────────────────── */}
        <Section title="Label / Badge" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Label (EN)</Label>
            <Input placeholder="Beginner" {...register("labelEn")} />
          </div>
          <div className="space-y-1.5">
            <Label>Label (AR)</Label>
            <Input dir="rtl" placeholder="مبتدئ" {...register("labelAr")} />
          </div>
        </div>

        {/* ── Date & Duration ───────────────────────────────────────────── */}
        <Section title="Date & Duration" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label>Day</Label>
            <Input placeholder="14" {...register("day", { required: "Required" })} />
            {errors.day && <p className="text-red-500 text-xs">{errors.day.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Month (EN)</Label>
            <Input placeholder="January" {...register("monthEn", { required: "Required" })} />
            {errors.monthEn && <p className="text-red-500 text-xs">{errors.monthEn.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Month (AR)</Label>
            <Input dir="rtl" placeholder="يناير" {...register("monthAr", { required: "Required" })} />
            {errors.monthAr && <p className="text-red-500 text-xs">{errors.monthAr.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Duration (EN)</Label>
            <Input placeholder="12 min" {...register("durationEn", { required: "Required" })} />
            {errors.durationEn && <p className="text-red-500 text-xs">{errors.durationEn.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-start-1 md:col-start-4 space-y-1.5">
            <Label>Duration (AR)</Label>
            <Input dir="rtl" placeholder="١٢ دقيقة" {...register("durationAr", { required: "Required" })} />
            {errors.durationAr && <p className="text-red-500 text-xs">{errors.durationAr.message}</p>}
          </div>
        </div>

        {/* ── Short Description ────────────────────────────────────────── */}
        <Section title="Short Description" />
        <FieldPair
          labelEn="Description (EN)"
          labelAr="Description (AR)"
          nameEn="descEn"
          nameAr="descAr"
          placeholderEn="A brief overview..."
          placeholderAr="نظرة عامة مختصرة..."
          multiline
          rows={2}
          register={register}
          errors={errors}
        />

        {/* ── Full Description ─────────────────────────────────────────── */}
        <Section title="Full Description" />
        <FieldPair
          labelEn="Full Description (EN)"
          labelAr="Full Description (AR)"
          nameEn="fullDescEn"
          nameAr="fullDescAr"
          placeholderEn="A more detailed explanation..."
          placeholderAr="شرح أكثر تفصيلاً..."
          multiline
          rows={4}
          register={register}
          errors={errors}
        />

        {/* ── Takeaways ────────────────────────────────────────────────── */}
        <Section title="Key Takeaways (JSON arrays)" />
        <p className="text-xs text-gray-500 -mt-3">
          Enter as a JSON array of strings, e.g.{" "}
          <code className="bg-gray-100 px-1 rounded">[&quot;Point 1&quot;, &quot;Point 2&quot;]</code>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Takeaways (EN)</Label>
            <Textarea
              rows={4}
              placeholder={'["You will learn...", "How to..."]'}
              className="font-mono text-sm"
              {...register("takeawaysEn")}
            />
            {errors.takeawaysEn && (
              <p className="text-red-500 text-xs">{errors.takeawaysEn.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Takeaways (AR)</Label>
            <Textarea
              rows={4}
              dir="rtl"
              placeholder={'["ستتعلم...", "كيف تتداول..."]'}
              className="font-mono text-sm"
              {...register("takeawaysAr")}
            />
            {errors.takeawaysAr && (
              <p className="text-red-500 text-xs">{errors.takeawaysAr.message}</p>
            )}
          </div>
        </div>

        {/* ── Link Text ─────────────────────────────────────────────────── */}
        <Section title="Link Text" />
        <FieldPair
          labelEn="Link Text (EN)"
          labelAr="Link Text (AR)"
          nameEn="linkTextEn"
          nameAr="linkTextAr"
          placeholderEn="Watch on YouTube"
          placeholderAr="شاهد على يوتيوب"
          register={register}
          errors={errors}
        />

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create Video"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/videos")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
