"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface VerifyCodePageProps {
  verifyCodeText: Bilingual<{
    title: string;
    description: string;
    maskedNumber: string;
    codeLabel: string;
    verifyBtn: string;
    didntGet: string;
    resend: string;
  }>;
}

export default function VerifyCodePage({ verifyCodeText: t }: VerifyCodePageProps) {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center px-4 py-20 relative">
      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className="absolute top-6 right-6 flex items-center gap-[6px] rounded-full px-[14px] py-[8px] bg-white text-[rgba(46,38,61,0.7)] text-[13px] font-medium shadow-[0px_2px_6px_rgba(46,38,61,0.12)] hover:shadow-[0px_2px_10px_rgba(46,38,61,0.2)] transition-all cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {lang === "en" ? "العربية" : "English"}
      </button>

      <div
        dir={isAr ? "rtl" : undefined}
        className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] w-full max-w-[450px] p-8 md:p-12"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/nemayalogo.png"
            alt="Namaya for Investment"
            width={233}
            height={64}
            className="h-[50px] md:h-[64px] w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-[rgba(46,38,61,0.9)] text-[22px] md:text-[24px] font-medium leading-[38px] mb-2">
          {content.title} <span className="inline-block">&#128172;</span>
        </h1>

        {/* Description */}
        <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] mb-1">
          {content.description}
        </p>
        <p className="text-[rgba(46,38,61,0.9)] text-[15px] font-medium leading-[22px] mb-5">
          {content.maskedNumber}
        </p>

        {/* Code Label */}
        <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] mb-2">
          {content.codeLabel}
        </p>

        {/* 6-digit OTP Inputs */}
        <div dir="ltr" className="flex gap-2 md:gap-3 justify-center mb-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-[44px] h-[50px] md:w-[52px] md:h-[56px] border border-[rgba(46,38,61,0.12)] rounded-[6px] text-center text-[20px] font-medium text-[rgba(46,38,61,0.9)] focus:outline-none focus:border-[#057e33] transition-colors"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button className="w-full bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer mb-5">
          {content.verifyBtn}
        </button>

        {/* Resend */}
        <div className="text-center">
          <span className="text-[rgba(46,38,61,0.7)] text-[15px]">
            {content.didntGet}{" "}
          </span>
          <button className="text-[#057e33] text-[15px] hover:underline cursor-pointer">
            {content.resend}
          </button>
        </div>
      </div>
    </div>
  );
}
