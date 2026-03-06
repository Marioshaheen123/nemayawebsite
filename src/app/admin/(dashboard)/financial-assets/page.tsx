import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import Link from "next/link";
import AssetDeleteButton from "@/components/admin/editors/AssetDeleteButton";

export default async function FinancialAssetsListPage() {
  const assets = await cached(
    async () => {
      const data = await prisma.financialAsset.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { instruments: true, advantages: true, faqs: true } } },
      });
      return JSON.parse(JSON.stringify(data));
    },
    "admin-financial-assets-list",
    ["admin-financial-assets"]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">{assets.length} asset{assets.length !== 1 ? "s" : ""}</p>
        <Link
          href="/admin/financial-assets/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Asset
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e8ecf1]">
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Slug</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Instruments</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Advantages</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">FAQs</th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Order</th>
              <th className="text-right text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8ecf1]">
            {assets.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[13px] text-[#a0a5af]">
                  No financial assets yet. Click &ldquo;Add Asset&rdquo; to create one.
                </td>
              </tr>
            )}
            {assets.map((asset: any) => (
              <tr key={asset.id} className="hover:bg-[#f9fafb]/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-[13px] font-medium text-[#2e263d]">{asset.nameEn || "Untitled"}</span>
                  {asset.nameAr && (
                    <span className="block text-[11px] text-[#a0a5af] mt-0.5" dir="rtl">{asset.nameAr}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6b7280] font-mono bg-[#f4f5fa] px-1.5 py-0.5 rounded">{asset.slug}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    asset._count.instruments > 0 ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"
                  }`}>
                    {asset._count.instruments}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    asset._count.advantages > 0 ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"
                  }`}>
                    {asset._count.advantages}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    asset._count.faqs > 0 ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-500"
                  }`}>
                    {asset._count.faqs}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6b7280]">{asset.sortOrder}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/financial-assets/${asset.id}`} className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors">
                      Edit
                    </Link>
                    <AssetDeleteButton assetId={asset.id} assetName={asset.nameEn || "this asset"} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
