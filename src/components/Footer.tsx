"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const quickLinks = {
  en: [
    "Financial assets",
    "Technical analysis",
    "Trading platforms",
    "Types of accounts",
    "Deposit and withdrawal policy",
    "Complaints",
  ],
  ar: [
    "الأصول المالية",
    "التحليل الفني",
    "منصات التداول",
    "أنواع الحسابات",
    "سياسة الإيداع والسحب",
    "الشكاوى",
  ],
};

const supportLinks = {
  en: [
    "FAQ's",
    "Privacy Policy",
    "Terms & Conditions",
    "FAQ",
    "Contact Us",
  ],
  ar: [
    "الأسئلة الشائعة",
    "سياسة الخصوصية",
    "الشروط والأحكام",
    "الأسئلة المتكررة",
    "تواصل معنا",
  ],
};

const socialIcons = [
  { src: "/images/social-fb.svg", alt: "Facebook" },
  { src: "/images/social-twitter.svg", alt: "Twitter" },
  { src: "/images/social-instagram.svg", alt: "Instagram" },
  { src: "/images/social-linkedin.svg", alt: "LinkedIn" },
];

const labels = {
  en: {
    brandDesc:
      "StartP empowers businesses with innovative SaaS solutions designed to streamline workflows and drive growth.",
    quickLinks: "Quick Links",
    support: "Support",
    contact: "Contact Information",
    copyright: "All rights reserved to Namaya Financial Company 2026",
  },
  ar: {
    brandDesc:
      "نمايا تمكّن الشركات من خلال حلول SaaS المبتكرة المصممة لتبسيط سير العمل ودفع النمو.",
    quickLinks: "روابط سريعة",
    support: "الدعم",
    contact: "معلومات التواصل",
    copyright: "جميع الحقوق محفوظة لشركة نمايا المالية 2026",
  },
};

export default function Footer() {
  const { lang } = useLang();
  const t = labels[lang];
  const qLinks = quickLinks[lang];
  const sLinks = supportLinks[lang];

  return (
    <footer className="relative min-h-[475px]">
      {/* Background */}
      <Image
        src="/images/footer-bg.jpg"
        alt=""
        fill
        className="object-cover object-top"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[52px]">
        {/* Main footer content */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-[80px] pb-[80px]"
        >
          {/* Brand */}
          <div>
            <a
              href="#"
              className="flex items-center gap-[7px] mb-[19px]"
            >
              <Image
                src="/images/nemayalogo.png"
                alt="Namaya for Investment"
                width={225}
                height={52}
                className="brightness-0 invert"
              />
            </a>
            <p className="text-[#c5c5c5] text-[16px] leading-[1.4] mb-[25px]">
              {t.brandDesc}
            </p>
            <div className="flex gap-[10px]">
              {socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[35px] h-[35px] rounded-full bg-[rgba(18,149,61,0.4)] flex items-center justify-center hover:bg-[rgba(18,149,61,0.7)] transition-colors"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={16}
                    height={16}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-[24px] leading-[28.8px] mb-[30px]">
              {t.quickLinks}
            </h3>
            <ul className="flex flex-col gap-[10px]">
              {qLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#c5c5c5] text-[16px] leading-[1.4] hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-[24px] leading-[28.8px] mb-[30px]">
              {t.support}
            </h3>
            <ul className="flex flex-col gap-[10px]">
              {sLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#c5c5c5] text-[16px] leading-[1.4] hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-[24px] leading-[28.8px] mb-[30px]">
              {t.contact}
            </h3>
            <div className="flex flex-col gap-[15px] mb-[20px]">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/phone-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                <a
                  href="tel:+966135117700"
                  className="text-[#c5c5c5] text-[16px] leading-[24px] hover:text-white transition-colors"
                  dir="ltr"
                >
                  +966135117700
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/email-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                <a
                  href="mailto:Info@namaya.ar"
                  className="text-[#c5c5c5] text-[16px] leading-[24px] underline hover:text-white transition-colors"
                  dir="ltr"
                >
                  Info@namaya.ar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(74,111,138,0.3)] py-[25px]">
          <p className="text-white text-[14px] leading-[25.2px] text-center">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
