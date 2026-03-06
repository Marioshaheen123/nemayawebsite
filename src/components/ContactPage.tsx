"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

async function submitContactForm(data: Record<string, string>): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to submit");
  }
}

interface ContactPageProps {
  i18n: any;
  totalSteps: number;
}

export default function ContactPage({ i18n, totalSteps }: ContactPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const fields = i18n.fields[lang];

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    let digits = value.replace(/\D/g, "");
    // Cap length based on prefix
    const max = digits.startsWith("05") ? 10 : 9;
    if (digits.length > max) digits = digits.slice(0, max);
    update("phone", digits);
    setPhoneError("");
  };

  const validatePhone = (): boolean => {
    const phone = form.phone;
    if (!phone) {
      setPhoneError(isAr ? "رقم الهاتف مطلوب" : "Phone number is required");
      return false;
    }
    if (phone.startsWith("05")) {
      if (phone.length !== 10) {
        setPhoneError(isAr ? "يجب أن يتكون الرقم من 10 أرقام عند البدء بـ 05" : "Number must be exactly 10 digits when starting with 05");
        return false;
      }
    } else if (phone.startsWith("5")) {
      if (phone.length !== 9) {
        setPhoneError(isAr ? "يجب أن يتكون الرقم من 9 أرقام عند البدء بـ 5" : "Number must be exactly 9 digits when starting with 5");
        return false;
      }
    } else {
      setPhoneError(isAr ? "يجب أن يبدأ الرقم بـ 5 أو 05" : "Number must start with 5 or 05");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await submitContactForm(form);
      setSubmitted(true);
    } catch (err) {
      setError(
        isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Failed to submit. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeroBanner
        title={i18n.heroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: i18n.heroTitle[lang] },
        ]}
      />

      {/* Contact Form */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto"
        >
          {/* Title */}
          <div className="mb-[40px]">
            <h2 className="text-[#0e314c] text-[28px] md:text-[35px] font-bold leading-[42px] mb-[10px]">
              {i18n.formTitle[lang]}
            </h2>
            <p className="text-[#6084a4] text-[16px] leading-[1.4]">
              {i18n.formDesc[lang]}
            </p>
          </div>

          {/* Success Popup Modal */}
          {submitted && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
              <div className="bg-white rounded-[20px] p-[32px] md:p-[48px] max-w-[460px] w-full flex flex-col items-center gap-[20px] shadow-xl">
                <div className="w-[70px] h-[70px] rounded-full bg-site-gradient flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-[#0e314c] text-[22px] font-bold text-center leading-[1.3]">
                  {isAr ? "تم استلام طلبك" : "Request Received"}
                </h3>
                <p className="text-[#6084a4] text-[15px] leading-[1.5] text-center">
                  {isAr ? "تم استلام طلبك بنجاح وسيتم التواصل معك قريباً" : "Your request has been received and you will be contacted shortly."}
                </p>
                <a
                  href="/"
                  className="cta-gradient inline-block rounded-[12px] px-[36px] py-[14px] text-[14px] font-semibold hover:opacity-90 transition-opacity mt-[8px]"
                >
                  {isAr ? "العودة للموقع الرئيسي" : "Back to Main Website"}
                </a>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-[#f8f8f8] rounded-[25px] p-[24px] md:p-[32px]">
            {!submitted && (
              <>
                {/* Progress Bar */}
                <div className="bg-white h-[7px] rounded-[10px] w-full mb-[40px] overflow-hidden">
                  <div
                    className="bg-site-gradient h-full rounded-[10px] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Step Title */}
                <h3 className="text-[#0e314c] text-[24px] font-bold leading-[28.8px] text-center mb-[24px]">
                  {i18n.steps[lang][step]}
                </h3>

                {/* Step 1: Personal Information */}
                {step === 0 && (
                  <div className="flex flex-col md:flex-row gap-[16px] mb-[40px]">
                    <div className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.firstName}
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        placeholder={fields.firstNamePlaceholder}
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.lastName}
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        placeholder={fields.lastNamePlaceholder}
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Details */}
                {step === 1 && (
                  <div className="flex flex-col md:flex-row gap-[16px] mb-[40px]">
                    <div className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.email}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder={fields.emailPlaceholder}
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.phone}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder={fields.phonePlaceholder || (isAr ? "5XXXXXXXX" : "5XXXXXXXX")}
                        dir="ltr"
                        maxLength={10}
                        className={`bg-[#f2f2f2] border rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none transition-colors ${phoneError ? "border-[#ff4c51] focus:border-[#ff4c51]" : "border-[#f2f2f2] focus:border-primary"}`}
                      />
                      {phoneError && (
                        <p className="text-[#ff4c51] text-[12px]">{phoneError}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Message */}
                {step === 2 && (
                  <div className="flex flex-col gap-[16px] mb-[40px]">
                    <div className="flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.subject}
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        placeholder={fields.subjectPlaceholder}
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.message}
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder={fields.messagePlaceholder}
                        rows={5}
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mb-[16px] p-3 rounded-[8px] bg-[#ff4c51]/10 border border-[#ff4c51]/30 text-[#ff4c51] text-[14px] text-center">
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-[16px]">
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-[8px] bg-white border border-primary rounded-[5px] px-[36px] py-[15px] text-[#0e314c] text-[14px] font-semibold hover:bg-[#f0f0f0] transition-colors cursor-pointer w-[160px] justify-center"
                    >
                      <svg
                        width="20"
                        height="20"
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
                      {i18n.previous[lang]}
                    </button>
                  )}
                  {step < totalSteps - 1 ? (
                    <button
                      onClick={() => {
                        if (step === 1 && !validatePhone()) return;
                        setStep((s) => s + 1);
                      }}
                      className="cta-gradient flex items-center gap-[8px] rounded-[12px] px-[36px] py-[15px] text-[14px] font-semibold cursor-pointer w-[160px] justify-center"
                    >
                      {i18n.next[lang]}
                      <svg
                        width="20"
                        height="20"
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
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="cta-gradient flex items-center gap-[8px] rounded-[12px] px-[36px] py-[15px] text-[14px] font-semibold cursor-pointer w-[160px] justify-center disabled:opacity-60"
                    >
                      {submitting ? (
                        <div className="w-[20px] h-[20px] border-[2px] border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        i18n.submit[lang]
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
