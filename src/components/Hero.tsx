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
    badge1: "Real-time market insights",
    badge2: "Trusted Saudi platform",
  },
  ar: {
    headlineBefore: "استثمر الآن في\n",
    headlineHighlight: "الذكاء",
    subtitle:
      "كن ذكياً واستثمر في أصولك براحة بال. نامايا هي منصتك الآمنة للتداول في الأسواق المحلية والعالمية.",
    cta: "ابدأ الآن",
    badge1: "رؤى السوق في الوقت الحقيقي",
    badge2: "منصة سعودية موثوقة",
  },
};

export default function Hero() {
  const { lang } = useLang();
  const t = content[lang];
  const isAr = lang === "ar";

  return (
    <section className="relative w-full h-[792px] overflow-hidden">
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
        className={`absolute bottom-0 w-[927px] h-[666px] max-w-[64%] ${
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
      <div className="relative z-10 h-full px-[52px] pt-[220px] pb-[100px]">
        <div
          className={`max-w-[795px] ${isAr ? "text-right ml-auto mr-0" : ""}`}
        >
          {/* Headline */}
          <h1 className="text-[90px] leading-[99px] text-white mb-5 whitespace-pre-line">
            {t.headlineBefore}
            <span className="font-extrabold text-[#12953d]">
              {t.headlineHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white text-[24px] leading-[36px] max-w-[653px] mb-5">
            {t.subtitle}
          </p>

          {/* CTA */}
          <div className="pt-[15px] mb-5">
            <a href="#" className="cta-glass">
              {t.cta}
              <span className="cta-arrow">→</span>
            </a>
          </div>

          {/* Trust badges */}
          <div
            className={`flex flex-wrap items-center gap-[50px] pt-[10px] ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isAr ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#00470d] flex items-center justify-center">
                <Image
                  src="/images/hero-icon.svg"
                  alt=""
                  width={25}
                  height={25}
                />
              </div>
              <span className="text-white text-[16px] leading-[1.4]">
                {t.badge1}
              </span>
            </div>
            <div
              className={`flex items-center gap-4 ${
                isAr ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#00470d] flex items-center justify-center">
                <Image
                  src="/images/hero-icon.svg"
                  alt=""
                  width={25}
                  height={25}
                />
              </div>
              <span className="text-white text-[16px] leading-[1.4]">
                {t.badge2}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
