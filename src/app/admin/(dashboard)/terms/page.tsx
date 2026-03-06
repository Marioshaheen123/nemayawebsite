import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import LegalPageEditor from "@/components/admin/editors/LegalPageEditor";

export default async function TermsAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.termsHeroTitle"]),
        prisma.legalSection.findMany({
          where: { pageType: "terms" },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.termsHeroTitle"] ?? { en: "", ar: "" },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-terms",
    ["admin-terms"]
  );
  return <LegalPageEditor initialData={data} pageType="terms" />;
}
