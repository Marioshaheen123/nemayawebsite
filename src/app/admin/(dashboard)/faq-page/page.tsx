import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import FaqPageEditor from "@/components/admin/editors/FaqPageEditor";

export default async function AdminFaqPage() {
  const data = await cached(
    async () => {
      const [blocks, categories] = await Promise.all([
        getContentBlocks(["faq.pageHeroTitle", "faq.pageIntroText"]),
        prisma.faqCategory.findMany({
          include: { questions: { orderBy: { sortOrder: "asc" } } },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["faq.pageHeroTitle"] ?? { en: "", ar: "" },
        introText: blocks["faq.pageIntroText"] ?? {
          en: { left: "", right: "" },
          ar: { left: "", right: "" },
        },
        categories: JSON.parse(JSON.stringify(categories)),
      };
    },
    "admin-faq-page",
    ["admin-faq-page"]
  );
  return <FaqPageEditor initialData={data} />;
}
