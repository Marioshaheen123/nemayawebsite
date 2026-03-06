"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import RichContent from "@/components/RichContent";

const labels = {
  en: {
    suggestedTopics: "Suggested topics for you",
    moreArticles: "More Articles",
    readMore: "Read More",
    backToList: "Back to Economic Developments",
  },
  ar: {
    suggestedTopics: "مواضيع مقترحة لك",
    moreArticles: "مقالات أكثر",
    readMore: "اقرأ المزيد",
    backToList: "العودة إلى التطورات الاقتصادية",
  },
};

interface EconomicDevelopmentArticlePageProps {
  slug: string;
  articles: any;
  suggested: any;
}

export default function EconomicDevelopmentArticlePage({
  slug,
  articles,
  suggested,
}: EconomicDevelopmentArticlePageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = labels[lang];

  const allArticles = articles[lang];
  const article = allArticles.find((a: any) => a.id === slug) || allArticles[0];
  const suggestedItems = suggested[lang];

  if (!article) {
    return (
      <section className="bg-white py-[80px]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#6084a4] text-[16px]">Article not found.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeroBanner
        title={article.title}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: isAr ? "التطورات الاقتصادية" : "Economic Developments", href: "/economic-developments" },
          { label: article.title },
        ]}
      />

      {/* Article Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div className="max-w-7xl mx-auto px-6">
          <div
            dir={isAr ? "rtl" : undefined}
            className={`flex gap-[40px] ${isAr ? "flex-row-reverse" : ""}`}
          >
            {/* Main Content */}
            <div className="flex-[2] min-w-0">
              {/* Date badge + read time */}
              <div className="flex items-end gap-4 mb-[30px]">
                <div className="bg-site-gradient rounded-[15px] overflow-hidden w-[94px]">
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

              {/* Article Image */}
              <div className="relative aspect-[16/9] rounded-[20px] overflow-hidden mb-[30px]">
                <Image
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Tags */}
              {article.tags && (
                <div className={`flex flex-wrap gap-2 mb-[20px] ${isAr ? "justify-end" : ""}`}>
                  {article.tags.split(",").map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#f0fdf4] text-primary text-[12px] font-medium rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Body */}
              <div className="mb-[40px]">
                <RichContent
                  html={article.body}
                  dir={isAr ? "rtl" : "ltr"}
                  className={`text-[#6084a4] text-[16px] leading-[28px] [&_p]:mb-5 ${isAr ? "text-right" : ""}`}
                />
              </div>

              {/* Back Link */}
              <Link
                href="/economic-developments"
                className="cta-gradient group/btn inline-flex items-center gap-[10px] px-[28px] py-[12px] rounded-full text-white text-[14px] font-semibold hover:shadow-lg"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`group-hover/btn:-translate-x-1 transition-transform duration-300 ${
                    isAr ? "" : "rotate-180"
                  }`}
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
                {t.backToList}
              </Link>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block flex-[1] min-w-0">
              <div className="bg-[#f8f9fa] rounded-[20px] p-[24px] sticky top-[100px]">
                <h3
                  className={`text-[#0e314c] text-[20px] font-semibold mb-[20px] ${
                    isAr ? "text-right" : ""
                  }`}
                >
                  {t.suggestedTopics}
                </h3>
                <div className="space-y-[16px]">
                  {suggestedItems.map((item: any, i: number) => (
                    <Link
                      key={i}
                      href={`/economic-developments/${item.slug}`}
                      className={`flex items-center gap-[12px] group ${
                        isAr ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="relative w-[60px] h-[60px] rounded-[10px] overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p
                        className={`text-[#0e314c] text-[14px] leading-[20px] font-medium group-hover:text-primary transition-colors line-clamp-2 flex-1 ${
                          isAr ? "text-right" : ""
                        }`}
                      >
                        {item.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* More Articles from list */}
              <div className="mt-[30px]">
                <h3
                  className={`text-[#0e314c] text-[20px] font-semibold mb-[20px] ${
                    isAr ? "text-right" : ""
                  }`}
                >
                  {t.moreArticles}
                </h3>
                <div className="space-y-[16px]">
                  {allArticles
                    .filter((a: any) => a.id !== slug)
                    .slice(0, 3)
                    .map((item: any, i: number) => (
                      <Link
                        key={i}
                        href={`/economic-developments/${item.id}`}
                        className={`flex items-center gap-[12px] group ${
                          isAr ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="relative w-[80px] h-[60px] rounded-[10px] overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[#0e314c] text-[14px] leading-[20px] font-medium group-hover:text-primary transition-colors line-clamp-2 ${
                              isAr ? "text-right" : ""
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[#6084a4] text-[12px]">
                            {item.day} {item.month}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
