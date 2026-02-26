import type { Bilingual } from "@/data/types";

export const content: Bilingual<{
  heading: string;
  boldParagraph: string;
  paragraph: string;
  whyTitle: string;
  features: string[];
  closingBold: string;
  cta: string;
}> = {
  en: {
    heading:
      "From your mobile phone or laptop... your trading platform is always with you",
    boldParagraph:
      "With Namaya, your trading doesn't need to be complex. A fully Arabic platform that works on your mobile or computer, allowing you to monitor and open your trades in seconds.",
    paragraph:
      "Your recommendations reach you, and your tools are in your hands — and your full control starts from the very first Riyal.",
    whyTitle: "Why do traders choose the Namaya platform?",
    features: [
      "Simple and easy design for all levels",
      "Professional tools + protection from loss",
      "No hidden fees",
      "Works on all devices (wherever you are)",
    ],
    closingBold:
      "Start your experience with Namaya now – and let your next step be closer to achieving your financial goal",
    cta: "Start Trading Now",
  },
  ar: {
    heading:
      "من هاتفك المحمول أو الكمبيوتر المحمول... منصة التداول الخاصة بك دائمًا معك",
    boldParagraph:
      "مع نامايا، لا تحتاج تداولاتك إلى التعقيد. منصة عربية بالكامل تعمل على هاتفك المحمول أو الكمبيوتر، مما يتيح لك مراقبة وفتح تداولاتك في ثوانٍ.",
    paragraph:
      "تصل إليك توصياتك، وأدواتك بين يديك - ويسيطر عليك بالكامل بدءًا من أول ريال.",
    whyTitle: "لماذا يختار المتداولون منصة نامايا؟",
    features: [
      "تصميم بسيط وسهل لجميع المستويات",
      "أدوات احترافية + حماية من الفقدان",
      "لا توجد رسوم خفية",
      "يعمل على جميع الأجهزة (أينما كنت)",
    ],
    closingBold:
      "ابدأ تجربتك مع نامايا الآن - ودع خطوتك التالية تقترب من تحقيق هدفك المالي",
    cta: "ابدأ التداول الآن",
  },
};

export const mockupImage = "/images/trading-mockup.png";
export const checkIcon = "/images/trading-check.svg";
