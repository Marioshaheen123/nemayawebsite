import { getContentBlocks } from "@/lib/content";
import AboutValuesEditor from "@/components/admin/editors/AboutValuesEditor";


export default async function AboutValuesPage() {
  const blocks = await getContentBlocks(["about.valuesBadge", "about.valuesHeading", "about.values", "about.valuesImage"]);
  const data = {
    badge: blocks["about.valuesBadge"] ?? { label: "", labelAr: "" },
    heading: blocks["about.valuesHeading"] ?? {
      en: { part1: "", bold1: "", part2: "", bold2: "" },
      ar: { part1: "", bold1: "", part2: "", bold2: "" },
    },
    values: blocks["about.values"] ?? { en: [], ar: [] },
    image: blocks["about.valuesImage"] ?? "",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutValuesEditor initialData={data} />
    </div>
  );
}
