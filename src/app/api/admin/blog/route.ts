import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      updatedAt: true,
    },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const {
      slug,
      imageUrl,
      day,
      monthEn,
      monthAr,
      readTimeEn,
      readTimeAr,
      titleEn,
      titleAr,
      excerptEn,
      excerptAr,
      bodyEn,
      bodyAr,
      suggestedBreakAfter,
      published,
      sortOrder,
    } = body;

    // Validate required fields
    if (!slug || !titleEn || !titleAr) {
      return NextResponse.json(
        { error: "slug, titleEn, and titleAr are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.blogArticle.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    // Determine next sortOrder if not provided
    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.blogArticle.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const article = await prisma.blogArticle.create({
      data: {
        slug,
        imageUrl: imageUrl ?? "",
        day: day ?? "",
        monthEn: monthEn ?? "",
        monthAr: monthAr ?? "",
        readTimeEn: readTimeEn ?? "",
        readTimeAr: readTimeAr ?? "",
        titleEn,
        titleAr,
        excerptEn: excerptEn ?? "",
        excerptAr: excerptAr ?? "",
        bodyEn: typeof bodyEn === "string" ? bodyEn : JSON.stringify(bodyEn ?? []),
        bodyAr: typeof bodyAr === "string" ? bodyAr : JSON.stringify(bodyAr ?? []),
        suggestedBreakAfter: suggestedBreakAfter != null ? Number(suggestedBreakAfter) : null,
        published: published ?? false,
        sortOrder: resolvedSortOrder,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/blog]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
