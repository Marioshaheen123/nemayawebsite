"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface VideoDeleteButtonProps {
  id: string;
  title: string;
}

export default function VideoDeleteButton({ id, title }: VideoDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
