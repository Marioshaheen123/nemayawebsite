import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { islamicRulingsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const [blocks, sections] = await Promise.all([
    getContentBlocks([
      "legal.islamicRulingsHeroTitle",
      "legal.islamicRulingsSectionLabels",
    ]),
    prisma.islamicRulingSection.findMany({
      include: { items: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return NextResponse.json({
    heroTitle: blocks["legal.islamicRulingsHeroTitle"] ?? {
      en: "",
      ar: "",
    },
    sectionLabels: blocks["legal.islamicRulingsSectionLabels"] ?? {
      en: { question: "Question", answer: "Answer", mufti: "Mufti" },
      ar: { question: "السؤال", answer: "الجواب", mufti: "المفتي" },
    },
    sections,
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, islamicRulingsSchema);
  if (error) return error;

  // Update content blocks
  await Promise.all([
    updateContentBlock("legal.islamicRulingsHeroTitle", data.heroTitle),
    updateContentBlock("legal.islamicRulingsSectionLabels", data.sectionLabels),
  ]);

  // Sync sections and items
  if (data.sections) {
    // Get existing section IDs
    const existing = await prisma.islamicRulingSection.findMany({
      select: { id: true },
    });
    const existingIds = new Set(existing.map((s) => s.id));
    const incomingIds = new Set(
      data.sections
        .filter((s: any) => s.id && !s.id.startsWith("new_"))
        .map((s: any) => s.id)
    );

    // Delete sections that were removed (cascade deletes items)
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await prisma.islamicRulingSection.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Upsert sections and their items
    for (let i = 0; i < data.sections.length; i++) {
      const sec = data.sections[i] as any;
      const isNew = !sec.id || sec.id.startsWith("new_");

      const sectionData = {
        nameEn: sec.nameEn || "",
        nameAr: sec.nameAr || "",
        sortOrder: i,
      };

      let sectionId: string;

      if (isNew) {
        const created = await prisma.islamicRulingSection.create({
          data: sectionData,
        });
        sectionId = created.id;
      } else {
        await prisma.islamicRulingSection.update({
          where: { id: sec.id! },
          data: sectionData,
        });
        sectionId = sec.id!;
      }

      // Delete existing items for this section and recreate
      await prisma.islamicRulingItem.deleteMany({
        where: { sectionId },
      });

      if (sec.items && sec.items.length > 0) {
        for (let j = 0; j < sec.items.length; j++) {
          const item = sec.items[j];
          await prisma.islamicRulingItem.create({
            data: {
              titleEn: item.titleEn || "",
              titleAr: item.titleAr || "",
              questionEn: item.questionEn || "",
              questionAr: item.questionAr || "",
              answerEn: item.answerEn || "",
              answerAr: item.answerAr || "",
              muftiEn: item.muftiEn || "",
              muftiAr: item.muftiAr || "",
              sortOrder: j,
              sectionId,
            },
          });
        }
      }
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "update",
    resource: "IslamicRulings",
    details: JSON.stringify({ sectionsCount: data.sections?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/islamic-legal-rulings");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-islamic-rulings", "default");
  return NextResponse.json({ success: true });
}
