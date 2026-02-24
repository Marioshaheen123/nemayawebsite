"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
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

  return (
    <section className="py-[60px] px-3 md:py-[120px] md:px-[52px]">
      <div className="max-w-[1335px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label="Benefits" labelAr="الفوائد" />
          <h2 className="text-[25px] leading-[30px] md:text-[40px] md:leading-[48px] text-[#0e314c] mt-[10px] max-w-[690px] mx-auto">
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
          <div className="w-full lg:w-[445px] px-3 pb-6 shrink-0">
            <div className="bg-[#12953d] rounded-[25px] w-full max-w-[421px] h-[283px] md:h-[423px] relative mx-auto lg:mx-0 overflow-hidden">
              <Image
                src="/images/Phonesection2.png"
                alt="Namaya app"
                width={510}
                height={884}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] h-auto"
              />
            </div>
          </div>

          {/* Feature cards */}
          <div className="flex-1 relative w-full">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-[12px]">
              {items.map((feature, i) => (
                <div key={i}>
                  <div
                    className={`bg-[#f9f9f9] border border-[#cacceb] rounded-[16px] md:rounded-[25px] px-[31px] py-[17px] md:p-[31px] h-full ${
                      isAr ? "text-right" : ""
                    }`}
                  >
                    <h3 className="text-[#0e314c] text-[20px] font-semibold leading-[24px]">
                      {feature.title}
                    </h3>
                    <p className="hidden md:block text-[#6084a4] text-[16px] leading-[1.4] mt-[9px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center logo decoration */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full bg-white border border-[#cacceb] items-center justify-center z-10">
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
