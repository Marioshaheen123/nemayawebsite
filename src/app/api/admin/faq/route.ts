import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { faqSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const [blocks, categories] = await Promise.all([
    getContentBlocks([
      "faq.pageHeroTitle",
      "faq.pageIntroText",
    ]),
    prisma.faqCategory.findMany({
      include: { questions: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return NextResponse.json({
    heroTitle: blocks["faq.pageHeroTitle"] ?? { en: "", ar: "" },
    introText: blocks["faq.pageIntroText"] ?? {
      en: { left: "", right: "" },
      ar: { left: "", right: "" },
    },
    categories,
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, faqSchema);
  if (error) return error;

  // Update content blocks
  await Promise.all([
    updateContentBlock("faq.pageHeroTitle", data.heroTitle),
    updateContentBlock("faq.pageIntroText", data.introText),
  ]);

  // Sync categories and items
  if (data.categories) {
    const existing = await prisma.faqCategory.findMany({
      select: { id: true },
    });
    const existingIds = new Set(existing.map((c) => c.id));
    const incomingIds = new Set(
      data.categories
        .filter((c: any) => c.id && !c.id.startsWith("new_"))
        .map((c: any) => c.id)
    );

    // Delete removed categories (cascade deletes questions)
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await prisma.faqCategory.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Upsert categories and their questions
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i] as any;
      const isNew = !cat.id || cat.id.startsWith("new_");

      const categoryData = {
        nameEn: cat.nameEn || "",
        nameAr: cat.nameAr || "",
        sortOrder: i,
        isHomepage: cat.isHomepage ?? false,
      };

      let categoryId: string;

      if (isNew) {
        const created = await prisma.faqCategory.create({
          data: categoryData,
        });
        categoryId = created.id;
      } else {
        await prisma.faqCategory.update({
          where: { id: cat.id! },
          data: categoryData,
        });
        categoryId = cat.id!;
      }

      // Delete existing questions and recreate
      await prisma.faqItem.deleteMany({
        where: { categoryId },
      });

      if (cat.questions && cat.questions.length > 0) {
        for (let j = 0; j < cat.questions.length; j++) {
          const q = cat.questions[j];
          await prisma.faqItem.create({
            data: {
              questionEn: q.questionEn || "",
              questionAr: q.questionAr || "",
              answerEn: q.answerEn || "",
              answerAr: q.answerAr || "",
              sortOrder: j,
              categoryId,
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
    resource: "FAQ",
    details: JSON.stringify({ categoriesCount: data.categories?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/faq");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-faq-page", "default");
  revalidateTag("admin-homepage-faq", "default");
  return NextResponse.json({ success: true });
}
