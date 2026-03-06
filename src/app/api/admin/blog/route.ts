import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { blogArticleSchema } from "@/lib/schemas/blog";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const articles = await prisma.blogArticle.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, blogArticleSchema);
  if (error) return error;
  const article = await prisma.blogArticle.create({
    data: {
      slug: data.slug,
      imageUrl: data.imageUrl || "",
      imageAltEn: data.imageAltEn || null,
      imageAltAr: data.imageAltAr || null,
      category: data.category || null,
      tags: data.tags || null,
      day: data.day || "",
      monthEn: data.monthEn || "",
      monthAr: data.monthAr || "",
      readTimeEn: data.readTimeEn || "",
      readTimeAr: data.readTimeAr || "",
      titleEn: data.titleEn || "",
      titleAr: data.titleAr || "",
      excerptEn: data.excerptEn || "",
      excerptAr: data.excerptAr || "",
      bodyEn: data.bodyEn || "[]",
      bodyAr: data.bodyAr || "[]",
      suggestedBreakAfter: data.suggestedBreakAfter ?? null,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
      // SEO
      metaTitleEn: data.metaTitleEn || null,
      metaTitleAr: data.metaTitleAr || null,
      metaDescriptionEn: data.metaDescriptionEn || null,
      metaDescriptionAr: data.metaDescriptionAr || null,
      ogImageUrl: data.ogImageUrl || null,
      keywords: data.keywords || null,
    },
  });
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "create",
    resource: "BlogArticle",
    resourceId: article.id,
    details: JSON.stringify({ slug: data.slug, titleEn: data.titleEn }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-blog-list", "default");
  revalidateTag("admin-homepage-blog", "default");
  return NextResponse.json(article, { status: 201 });
}
