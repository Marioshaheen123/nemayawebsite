import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      titleEn,
      titleAr,
      questionEn,
      questionAr,
      answerEn,
      answerAr,
      muftiEn,
      muftiAr,
      sortOrder,
      sectionId,
    } = body;

    const item = await prisma.islamicRulingItem.update({
      where: { id },
      data: {
        ...(titleEn !== undefined && { titleEn }),
        ...(titleAr !== undefined && { titleAr }),
        ...(questionEn !== undefined && { questionEn }),
        ...(questionAr !== undefined && { questionAr }),
        ...(answerEn !== undefined && { answerEn }),
        ...(answerAr !== undefined && { answerAr }),
        ...(muftiEn !== undefined && { muftiEn }),
        ...(muftiAr !== undefined && { muftiAr }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(sectionId !== undefined && { sectionId }),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PUT /api/admin/islamic-rulings/items/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.islamicRulingItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/islamic-rulings/items/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
