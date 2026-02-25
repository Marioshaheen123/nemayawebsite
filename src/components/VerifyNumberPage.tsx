"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const t = {
  en: {
    title: "Verify Your Number",
    description:
      "For security reasons, please verify your mobile number before continuing. We'll send a one-time verification code to this number.",
    mobileLabel: "Mobile Number",
    sendBtn: "Send Verification Code",
    backToLogin: "Back to Login",
  },
  ar: {
    title: "تحقق من رقمك",
    description:
      "لأسباب أمنية، يرجى التحقق من رقم هاتفك المحمول قبل المتابعة. سنرسل رمز تحقق لمرة واحدة إلى هذا الرقم.",
    mobileLabel: "رقم الجوال",
    sendBtn: "إرسال رمز التحقق",
    backToLogin: "العودة لتسجيل الدخول",
  },
};

export default function VerifyNumberPage() {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [mobile, setMobile] = useState("");

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
          {content.title} <span className="inline-block">&#128241;</span>
        </h1>

        {/* Description */}
        <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] mb-5">
          {content.description}
        </p>

        {/* Mobile Number Field */}
        <input
          type="tel"
          placeholder={content.mobileLabel}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none focus:border-[#057e33] transition-colors mb-5"
        />

        {/* Send Button */}
        <Link
          href="/verify-code"
          className="block w-full bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium text-center shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all mb-5"
        >
          {content.sendBtn}
        </Link>

        {/* Back to Login */}
        <div className="flex items-center justify-center gap-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#057e33"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isAr ? "rotate-180" : ""}
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <Link href="/login" className="text-[#057e33] text-[15px] hover:underline">
            {content.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
