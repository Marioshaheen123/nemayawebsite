"use client";

import SectionBadge from "./SectionBadge";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const faqs = {
  en: [
    {
      question: "Can I start with a small amount?",
      answer:
        "Yes, you can start investing with a small amount. Our Mini Account is designed for individuals who want to begin their trading journey with a minimal initial deposit.",
    },
    {
      question: "Who will follow me after I open the wallet?",
      answer:
        "You will have a financial expert who will follow up with you personally on a daily basis, give you recommendations, explain the steps to you, and help you build a plan that suits you.",
    },
    {
      question: "Are my profits guaranteed?",
      answer:
        "While we provide expert guidance and market analysis, profits in trading are not guaranteed. However, our team works closely with you to maximize your potential returns through informed decision-making.",
    },
    {
      question: "How much can I earn per month?",
      answer:
        "Earnings vary based on market conditions, investment amount, and strategy. Our experts will help you set realistic expectations and work toward your financial goals.",
    },
    {
      question: "Is the company licensed and trustworthy?",
      answer:
        "Yes, Namaya is a fully licensed and regulated financial company operating in Saudi Arabia and the Gulf region with over 10 years of experience in global markets.",
    },
    {
      question: "What is the difference between you and the other platforms?",
      answer:
        "Namaya offers Sharia-compliant investment options, dedicated personal financial advisors, daily trading recommendations, and local customer support centers in Saudi Arabia and Dubai.",
    },
  ],
  ar: [
    {
      question: "هل يمكنني البدء بمبلغ صغير؟",
      answer:
        "نعم، يمكنك البدء بالاستثمار بمبلغ صغير. حسابنا المصغر مصمم للأفراد الذين يرغبون في بدء رحلتهم في التداول بإيداع أولي بسيط.",
    },
    {
      question: "من سيتابعني بعد فتح المحفظة؟",
      answer:
        "سيكون لديك خبير مالي يتابع معك شخصياً بشكل يومي، يعطيك توصيات، يشرح لك الخطوات، ويساعدك في بناء خطة تناسبك.",
    },
    {
      question: "هل أرباحي مضمونة؟",
      answer:
        "بينما نقدم إرشادات الخبراء وتحليل السوق، فإن الأرباح في التداول ليست مضمونة. ومع ذلك، يعمل فريقنا معك عن كثب لتعظيم عوائدك المحتملة من خلال اتخاذ قرارات مدروسة.",
    },
    {
      question: "كم يمكنني أن أربح شهرياً؟",
      answer:
        "تختلف الأرباح بناءً على ظروف السوق ومبلغ الاستثمار والاستراتيجية. سيساعدك خبراؤنا في وضع توقعات واقعية والعمل نحو أهدافك المالية.",
    },
    {
      question: "هل الشركة مرخصة وموثوقة؟",
      answer:
        "نعم، نمايا شركة مالية مرخصة ومنظمة بالكامل تعمل في المملكة العربية السعودية ومنطقة الخليج مع أكثر من 10 سنوات من الخبرة في الأسواق العالمية.",
    },
    {
      question: "ما الفرق بينكم وبين المنصات الأخرى؟",
      answer:
        "تقدم نمايا خيارات استثمار متوافقة مع الشريعة، ومستشارين ماليين شخصيين مخصصين، وتوصيات تداول يومية، ومراكز دعم عملاء محلية في السعودية ودبي.",
    },
  ],
};

const heading = {
  en: {
    before: "Want to get started, but have ",
    bold: "a few questions?",
  },
  ar: {
    before: "هل ترغب في البدء، ولكن لديك ",
    bold: "بعض الأسئلة؟",
  },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);
  const { lang } = useLang();
  const isAr = lang === "ar";
  const faqItems = faqs[lang];

  const leftFaqs = faqItems.slice(0, 3);
  const rightFaqs = faqItems.slice(3, 6);
  const h = heading[lang];

  return (
    <section className="py-[60px] px-4 md:py-[80px] md:px-[52px]">
      <div className="max-w-[1335px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[40px]">
          <SectionBadge label="FAQ" labelAr="الأسئلة الشائعة" />
          <h2 className="text-[25px] leading-[32.5px] md:text-[40px] md:leading-[48px] text-[#0e314c] mt-[10px] max-w-[664px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* FAQ Grid */}
        <div
          className="p-4 md:p-[30px] rounded-[25px]"
          style={{
            backgroundImage:
              "linear-gradient(181deg, rgba(18, 149, 61, 0) 38%, rgb(248, 248, 248) 80%)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {leftFaqs.map((faq, i) => (
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
              {rightFaqs.map((faq, i) => (
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
        <span className="flex-1 text-[#0e314c] text-[20px] font-semibold leading-[24px]">
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
          <p className="text-[#6084a4] text-[16px] leading-[1.4]">{answer}</p>
        </div>
      )}
    </div>
  );
}
