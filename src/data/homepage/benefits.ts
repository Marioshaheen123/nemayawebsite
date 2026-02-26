import type { Bilingual, BenefitFeature } from "@/data/types";

export const benefitsFeatures: Bilingual<BenefitFeature[]> = {
  en: [
    {
      title: "Access global markets",
      description:
        "Trade currencies, commodities, indices, gold, and oil from one secure, Saudi-based platform — anytime, anywhere.",
    },
    {
      title: "Mobile-first experience",
      description:
        "Open, manage, and monitor your investments directly from your phone with a simple, intuitive trading flow.",
    },
    {
      title: "Secure & trusted platform",
      description:
        "Built with advanced security and compliance standards to ensure safe and reliable trading at every step.",
    },
    {
      title: "Built for growth",
      description:
        "Everything you need to move confidently toward your financial goals — designed to scale with your ambitions.",
    },
  ],
  ar: [
    {
      title: "الوصول إلى الأسواق العالمية",
      description:
        "تداول العملات والسلع والمؤشرات والذهب والنفط من منصة آمنة ومقرها السعودية - في أي وقت ومن أي مكان.",
    },
    {
      title: "تجربة موجهة نحو الهاتف المحمول",
      description:
        "افتح وأدر وراقب استثماراتك مباشرة من هاتفك مع تدفق تداول بسيط وبديهي.",
    },
    {
      title: "منصة آمنة وموثوقة",
      description:
        "مصممة بمعايير أمان متقدمة والامتثال لضمان تداول آمن وموثوق في كل خطوة.",
    },
    {
      title: "مصممة للنمو",
      description:
        "كل ما تحتاجه للتحرك بثقة نحو أهدافك المالية - مصممة لتتوسع مع طموحاتك.",
    },
  ],
};

export const benefitsHeading: Bilingual<{ before: string; bold: string }> = {
  en: {
    before: "Explore smart solutions to grow your wealth in ",
    bold: "global markets",
  },
  ar: {
    before: "استكشف الحلول الذكية لزيادة ثروتك في ",
    bold: "الأسواق العالمية",
  },
};

export const benefitsCtaText: Bilingual<string> = {
  en: "Get Started",
  ar: "ابدأ",
};

export const benefitsBadge = {
  label: "Benefits",
  labelAr: "الفوائد",
};

export const benefitsImages = {
  phone: "/images/Phonesection2.png",
  centerLogo: "/images/small logo.png",
};
