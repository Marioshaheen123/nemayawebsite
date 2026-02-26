import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sections = await prisma.islamicRulingSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { nameEn, nameAr, sortOrder } = body;

    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: "nameEn and nameAr are required" },
        { status: 400 }
      );
    }

    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.islamicRulingSection.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const section = await prisma.islamicRulingSection.create({
      data: { nameEn, nameAr, sortOrder: resolvedSortOrder },
      include: { items: true },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/islamic-rulings/sections]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
