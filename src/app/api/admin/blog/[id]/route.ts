import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const article = await prisma.blogArticle.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(article);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

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

    // Check slug uniqueness if slug is being changed
    if (slug) {
      const existing = await prisma.blogArticle.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    const article = await prisma.blogArticle.update({
      where: { id },
      data: {
        ...(slug !== undefined && { slug }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(day !== undefined && { day }),
        ...(monthEn !== undefined && { monthEn }),
        ...(monthAr !== undefined && { monthAr }),
        ...(readTimeEn !== undefined && { readTimeEn }),
        ...(readTimeAr !== undefined && { readTimeAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(titleAr !== undefined && { titleAr }),
        ...(excerptEn !== undefined && { excerptEn }),
        ...(excerptAr !== undefined && { excerptAr }),
        ...(bodyEn !== undefined && {
          bodyEn: typeof bodyEn === "string" ? bodyEn : JSON.stringify(bodyEn),
        }),
        ...(bodyAr !== undefined && {
          bodyAr: typeof bodyAr === "string" ? bodyAr : JSON.stringify(bodyAr),
        }),
        ...(suggestedBreakAfter !== undefined && {
          suggestedBreakAfter: suggestedBreakAfter != null ? Number(suggestedBreakAfter) : null,
        }),
        ...(published !== undefined && { published }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[PUT /api/admin/blog/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.blogArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/blog/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
