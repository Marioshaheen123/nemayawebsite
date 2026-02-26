import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.faqCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nameEn, nameAr, sortOrder, isHomepage } = body;

  if (!nameEn || !nameAr) {
    return NextResponse.json({ error: "nameEn and nameAr are required" }, { status: 400 });
  }

  const category = await prisma.faqCategory.create({
    data: {
      nameEn,
      nameAr,
      sortOrder: sortOrder ?? 0,
      isHomepage: isHomepage ?? false,
    },
    include: { questions: true },
  });

  return NextResponse.json(category, { status: 201 });
}
