"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import Link from "next/link";

interface UserRow {
  id: string;
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  country: string;
  createdAt: string;
}

export default function UsersEditor() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const res = await adminFetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2e263d]">Users ({total})</h2>
        <input
          type="text"
          placeholder="Search by name, email, or account ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="border border-[#e8ecf1] rounded-lg px-3 py-2 text-sm w-[300px] focus:outline-none focus:border-accent"
        />
      </div>

      <div className="overflow-x-auto border border-[#e8ecf1] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fb] border-b border-[#e8ecf1]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Account ID</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Name</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Email</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Mobile</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Country</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b7280]">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b7280]">No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-[#e8ecf1] hover:bg-[#f8f9fb]">
                  <td className="px-4 py-3 font-mono text-xs">{u.accountId}</td>
                  <td className="px-4 py-3">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{u.email}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{u.mobile || "—"}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{u.country || "—"}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-accent hover:underline text-sm font-medium"
                    >
                      View
                    </Link>
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
