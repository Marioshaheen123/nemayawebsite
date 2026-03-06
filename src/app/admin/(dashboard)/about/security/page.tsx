import { getContentBlocks } from "@/lib/content";
import AboutSecurityEditor from "@/components/admin/editors/AboutSecurityEditor";


export default async function AboutSecurityPage() {
  const blocks = await getContentBlocks(["about.securityBadge", "about.securityContent"]);
  const data = {
    badge: blocks["about.securityBadge"] ?? { label: "", labelAr: "" },
    content: blocks["about.securityContent"] ?? {
      en: { title1: "", title2: "", title3: "", p1: "", p2: "" },
      ar: { title1: "", title2: "", title3: "", p1: "", p2: "" },
    },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutSecurityEditor initialData={data} />
    </div>
  );
}
