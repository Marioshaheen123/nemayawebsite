"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

/**
 * Replace this function body with your actual API call.
 * Example:
 *   const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
 *   if (!res.ok) throw new Error('Failed');
 */
async function submitContactForm(data: Record<string, string>): Promise<void> {
  // TODO: Replace with real API call
  await new Promise((r) => setTimeout(r, 800));
  console.log("Contact form submitted:", data);
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

  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitContactForm(form);
      setSubmitted(true);
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeroBanner title={i18n.heroTitle[lang]} />

      {/* Contact Form */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
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

          {/* Form Card */}
          <div className="bg-[#f8f8f8] rounded-[25px] p-[24px] md:p-[32px]">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
                <div className="w-[60px] h-[60px] rounded-full bg-[#12953d] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-[#0e314c] text-[16px] leading-[1.5] text-center max-w-[400px]">
                  {i18n.success[lang]}
                </p>
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="bg-white h-[7px] rounded-[10px] w-full mb-[40px] overflow-hidden">
                  <div
                    className="bg-[#12953d] h-full rounded-[10px] transition-all duration-300"
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
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors"
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
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors"
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
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[#0e314c] text-[14px] font-medium leading-[21px]">
                        {fields.phone}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder={fields.phonePlaceholder}
                        dir="ltr"
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors"
                      />
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
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors"
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
                        className="bg-[#f2f2f2] border border-[#f2f2f2] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0e314c] placeholder-[#6b7280] outline-none focus:border-[#12953d] transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-[16px]">
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-[8px] bg-white border border-[#12953d] rounded-[5px] px-[36px] py-[15px] text-[#0e314c] text-[14px] font-semibold hover:bg-[#f0f0f0] transition-colors cursor-pointer w-[160px] justify-center"
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
                      onClick={() => setStep((s) => s + 1)}
                      className="flex items-center gap-[8px] bg-[#12953d] border border-[#b0f127] rounded-[5px] px-[36px] py-[15px] text-white text-[14px] font-semibold hover:bg-[#0e7a31] transition-colors cursor-pointer w-[160px] justify-center"
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
                      className="flex items-center gap-[8px] bg-[#12953d] border border-[#b0f127] rounded-[5px] px-[36px] py-[15px] text-white text-[14px] font-semibold hover:bg-[#0e7a31] transition-colors cursor-pointer w-[160px] justify-center disabled:opacity-60"
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
