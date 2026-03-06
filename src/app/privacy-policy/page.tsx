import type { Metadata } from "next";
import Header from "@/components/Header";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLegalSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "سياسة الخصوصية",
    descriptionAr: "سياسة الخصوصية لشركة نمايا المالية",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicy() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sections] = await Promise.all([
    getContentBlock<any>("legal.privacyPolicyHeroTitle"),
    getLegalSectionsBilingual("privacy"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <PrivacyPolicyPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
