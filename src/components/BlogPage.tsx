"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

interface BlogPageProps {
  blogArticles: any;
  blogPageHeroTitle: any;
}

const watchNowLabel = { en: "Watch Now", ar: "\u0634\u0627\u0647\u062f \u0627\u0644\u0622\u0646" };

export default function BlogPage({
  blogArticles,
  blogPageHeroTitle,
}: BlogPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = blogArticles[lang];

  // Mobile carousel state
  const [mobileSlide, setMobileSlide] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (isAr) {
      if (diff < -threshold && mobileSlide < items.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff > threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    } else {
      if (diff > threshold && mobileSlide < items.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff < -threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    }
  };

  const renderCard = (
    article: (typeof items)[0],
    index: number
  ) => (
    <div key={index} className="flex flex-col">
      {/* Image */}
      <div
        className={`relative aspect-[421/300] overflow-hidden ${
          isAr
            ? "rounded-tr-[125px] rounded-tl-[25px]"
            : "rounded-tl-[125px] rounded-tr-[25px]"
        }`}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div
        className={`border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[30px] pt-[56px] px-[30px] ${
          isAr ? "text-right" : ""
        }`}
      >
        {/* Date badge + read time */}
        <div
          className={`flex items-end gap-4 absolute top-0 ${
            isAr
              ? "right-[30px] left-[30px] flex-row-reverse"
              : "left-[30px] right-[30px]"
          }`}
        >
          <div className="relative -mt-[62px]">
            <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[94px]">
              <div className="flex flex-col items-center p-[10px]">
                <span className="text-white text-[40px] font-bold leading-[40px]">
                  {article.day}
                </span>
              </div>
              <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                  {article.month}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[#0e314c] text-[17px] md:text-[24px] leading-[23px] md:leading-[28.8px] font-semibold mb-[10px]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-3">
          {article.excerpt}
        </p>

        {/* Watch Now */}
        <Link
          href={`/blog/${article.id}`}
          className="cta-gradient group/btn inline-flex items-center gap-[10px] px-[28px] py-[12px] rounded-full text-white text-[14px] font-semibold hover:shadow-lg"
        >
          {watchNowLabel[lang]}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover/btn:translate-x-1 transition-transform duration-300 ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : ""}`}
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <PageHeroBanner
        title={blogPageHeroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: blogPageHeroTitle[lang] },
        ]}
      />

      {/* Blog Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mobile carousel */}
          <div
            className="md:hidden overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: isAr
                  ? `translateX(${mobileSlide * 100}%)`
                  : `translateX(-${mobileSlide * 100}%)`,
              }}
            >
              {items.map((article: any, i: number) => (
                <div key={i} className="w-full shrink-0 px-2">
                  {renderCard(article, i)}
                </div>
              ))}
            </div>

            {/* Mobile dots */}
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setMobileSlide(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === mobileSlide ? "bg-site-gradient" : "bg-[#cacceb]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop/Tablet grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px]">
            {items.map((article: any, i: number) => renderCard(article, i))}
          </div>
        </div>
      </section>
    </>
  );
}
