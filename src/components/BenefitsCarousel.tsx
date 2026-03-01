"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/context/LanguageContext";

interface BenefitsCarouselProps {
  carouselCards: any;
  carouselHeading: any;
  carouselBadge: any;
}

const GAP = 22;

export default function BenefitsCarousel({ carouselCards, carouselHeading, carouselBadge }: BenefitsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = carouselCards[lang];
  const h = carouselHeading[lang];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideOffset, setSlideOffset] = useState(0);
  const [maxIndex, setMaxIndex] = useState(items.length - 1);

  const measure = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const firstCard = trackRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const cardW = firstCard.offsetWidth;
    const containerW = containerRef.current.offsetWidth;
    const totalTrackW =
      items.length * cardW + (items.length - 1) * GAP;
    const maxScroll = totalTrackW - containerW;
    const newMaxIndex = Math.max(0, Math.ceil(maxScroll / (cardW + GAP)));

    setSlideOffset(cardW + GAP);
    setMaxIndex(newMaxIndex);
  }, [items.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Clamp active index when maxIndex changes
  useEffect(() => {
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [maxIndex, activeIndex]);

  // Reset to middle on language change
  useEffect(() => {
    setActiveIndex(1);
  }, [lang]);

  const offset = activeIndex * slideOffset;

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (isAr) {
      if (diff < -threshold && activeIndex < maxIndex)
        setActiveIndex((i) => i + 1);
      else if (diff > threshold && activeIndex > 0)
        setActiveIndex((i) => i - 1);
    } else {
      if (diff > threshold && activeIndex < maxIndex)
        setActiveIndex((i) => i + 1);
      else if (diff < -threshold && activeIndex > 0)
        setActiveIndex((i) => i - 1);
    }
  };

  return (
    <section className="min-h-screen-safe flex flex-col justify-center py-[24px] md:py-[80px] overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className={`mb-[16px] md:mb-[40px] text-center ${isAr ? "md:text-right" : "md:text-left"}`}>
          <SectionBadge label={carouselBadge.label} labelAr={carouselBadge.labelAr} />
          <h2 className="text-[18px] leading-[24px] md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px] text-[#0e314c] mt-[8px] md:mt-[10px]">
            <span className="font-bold">{h.bold}</span>
            {h.rest}
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            gap: `${GAP}px`,
            transform: isAr
              ? `translateX(${offset}px)`
              : `translateX(-${offset}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((card: any, i: number) => (
            <div
              key={i}
              className="bg-[#f8f8f8] rounded-[25px] p-[16px] md:p-[25px] shrink-0 flex flex-col
                w-full md:w-[calc(50%-11px)] lg:w-[calc((100%-44px)/3)] md:h-[calc(100dvh-320px)] md:max-h-[700px]"
            >
              <div className="aspect-[4/3] md:flex-1 md:aspect-auto rounded-[16px] overflow-hidden relative">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={`mt-[12px] md:mt-4 px-1 md:px-3 text-center ${isAr ? "md:text-right" : "md:text-left"}`}>
                <h3 className="text-[#0e314c] text-[15px] md:text-[16px] xl:text-[18px] font-bold leading-[1.3] mb-[4px] md:mb-[9px]">
                  {card.title}
                </h3>
                <p className="text-[#6084a4] text-[13px] md:text-[16px] xl:text-[18px] leading-[1.4]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-[16px] md:mt-[40px]">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === activeIndex ? "bg-[#12953d]" : "bg-[#cacceb]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
