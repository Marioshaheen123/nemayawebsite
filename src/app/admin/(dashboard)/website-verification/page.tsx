import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import LegalPageEditor from "@/components/admin/editors/LegalPageEditor";

export default async function WebsiteVerificationAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.websiteVerificationHeroTitle"]),
        prisma.legalSection.findMany({
          where: { pageType: "website-verification" },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.websiteVerificationHeroTitle"] ?? { en: "", ar: "" },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-website-verification",
    ["admin-website-verification"]
  );
  return <LegalPageEditor initialData={data} pageType="website-verification" />;
}
