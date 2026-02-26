import Header from "@/components/Header";
import FinancialAssetsPage from "@/components/FinancialAssetsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getFinancialAssetCards, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FinancialAssets() {
  const [headerData, footerData, heroTitle, heroSubtitle, exploreLabel, cardImages, dbCards] =
    await Promise.all([
      getHeaderData(),
      getFooterData(),
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
