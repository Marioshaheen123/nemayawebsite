"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

interface HeroProps {
  heroContent: any;
  heroImages: any;
}

export default function Hero({ heroContent, heroImages }: HeroProps) {
  const { lang } = useLang();
  const t = heroContent[lang];
  const isAr = lang === "ar";

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'calc(100dvh - var(--header-h, 58px))' }}>
      {/* Background */}
      <Image
        src={heroImages.background}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Person image */}
      <div
        className={`absolute bottom-0 w-full md:w-[600px] lg:w-[700px] xl:w-[750px] 2xl:w-[850px] h-[230px] sm:h-[280px] md:h-[460px] lg:h-[520px] xl:h-[570px] 2xl:h-[650px] md:max-w-[50%] ${
          isAr ? "left-0" : "right-0"
        }`}
      >
        <Image
          src={heroImages.person}
          alt="Saudi investor"
          fill
          className={`object-contain ${
            isAr ? "object-left-bottom" : "object-right-bottom"
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-[240px] sm:pb-[290px] md:items-center md:pb-0 max-w-7xl mx-auto px-6 md:pt-[40px] w-full">
        <div
          className={`max-w-full md:max-w-[520px] lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[700px] ${isAr ? "text-right ml-auto mr-0" : ""}`}
        >
          {/* Headline */}
          <h1 className="hero-headline text-[35px] leading-[38.5px] md:text-[56px] md:leading-[64px] lg:text-[64px] lg:leading-[72px] xl:text-[76px] xl:leading-[84px] 2xl:text-[88px] 2xl:leading-[96px] text-white mb-4 whitespace-pre-line">
            {t.headlineBefore}
            <span className="font-extrabold text-site-gradient">
              {t.headlineHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-white text-[16px] leading-[24px] md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px] xl:text-[20px] xl:leading-[30px] 2xl:text-[22px] 2xl:leading-[34px] max-w-[500px] xl:max-w-[560px] mb-5">
            {t.subtitle}
          </p>

          {/* CTA */}
          <div className="pt-[5px] md:pt-[10px] mb-5">
            <a href="#" className="cta-gradient inline-flex items-center gap-[10px] rounded-[12px] text-[12px] px-[21px] py-[13px] md:text-[14px] md:px-[32px] md:py-[14px] xl:text-[15px] xl:px-[36px] xl:py-[16px] font-semibold">
              {t.cta}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
