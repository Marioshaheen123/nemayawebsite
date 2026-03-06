import { getContentBlocks } from "@/lib/content";
import AboutRedefiningEditor from "@/components/admin/editors/AboutRedefiningEditor";


export default async function AboutRedefiningPage() {
  const blocks = await getContentBlocks(["about.redefiningBadge", "about.redefiningContent", "about.stats"]);
  const data = {
    badge: blocks["about.redefiningBadge"] ?? { label: "", labelAr: "" },
    content: blocks["about.redefiningContent"] ?? {
      en: { title1: "", title2: "", p1: "", p2: "" },
      ar: { title1: "", title2: "", p1: "", p2: "" },
    },
    stats: blocks["about.stats"] ?? { en: [], ar: [] },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutRedefiningEditor initialData={data} />
    </div>
  );
}
