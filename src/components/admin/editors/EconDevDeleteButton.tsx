"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export default function EconDevDeleteButton({
  articleId,
  articleTitle,
}: {
  articleId: string;
  articleTitle: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${articleTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/economic-developments/${articleId}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
