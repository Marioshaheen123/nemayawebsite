"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface Transaction {
  id: string;
  userId: string;
  date: string;
  method: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  reference: string | null;
  note: string | null;
}

const STATUS_OPTIONS = ["Completed", "Pending", "Failed"] as const;
const TYPE_FILTERS = ["All", "Deposit", "Withdrawal", "Bonus"] as const;
const STATUS_FILTERS = ["All", "Completed", "Pending", "Failed"] as const;

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const typeBadge = (type: string) => {
  const colors: Record<string, string> = {
    Deposit: "bg-green-100 text-green-700",
    Withdrawal: "bg-red-100 text-red-700",
    Bonus: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </span>
  );
};

export default function TransactionsEditor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (typeFilter !== "All") params.set("type", typeFilter);
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/transactions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await adminFetch(`/api/admin/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
      }
    } catch {
      // silent
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  const extractProofUrl = (note: string | null) => {
    if (!note) return null;
    const match = note.match(/Proof:\s*(\/uploads\/[^\s]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-[#2e263d]">Transactions ({total})</h2>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            className="border border-[#e8ecf1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent cursor-pointer"
          >
            {TYPE_FILTERS.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="border border-[#e8ecf1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent cursor-pointer"
          >
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#e8ecf1] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fb] border-b border-[#e8ecf1]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Date</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">User ID</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Type</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Method</th>
              <th className="text-right px-4 py-3 font-medium text-[#6b7280]">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Proof</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#6b7280]">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#6b7280]">No transactions found</td></tr>
            ) : (
              transactions.map((t) => {
                const proofUrl = extractProofUrl(t.note);
                return (
                  <tr key={t.id} className="border-b border-[#e8ecf1] hover:bg-[#f8f9fb]">
                    <td className="px-4 py-3 text-[#6b7280]">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">{t.userId.slice(0, 12)}...</td>
                    <td className="px-4 py-3">{typeBadge(t.type)}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{t.method}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={t.amount >= 0 ? "text-green-600" : "text-red-600"}>
                        {t.amount >= 0 ? "+" : ""}{t.amount} {t.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                    <td className="px-4 py-3">
                      {proofUrl ? (
                        <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">
                          View
                        </a>
                      ) : (
                        <span className="text-[#6b7280]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {t.status === "Pending" ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(t.id, "Completed")}
                            disabled={updatingId === t.id}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 cursor-pointer disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(t.id, "Failed")}
                            disabled={updatingId === t.id}
                            className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 cursor-pointer disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <select
                          value={t.status}
                          onChange={(e) => updateStatus(t.id, e.target.value)}
                          disabled={updatingId === t.id}
                          className="border border-[#e8ecf1] rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })
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
