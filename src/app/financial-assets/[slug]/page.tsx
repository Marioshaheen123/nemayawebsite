import type { Metadata } from "next";
import Header from "@/components/Header";
import FinancialAssetDetailPage from "@/components/FinancialAssetDetailPage";
import Footer from "@/components/Footer";
import { getContentBlock, getFinancialAssetDetail, getLayoutData } from "@/lib/content";
import { buildMetadata, financialProductJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function generateStaticParams() {
  const assets = await prisma.financialAsset.findMany({
    select: { slug: true },
  });
  return assets.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const asset = await prisma.financialAsset.findFirst({ where: { slug } });
  if (!asset) return { title: "Not Found" };
  return buildMetadata({
    titleAr: asset.metaTitleAr || asset.nameAr,
    descriptionAr: asset.metaDescriptionAr || asset.descriptionAr,
    path: `/financial-assets/${slug}`,
    ogImageUrl: asset.ogImageUrl || asset.imageUrl,
    keywords: asset.keywords || undefined,
  });
}

export default async function FinancialAssetDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { headerData, footerData } = await getLayoutData();
  const [backLabel, ctaSection, tableHeaders, sectionTitles, howToStartSteps, dbAsset] =
    await Promise.all([
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
      {dbAsset && (
        <>
          <JsonLd data={financialProductJsonLd({
            name: dbAsset.nameAr,
            description: dbAsset.descriptionAr,
            url: `${SITE_URL}/financial-assets/${slug}`,
          })} />
          <JsonLd data={breadcrumbJsonLd([
            { name: "الرئيسية", url: SITE_URL },
            { name: "الأصول المالية", url: `${SITE_URL}/financial-assets` },
            { name: dbAsset.nameAr, url: `${SITE_URL}/financial-assets/${slug}` },
          ])} />
        </>
      )}
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
