import type { Metadata } from "next";
import Header from "@/components/Header";
import IslamicLegalRulingsPage from "@/components/IslamicLegalRulingsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getIslamicRulingSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "الأحكام الشرعية",
    descriptionAr: "تعرف على الأحكام الشرعية المتعلقة بالتداول والاستثمار",
    path: "/islamic-legal-rulings",
  });
}

export default async function IslamicLegalRulings() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sectionLabels, rulingsData] = await Promise.all([
    getContentBlock<any>("legal.islamicRulingsHeroTitle"),
    getContentBlock<any>("legal.islamicRulingsSectionLabels"),
    getIslamicRulingSectionsBilingual(),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <IslamicLegalRulingsPage
        heroTitle={heroTitle}
        sectionLabels={sectionLabels}
        rulingsData={rulingsData}
      />
      <Footer {...footerData} />
    </main>
  );
}
