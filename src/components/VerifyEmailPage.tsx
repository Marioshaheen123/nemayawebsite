"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const t = {
  en: {
    title: "Verify your email",
    description: "Account activation link sent to your email address: ",
    descriptionEnd: " Please follow the link inside to continue.",
    email: "john.doe@email.com",
    skipBtn: "Skip For Now",
    didntGet: "Didn't get the mail?",
    resend: "Resend",
  },
  ar: {
    title: "تحقق من بريدك الإلكتروني",
    description: "تم إرسال رابط تفعيل الحساب إلى بريدك الإلكتروني: ",
    descriptionEnd: " يرجى اتباع الرابط بالداخل للمتابعة.",
    email: "john.doe@email.com",
    skipBtn: "تخطي الآن",
    didntGet: "لم تستلم البريد؟",
    resend: "إعادة الإرسال",
  },
};

export default function VerifyEmailPage() {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];

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
          {content.title} <span className="inline-block">&#9993;&#65039;</span>
        </h1>

        {/* Description */}
        <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] mb-5">
          {content.description}
          <span className="font-medium text-[rgba(46,38,61,0.9)]">{content.email}</span>
          {content.descriptionEnd}
        </p>

        {/* Skip Button */}
        <Link
          href="/verify-number"
          className="block w-full bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium text-center shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all mb-5"
        >
          {content.skipBtn}
        </Link>

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
