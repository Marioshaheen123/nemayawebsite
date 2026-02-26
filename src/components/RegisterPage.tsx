"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";

interface RegisterPageProps {
  registerText: Bilingual<{
    mainTitle: string;
    mainSubtitle: string;
    steps: {
      title: string;
      subtitle: string;
      fields: { name: string; label: string; type: string }[];
    }[];
    previous: string;
    next: string;
    finish: string;
    alreadyHave: string;
    login: string;
  }>;
  ageOptions: Bilingual<string[]>;
  countryOptions: Bilingual<string[]>;
  callTimeOptions: Bilingual<string[]>;
}

export default function RegisterPage({
  registerText: t,
  ageOptions,
  countryOptions,
  callTimeOptions,
}: RegisterPageProps) {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const content = t[lang];
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const currentStep = content.steps[step];

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
        className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] w-full max-w-[700px] p-8 md:p-12"
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

        {/* Main Title (only on step 0) */}
        {step === 0 && (
          <div className="text-center mb-6">
            <h1 className="text-[rgba(46,38,61,0.9)] text-[22px] md:text-[24px] font-medium leading-[38px]">
              {content.mainTitle}
            </h1>
            <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px]">
              {content.mainSubtitle}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-[#f4f5fa] h-[22px] rounded-full w-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#03803a] to-[#42c45d] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Title */}
        <div className="mb-5">
          <h2 className="text-[rgba(46,38,61,0.9)] text-[22px] md:text-[24px] font-medium leading-[38px]">
            {currentStep.title}
          </h2>
          <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px]">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 mb-6">
          {/* Render fields in rows of 2 where applicable */}
          {step === 3 ? (
            /* Step 4: Age + Country side by side, CallTime full width */
            <>
              <div className="flex flex-col md:flex-row gap-5">
                {currentStep.fields.slice(0, 2).map((field) => (
                  <div key={field.name} className="flex-1">
                    <select
                      value={form[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.7)] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#057e33] transition-colors"
                    >
                      <option value="">{field.label}</option>
                      {field.name === "age" &&
                        ageOptions[lang].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      {field.name === "country" &&
                        countryOptions[lang].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
              <select
                value={form.callTime || ""}
                onChange={(e) => handleChange("callTime", e.target.value)}
                className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.7)] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#057e33] transition-colors"
              >
                <option value="">{currentStep.fields[2].label}</option>
                {callTimeOptions[lang].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </>
          ) : (
            /* Steps 1-3: Two fields side by side */
            <div className="flex flex-col md:flex-row gap-5">
              {currentStep.fields.map((field) => (
                <div key={field.name} className="flex-1 relative">
                  <input
                    type={
                      field.type === "password"
                        ? showPassword[field.name]
                          ? "text"
                          : "password"
                        : field.type
                    }
                    placeholder={field.label + "*"}
                    value={form[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none focus:border-[#057e33] transition-colors"
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.name)}
                      className={`absolute top-1/2 -translate-y-1/2 text-[rgba(46,38,61,0.5)] hover:text-[rgba(46,38,61,0.8)] transition-colors ${isAr ? "left-[14px]" : "right-[14px]"}`}
                    >
                      {showPassword[field.name] ? (
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`flex items-center gap-2 border border-[#8a8d93] rounded-[6px] px-[18px] py-[8px] text-[#8a8d93] text-[15px] font-medium transition-all ${
              step === 0 ? "opacity-45 cursor-not-allowed" : "hover:border-[rgba(46,38,61,0.5)] hover:text-[rgba(46,38,61,0.7)] cursor-pointer"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isAr ? "rotate-180" : ""}
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {content.previous}
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              className="flex items-center gap-2 bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer"
            >
              {content.next}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isAr ? "rotate-180" : ""}
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <Link
              href="/verify-email"
              className="bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all"
            >
              {content.finish}
            </Link>
          )}
        </div>

        {/* Already have account */}
        {step === 0 && (
          <div className="text-center mt-6">
            <span className="text-[rgba(46,38,61,0.7)] text-[15px]">
              {content.alreadyHave}{" "}
            </span>
            <Link href="/login" className="text-[#057e33] text-[15px] hover:underline">
              {content.login}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
