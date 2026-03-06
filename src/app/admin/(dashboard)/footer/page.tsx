import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import FooterEditor from "@/components/admin/editors/FooterEditor";

export default async function FooterAdminPage() {
  const data = await cached(
    async () => {
      const [blocks, quickLinks, supportLinks, socialIcons] = await Promise.all([
        getContentBlocks(["navigation.footerLabels", "navigation.footerContactInfo"]),
        prisma.navItem.findMany({
          where: { location: "footerQuickLinks" },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.navItem.findMany({
          where: { location: "footerSupportLinks" },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.socialIcon.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);
      return {
        labels: blocks["navigation.footerLabels"] ?? {
          en: { brandDesc: "", quickLinks: "", support: "", contact: "", copyright: "" },
          ar: { brandDesc: "", quickLinks: "", support: "", contact: "", copyright: "" },
        },
        contactInfo: blocks["navigation.footerContactInfo"] ?? { phone: "", email: "" },
        quickLinks: JSON.parse(JSON.stringify(quickLinks)),
        supportLinks: JSON.parse(JSON.stringify(supportLinks)),
        socialIcons: JSON.parse(JSON.stringify(socialIcons)),
      };
    },
    "admin-footer",
    ["admin-footer"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <FooterEditor initialData={data} />
    </div>
  );
}
