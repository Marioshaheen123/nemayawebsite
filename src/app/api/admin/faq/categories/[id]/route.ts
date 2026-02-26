import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { nameEn, nameAr, sortOrder, isHomepage } = body;

  const category = await prisma.faqCategory.update({
    where: { id },
    data: {
      ...(nameEn !== undefined && { nameEn }),
      ...(nameAr !== undefined && { nameAr }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isHomepage !== undefined && { isHomepage }),
    },
    include: { questions: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.faqCategory.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
