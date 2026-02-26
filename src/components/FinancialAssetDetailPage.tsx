"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual, FinancialAssetDetail } from "@/data/types";

interface FinancialAssetDetailPageProps {
  slug: string;
  asset: Bilingual<FinancialAssetDetail | null>;
  backLabel: Bilingual<string>;
  ctaSection: Bilingual<{ title: string; desc: string; btn: string }>;
  tableHeaders: Bilingual<{
    instrument: string;
    symbol: string;
    spread: string;
    leverage: string;
    hours: string;
  }>;
  sectionTitles: Bilingual<{
    instruments: string;
    whatIs: string;
    whyTrade: string;
    howToStart: string;
    faq: string;
  }>;
  howToStartSteps: Bilingual<{ step: string; title: string; desc: string }[]>;
}

export default function FinancialAssetDetailPage({
  slug,
  asset: assetBilingual,
  backLabel,
  ctaSection,
  tableHeaders,
  sectionTitles,
  howToStartSteps,
}: FinancialAssetDetailPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const asset = assetBilingual[lang];
  const cta = ctaSection[lang];
  const headers = tableHeaders[lang];
  const titles = sectionTitles[lang];
  const steps = howToStartSteps[lang];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!asset) {
    return (
      <section className="py-[200px] text-center">
        <h1 className="text-[#0e314c] text-[28px] font-bold mb-[16px]">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
        </h1>
        <Link
          href="/financial-assets"
          className="text-[#12953d] text-[16px] font-semibold hover:underline"
        >
          {backLabel[lang]}
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/blog-hero-bg.png" alt="" fill className="object-cover opacity-80" />
        </div>
        <div
          dir={isAr ? "rtl" : undefined}
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[50px]"
        >
          <Link
            href="/financial-assets"
            className="inline-flex items-center gap-[8px] text-[#b0f127] text-[14px] md:text-[15px] font-medium mb-[20px] hover:underline"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={isAr ? "" : "rotate-180"}
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
            {backLabel[lang]}
          </Link>
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3]">
            {asset.headline}
          </h1>
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] max-w-[680px] mt-[16px]">
            {asset.description}
          </p>
        </div>
      </section>

      {/* Instrument Table */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[30px] md:mb-[40px]">
            {titles.instruments}
          </h2>
          <div className="overflow-x-auto rounded-[20px] border border-[#cacceb]">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#0e314c]">
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.instrument}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.symbol}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.spread}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.leverage}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.hours}</th>
                </tr>
              </thead>
              <tbody>
                {asset.instruments.map((inst, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[#f0f0f0] ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"} hover:bg-[rgba(18,149,61,0.04)] transition-colors`}
                  >
                    <td className="text-[#0e314c] text-[14px] md:text-[15px] font-medium px-[20px] py-[14px]">{inst.name}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px] font-mono">{inst.symbol}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.spread}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.leverage}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Is Section */}
      <section className="bg-[#f9f9f9] py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-[30px] md:gap-[40px] items-center">
            <div className="flex-1">
              <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[24px]">
                {titles.whatIs} {asset.name}؟
              </h2>
              <div className="flex flex-col gap-[16px]">
                {asset.whatIs.map((p, i) => (
                  <p key={i} className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.7]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-[440px] xl:w-[500px] h-[260px] md:h-[320px] rounded-[20px] overflow-hidden shrink-0">
              <Image src={asset.image} alt={asset.headline} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Trade with Namaya */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.whyTrade.replace("{name}", asset.name)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px]">
            {asset.advantages.map((adv, i) => (
              <div
                key={i}
                className="flex gap-[16px] bg-[#f9f9f9] border border-[#cacceb] rounded-[20px] p-[24px] md:p-[28px] hover:border-[#12953d] hover:shadow-[0_4px_20px_rgba(18,149,61,0.08)] transition-all"
              >
                <div className="w-[48px] h-[48px] rounded-full bg-[#12953d] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#0e314c] text-[18px] md:text-[20px] font-bold leading-[1.3] mb-[6px]">
                    {adv.title}
                  </h3>
                  <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6]">
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start Trading */}
      <section className="bg-[#f9f9f9] py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.howToStart}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[24px]">
            {steps.map((step, i) => (
              <div key={i} className="bg-white border border-[#cacceb] rounded-[20px] p-[28px] md:p-[32px] text-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[#12953d] flex items-center justify-center mx-auto mb-[20px]">
                  <span className="text-white text-[24px] font-bold">{step.step}</span>
                </div>
                <h3 className="text-[#0e314c] text-[20px] md:text-[22px] font-bold leading-[1.3] mb-[10px]">
                  {step.title}
                </h3>
                <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[840px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.faq}
          </h2>
          <div className="flex flex-col gap-[12px]">
            {asset.faq.map((item, i) => (
              <div
                key={i}
                className={`border rounded-[16px] overflow-hidden transition-colors ${
                  openFaq === i ? "border-[#12953d] bg-[rgba(18,149,61,0.02)]" : "border-[#cacceb]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-[24px] py-[18px] text-start cursor-pointer"
                >
                  <span className="text-[#0e314c] text-[16px] md:text-[17px] font-semibold leading-[1.4] flex-1">
                    {item.q}
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12953d"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-300 ${isAr ? "mr-[16px]" : "ml-[16px]"} ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-[24px] pb-[18px] text-[#6084a4] text-[14px] md:text-[15px] leading-[1.7]">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#001005] py-[50px] md:py-[70px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/blog-hero-bg.png" alt="" fill className="object-cover opacity-40" />
        </div>
        <div dir={isAr ? "rtl" : undefined} className="relative max-w-[700px] mx-auto text-center">
          <h2 className="text-white text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[16px]">
            {cta.title}
          </h2>
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] mb-[32px]">
            {cta.desc}
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-[40px] py-[18px] bg-[#12953d] border border-[#b0f127] rounded-[8px] text-white text-[16px] font-semibold hover:bg-[#0e7a31] transition-colors"
          >
            {cta.btn}
          </a>
        </div>
      </section>
    </>
  );
}
