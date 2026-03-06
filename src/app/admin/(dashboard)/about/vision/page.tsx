import { getContentBlocks } from "@/lib/content";
import AboutVisionEditor from "@/components/admin/editors/AboutVisionEditor";


export default async function AboutVisionPage() {
  const blocks = await getContentBlocks(["about.visionBadge", "about.visionTitle", "about.visionCards", "about.visionImages"]);
  const data = {
    badge: blocks["about.visionBadge"] ?? { label: "", labelAr: "" },
    title: blocks["about.visionTitle"] ?? { en: "", ar: "" },
    cards: blocks["about.visionCards"] ?? { en: [], ar: [] },
    images: blocks["about.visionImages"] ?? [],
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutVisionEditor initialData={data} />
    </div>
  );
}
