import { getContentBlocks } from "@/lib/content";
import HeroEditor from "@/components/admin/editors/HeroEditor";


export default async function HeroPage() {
  const blocks = await getContentBlocks(["homepage.heroContent", "homepage.heroImages"]);
  const data = {
    heroContent: blocks["homepage.heroContent"] ?? { en: {}, ar: {} },
    heroImages: blocks["homepage.heroImages"] ?? { background: "", person: "" },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <HeroEditor initialData={data} />
    </div>
  );
}
