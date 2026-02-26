"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { useLang } from "@/context/LanguageContext";

interface HowItWorksProps {
  howItWorksContent: any;
  howItWorksBadge: any;
  howItWorksImage: any;
}

const StarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="shrink-0 mt-[2px]"
  >
    <path
      d="M10 0L12.2 7.8L20 10L12.2 12.2L10 20L7.8 12.2L0 10L7.8 7.8L10 0Z"
      fill="#b0f127"
    />
  </svg>
);

export default function HowItWorks({ howItWorksContent, howItWorksBadge, howItWorksImage }: HowItWorksProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = howItWorksContent[lang];

  return (
    <section className="relative overflow-hidden min-h-screen-safe flex items-center">
      {/* Dark background image */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
      />

      <div className="relative z-10 w-full py-[60px] px-3 md:py-[120px] md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          {/* Desktop layout */}
          <div className="hidden md:flex items-center gap-[60px] xl:gap-[80px]">
            {/* Person image */}
            <div className="shrink-0">
              <div className="w-[500px] h-[500px] xl:w-[580px] xl:h-[580px] rounded-full overflow-hidden border-[4px] border-[#12953d]/30">
                <Image
                  src={howItWorksImage}
                  alt="How it works"
                  width={580}
                  height={580}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <SectionBadge label={howItWorksBadge.label} labelAr={howItWorksBadge.labelAr} />
              <h2
                className={`text-white text-[40px] leading-[48px] xl:text-[48px] xl:leading-[56px] mt-[16px] mb-[32px] max-w-[600px] xl:max-w-[700px]`}
              >
                {t.heading}
              </h2>

              {/* Steps */}
              <div className="flex flex-col gap-[24px]">
                {t.steps.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-[12px]">
                    <StarIcon />
                    <div>
                      <h3 className="text-white text-[20px] xl:text-[24px] font-bold leading-[24px] xl:leading-[28px] mb-[8px]">
                        {step.title}
                      </h3>
                      <div className="flex flex-col gap-[4px]">
                        {step.bullets.map((bullet: any, j: number) => (
                          <p
                            key={j}
                            className="text-[#a0b4c4] text-[16px] xl:text-[18px] leading-[24px]"
                          >
                            {bullet}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden flex flex-col items-center">
            {/* Person image */}
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-[3px] border-[#12953d]/30 mb-[24px]">
              <Image
                src={howItWorksImage}
                alt="How it works"
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Badge */}
            <div className="mb-[12px]">
              <SectionBadge label={howItWorksBadge.label} labelAr={howItWorksBadge.labelAr} />
            </div>

            {/* Heading */}
            <h2 className="section-heading-mobile text-white text-[25px] leading-[30px] text-center mb-[24px] max-w-[350px]">
              {t.heading}
            </h2>

            {/* Steps - titles only on mobile */}
            <div className="flex flex-col gap-[16px] w-full">
              {t.steps.map((step: any, i: number) => (
                <div
                  key={i}
                  className={`flex items-center gap-[10px] ${
                    isAr ? "" : ""
                  }`}
                >
                  <StarIcon />
                  <span className="text-white text-[18px] font-semibold leading-[22px]">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
