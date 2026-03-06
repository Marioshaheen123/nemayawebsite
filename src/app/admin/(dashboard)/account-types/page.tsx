import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import Link from "next/link";
import PlanDeleteButton from "@/components/admin/editors/PlanDeleteButton";

function parseBenefitsCount(json: string): number {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((b: string) => b.trim()).length : 0;
  } catch {
    return 0;
  }
}

export default async function AccountTypesListPage() {
  const { plans, globalBenefitCount } = await cached(
    async () => {
      const [p, features] = await Promise.all([
        prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.planFeature.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);
      return {
        plans: JSON.parse(JSON.stringify(p)),
        globalBenefitCount: features.length,
      };
    },
    "admin-account-types-list",
    ["admin-account-types-list"]
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">{plans.length} plan{plans.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/account-types/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e0e3e8] text-[#6b7280] text-[13px] font-medium rounded-lg hover:bg-[#f4f5fa] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Page Settings
          </Link>
          <Link
            href="/admin/account-types/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-dark transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Plan
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e8ecf1]">
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Price</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Style</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Benefits</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Order</th>
              <th className="text-right text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8ecf1]">
            {plans.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[13px] text-[#a0a5af]">
                  No plans yet. Click &ldquo;Add Plan&rdquo; to create one.
                </td>
              </tr>
            )}
            {plans.map((plan: any) => {
              const perPlanCount = parseBenefitsCount(plan.benefitsEn);
              const benefitCount = perPlanCount > 0 ? perPlanCount : globalBenefitCount;
              return (
                <tr key={plan.id} className="hover:bg-[#f9fafb]/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#2e263d]">{plan.nameEn || "Untitled"}</span>
                    {plan.nameAr && (
                      <span className="block text-[11px] text-[#a0a5af] mt-0.5" dir="rtl">{plan.nameAr}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[#2e263d]">{plan.priceEn || "\u2014"}</span>
                    {plan.periodEn && (
                      <span className="text-[11px] text-[#a0a5af] ml-1">/{plan.periodEn}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded border border-[#e0e3e8]"
                        style={{ backgroundColor: plan.bg || "#ffffff" }}
                      />
                      <span className="text-[12px] text-[#6b7280]">{plan.ctaStyle}</span>
                      {plan.gradient && (
                        <span className="text-[10px] text-[#a0a5af] bg-[#f4f5fa] px-1.5 py-0.5 rounded">gradient</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      benefitCount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {benefitCount} benefit{benefitCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6b7280]">{plan.sortOrder}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/account-types/${plan.id}`} className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors">
                        Edit
                      </Link>
                      <PlanDeleteButton planId={plan.id} planName={plan.nameEn || "this plan"} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
