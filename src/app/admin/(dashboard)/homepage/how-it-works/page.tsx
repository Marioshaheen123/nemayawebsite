import { getContentBlocks } from "@/lib/content";
import HowItWorksEditor from "@/components/admin/editors/HowItWorksEditor";


export default async function HowItWorksPage() {
  const blocks = await getContentBlocks([
    "homepage.howItWorksContent", "homepage.howItWorksBadge", "homepage.howItWorksImage",
  ]);
  const data = {
    content: blocks["homepage.howItWorksContent"] ?? { en: {}, ar: {} },
    badge: blocks["homepage.howItWorksBadge"] ?? { label: "", labelAr: "" },
    image: blocks["homepage.howItWorksImage"] ?? "",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <HowItWorksEditor initialData={data} />
    </div>
  );
}
