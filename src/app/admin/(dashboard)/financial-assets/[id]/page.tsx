"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import FinancialAssetForm from "@/components/admin/editors/FinancialAssetForm";

export default function EditFinancialAssetPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/financial-assets/${id}`)
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.error) {
    return <div className="text-center py-20 text-[#a0a5af]">Asset not found.</div>;
  }

  return <FinancialAssetForm mode="edit" initialData={data} />;
}
