"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import type { Bilingual } from "@/data/types";

interface SocialMediaChannel {
  image: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaUrl: string;
}

interface SocialMediaPageProps {
  content: Bilingual<{
    heroTitle: string;
    sectionHeading: string;
    sectionDescription: string;
    contactTitle: string;
    contactDescription: string;
    contactCtaText: string;
    contactCtaUrl: string;
  }>;
  channels: SocialMediaChannel[];
}

export default function SocialMediaPage({ content, channels }: SocialMediaPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = content[lang];

  return (
    <>
      <PageHeroBanner
        title={t.heroTitle}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: t.heroTitle },
        ]}
      />

      {/* Main Content */}
      <section className="bg-[#f4f6f8] py-[40px] md:py-[48px]">
        <div className="max-w-[1620px] mx-auto px-6">
          {/* Section Header */}
          <div
            dir={isAr ? "rtl" : undefined}
            className="mb-[40px] md:mb-[48px] px-[12px]"
          >
            <h2 className="text-[#535353] text-[20px] md:text-[23px] font-bold leading-[27.6px] mb-[23px]">
              {t.sectionHeading}
            </h2>
            <p className="text-[#535353] text-[15px] md:text-[17.8px] leading-[26.7px]">
              {t.sectionDescription}
            </p>
          </div>

          {/* Social Media Cards */}
          <div className="flex flex-col gap-[24px]">
            {channels.map((channel, index) => (
              <div key={index} className="px-[12px]">
                <div className="group relative flex flex-col md:flex-row bg-white rounded-[16px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] overflow-hidden">
                  {/* Decorative inset border */}
                  <div className="hidden md:block absolute inset-[20px] border border-[#d6d6d6] rounded-[20px] pointer-events-none z-[2]" />

                  {/* Image — pinned to the left edge */}
                  <div className="relative w-full md:w-[350px] md:min-w-[350px] md:max-w-[350px] shrink-0 h-[220px] md:h-[320px] overflow-hidden z-[3]">
                    <div className="absolute inset-0 opacity-70">
                      <Image
                        src={channel.image}
                        alt={isAr ? channel.titleAr : channel.titleEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content — RTL text direction for Arabic */}
                  <div
                    dir={isAr ? "rtl" : undefined}
                    className="flex flex-col justify-center flex-1 py-[24px] px-[24px] md:py-[39px] md:px-[48px] md:pb-[48px] z-[1]"
                  >
                    <a
                      href={channel.ctaUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-[20px] md:text-[23.8px] font-bold leading-[28.8px] py-[8.5px] no-underline hover:underline"
                    >
                      {isAr ? channel.titleAr : channel.titleEn}
                    </a>

                    <p className="text-black/50 text-[16px] md:text-[20px] leading-[30px]">
                      {isAr ? channel.descriptionAr : channel.descriptionEn}
                    </p>

                    <div className={`flex ${isAr ? "justify-start" : "justify-end"} pt-[17.2px]`}>
                      <a
                        href={channel.ctaUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-site-gradient inline-flex items-center justify-center px-[24px] py-[8px] rounded-[32px] text-white text-[16px] leading-[24px] hover:opacity-90 transition-opacity"
                      >
                        {isAr ? channel.ctaTextAr : channel.ctaTextEn}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          {t.contactTitle && (
            <div className="mt-[48px] px-[12px]">
              <div
                dir={isAr ? "rtl" : undefined}
                className="bg-white rounded-[16px] border-2 border-[#e9edf7] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] py-[50px] px-[50px] flex flex-col items-center gap-[16px]"
              >
                <h2 className="text-[#1a1a2e] text-[20px] md:text-[23px] font-bold leading-[27.6px] text-center">
                  {t.contactTitle}
                </h2>
                <p className="text-[#6c757d] text-[15px] md:text-[17.6px] leading-[26.4px] text-center max-w-[700px]">
                  {t.contactDescription}
                </p>
                <a
                  href={t.contactCtaUrl || "/contact"}
                  className="bg-site-gradient inline-flex items-center justify-center px-[48px] py-[16px] rounded-[32px] text-white text-[18px] md:text-[20px] leading-[30px] hover:opacity-90 transition-opacity"
                >
                  {t.contactCtaText}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
