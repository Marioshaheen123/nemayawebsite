import Header from "@/components/Header";
import FinancialAssetDetailPage from "@/components/FinancialAssetDetailPage";
import Footer from "@/components/Footer";
import { getContentBlock, getFinancialAssetDetail, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FinancialAssetDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [headerData, footerData, backLabel, ctaSection, tableHeaders, sectionTitles, howToStartSteps, dbAsset] =
    await Promise.all([
      getHeaderData(),
      getFooterData(),
      getContentBlock<any>("financialAssets.backLabel"),
      getContentBlock<any>("financialAssets.ctaSection"),
      getContentBlock<any>("financialAssets.tableHeaders"),
      getContentBlock<any>("financialAssets.sectionTitles"),
      getContentBlock<any>("financialAssets.howToStartSteps"),
      getFinancialAssetDetail(slug),
    ]);

  // Transform DB asset (with explicit En/Ar columns) into bilingual format
  let asset: any = { en: null, ar: null };
  if (dbAsset) {
    const transformAsset = (lang: "en" | "ar") => ({
      slug: dbAsset.slug,
      name: lang === "en" ? (dbAsset as any).nameEn : (dbAsset as any).nameAr,
      headline: lang === "en" ? (dbAsset as any).headlineEn : (dbAsset as any).headlineAr,
      description: lang === "en" ? (dbAsset as any).descriptionEn : (dbAsset as any).descriptionAr,
      image: (dbAsset as any).image ?? `/images/asset-${dbAsset.slug}.jpg`,
      instruments: (dbAsset as any).instruments?.map((inst: any) => ({
        name: lang === "en" ? inst.nameEn : inst.nameAr,
        symbol: inst.symbol,
        spread: inst.spread,
        leverage: inst.leverage,
        hours: inst.hours,
      })) ?? [],
      whatIs: (() => { const raw = lang === "en" ? (dbAsset as any).whatIsEn : (dbAsset as any).whatIsAr; if (!raw) return []; return typeof raw === "string" ? JSON.parse(raw) : raw; })(),
      advantages: (dbAsset as any).advantages?.map((adv: any) => ({
        title: lang === "en" ? adv.titleEn : adv.titleAr,
        desc: lang === "en" ? adv.descEn : adv.descAr,
      })) ?? [],
      faq: (dbAsset as any).faqs?.map((f: any) => ({
        q: lang === "en" ? f.questionEn : f.questionAr,
        a: lang === "en" ? f.answerEn : f.answerAr,
      })) ?? [],
    });

    asset = {
      en: transformAsset("en"),
      ar: transformAsset("ar"),
    };
  }

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <FinancialAssetDetailPage
        slug={slug}
        asset={asset}
        backLabel={backLabel}
        ctaSection={ctaSection}
        tableHeaders={tableHeaders}
        sectionTitles={sectionTitles}
        howToStartSteps={howToStartSteps}
      />
      <Footer {...footerData} />
    </main>
  );
}
