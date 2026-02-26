import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogArticleForm from "@/components/admin/BlogArticleForm";

export const metadata = { title: "New Blog Article - Nemaya Admin" };

export default async function NewBlogArticlePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Fill in the details below to create a new blog article.
        </p>
      </div>
      <BlogArticleForm mode="create" />
    </div>
  );
}
