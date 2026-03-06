import type { Metadata } from "next";
import Header from "@/components/Header";
import LegalContentPage from "@/components/LegalContentPage";
import Footer from "@/components/Footer";
import { getContentBlockSafe, getLegalSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "التحقق من الموقع الرسمي",
    descriptionAr: "دليل التحقق من الموقع الرسمي لشركة نمايا المالية",
    path: "/website-verification",
  });
}

export default async function WebsiteVerification() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sections] = await Promise.all([
    getContentBlockSafe<any>("legal.websiteVerificationHeroTitle", { en: "Official Website Verification", ar: "التحقق من الموقع الرسمي" }),
    getLegalSectionsBilingual("website-verification"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <LegalContentPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
