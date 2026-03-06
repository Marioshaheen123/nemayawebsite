import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import Link from "next/link";
import Image from "next/image";
import EconDevDeleteButton from "@/components/admin/editors/EconDevDeleteButton";

export default async function EconomicDevelopmentsListPage() {
  const articles = await cached(
    () =>
      prisma.economicDevelopment
        .findMany({ orderBy: { sortOrder: "asc" } })
        .then((a) => JSON.parse(JSON.stringify(a))),
    "admin-econ-dev-list",
    ["admin-econ-dev-list"]
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/economic-developments/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Article
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e8ecf1]">
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Image
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Title
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Slug
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Featured
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-left text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Order
              </th>
              <th className="text-right text-[12px] font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8ecf1]">
            {articles.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-[13px] text-[#a0a5af]"
                >
                  No articles yet. Click &ldquo;Add Article&rdquo; to create
                  one.
                </td>
              </tr>
            )}
            {articles.map((article: any) => (
              <tr
                key={article.id}
                className="hover:bg-[#f9fafb]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt=""
                      width={48}
                      height={32}
                      className="w-12 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-8 bg-[#f4f5fa] rounded flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c0c4cc"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-medium text-[#2e263d] line-clamp-1">
                    {article.titleEn || "Untitled"}
                  </span>
                  {article.titleAr && (
                    <span
                      className="block text-[11px] text-[#a0a5af] line-clamp-1 mt-0.5"
                      dir="rtl"
                    >
                      {article.titleAr}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6b7280] font-mono">
                    {article.slug}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      article.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      article.featured
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {article.featured ? "Featured" : "Normal"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6b7280]">
                    {article.day} {article.monthEn}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6b7280]">
                    {article.sortOrder}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/economic-developments/${article.id}`}
                      className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors"
                    >
                      Edit
                    </Link>
                    <EconDevDeleteButton
                      articleId={article.id}
                      articleTitle={article.titleEn || "this article"}
                    />
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
