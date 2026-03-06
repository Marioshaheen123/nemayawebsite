import { getContentBlocks } from "@/lib/content";
import AboutMissionEditor from "@/components/admin/editors/AboutMissionEditor";


export default async function AboutMissionPage() {
  const blocks = await getContentBlocks(["about.missionTitle"]);
  const data = {
    missionTitle: blocks["about.missionTitle"] ?? { en: "", ar: "" },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutMissionEditor initialData={data} />
    </div>
  );
}
