import { NextRequest, NextResponse } from "next/server";
import { updateContentBlock, getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { legalSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

const HERO_KEYS: Record<string, string> = {
  privacy: "legal.privacyPolicyHeroTitle",
  terms: "legal.termsHeroTitle",
  "deposit-withdrawal": "legal.depositWithdrawalHeroTitle",
  "website-verification": "legal.websiteVerificationHeroTitle",
  "security-reliability": "legal.securityReliabilityHeroTitle",
};

export async function GET(request: NextRequest) {
  const pageType = request.nextUrl.searchParams.get("pageType");
  if (!pageType || !HERO_KEYS[pageType]) {
    return NextResponse.json({ error: "Invalid pageType" }, { status: 400 });
  }

  const heroKey = HERO_KEYS[pageType];
  const [blocks, sections] = await Promise.all([
    getContentBlocks([heroKey]),
    prisma.legalSection.findMany({
      where: { pageType },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return NextResponse.json({
    heroTitle: blocks[heroKey] ?? { en: "", ar: "" },
    sections,
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, legalSchema);
  if (error) return error;
  const { pageType, heroTitle, sections } = data;

  if (!pageType || !HERO_KEYS[pageType]) {
    return NextResponse.json({ error: "Invalid pageType" }, { status: 400 });
  }

  // Update hero title content block
  await updateContentBlock(HERO_KEYS[pageType], heroTitle);

  // Sync sections
  if (sections) {
    const existing = await prisma.legalSection.findMany({
      where: { pageType },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((s) => s.id));
    const incomingIds = new Set(
      sections
        .filter((s: any) => s.id && !s.id.startsWith("new_"))
        .map((s: any) => s.id)
    );

    // Delete removed sections
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await prisma.legalSection.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Upsert sections
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const isNew = !sec.id || sec.id.startsWith("new_");

      const data = {
        pageType,
        titleEn: sec.titleEn || "",
        titleAr: sec.titleAr || "",
        paragraphsEn:
          typeof sec.paragraphsEn === "string"
            ? sec.paragraphsEn
            : JSON.stringify(sec.paragraphsEn ?? []),
        paragraphsAr:
          typeof sec.paragraphsAr === "string"
            ? sec.paragraphsAr
            : JSON.stringify(sec.paragraphsAr ?? []),
        sortOrder: i,
      };

      if (isNew) {
        await prisma.legalSection.create({ data });
      } else {
        await prisma.legalSection.update({ where: { id: sec.id! }, data });
      }
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "update",
    resource: "LegalPage",
    details: JSON.stringify({ pageType: data.pageType }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/privacy-policy");
  revalidatePath("/terms");
  revalidatePath("/deposit-withdrawal-policy");
  revalidatePath("/website-verification");
  revalidatePath("/security-reliability");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-privacy", "default");
  revalidateTag("admin-terms", "default");
  revalidateTag("admin-deposit-withdrawal", "default");
  revalidateTag("admin-website-verification", "default");
  revalidateTag("admin-security-reliability", "default");
  return NextResponse.json({ success: true });
}
