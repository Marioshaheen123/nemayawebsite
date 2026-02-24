"use client";

import SectionBadge from "./SectionBadge";
import { useLang } from "@/context/LanguageContext";

const features = {
  en: [
    "Daily market analysis",
    "24/7 customer support",
    "Personal trading advisor",
    "Daily recommendations",
    "Instant trading alerts",
    "Low spread advantage",
    "VIP support",
  ],
  ar: [
    "تحليل السوق اليومي",
    "دعم العملاء على مدار الساعة طوال أيام الأسبوع",
    "مستشار تداول شخصي",
    "توصيات يومية",
    "تنبيهات تداول فورية",
    "ميزة الفارق المنخفض",
    "دعم VIP",
  ],
};

const plans = {
  en: [
    {
      name: "Mini Account",
      price: "$29",
      period: "month",
      description:
        "Best for individuals and small businesses looking to get started",
      cta: "Get Started",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      rotate: "rotate-2",
      bg: "bg-white",
    },
    {
      name: "Standard Account",
      price: "$79",
      period: "month",
      description:
        "Perfect for growing businesses needing more features and support",
      cta: "Start Free Trial",
      featuresLabel: "Features",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      rotate: "",
      bg: "",
      gradient: true,
    },
    {
      name: "Gold Account",
      price: "$99",
      period: "month",
      description:
        "Ideal for large enterprises that require custom solutions and dedicated support",
      cta: "Contact Us",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      rotate: "-rotate-2",
      bg: "bg-white",
    },
  ],
  ar: [
    {
      name: "حساب مصغر",
      price: "3,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      rotate: "rotate-2",
      bg: "bg-white",
    },
    {
      name: "حساب قياسي",
      price: "18,750",
      period: "ر.س",
      description:
        "مثالي للأعمال المتنامية التي تحتاج إلى المزيد من الميزات والدعم",
      cta: "ابدأ تجربة مجانية",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      rotate: "",
      bg: "",
      gradient: true,
    },
    {
      name: "حساب الذهب",
      price: "37,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      rotate: "-rotate-2",
      bg: "bg-white",
    },
  ],
};

const heading = {
  en: {
    before: "Choose the account that suits your ",
    bold: "budget and goals",
  },
  ar: {
    before: "اختر الحساب الذي يناسب ",
    bold: "ميزانيتك وأهدافك",
  },
};

export default function Pricing() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const planItems = plans[lang];
  const featureItems = features[lang];
  const h = heading[lang];

  return (
    <section className="py-[120px] px-[52px]">
      <div className="max-w-[1335px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[40px]">
          <SectionBadge label="PRICING PLANS" labelAr="خطط الأسعار" />
          <h2 className="text-[40px] leading-[48px] text-[#0e314c] mt-[10px] max-w-[664px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-center">
          {planItems.map((plan, i) => (
            <div key={i} className="px-3 pb-8">
              <div
                className={`${plan.rotate} ${plan.bg} rounded-[25px] border border-[#cacceb] p-[30px] flex flex-col gap-[25px] ${
                  isAr ? "text-right" : ""
                } ${plan.gradient ? "py-[45px]" : ""}`}
                style={
                  plan.gradient
                    ? {
                        backgroundImage:
                          "linear-gradient(180deg, rgba(18, 149, 61, 0.08) 0%, rgba(255, 255, 255, 1) 60%)",
                      }
                    : undefined
                }
              >
                {/* Price section */}
                <div className="h-[191px]">
                  <h3 className="text-[#0e314c] text-[24px] font-bold leading-[28.8px] mb-[15px]">
                    {plan.name}
                  </h3>
                  <div
                    className="flex items-end gap-0 mb-[15px]"
                  >
                    {isAr ? (
                      <>
                        <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                          {plan.period}
                        </span>
                        <span className="text-[#0e314c] text-[80px] font-bold leading-[80px] mx-1">
                          {plan.price}
                        </span>
                        <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                          ابتدا من
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#0e314c] text-[80px] font-bold leading-[80px]">
                          {plan.price}
                        </span>
                        <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                          /{plan.period}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[#6084a4] text-[16px] leading-[1.4]">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-[9px]">
                  <h4 className="text-[#0e314c] text-[16px] font-bold leading-[1.4] mb-[9px]">
                    {plan.featuresLabel}
                  </h4>
                  {featureItems.map((feature, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-[10px]"
                    >
                      <div className="w-[22px] h-[22px] rounded-full bg-[rgba(18,149,61,0.1)] flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#12953d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-[#6084a4] text-[16px] leading-[24px]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={isAr ? "text-right" : ""}>
                  <a
                    href="#"
                    className={`inline-block border rounded-[5px] px-[36px] py-[18px] text-[14px] font-semibold leading-[21px] hover:opacity-90 transition-opacity w-fit ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === 0 ? "bg-[#12953d]" : "bg-[#cacceb]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
