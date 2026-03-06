import type { Metadata } from "next";
import Header from "@/components/Header";
import LegalContentPage from "@/components/LegalContentPage";
import Footer from "@/components/Footer";
import { getContentBlockSafe, getLegalSectionsBilingual, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "سياسة الإيداع والسحب",
    descriptionAr: "سياسة الإيداع والسحب لشركة نمايا المالية",
    path: "/deposit-withdrawal-policy",
  });
}

export default async function DepositWithdrawalPolicy() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, sections] = await Promise.all([
    getContentBlockSafe<any>("legal.depositWithdrawalHeroTitle", { en: "Deposit & Withdrawal Policy", ar: "سياسة الإيداع والسحب" }),
    getLegalSectionsBilingual("deposit-withdrawal"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <LegalContentPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
