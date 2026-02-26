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
  const { questionEn, questionAr, answerEn, answerAr, sortOrder, categoryId } = body;

  const item = await prisma.faqItem.update({
    where: { id },
    data: {
      ...(questionEn !== undefined && { questionEn }),
      ...(questionAr !== undefined && { questionAr }),
      ...(answerEn !== undefined && { answerEn }),
      ...(answerAr !== undefined && { answerAr }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(categoryId !== undefined && { categoryId }),
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.faqItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
