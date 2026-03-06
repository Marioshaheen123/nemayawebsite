import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepagePricingSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

function isEmpty(json: string | null | undefined): boolean {
  if (!json) return true;
  try {
    const arr = JSON.parse(json);
    return !Array.isArray(arr) || arr.length === 0 || arr.every((s: string) => !s);
  } catch {
    return true;
  }
}

export async function GET() {
  const [blocks, plans, features] = await Promise.all([
    getContentBlocks([
      "pricing.sectionHeading",
      "pricing.sectionBadge",
      "pricing.viewAllLabel",
    ]),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.planFeature.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  // Pre-populate empty per-plan benefits from global features
  if (features.length > 0) {
    const fallbackEn = JSON.stringify(features.map((f) => f.labelEn));
    const fallbackAr = JSON.stringify(features.map((f) => f.labelAr));
    for (const plan of plans) {
      if (isEmpty(plan.benefitsEn)) {
        plan.benefitsEn = fallbackEn;
        plan.benefitsAr = fallbackAr;
      }
    }
  }

  return NextResponse.json({
    sectionHeading: blocks["pricing.sectionHeading"] ?? { en: {}, ar: {} },
    sectionBadge: blocks["pricing.sectionBadge"] ?? { label: "", labelAr: "" },
    viewAllLabel: blocks["pricing.viewAllLabel"] ?? { en: "", ar: "" },
    plans,
    features,
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepagePricingSchema);
  if (error) return error;

  // Update content blocks
  await Promise.all([
    updateContentBlock("pricing.sectionHeading", data.sectionHeading),
    updateContentBlock("pricing.sectionBadge", data.sectionBadge),
    updateContentBlock("pricing.viewAllLabel", data.viewAllLabel),
  ]);

  // Recreate plans
  if (data.plans) {
    await prisma.plan.deleteMany();
    for (let i = 0; i < data.plans.length; i++) {
      const p = data.plans[i] as any;
      await prisma.plan.create({
        data: {
          nameEn: p.nameEn || "",
          nameAr: p.nameAr || "",
          priceEn: p.priceEn || "",
          priceAr: p.priceAr || "",
          periodEn: p.periodEn || "",
          periodAr: p.periodAr || "",
          descriptionEn: p.descriptionEn || "",
          descriptionAr: p.descriptionAr || "",
          featuresLabelEn: p.featuresLabelEn || "",
          featuresLabelAr: p.featuresLabelAr || "",
          ctaEn: p.ctaEn || "",
          ctaAr: p.ctaAr || "",
          ctaUrl: p.ctaUrl || "/register",
          ctaStyle: p.ctaStyle || "",
          bg: p.bg || "",
          gradient: p.gradient || false,
          sortOrder: i,
          benefitsEn: p.benefitsEn || "[]",
          benefitsAr: p.benefitsAr || "[]",
        },
      });
    }
  }

  // Recreate features
  if (data.features) {
    await prisma.planFeature.deleteMany();
    for (let i = 0; i < data.features.length; i++) {
      const f = data.features[i] as any;
      await prisma.planFeature.create({
        data: {
          labelEn: f.labelEn || "",
          labelAr: f.labelAr || "",
          sortOrder: i,
        },
      });
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.pricing",
    details: JSON.stringify({ keys: ["pricing.sectionHeading", "pricing.sectionBadge", "pricing.viewAllLabel"], plansCount: data.plans?.length ?? 0, featuresCount: data.features?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-homepage-pricing", "default");
  revalidateTag("admin-account-types-list", "default");
  return NextResponse.json({ success: true });
}
