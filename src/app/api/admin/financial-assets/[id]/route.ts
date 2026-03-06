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

const updateAssetSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug").optional(),
  nameEn: z.string().min(1).max(200).optional(),
  nameAr: z.string().min(1).max(200).optional(),
  headlineEn: z.string().max(500).optional(),
  headlineAr: z.string().max(500).optional(),
  descriptionEn: z.string().max(2000).optional(),
  descriptionAr: z.string().max(2000).optional(),
  imageUrl: z.string().max(2000).optional(),
  statsEn: z.string().max(5000).optional(),
  statsAr: z.string().max(5000).optional(),
  whatIsEn: z.string().max(10000).optional(),
  whatIsAr: z.string().max(10000).optional(),
  sortOrder: z.number().int().min(0).optional(),
  metaTitleEn: z.string().max(200).optional().nullable(),
  metaTitleAr: z.string().max(200).optional().nullable(),
  metaDescriptionEn: z.string().max(500).optional().nullable(),
  metaDescriptionAr: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
  keywords: z.string().max(1000).optional().nullable(),
  instruments: z.array(instrumentSchema).optional(),
  advantages: z.array(advantageSchema).optional(),
  faqs: z.array(faqSchema).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const asset = await prisma.financialAsset.findUnique({
      where: { id },
      include: {
        instruments: { orderBy: { sortOrder: "asc" } },
        advantages: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(asset)));
  } catch (error) {
    return safeErrorResponse(error, "admin-financial-asset-get");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await prisma.financialAsset.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { instruments, advantages, faqs, ...assetData } = parsed.data;

    // Use transaction to replace nested data atomically
    const asset = await prisma.$transaction(async (tx) => {
      // Delete and recreate nested data if provided
      if (instruments !== undefined) {
        await tx.instrument.deleteMany({ where: { assetId: id } });
        if (instruments.length > 0) {
          await tx.instrument.createMany({
            data: instruments.map((i) => ({ ...i, assetId: id })),
          });
        }
      }
      if (advantages !== undefined) {
        await tx.assetAdvantage.deleteMany({ where: { assetId: id } });
        if (advantages.length > 0) {
          await tx.assetAdvantage.createMany({
            data: advantages.map((a) => ({ ...a, assetId: id })),
          });
        }
      }
      if (faqs !== undefined) {
        await tx.assetFaq.deleteMany({ where: { assetId: id } });
        if (faqs.length > 0) {
          await tx.assetFaq.createMany({
            data: faqs.map((f) => ({ ...f, assetId: id })),
          });
        }
      }

      // Update asset fields
      return tx.financialAsset.update({
        where: { id },
        data: assetData,
        include: {
          instruments: { orderBy: { sortOrder: "asc" } },
          advantages: { orderBy: { sortOrder: "asc" } },
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      });
    });

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "update",
      resource: "FinancialAsset",
      resourceId: id,
      details: JSON.stringify({ slug: asset.slug }),
      ip: getClientIp(request),
    });

    revalidatePath("/");
    revalidatePath("/financial-assets");
    revalidateTag("admin-financial-assets", "default");

    return NextResponse.json(JSON.parse(JSON.stringify(asset)));
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A financial asset with this slug already exists" }, { status: 409 });
    }
    return safeErrorResponse(error, "admin-financial-asset-patch");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const existing = await prisma.financialAsset.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.financialAsset.delete({ where: { id } });

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "delete",
      resource: "FinancialAsset",
      resourceId: id,
      details: JSON.stringify({ slug: existing.slug, name: existing.nameEn }),
      ip: getClientIp(request),
    });

    revalidatePath("/");
    revalidatePath("/financial-assets");
    revalidateTag("admin-financial-assets", "default");

    return NextResponse.json({ success: true });
  } catch (error) {
    return safeErrorResponse(error, "admin-financial-asset-delete");
  }
}
