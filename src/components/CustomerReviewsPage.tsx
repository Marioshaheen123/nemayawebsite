"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import type { Bilingual } from "@/data/types";

/* ── Types ─────────────────────────────────────────────────── */

interface Review {
  stars: number;
  badgeEn: string;
  badgeAr: string;
  textEn: string;
  textAr: string;
  authorEn: string;
  authorAr: string;
}

interface VideoTestimonial {
  youtubeUrl: string;
  captionEn: string;
  captionAr: string;
}

interface FaqItem {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

interface CustomerReviewsPageProps {
  content: Bilingual<{
    heroTitle: string;
    heroSubtitle: string;
    heroCta1Text: string;
    heroCta1Url: string;
    heroCta2Text: string;
    heroCta2Url: string;
    trustpilotScore: string;
    trustpilotLabel: string;
    trustpilotTotal: string;
    ratingBars: string;
    reviewsSectionTitle: string;
    reviewsShowMore: string;
    videosSectionTitle: string;
    ctaBannerTitle: string;
    ctaBannerSubtitle: string;
    ctaBtn1Text: string;
    ctaBtn1Url: string;
    ctaBtn2Text: string;
    ctaBtn2Url: string;
    disclaimerText: string;
  }>;
  reviews: Review[];
  videos: VideoTestimonial[];
  faqs: FaqItem[];
}

/* ── Helpers ───────────────────────────────────────────────── */

function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < count ? "#00b67a" : "#dcdce6"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/** Extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // youtube.com/watch?v=ID
  const match1 = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (match1) return match1[1];
  // youtu.be/ID
  const match2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match2) return match2[1];
  // youtube.com/embed/ID
  const match3 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (match3) return match3[1];
  // youtube.com/shorts/ID
  const match4 = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match4) return match4[1];
  return null;
}

/* ── Video Slider (mobile swipeable) ───────────────────────── */

function VideoSlider({ videos, isAr }: { videos: VideoTestimonial[]; isAr: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    const idx = Math.round(el.scrollLeft / (cardWidth + 20));
    setActiveIdx(Math.min(idx, videos.length - 1));
  };

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    el.scrollTo({ left: idx * (cardWidth + 20), behavior: "smooth" });
  };

  return (
    <div>
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[20px] overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:grid md:grid-cols-3 md:overflow-visible"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video, i) => {
          const ytId = getYouTubeId(video.youtubeUrl);
          const caption = isAr ? video.captionAr : video.captionEn;
          return (
            <div
              key={i}
              className="snap-center shrink-0 w-[280px] md:w-full"
            >
              <div className="rounded-[12px] overflow-hidden border border-[#e6eaf2] bg-[#111] aspect-[9/16]">
                {ytId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                    title={caption}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-[13px]">
                    No video URL
                  </div>
                )}
              </div>
              {caption && (
                <p dir={isAr ? "rtl" : undefined} className="text-[#1a1a2e] text-[14px] font-medium mt-[10px] text-center">
                  {caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Dots — mobile only */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-[8px] mt-[16px] md:hidden">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-[8px] h-[8px] rounded-full transition-colors cursor-pointer ${
                i === activeIdx ? "bg-site-gradient" : "bg-[#d0d5dd]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */

export default function CustomerReviewsPage({ content, reviews, videos, faqs }: CustomerReviewsPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = content[lang];
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);
  const ratingBars: number[] = (() => {
    try { return JSON.parse(t.ratingBars); } catch { return [85, 10, 0, 5, 0]; }
  })();

  return (
    <>
      <PageHeroBanner
        title={t.heroTitle}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: t.heroTitle },
        ]}
      />

      {/* Hero Section with Trustpilot Card */}
      <section className="bg-[#f4f6f8] py-[40px] md:py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div dir={isAr ? "rtl" : undefined} className="flex flex-col md:flex-row items-center gap-[40px] md:gap-[60px]">
            {/* Trustpilot Rating Card */}
            <div className="bg-white rounded-[16px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] p-[32px] w-full md:w-[380px] shrink-0">
              <div className="flex items-center gap-3 mb-[16px]">
                <Image src="/uploads/trustpilot-logo.svg" alt="Trustpilot" width={120} height={30} className="h-[28px] w-auto" />
              </div>
              <div className="flex items-center gap-2 mb-[8px]">
                <span className="text-[32px] font-bold text-[#191c1f]">{t.trustpilotScore}</span>
                <Image src="/uploads/trustpilot-stars-4.5.svg" alt="4.5 stars" width={120} height={24} className="h-[22px] w-auto" />
              </div>
              <p className="text-[14px] text-[#5f7286] mb-[4px]">{t.trustpilotLabel}</p>
              <p className="text-[13px] text-[#93a2b3] mb-[20px]">{t.trustpilotTotal}</p>

              <div className="space-y-[8px]">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-[8px]">
                    <span className="text-[12px] text-[#5f7286] w-[8px]">{star}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#00b67a">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div className="flex-1 h-[6px] bg-[#e8ecf1] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00b67a] rounded-full transition-all" style={{ width: `${ratingBars[i] ?? 0}%` }} />
                    </div>
                    <span className="text-[12px] text-[#93a2b3] w-[32px] text-right">{ratingBars[i] ?? 0}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 text-center md:text-start">
              <h1 className="text-[#1a1a2e] text-[28px] md:text-[36px] font-bold leading-[1.3] mb-[16px]">
                {t.heroTitle}
              </h1>
              <p className="text-[#5f7286] text-[16px] md:text-[18px] leading-[28px] mb-[28px]">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-[12px] justify-center md:justify-start">
                <Link
                  href={t.heroCta1Url || "/register"}
                  className="bg-site-gradient text-white px-[28px] py-[12px] rounded-[32px] text-[16px] font-medium hover:opacity-90 transition-opacity"
                >
                  {t.heroCta1Text}
                </Link>
                <Link
                  href={t.heroCta2Url || "/contact"}
                  className="border-2 border-primary text-primary px-[28px] py-[12px] rounded-[32px] text-[16px] font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  {t.heroCta2Text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-[48px] md:py-[64px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 dir={isAr ? "rtl" : undefined} className="text-[#1a1a2e] text-[24px] md:text-[28px] font-bold leading-[1.3] mb-[32px] text-center">
            {t.reviewsSectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {visibleReviews.map((review, i) => (
              <div
                key={i}
                dir={isAr ? "rtl" : undefined}
                className="bg-white border border-[#e6eaf2] rounded-[12px] p-[24px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]"
              >
                <Stars count={review.stars} />
                <span className="inline-block mt-[12px] mb-[12px] bg-primary/10 text-primary text-[12px] font-medium px-[10px] py-[4px] rounded-[6px]">
                  {isAr ? review.badgeAr : review.badgeEn}
                </span>
                <p className="text-[#5f7286] text-[13.5px] leading-[22px] mb-[16px]">
                  {isAr ? review.textAr : review.textEn}
                </p>
                <p className="text-[#93a2b3] text-[13px] italic">
                  {isAr ? review.authorAr : review.authorEn}
                </p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && !showAll && (
            <div className="flex justify-center mt-[28px]">
              <button
                onClick={() => setShowAll(true)}
                className="bg-site-gradient text-white px-[32px] py-[10px] rounded-[32px] text-[15px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t.reviewsShowMore}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Testimonials Section */}
      {videos.length > 0 && (
        <section className="bg-[#f4f6f8] py-[48px] md:py-[64px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 dir={isAr ? "rtl" : undefined} className="text-[#1a1a2e] text-[24px] md:text-[28px] font-bold leading-[1.3] mb-[32px] text-center">
              {t.videosSectionTitle}
            </h2>
            <VideoSlider videos={videos} isAr={isAr} />
          </div>
        </section>
      )}

      {/* Trustpilot Bar */}
      <section className="bg-white py-[24px] border-y border-[#e6eaf2]">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center gap-[16px] flex-wrap">
          <Image src="/uploads/trustpilot-stars-4.5.svg" alt="Trustpilot Stars" width={120} height={24} className="h-[22px] w-auto" />
          <span className="text-[#191c1f] text-[18px] font-bold">{t.trustpilotScore}</span>
          <Image src="/uploads/trustpilot-logo.svg" alt="Trustpilot" width={100} height={26} className="h-[24px] w-auto" />
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-[#f4f6f8] py-[48px] md:py-[64px]">
          <div className="max-w-[800px] mx-auto px-6">
            <div className="space-y-[12px]">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-[12px] border border-[#e6eaf2] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    dir={isAr ? "rtl" : undefined}
                    className="w-full flex items-center justify-between px-[24px] py-[18px] text-left cursor-pointer"
                  >
                    <span className="text-[#1a1a2e] text-[15px] md:text-[16px] font-medium">
                      {isAr ? faq.questionAr : faq.questionEn}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5f7286"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 transition-transform duration-200 ${isAr ? "mr-auto ml-0" : "ml-auto mr-0"} ${openFaq === i ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div dir={isAr ? "rtl" : undefined} className="px-[24px] pb-[18px] text-[#5f7286] text-[14px] leading-[24px]">
                      {isAr ? faq.answerAr : faq.answerEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-dark-green py-[48px] md:py-[64px]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 dir={isAr ? "rtl" : undefined} className="text-white text-[24px] md:text-[30px] font-bold leading-[1.3] mb-[12px]">
            {t.ctaBannerTitle}
          </h2>
          <p dir={isAr ? "rtl" : undefined} className="text-white/70 text-[16px] leading-[26px] mb-[28px]">
            {t.ctaBannerSubtitle}
          </p>
          <div className="flex flex-wrap gap-[12px] justify-center">
            <Link
              href={t.ctaBtn1Url || "/register"}
              className="bg-site-gradient text-white px-[28px] py-[12px] rounded-[32px] text-[16px] font-medium hover:opacity-90 transition-opacity"
            >
              {t.ctaBtn1Text}
            </Link>
            <Link
              href={t.ctaBtn2Url || "/contact"}
              className="border-2 border-white text-white px-[28px] py-[12px] rounded-[32px] text-[16px] font-medium hover:bg-white/10 transition-colors"
            >
              {t.ctaBtn2Text}
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      {t.disclaimerText && (
        <section className="bg-[#f4f6f8] py-[24px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <p dir={isAr ? "rtl" : undefined} className="text-[#93a2b3] text-[12px] leading-[20px] text-center">
              {t.disclaimerText}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
