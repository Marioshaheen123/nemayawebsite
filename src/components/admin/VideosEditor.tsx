"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminLang } from "@/context/AdminLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  Video,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoRecord {
  id: string;
  videoId: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  fullDescEn: string;
  fullDescAr: string;
  takeawaysEn: string;
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

type VideoFormValues = Omit<VideoRecord, "id">;

// ─── Video Form ───────────────────────────────────────────────────────────────

interface VideoFormProps {
  initial?: VideoRecord;
  onSave: (data: VideoFormValues) => Promise<void>;
  onCancel: () => void;
}

function VideoForm({ initial, onSave, onCancel }: VideoFormProps) {
  const { adminLang } = useAdminLang();
  const isAr = adminLang === "ar";
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

  const field = (name: keyof VideoFormValues, required = true) =>
    register(name, required ? { required: "Required" } : {});

  const onSubmit = async (data: VideoFormValues) => {
    // Validate JSON arrays before saving
    for (const key of ["takeawaysEn", "takeawaysAr"] as const) {
      const val = data[key];
      if (val && val.trim() !== "" && val.trim() !== "[]") {
        try {
          const parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
        } catch {
          setError(key, {
            message: 'Must be a valid JSON array, e.g. ["item1","item2"]',
          });
          return;
        }
      }
    }
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Global error */}
      {errors.root && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {errors.root.message}
        </div>
      )}

      {/* ── Identity ──────────────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Identity
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Video ID (slug)</Label>
          <Input
            placeholder="intro-to-forex"
            {...register("videoId", {
              required: "Required",
              pattern: {
                value: /^[a-z0-9-_]+$/,
                message: "Lowercase letters, numbers, hyphens only",
              },
            })}
          />
          {errors.videoId && (
            <p className="text-red-500 text-xs">{errors.videoId.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Video URL</Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            {...field("videoUrl")}
          />
          {errors.videoUrl && (
            <p className="text-red-500 text-xs">{errors.videoUrl.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input
            type="number"
            className="w-full"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* ── Title ─────────────────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Title
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("titleEn")} />
          <div className="space-y-1.5">
            <Label>Title (AR)</Label>
            <Input
              dir="rtl"
              placeholder="مقدمة في تداول الفوركس"
              {...field("titleAr")}
            />
            {errors.titleAr && (
              <p className="text-red-500 text-xs">{errors.titleAr.message}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("titleAr")} />
          <div className="space-y-1.5">
            <Label>Title (EN)</Label>
            <Input
              placeholder="Introduction to Forex Trading"
              {...field("titleEn")}
            />
            {errors.titleEn && (
              <p className="text-red-500 text-xs">{errors.titleEn.message}</p>
            )}
          </div>
        </>
      )}

      {/* ── Label / Badge ─────────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Label / Badge
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("labelEn", false)} />
          <div className="space-y-1.5">
            <Label>Label (AR)</Label>
            <Input dir="rtl" placeholder="مبتدئ" {...field("labelAr", false)} />
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("labelAr", false)} />
          <div className="space-y-1.5">
            <Label>Label (EN)</Label>
            <Input placeholder="Beginner" {...field("labelEn", false)} />
          </div>
        </>
      )}

      {/* ── Date & Duration ───────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Date & Duration
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("monthEn")} />
          <input type="hidden" {...field("durationEn")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Input placeholder="14" {...field("day")} />
              {errors.day && (
                <p className="text-red-500 text-xs">{errors.day.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Month (AR)</Label>
              <Input dir="rtl" placeholder="يناير" {...field("monthAr")} />
              {errors.monthAr && (
                <p className="text-red-500 text-xs">{errors.monthAr.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Duration (AR)</Label>
              <Input dir="rtl" placeholder="١٢ دقيقة" {...field("durationAr")} />
              {errors.durationAr && (
                <p className="text-red-500 text-xs">{errors.durationAr.message}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("monthAr")} />
          <input type="hidden" {...field("durationAr")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Input placeholder="14" {...field("day")} />
              {errors.day && (
                <p className="text-red-500 text-xs">{errors.day.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Month (EN)</Label>
              <Input placeholder="January" {...field("monthEn")} />
              {errors.monthEn && (
                <p className="text-red-500 text-xs">{errors.monthEn.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Duration (EN)</Label>
              <Input placeholder="12 min" {...field("durationEn")} />
              {errors.durationEn && (
                <p className="text-red-500 text-xs">{errors.durationEn.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Short Description ─────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Short Description
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("descEn")} />
          <div className="space-y-1.5">
            <Label>Description (AR)</Label>
            <Textarea
              rows={2}
              dir="rtl"
              placeholder="نظرة عامة مختصرة..."
              {...field("descAr")}
            />
            {errors.descAr && (
              <p className="text-red-500 text-xs">{errors.descAr.message}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("descAr")} />
          <div className="space-y-1.5">
            <Label>Description (EN)</Label>
            <Textarea
              rows={2}
              placeholder="A brief overview..."
              {...field("descEn")}
            />
            {errors.descEn && (
              <p className="text-red-500 text-xs">{errors.descEn.message}</p>
            )}
          </div>
        </>
      )}

      {/* ── Full Description ──────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Full Description
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("fullDescEn")} />
          <div className="space-y-1.5">
            <Label>Full Description (AR)</Label>
            <Textarea
              rows={4}
              dir="rtl"
              placeholder="شرح أكثر تفصيلاً..."
              {...field("fullDescAr")}
            />
            {errors.fullDescAr && (
              <p className="text-red-500 text-xs">{errors.fullDescAr.message}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("fullDescAr")} />
          <div className="space-y-1.5">
            <Label>Full Description (EN)</Label>
            <Textarea
              rows={4}
              placeholder="A more detailed explanation..."
              {...field("fullDescEn")}
            />
            {errors.fullDescEn && (
              <p className="text-red-500 text-xs">{errors.fullDescEn.message}</p>
            )}
          </div>
        </>
      )}

      {/* ── Takeaways ─────────────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Key Takeaways (JSON arrays)
        </h3>
      </div>
      <p className="text-xs text-gray-500 -mt-3">
        Enter as a JSON array of strings, e.g.{" "}
        <code className="bg-gray-100 px-1 rounded">
          [&quot;Point 1&quot;, &quot;Point 2&quot;]
        </code>
      </p>
      {isAr ? (
        <>
          <input type="hidden" {...register("takeawaysEn")} />
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
              <p className="text-red-500 text-xs">
                {errors.takeawaysAr.message}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...register("takeawaysAr")} />
          <div className="space-y-1.5">
            <Label>Takeaways (EN)</Label>
            <Textarea
              rows={4}
              placeholder={'["You will learn...", "How to..."]'}
              className="font-mono text-sm"
              {...register("takeawaysEn")}
            />
            {errors.takeawaysEn && (
              <p className="text-red-500 text-xs">
                {errors.takeawaysEn.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* ── Link Text ─────────────────────────────────────────── */}
      <div className="pt-1 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Link Text
        </h3>
      </div>
      {isAr ? (
        <>
          <input type="hidden" {...field("linkTextEn")} />
          <div className="space-y-1.5">
            <Label>Link Text (AR)</Label>
            <Input
              dir="rtl"
              placeholder="شاهد على يوتيوب"
              {...field("linkTextAr")}
            />
            {errors.linkTextAr && (
              <p className="text-red-500 text-xs">{errors.linkTextAr.message}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...field("linkTextAr")} />
          <div className="space-y-1.5">
            <Label>Link Text (EN)</Label>
            <Input placeholder="Watch on YouTube" {...field("linkTextEn")} />
            {errors.linkTextEn && (
              <p className="text-red-500 text-xs">{errors.linkTextEn.message}</p>
            )}
          </div>
        </>
      )}

      {/* ── Actions ───────────────────────────────────────────── */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Check className="w-4 h-4 mr-1" />
          )}
          Save Video
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main VideosEditor ────────────────────────────────────────────────────────

interface VideosEditorProps {
  initialVideos: VideoRecord[];
}

export default function VideosEditor({ initialVideos }: VideosEditorProps) {
  const { adminLang } = useAdminLang();
  const isAr = adminLang === "ar";
  const [videos, setVideos] = useState<VideoRecord[]>(initialVideos);
  const [addingVideo, setAddingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reloadVideos = async () => {
    const res = await fetch("/api/admin/videos");
    if (res.ok) setVideos(await res.json());
  };

  const handleAddVideo = async (data: VideoFormValues) => {
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reloadVideos();
      setAddingVideo(false);
    }
  };

  const handleUpdateVideo = async (id: string, data: VideoFormValues) => {
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await reloadVideos();
      setEditingVideoId(null);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Delete this video? This action cannot be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) await reloadVideos();
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {videos.length} video{videos.length !== 1 ? "s" : ""} in the
            library. Manage video content and metadata.
          </p>
        </div>
        <Button onClick={() => setAddingVideo(true)} disabled={addingVideo}>
          <Plus className="w-4 h-4 mr-1" />
          Add Video
        </Button>
      </div>

      {/* Add Video Form */}
      {addingVideo && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoForm
              onSave={handleAddVideo}
              onCancel={() => setAddingVideo(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {videos.length === 0 && !addingVideo && (
        <div className="text-center py-20 text-gray-400">
          <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm mt-1">
            Click &quot;Add Video&quot; to get started.
          </p>
        </div>
      )}

      {/* Videos List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {videos.map((video) => {
          const isEditing = editingVideoId === video.id;

          return (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate" dir={isAr ? "rtl" : undefined}>
                      {isAr ? video.titleAr : video.titleEn}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="secondary">#{video.sortOrder}</Badge>
                    {(isAr ? video.labelAr : video.labelEn) && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        {isAr ? video.labelAr : video.labelEn}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() =>
                        setEditingVideoId(isEditing ? null : video.id)
                      }
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteVideo(video.id)}
                      disabled={deletingId === video.id}
                    >
                      {deletingId === video.id ? (
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
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        Video ID
                      </span>
                      <p>
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                          {video.videoId}
                        </code>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        Date
                      </span>
                      <p className="font-medium" dir={isAr ? "rtl" : undefined}>
                        {video.day} {isAr ? video.monthAr : video.monthEn}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        Duration
                      </span>
                      <p className="font-medium" dir={isAr ? "rtl" : undefined}>
                        {isAr ? video.durationAr : video.durationEn}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">
                        Description
                      </span>
                      <p className="text-gray-600 line-clamp-1" dir={isAr ? "rtl" : undefined}>
                        {isAr ? video.descAr : video.descEn}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}

              {/* Edit Form */}
              {isEditing && (
                <CardContent className="pt-0 border-t">
                  <div className="pt-4">
                    <VideoForm
                      initial={video}
                      onSave={(data) => handleUpdateVideo(video.id, data)}
                      onCancel={() => setEditingVideoId(null)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
