import { getContentBlocks } from "@/lib/content";
import BenefitsEditor from "@/components/admin/editors/BenefitsEditor";


export default async function BenefitsPage() {
  const blocks = await getContentBlocks([
    "homepage.benefitsFeatures", "homepage.benefitsHeading",
    "homepage.benefitsCtaText", "homepage.benefitsBadge", "homepage.benefitsImages",
  ]);
  const data = {
    features: blocks["homepage.benefitsFeatures"] ?? { en: [], ar: [] },
    heading: blocks["homepage.benefitsHeading"] ?? { en: {}, ar: {} },
    ctaText: blocks["homepage.benefitsCtaText"] ?? { en: "", ar: "" },
    badge: blocks["homepage.benefitsBadge"] ?? { label: "", labelAr: "" },
    images: blocks["homepage.benefitsImages"] ?? { phone: "", centerLogo: "" },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <BenefitsEditor initialData={data} />
    </div>
  );
}
