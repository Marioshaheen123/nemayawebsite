import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import FaqEditor from "@/components/admin/editors/FaqEditor";

export default async function FaqPage() {
  const data = await cached(
    async () => {
      const [blocks, homepageCategory] = await Promise.all([
        getContentBlocks(["faq.homepageFaqHeading", "faq.homepageFaqBadge"]),
        prisma.faqCategory.findFirst({
          where: { isHomepage: true },
          include: { questions: { orderBy: { sortOrder: "asc" } } },
        }),
      ]);
      return {
        heading: blocks["faq.homepageFaqHeading"] ?? { en: {}, ar: {} },
        badge: blocks["faq.homepageFaqBadge"] ?? { label: "", labelAr: "" },
        categoryId: homepageCategory?.id || null,
        items: JSON.parse(JSON.stringify(homepageCategory?.questions || [])),
      };
    },
    "admin-homepage-faq",
    ["admin-homepage-faq"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <FaqEditor initialData={data} />
    </div>
  );
}
