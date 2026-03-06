import { getContentBlocks } from "@/lib/content";
import AboutBlogSectionEditor from "@/components/admin/editors/AboutBlogSectionEditor";


export default async function AboutBlogSectionPage() {
  const blocks = await getContentBlocks(["about.blogSectionBadge", "about.blogSectionHeading"]);
  const data = {
    badge: blocks["about.blogSectionBadge"] ?? { label: "", labelAr: "" },
    heading: blocks["about.blogSectionHeading"] ?? {
      en: { before: "", bold: "" },
      ar: { before: "", bold: "" },
    },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AboutBlogSectionEditor initialData={data} />
    </div>
  );
}
