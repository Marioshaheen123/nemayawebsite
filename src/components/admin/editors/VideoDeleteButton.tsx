"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export default function VideoDeleteButton({
  videoId,
  videoTitle,
}: {
  videoId: string;
  videoTitle: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${videoTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/videos/${videoId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-[12px] font-medium text-[#a0a5af] hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
