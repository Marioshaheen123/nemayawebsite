import type { Metadata } from "next";
import Header from "@/components/Header";
import SocialMediaPage from "@/components/SocialMediaPage";
import Footer from "@/components/Footer";
import { getContentBlocks, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "مواقع التواصل الاجتماعي",
    descriptionAr: "تابع نمايا على جميع منصات التواصل الاجتماعي",
    path: "/social-media",
  });
}

export default async function SocialMedia() {
  const { headerData, footerData } = await getLayoutData();
  const blocks = await getContentBlocks([
    "socialMedia.content",
    "socialMedia.channels",
  ]);

  const defaultContent = {
    en: {
      heroTitle: "Social Media",
      sectionHeading: "All Namaya social media platforms in one place",
      sectionDescription: "",
      contactTitle: "Contact Us",
      contactDescription: "",
      contactCtaText: "Contact Us",
      contactCtaUrl: "/contact",
    },
    ar: {
      heroTitle: "مواقع التواصل الاجتماعي",
      sectionHeading: "كل منصات التواصل الاجتماعي الخاصة بنمايا في مكان واحد",
      sectionDescription: "",
      contactTitle: "تواصل معنا",
      contactDescription: "",
      contactCtaText: "تواصل معنا",
      contactCtaUrl: "/contact",
    },
  };

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <SocialMediaPage
        content={blocks["socialMedia.content"] || defaultContent}
        channels={blocks["socialMedia.channels"] || []}
      />
      <Footer {...footerData} />
    </main>
  );
}
