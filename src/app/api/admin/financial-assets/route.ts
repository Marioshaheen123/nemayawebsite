import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.financialAsset.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      nameEn: true,
      nameAr: true,
      headlineEn: true,
      imageUrl: true,
      sortOrder: true,
      _count: {
        select: {
          instruments: true,
          advantages: true,
          faqs: true,
        },
      },
    },
  });

  return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      slug,
      nameEn,
      nameAr,
      headlineEn,
      headlineAr,
      descriptionEn,
      descriptionAr,
      imageUrl,
      statsEn,
      statsAr,
      whatIsEn,
      whatIsAr,
      sortOrder,
    } = body;

    if (!slug || !nameEn || !nameAr) {
      return NextResponse.json(
        { error: "slug, nameEn, and nameAr are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.financialAsset.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.financialAsset.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const asset = await prisma.financialAsset.create({
      data: {
        slug,
        nameEn,
        nameAr,
        headlineEn: headlineEn ?? "",
        headlineAr: headlineAr ?? "",
        descriptionEn: descriptionEn ?? "",
        descriptionAr: descriptionAr ?? "",
        imageUrl: imageUrl ?? "",
        statsEn: typeof statsEn === "string" ? statsEn : JSON.stringify(statsEn ?? []),
        statsAr: typeof statsAr === "string" ? statsAr : JSON.stringify(statsAr ?? []),
        whatIsEn: typeof whatIsEn === "string" ? whatIsEn : JSON.stringify(whatIsEn ?? []),
        whatIsAr: typeof whatIsAr === "string" ? whatIsAr : JSON.stringify(whatIsAr ?? []),
        sortOrder: resolvedSortOrder,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/financial-assets]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
