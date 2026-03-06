import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageFaqSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const [blocks, homepageCategory] = await Promise.all([
    getContentBlocks([
      "faq.homepageFaqHeading",
      "faq.homepageFaqBadge",
    ]),
    prisma.faqCategory.findFirst({
      where: { isHomepage: true },
      include: { questions: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  return NextResponse.json({
    heading: blocks["faq.homepageFaqHeading"] ?? { en: {}, ar: {} },
    badge: blocks["faq.homepageFaqBadge"] ?? { label: "", labelAr: "" },
    categoryId: homepageCategory?.id || null,
    items: homepageCategory?.questions || [],
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageFaqSchema);
  if (error) return error;

  // Update content blocks
  await Promise.all([
    updateContentBlock("faq.homepageFaqHeading", data.heading),
    updateContentBlock("faq.homepageFaqBadge", data.badge),
  ]);

  // Recreate FAQ items under homepage category
  if (data.items && data.categoryId) {
    await prisma.faqItem.deleteMany({ where: { categoryId: data.categoryId } });
    for (let i = 0; i < data.items.length; i++) {
      const q = data.items[i];
      await prisma.faqItem.create({
        data: {
          questionEn: q.questionEn || "",
          questionAr: q.questionAr || "",
          answerEn: q.answerEn || "",
          answerAr: q.answerAr || "",
          sortOrder: i,
          categoryId: data.categoryId,
        },
      });
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.faq",
    details: JSON.stringify({ keys: ["faq.homepageFaqHeading", "faq.homepageFaqBadge"], itemsCount: data.items?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-homepage-faq", "default");
  return NextResponse.json({ success: true });
}
