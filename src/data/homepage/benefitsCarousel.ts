import type { Bilingual, CarouselCard } from "@/data/types";

export const carouselCards: Bilingual<CarouselCard[]> = {
  en: [
    {
      image: "/images/carousel-1.jpg",
      title: "Sharia-compliant investment",
      description:
        "We provide you with investment opportunities that comply with the provisions of Islamic Sharia, so that you can invest with confidence and ease through the application, with complete ease and peace of mind.",
    },
    {
      image: "/images/carousel-2.jpg",
      title: "Daily trading recommendations",
      description:
        "Receive the best recommendations and guidance for buying and selling directly via WhatsApp or email – to achieve maximum profits with confidence and professionalism.",
    },
    {
      image: "/images/carousel-3.jpg",
      title: "A financial expert will personally accompany you",
      description:
        "Get daily support from a dedicated trading expert – consultations, guidance, and step-by-step education to begin your trading journey.",
    },
  ],
  ar: [
    {
      image: "/images/carousel-1.jpg",
      title: "استثمار متوافق مع الشريعة",
      description:
        "نقدم لك فرص استثمار تتوافق مع أحكام الشريعة الإسلامية، حتى تتمكن من الاستثمار بثقة وسهولة من خلال التطبيق، مع راحة البال التامة.",
    },
    {
      image: "/images/carousel-2.jpg",
      title: "توصيات تداول يومية",
      description:
        "احصل على أفضل التوصيات والإرشادات للشراء والبيع مباشرة عبر واتساب أو البريد الإلكتروني – لتحقيق أقصى قدر من الأرباح بثقة واحترافية.",
    },
    {
      image: "/images/carousel-3.jpg",
      title: "سيكون خبير مالي مخصص برفقتك شخصياً",
      description:
        "احصل على دعم يومي من خبير تداول مخصص – استشارات، إرشادات، وتعليم خطوة بخطوة لبدء رحلتك في التداول.",
    },
  ],
};

export const carouselHeading: Bilingual<{ bold: string; rest: string }> = {
  en: {
    bold: "Experience confident,",
    rest: " Sharia-compliant investing with a trusted Saudi platform. Trade securely, get expert guidance, and grow your investments with peace of mind.",
  },
  ar: {
    bold: "اختبر الاستثمار بثقة",
    rest: " وفقًا للشريعة مع منصة سعودية موثوقة. تداول بأمان، واحصل على إرشادات الخبراء، وزد استثماراتك براحة بال.",
  },
};

export const carouselBadge = {
  label: "Benefits",
  labelAr: "الفوائد",
};
