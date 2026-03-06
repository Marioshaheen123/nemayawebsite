"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

interface VideosPageProps {
  videos: any;
  heroTitle: any;
  watchNowLabel: any;
  moreVideoLabel: any;
  keyTakeawaysLabel: any;
  directLinkLabel: any;
}

export default function VideosPage({
  videos,
  heroTitle,
  watchNowLabel,
  moreVideoLabel,
  keyTakeawaysLabel,
  directLinkLabel,
}: VideosPageProps) {
  const { mainLogo } = useSiteSettings();
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = videos[lang];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detail view
  if (selectedIndex !== null) {
    const video = items[selectedIndex];
    const otherVideos = items.filter((_: any, i: number) => i !== selectedIndex).slice(0, 3);

    return (
      <>
        <PageHeroBanner
          title={video.title}
          breadcrumbs={[
            { label: isAr ? "الرئيسية" : "Home", href: "/" },
            { label: heroTitle[lang], href: "/videos" },
            { label: video.title },
          ]}
        />

        {/* Video Detail Content */}
        <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
          <div
            dir={isAr ? "rtl" : undefined}
            className="max-w-[840px] mx-auto"
          >
            {/* Video Player + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start">
              {/* Video Player */}
              <div className="w-full lg:flex-1">
                <div className="relative aspect-[840/470] bg-[#001005] rounded-[16px] overflow-hidden">
                  {isPlaying && video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Image
                        src="/images/video-card-bg.jpg"
                        alt={video.title}
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                      {/* Play button */}
                      <button
                        onClick={() => {
                          if (video.videoUrl) setIsPlaying(true);
                        }}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      >
                        <div className="w-[80px] md:w-[120px] h-[80px] md:h-[120px] rounded-full bg-white/24 flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar: Date + Actions */}
              <div className="flex lg:flex-col items-center lg:items-start gap-[16px]">
                {/* Date badge */}
                <div className="flex items-end gap-[16px]">
                  <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[94px]">
                    <div className="flex flex-col items-center p-[10px]">
                      <span className="text-white text-[40px] font-bold leading-[40px]">
                        {video.day}
                      </span>
                    </div>
                    <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                      <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                        {video.month}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                    {video.duration}
                  </span>
                </div>
                {/* Share + Bookmark */}
                <div className="flex items-center gap-[8px]">
                  <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#e9e9e9] transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0e314c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                  <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#e9e9e9] transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0e314c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-[40px] flex flex-col gap-[24px]">
              <p className="text-[#6084a4] text-[16px] leading-[1.4]">
                {video.fullDesc}
              </p>

              {/* Key Takeaways */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[#0e314c] text-[18px] font-bold leading-[21.6px]">
                  {keyTakeawaysLabel[lang]}
                </h3>
                <ul className="list-disc text-[#6084a4] text-[16px] leading-[1.4] ms-[24px] flex flex-col gap-[4px]">
                  {video.takeaways.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Direct Link */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[#0e314c] text-[18px] font-bold leading-[21.6px]">
                  {directLinkLabel[lang]}
                </h3>
                <a
                  href="/trading-platforms"
                  className="inline-flex items-center gap-[8px] text-[#6084a4] text-[16px] font-bold leading-[1.4] underline hover:text-[#0e314c] transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {video.linkText}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* More Videos Section */}
        <section className="bg-white pb-[60px] md:pb-[80px]">
          <div
            dir={isAr ? "rtl" : undefined}
            className="max-w-7xl mx-auto px-6"
          >
            <h2 className="text-[#0e314c] text-[32px] md:text-[40px] font-normal leading-[48px] text-center mb-[40px]">
              {moreVideoLabel[lang]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[30px]">
              {otherVideos.map((v: any, i: number) => {
                const originalIndex = items.indexOf(v);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedIndex(originalIndex);
                      setIsPlaying(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex flex-col text-start cursor-pointer"
                  >
                    {/* Card thumbnail */}
                    <div className="relative h-[200px] w-full rounded-tl-[125px] rounded-tr-[25px] overflow-hidden bg-[#001005]">
                      <Image
                        src="/images/video-card-bg.jpg"
                        alt={v.title}
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                      {/* Nemaya logo watermark */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-white border border-[#cacceb] flex items-center justify-center">
                          <Image
                            src={mainLogo}
                            alt=""
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="relative border border-[#cacceb] border-t-0 rounded-b-[25px] pt-[56px] pb-[30px] px-[30px] flex flex-col gap-[26px]">
                      {/* Date badge - overlapping */}
                      <div
                        className={`absolute top-0 flex items-end gap-[16px] ${
                          isAr ? "right-[29px]" : "left-[29px]"
                        }`}
                      >
                        <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[94px] -mt-[62px]">
                          <div className="flex flex-col items-center p-[10px]">
                            <span className="text-white text-[40px] font-bold leading-[40px]">
                              {v.day}
                            </span>
                          </div>
                          <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                            <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                              {v.month}
                            </span>
                          </div>
                        </div>
                        <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                          {v.duration}
                        </span>
                      </div>

                      {/* Title + Desc */}
                      <div className="flex flex-col gap-[10px]">
                        <h3 className="text-[#0e314c] text-[24px] font-normal leading-[28.8px]">
                          {v.title}
                        </h3>
                        <p className="text-[#6084a4] text-[14px] leading-[25.2px]">
                          {v.desc}
                        </p>
                      </div>

                      {/* Watch Now */}
                      <span className="cta-gradient inline-flex items-center justify-center self-start px-[36px] py-[15px] rounded-[5px] text-white text-[14px] font-semibold">
                        {watchNowLabel[lang]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Grid listing view
  return (
    <>
      <PageHeroBanner
        title={heroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: heroTitle[lang] },
        ]}
      />

      {/* Video Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[30px]">
            {items.map((video: any, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedIndex(i);
                  setIsPlaying(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex flex-col text-start cursor-pointer"
              >
                {/* Card thumbnail */}
                <div className="relative h-[200px] w-full rounded-tl-[125px] rounded-tr-[25px] overflow-hidden bg-[#001005]">
                  <Image
                    src="/images/video-card-bg.jpg"
                    alt={video.title}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                  {/* Nemaya logo watermark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80px] h-[80px] rounded-full bg-white border border-[#cacceb] flex items-center justify-center">
                      <Image
                        src={mainLogo}
                        alt=""
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative border border-[#cacceb] border-t-0 rounded-b-[25px] pt-[56px] pb-[30px] px-[30px] flex flex-col gap-[26px] w-full">
                  {/* Date badge - overlapping */}
                  <div
                    className={`absolute top-0 flex items-end gap-[16px] ${
                      isAr ? "right-[29px]" : "left-[29px]"
                    }`}
                  >
                    <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[94px] -mt-[62px]">
                      <div className="flex flex-col items-center p-[10px]">
                        <span className="text-white text-[40px] font-bold leading-[40px]">
                          {video.day}
                        </span>
                      </div>
                      <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                        <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                          {video.month}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                      {video.duration}
                    </span>
                  </div>

                  {/* Title + Desc */}
                  <div className="flex flex-col gap-[10px]">
                    <h3 className="text-[#0e314c] text-[24px] font-normal leading-[28.8px]">
                      {video.title}
                    </h3>
                    <p className="text-[#6084a4] text-[14px] leading-[25.2px]">
                      {video.desc}
                    </p>
                  </div>

                  {/* Watch Now */}
                  <span className="inline-flex items-center justify-center self-start px-[36px] py-[15px] rounded-[5px] border border-primary text-[#0e314c] text-[14px] font-semibold hover:bg-primary hover:text-white transition-all">
                    {watchNowLabel[lang]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
