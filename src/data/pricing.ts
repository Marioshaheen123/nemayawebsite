import type { Bilingual, Plan, Lang } from "@/data/types";

export const allPlans: Bilingual<Plan[]> = {
  en: [
    {
      name: "Mini Account",
      price: "$29",
      period: "month",
      description:
        "Best for individuals and small businesses looking to get started",
      cta: "Get Started",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "Standard Account",
      price: "$79",
      period: "month",
      description:
        "Perfect for growing businesses needing more features and support",
      cta: "Start Free Trial",
      featuresLabel: "Features",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      bg: "",
      gradient: true,
    },
    {
      name: "Gold Account",
      price: "$99",
      period: "month",
      description:
        "Ideal for large enterprises that require custom solutions and dedicated support",
      cta: "Contact Us",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "Premium Account",
      price: "$149",
      period: "month",
      description:
        "Ideal for large enterprises that require custom solutions and dedicated support",
      cta: "Contact Us",
      featuresLabel: "Features",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
  ],
  ar: [
    {
      name: "حساب مصغر",
      price: "3,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "حساب قياسي",
      price: "18,750",
      period: "ر.س",
      description:
        "مثالي للأعمال المتنامية التي تحتاج إلى المزيد من الميزات والدعم",
      cta: "ابدأ تجربة مجانية",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#0e314c] border-[#0e314c] text-white",
      bg: "",
      gradient: true,
    },
    {
      name: "حساب الذهب",
      price: "37,750",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
    {
      name: "حساب مميز",
      price: "56,250",
      period: "ر.س",
      description: "الأفضل للأفراد والشركات الصغيرة التي تتطلع للبدء",
      cta: "ابدأ",
      featuresLabel: "الميزات",
      ctaStyle: "bg-[#12953d] border-[#12953d] text-white",
      bg: "bg-white",
    },
  ],
};

export const planFeatures: Bilingual<string[]> = {
  en: [
    "Daily market analysis",
    "24/7 customer support",
    "Personal trading advisor",
    "Daily recommendations",
    "Instant trading alerts",
    "Low spread advantage",
    "VIP support",
  ],
  ar: [
    "تحليل السوق اليومي",
    "دعم العملاء على مدار الساعة طوال أيام الأسبوع",
    "مستشار تداول شخصي",
    "توصيات يومية",
    "تنبيهات تداول فورية",
    "ميزة الفارق المنخفض",
    "دعم VIP",
  ],
};

export const pricingSectionHeading = {
  en: {
    before: "Choose the account that suits your ",
    bold: "budget and goals",
  },
  ar: {
    before: "اختر الحساب الذي يناسب ",
    bold: "ميزانيتك وأهدافك",
  },
};

export const pricingSectionBadge = {
  label: "PRICING PLANS",
  labelAr: "خطط الأسعار",
};

export const pricingViewAllLabel: Bilingual<string> = {
  en: "View All Account Types",
  ar: "عرض جميع أنواع الحسابات",
};

export const accountTypesPageHeroTitle: Bilingual<string> = {
  en: "Types of Accounts",
  ar: "أنواع الحسابات",
};

export const accountTypesPageHeading = {
  en: {
    before: "Choose the account that suits\nyour ",
    bold: "budget and goals",
  },
  ar: {
    before: "اختر الحساب الذي يناسب ",
    bold: "ميزانيتك وأهدافك",
  },
};

// --- Helper function ---

export function getHomepagePlans(lang: Lang) {
  return allPlans[lang].slice(0, 3);
}
