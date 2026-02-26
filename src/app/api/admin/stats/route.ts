import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [blogCount, videoCount, faqCount, planCount, assetCount, imageCount] = await Promise.all([
      prisma.blogArticle.count(),
      prisma.video.count(),
      prisma.faqItem.count(),
      prisma.plan.count(),
      prisma.financialAsset.count(),
      prisma.siteImage.count(),
    ]);

    return NextResponse.json({ blogCount, videoCount, faqCount, planCount, assetCount, imageCount });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
