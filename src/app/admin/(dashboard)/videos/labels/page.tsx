import { getContentBlocks } from "@/lib/content";
import VideoLabelsEditor from "@/components/admin/editors/VideoLabelsEditor";


export default async function VideoLabelsPage() {
  const blocks = await getContentBlocks([
    "videos.heroTitle", "videos.watchNowLabel", "videos.moreVideoLabel",
    "videos.keyTakeawaysLabel", "videos.directLinkLabel",
  ]);
  const data = {
    heroTitle: blocks["videos.heroTitle"] ?? { en: "Video", ar: "\u0641\u064A\u062F\u064A\u0648" },
    watchNowLabel: blocks["videos.watchNowLabel"] ?? { en: "Watch Now", ar: "\u0634\u0627\u0647\u062F \u0627\u0644\u0622\u0646" },
    moreVideoLabel: blocks["videos.moreVideoLabel"] ?? { en: "More video", ar: "\u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0641\u064A\u062F\u064A\u0648" },
    keyTakeawaysLabel: blocks["videos.keyTakeawaysLabel"] ?? { en: "Key Takeaways:", ar: "\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629:" },
    directLinkLabel: blocks["videos.directLinkLabel"] ?? { en: "Direct Link to Tool:", ar: "\u0631\u0627\u0628\u0637 \u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u0623\u062F\u0627\u0629:" },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <VideoLabelsEditor initialData={data} />
    </div>
  );
}
