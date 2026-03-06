"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

interface EconomicDevelopmentsPageProps {
  articles: any;
  suggested: any;
  heroTitle: any;
}

const readMoreLabel = { en: "Read More", ar: "اقرأ المزيد" };
const suggestedTopicsLabel = {
  en: "Suggested topics for you",
  ar: "مواضيع مقترحة لك",
};

export default function EconomicDevelopmentsPage({
  articles,
  suggested,
  heroTitle,
}: EconomicDevelopmentsPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = articles[lang] || [];
  const suggestedItems = suggested[lang] || [];

  // Separate featured article from the rest
  const featuredArticle = items.find((a: any) => a.featured) || items[0];
  const gridArticles = items.filter((a: any) => a !== featuredArticle);

  /* ─── Date Badge ─── */
  const DateBadge = ({ day, month }: { day: string; month: string }) => (
    <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[74px] md:w-[94px]">
      <div className="flex flex-col items-center px-[8px] pt-[8px] pb-[4px] md:p-[10px]">
        <span className="text-white text-[32px] md:text-[40px] font-bold leading-[32px] md:leading-[40px]">
          {day}
        </span>
      </div>
      <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[8px] py-[2px] md:px-[10px] md:py-[3px] text-center">
        <span className="text-[#0e314c] text-[12px] md:text-[14px] leading-[20px] md:leading-[25.2px]">
          {month}
        </span>
      </div>
    </div>
  );

  /* ─── Article Card ─── */
  const renderCard = (article: any, index: number) => (
    <div key={index} className="flex flex-col">
      {/* Image */}
      <div
        className={`relative aspect-[421/300] overflow-hidden ${
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
      <div
        className={`border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[24px] md:pb-[30px] pt-[50px] md:pt-[56px] px-[20px] md:px-[30px] flex-1 flex flex-col ${
          isAr ? "text-right" : ""
        }`}
      >
        {/* Date badge + read time */}
        <div
          className={`flex items-end gap-3 md:gap-4 absolute top-0 ${
            isAr
              ? "right-[20px] md:right-[30px] flex-row-reverse"
              : "left-[20px] md:left-[30px]"
          }`}
        >
          <div className="relative -mt-[52px] md:-mt-[62px]">
            <DateBadge day={article.day} month={article.month} />
          </div>
          <span className="text-[#6084a4] text-[12px] md:text-[14px] leading-[20px] md:leading-[25.2px] pb-1">
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[#0e314c] text-[18px] md:text-[20px] lg:text-[24px] leading-[24px] md:leading-[26px] lg:leading-[28.8px] font-semibold mb-[8px] md:mb-[10px]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#6084a4] text-[13px] md:text-[14px] leading-[22px] md:leading-[25.2px] mb-[20px] md:mb-[26px] line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Read More */}
        <Link
          href={`/economic-developments/${article.id}`}
          className="cta-gradient group/btn inline-flex items-center gap-[10px] px-[24px] md:px-[28px] py-[10px] md:py-[12px] rounded-full text-white text-[13px] md:text-[14px] font-semibold hover:shadow-lg self-start"
        >
          {readMoreLabel[lang]}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover/btn:translate-x-1 transition-transform duration-300 ${
              isAr ? "rotate-180 group-hover/btn:-translate-x-1" : ""
            }`}
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );

  /* ─── Featured Article (compact — sized to align with sidebar) ─── */
  const renderFeatured = () => {
    if (!featuredArticle) return null;
    return (
      <div className={`flex flex-col ${isAr ? "text-right" : ""}`}>
        {/* Image — compact aspect ratio to keep card short on desktop */}
        <div
          className={`relative aspect-[16/10] md:aspect-[16/8] overflow-hidden ${
            isAr
              ? "rounded-tr-[80px] md:rounded-tr-[125px] rounded-tl-[20px] md:rounded-tl-[25px]"
              : "rounded-tl-[80px] md:rounded-tl-[125px] rounded-tr-[20px] md:rounded-tr-[25px]"
          }`}
        >
          <Image
            src={featuredArticle.image}
            alt={featuredArticle.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div
          className={`border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[20px] md:pb-[24px] pt-[50px] md:pt-[56px] px-[20px] md:px-[24px] ${
            isAr ? "text-right" : ""
          }`}
        >
          {/* Date badge + read time */}
          <div
            className={`flex items-end gap-3 md:gap-4 absolute top-0 ${
              isAr
                ? "right-[20px] md:right-[24px] flex-row-reverse"
                : "left-[20px] md:left-[24px]"
            }`}
          >
            <div className="relative -mt-[52px] md:-mt-[62px]">
              <DateBadge
                day={featuredArticle.day}
                month={featuredArticle.month}
              />
            </div>
            <span className="text-[#6084a4] text-[12px] md:text-[14px] leading-[20px] md:leading-[25.2px] pb-1">
              {featuredArticle.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[#0e314c] text-[20px] md:text-[22px] lg:text-[24px] leading-[26px] md:leading-[28px] lg:leading-[30px] font-semibold mb-[6px] md:mb-[8px]">
            {featuredArticle.title}
          </h2>

          {/* Excerpt — clamp to 2 lines on desktop to keep card short */}
          <p className="text-[#6084a4] text-[13px] md:text-[14px] leading-[22px] md:leading-[24px] mb-[16px] md:mb-[20px] line-clamp-3 md:line-clamp-2">
            {featuredArticle.excerpt}
          </p>

          {/* Read More */}
          <Link
            href={`/economic-developments/${featuredArticle.id}`}
            className="cta-gradient group/btn inline-flex items-center gap-[10px] px-[24px] md:px-[28px] py-[10px] md:py-[12px] rounded-full text-white text-[13px] md:text-[14px] font-semibold hover:shadow-lg"
          >
            {readMoreLabel[lang]}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`group-hover/btn:translate-x-1 transition-transform duration-300 ${
                isAr ? "rotate-180 group-hover/btn:-translate-x-1" : ""
              }`}
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  /* ─── Suggested Topics Sidebar ─── */
  const renderSidebar = () => (
    <div
      className={`bg-white border border-[#e8e9f0] rounded-[20px] p-[20px] md:p-[24px] h-fit ${
        isAr ? "text-right" : ""
      }`}
    >
      <h3 className="text-[#0e314c] text-[18px] md:text-[20px] font-semibold mb-[16px] md:mb-[20px]">
        {suggestedTopicsLabel[lang]}
      </h3>
      <div className="space-y-[12px] md:space-y-[16px]">
        {suggestedItems.map((item: any, i: number) => (
          <Link
            key={i}
            href={`/economic-developments/${item.slug}`}
            className={`flex items-center gap-[12px] group ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[10px] overflow-hidden shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[#0e314c] text-[13px] md:text-[14px] leading-[18px] md:leading-[20px] font-medium group-hover:text-primary transition-colors line-clamp-2 flex-1">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageHeroBanner
        title={heroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: heroTitle[lang] },
        ]}
      />

      <section className="bg-white py-[30px] md:py-[60px] xl:py-[80px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* ─── Desktop/Tablet: Featured + Sidebar ─── */}
          <div className="hidden md:block mb-[40px] lg:mb-[50px]">
            <div
              className={`flex items-start gap-[24px] lg:gap-[30px] ${
                isAr ? "flex-row-reverse" : ""
              }`}
            >
              {/* Featured Article — takes ~65% width */}
              <div className="flex-[2] min-w-0">
                {renderFeatured()}
              </div>

              {/* Sidebar — takes ~35% width, top-aligned */}
              <div className="flex-[1] min-w-0">
                {renderSidebar()}
              </div>
            </div>
          </div>

          {/* ─── Mobile: Featured ─── */}
          <div className="md:hidden mb-[30px]">{renderFeatured()}</div>

          {/* ─── Mobile: Suggested Topics ─── */}
          <div className="md:hidden mb-[30px]">{renderSidebar()}</div>

          {/* ─── Mobile: Stacked article cards ─── */}
          {gridArticles.length > 0 && (
            <div className="md:hidden space-y-[30px]">
              {gridArticles.map((article: any, i: number) =>
                renderCard(article, i)
              )}
            </div>
          )}

          {/* ─── Desktop/Tablet grid ─── */}
          {gridArticles.length > 0 && (
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px]">
              {gridArticles.map((article: any, i: number) =>
                renderCard(article, i)
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
