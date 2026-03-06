import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import LegalPageEditor from "@/components/admin/editors/LegalPageEditor";

export default async function DepositWithdrawalAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, sections] = await Promise.all([
        getContentBlocks(["legal.depositWithdrawalHeroTitle"]),
        prisma.legalSection.findMany({
          where: { pageType: "deposit-withdrawal" },
          orderBy: { sortOrder: "asc" },
        }),
      ]);
      return {
        heroTitle: blocks["legal.depositWithdrawalHeroTitle"] ?? { en: "", ar: "" },
        sections: JSON.parse(JSON.stringify(sections)),
      };
    },
    "admin-deposit-withdrawal",
    ["admin-deposit-withdrawal"]
  );
  return <LegalPageEditor initialData={data} pageType="deposit-withdrawal" />;
}
