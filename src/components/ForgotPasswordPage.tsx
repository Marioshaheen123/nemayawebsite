"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface ForgotPasswordPageProps {
  forgotPasswordText: Bilingual<{
    title: string;
    description: string;
    emailLabel: string;
    sendBtn: string;
    backToLogin: string;
  }>;
}

export default function ForgotPasswordPage({ forgotPasswordText: t }: ForgotPasswordPageProps) {
  const { mainLogo } = useSiteSettings();
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || (isAr ? "فشل الإرسال" : "Failed to send"));
      }
    } catch {
      setError(isAr ? "حدث خطأ" : "An error occurred");
    } finally {
      setSubmitting(false);
    }
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
            src={mainLogo}
            alt="Namaya for Investment"
            width={233}
            height={64}
            className="h-[50px] md:h-[64px] w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-[rgba(46,38,61,0.9)] text-[22px] md:text-[24px] font-medium leading-[38px] mb-2">
          {content.title} <span className="inline-block">&#128274;</span>
        </h1>

        {/* Description */}
        <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] mb-5">
          {content.description}
        </p>

        {/* Email Field */}
        <input
          type="email"
          placeholder={content.emailLabel}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none focus:border-accent transition-colors mb-5"
        />

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 rounded-[6px] bg-[#ff4c51]/10 border border-[#ff4c51]/30 text-[#ff4c51] text-[14px] text-center">
            {error}
          </div>
        )}
        {sent && (
          <div className="mb-4 p-3 rounded-[6px] bg-accent/10 border border-accent/30 text-accent text-[14px] text-center">
            {isAr ? "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني" : "A reset link has been sent to your email"}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || sent}
          className="cta-gradient w-full rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (isAr ? "جارٍ الإرسال..." : "Sending...") : sent ? (isAr ? "تم الإرسال ✓" : "Sent ✓") : content.sendBtn}
        </button>

        {/* Back to Login */}
        <div className="flex items-center justify-center gap-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-accent ${isAr ? "rotate-180" : ""}`}
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <Link href="/login" className="text-accent text-[15px] hover:underline">
            {content.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
