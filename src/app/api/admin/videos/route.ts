import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { videoSchema } from "@/lib/schemas/video";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, videoSchema);
  if (error) return error;
  const video = await prisma.video.create({
    data: {
      videoId: data.videoId,
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      descEn: data.descEn,
      descAr: data.descAr,
      fullDescEn: data.fullDescEn,
      fullDescAr: data.fullDescAr,
      takeawaysEn: data.takeawaysEn,
      takeawaysAr: data.takeawaysAr,
      linkTextEn: data.linkTextEn,
      linkTextAr: data.linkTextAr,
      day: data.day,
      monthEn: data.monthEn,
      monthAr: data.monthAr,
      durationEn: data.durationEn,
      durationAr: data.durationAr,
      videoUrl: data.videoUrl,
      labelEn: data.labelEn || "",
      labelAr: data.labelAr || "",
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
    resource: "Video",
    resourceId: video.id,
    details: JSON.stringify({ videoId: data.videoId, titleEn: data.titleEn }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/videos");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-videos-list", "default");
  return NextResponse.json(video, { status: 201 });
}
