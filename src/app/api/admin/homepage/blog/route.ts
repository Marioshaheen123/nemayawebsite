import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageBlogSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const [blocks, articles] = await Promise.all([
    getContentBlocks(["blog.sectionData"]),
    prisma.blogArticle.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);
  return NextResponse.json({
    sectionData: blocks["blog.sectionData"] ?? {},
    articles,
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageBlogSchema);
  if (error) return error;

  if (data.sectionData) {
    await updateContentBlock("blog.sectionData", data.sectionData);
  }

  // Update individual articles (not delete/recreate — articles have slugs, full bodies, etc.)
  if (data.articles) {
    for (const article of data.articles) {
      if (!article.id) continue;
      await prisma.blogArticle.update({
        where: { id: article.id },
        data: {
          titleEn: article.titleEn,
          titleAr: article.titleAr,
          excerptEn: article.excerptEn,
          excerptAr: article.excerptAr,
          imageUrl: article.imageUrl,
          day: article.day,
          monthEn: article.monthEn,
          monthAr: article.monthAr,
          readTimeEn: article.readTimeEn,
          readTimeAr: article.readTimeAr,
        },
      });
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.blog",
    details: JSON.stringify({ keys: ["blog.sectionData"], articlesCount: data.articles?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-homepage-blog", "default");
  return NextResponse.json({ success: true });
}
