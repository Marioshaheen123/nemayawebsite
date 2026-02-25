"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const features = {
  en: [
    "Daily market analysis",
    "24/7 customer support",
    "Personal trading advisor",
    "Daily recommendations",
    "Instant trading alerts",
    "Low spread advantage",
    "VIP support",
  ],
  ar: [
    "تحليل السوق اليومي",
    "دعم العملاء على مدار الساعة طوال أيام الأسبوع",
    "مستشار تداول شخصي",
    "توصيات يومية",
    "تنبيهات تداول فورية",
    "ميزة الفارق المنخفض",
    "دعم VIP",
  ],
};

const plans = {
  en: [
    {
      name: "Mini Account",
      price: "$29",
      period: "month",
      description:
        "Best for individuals and small businesses looking to get started",
      cta: "Get Started",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "Standard Account",
      price: "$79",
      period: "month",
      description:
        "Perfect for growing businesses needing more features and support",
      cta: "Start Free Trial",
      featuresLabel: "Features",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      bg: "",
      gradient: true,
    },
    {
      name: "Gold Account",
      price: "$99",
      period: "month",
      description:
        "Ideal for large enterprises that require custom solutions and dedicated support",
      cta: "Contact Us",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "Premium Account",
      price: "$149",
      period: "month",
      description:
        "Ideal for large enterprises that require custom solutions and dedicated support",
      cta: "Contact Us",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
  ],
  ar: [
    {
      name: "حساب مصغر",
      price: "3,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "حساب قياسي",
      price: "18,750",
      period: "ر.س",
      description:
        "مثالي للأعمال المتنامية التي تحتاج إلى المزيد من الميزات والدعم",
      cta: "ابدأ تجربة مجانية",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      bg: "",
      gradient: true,
    },
    {
      name: "حساب الذهب",
      price: "37,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "حساب مميز",
      price: "56,250",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
  ],
};

const heroTitle = { en: "Types of Accounts", ar: "أنواع الحسابات" };

const heading = {
  en: {
    before: "Choose the account that suits\nyour ",
    bold: "budget and goals",
  },
  ar: {
    before: "اختر الحساب الذي يناسب ",
    bold: "ميزانيتك وأهدافك",
  },
};

export default function AccountTypesPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const planItems = plans[lang];
  const featureItems = features[lang];
  const h = heading[lang];

  // Carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const totalPages = Math.ceil(planItems.length / 3);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (isAr) {
      if (diff < -threshold && currentPage < totalPages - 1)
        setCurrentPage((p) => p + 1);
      else if (diff > threshold && currentPage > 0)
        setCurrentPage((p) => p - 1);
    } else {
      if (diff > threshold && currentPage < totalPages - 1)
        setCurrentPage((p) => p + 1);
      else if (diff < -threshold && currentPage > 0)
        setCurrentPage((p) => p - 1);
    }
  };

  const renderCard = (plan: (typeof planItems)[0]) => (
    <div
      className={`${plan.bg} rounded-[25px] border border-[#cacceb] p-[25px] md:p-[24px] xl:p-[28px] flex flex-col gap-[16px] ${
        isAr ? "text-right" : ""
      }`}
      style={
        plan.gradient
          ? {
              backgroundImage:
                "linear-gradient(180deg, rgba(18, 149, 61, 0.08) 0%, rgba(255, 255, 255, 1) 60%)",
            }
          : undefined
      }
    >
      {/* Name */}
      <h3 className="text-[#0e314c] text-[24px] font-bold leading-[28.8px]">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="flex items-end gap-0 mb-[4px]">
        {isAr ? (
          <>
            <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
              {plan.period}
            </span>
            <span className="text-[#0e314c] font-bold mx-1 text-[48px] md:text-[52px] xl:text-[60px] leading-[1]">
              {plan.price}
            </span>
            <span className="text-[#6084a4] text-[14px] xl:text-[16px] leading-[14px] pb-[5px]">
              ابتدا من
            </span>
          </>
        ) : (
          <>
            <span className="text-[#0e314c] font-bold text-[48px] md:text-[52px] xl:text-[60px] leading-[1]">
              {plan.price}
            </span>
            <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
              /{plan.period}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-[#6084a4] text-[14px] xl:text-[15px] leading-[1.4]">
        {plan.description}
      </p>

      {/* Features */}
      <div className="flex flex-col gap-[6px]">
        <h4 className="text-[#0e314c] text-[16px] font-bold leading-[1.4] mb-[4px]">
          {plan.featuresLabel}
        </h4>
        {featureItems.map((feature, j) => (
          <div key={j} className="flex items-center gap-[10px]">
            <div className="w-[22px] h-[22px] rounded-full bg-[rgba(18,149,61,0.1)] flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="#12953d"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[#6084a4] text-[14px] xl:text-[15px] leading-[20px]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={isAr ? "text-right" : ""}>
        <a
          href="#"
          className={`inline-block border rounded-[5px] px-[36px] py-[14px] text-[14px] font-semibold leading-[21px] hover:opacity-90 transition-opacity ${plan.ctaStyle}`}
        >
          {plan.cta}
        </a>
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
        <div
          dir={isAr ? "rtl" : undefined}
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[40px]"
        >
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3]">
            {heroTitle[lang]}
          </h1>
        </div>
      </section>

      {/* Account Cards */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          {/* Heading */}
          <div className="text-center mb-[32px] md:mb-[40px]">
            <h2 className="text-[#0e314c] text-[25px] md:text-[40px] xl:text-[48px] leading-[1.3] whitespace-pre-line">
              {h.before}
              <span className="font-bold">{h.bold}</span>
            </h2>
          </div>

          {/* Mobile: single card carousel */}
          <div
            className="md:hidden overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: isAr
                  ? `translateX(${currentPage * 100}%)`
                  : `translateX(-${currentPage * 100}%)`,
              }}
            >
              {planItems.map((plan, i) => (
                <div key={i} className="w-full shrink-0 px-2">
                  {renderCard(plan)}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: scrollable row with overflow peek */}
          <div className="hidden md:block overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-[20px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: isAr
                  ? `translateX(${currentPage * 33.33}%)`
                  : `translateX(-${currentPage * 33.33}%)`,
              }}
            >
              {planItems.map((plan, i) => (
                <div key={i} className="w-[calc(33.33%-14px)] shrink-0">
                  {renderCard(plan)}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-[8px] mt-[24px]">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-[12px] h-[12px] rounded-full transition-colors cursor-pointer ${
                  i === currentPage ? "bg-[#12953d]" : "bg-[#cacceb]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
