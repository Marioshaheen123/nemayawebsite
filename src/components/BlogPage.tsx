"use client";

import Image from "next/image";
import Link from "next/link";
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
    {
      image: "/images/blog-page-1.jpg",
      day: "06",
      month: "December",
      readTime: "10 min read",
      title:
        "Somalia and Tanzania resume direct flights and strengthen bilateral cooperation",
      excerpt:
        "Somalia and Tanzania have announced an agreement to resume direct flights between Mogadishu and Dar es Salaam, in a move aimed at strengthening bilateral relations between the two countries.",
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "25",
      month: "November",
      readTime: "7 min read",
      title:
        "The IMF calls on Nigeria to readjust its budget to lower oil prices",
      excerpt:
        "The International Monetary Fund and Nigeria needs to adjust its 2025 budget to lower oil prices and increase cash transfers, in order to protect the most vulnerable parts of its population who face poverty and food insecurity.",
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "24",
      month: "November",
      readTime: "15 min read",
      title:
        "The IMF announces it is in contact with Senegal despite previously suspending funding",
      excerpt:
        "The International Monetary Fund said it remains engaged with Senegal, as Prime Minister Ousmane Sonko announced an economic recovery plan and the allocation of billions of dollars to clear debts left by the previous regime.",
    },
    {
      image: "/images/blog-page-1.jpg",
      day: "18",
      month: "November",
      readTime: "10 min read",
      title:
        "Somalia and Tanzania resume direct flights and strengthen bilateral cooperation",
      excerpt:
        "Somalia and Tanzania have announced an agreement to resume direct flights between Mogadishu and Dar es Salaam, in a move aimed at strengthening bilateral relations between the two countries.",
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "16",
      month: "November",
      readTime: "7 min read",
      title:
        "The IMF calls on Nigeria to readjust its budget to lower oil prices",
      excerpt:
        "The International Monetary Fund and Nigeria needs to adjust its 2025 budget to lower oil prices and increase cash transfers, in order to protect the most vulnerable parts of its population who face poverty and food insecurity.",
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "07",
      month: "November",
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

const heroTitle = { en: "Blog", ar: "مدونة" };
const watchNowLabel = { en: "Watch Now", ar: "شاهد الآن" };

export default function BlogPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = articles[lang];

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
        <h3 className="text-[#0e314c] text-[20px] md:text-[24px] leading-[26px] md:leading-[28.8px] font-semibold mb-[10px]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-3">
          {article.excerpt}
        </p>

        {/* Watch Now */}
        <Link
          href={`/blog/${index % 3}`}
          className="group/btn inline-flex items-center gap-[10px] px-[28px] py-[12px] bg-[#12953d] rounded-full text-white text-[14px] font-semibold hover:bg-[#0e7a31] hover:shadow-[0_4px_16px_rgba(18,149,61,0.35)] transition-all duration-300"
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
      {/* Hero Banner */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/blog-hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-80"
          />
        </div>
        <div className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[40px]">
          <h1
            className={`text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3] ${
              isAr ? "text-right" : ""
            }`}
          >
            {heroTitle[lang]}
          </h1>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
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

            {/* Mobile dots */}
            <div className="flex justify-center gap-2 mt-6">
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

          {/* Desktop/Tablet grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px]">
            {items.map((article, i) => renderCard(article, i))}
          </div>
        </div>
      </section>
    </>
  );
}
