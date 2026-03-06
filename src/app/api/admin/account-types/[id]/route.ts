import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { planSchema } from "@/lib/schemas/content-block";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  // If per-plan benefits are empty, pre-populate from global PlanFeature table
  if (isEmpty(plan.benefitsEn)) {
    const features = await prisma.planFeature.findMany({ orderBy: { sortOrder: "asc" } });
    if (features.length > 0) {
      plan.benefitsEn = JSON.stringify(features.map((f) => f.labelEn));
      plan.benefitsAr = JSON.stringify(features.map((f) => f.labelAr));
    }
  }

  return NextResponse.json(plan);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await validateBody(request, planSchema);
  if (error) return error;
  const plan = await prisma.plan.update({
    where: { id },
    data: {
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      priceEn: data.priceEn,
      priceAr: data.priceAr,
      periodEn: data.periodEn,
      periodAr: data.periodAr,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      featuresLabelEn: data.featuresLabelEn,
      featuresLabelAr: data.featuresLabelAr,
      ctaEn: data.ctaEn,
      ctaAr: data.ctaAr,
      ctaUrl: data.ctaUrl || "/register",
      ctaStyle: data.ctaStyle,
      bg: data.bg,
      gradient: data.gradient,
      sortOrder: data.sortOrder ?? 0,
      benefitsEn: data.benefitsEn || "[]",
      benefitsAr: data.benefitsAr || "[]",
    },
  });
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "update",
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
  return NextResponse.json(plan);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "delete",
    resource: "Plan",
    resourceId: id,
    details: JSON.stringify({ id }),
    ip: getClientIp(request),
  });

  await prisma.plan.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/account-types");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-account-types-list", "default");
  revalidateTag("admin-homepage-pricing", "default");
  return NextResponse.json({ success: true });
}
