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

  const {
    nameEn,
    nameAr,
    priceEn,
    priceAr,
    periodEn,
    periodAr,
    descriptionEn,
    descriptionAr,
    featuresLabelEn,
    featuresLabelAr,
    ctaEn,
    ctaAr,
    ctaStyle,
    bg,
    gradient,
    sortOrder,
  } = body;

  const plan = await prisma.plan.update({
    where: { id },
    data: {
      ...(nameEn !== undefined && { nameEn }),
      ...(nameAr !== undefined && { nameAr }),
      ...(priceEn !== undefined && { priceEn }),
      ...(priceAr !== undefined && { priceAr }),
      ...(periodEn !== undefined && { periodEn }),
      ...(periodAr !== undefined && { periodAr }),
      ...(descriptionEn !== undefined && { descriptionEn }),
      ...(descriptionAr !== undefined && { descriptionAr }),
      ...(featuresLabelEn !== undefined && { featuresLabelEn }),
      ...(featuresLabelAr !== undefined && { featuresLabelAr }),
      ...(ctaEn !== undefined && { ctaEn }),
      ...(ctaAr !== undefined && { ctaAr }),
      ...(ctaStyle !== undefined && { ctaStyle }),
      ...(bg !== undefined && { bg }),
      ...(gradient !== undefined && { gradient }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  return NextResponse.json(plan);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.plan.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
