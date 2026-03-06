import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import IslamicRulingsEditor from "@/components/admin/editors/IslamicRulingsEditor";

export default async function IslamicRulingsPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.islamicRulingsHeroTitle", "legal.islamicRulingsSectionLabels"]),
        prisma.islamicRulingSection.findMany({
          include: { items: { orderBy: { sortOrder: "asc" } } },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.islamicRulingsHeroTitle"] ?? { en: "", ar: "" },
        sectionLabels: blocks["legal.islamicRulingsSectionLabels"] ?? {
          en: { question: "Question", answer: "Answer", mufti: "Mufti" },
          ar: { question: "\u0627\u0644\u0633\u0624\u0627\u0644", answer: "\u0627\u0644\u062c\u0648\u0627\u0628", mufti: "\u0627\u0644\u0645\u0641\u062a\u064a" },
        },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-islamic-rulings",
    ["admin-islamic-rulings"]
  );
  return <IslamicRulingsEditor initialData={data} />;
}
