"use client";

import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/context/LanguageContext";

const cards = {
  en: [
    {
      image: "/images/carousel-1.jpg",
      title: "Sharia-compliant investment",
      description:
        "We provide you with investment opportunities that comply with the provisions of Islamic Sharia, so that you can invest with confidence and ease through the application, with complete ease and peace of mind.",
    },
    {
      image: "/images/carousel-2.jpg",
      title: "Daily trading recommendations",
      description:
        "Receive the best recommendations and guidance for buying and selling directly via WhatsApp or email – to achieve maximum profits with confidence and professionalism.",
    },
    {
      image: "/images/carousel-3.jpg",
      title: "A financial expert will personally accompany you",
      description:
        "Get daily support from a dedicated trading expert – consultations, guidance, and step-by-step education to begin your trading journey.",
    },
  ],
  ar: [
    {
      image: "/images/carousel-1.jpg",
      title: "استثمار متوافق مع الشريعة",
      description:
        "نقدم لك فرص استثمار تتوافق مع أحكام الشريعة الإسلامية، حتى تتمكن من الاستثمار بثقة وسهولة من خلال التطبيق، مع راحة البال التامة.",
    },
    {
      image: "/images/carousel-2.jpg",
      title: "توصيات تداول يومية",
      description:
        "احصل على أفضل التوصيات والإرشادات للشراء والبيع مباشرة عبر واتساب أو البريد الإلكتروني – لتحقيق أقصى قدر من الأرباح بثقة واحترافية.",
    },
    {
      image: "/images/carousel-3.jpg",
      title: "سيكون خبير مالي مخصص برفقتك شخصياً",
      description:
        "احصل على دعم يومي من خبير تداول مخصص – استشارات، إرشادات، وتعليم خطوة بخطوة لبدء رحلتك في التداول.",
    },
  ],
};

const heading = {
  en: {
    bold: "Experience confident,",
    rest: " Sharia-compliant investing with a trusted Saudi platform. Trade securely, get expert guidance, and grow your investments with peace of mind.",
  },
  ar: {
    bold: "اختبر الاستثمار بثقة",
    rest: " وفقًا للشريعة مع منصة سعودية موثوقة. تداول بأمان، واحصل على إرشادات الخبراء، وزد استثماراتك براحة بال.",
  },
};

const GAP = 22;

export default function BenefitsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = cards[lang];
  const h = heading[lang];

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

  // Reset to 0 on language change
  useEffect(() => {
    setActiveIndex(0);
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
    <section className="py-[80px] overflow-hidden">
      {/* Header — stays inside max-width container */}
      <div className="max-w-[1335px] mx-auto px-[52px]">
        <div className={`mb-[40px] ${isAr ? "text-right" : ""}`}>
          <SectionBadge label="Benefits" labelAr="الفوائد" />
          <h2 className="text-[40px] leading-[48px] text-[#0e314c] mt-[10px]">
            <span className="font-bold">{h.bold}</span>
            {h.rest}
          </h2>
        </div>
      </div>

      {/* Carousel — full container width, cards fill edge to edge */}
      <div ref={containerRef} className="max-w-[1535px] mx-auto px-[52px]">
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
          {items.map((card, i) => (
            <div
              key={i}
              className="bg-[#f8f8f8] rounded-[25px] p-[25px] shrink-0 flex flex-col
                w-full md:w-[calc(50%-11px)] lg:w-[calc((100%-44px)/3)] h-[630px]"
            >
              <div className="flex-1 rounded-[16px] overflow-hidden relative min-h-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={`mt-4 px-3 ${isAr ? "text-right" : ""}`}>
                <h3 className="text-[#0e314c] text-[16px] font-bold leading-[1.4] mb-[9px]">
                  {card.title}
                </h3>
                <p className="text-[#6084a4] text-[16px] leading-[1.4]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots — hidden when all cards fit (nothing to slide) */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-[40px]">
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
