import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import LegalPageEditor from "@/components/admin/editors/LegalPageEditor";

export default async function PrivacyPolicyAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.privacyPolicyHeroTitle"]),
        prisma.legalSection.findMany({
          where: { pageType: "privacy" },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.privacyPolicyHeroTitle"] ?? { en: "", ar: "" },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-privacy",
    ["admin-privacy"]
  );
  return <LegalPageEditor initialData={data} pageType="privacy" />;
}
