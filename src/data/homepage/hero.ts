import type { Bilingual } from "@/data/types";

export const heroContent: Bilingual<{
  headlineBefore: string;
  headlineHighlight: string;
  subtitle: string;
  cta: string;
}> = {
  en: {
    headlineBefore: "Invest now in ",
    headlineHighlight: "Intelligence",
    subtitle:
      "Be smart and invest in your assets with peace of mind. Namaya is your secure Saudi platform for trading in the local and global markets.",
    cta: "Get Started",
  },
  ar: {
    headlineBefore: "استثمر الآن في\n",
    headlineHighlight: "الذكاء",
    subtitle:
      "كن ذكياً واستثمر في أصولك براحة بال. نامايا هي منصتك الآمنة للتداول في الأسواق المحلية والعالمية.",
    cta: "ابدأ الآن",
  },
};

export const heroImages = {
  background: "/images/hero-bg.jpg",
  person: "/images/hero-person.png",
};
