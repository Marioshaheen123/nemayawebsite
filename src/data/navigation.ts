import type { NavItem, FooterLink, SocialIcon, Bilingual } from "@/data/types";

export const headerNavItems: Bilingual<NavItem[]> = {
  en: [
    { label: "Home", hasDropdown: false, href: "/" },
    {
      label: "Tools Center",
      hasDropdown: true,
      href: "#",
      children: [
        { label: "Videos", href: "/videos" },
        { label: "Economic Calendar", href: "/economic-calendar" },
      ],
    },
    { label: "About", hasDropdown: false, href: "/about" },
    { label: "Trading Platforms", hasDropdown: true, href: "/trading-platforms" },
    { label: "Blog", hasDropdown: false, href: "/blog" },
  ],
  ar: [
    { label: "الرئيسية", hasDropdown: false, href: "/" },
    {
      label: "أدوات التداول",
      hasDropdown: true,
      href: "#",
      children: [
        { label: "فيديو", href: "/videos" },
        { label: "التقويم الاقتصادي", href: "/economic-calendar" },
      ],
    },
    { label: "عن نمايا", hasDropdown: false, href: "/about" },
    { label: "منصات التداول", hasDropdown: true, href: "/trading-platforms" },
    { label: "مدونة", hasDropdown: false, href: "/blog" },
  ],
};

export const headerCta = {
  en: { signup: "Sign up", login: "Log in" },
  ar: { signup: "سجل", login: "تسجيل الدخول" },
};

export const footerQuickLinks: Bilingual<FooterLink[]> = {
  en: [
    { label: "Financial assets", href: "/financial-assets" },
    { label: "Technical analysis", href: "#" },
    { label: "Trading platforms", href: "/trading-platforms" },
    { label: "Types of accounts", href: "/account-types" },
    { label: "Deposit and withdrawal policy", href: "#" },
    { label: "Complaints", href: "#" },
  ],
  ar: [
    { label: "الأصول المالية", href: "/financial-assets" },
    { label: "التحليل الفني", href: "#" },
    { label: "منصات التداول", href: "/trading-platforms" },
    { label: "أنواع الحسابات", href: "/account-types" },
    { label: "سياسة الإيداع والسحب", href: "#" },
    { label: "الشكاوى", href: "#" },
  ],
};

export const footerSupportLinks: Bilingual<FooterLink[]> = {
  en: [
    { label: "Islamic Legal Rulings", href: "/islamic-legal-rulings" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  ar: [
    { label: "الأحكام القانونية الإسلامية", href: "/islamic-legal-rulings" },
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "الشروط والأحكام", href: "/terms" },
    { label: "الأسئلة المتكررة", href: "/faq" },
    { label: "تواصل معنا", href: "/contact" },
  ],
};

export const footerSocialIcons: SocialIcon[] = [
  { src: "/images/social-fb.svg", alt: "Facebook", href: "#" },
  { src: "/images/social-twitter.svg", alt: "Twitter", href: "#" },
  { src: "/images/social-instagram.svg", alt: "Instagram", href: "#" },
  { src: "/images/social-linkedin.svg", alt: "LinkedIn", href: "#" },
];

export const footerLabels = {
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

export const footerContactInfo = {
  phone: "+966135117700",
  email: "Info@namaya.ar",
};
