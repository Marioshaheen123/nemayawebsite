"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAdminLang } from "@/context/AdminLanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BlogArticleFormValues {
  slug: string;
  imageUrl: string;
  day: string;
  monthEn: string;
  monthAr: string;
  readTimeEn: string;
  readTimeAr: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string; // raw textarea: one paragraph per line
  bodyAr: string; // raw textarea: one paragraph per line
  suggestedBreakAfter: string;
  published: boolean;
  sortOrder: string;
}

interface BlogArticleFormProps {
  /**
   * When editing, pass the existing article data. Omit for create mode.
   */
  defaultValues?: Partial<BlogArticleFormValues> & { id?: string };
  mode: "create" | "edit";
}

function parseBodyArray(raw: string | string[] | null | undefined): string {
  if (!raw) return "";
  if (Array.isArray(raw)) return raw.join("\n\n");
  // Try to parse JSON string array
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.join("\n\n");
  } catch {
    // not JSON, return as-is
  }
  return raw;
}

function serializeBodyArray(text: string): string {
  // Split on double newlines to get paragraphs; filter empty
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return JSON.stringify(paragraphs);
}

export default function BlogArticleForm({ defaultValues, mode }: BlogArticleFormProps) {
  const router = useRouter();
  const { adminLang } = useAdminLang();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BlogArticleFormValues>({
    defaultValues: {
      slug: defaultValues?.slug ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      day: defaultValues?.day ?? "",
      monthEn: defaultValues?.monthEn ?? "",
      monthAr: defaultValues?.monthAr ?? "",
      readTimeEn: defaultValues?.readTimeEn ?? "",
      readTimeAr: defaultValues?.readTimeAr ?? "",
      titleEn: defaultValues?.titleEn ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      excerptEn: defaultValues?.excerptEn ?? "",
      excerptAr: defaultValues?.excerptAr ?? "",
      bodyEn: parseBodyArray(defaultValues?.bodyEn),
      bodyAr: parseBodyArray(defaultValues?.bodyAr),
      suggestedBreakAfter: defaultValues?.suggestedBreakAfter ?? "",
      published: defaultValues?.published ?? false,
      sortOrder: defaultValues?.sortOrder ?? "0",
    },
  });

  const published = watch("published");

  async function onSubmit(values: BlogArticleFormValues) {
    setStatus("loading");
    setErrorMessage("");

    const payload = {
      slug: values.slug.trim(),
      imageUrl: values.imageUrl.trim(),
      day: values.day.trim(),
      monthEn: values.monthEn.trim(),
      monthAr: values.monthAr.trim(),
      readTimeEn: values.readTimeEn.trim(),
      readTimeAr: values.readTimeAr.trim(),
      titleEn: values.titleEn.trim(),
      titleAr: values.titleAr.trim(),
      excerptEn: values.excerptEn.trim(),
      excerptAr: values.excerptAr.trim(),
      bodyEn: serializeBodyArray(values.bodyEn),
      bodyAr: serializeBodyArray(values.bodyAr),
      suggestedBreakAfter: values.suggestedBreakAfter !== "" ? Number(values.suggestedBreakAfter) : null,
      published: values.published,
      sortOrder: Number(values.sortOrder) || 0,
    };

    try {
      const url =
        mode === "edit" && defaultValues?.id
          ? `/api/admin/blog/${defaultValues.id}`
          : "/api/admin/blog";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error ?? "An error occurred. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      // Brief pause so user sees success, then redirect
      setTimeout(() => {
        router.push("/admin/blog");
        router.refresh();
      }, 800);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </Link>

        <div className="flex items-center gap-3">
          {/* Published toggle */}
          <button
            type="button"
            onClick={() => setValue("published", !published, { shouldDirty: true })}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer",
              published
                ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                published ? "bg-green-500" : "bg-gray-400"
              )}
            />
            {published ? "Published" : "Draft"}
          </button>

          <Button type="submit" disabled={isLoading || status === "success"}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "Create Article" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error / success banner */}
      {status === "error" && errorMessage && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          <XCircle className="w-4 h-4 shrink-0" />
          {errorMessage}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Article {mode === "create" ? "created" : "updated"} successfully. Redirecting...
        </div>
      )}

      {/* Meta fields */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Meta & URL</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="my-article-slug"
              {...register("slug", {
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: "Slug must be lowercase letters, numbers, and hyphens only",
                },
              })}
              className={errors.slug ? "border-red-400" : ""}
            />
            {errors.slug && (
              <p className="text-xs text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="/images/blog/my-article.jpg"
              {...register("imageUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min="0"
              placeholder="0"
              {...register("sortOrder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="suggestedBreakAfter">Suggested Break After (paragraph #)</Label>
            <Input
              id="suggestedBreakAfter"
              type="number"
              min="0"
              placeholder="Leave empty for none"
              {...register("suggestedBreakAfter")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date & read time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Date & Read Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminLang === "en" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="day">Day</Label>
                  <Input id="day" placeholder="15" {...register("day")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="monthEn">Month</Label>
                  <Input id="monthEn" placeholder="January" {...register("monthEn")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="readTimeEn">Read Time</Label>
                <Input id="readTimeEn" placeholder="5 min read" {...register("readTimeEn")} />
              </div>
              <input type="hidden" {...register("monthAr")} />
              <input type="hidden" {...register("readTimeAr")} />
            </div>
          ) : (
            <div className="space-y-4" dir="rtl">
              <div className="space-y-1.5">
                <Label htmlFor="day">اليوم</Label>
                <Input id="day" placeholder="15" {...register("day")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="monthAr">الشهر</Label>
                <Input id="monthAr" dir="rtl" placeholder="يناير" {...register("monthAr")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="readTimeAr">وقت القراءة</Label>
                <Input id="readTimeAr" dir="rtl" placeholder="5 دقائق قراءة" {...register("readTimeAr")} />
              </div>
              <input type="hidden" {...register("monthEn")} />
              <input type="hidden" {...register("readTimeEn")} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Titles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Title</CardTitle>
        </CardHeader>
        <CardContent>
          {adminLang === "en" ? (
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">
                Title (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titleEn"
                placeholder="Article title in English"
                {...register("titleEn", { required: "English title is required" })}
                className={errors.titleEn ? "border-red-400" : ""}
              />
              {errors.titleEn && (
                <p className="text-xs text-red-500">{errors.titleEn.message}</p>
              )}
              <input type="hidden" {...register("titleAr")} />
            </div>
          ) : (
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor="titleAr">
                عنوان المقال <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titleAr"
                dir="rtl"
                placeholder="عنوان المقال بالعربية"
                {...register("titleAr", { required: "Arabic title is required" })}
                className={errors.titleAr ? "border-red-400" : ""}
              />
              {errors.titleAr && (
                <p className="text-xs text-red-500">{errors.titleAr.message}</p>
              )}
              <input type="hidden" {...register("titleEn")} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excerpts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Excerpt</CardTitle>
        </CardHeader>
        <CardContent>
          {adminLang === "en" ? (
            <div className="space-y-1.5">
              <Label htmlFor="excerptEn">Excerpt (English)</Label>
              <Textarea
                id="excerptEn"
                placeholder="Short summary shown on listing page..."
                rows={3}
                {...register("excerptEn")}
              />
              <input type="hidden" {...register("excerptAr")} />
            </div>
          ) : (
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor="excerptAr">ملخص المقال</Label>
              <Textarea
                id="excerptAr"
                dir="rtl"
                placeholder="ملخص قصير يظهر في صفحة القائمة..."
                rows={3}
                {...register("excerptAr")}
              />
              <input type="hidden" {...register("excerptEn")} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Body */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Body</CardTitle>
          <p className="text-xs text-gray-400 mt-1">
            Each paragraph is separated by a blank line. The content is stored as a JSON array of paragraphs.
          </p>
        </CardHeader>
        <CardContent>
          {adminLang === "en" ? (
            <div className="space-y-1.5">
              <Label htmlFor="bodyEn">Body (English)</Label>
              <Textarea
                id="bodyEn"
                placeholder={"First paragraph...\n\nSecond paragraph...\n\nThird paragraph..."}
                rows={14}
                className="font-mono text-xs leading-relaxed"
                {...register("bodyEn")}
              />
              <input type="hidden" {...register("bodyAr")} />
            </div>
          ) : (
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor="bodyAr">محتوى المقال</Label>
              <Textarea
                id="bodyAr"
                dir="rtl"
                placeholder={"الفقرة الأولى...\n\nالفقرة الثانية...\n\nالفقرة الثالثة..."}
                rows={14}
                className="font-mono text-xs leading-relaxed"
                {...register("bodyAr")}
              />
              <input type="hidden" {...register("bodyEn")} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom save bar */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <Link href="/admin/blog">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isLoading || status === "success"}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Article" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
