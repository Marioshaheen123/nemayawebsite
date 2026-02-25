"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const features = {
  en: [
    {
      title: "Access global markets",
      description:
        "Trade currencies, commodities, indices, gold, and oil from one secure, Saudi-based platform — anytime, anywhere.",
    },
    {
      title: "Mobile-first experience",
      description:
        "Open, manage, and monitor your investments directly from your phone with a simple, intuitive trading flow.",
    },
    {
      title: "Secure & trusted platform",
      description:
        "Built with advanced security and compliance standards to ensure safe and reliable trading at every step.",
    },
    {
      title: "Built for growth",
      description:
        "Everything you need to move confidently toward your financial goals — designed to scale with your ambitions.",
    },
  ],
  ar: [
    {
      title: "الوصول إلى الأسواق العالمية",
      description:
        "تداول العملات والسلع والمؤشرات والذهب والنفط من منصة آمنة ومقرها السعودية - في أي وقت ومن أي مكان.",
    },
    {
      title: "تجربة موجهة نحو الهاتف المحمول",
      description:
        "افتح وأدر وراقب استثماراتك مباشرة من هاتفك مع تدفق تداول بسيط وبديهي.",
    },
    {
      title: "منصة آمنة وموثوقة",
      description:
        "مصممة بمعايير أمان متقدمة والامتثال لضمان تداول آمن وموثوق في كل خطوة.",
    },
    {
      title: "مصممة للنمو",
      description:
        "كل ما تحتاجه للتحرك بثقة نحو أهدافك المالية - مصممة لتتوسع مع طموحاتك.",
    },
  ],
};

const heading = {
  en: {
    before: "Explore smart solutions to grow your wealth in ",
    bold: "global markets",
  },
  ar: {
    before: "استكشف الحلول الذكية لزيادة ثروتك في ",
    bold: "الأسواق العالمية",
  },
};

const ctaText = { en: "Get Started", ar: "ابدأ" };

export default function Benefits() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = features[lang];
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

  return (
    <section className="min-h-screen flex items-center py-[60px] px-3 md:py-[120px] md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
      <div className="w-full max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label="Benefits" labelAr="الفوائد" />
          <h2 className="text-[25px] leading-[30px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] text-[#0e314c] mt-[10px] max-w-[690px] xl:max-w-[800px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div
          className={`flex flex-col lg:flex-row items-center mb-[24px] md:mb-[40px] gap-[24px] ${
            isAr ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Phone mockup */}
          <div className="w-full lg:w-[445px] xl:w-[500px] px-3 pb-6 shrink-0">
            <div className="bg-[#12953d] rounded-[25px] w-full max-w-[421px] xl:max-w-[480px] h-[283px] md:h-[423px] xl:h-[500px] relative mx-auto lg:mx-0 overflow-hidden">
              <Image
                src="/images/Phonesection2.png"
                alt="Namaya app"
                width={510}
                height={884}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] xl:w-[440px] h-auto"
              />
            </div>
          </div>

          {/* Feature cards */}
          <div className="flex-1 relative w-full">
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
                {items.map((feature, i) => (
                  <div key={i} className="w-full shrink-0 px-1">
                    <div
                      className={`bg-[#f9f9f9] border border-[#cacceb] rounded-[16px] px-[31px] py-[17px] ${
                        isAr ? "text-right" : ""
                      }`}
                    >
                      <h3 className="text-[#0e314c] text-[20px] font-semibold leading-[24px]">
                        {feature.title}
                      </h3>
                      <p className="text-[#6084a4] text-[16px] leading-[1.4] mt-[9px]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile dots */}
              <div className="flex justify-center gap-2 mt-4">
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

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-[12px] xl:gap-[16px]">
              {items.map((feature, i) => (
                <div key={i}>
                  <div
                    className={`bg-[#f9f9f9] border border-[#cacceb] rounded-[25px] p-[31px] xl:p-[40px] h-full ${
                      isAr ? "text-right" : ""
                    }`}
                  >
                    <h3 className="text-[#0e314c] text-[20px] xl:text-[22px] font-semibold leading-[24px]">
                      {feature.title}
                    </h3>
                    <p className="text-[#6084a4] text-[16px] xl:text-[18px] leading-[1.4] mt-[9px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center logo decoration */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] xl:w-[120px] xl:h-[120px] rounded-full bg-white border border-[#cacceb] items-center justify-center z-10">
              <Image
                src="/images/small logo.png"
                alt=""
                width={41}
                height={52}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#"
            className="cta-glass-solid w-full md:w-auto justify-center"
          >
            {ctaText[lang]}
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
