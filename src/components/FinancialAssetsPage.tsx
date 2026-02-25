"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const heroTitle = {
  en: "Financial Assets",
  ar: "الأصول المالية",
};

const heroSubtitle = {
  en: "Explore a wide range of global financial markets and trade with competitive conditions through Namaya's advanced platforms.",
  ar: "استكشف مجموعة واسعة من الأسواق المالية العالمية وتداول بشروط تنافسية عبر منصات نمايا المتقدمة.",
};

const exploreLabel = {
  en: "Explore",
  ar: "اكتشف المزيد",
};

const cardImages: Record<string, string> = {
  forex: "/images/asset-forex.jpg",
  commodities: "/images/asset-commodities.jpg",
  stocks: "/images/asset-stocks.jpg",
  indices: "/images/asset-indices.jpg",
  crypto: "/images/asset-crypto.jpg",
};

interface CardData {
  slug: string;
  name: string;
  headline: string;
  description: string;
  stats: string[];
}

const cards: { en: CardData[]; ar: CardData[] } = {
  ar: [
    {
      slug: "forex",
      name: "الفوركس",
      headline: "تداول العملات الأجنبية",
      description:
        "تداول أزواج العملات الرئيسية والثانوية والنادرة في أكبر سوق مالي في العالم بحجم تداول يومي يتجاوز 6 تريليون دولار.",
      stats: ["+60 زوج عملات", "فروقات من 0.1 نقطة", "رافعة حتى 1:500"],
    },
    {
      slug: "commodities",
      name: "السلع",
      headline: "تداول السلع والمعادن الثمينة",
      description:
        "نوّع محفظتك الاستثمارية من خلال تداول السلع الأكثر طلبًا في العالم من الذهب والفضة إلى النفط والغاز الطبيعي.",
      stats: ["+20 سلعة", "فروقات الذهب من 0.3", "رافعة حتى 1:200"],
    },
    {
      slug: "stocks",
      name: "الأسهم",
      headline: "تداول أسهم الشركات العالمية",
      description:
        "تداول عقود الفروقات على أسهم أكبر الشركات العالمية في بورصات نيويورك ولندن وطوكيو بدون الحاجة لامتلاك الأسهم.",
      stats: ["+500 سهم", "0% عمولة", "رافعة حتى 1:20"],
    },
    {
      slug: "indices",
      name: "المؤشرات",
      headline: "تداول المؤشرات العالمية",
      description:
        "تداول مؤشرات الأسواق العالمية الرئيسية وتابع أداء الاقتصادات الكبرى من داو جونز وناسداك إلى فوتسي وداكس.",
      stats: ["+15 مؤشر", "فروقات من 0.4 نقطة", "رافعة حتى 1:100"],
    },
    {
      slug: "crypto",
      name: "العملات الرقمية",
      headline: "تداول العملات الرقمية",
      description:
        "ادخل عالم العملات الرقمية وتداول أشهر العملات المشفرة مثل بيتكوين وإيثريوم مع إدارة مخاطر متقدمة.",
      stats: ["+30 عملة", "تداول 24/7", "رافعة حتى 1:10"],
    },
  ],
  en: [
    {
      slug: "forex",
      name: "Forex",
      headline: "Foreign Currency Trading",
      description:
        "Trade major, minor, and exotic currency pairs in the world's largest financial market with daily trading volume exceeding $6 trillion.",
      stats: ["60+ Pairs", "Spreads from 0.1", "Leverage up to 1:500"],
    },
    {
      slug: "commodities",
      name: "Commodities",
      headline: "Trade Commodities & Precious Metals",
      description:
        "Diversify your portfolio by trading the most sought-after commodities — from gold and silver to oil and natural gas.",
      stats: ["20+ Commodities", "Gold spread 0.3", "Leverage up to 1:200"],
    },
    {
      slug: "stocks",
      name: "Stocks",
      headline: "Trade Global Company Stocks",
      description:
        "Trade CFDs on stocks of the world's largest companies on the New York, London, Tokyo exchanges without owning the shares.",
      stats: ["500+ Stocks", "0% Commission", "Leverage up to 1:20"],
    },
    {
      slug: "indices",
      name: "Indices",
      headline: "Trade Global Indices",
      description:
        "Trade the world's major market indices — from Dow Jones and NASDAQ to FTSE and DAX — with competitive conditions.",
      stats: ["15+ Indices", "Spreads from 0.4", "Leverage up to 1:100"],
    },
    {
      slug: "crypto",
      name: "Crypto",
      headline: "Trade Cryptocurrencies",
      description:
        "Enter the world of digital currencies and trade Bitcoin, Ethereum, and more with advanced risk management.",
      stats: ["30+ Coins", "24/7 Trading", "Leverage up to 1:10"],
    },
  ],
};

export default function FinancialAssetsPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = cards[lang];

  return (
    <>
      {/* Hero Banner */}
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
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[50px]"
        >
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3] mb-[16px]">
            {heroTitle[lang]}
          </h1>
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] max-w-[680px]">
            {heroSubtitle[lang]}
          </p>
        </div>
      </section>

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
