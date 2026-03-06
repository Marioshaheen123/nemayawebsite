import { getContentBlocks } from "@/lib/content";
import TradingPlatformsEditor from "@/components/admin/editors/TradingPlatformsEditor";


export default async function TradingPlatformsPage() {
  const blocks = await getContentBlocks([
    "tradingPlatforms.content", "tradingPlatforms.mockupImage", "tradingPlatforms.checkIcon",
  ]);
  const data = {
    content: blocks["tradingPlatforms.content"] ?? {
      en: { heading: "", boldParagraph: "", paragraph: "", whyTitle: "", features: [], closingBold: "", cta: "", ctaUrl: "" },
      ar: { heading: "", boldParagraph: "", paragraph: "", whyTitle: "", features: [], closingBold: "", cta: "", ctaUrl: "" },
    },
    mockupImage: blocks["tradingPlatforms.mockupImage"] ?? "",
    checkIcon: blocks["tradingPlatforms.checkIcon"] ?? "",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <TradingPlatformsEditor initialData={data} />
    </div>
  );
}
