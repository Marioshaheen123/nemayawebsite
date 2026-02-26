import Header from "@/components/Header";
import VideosPage from "@/components/VideosPage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getVideosBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Videos() {
  const [headerData, footerData, heroTitle, watchNowLabel, moreVideoLabel, keyTakeawaysLabel, directLinkLabel, videos] =
    await Promise.all([
      getHeaderData(),
      getFooterData(),
      getContentBlock("videos.heroTitle"),
      getContentBlock("videos.watchNowLabel"),
      getContentBlock("videos.moreVideoLabel"),
      getContentBlock("videos.keyTakeawaysLabel"),
      getContentBlock("videos.directLinkLabel"),
      getVideosBilingual(),
    ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <VideosPage
        videos={videos}
        heroTitle={heroTitle}
        watchNowLabel={watchNowLabel}
        moreVideoLabel={moreVideoLabel}
        keyTakeawaysLabel={keyTakeawaysLabel}
        directLinkLabel={directLinkLabel}
      />
      <Footer {...footerData} />
    </main>
  );
}
