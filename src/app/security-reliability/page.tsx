import type { Metadata } from "next";
import Header from "@/components/Header";
import LegalContentPage from "@/components/LegalContentPage";
import Footer from "@/components/Footer";
import { getContentBlockSafe, getLegalSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "الأمان والموثوقية",
    descriptionAr: "الأمان والموثوقية في نمايا للاستثمار",
    path: "/security-reliability",
  });
}

export default async function SecurityReliability() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sections] = await Promise.all([
    getContentBlockSafe<any>("legal.securityReliabilityHeroTitle", { en: "Security & Reliability", ar: "الأمان والموثوقية" }),
    getLegalSectionsBilingual("security-reliability"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <LegalContentPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
