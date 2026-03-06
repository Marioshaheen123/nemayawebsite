import { getContentBlocks } from "@/lib/content";
import CarouselEditor from "@/components/admin/editors/CarouselEditor";


export default async function CarouselPage() {
  const blocks = await getContentBlocks([
    "homepage.carouselCards", "homepage.carouselHeading", "homepage.carouselBadge",
  ]);
  const data = {
    cards: blocks["homepage.carouselCards"] ?? { en: [], ar: [] },
    heading: blocks["homepage.carouselHeading"] ?? { en: {}, ar: {} },
    badge: blocks["homepage.carouselBadge"] ?? { label: "", labelAr: "" },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <CarouselEditor initialData={data} />
    </div>
  );
}
