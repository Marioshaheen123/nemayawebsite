import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { econDevSchema } from "@/lib/schemas/economic-development";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.economicDevelopment.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await validateBody(request, econDevSchema);
  if (error) return error;
  const article = await prisma.economicDevelopment.update({
    where: { id },
    data: {
      slug: data.slug,
      imageUrl: data.imageUrl,
      imageAltEn: data.imageAltEn || null,
      imageAltAr: data.imageAltAr || null,
      category: data.category || null,
      tags: data.tags || null,
      day: data.day,
      monthEn: data.monthEn,
      monthAr: data.monthAr,
      readTimeEn: data.readTimeEn,
      readTimeAr: data.readTimeAr,
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      excerptEn: data.excerptEn,
      excerptAr: data.excerptAr,
      bodyEn: data.bodyEn,
      bodyAr: data.bodyAr,
      featured: data.featured ?? false,
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
    action: "update",
    resource: "EconomicDevelopment",
    resourceId: article.id,
    details: JSON.stringify({ slug: data.slug, titleEn: data.titleEn }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/economic-developments");
  revalidateTag("content-blocks", "default");
  return NextResponse.json(article);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "delete",
    resource: "EconomicDevelopment",
    resourceId: id,
    details: JSON.stringify({ id }),
    ip: getClientIp(request),
  });

  await prisma.economicDevelopment.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/economic-developments");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
