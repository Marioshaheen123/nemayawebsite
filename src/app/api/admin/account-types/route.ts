import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { planSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, planSchema);
  if (error) return error;
  const plan = await prisma.plan.create({
    data: {
      nameEn: data.nameEn || "",
      nameAr: data.nameAr || "",
      priceEn: data.priceEn || "",
      priceAr: data.priceAr || "",
      periodEn: data.periodEn || "",
      periodAr: data.periodAr || "",
      descriptionEn: data.descriptionEn || "",
      descriptionAr: data.descriptionAr || "",
      featuresLabelEn: data.featuresLabelEn || "",
      featuresLabelAr: data.featuresLabelAr || "",
      ctaEn: data.ctaEn || "",
      ctaAr: data.ctaAr || "",
      ctaUrl: data.ctaUrl || "/register",
      ctaStyle: data.ctaStyle || "outline",
      bg: data.bg || "#ffffff",
      gradient: data.gradient ?? false,
      sortOrder: data.sortOrder ?? 0,
      benefitsEn: data.benefitsEn || "[]",
      benefitsAr: data.benefitsAr || "[]",
    },
  });
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "create",
    resource: "Plan",
    resourceId: plan.id,
    details: JSON.stringify({ nameEn: data.nameEn }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/account-types");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-account-types-list", "default");
  revalidateTag("admin-homepage-pricing", "default");
  return NextResponse.json(plan, { status: 201 });
}
