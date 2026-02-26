import type { Bilingual, AboutStat, VisionCard, ValueItem } from "@/data/types";

// ─── Hero ────────────────────────────────────────────────────────────────────

export const heroContent: Bilingual<{
  title1: string;
  title2: string;
  subtitle: string;
}> = {
  en: {
    title1: "Empowering your Financial",
    title2: "Ambitions",
    subtitle:
      "A bridge between traditional stability and the future of digital trading.",
  },
  ar: {
    title1: "تمكين طموحاتك",
    title2: "المالية",
    subtitle: "جسر بين الاستقرار التقليدي ومستقبل التداول الرقمي.",
  },
};

// ─── Redefining Investment ───────────────────────────────────────────────────

export const redefiningBadge = { label: "Who We Are", labelAr: "من نحن" };

export const redefiningContent: Bilingual<{
  title1: string;
  title2: string;
  p1: string;
  p2: string;
}> = {
  en: {
    title1: "Redefining Investment in the ",
    title2: "Kingdom",
    p1: "Namaya is a premier financial services provider specializing in innovative trading and investment solutions. Headquartered in Riyadh, it serves a diverse base of retail and institutional clients across Saudi Arabia and the GCC.",
    p2: "With over a decade of regional expertise, we combine local market wisdom with world-class technology to make global markets accessible to everyone.",
  },
  ar: {
    title1: "إعادة تعريف الاستثمار في ",
    title2: "المملكة",
    p1: "نامايا هي مزود رائد للخدمات المالية متخصص في حلول التداول والاستثمار المبتكرة. يقع مقرها الرئيسي في الرياض، وتخدم قاعدة متنوعة من العملاء الأفراد والمؤسسات عبر المملكة العربية السعودية ودول مجلس التعاون الخليجي.",
    p2: "مع أكثر من عقد من الخبرة الإقليمية، نجمع بين حكمة السوق المحلية والتكنولوجيا العالمية المستوى لجعل الأسواق العالمية متاحة للجميع.",
  },
};

export const stats: Bilingual<AboutStat[]> = {
  en: [
    { value: "10+", label: "Years of Global Market Expertise" },
    { value: "50+", label: "High-Impact Transactions Executed" },
    { value: "100%", label: "Sharia-Compliant Trading Environment" },
  ],
  ar: [
    { value: "10+", label: "سنوات من الخبرة في السوق العالمية" },
    { value: "50+", label: "صفقات عالية التأثير تم تنفيذها" },
    { value: "100%", label: "بيئة تداول متوافقة مع الشريعة" },
  ],
};

// ─── Vision ──────────────────────────────────────────────────────────────────

export const visionBadge = { label: "Our Vision", labelAr: "الرؤية والرسالة" };

export const visionTitle: Bilingual<string> = {
  en: "Our Vision: Shaping a prosperous future through regional wealth creation in line with Vision 2030.",
  ar: "رؤيتنا: تشكيل مستقبل مزدهر من خلال خلق الثروة الإقليمية بما يتماشى مع رؤية 2030.",
};

export const visionCards: Bilingual<VisionCard[]> = {
  en: [
    { title: "National Pride", desc: "Fostering a prosperous future for our nation" },
    { title: "Technological Prowess", desc: "Continuously evolving to stay ahead of market trends" },
    { title: "Human-Centric", desc: "Placing your financial growth at the heart of our business" },
    { title: "Hope in the Future", desc: "Achieving financial goals with confidence and ease" },
  ],
  ar: [
    { title: "الفخر الوطني", desc: "تعزيز مستقبل مزدهر لأمتنا" },
    { title: "البراعة التكنولوجية", desc: "التطور المستمر للبقاء في صدارة اتجاهات السوق" },
    { title: "مركزية الإنسان", desc: "وضع نموك المالي في قلب أعمالنا" },
    { title: "الأمل في المستقبل", desc: "تحقيق الأهداف المالية بثقة وسهولة" },
  ],
};

export const visionImages = [
  "/images/about-vision-1.jpg",
  "/images/about-vision-2.jpg",
  "/images/about-vision-3.jpg",
  "/images/about-vision-4.jpg",
];

// ─── Mission ─────────────────────────────────────────────────────────────────

export const missionTitle: Bilingual<string> = {
  en: "Our Mission: Empowering investors with seamless, secure, and Sharia-compliant trading tools.",
  ar: "مهمتنا: تمكين المستثمرين من أدوات تداول سلسة وآمنة ومتوافقة مع الشريعة.",
};

// ─── Values ──────────────────────────────────────────────────────────────────

export const valuesBadge = { label: "Our Values", labelAr: "قيمنا" };

export const valuesHeading: Bilingual<{
  part1: string;
  bold1: string;
  part2: string;
  bold2: string;
}> = {
  en: {
    part1: "Built on ",
    bold1: "trust, ",
    part2: "driven by your financial ",
    bold2: "success.",
  },
  ar: {
    part1: "مبنية على ",
    bold1: "الثقة، ",
    part2: "مدفوعة بنجاحك ",
    bold2: "المالي.",
  },
};

export const values: Bilingual<ValueItem[]> = {
  en: [
    { label: "Integrity:", desc: "We uphold the highest ethical standards in every transaction." },
    { label: "Innovation:", desc: "We continuously evolve our technology to stay ahead of market trends." },
    { label: "Client-Centricity:", desc: "Your financial growth is the heartbeat of our business." },
  ],
  ar: [
    { label: "النزاهة:", desc: "نحن نلتزم بأعلى المعايير الأخلاقية في كل معاملة." },
    { label: "الابتكار:", desc: "نحن نطور تقنيتنا باستمرار للبقاء في صدارة اتجاهات السوق." },
    { label: "محورية العميل:", desc: "نموك المالي هو نبض أعمالنا." },
  ],
};

export const valuesImage = "/images/about-values-bg.jpg";

// ─── Security ────────────────────────────────────────────────────────────────

export const securityBadge = { label: "Security & Compliance", labelAr: "الأمان والامتثال" };

export const securityContent: Bilingual<{
  title1: string;
  title2: string;
  title3: string;
  p1: string;
  p2: string;
}> = {
  en: {
    title1: "Uncompromising ",
    title2: "Security",
    title3: " for Your Peace of Mind",
    p1: "At Namaya, we prioritize the safety of your investments above all else. By combining state-of-the-art encryption technology with strict regulatory compliance, we ensure that your capital is protected within a secure and reliable environment.",
    p2: "We are dedicated to maintaining a transparent and professional space for every investor. Your trust is our most valuable asset, and we work tirelessly to uphold it and earn your confidence every single day.",
  },
  ar: {
    title1: "أمان ",
    title2: "لا يتزعزع",
    title3: " من أجل راحتك النفسية",
    p1: "في نامايا، نضع سلامة استثماراتك فوق كل شيء. من خلال دمج تقنية التشفير المتطورة مع الامتثال الصارم للوائح، نضمن حماية رأس مالك ضمن بيئة آمنة وموثوقة.",
    p2: "نحن ملتزمون بالحفاظ على مساحة شفافة ومهنية لكل مستثمر. ثقتك هي أغلى أصولنا، ونعمل بلا كلل للحفاظ عليها وكسب ثقتك كل يوم.",
  },
};

// ─── Bridging Global Markets ─────────────────────────────────────────────────

export const bridgingContent: Bilingual<{
  title: string;
  p1: string;
  p2: string;
  cta: string;
}> = {
  en: {
    title: "Bridging Global Markets with Local Wisdom",
    p1: "Namaya stands at the intersection of traditional financial stability and the fast-moving future of digital trading. Born from a strategic joint venture between Al Fouzan Group and Omran Al Omran & Partners, we leverage over a decade of global market expertise to deliver a premium trading experience.",
    p2: "Our ecosystem is designed for both retail and institutional investors in the Kingdom, providing a sophisticated yet intuitive dashboard that makes global markets accessible to everyone. We are committed to transparency, speed, and continuous evolution to ensure you stay ahead of market trends.",
    cta: "Explore Our Trading Platforms",
  },
  ar: {
    title: "ربط الأسواق العالمية بالحكمة المحلية",
    p1: "تقف نماء عند تقاطع الاستقرار المالي التقليدي ومستقبل التداول الرقمي السريع. وُلدت من مشروع مشترك استراتيجي بين مجموعة الفوزان وعمران العمران وشركاه، نحن نستفيد من أكثر من عقد من الخبرة في الأسواق العالمية لتقديم تجربة تداول متميزة.",
    p2: "تم تصميم نظامنا البيئي لكل من المستثمرين الأفراد والمؤسسات في المملكة، حيث يوفر لوحة تحكم متطورة وسهلة الاستخدام تجعل الأسواق العالمية متاحة للجميع. نحن ملتزمون بالشفافية والسرعة والتطور المستمر لضمان بقائك في صدارة اتجاهات السوق.",
    cta: "استكشف منصات التداول الخاصة بنا",
  },
};

export const bridgingImage = "/images/about-bridging.jpg";

// ─── Blog Section ────────────────────────────────────────────────────────────

export const blogSectionBadge = { label: "Blog and News", labelAr: "المدونة والأخبار" };

export const blogSectionHeading: Bilingual<{
  before: string;
  bold: string;
}> = {
  en: { before: "What's New at ", bold: "Namaya" },
  ar: { before: "ما الجديد في ", bold: "نامايا" },
};
