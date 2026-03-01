"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

interface FaqPageProps {
  faqCategories: any;
  faqPageHeroTitle: any;
  faqPageIntroText: any;
}

export default function FaqPage({
  faqCategories,
  faqPageHeroTitle,
  faqPageIntroText,
}: FaqPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const categories = faqCategories[lang];
  const intro = faqPageIntroText[lang];

  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(1); // 2nd question open by default

  const currentCategory = categories[activeCategory];

  return (
    <>
      <PageHeroBanner title={faqPageHeroTitle[lang]} />

      {/* Intro */}
      <section className="bg-white pt-[40px] md:pt-[50px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[40px]">
            <p className="text-[#12953d] text-[14px] md:text-[15px] leading-[1.5]">
              {intro.left}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.5]">
              {intro.right}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col md:flex-row gap-[30px] md:gap-[40px]">
            {/* Sidebar Categories */}
            <div className="md:w-[260px] shrink-0">
              <div className="flex flex-row md:flex-col gap-[8px] overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {categories.map((cat: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCategory(i);
                      setOpenQuestion(null);
                    }}
                    className={`px-[24px] py-[14px] rounded-[10px] text-[14px] md:text-[15px] font-medium whitespace-nowrap md:whitespace-normal text-start transition-all cursor-pointer ${
                      activeCategory === i
                        ? "bg-[#12953d] text-white"
                        : "bg-[#f9f9f9] text-[#0e314c] border border-[#e5e7eb] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="flex-1">
              {/* Category Title */}
              <h2 className="text-[#0e314c] text-[24px] md:text-[28px] font-bold leading-[1.3] mb-[24px]">
                {currentCategory.name}
              </h2>

              {/* Accordion */}
              <div className="flex flex-col gap-[16px]">
                {currentCategory.questions.map((item: any, i: number) => {
                  const isOpen = openQuestion === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-[12px] border transition-colors ${
                        isOpen
                          ? "border-[#12953d] bg-[rgba(18,149,61,0.03)]"
                          : "border-[#e5e7eb] bg-white"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setOpenQuestion(isOpen ? null : i)
                        }
                        className="w-full flex items-center justify-between px-[24px] py-[18px] cursor-pointer"
                      >
                        <span className="text-[#0e314c] text-[16px] md:text-[18px] font-semibold leading-[1.4] text-start">
                          {item.question}
                        </span>
                        <div
                          className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? "bg-[#12953d]"
                              : "bg-[#12953d]"
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-[24px] pb-[20px]">
                          <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6] whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
