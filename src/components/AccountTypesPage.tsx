"use client";

import { useState, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

interface AccountTypesPageProps {
  allPlans: any;
  planFeatures: any;
  accountTypesPageHeroTitle: any;
  accountTypesPageHeading: any;
}

export default function AccountTypesPage({
  allPlans,
  planFeatures,
  accountTypesPageHeroTitle,
  accountTypesPageHeading,
}: AccountTypesPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const planItems = allPlans[lang];
  const featureItems = planFeatures[lang];
  const h = accountTypesPageHeading[lang];

  // Carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const totalPages = Math.ceil(planItems.length / 3);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (isAr) {
      if (diff < -threshold && currentPage < totalPages - 1)
        setCurrentPage((p) => p + 1);
      else if (diff > threshold && currentPage > 0)
        setCurrentPage((p) => p - 1);
    } else {
      if (diff > threshold && currentPage < totalPages - 1)
        setCurrentPage((p) => p + 1);
      else if (diff < -threshold && currentPage > 0)
        setCurrentPage((p) => p - 1);
    }
  };

  const renderCard = (plan: (typeof planItems)[0]) => (
    <div
      className={`${plan.bg} rounded-[25px] border border-[#cacceb] p-[25px] md:p-[24px] xl:p-[28px] flex flex-col gap-[16px] ${
        isAr ? "text-right" : ""
      }`}
      style={
        plan.gradient
          ? {
              backgroundImage:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, rgba(255, 255, 255, 1) 60%)",
            }
          : undefined
      }
    >
      {/* Name */}
      <h3 className="text-[#0e314c] text-[24px] font-bold leading-[28.8px]">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="flex items-end gap-0 mb-[4px]">
        {isAr ? (
          <>
            <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
              {plan.period}
            </span>
            <span className="text-[#0e314c] font-bold mx-1 text-[48px] md:text-[52px] xl:text-[60px] leading-[1]">
              {plan.price}
            </span>
            <span className="text-[#6084a4] text-[14px] xl:text-[16px] leading-[14px] pb-[5px]">
              {"\u0627\u0628\u062a\u062f\u0627 \u0645\u0646"}
            </span>
          </>
        ) : (
          <>
            <span className="text-[#0e314c] font-bold text-[48px] md:text-[52px] xl:text-[60px] leading-[1]">
              {plan.price}
            </span>
            <span className="text-[#6084a4] text-[14px] leading-[14px] pb-[5px]">
              /{plan.period}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-[#6084a4] text-[14px] xl:text-[15px] leading-[1.4]">
        {plan.description}
      </p>

      {/* Features */}
      <div className="flex flex-col gap-[6px]">
        <h4 className="text-[#0e314c] text-[16px] font-bold leading-[1.4] mb-[4px]">
          {plan.featuresLabel}
        </h4>
        {(plan.benefits?.length > 0 ? plan.benefits : featureItems).map((feature: string, j: number) => (
          <div key={j} className="flex items-center gap-[10px]">
            <div className="w-[22px] h-[22px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
            <span className="text-[#6084a4] text-[14px] xl:text-[15px] leading-[20px]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={isAr ? "text-right" : ""}>
        <a
          href={plan.ctaUrl || "/register"}
          className="cta-gradient inline-block rounded-[12px] px-[36px] py-[14px] text-[14px] font-semibold leading-[21px] hover:opacity-90 transition-opacity"
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );

  return (
    <>
      <PageHeroBanner
        title={accountTypesPageHeroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: accountTypesPageHeroTitle[lang] },
        ]}
      />

      {/* Account Cards */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-7xl mx-auto px-6"
        >
          {/* Heading */}
          <div className="text-center mb-[32px] md:mb-[40px]">
            <h2 className="text-[#0e314c] text-[25px] md:text-[40px] xl:text-[48px] leading-[1.3] whitespace-pre-line">
              {h.before}
              <span className="font-bold">{h.bold}</span>
            </h2>
          </div>

          {/* Mobile: single card carousel */}
          <div
            className="md:hidden overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: isAr
                  ? `translateX(${currentPage * 100}%)`
                  : `translateX(-${currentPage * 100}%)`,
              }}
            >
              {planItems.map((plan: any, i: number) => (
                <div key={i} className="w-full shrink-0 px-2">
                  {renderCard(plan)}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: scrollable row with overflow peek */}
          <div className="hidden md:block overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-[20px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: isAr
                  ? `translateX(${currentPage * 33.33}%)`
                  : `translateX(-${currentPage * 33.33}%)`,
              }}
            >
              {planItems.map((plan: any, i: number) => (
                <div key={i} className="w-[calc(33.33%-14px)] shrink-0">
                  {renderCard(plan)}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-[8px] mt-[24px]">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-[12px] h-[12px] rounded-full transition-colors cursor-pointer ${
                  i === currentPage ? "bg-site-gradient" : "bg-[#cacceb]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
