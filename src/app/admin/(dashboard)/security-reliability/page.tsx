import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import LegalPageEditor from "@/components/admin/editors/LegalPageEditor";

export default async function SecurityReliabilityAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.securityReliabilityHeroTitle"]),
        prisma.legalSection.findMany({
          where: { pageType: "security-reliability" },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.securityReliabilityHeroTitle"] ?? { en: "", ar: "" },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-security-reliability",
    ["admin-security-reliability"]
  );
  return <LegalPageEditor initialData={data} pageType="security-reliability" />;
}
