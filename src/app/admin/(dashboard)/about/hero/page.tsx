import { getContentBlocks } from "@/lib/content";
import AboutHeroEditor from "@/components/admin/editors/AboutHeroEditor";


export default async function AboutHeroPage() {
  const blocks = await getContentBlocks(["about.heroContent"]);
  const data = {
    heroContent: blocks["about.heroContent"] ?? {
      en: { title1: "", title2: "", subtitle: "" },
      ar: { title1: "", title2: "", subtitle: "" },
    },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutHeroEditor initialData={data} />
    </div>
  );
}
