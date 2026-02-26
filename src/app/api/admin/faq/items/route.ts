import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.faqItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { questionEn, questionAr, answerEn, answerAr, sortOrder, categoryId } = body;

  if (!questionEn || !questionAr || !answerEn || !answerAr || !categoryId) {
    return NextResponse.json(
      { error: "questionEn, questionAr, answerEn, answerAr, categoryId are required" },
      { status: 400 }
    );
  }

  const item = await prisma.faqItem.create({
    data: {
      questionEn,
      questionAr,
      answerEn,
      answerAr,
      sortOrder: sortOrder ?? 0,
      categoryId,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
