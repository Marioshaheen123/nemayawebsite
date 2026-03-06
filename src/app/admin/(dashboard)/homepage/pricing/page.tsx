import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import PricingEditor from "@/components/admin/editors/PricingEditor";

function isEmpty(json: string | null | undefined): boolean {
  if (!json) return true;
  try {
    const arr = JSON.parse(json);
    return !Array.isArray(arr) || arr.length === 0 || arr.every((s: string) => !s);
  } catch {
    return true;
  }
}

export default async function PricingPage() {
  const data = await cached(
    async () => {
      const [blocks, plans, features] = await Promise.all([
        getContentBlocks(["pricing.sectionHeading", "pricing.sectionBadge", "pricing.viewAllLabel"]),
        prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.planFeature.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

      if (features.length > 0) {
        const fallbackEn = JSON.stringify(features.map((f) => f.labelEn));
        const fallbackAr = JSON.stringify(features.map((f) => f.labelAr));
        for (const plan of plans) {
          if (isEmpty(plan.benefitsEn)) {
            plan.benefitsEn = fallbackEn;
            plan.benefitsAr = fallbackAr;
          }
        }
      }

      return {
        sectionHeading: blocks["pricing.sectionHeading"] ?? { en: {}, ar: {} },
        sectionBadge: blocks["pricing.sectionBadge"] ?? { label: "", labelAr: "" },
        viewAllLabel: blocks["pricing.viewAllLabel"] ?? { en: "", ar: "" },
        plans: JSON.parse(JSON.stringify(plans)),
        features: JSON.parse(JSON.stringify(features)),
      };
    },
    "admin-homepage-pricing",
    ["admin-homepage-pricing"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <PricingEditor initialData={data} />
    </div>
  );
}
