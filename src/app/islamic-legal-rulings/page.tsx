import Header from "@/components/Header";
import IslamicLegalRulingsPage from "@/components/IslamicLegalRulingsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getIslamicRulingSectionsBilingual, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function IslamicLegalRulings() {
  const [headerData, footerData, heroTitle, sectionLabels, rulingsData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
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
