import type { Metadata } from "next";
import Header from "@/components/Header";
import TermsPage from "@/components/TermsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLegalSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "الشروط والأحكام",
    descriptionAr: "الشروط والأحكام الخاصة بشركة نمايا المالية",
    path: "/terms",
  });
}

export default async function Terms() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sections] = await Promise.all([
    getContentBlock<any>("legal.termsHeroTitle"),
    getLegalSectionsBilingual("terms"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <TermsPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
