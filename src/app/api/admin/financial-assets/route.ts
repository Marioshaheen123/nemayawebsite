import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

const instrumentSchema = z.object({
  nameEn: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  symbol: z.string().max(50),
  spread: z.string().max(100),
  leverage: z.string().max(100),
  hours: z.string().max(200),
  sortOrder: z.number().int().min(0).default(0),
});

const advantageSchema = z.object({
  titleEn: z.string().min(1).max(300),
  titleAr: z.string().min(1).max(300),
  descEn: z.string().max(2000),
  descAr: z.string().max(2000),
  sortOrder: z.number().int().min(0).default(0),
});

const faqSchema = z.object({
  questionEn: z.string().min(1).max(500),
  questionAr: z.string().min(1).max(500),
  answerEn: z.string().max(5000),
  answerAr: z.string().max(5000),
  sortOrder: z.number().int().min(0).default(0),
});

const createAssetSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  nameEn: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  headlineEn: z.string().max(500).default(""),
  headlineAr: z.string().max(500).default(""),
  descriptionEn: z.string().max(2000).default(""),
  descriptionAr: z.string().max(2000).default(""),
  imageUrl: z.string().max(2000).default(""),
  statsEn: z.string().max(5000).default("[]"),
  statsAr: z.string().max(5000).default("[]"),
  whatIsEn: z.string().max(10000).default("[]"),
  whatIsAr: z.string().max(10000).default("[]"),
  sortOrder: z.number().int().min(0).default(0),
  metaTitleEn: z.string().max(200).optional().nullable(),
  metaTitleAr: z.string().max(200).optional().nullable(),
  metaDescriptionEn: z.string().max(500).optional().nullable(),
  metaDescriptionAr: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
  keywords: z.string().max(1000).optional().nullable(),
  instruments: z.array(instrumentSchema).default([]),
  advantages: z.array(advantageSchema).default([]),
  faqs: z.array(faqSchema).default([]),
});

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const assets = await prisma.financialAsset.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { instruments: true, advantages: true, faqs: true } } },
    });

    return NextResponse.json({ assets: JSON.parse(JSON.stringify(assets)) });
  } catch (error) {
    return safeErrorResponse(error, "admin-financial-assets-get");
  }
}

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = createAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { instruments, advantages, faqs, ...assetData } = parsed.data;

    const asset = await prisma.financialAsset.create({
      data: {
        ...assetData,
        instruments: { create: instruments },
        advantages: { create: advantages },
        faqs: { create: faqs },
      },
      include: {
        instruments: { orderBy: { sortOrder: "asc" } },
        advantages: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "create",
      resource: "FinancialAsset",
      resourceId: asset.id,
      details: JSON.stringify({ slug: asset.slug, name: asset.nameEn }),
      ip: getClientIp(request),
    });

    revalidatePath("/");
    revalidatePath("/financial-assets");
    revalidateTag("admin-financial-assets", "default");

    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A financial asset with this slug already exists" }, { status: 409 });
    }
    return safeErrorResponse(error, "admin-financial-assets-post");
  }
}
