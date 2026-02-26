"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface BlogArticleDeleteButtonProps {
  id: string;
  title: string;
}

export default function BlogArticleDeleteButton({ id, title }: BlogArticleDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to delete article.");
        return;
      }
      router.refresh();
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      className="h-8 w-8 p-0"
      onClick={handleDelete}
      disabled={loading}
      title="Delete article"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      <span className="sr-only">Delete</span>
    </Button>
  );
}
