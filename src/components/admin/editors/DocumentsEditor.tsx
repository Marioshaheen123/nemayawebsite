"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface DocRow {
  id: string;
  userId: string;
  docKey: string;
  face: string | null;
  url: string;
  fileName: string;
  status: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; accountId: string } | null;
}

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"] as const;

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function DocumentsEditor() {
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const limit = 20;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/documents?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await adminFetch(`/api/admin/documents/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
      }
    } catch {
      // silent
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2e263d]">Documents / KYC ({total})</h2>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="border border-[#e8ecf1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent cursor-pointer"
        >
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto border border-[#e8ecf1] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fb] border-b border-[#e8ecf1]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Date</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">User</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Document</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Face</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">File</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b7280]">Loading...</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b7280]">No documents found</td></tr>
            ) : (
              documents.map((d) => (
                <tr key={d.id} className="border-b border-[#e8ecf1] hover:bg-[#f8f9fb]">
                  <td className="px-4 py-3 text-[#6b7280]">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {d.user ? (
                      <div>
                        <div className="font-medium">{d.user.firstName} {d.user.lastName}</div>
                        <div className="text-xs text-[#6b7280]">{d.user.email}</div>
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-[#6b7280]">{d.userId.slice(0, 12)}...</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{d.docKey}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{d.face || "—"}</td>
                  <td className="px-4 py-3">
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">
                      {d.fileName}
                    </a>
                  </td>
                  <td className="px-4 py-3">{statusBadge(d.status)}</td>
                  <td className="px-4 py-3">
                    {d.status === "Pending" ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateStatus(d.id, "Approved")}
                          disabled={updatingId === d.id}
                          className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 cursor-pointer disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(d.id, "Rejected")}
                          disabled={updatingId === d.id}
                          className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 cursor-pointer disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <select
                        value={d.status}
                        onChange={(e) => updateStatus(d.id, e.target.value)}
                        disabled={updatingId === d.id}
                        className="border border-[#e8ecf1] rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#6b7280]">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border border-[#e8ecf1] rounded-lg disabled:opacity-40 hover:bg-[#f8f9fb] cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 border border-[#e8ecf1] rounded-lg disabled:opacity-40 hover:bg-[#f8f9fb] cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
