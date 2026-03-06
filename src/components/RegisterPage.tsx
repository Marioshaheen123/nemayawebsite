"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import type { Bilingual } from "@/data/types";
import { COUNTRIES, DEFAULT_PHONE_RULES } from "@/data/countries";

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

const IP_COUNTRY_TO_ISO2: Record<string, string> = {
  SA: "sa",
  AE: "ae",
  KW: "kw",
  BH: "bh",
  QA: "qa",
  OM: "om",
  JO: "jo",
  EG: "eg",
  IQ: "iq",
  LB: "lb",
};

export default function RegisterPage({
  registerText: t,
  ageOptions,
  countryOptions,
  callTimeOptions,
}: RegisterPageProps) {
  const { mainLogo } = useSiteSettings();
  const { lang, toggleLang } = useLang();
  const router = useRouter();
  const isAr = lang === "ar";
  const content = t[lang];
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { country_code?: string } | null) => {
        if (!data?.country_code) return;
        const iso2 = IP_COUNTRY_TO_ISO2[data.country_code.toUpperCase()]
          || data.country_code.toLowerCase();
        // Only set if we have a matching country
        if (COUNTRIES.some((c) => c.iso2 === iso2)) {
          setForm((prev) => {
            if (prev.country) return prev;
            return { ...prev, country: iso2 };
          });
        }
      })
      .catch(() => {});
  }, []);

  const totalSteps = 4;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  // Derive country info and dial code from selected country (iso2)
  const selectedCountry = COUNTRIES.find((c) => c.iso2 === form.country);
  const dialCode = selectedCountry?.dialCode || "+966";
  const phoneRules = selectedCountry?.phoneRules || DEFAULT_PHONE_RULES;

  const handleChange = (name: string, value: string) => {
    // Phone: only allow digits, cap at country max
    if (name === "mobile") {
      const digits = value.replace(/\D/g, "").slice(0, phoneRules.max);
      setForm((prev) => ({ ...prev, [name]: digits }));
      // Real-time phone validation
      if (digits.length > 0 && phoneRules.startsWith && phoneRules.startsWith.length > 0) {
        const validPrefix = phoneRules.startsWith.some((p) => digits.startsWith(p));
        if (!validPrefix) {
          const prefixes = phoneRules.startsWith.join(", ");
          setFieldErrors((prev) => ({ ...prev, mobile: isAr ? `رقم الجوال يجب أن يبدأ بـ ${prefixes}` : `Mobile number must start with ${prefixes}` }));
          return;
        }
      }
      if (digits.length > 0 && digits.length < phoneRules.min) {
        setFieldErrors((prev) => ({ ...prev, mobile: isAr ? `رقم الجوال يجب أن يكون ${phoneRules.min} أرقام` : `Mobile number must be ${phoneRules.min} digits` }));
      } else {
        setFieldErrors((prev) => { const n = { ...prev }; delete n.mobile; return n; });
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time password validation
    if (name === "password") {
      const errs: Record<string, string> = {};
      if (value.length > 0 && value.length < 8) {
        errs.password = isAr ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters";
      }
      if (form.confirmPassword && value !== form.confirmPassword) {
        errs.confirmPassword = isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match";
      }
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n.password;
        delete n.confirmPassword;
        return { ...n, ...errs };
      });
    }

    if (name === "confirmPassword") {
      if (value && value !== form.password) {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match" }));
      } else {
        setFieldErrors((prev) => { const n = { ...prev }; delete n.confirmPassword; return n; });
      }
    }

    // Real-time email validation
    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldErrors((prev) => ({ ...prev, email: isAr ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address" }));
      } else {
        setFieldErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
      }
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const currentStep = content.steps[step];

  const validateCurrentStep = (): string | null => {
    const fields = currentStep.fields;
    for (const field of fields) {
      if (!form[field.name]?.trim()) {
        return isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields";
      }
    }
    // Step 2 (index 1): validate mobile + email
    if (step === 1) {
      const mobile = form.mobile || "";
      if (phoneRules.startsWith && phoneRules.startsWith.length > 0) {
        const validPrefix = phoneRules.startsWith.some((p) => mobile.startsWith(p));
        if (!validPrefix) {
          const prefixes = phoneRules.startsWith.join(", ");
          return isAr ? `رقم الجوال يجب أن يبدأ بـ ${prefixes}` : `Mobile number must start with ${prefixes}`;
        }
      }
      if (mobile.length < phoneRules.min || mobile.length > phoneRules.max) {
        return isAr ? `رقم الجوال يجب أن يكون ${phoneRules.min} أرقام` : `Mobile number must be ${phoneRules.min} digits`;
      }
      if (!/^\d+$/.test(mobile)) {
        return isAr ? "رقم الجوال يجب أن يحتوي على أرقام فقط" : "Mobile number must contain only digits";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        return isAr ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address";
      }
    }
    // Step 3 (index 2): validate passwords
    if (step === 2) {
      if (form.password.length < 8) {
        return isAr ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters";
      }
      if (form.password !== form.confirmPassword) {
        return isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match";
      }
    }
    return null;
  };

  const handleNext = () => {
    setError("");
    const err = validateCurrentStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(totalSteps - 1, s + 1));
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
        className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] w-full max-w-[700px] p-5 md:p-12"
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

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-[6px] bg-[#ff4c51]/10 border border-[#ff4c51]/30 text-[#ff4c51] text-[14px] text-center">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-[#f4f5fa] h-[22px] rounded-full w-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-dark to-primary-light transition-all duration-500"
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
                      className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.7)] bg-white appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">{field.label}</option>
                      {field.name === "age" &&
                        ageOptions[lang].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      {field.name === "country" &&
                        COUNTRIES.map((c) => (
                          <option key={c.iso2} value={c.iso2}>{isAr ? c.ar : c.en}</option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
              <select
                value={form.callTime || ""}
                onChange={(e) => handleChange("callTime", e.target.value)}
                className="w-full border border-[rgba(46,38,61,0.22)] rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.7)] bg-white appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
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
                <div key={field.name} className="flex-1">
                  <div className="relative">
                    {/* Phone field with dynamic dial code prefix */}
                    {field.type === "tel" ? (
                      <div className="flex" dir="ltr">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[rgba(46,38,61,0.22)] rounded-l-[6px] bg-[#f4f5fa] text-[14px] text-[rgba(46,38,61,0.6)] select-none">
                          {dialCode}
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          dir="ltr"
                          placeholder={phoneRules.startsWith ? phoneRules.startsWith[0] + "X".repeat(phoneRules.min - 1) : "X".repeat(phoneRules.min)}
                          value={form[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          maxLength={phoneRules.max}
                          className={`w-full border rounded-r-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none transition-colors ${
                            fieldErrors[field.name]
                              ? "border-[#ff4c51] focus:border-[#ff4c51]"
                              : "border-[rgba(46,38,61,0.22)] focus:border-accent"
                          }`}
                        />
                      </div>
                    ) : (
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
                        className={`w-full border rounded-[6px] px-[14px] py-[16px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.7)] focus:outline-none transition-colors ${
                          fieldErrors[field.name]
                            ? "border-[#ff4c51] focus:border-[#ff4c51]"
                            : "border-[rgba(46,38,61,0.22)] focus:border-accent"
                        }`}
                      />
                    )}
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
                  {/* Inline error */}
                  {fieldErrors[field.name] && (
                    <p className="mt-1 text-[12px] text-[#ff4c51]">{fieldErrors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setError(""); setStep((s) => Math.max(0, s - 1)); }}
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
              onClick={handleNext}
              className="cta-gradient flex items-center gap-2 rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer"
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
            <button
              onClick={async () => {
                setError("");
                // Final check: validate all steps
                if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim() || !form.mobile?.trim() || !form.password || !form.confirmPassword) {
                  setError(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
                  return;
                }
                const mobile = form.mobile || "";
                if (mobile.length < phoneRules.min || mobile.length > phoneRules.max || !/^\d+$/.test(mobile)) {
                  setError(isAr ? `رقم الجوال يجب أن يكون ${phoneRules.min} أرقام` : `Mobile number must be ${phoneRules.min} digits`);
                  return;
                }
                if (phoneRules.startsWith && phoneRules.startsWith.length > 0) {
                  const validPrefix = phoneRules.startsWith.some((p) => mobile.startsWith(p));
                  if (!validPrefix) {
                    const prefixes = phoneRules.startsWith.join(", ");
                    setError(isAr ? `رقم الجوال يجب أن يبدأ بـ ${prefixes}` : `Mobile number must start with ${prefixes}`);
                    return;
                  }
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(form.email)) {
                  setError(isAr ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address");
                  return;
                }
                if (form.password.length < 8) {
                  setError(isAr ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters");
                  return;
                }
                if (form.password !== form.confirmPassword) {
                  setError(isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match");
                  return;
                }
                setSubmitting(true);
                try {
                  const res = await fetch("/api/user/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      firstName: form.firstName,
                      lastName: form.lastName,
                      email: form.email,
                      phone: dialCode + form.mobile,
                      password: form.password,
                      confirmPassword: form.confirmPassword,
                      age: form.age,
                      country: form.country, // iso2 code
                      callTime: form.callTime,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setError(data.error || (isAr ? "فشل التسجيل" : "Registration failed"));
                    return;
                  }
                  // Redirect to login page with the new account ID
                  router.push(`/login?registered=${data.accountId}`);
                } catch {
                  setError(isAr ? "حدث خطأ، يرجى المحاولة لاحقاً" : "An error occurred, please try again");
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
              className="cta-gradient rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (isAr ? "جارٍ التسجيل..." : "Registering...") : content.finish}
            </button>
          )}
        </div>

        {/* Already have account */}
        {step === 0 && (
          <div className="text-center mt-6">
            <span className="text-[rgba(46,38,61,0.7)] text-[15px]">
              {content.alreadyHave}{" "}
            </span>
            <Link href="/login" className="text-accent text-[15px] hover:underline">
              {content.login}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
