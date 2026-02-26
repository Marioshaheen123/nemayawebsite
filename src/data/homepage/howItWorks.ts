import type { Bilingual, HowItWorksStep } from "@/data/types";

export const howItWorksContent: Bilingual<{
  heading: string;
  steps: HowItWorksStep[];
}> = {
  en: {
    heading:
      "Everything is Saudi — your trading and banking transactions are 100% local.",
    steps: [
      {
        title: "Step 1",
        bullets: ["Description", "Description"],
      },
      {
        title: "Step 2",
        bullets: ["Description", "Description"],
      },
      {
        title: "Step 3",
        bullets: ["Description", "Description"],
      },
      {
        title: "Step 4",
        bullets: ["Description", "Description"],
      },
    ],
  },
  ar: {
    heading:
      "كل شيء سعودي - معاملاتك في التداول والبنوك محلية 100%.",
    steps: [
      {
        title: "الخطوة 1",
        bullets: ["الوصف", "الوصف"],
      },
      {
        title: "الخطوة 2",
        bullets: ["الوصف", "الوصف"],
      },
      {
        title: "الخطوة 3",
        bullets: ["الوصف", "الوصف"],
      },
      {
        title: "الخطوة 4",
        bullets: ["الوصف", "الوصف"],
      },
    ],
  },
};

export const howItWorksBadge = {
  label: "How It Works",
  labelAr: "كيف يعمل",
};

export const howItWorksImage = "/images/Howitworks.png";
