"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

interface BlogProps {
  blogSectionData: any;
  blogArticles: any;
}

export default function Blog({ blogSectionData, blogArticles }: BlogProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = blogArticles[lang];
  const h = blogSectionData.heading[lang];

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

  const renderCard = (article: (typeof items)[0], index: number) => (
    <>
      {/* Image */}
      <div
        className={`relative aspect-[421/298] overflow-hidden ${
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
        className={`border border-[#cacceb] border-t-0 rounded-b-[25px] flex flex-col px-[20px] md:px-[24px] pb-[20px] md:pb-[20px] ${
          isAr ? "text-right" : ""
        }`}
      >
        {/* Date badge + read time */}
        <div
          className={`flex items-end gap-4 ${
            isAr ? "flex-row-reverse" : ""
          }`}
        >
          <div className="relative -mt-[62px]">
            <div className="bg-site-gradient rounded-[12px] md:rounded-[13px] overflow-hidden w-[80px] md:w-[82px]">
              <div className="flex flex-col items-center p-[8px] md:p-[9px]">
                <span className="text-white text-[34px] md:text-[32px] font-bold leading-[34px] md:leading-[32px]">
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
        <h3 className="text-[#0e314c] text-[17px] md:text-[17px] xl:text-[19px] leading-[23px] md:leading-[23px] xl:leading-[25px] mt-[12px] line-clamp-3">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6084a4] text-[14px] md:text-[13px] xl:text-[14px] leading-[22px] md:leading-[20px] xl:leading-[22px] mt-[8px] line-clamp-3">
          {article.excerpt}
        </p>

        {/* Read More */}
        <div className="mt-auto pt-[16px]">
          <Link href={`/blog/${article.id}`} className="cta-gradient inline-flex items-center gap-[10px] rounded-[12px] px-[36px] py-[16px] text-[14px] font-semibold">
            {blogSectionData.readMoreLabel[lang]}
            <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <section className="min-h-screen-safe flex items-center py-[60px] px-3 md:py-[80px]">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <h2 className="section-heading-mobile text-[25px] leading-[32.5px] md:text-[32px] md:leading-[40px] xl:text-[40px] xl:leading-[48px] text-[#0e314c] mt-[10px]">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

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
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-0">
          {items.map((article: any, i: number) => (
            <div key={i} className="px-3">
              {renderCard(article, i)}
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
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

        {/* View All Blogs */}
        <div className="flex justify-center mt-[32px] md:mt-[48px]">
          <Link
            href="/blog"
            className="cta-gradient rounded-full px-[28px] py-[12px] text-white text-[14px] font-semibold inline-flex items-center gap-2"
          >
            {blogSectionData.viewAllLabel[lang]}
            <span className="text-[16px]">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
