import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const required = [
    nameEn, nameAr, priceEn, priceAr, periodEn, periodAr,
    descriptionEn, descriptionAr, featuresLabelEn, featuresLabelAr,
    ctaEn, ctaAr, ctaStyle, bg,
  ];
  if (required.some((v) => v === undefined || v === "")) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const plan = await prisma.plan.create({
    data: {
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
      gradient: gradient ?? false,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
