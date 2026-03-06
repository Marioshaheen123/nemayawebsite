"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface VerifyEmailPageProps {
  verifyEmailText: Bilingual<{
    title: string;
    description: string;
    descriptionEnd: string;
    email: string;
    skipBtn: string;
    didntGet: string;
    resend: string;
  }>;
}

export default function VerifyEmailPage({ verifyEmailText: t }: VerifyEmailPageProps) {
  const { mainLogo } = useSiteSettings();
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

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
            src={mainLogo}
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
          className="cta-gradient block w-full rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium text-center shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] mb-5"
        >
          {content.skipBtn}
        </Link>

        {/* Resend */}
        <div className="text-center">
          <span className="text-[rgba(46,38,61,0.7)] text-[15px]">
            {content.didntGet}{" "}
          </span>
          <button
            onClick={async () => {
              setResending(true);
              try {
                await fetch("/api/user/auth/send-otp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: content.email, type: "email" }),
                });
                setResent(true);
                setTimeout(() => setResent(false), 3000);
              } catch { /* silent */ } finally {
                setResending(false);
              }
            }}
            disabled={resending}
            className="text-accent text-[15px] hover:underline cursor-pointer disabled:opacity-60"
          >
            {resending ? (isAr ? "جارٍ الإرسال..." : "Sending...") : resent ? (isAr ? "تم الإرسال ✓" : "Sent ✓") : content.resend}
          </button>
        </div>
      </div>
    </div>
  );
}
