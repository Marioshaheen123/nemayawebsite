"use client";

import AccountTypePlanForm from "@/components/admin/editors/AccountTypePlanForm";

export default function NewAccountTypePage() {
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AccountTypePlanForm />
    </div>
  );
}
