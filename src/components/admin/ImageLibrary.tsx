"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  X,
  Copy,
  Check,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteImage {
  id: string;
  path: string;
  altText: string | null;
  category: string | null;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

const CATEGORIES = ["hero", "blog", "about", "trading", "team", "misc"];

export default function ImageLibrary() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    altText: "",
    category: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `/api/admin/images?category=${encodeURIComponent(selectedCategory)}`
        : "/api/admin/images";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      setError("Failed to load images.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (uploadForm.altText) formData.append("altText", uploadForm.altText);
      if (uploadForm.category) formData.append("category", uploadForm.category);

      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const uploaded = await res.json();
      setImages((prev) => [uploaded, ...prev]);
      setUploadForm({ altText: "", category: "" });
      showSuccess(`"${file.name}" uploaded successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleDelete(id: string, fileName: string) {
    if (!confirm(`Delete "${fileName}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((img) => img.id !== id));
      showSuccess("Image deleted.");
    } catch (err) {
      setError("Failed to delete image.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  async function copyPath(id: string, path: string) {
    await navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatBytes(bytes: number | null): string {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // All categories present in the data
  const allCategories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean) as string[])
  );
  const displayCategories = Array.from(new Set([...CATEGORIES, ...allCategories]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Images Library</h1>
          <p className="text-gray-500 mt-1">
            {images.length} image{images.length !== 1 ? "s" : ""}
            {selectedCategory && ` in "${selectedCategory}"`}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {successMsg}
        </div>
      )}

      {/* Upload Area */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm">Upload Image</h2>

          {/* Upload metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text (optional)</Label>
              <Input
                id="altText"
                value={uploadForm.altText}
                onChange={(e) => setUploadForm((f) => ({ ...f, altText: e.target.value }))}
                placeholder="Describe the image..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <select
                id="category"
                value={uploadForm.category}
                onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">No category</option>
                {displayCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-400">JPEG, PNG, GIF, WebP, SVG supported</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <Button
          size="sm"
          variant={selectedCategory === "" ? "default" : "outline"}
          className="h-8 text-xs"
          onClick={() => setSelectedCategory("")}
        >
          All
        </Button>
        {displayCategories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading images...</span>
        </div>
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No images yet. Upload your first image above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={image.path}
                  alt={image.altText || image.fileName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyPath(image.id, image.path)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Copy path"
                  >
                    {copiedId === image.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id, image.fileName)}
                    disabled={deletingId === image.id}
                    className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete image"
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="p-2 space-y-1">
                <p className="text-xs font-medium text-gray-700 truncate" title={image.fileName}>
                  {image.fileName}
                </p>
                <div className="flex items-center justify-between">
                  {image.category ? (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {image.category}
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-gray-300">—</span>
                  )}
                  <span className="text-[10px] text-gray-400">{formatBytes(image.sizeBytes)}</span>
                </div>
                {image.altText && (
                  <p className="text-[10px] text-gray-400 truncate" title={image.altText}>
                    {image.altText}
                  </p>
                )}
                {/* Path */}
                <button
                  onClick={() => copyPath(image.id, image.path)}
                  className="w-full text-left"
                  title={image.path}
                >
                  <p className="text-[10px] text-blue-500 truncate hover:text-blue-700 font-mono">
                    {image.path}
                  </p>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
