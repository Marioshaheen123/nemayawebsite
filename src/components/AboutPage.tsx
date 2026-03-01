"use client";

import React from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import SectionBadge from "./SectionBadge";

interface AboutPageProps {
  heroContent: any;
  redefiningBadge: any;
  redefiningContent: any;
  stats: any;
  visionBadge: any;
  visionTitle: any;
  visionCards: any;
  visionImages: any;
  missionTitle: any;
  valuesBadge: any;
  valuesHeading: any;
  values: any;
  valuesImage: any;
  securityBadge: any;
  securityContent: any;
  bridgingContent: any;
  bridgingImage: any;
  blogSectionBadge: any;
  blogSectionHeading: any;
  blogArticles: any;
  blogReadMoreLabel: any;
}

export default function AboutPage({
  heroContent,
  redefiningBadge,
  redefiningContent,
  stats,
  visionBadge,
  visionTitle,
  visionCards,
  visionImages,
  missionTitle,
  valuesBadge,
  valuesHeading,
  values,
  valuesImage,
  securityBadge,
  securityContent,
  bridgingContent,
  bridgingImage,
  blogSectionBadge,
  blogSectionHeading,
  blogArticles,
  blogReadMoreLabel,
}: AboutPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const hero = heroContent[lang];
  const redefining = redefiningContent[lang];
  const statItems = stats[lang];
  const visionTitleText = visionTitle[lang];
  const visionCardItems = visionCards[lang];
  const mission = missionTitle[lang];
  const vh = valuesHeading[lang];
  const valueItems = values[lang];
  const security = securityContent[lang];
  const bridging = bridgingContent[lang];
  const blogHeading = blogSectionHeading[lang];
  const articles = blogArticles[lang];

  return (
    <>
      {/* ===== HERO ===== */}
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
          className="relative max-w-7xl mx-auto px-6 py-[30px] md:py-[50px] xl:py-[60px]"
        >
          <h1 className="text-white text-[32px] md:text-[48px] xl:text-[60px] font-extrabold leading-[1.15] max-w-[600px]">
            {hero.title1}
            <br />
            <span className="italic text-[#b0f127]">{hero.title2}</span>
          </h1>
          <p className="text-white/80 text-[14px] md:text-[16px] leading-[1.5] mt-[16px] max-w-[500px]">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* ===== REDEFINING INVESTMENT ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge label={redefiningBadge.label} labelAr={redefiningBadge.labelAr} />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[30px]">
            {redefining.title1}
            <span className="font-bold">{redefining.title2}</span>
          </h2>

          {/* Two-column text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px] mb-[40px] md:mb-[60px]">
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {redefining.p1}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {redefining.p2}
            </p>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-[30px] md:gap-0 ${
              isAr ? "md:flex-row-reverse" : ""
            }`}
          >
            {statItems.map((stat: any, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="hidden md:block w-px h-[60px] bg-[#cacceb] mx-[40px] xl:mx-[60px] shrink-0" />
                )}
                <div className="text-center">
                  <div className="text-[#0e314c] text-[48px] md:text-[56px] xl:text-[64px] font-bold leading-[1]">
                    {stat.value}
                  </div>
                  <p className="text-[#6084a4] text-[13px] md:text-[14px] leading-[1.4] mt-[6px]">
                    {stat.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section className="bg-[#f9f9f9] py-[50px] md:py-[70px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-[16px]">
            <SectionBadge label={visionBadge.label} labelAr={visionBadge.labelAr} />
          </div>
          <h2 className="text-center text-[#0e314c] text-[22px] md:text-[32px] xl:text-[36px] leading-[1.3] mb-[40px] max-w-[900px] mx-auto">
            {visionTitleText}
          </h2>

          {/* Vision cards 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px]">
            {visionCardItems.map((card: any, i: number) => (
              <div
                key={i}
                className="relative rounded-[20px] overflow-hidden aspect-[630/300] group"
              >
                <Image
                  src={visionImages[i]}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-[24px] md:p-[30px]">
                  <h3 className="text-white text-[20px] md:text-[24px] font-bold leading-[1.2] mb-[6px]">
                    {card.title}
                  </h3>
                  <p className="text-white/80 text-[13px] md:text-[14px] leading-[1.4]">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="bg-white py-[40px] md:py-[50px]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2
            dir={isAr ? "rtl" : undefined}
            className="text-[#0e314c] text-[22px] md:text-[32px] xl:text-[36px] leading-[1.3]"
          >
            {mission}
          </h2>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-white pb-[50px] md:pb-[70px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-[24px]">
            <SectionBadge label={valuesBadge.label} labelAr={valuesBadge.labelAr} />
          </div>
          <div
            dir={isAr ? "rtl" : undefined}
            className="relative rounded-[20px] overflow-hidden"
          >
            <Image
              src={valuesImage}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0e314c]/85" />
            <div className="relative z-10 flex flex-col lg:flex-row gap-[30px] lg:gap-[48px] p-[30px] md:p-[50px] xl:p-[64px]">
              {/* Values text */}
              <div className="flex-1 flex flex-col gap-[20px]">
                <h3 className="text-white text-[24px] md:text-[32px] xl:text-[36px] leading-[1.2]">
                  {vh.part1}
                  <span className="font-bold">{vh.bold1}</span>
                  {vh.part2}
                  <span className="font-bold">{vh.bold2}</span>
                </h3>
                {valueItems.map((v: any, i: number) => (
                  <div key={i} className="flex items-start gap-[10px]">
                    <div className="mt-[6px] w-[20px] h-[20px] shrink-0">
                      <Image
                        src="/images/trading-check.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="text-white/90 text-[14px] md:text-[16px] leading-[1.5]">
                      <span className="font-bold">{v.label}</span> {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge
              label={securityBadge.label}
              labelAr={securityBadge.labelAr}
            />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[30px]">
            {security.title1}
            <span className="font-bold">{security.title2}</span>
            {security.title3}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px]">
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {security.p1}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {security.p2}
            </p>
          </div>
        </div>
      </section>

      {/* ===== BRIDGING GLOBAL MARKETS ===== */}
      <section className="bg-[#f9f9f9] py-[50px] md:py-[70px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col lg:flex-row items-center gap-[30px] lg:gap-[48px]">
            {/* Text */}
            <div className="flex-1 flex flex-col gap-[20px]">
              <h2 className="text-[#0e314c] text-[25px] md:text-[32px] xl:text-[36px] font-bold leading-[1.2]">
                {bridging.title}
              </h2>
              <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
                {bridging.p1}
              </p>
              <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
                {bridging.p2}
              </p>
              <div>
                <a
                  href="/trading-platforms"
                  className="inline-flex items-center justify-center px-[36px] py-[15.5px] bg-[#12953d] border border-[#b0f127] rounded-[5px] text-white text-[14px] font-semibold leading-[21px] hover:bg-[#0e7a31] transition-all"
                >
                  {bridging.cta}
                </a>
              </div>
            </div>
            {/* Image */}
            <div className="flex-1 relative rounded-[20px] overflow-hidden aspect-[600/400]">
              <Image
                src={bridgingImage}
                alt="Bridging Global Markets"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG / WHAT'S NEW ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge label={blogSectionBadge.label} labelAr={blogSectionBadge.labelAr} />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[40px]">
            {blogHeading.before}
            <span className="font-bold">{blogHeading.bold}</span>
          </h2>

          {/* Blog cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {articles.map((article: any, i: number) => (
              <div key={i} className="flex flex-col">
                {/* Image */}
                <div
                  className={`relative aspect-[421/298] overflow-hidden ${
                    isAr
                      ? "rounded-tr-[125px] rounded-tl-[25px]"
                      : "rounded-tl-[125px] rounded-tr-[25px]"
                  }`}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content */}
                <div className="border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[30px] pt-[56px] px-[30px]">
                  {/* Date badge + read time */}
                  <div
                    className={`flex items-end gap-4 absolute top-0 ${
                      isAr
                        ? "right-[30px] left-[30px] flex-row-reverse"
                        : "left-[30px] right-[30px]"
                    }`}
                  >
                    <div className="relative -mt-[62px]">
                      <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
                        <div className="flex flex-col items-center p-[10px]">
                          <span className="text-white text-[40px] font-bold leading-[40px]">
                            {article.day}
                          </span>
                        </div>
                        <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                          <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                            {article.month}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-[#0e314c] text-[20px] md:text-[24px] leading-[26px] md:leading-[28.8px] font-semibold mb-[10px]">
                    {article.title}
                  </h3>
                  <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-2">
                    {article.excerpt}
                  </p>
                  <a href="/blog" className="cta-glass-solid">
                    {blogReadMoreLabel[lang]}
                    <span className="cta-arrow">{isAr ? "\u2190" : "\u2192"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
