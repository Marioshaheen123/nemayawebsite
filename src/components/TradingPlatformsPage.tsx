"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface TradingPlatformsPageProps {
  content: Bilingual<{
    heading: string;
    boldParagraph: string;
    paragraph: string;
    whyTitle: string;
    features: string[];
    closingBold: string;
    cta: string;
  }>;
  mockupImage: string;
  checkIcon: string;
}

export default function TradingPlatformsPage({
  content,
  mockupImage,
  checkIcon,
}: TradingPlatformsPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = content[lang];

  const renderTextContent = () => (
    <div
      dir={isAr ? "rtl" : undefined}
      className="flex-1 flex flex-col gap-[24px]"
    >
      <h1 className="text-[#0e314c] text-[28px] md:text-[32px] xl:text-[35px] font-bold leading-[1.2] xl:leading-[42px]">
        {t.heading}
      </h1>

      <div className="flex flex-col gap-[10px]">
        <p className="text-[#6084a4] text-[15px] xl:text-[16px] font-bold leading-[28.8px]">
          {t.boldParagraph}
        </p>
        <p className="text-[#6084a4] text-[15px] xl:text-[16px] leading-[1.4]">
          {t.paragraph}
        </p>
      </div>

      <div
        className="flex flex-col gap-[10px] w-full"
      >
        <p className="text-[#6084a4] text-[15px] xl:text-[16px] font-bold leading-[28.8px]">
          {t.whyTitle}
        </p>
        {t.features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-[10px]"
          >
            <Image
              src={checkIcon}
              alt=""
              width={20}
              height={20}
              className="shrink-0"
            />
            <span className="text-[#6084a4] text-[15px] xl:text-[16px] leading-[1.4]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[#6084a4] text-[15px] xl:text-[16px] font-bold leading-[28.8px]">
        {t.closingBold}
      </p>

      <div>
        <a
          href="#"
          className="inline-flex items-center justify-center px-[36px] py-[15.5px] bg-[#12953d] border border-[#b0f127] rounded-[5px] text-white text-[14px] font-semibold leading-[21px] hover:bg-[#0e7a31] transition-all"
        >
          {t.cta}
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Background Banner */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/blog-hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-80"
          />
        </div>
        <div className="relative h-[60px] md:h-[80px] xl:h-[100px]" />
      </section>

      {/* Main Content */}
      <section className="bg-white py-[40px] md:py-[64px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          {isAr ? (
            /* Arabic: Content LEFT, Image RIGHT */
            <div className="flex flex-col lg:flex-row items-center gap-[24px] lg:gap-[48px]">
              {renderTextContent()}
              <div className="flex-1 flex items-center justify-center relative min-h-[250px] md:min-h-[350px] lg:min-h-[450px]">
                <Image
                  src={mockupImage}
                  alt="Namaya Trading Platform"
                  width={794}
                  height={346}
                  className="object-contain w-full max-w-[794px]"
                />
              </div>
            </div>
          ) : (
            /* English: Content LEFT, Image RIGHT */
            <div className="flex flex-col lg:flex-row items-center gap-[24px] lg:gap-[48px]">
              {renderTextContent()}
              <div className="flex-1 flex items-center justify-center relative min-h-[250px] md:min-h-[350px] lg:min-h-[450px]">
                <Image
                  src={mockupImage}
                  alt="Namaya Trading Platform"
                  width={794}
                  height={346}
                  className="object-contain w-full max-w-[794px]"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
