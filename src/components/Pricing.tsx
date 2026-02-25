"use client";

import SectionBadge from "./SectionBadge";
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
      rotate: "rotate-2",
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
      rotate: "",
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
      rotate: "-rotate-2",
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
      rotate: "rotate-2",
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
      rotate: "",
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
      rotate: "-rotate-2",
      bg: "bg-white",
    },
  ],
};

const heading = {
  en: {
    before: "Choose the account that suits your ",
    bold: "budget and goals",
  },
  ar: {
    before: "اختر الحساب الذي يناسب ",
    bold: "ميزانيتك وأهدافك",
  },
};

// Rotation classes with md: prefix so they only apply on desktop
const rotationClasses = ["md:rotate-2", "", "md:-rotate-2"];

export default function Pricing() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const planItems = plans[lang];
  const featureItems = features[lang];
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
      if (diff < -threshold && mobileSlide < planItems.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff > threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    } else {
      if (diff > threshold && mobileSlide < planItems.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff < -threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    }
  };

  const renderCard = (
    plan: (typeof planItems)[0],
    i: number,
    isMobile: boolean
  ) => (
    <div
      className={`${isMobile ? "" : rotationClasses[i]} ${plan.bg} rounded-[25px] border border-[#cacceb] p-[25px] md:p-[20px] xl:p-[28px] flex flex-col gap-[14px] md:gap-[12px] xl:gap-[16px] ${
        isAr ? "text-right" : ""
      } ${plan.gradient ? "md:py-[30px] xl:py-[38px]" : ""}`}
      style={
        plan.gradient
          ? {
              backgroundImage:
                "linear-gradient(180deg, rgba(18, 149, 61, 0.08) 0%, rgba(255, 255, 255, 1) 60%)",
            }
          : undefined
      }
    >
      {/* Price section */}
      <div className={isMobile ? "" : "h-[155px] xl:h-[170px]"}>
        <h3 className="text-[#0e314c] text-[24px] md:text-[20px] xl:text-[24px] font-bold leading-[28.8px] md:leading-[26px] xl:leading-[30px] mb-[8px] md:mb-[6px]">
          {plan.name}
        </h3>
        <div className="flex items-end gap-0 mb-[8px] md:mb-[6px]">
          {isAr ? (
            <>
              <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                {plan.period}
              </span>
              <span
                className={`text-[#0e314c] font-bold mx-1 ${
                  isMobile
                    ? "text-[40px] leading-[48px]"
                    : "text-[50px] leading-[50px] xl:text-[60px] xl:leading-[60px]"
                }`}
              >
                {plan.price}
              </span>
              <span className="text-[#6084a4] text-[14px] xl:text-[16px] leading-[14px] pb-[5px]">
                ابتدا من
              </span>
            </>
          ) : (
            <>
              <span
                className={`text-[#0e314c] font-bold ${
                  isMobile
                    ? "text-[40px] leading-[48px]"
                    : "text-[50px] leading-[50px] xl:text-[60px] xl:leading-[60px]"
                }`}
              >
                {plan.price}
              </span>
              <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                /{plan.period}
              </span>
            </>
          )}
        </div>
        <p className="text-[#6084a4] text-[14px] md:text-[13px] xl:text-[15px] leading-[1.4]">
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-[5px] md:gap-[4px] xl:gap-[6px]">
        <h4 className="text-[#0e314c] text-[16px] md:text-[14px] xl:text-[16px] font-bold leading-[1.4] mb-[4px]">
          {plan.featuresLabel}
        </h4>
        {featureItems.map((feature, j) => (
          <div key={j} className="flex items-center gap-[10px]">
            <div className="w-[22px] h-[22px] md:w-[18px] md:h-[18px] xl:w-[20px] xl:h-[20px] rounded-full bg-[rgba(18,149,61,0.1)] flex items-center justify-center shrink-0">
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
            <span className="text-[#6084a4] text-[14px] md:text-[13px] xl:text-[15px] leading-[20px]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={isAr ? "text-right" : ""}>
        <a
          href="#"
          className={`inline-block border rounded-[5px] px-[36px] py-[12px] md:py-[10px] xl:py-[14px] text-[14px] md:text-[13px] xl:text-[14px] font-semibold leading-[21px] hover:opacity-90 transition-opacity ${
            isMobile ? "w-full text-center" : "w-fit"
          } ${plan.ctaStyle}`}
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen flex items-center py-[60px] px-4 md:py-[50px] md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
      <div className="w-full max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[20px] xl:mb-[28px]">
          <SectionBadge label="PRICING PLANS" labelAr="خطط الأسعار" />
          <h2 className="text-[25px] leading-[32.5px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] text-[#0e314c] mt-[10px] max-w-[664px] xl:max-w-[750px] mx-auto">
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
            {planItems.map((plan, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                {renderCard(plan, i, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-0 items-center">
          {planItems.map((plan, i) => (
            <div key={i} className="px-3 pb-4">
              {renderCard(plan, i, false)}
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3 md:mt-2">
          {planItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors md:pointer-events-none ${
                i === mobileSlide ? "bg-[#12953d]" : "bg-[#cacceb]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
