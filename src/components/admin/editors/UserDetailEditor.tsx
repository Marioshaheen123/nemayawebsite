"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import Image from "next/image";

interface UserProfile {
  id: string;
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  profession: string;
  additionalPhone: string;
  annualIncome: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  date: string;
  method: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  note: string | null;
}

interface Document {
  id: string;
  docKey: string;
  face: string | null;
  url: string;
  fileName: string;
  status: string;
  createdAt: string;
}

interface ContactReq {
  id: string;
  firstName: string;
  lastName: string;
  reason: string;
  requestType: string;
  status: string;
  createdAt: string;
}

const PROFILE_FIELDS: { key: keyof UserProfile; label: string; editable: boolean }[] = [
  { key: "accountId", label: "Account ID", editable: false },
  { key: "firstName", label: "First Name", editable: true },
  { key: "lastName", label: "Last Name", editable: true },
  { key: "email", label: "Email", editable: true },
  { key: "mobile", label: "Mobile", editable: true },
  { key: "dateOfBirth", label: "Date of Birth", editable: true },
  { key: "address", label: "Address", editable: true },
  { key: "city", label: "City", editable: true },
  { key: "postalCode", label: "Postal Code", editable: true },
  { key: "country", label: "Country", editable: true },
  { key: "profession", label: "Profession", editable: true },
  { key: "additionalPhone", label: "Additional Phone", editable: true },
  { key: "annualIncome", label: "Annual Income", editable: true },
];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Approved: "bg-green-100 text-green-700",
    Resolved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    New: "bg-blue-100 text-blue-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Failed: "bg-red-100 text-red-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function UserDetailEditor({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setTransactions(data.transactions ?? []);
        setDocuments(data.documents ?? []);
        setContactRequests(data.contactRequests ?? []);
        setFormData(data.user);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser((prev) => prev ? { ...prev, ...updated } : prev);
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, [userId, formData]);

  if (loading) {
    return <div className="text-center py-12 text-[#6b7280]">Loading user...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-red-500">User not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <Image src={user.avatar} alt="Avatar" width={56} height={56} className="w-14 h-14 rounded-full object-cover" unoptimized />
        ) : (
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-semibold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-[#2e263d]">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-[#6b7280]">Account: {user.accountId} &middot; Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => { setEditing(false); setFormData(user); }}
                className="px-4 py-2 border border-[#e8ecf1] rounded-lg text-sm font-medium hover:bg-[#f8f9fb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Fields */}
      <div className="border border-[#e8ecf1] rounded-lg overflow-hidden">
        <div className="bg-[#f8f9fb] px-4 py-3 border-b border-[#e8ecf1]">
          <h3 className="text-sm font-semibold text-[#2e263d]">Profile Information</h3>
        </div>
        <div className="divide-y divide-[#e8ecf1]">
          {PROFILE_FIELDS.map((field) => (
            <div key={field.key} className="flex items-center px-4 py-3">
              <span className="w-[180px] text-sm font-medium text-[#6b7280] shrink-0">{field.label}</span>
              {editing && field.editable ? (
                <input
                  type="text"
                  value={(formData as Record<string, string>)[field.key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="flex-1 border border-[#e8ecf1] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
                />
              ) : (
                <span className="text-sm text-[#2e263d]">{(user as unknown as Record<string, string>)[field.key] || "—"}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="border border-[#e8ecf1] rounded-lg overflow-hidden">
        <div className="bg-[#f8f9fb] px-4 py-3 border-b border-[#e8ecf1]">
          <h3 className="text-sm font-semibold text-[#2e263d]">Transactions ({transactions.length})</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-[#6b7280]">No transactions</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fb]">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Date</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Type</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Method</th>
                <th className="text-right px-4 py-2 font-medium text-[#6b7280]">Amount</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Note</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-[#e8ecf1]">
                  <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{statusBadge(t.type)}</td>
                  <td className="px-4 py-2 text-[#6b7280]">{t.method}</td>
                  <td className="px-4 py-2 text-right font-mono">{t.amount > 0 ? "+" : ""}{t.amount} {t.currency}</td>
                  <td className="px-4 py-2">{statusBadge(t.status)}</td>
                  <td className="px-4 py-2 text-[#6b7280] max-w-[200px] truncate">{t.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Documents */}
      <div className="border border-[#e8ecf1] rounded-lg overflow-hidden">
        <div className="bg-[#f8f9fb] px-4 py-3 border-b border-[#e8ecf1]">
          <h3 className="text-sm font-semibold text-[#2e263d]">Documents ({documents.length})</h3>
        </div>
        {documents.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-[#6b7280]">No documents uploaded</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fb]">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Document</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Face</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">File</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id} className="border-t border-[#e8ecf1]">
                  <td className="px-4 py-2 font-medium">{d.docKey}</td>
                  <td className="px-4 py-2 text-[#6b7280]">{d.face || "—"}</td>
                  <td className="px-4 py-2">
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {d.fileName}
                    </a>
                  </td>
                  <td className="px-4 py-2">{statusBadge(d.status)}</td>
                  <td className="px-4 py-2 text-[#6b7280]">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Contact Requests */}
      <div className="border border-[#e8ecf1] rounded-lg overflow-hidden">
        <div className="bg-[#f8f9fb] px-4 py-3 border-b border-[#e8ecf1]">
          <h3 className="text-sm font-semibold text-[#2e263d]">Contact Requests ({contactRequests.length})</h3>
        </div>
        {contactRequests.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-[#6b7280]">No contact requests</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fb]">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Date</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Reason</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Type</th>
                <th className="text-left px-4 py-2 font-medium text-[#6b7280]">Status</th>
              </tr>
            </thead>
            <tbody>
              {contactRequests.map((c) => (
                <tr key={c.id} className="border-t border-[#e8ecf1]">
                  <td className="px-4 py-2">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{c.reason}</td>
                  <td className="px-4 py-2 text-[#6b7280]">{c.requestType}</td>
                  <td className="px-4 py-2">{statusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
