"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const content = {
  en: {
    headlineBefore: "Invest now in ",
    headlineHighlight: "Intelligence",
    subtitle:
      "Be smart and invest in your assets with peace of mind. Namaya is your secure Saudi platform for trading in the local and global markets.",
    cta: "Get Started",
  },
  ar: {
    headlineBefore: "استثمر الآن في\n",
    headlineHighlight: "الذكاء",
    subtitle:
      "كن ذكياً واستثمر في أصولك براحة بال. نامايا هي منصتك الآمنة للتداول في الأسواق المحلية والعالمية.",
    cta: "ابدأ الآن",
  },
};

export default function Hero() {
  const { lang } = useLang();
  const t = content[lang];
  const isAr = lang === "ar";

  return (
    <section className="relative w-full h-screen-safe overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Person image */}
      <div
        className={`absolute bottom-0 w-full md:w-[927px] h-[268px] sm:h-[320px] md:h-[666px] xl:h-[750px] 2xl:h-[850px] md:max-w-[64%] ${
          isAr ? "left-0" : "right-0"
        }`}
      >
        <Image
          src="/images/hero-person.png"
          alt="Saudi investor"
          fill
          className={`object-contain ${
            isAr ? "object-left-bottom" : "object-right-bottom"
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-start md:items-center px-3 md:px-[52px] xl:px-[80px] 2xl:px-[120px] pt-[100px] md:pt-[100px] xl:pt-[110px]">
        <div
          className={`max-w-full md:max-w-[795px] xl:max-w-[900px] ${isAr ? "text-right ml-auto mr-0" : ""}`}
        >
          {/* Headline */}
          <h1 className="hero-headline text-[35px] leading-[38.5px] md:text-[90px] md:leading-[99px] xl:text-[110px] xl:leading-[121px] 2xl:text-[130px] 2xl:leading-[143px] text-white mb-5 whitespace-pre-line">
            {t.headlineBefore}
            <span className="font-extrabold text-[#12953d]">
              {t.headlineHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-white text-[16px] leading-[24px] md:text-[24px] md:leading-[36px] xl:text-[28px] xl:leading-[42px] max-w-[653px] xl:max-w-[750px] mb-5">
            {t.subtitle}
          </p>

          {/* CTA */}
          <div className="pt-[5px] md:pt-[15px] mb-5">
            <a href="#" className="cta-glass text-[12px] px-[21px] py-[13px] md:text-[14px] md:px-[36px] md:py-[16px] xl:text-[16px] xl:px-[42px] xl:py-[18px]">
              {t.cta}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
