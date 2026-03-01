"use client";

import SectionBadge from "./SectionBadge";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

interface FAQProps {
  homepageFaqItems: any;
  homepageFaqHeading: any;
  homepageFaqBadge: any;
}

export default function FAQ({ homepageFaqItems, homepageFaqHeading, homepageFaqBadge }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(1);
  const { lang } = useLang();
  const isAr = lang === "ar";
  const faqItems = homepageFaqItems[lang];

  const leftFaqs = faqItems.slice(0, 3);
  const rightFaqs = faqItems.slice(3, 6);
  const h = homepageFaqHeading[lang];

  return (
    <section className="min-h-screen-safe flex items-center py-[60px] px-4 md:py-[80px]">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label={homepageFaqBadge.label} labelAr={homepageFaqBadge.labelAr} />
          <h2 className="section-heading-mobile text-[25px] leading-[32.5px] md:text-[32px] md:leading-[40px] xl:text-[40px] xl:leading-[48px] text-[#0e314c] mt-[10px] max-w-[600px] xl:max-w-[680px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* FAQ Grid */}
        <div
          className="p-4 md:p-[24px] xl:p-[32px] rounded-[22px]"
          style={{
            backgroundImage:
              "linear-gradient(181deg, rgba(18, 149, 61, 0) 38%, rgb(248, 248, 248) 80%)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {leftFaqs.map((faq: any, i: number) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  isAr={isAr}
                />
              ))}
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-6">
              {rightFaqs.map((faq: any, i: number) => (
                <FAQItem
                  key={i + 3}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i + 3}
                  onClick={() =>
                    setOpenIndex(openIndex === i + 3 ? -1 : i + 3)
                  }
                  isAr={isAr}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  isAr,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  isAr: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-[20px] md:rounded-[22px] p-[25px] md:p-[20px] xl:p-[24px] transition-all ${
        isOpen ? "border-[#12953d]" : "border-[#cacceb]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 text-left rtl:text-right"
      >
        <span className="flex-1 text-[#0e314c] text-[20px] md:text-[16px] xl:text-[18px] font-semibold leading-[24px] md:leading-[22px] xl:leading-[24px]">
          {question}
        </span>
        <div
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen ? "bg-[#0e314c] rotate-180" : "bg-[#12953d] rotate-0"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="mt-[9px]">
          <p className="text-[#6084a4] text-[16px] xl:text-[18px] leading-[1.4]">{answer}</p>
        </div>
      )}
    </div>
  );
}
