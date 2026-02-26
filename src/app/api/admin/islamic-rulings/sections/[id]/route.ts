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
    const { nameEn, nameAr, sortOrder } = body;

    const section = await prisma.islamicRulingSection.update({
      where: { id },
      data: {
        ...(nameEn !== undefined && { nameEn }),
        ...(nameAr !== undefined && { nameAr }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("[PUT /api/admin/islamic-rulings/sections/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.islamicRulingSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/islamic-rulings/sections/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
