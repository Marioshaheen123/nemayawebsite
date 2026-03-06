"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import type { Bilingual, FinancialAssetCard } from "@/data/types";

interface FinancialAssetsPageProps {
  heroTitle: Bilingual<string>;
  heroSubtitle: Bilingual<string>;
  exploreLabel: Bilingual<string>;
  cardImages: Record<string, string>;
  cards: Bilingual<FinancialAssetCard[]>;
}

export default function FinancialAssetsPage({
  heroTitle,
  heroSubtitle,
  exploreLabel,
  cardImages,
  cards,
}: FinancialAssetsPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = cards[lang];

  return (
    <>
      <PageHeroBanner
        title={heroTitle[lang]}
        subtitle={heroSubtitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: heroTitle[lang] },
        ]}
      />

      {/* Asset Cards Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col gap-[24px]">
            {data.map((card) => (
              <Link
                key={card.slug}
                href={`/financial-assets/${card.slug}`}
                className="group relative flex flex-col md:flex-row bg-white rounded-[16px] shadow-[0_16px_48px_rgba(0,0,0,0.18)] overflow-hidden hover:shadow-[0_20px_56px_rgba(0,0,0,0.22)] transition-shadow duration-300"
              >
                {/* Decorative inset border */}
                <div className="hidden md:block absolute inset-[20px] border border-[#cacceb] rounded-[20px] pointer-events-none z-10" />

                {/* Image */}
                <div className="relative w-full md:w-[300px] shrink-0 h-[220px] md:h-auto md:min-h-[300px] overflow-hidden">
                  <Image
                    src={cardImages[card.slug]}
                    alt={card.headline}
                    fill
                    className="object-cover scale-[1.05] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div
                  className={`flex flex-col justify-center flex-1 p-[24px] md:py-[41px] md:px-[48px] ${
                    isAr ? "text-right" : "text-left"
                  }`}
                >
                  <h3 className="text-[#0e314c] text-[18px] md:text-[20px] font-bold leading-[24px] mb-[10px]">
                    {card.headline}
                  </h3>
                  <p className="text-[#6084a4] text-[15px] md:text-[17px] leading-[25.5px] mb-[20px]">
                    {card.description}
                  </p>
                  <div className={`flex ${isAr ? "justify-end" : "justify-start"}`}>
                    <span className="cta-gradient inline-flex items-center gap-[4px] text-white text-[14px] md:text-[16px] leading-[24px] px-[24px] py-[8px] rounded-full">
                      {exploreLabel[lang]} {card.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
