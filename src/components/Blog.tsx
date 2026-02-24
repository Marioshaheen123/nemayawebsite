"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const articles = {
  en: [
    {
      image: "/images/blog-1.jpg",
      day: "10",
      month: "December",
      readTime: "10 min read",
      title: "5 Tips to optimize your financial operations today",
      excerpt:
        "Practical advice to streamline workflows and reduce costs using cutting-edge tools.",
    },
    {
      image: "/images/blog-2.jpg",
      day: "09",
      month: "December",
      readTime: "7 min read",
      title: "The power of AI in financial decision-making",
      excerpt:
        "Learn how artificial intelligence is transforming financial strategies with real-time insights.",
    },
    {
      image: "/images/blog-3.jpg",
      day: "08",
      month: "December",
      readTime: "15 min read",
      title: "How fintech is changing the game",
      excerpt:
        "How technologies are reshaping the financial landscape and driving business success.",
    },
  ],
  ar: [
    {
      image: "/images/blog-1.jpg",
      day: "10",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title: "5 نصائح لتحسين عملياتك المالية اليوم",
      excerpt:
        "نصائح عملية لتبسيط سير العمل وتقليل التكاليف باستخدام أدوات متطورة.",
    },
    {
      image: "/images/blog-2.jpg",
      day: "09",
      month: "ديسمبر",
      readTime: "7 دقائق قراءة",
      title: "قوة الذكاء الاصطناعي في اتخاذ القرارات المالية",
      excerpt:
        "تعلم كيف يقوم الذكاء الاصطناعي بتحويل الاستراتيجيات المالية من خلال رؤى في الوقت الحقيقي.",
    },
    {
      image: "/images/blog-3.jpg",
      day: "08",
      month: "ديسمبر",
      readTime: "15 دقائق قراءة",
      title: "كيف تغير التكنولوجيا المالية قواعد اللعبة",
      excerpt:
        "كيف تعيد التقنيات تشكيل المشهد المالي وتدفع نحو نجاح الأعمال.",
    },
  ],
};

const heading = {
  en: {
    before: "Read Our Latest ",
    bold: "News & Blog",
  },
  ar: {
    before: "اقرأ آخر ",
    bold: "أخبارنا ومدونتنا",
  },
};

const readMore = { en: "Read More", ar: "اقرأ المزيد" };

export default function Blog() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = articles[lang];
  const h = heading[lang];

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

  const renderCard = (article: (typeof items)[0]) => (
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
        className={`border border-[#cacceb] border-t-0 rounded-b-[25px] relative h-[286px] ${
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
            <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
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
        <div
          className={`absolute top-[55px] ${
            isAr ? "right-[30px] left-[30px]" : "left-[30px] right-[30px]"
          }`}
        >
          <h3 className="text-[#0e314c] text-[24px] leading-[28.8px]">
            {article.title}
          </h3>
        </div>

        {/* Excerpt */}
        <div
          className={`absolute top-[125px] ${
            isAr ? "right-[30px] left-[30px]" : "left-[30px] right-[30px]"
          }`}
        >
          <p className="text-[#6084a4] text-[14px] leading-[25.2px]">
            {article.excerpt}
          </p>
        </div>

        {/* Read More */}
        <div
          className={`absolute top-[202px] ${
            isAr ? "right-[30px]" : "left-[30px]"
          }`}
        >
          <a href="#" className="cta-glass-solid">
            {readMore[lang]}
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </>
  );

  return (
    <section className="py-[60px] px-3 md:py-[80px] md:px-[52px]">
      <div className="max-w-[1335px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label="Blog and News" labelAr="المدونة والأخبار" />
          <h2 className="text-[25px] leading-[32.5px] md:text-[40px] md:leading-[48px] text-[#0e314c] mt-[10px]">
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
            {items.map((article, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                {renderCard(article)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-0">
          {items.map((article, i) => (
            <div key={i} className="px-3">
              {renderCard(article)}
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === mobileSlide ? "bg-[#12953d]" : "bg-[#cacceb]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
