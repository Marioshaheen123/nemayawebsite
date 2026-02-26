"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface LoginPageProps {
  loginText: Bilingual<{
    title: string;
    subtitle: string;
    accountNumber: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    loginBtn: string;
    newHere: string;
    createAccount: string;
  }>;
}

export default function LoginPage({ loginText: t }: LoginPageProps) {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ accountNumber: "", password: "" });

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
        <div className="text-center mb-5">
          <h1 className="text-[rgba(46,38,61,0.9)] text-[22px] md:text-[24px] font-medium leading-[38px]">
            {content.title}
          </h1>
          <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px]">
            {content.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 mb-5">
          {/* Account Number */}
          <div className="relative">
            <input
              type="text"
              placeholder={content.accountNumber}
              value={form.accountNumber}
              onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
              className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none focus:border-[#057e33] transition-colors"
            />
            {form.accountNumber && (
              <label className={`absolute -top-[10px] bg-white px-1 text-[13px] text-[rgba(46,38,61,0.7)] ${isAr ? "right-[13px]" : "left-[13px]"}`}>
                {content.accountNumber}
              </label>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={content.password}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none focus:border-[#057e33] transition-colors"
            />
            {form.password && (
              <label className={`absolute -top-[10px] bg-white px-1 text-[13px] text-[rgba(46,38,61,0.7)] ${isAr ? "right-[13px]" : "left-[13px]"}`}>
                {content.password}
              </label>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-[rgba(46,38,61,0.5)] hover:text-[rgba(46,38,61,0.8)] transition-colors ${isAr ? "left-[14px]" : "right-[14px]"}`}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-[20px] h-[20px] rounded-[4px] border-[rgba(46,38,61,0.22)] accent-[#057e33] cursor-pointer"
            />
            <span className="text-[rgba(46,38,61,0.9)] text-[15px]">
              {content.rememberMe}
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#057e33] text-[15px] hover:underline"
          >
            {content.forgotPassword}
          </Link>
        </div>

        {/* Log In Button */}
        <button className="w-full bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer">
          {content.loginBtn}
        </button>

        {/* Create account link */}
        <div className="text-center mt-5">
          <span className="text-[rgba(46,38,61,0.7)] text-[15px]">
            {content.newHere}{" "}
          </span>
          <Link href="/register" className="text-[#057e33] text-[15px] hover:underline">
            {content.createAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
