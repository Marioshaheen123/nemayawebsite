"use client";

import Image from "next/image";

import { useLang } from "@/context/LanguageContext";

interface BenefitsProps {
  benefitsFeatures: any;
  benefitsHeading: any;
  benefitsCtaText: any;

  benefitsImages: any;
}

export default function Benefits({ benefitsFeatures, benefitsHeading, benefitsCtaText, benefitsImages }: BenefitsProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = benefitsFeatures[lang];
  const h = benefitsHeading[lang];

  return (
    <section className="min-h-screen-safe flex items-center py-[60px] px-3 md:py-[120px]">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <h2 className="section-heading-mobile text-[25px] leading-[30px] md:text-[32px] md:leading-[40px] xl:text-[36px] xl:leading-[44px] text-[#0e314c] mt-[10px] max-w-[690px] xl:max-w-[800px] mx-auto">
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
            <div className="rounded-[25px] w-full max-w-[421px] xl:max-w-[480px] h-[283px] md:h-[423px] xl:h-[500px] relative mx-auto lg:mx-0 overflow-hidden">
              <Image
                src={benefitsImages.phone}
                alt="Namaya app"
                width={510}
                height={884}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] xl:w-[440px] h-auto"
              />
            </div>
          </div>

          {/* Feature cards */}
          <div className="flex-1 relative w-full">
            {/* Feature cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] xl:gap-[16px]">
              {items.map((feature: any, i: number) => (
                <div key={i}>
                  <div
                    className={`bg-[#f9f9f9] border border-[#cacceb] rounded-[25px] p-[31px] xl:p-[40px] h-full ${
                      isAr ? "text-right" : ""
                    }`}
                  >
                    <h3 className="text-[#0e314c] text-[16px] xl:text-[18px] font-semibold leading-[22px]">
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
                src={benefitsImages.centerLogo}
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
            className="cta-gradient inline-flex items-center gap-[10px] rounded-[12px] px-[36px] py-[16px] text-[14px] font-semibold w-full md:w-auto justify-center"
          >
            {benefitsCtaText[lang]}
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
