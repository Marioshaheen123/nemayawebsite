import { getContentBlocks } from "@/lib/content";
import SocialMediaEditor from "@/components/admin/editors/SocialMediaEditor";

export default async function SocialMediaAdminPage() {
  const blocks = await getContentBlocks([
    "socialMedia.content", "socialMedia.channels",
  ]);
  const data = {
    content: blocks["socialMedia.content"] ?? {
      en: { heroTitle: "Social Media", sectionHeading: "", sectionDescription: "", contactTitle: "Contact Us", contactDescription: "", contactCtaText: "Contact Us", contactCtaUrl: "/contact" },
      ar: { heroTitle: "مواقع التواصل الاجتماعي", sectionHeading: "", sectionDescription: "", contactTitle: "تواصل معنا", contactDescription: "", contactCtaText: "تواصل معنا", contactCtaUrl: "/contact" },
    },
    channels: blocks["socialMedia.channels"] ?? [],
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <SocialMediaEditor initialData={data} />
    </div>
  );
}
