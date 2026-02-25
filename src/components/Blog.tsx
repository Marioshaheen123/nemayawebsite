"use client";

import Image from "next/image";
import Link from "next/link";
import SectionBadge from "./SectionBadge";
import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const articles = {
  en: [
    {
      image: "/images/blog-page-1.jpg",
      day: "10",
      month: "December",
      readTime: "10 min read",
      title:
        "Somalia and Tanzania resume direct flights and strengthen bilateral cooperation",
      excerpt:
        "Somalia and Tanzania have announced an agreement to resume direct flights between Mogadishu and Dar es Salaam, in a move aimed at strengthening bilateral relations between the two countries.",
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "December",
      readTime: "7 min read",
      title:
        "The IMF calls on Nigeria to readjust its budget to lower oil prices",
      excerpt:
        "The International Monetary Fund and Nigeria needs to adjust its 2025 budget to lower oil prices and increase cash transfers, in order to protect the most vulnerable parts of its population who face poverty and food insecurity.",
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "08",
      month: "December",
      readTime: "15 min read",
      title:
        "The IMF announces it is in contact with Senegal despite previously suspending funding",
      excerpt:
        "The International Monetary Fund said it remains engaged with Senegal, as Prime Minister Ousmane Sonko announced an economic recovery plan and the allocation of billions of dollars to clear debts left by the previous regime.",
    },
  ],
  ar: [
    {
      image: "/images/blog-page-1.jpg",
      day: "10",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title:
        "تستأنف الصومال وتنزانيا الرحلات الجوية المباشرة وتعززان التعاون الثنائي",
      excerpt:
        "أعلنت الصومال وتنزانيا عن اتفاق لاستئناف الرحلات الجوية المباشرة بين مقديشو ودار السلام، في خطوة تهدف إلى تعزيز العلاقات الثنائية بين البلدين.",
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "ديسمبر",
      readTime: "15 دقائق قراءة",
      title:
        "يعلن صندوق النقد الدولي أنه على اتصال بالسنغال على الرغم من تعليق التمويل سابقًا",
      excerpt:
        "قال صندوق النقد الدولي إنه لا يزال متفاعلًا مع السنغال، حيث أعلن رئيس الوزراء عثمان سونكو عن خطة انتعاش اقتصادي وتخصيص مليارات الدولارات لسداد الديون المتراكمة من النظام السابق.",
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "08",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title:
        "يدعو صندوق النقد الدولي نيجيريا إلى إعادة ضبط ميزانيتها لتخفيض أسعار النفط",
      excerpt:
        "يحتاج صندوق النقد الدولي ونيجيريا إلى تعديل ميزانية 2025 لتخفيض أسعار النفط وزيادة التحويلات النقدية، لحماية أكثر الفئات ضعفًا في السكان الذين يواجهون الفقر وانعدام الأمن الغذائي.",
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
const viewAll = { en: "View All Blogs", ar: "عرض جميع المقالات" };

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
        className={`border border-[#cacceb] border-t-0 rounded-b-[25px] flex flex-col px-[30px] pb-[24px] ${
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
        <h3 className="text-[#0e314c] text-[20px] xl:text-[24px] leading-[26px] xl:leading-[30px] mt-[14px] line-clamp-3">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6084a4] text-[14px] xl:text-[15px] leading-[22px] xl:leading-[24px] mt-[10px] line-clamp-3">
          {article.excerpt}
        </p>

        {/* Read More */}
        <div className="mt-auto pt-[16px]">
          <Link href={`/blog/${index}`} className="cta-glass-solid">
            {readMore[lang]}
            <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <section className="min-h-screen-safe flex items-center py-[60px] px-3 md:py-[80px] md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
      <div className="w-full max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label="Blog and News" labelAr="المدونة والأخبار" />
          <h2 className="section-heading-mobile text-[25px] leading-[32.5px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] text-[#0e314c] mt-[10px]">
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
                {renderCard(article, i)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-0">
          {items.map((article, i) => (
            <div key={i} className="px-3">
              {renderCard(article, i)}
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

        {/* View All Blogs */}
        <div className="flex justify-center mt-[32px] md:mt-[48px]">
          <Link
            href="/blog"
            className="bg-[#12953d] hover:bg-[#0e7a32] transition-colors rounded-full px-[28px] py-[12px] text-white text-[14px] font-semibold inline-flex items-center gap-2"
          >
            {viewAll[lang]}
            <span className="text-[16px]">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
