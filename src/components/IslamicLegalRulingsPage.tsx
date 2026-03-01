"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import type { Bilingual, RulingSection } from "@/data/types";

interface IslamicLegalRulingsPageProps {
  heroTitle: Bilingual<string>;
  sectionLabels: Bilingual<{ question: string; answer: string; mufti: string }>;
  rulingsData: Bilingual<RulingSection[]>;
}

export default function IslamicLegalRulingsPage({
  heroTitle,
  sectionLabels,
  rulingsData,
}: IslamicLegalRulingsPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const sections = rulingsData[lang];
  const labels = sectionLabels[lang];

  const [openItems, setOpenItems] = useState<Record<string, number | null>>({
    "0": 1,
  });

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    const key = String(sectionIdx);
    setOpenItems((prev) => ({
      ...prev,
      [key]: prev[key] === itemIdx ? null : itemIdx,
    }));
  };

  return (
    <>
      <PageHeroBanner title={heroTitle[lang]} />

      {/* Rulings Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto flex flex-col gap-[40px]"
        >
          {sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-[#f9f9f9] rounded-[25px] p-[20px] md:p-[30px]"
            >
              {/* Section Title */}
              <h2 className="text-[#0e314c] text-[24px] md:text-[35px] font-bold leading-[38.5px] text-start mb-[24px]">
                {section.name}
              </h2>

              {/* Accordion Items */}
              <div className="flex flex-col gap-[24px]">
                {section.items.map((item, iIdx) => {
                  const isOpen = openItems[String(sIdx)] === iIdx;
                  return (
                    <div
                      key={iIdx}
                      className={`bg-white rounded-[25px] border transition-colors ${
                        isOpen
                          ? "border-[#12953d]"
                          : "border-[#cacceb]"
                      }`}
                    >
                      {/* Header */}
                      <button
                        onClick={() => toggleItem(sIdx, iIdx)}
                        className="w-full flex items-center gap-[16px] p-[20px] md:p-[25px] cursor-pointer"
                      >
                        {/* Chevron Circle */}
                        <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full bg-[#12953d] flex items-center justify-center shrink-0">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 6"
                            fill="none"
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="M1 1L6 5L11 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {/* Title */}
                        <span className="flex-1 text-[#0e314c] text-[16px] md:text-[20px] font-semibold leading-[24px] text-start">
                          {item.title}
                        </span>
                      </button>

                      {/* Expanded Content */}
                      {isOpen && (
                        <div className="px-[20px] md:px-[25px] pb-[20px] md:pb-[25px] flex flex-col gap-[16px]">
                          {/* Question */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.question}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[28px]">
                              {item.question}
                            </p>
                          </div>

                          {/* Answer */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.answer}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.4] whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>

                          {/* Mufti */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.mufti}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.4]">
                              {item.mufti}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
