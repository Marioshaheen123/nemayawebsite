"use client";

import { useState, useRef } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface VideoUploaderProps {
  label: string;
  currentVideo: string;
  onUpload: (newPath: string) => void;
}

export default function VideoUploader({ label, currentVideo, onUpload }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload/video", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onUpload(data.url);
        setProgress("Uploaded!");
        setTimeout(() => setProgress(""), 2000);
      } else {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        setProgress(err.error || "Upload failed");
        setTimeout(() => setProgress(""), 3000);
      }
    } catch {
      setProgress("Upload failed");
      setTimeout(() => setProgress(""), 3000);
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
          {currentVideo ? (
            <video src={currentVideo} className="w-full h-full object-cover" muted preload="metadata" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0a5af" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
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
            {uploading ? "Uploading..." : currentVideo ? "Change Video" : "Upload Video"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            onChange={handleFileChange}
            className="hidden"
          />
          {currentVideo && (
            <p className="text-[11px] text-[#a0a5af] mt-0.5 truncate max-w-[200px]">
              {currentVideo}
            </p>
          )}
          {progress && (
            <p className="text-[11px] text-accent mt-0.5">{progress}</p>
          )}
        </div>
      </div>
    </div>
  );
}
