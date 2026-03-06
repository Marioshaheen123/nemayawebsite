import { getContentBlocks } from "@/lib/content";
import AboutBridgingEditor from "@/components/admin/editors/AboutBridgingEditor";


export default async function AboutBridgingPage() {
  const blocks = await getContentBlocks(["about.bridgingContent", "about.bridgingImage"]);
  const data = {
    content: blocks["about.bridgingContent"] ?? {
      en: { title: "", p1: "", p2: "", cta: "" },
      ar: { title: "", p1: "", p2: "", cta: "" },
    },
    image: blocks["about.bridgingImage"] ?? "",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutBridgingEditor initialData={data} />
    </div>
  );
}
