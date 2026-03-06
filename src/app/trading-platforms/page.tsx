import type { Metadata } from "next";
import Header from "@/components/Header";
import TradingPlatformsPage from "@/components/TradingPlatformsPage";
import Footer from "@/components/Footer";
import { getContentBlocks, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "منصات التداول",
    descriptionAr: "تعرف على منصات التداول المتاحة لدى نمايا",
    path: "/trading-platforms",
  });
}

export default async function TradingPlatforms() {
  const { headerData, footerData } = await getLayoutData();
  const blocks = await getContentBlocks([
    "tradingPlatforms.content",
    "tradingPlatforms.mockupImage",
    "tradingPlatforms.checkIcon",
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <TradingPlatformsPage
        content={blocks["tradingPlatforms.content"] || { en: {}, ar: {} }}
        mockupImage={blocks["tradingPlatforms.mockupImage"] || ""}
        checkIcon={blocks["tradingPlatforms.checkIcon"] || ""}
      />
      <Footer {...footerData} />
    </main>
  );
}
