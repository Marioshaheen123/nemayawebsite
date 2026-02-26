import Header from "@/components/Header";
import TradingPlatformsPage from "@/components/TradingPlatformsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function TradingPlatforms() {
  const [headerData, footerData, content, mockupImage, checkIcon] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getContentBlock<any>("tradingPlatforms.content"),
    getContentBlock<any>("tradingPlatforms.mockupImage"),
    getContentBlock<any>("tradingPlatforms.checkIcon"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <TradingPlatformsPage
        content={content}
        mockupImage={mockupImage}
        checkIcon={checkIcon}
      />
      <Footer {...footerData} />
    </main>
  );
}
