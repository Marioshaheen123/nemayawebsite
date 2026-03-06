import type { Metadata } from "next";
import Header from "@/components/Header";
import VideosPage from "@/components/VideosPage";
import Footer from "@/components/Footer";
import { getLayoutData, getContentBlock, getVideosBilingual } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "فيديوهات تعليمية",
    descriptionAr: "شاهد فيديوهات تعليمية حول التداول والاستثمار",
    path: "/videos",
  });
}

export default async function Videos() {
  const { headerData, footerData } = await getLayoutData();
  const [heroTitle, watchNowLabel, moreVideoLabel, keyTakeawaysLabel, directLinkLabel, videos] =
    await Promise.all([
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
