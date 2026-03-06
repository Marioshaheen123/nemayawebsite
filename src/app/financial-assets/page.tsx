import type { Metadata } from "next";
import Header from "@/components/Header";
import FinancialAssetsPage from "@/components/FinancialAssetsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getFinancialAssetCards, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "الأصول المالية",
    descriptionAr: "استكشف مجموعة واسعة من الأصول المالية المتاحة للتداول",
    path: "/financial-assets",
  });
}

export default async function FinancialAssets() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, heroSubtitle, exploreLabel, cardImages, dbCards] =
    await Promise.all([
      getContentBlock<any>("financialAssets.heroTitle"),
      getContentBlock<any>("financialAssets.heroSubtitle"),
      getContentBlock<any>("financialAssets.exploreLabel"),
      getContentBlock<any>("financialAssets.cardImages"),
      getFinancialAssetCards(),
    ]);

  // Transform DB cards (with explicit En/Ar columns) into bilingual format
  const cards = {
    en: dbCards.map((c: any) => ({
      slug: c.slug,
      name: c.nameEn,
      headline: c.headlineEn,
      description: c.descriptionEn,
      stats: c.statsEn ?? [],
    })),
    ar: dbCards.map((c: any) => ({
      slug: c.slug,
      name: c.nameAr,
      headline: c.headlineAr,
      description: c.descriptionAr,
      stats: c.statsAr ?? [],
    })),
  };

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <FinancialAssetsPage
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        exploreLabel={exploreLabel}
        cardImages={cardImages}
        cards={cards}
      />
      <Footer {...footerData} />
    </main>
  );
}
