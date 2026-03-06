"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface ContactRequest {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  reason: string;
  requestType: string;
  topicDetails: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["New", "In Progress", "Resolved"] as const;
const STATUS_FILTERS = ["All", "New", "In Progress", "Resolved"] as const;

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function ContactRequestsEditor() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const limit = 20;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/contact-requests?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await adminFetch(`/api/admin/contact-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
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
        <h2 className="text-lg font-semibold text-[#2e263d]">Contact Requests ({total})</h2>
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
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Name</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Email</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Reason</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Type</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#6b7280]">Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#6b7280]">No contact requests</td></tr>
            ) : (
              requests.map((r) => (
                <>
                  <tr
                    key={r.id}
                    className="border-b border-[#e8ecf1] hover:bg-[#f8f9fb] cursor-pointer"
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    <td className="px-4 py-3 text-[#6b7280]">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.email}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.phoneNumber}</td>
                    <td className="px-4 py-3 max-w-[150px] truncate">{r.reason}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{r.requestType}</td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        disabled={updatingId === r.id}
                        className="border border-[#e8ecf1] rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expandedId === r.id && (
                    <tr key={`${r.id}-detail`} className="border-b border-[#e8ecf1] bg-[#f8f9fb]">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium text-[#6b7280]">Reason:</span> {r.reason}</p>
                          <p><span className="font-medium text-[#6b7280]">Request Type:</span> {r.requestType}</p>
                          {r.topicDetails && (
                            <p><span className="font-medium text-[#6b7280]">Details:</span> {r.topicDetails}</p>
                          )}
                          {r.userId && (
                            <p><span className="font-medium text-[#6b7280]">User ID:</span> <span className="font-mono text-xs">{r.userId}</span></p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
