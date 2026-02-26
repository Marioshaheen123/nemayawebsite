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
    const { pageType, titleEn, titleAr, paragraphsEn, paragraphsAr, sortOrder } = body;

    const section = await prisma.legalSection.update({
      where: { id },
      data: {
        ...(pageType !== undefined && { pageType }),
        ...(titleEn !== undefined && { titleEn }),
        ...(titleAr !== undefined && { titleAr }),
        ...(paragraphsEn !== undefined && {
          paragraphsEn: typeof paragraphsEn === "string" ? paragraphsEn : JSON.stringify(paragraphsEn),
        }),
        ...(paragraphsAr !== undefined && {
          paragraphsAr: typeof paragraphsAr === "string" ? paragraphsAr : JSON.stringify(paragraphsAr),
        }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("[PUT /api/admin/legal/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.legalSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/legal/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
