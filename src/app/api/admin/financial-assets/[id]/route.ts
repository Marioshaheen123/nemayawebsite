import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const asset = await prisma.financialAsset.findUnique({
    where: { id },
    include: {
      instruments: { orderBy: { sortOrder: "asc" } },
      advantages: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(asset);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

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
      instruments,
      advantages,
      faqs,
    } = body;

    if (slug) {
      const existing = await prisma.financialAsset.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    const asset = await prisma.financialAsset.update({
      where: { id },
      data: {
        ...(slug !== undefined && { slug }),
        ...(nameEn !== undefined && { nameEn }),
        ...(nameAr !== undefined && { nameAr }),
        ...(headlineEn !== undefined && { headlineEn }),
        ...(headlineAr !== undefined && { headlineAr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(statsEn !== undefined && {
          statsEn: typeof statsEn === "string" ? statsEn : JSON.stringify(statsEn),
        }),
        ...(statsAr !== undefined && {
          statsAr: typeof statsAr === "string" ? statsAr : JSON.stringify(statsAr),
        }),
        ...(whatIsEn !== undefined && {
          whatIsEn: typeof whatIsEn === "string" ? whatIsEn : JSON.stringify(whatIsEn),
        }),
        ...(whatIsAr !== undefined && {
          whatIsAr: typeof whatIsAr === "string" ? whatIsAr : JSON.stringify(whatIsAr),
        }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    // Handle nested instruments if provided
    if (instruments !== undefined) {
      await prisma.instrument.deleteMany({ where: { assetId: id } });
      if (instruments.length > 0) {
        await prisma.instrument.createMany({
          data: instruments.map(
            (
              inst: {
                nameEn: string;
                nameAr: string;
                symbol: string;
                spread: string;
                leverage: string;
                hours: string;
                sortOrder?: number;
              },
              idx: number
            ) => ({
              assetId: id,
              nameEn: inst.nameEn ?? "",
              nameAr: inst.nameAr ?? "",
              symbol: inst.symbol ?? "",
              spread: inst.spread ?? "",
              leverage: inst.leverage ?? "",
              hours: inst.hours ?? "",
              sortOrder: inst.sortOrder ?? idx,
            })
          ),
        });
      }
    }

    // Handle nested advantages if provided
    if (advantages !== undefined) {
      await prisma.assetAdvantage.deleteMany({ where: { assetId: id } });
      if (advantages.length > 0) {
        await prisma.assetAdvantage.createMany({
          data: advantages.map(
            (
              adv: {
                titleEn: string;
                titleAr: string;
                descEn: string;
                descAr: string;
                sortOrder?: number;
              },
              idx: number
            ) => ({
              assetId: id,
              titleEn: adv.titleEn ?? "",
              titleAr: adv.titleAr ?? "",
              descEn: adv.descEn ?? "",
              descAr: adv.descAr ?? "",
              sortOrder: adv.sortOrder ?? idx,
            })
          ),
        });
      }
    }

    // Handle nested FAQs if provided
    if (faqs !== undefined) {
      await prisma.assetFaq.deleteMany({ where: { assetId: id } });
      if (faqs.length > 0) {
        await prisma.assetFaq.createMany({
          data: faqs.map(
            (
              faq: {
                questionEn: string;
                questionAr: string;
                answerEn: string;
                answerAr: string;
                sortOrder?: number;
              },
              idx: number
            ) => ({
              assetId: id,
              questionEn: faq.questionEn ?? "",
              questionAr: faq.questionAr ?? "",
              answerEn: faq.answerEn ?? "",
              answerAr: faq.answerAr ?? "",
              sortOrder: faq.sortOrder ?? idx,
            })
          ),
        });
      }
    }

    const updated = await prisma.financialAsset.findUnique({
      where: { id },
      include: {
        instruments: { orderBy: { sortOrder: "asc" } },
        advantages: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/admin/financial-assets/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.financialAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/financial-assets/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
