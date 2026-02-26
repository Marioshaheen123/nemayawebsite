import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const pageType = searchParams.get("pageType");

  const sections = await prisma.legalSection.findMany({
    where: pageType ? { pageType } : undefined,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { pageType, titleEn, titleAr, paragraphsEn, paragraphsAr, sortOrder } = body;

    if (!pageType || !titleEn || !titleAr) {
      return NextResponse.json(
        { error: "pageType, titleEn, and titleAr are required" },
        { status: 400 }
      );
    }

    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.legalSection.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const section = await prisma.legalSection.create({
      data: {
        pageType,
        titleEn,
        titleAr,
        paragraphsEn: typeof paragraphsEn === "string" ? paragraphsEn : JSON.stringify(paragraphsEn ?? []),
        paragraphsAr: typeof paragraphsAr === "string" ? paragraphsAr : JSON.stringify(paragraphsAr ?? []),
        sortOrder: resolvedSortOrder,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/legal]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
