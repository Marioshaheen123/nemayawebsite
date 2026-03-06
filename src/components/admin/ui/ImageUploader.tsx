"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";

interface ImageUploaderProps {
  label: string;
  currentImage: string;
  onUpload: (newPath: string) => void;
}

export default function ImageUploader({ label, currentImage, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onUpload(data.url);
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-[#2e263d]">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative w-[80px] h-[80px] rounded-lg border border-[#e0e3e8] overflow-hidden bg-[#f4f5fa] flex items-center justify-center shrink-0">
          {currentImage ? (
            <Image src={currentImage} alt={label} fill className="object-cover" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0a5af" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Change Image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {currentImage && (
            <p className="text-[11px] text-[#a0a5af] mt-0.5 truncate max-w-[200px]">
              {currentImage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
