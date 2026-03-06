"use client";

import Link from "next/link";

import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

interface PricingProps {
  pricingSectionHeading: any;

  pricingViewAllLabel: any;
  plans: any;
  features: any;
}

// Rotation classes with md: prefix so they only apply on desktop
const rotationClasses = ["md:rotate-2", "", "md:-rotate-2"];

export default function Pricing({ pricingSectionHeading, pricingViewAllLabel, plans, features }: PricingProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const planItems = plans[lang];
  const featureItems = features[lang];
  const h = pricingSectionHeading[lang];

  // Mobile carousel state
  const [mobileSlide, setMobileSlide] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (isAr) {
      if (diff < -threshold && mobileSlide < planItems.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff > threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    } else {
      if (diff > threshold && mobileSlide < planItems.length - 1)
        setMobileSlide((s) => s + 1);
      else if (diff < -threshold && mobileSlide > 0)
        setMobileSlide((s) => s - 1);
    }
  };

  const renderCard = (
    plan: (typeof planItems)[0],
    i: number,
    isMobile: boolean
  ) => (
    <div
      className={`${isMobile ? "" : rotationClasses[i]} ${plan.bg} rounded-[20px] md:rounded-[22px] border border-[#cacceb] p-[25px] md:p-[18px] xl:p-[24px] flex flex-col gap-[14px] md:gap-[10px] xl:gap-[14px] ${
        isAr ? "text-right" : ""
      } ${plan.gradient ? "md:py-[24px] xl:py-[32px]" : ""}`}
      style={
        plan.gradient
          ? {
              backgroundImage:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, rgba(255, 255, 255, 1) 60%)",
            }
          : undefined
      }
    >
      {/* Price section */}
      <div className={isMobile ? "" : "h-[140px] xl:h-[155px]"}>
        <h3 className="text-[#0e314c] text-[20px] md:text-[18px] xl:text-[20px] font-bold leading-[26px] md:leading-[24px] xl:leading-[26px] mb-[8px] md:mb-[6px]">
          {plan.name}
        </h3>
        <div className="flex items-end gap-0 mb-[8px] md:mb-[6px]">
          {isAr ? (
            <>
              <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                {plan.period}
              </span>
              <span
                className={`text-[#0e314c] font-bold mx-1 ${
                  isMobile
                    ? "text-[40px] leading-[48px]"
                    : "text-[40px] leading-[40px] xl:text-[48px] xl:leading-[48px]"
                }`}
              >
                {plan.price}
              </span>
              <span className="text-[#6084a4] text-[14px] xl:text-[16px] leading-[14px] pb-[5px]">
                ابتدا من
              </span>
            </>
          ) : (
            <>
              <span
                className={`text-[#0e314c] font-bold ${
                  isMobile
                    ? "text-[40px] leading-[48px]"
                    : "text-[40px] leading-[40px] xl:text-[48px] xl:leading-[48px]"
                }`}
              >
                {plan.price}
              </span>
              <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
                /{plan.period}
              </span>
            </>
          )}
        </div>
        <p className="text-[#6084a4] text-[14px] md:text-[12px] xl:text-[13px] leading-[1.4]">
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-[5px] md:gap-[3px] xl:gap-[5px]">
        <h4 className="text-[#0e314c] text-[16px] md:text-[13px] xl:text-[14px] font-bold leading-[1.4] mb-[4px]">
          {plan.featuresLabel}
        </h4>
        {(plan.benefits?.length > 0 ? plan.benefits : featureItems).map((feature: any, j: number) => (
          <div key={j} className="flex items-center gap-[8px]">
            <div className="w-[22px] h-[22px] md:w-[16px] md:h-[16px] xl:w-[18px] xl:h-[18px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[#6084a4] text-[14px] md:text-[12px] xl:text-[13px] leading-[18px]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={isAr ? "text-right" : ""}>
        <Link
          href={plan.ctaUrl || "/register"}
          className={`cta-gradient inline-block rounded-[12px] px-[36px] py-[12px] md:px-[28px] md:py-[9px] xl:py-[12px] text-[14px] md:text-[12px] xl:text-[13px] font-semibold leading-[21px] hover:opacity-90 transition-opacity ${
            isMobile ? "w-full text-center" : "w-fit"
          }`}
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen-safe flex items-center py-[60px] px-4 md:py-[50px]">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[24px] md:mb-[20px] xl:mb-[28px]">
          <h2 className="section-heading-mobile text-[25px] leading-[32.5px] md:text-[32px] md:leading-[40px] xl:text-[40px] xl:leading-[48px] text-[#0e314c] mt-[10px] max-w-[600px] xl:max-w-[680px] mx-auto">
            {h.before}
            <span className="font-bold">{h.bold}</span>
          </h2>
        </div>

        {/* Mobile carousel */}
        <div
          className="md:hidden overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: isAr
                ? `translateX(${mobileSlide * 100}%)`
                : `translateX(-${mobileSlide * 100}%)`,
            }}
          >
            {planItems.map((plan: any, i: number) => (
              <div key={i} className="w-full shrink-0 px-2">
                {renderCard(plan, i, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-0 items-center">
          {planItems.map((plan: any, i: number) => (
            <div key={i} className="px-3 pb-4">
              {renderCard(plan, i, false)}
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden justify-center gap-2 mt-3">
          {planItems.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setMobileSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === mobileSlide ? "bg-site-gradient" : "bg-[#cacceb]"
              }`}
            />
          ))}
        </div>

        {/* View All Account Types */}
        <div className="flex justify-center mt-[32px] md:mt-[48px]">
          <Link
            href="/account-types"
            className="cta-gradient rounded-full px-[28px] py-[12px] text-white text-[14px] font-semibold inline-flex items-center gap-2"
          >
            {pricingViewAllLabel[lang]}
            <span className="text-[16px]">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
