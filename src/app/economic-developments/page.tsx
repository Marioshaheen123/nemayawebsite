import type { Metadata } from "next";
import Header from "@/components/Header";
import EconomicDevelopmentsPage from "@/components/EconomicDevelopmentsPage";
import Footer from "@/components/Footer";
import { getLayoutData, getContentBlockSafe, getEconomicDevelopmentsBilingual } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "التطورات الاقتصادية",
    descriptionAr: "تابع آخر التطورات الاقتصادية والأخبار المالية العالمية",
    path: "/economic-developments",
  });
}

export default async function EconomicDevelopments() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, data] = await Promise.all([
    getContentBlockSafe("economicDevelopments.pageHeroTitle", {
      en: "Economic Developments",
      ar: "التطورات الاقتصادية",
    }),
    getEconomicDevelopmentsBilingual(),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <EconomicDevelopmentsPage
        articles={data.articles}
        suggested={data.suggested}
        heroTitle={heroTitle}
      />
      <Footer {...footerData} />
    </main>
  );
}
