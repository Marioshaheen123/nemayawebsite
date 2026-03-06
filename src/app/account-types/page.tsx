import type { Metadata } from "next";
import Header from "@/components/Header";
import AccountTypesPage from "@/components/AccountTypesPage";
import Footer from "@/components/Footer";
import { getLayoutData, getContentBlocks, getPlansBilingual } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "أنواع الحسابات",
    descriptionAr: "اكتشف أنواع حسابات التداول المتاحة واختر الأنسب لك",
    path: "/account-types",
  });
}

export default async function AccountTypes() {
  const { headerData, footerData } = await getLayoutData();
  const [blocks, plansData] = await Promise.all([
    getContentBlocks(["pricing.accountTypesPageHeroTitle", "pricing.accountTypesPageHeading"]),
    getPlansBilingual(),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <AccountTypesPage
        allPlans={plansData.plans}
        planFeatures={plansData.features}
        accountTypesPageHeroTitle={blocks["pricing.accountTypesPageHeroTitle"] || { en: "", ar: "" }}
        accountTypesPageHeading={blocks["pricing.accountTypesPageHeading"] || { en: { before: "", bold: "" }, ar: { before: "", bold: "" } }}
      />
      <Footer {...footerData} />
    </main>
  );
}
