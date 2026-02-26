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
      <PageHeroBanner title={heroTitle[lang]} subtitle={heroSubtitle[lang]} />

      {/* Asset Cards Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="flex flex-col gap-[20px] md:gap-[24px]">
            {data.map((card, idx) => (
              <Link
                key={card.slug}
                href={`/financial-assets/${card.slug}`}
                className={`group flex flex-col md:flex-row border border-[#cacceb] rounded-[20px] overflow-hidden hover:border-[#12953d] hover:shadow-[0_8px_30px_rgba(18,149,61,0.10)] transition-all duration-300 ${
                  isAr && idx % 2 !== 0 ? "md:flex-row-reverse" : !isAr && idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="relative w-full md:w-[42%] lg:w-[38%] shrink-0 h-[220px] md:h-auto md:min-h-[240px]">
                  <Image
                    src={cardImages[card.slug]}
                    alt={card.headline}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-1 p-[24px] md:p-[36px] lg:p-[44px]">
                  <span className="inline-block w-fit px-[14px] py-[4px] bg-[#12953d] rounded-full text-white text-[12px] md:text-[13px] font-semibold mb-[14px]">
                    {card.name}
                  </span>
                  <h3 className="text-[#0e314c] text-[22px] md:text-[26px] lg:text-[28px] font-bold leading-[1.3] mb-[12px]">
                    {card.headline}
                  </h3>
                  <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.7] mb-[24px]">
                    {card.description}
                  </p>
                  <div className="group/btn inline-flex items-center gap-[10px] text-[#12953d] text-[15px] font-semibold">
                    <span>{exploreLabel[lang]}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`group-hover:translate-x-1 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
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
