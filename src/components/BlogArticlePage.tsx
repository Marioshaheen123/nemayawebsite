"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

const labels = {
  en: {
    suggestedTopics: "Suggested topics for you",
    moreArticles: "More Articles",
    readMore: "Read More",
  },
  ar: {
    suggestedTopics: "\u0645\u0648\u0627\u0636\u064a\u0639 \u0645\u0642\u062a\u0631\u062d\u0629 \u0644\u0643",
    moreArticles: "\u0645\u0642\u0627\u0644\u0627\u062a \u0623\u0643\u062b\u0631",
    readMore: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064a\u062f",
  },
};

interface BlogArticlePageProps {
  slug: string;
  blogArticles: any;
  suggestedArticles: any;
  moreArticlesCards: any;
}

export default function BlogArticlePage({
  slug,
  blogArticles,
  suggestedArticles,
  moreArticlesCards,
}: BlogArticlePageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = labels[lang];

  const allArticles = blogArticles[lang];
  const article = allArticles.find((a: any) => a.id === slug) || allArticles[0];
  const suggested = suggestedArticles[lang];
  const moreCards = moreArticlesCards[lang];
  const breakAfter = article.suggestedBreakAfter ?? 2;

  const bodyBefore = article.body.slice(0, breakAfter);
  const bodyAfter = article.body.slice(breakAfter);

  return (
    <>
      <PageHeroBanner title={article.title} />

      {/* Article Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto relative"
        >
          {/* Date badge + action icons */}
          <div className="flex items-start justify-between mb-[30px] md:mb-[40px]">
            {/* Date badge + read time (right side in RTL) */}
            <div className="flex items-end gap-4">
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
              <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                {article.readTime}
              </span>
            </div>

            {/* Bookmark + Share icons */}
            <div className="flex items-center gap-[8px]">
              <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#eee] transition-colors">
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  stroke="#0e314c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 17L7 13L1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H11C11.5304 1 12.0391 1.21071 12.4142 1.58579C12.7893 1.96086 13 2.46957 13 3V17Z" />
                </svg>
              </button>
              <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#eee] transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0e314c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          {/* Article Image */}
          <div className="relative aspect-[840/470] rounded-[25px] overflow-hidden mb-[40px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Body text - before suggested */}
          <div className="flex flex-col gap-[16px] mb-[40px]">
            {bodyBefore.map((p: string, i: number) => (
              <p
                key={i}
                className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.4] text-start"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Suggested Topics */}
          <div className="bg-[#f8f8f8] border border-[#cacceb] rounded-[25px] p-[20px] md:p-[24px] mb-[40px]">
            <h3 className="text-[#0e314c] text-[16px] md:text-[18px] font-bold leading-[21.6px] mb-[16px] text-end">
              {t.suggestedTopics}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {suggested.map((item: any, i: number) => (
                <Link
                  key={i}
                  href={`/blog/${item.slug}`}
                  className="bg-white rounded-[16px] p-[14px] flex items-center gap-[12px] hover:shadow-md transition-shadow"
                >
                  <p className="flex-1 text-[#6084a4] text-[13px] md:text-[14px] font-semibold leading-[21px] text-start">
                    {item.title}
                  </p>
                  <div className="relative w-[71px] h-[60px] rounded-[8px] overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Body text - after suggested */}
          <div className="flex flex-col gap-[16px]">
            {bodyAfter.map((p: string, i: number) => (
              <p
                key={i}
                className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.4] text-start"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* More Articles */}
      <section className="bg-white pb-[60px] md:pb-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <h2 className="text-[#0e314c] text-[32px] md:text-[40px] leading-[48px] text-center mb-[40px]">
            {t.moreArticles}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px]">
            {moreCards.map((card: any, i: number) => (
              <div key={i} className="flex flex-col">
                {/* Image */}
                <Link
                  href={`/blog/${card.slug}`}
                  className={`relative aspect-[421/300] overflow-hidden block ${
                    isAr
                      ? "rounded-tr-[125px] rounded-tl-[25px]"
                      : "rounded-tl-[125px] rounded-tr-[25px]"
                  }`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Content */}
                <div className="border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[30px] pt-[56px] px-[30px] text-start">
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
                            {card.day}
                          </span>
                        </div>
                        <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                          <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                            {card.month}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                      {card.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#0e314c] text-[20px] md:text-[24px] leading-[26px] md:leading-[28.8px] mb-[10px]">
                    {card.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-2">
                    {card.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    href={`/blog/${card.slug}`}
                    className="inline-flex items-center justify-center px-[36px] py-[15px] border border-[#12953d] rounded-[5px] text-[#0e314c] text-[14px] font-semibold leading-[21px] hover:bg-[#12953d] hover:text-white transition-all"
                  >
                    {t.readMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
