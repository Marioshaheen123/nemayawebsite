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
    <section className="min-h-screen-safe flex items-center py-[60px] px-4 md:py-[80px] md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
      <div className="w-full max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label={homepageFaqBadge.label} labelAr={homepageFaqBadge.labelAr} />
          <h2 className="section-heading-mobile text-[25px] leading-[32.5px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] text-[#0e314c] mt-[10px] max-w-[664px] xl:max-w-[750px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* FAQ Grid */}
        <div
          className="p-4 md:p-[30px] xl:p-[40px] rounded-[25px]"
          style={{
            backgroundImage:
              "linear-gradient(181deg, rgba(18, 149, 61, 0) 38%, rgb(248, 248, 248) 80%)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      className={`bg-white border rounded-[25px] p-[25px] transition-all ${
        isOpen ? "border-[#12953d]" : "border-[#cacceb]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 text-left rtl:text-right"
      >
        <span className="flex-1 text-[#0e314c] text-[20px] xl:text-[24px] font-semibold leading-[24px] xl:leading-[28px]">
          {question}
        </span>
        <div
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen ? "bg-[#0e314c] rotate-45" : "bg-[#12953d] rotate-0"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
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
