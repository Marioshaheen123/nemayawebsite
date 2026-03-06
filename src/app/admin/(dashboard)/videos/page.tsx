import { getVideos } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import Link from "next/link";
import VideoDeleteButton from "@/components/admin/editors/VideoDeleteButton";

export default async function VideosListPage() {
  const videos = await cached(
    () => getVideos().then((v) => JSON.parse(JSON.stringify(v))),
    "admin-videos-list",
    ["admin-videos-list"]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/videos/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:bg-accent-dark transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Video
        </Link>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video: any) => (
          <div
            key={video.id}
            className="bg-white rounded-xl border border-[#e8ecf1] p-5 hover:border-accent/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <Link
                href={`/admin/videos/${video.id}`}
                className="flex-1"
              >
                <h3 className="text-[14px] font-semibold text-[#2e263d] group-hover:text-accent transition-colors mb-1 line-clamp-2">
                  {video.titleEn}
                </h3>
                <p className="text-[12px] text-[#6b7280] line-clamp-2 mb-2">
                  {video.descEn}
                </p>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#a0a5af] mb-3">
              <span>{video.day} {video.monthEn}</span>
              <span>{video.durationEn}</span>
              {video.labelEn && (
                <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-medium">
                  {video.labelEn}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e8ecf1]">
              <Link
                href={`/admin/videos/${video.id}`}
                className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Edit
              </Link>
              <VideoDeleteButton videoId={video.id} videoTitle={video.titleEn} />
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8ecf1] p-8 text-center">
          <p className="text-[14px] text-[#6b7280]">No videos yet. Click &quot;Add Video&quot; to create one.</p>
        </div>
      )}
    </div>
  );
}
