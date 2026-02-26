import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import BlogArticleForm from "@/components/admin/BlogArticleForm";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const article = await prisma.blogArticle.findUnique({
    where: { id },
    select: { titleEn: true },
  });
  return {
    title: article ? `Edit: ${article.titleEn} - Nemaya Admin` : "Edit Article - Nemaya Admin",
  };
}

export default async function EditBlogArticlePage({ params }: PageProps) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const article = await prisma.blogArticle.findUnique({ where: { id } });
  if (!article) notFound();

  // Prepare default values for the form
  // bodyEn/bodyAr are stored as JSON string arrays; pass raw strings to the form
  // The form's parseBodyArray will handle converting them to display text
  const defaultValues = {
    id: article.id,
    slug: article.slug,
    imageUrl: article.imageUrl,
    day: article.day,
    monthEn: article.monthEn,
    monthAr: article.monthAr,
    readTimeEn: article.readTimeEn,
    readTimeAr: article.readTimeAr,
    titleEn: article.titleEn,
    titleAr: article.titleAr,
    excerptEn: article.excerptEn,
    excerptAr: article.excerptAr,
    bodyEn: article.bodyEn,
    bodyAr: article.bodyAr,
    suggestedBreakAfter:
      article.suggestedBreakAfter != null ? String(article.suggestedBreakAfter) : "",
    published: article.published,
    sortOrder: String(article.sortOrder),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-500 mt-1 text-sm truncate max-w-xl">{article.titleEn}</p>
      </div>
      <BlogArticleForm mode="edit" defaultValues={defaultValues} />
    </div>
  );
}
