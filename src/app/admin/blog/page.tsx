import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import BlogArticleDeleteButton from "@/components/admin/BlogArticleDeleteButton";

export const metadata = { title: "Blog Articles - Nemaya Admin" };

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const articles = await prisma.blogArticle.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      titleAr: true,
      published: true,
      sortOrder: true,
      day: true,
      monthEn: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Articles</h1>
          <p className="text-gray-500 mt-1">
            {articles.length} article{articles.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No articles yet.</p>
              <Link href="/admin/blog/new" className="mt-3">
                <Button size="sm" variant="outline">
                  Create your first article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500 w-12">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Title (EN)</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Title (AR)</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {article.sortOrder}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">
                          {article.titleEn}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-600 max-w-[180px] truncate text-right" dir="rtl">
                          {article.titleAr}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {article.slug}
                        </code>
                      </td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {article.day} {article.monthEn}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={article.published ? "success" : "secondary"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/blog/${article.id}`}>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Pencil className="w-3.5 h-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <BlogArticleDeleteButton id={article.id} title={article.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
