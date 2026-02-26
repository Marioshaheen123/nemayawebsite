import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId");

  const items = await prisma.islamicRulingItem.findMany({
    where: sectionId ? { sectionId } : undefined,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      sectionId,
      titleEn,
      titleAr,
      questionEn,
      questionAr,
      answerEn,
      answerAr,
      muftiEn,
      muftiAr,
      sortOrder,
    } = body;

    if (!sectionId || !titleEn || !titleAr) {
      return NextResponse.json(
        { error: "sectionId, titleEn, and titleAr are required" },
        { status: 400 }
      );
    }

    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.islamicRulingItem.aggregate({
        where: { sectionId },
        _max: { sortOrder: true },
      });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const item = await prisma.islamicRulingItem.create({
      data: {
        sectionId,
        titleEn,
        titleAr,
        questionEn: questionEn ?? "",
        questionAr: questionAr ?? "",
        answerEn: answerEn ?? "",
        answerAr: answerAr ?? "",
        muftiEn: muftiEn ?? "",
        muftiAr: muftiAr ?? "",
        sortOrder: resolvedSortOrder,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/islamic-rulings/items]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
