import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const defaultContent = {
  en: {
    heroTitle: "Customer Reviews",
    heroSubtitle: "Hear from real clients who trusted Namaya with their investment journey. Real experiences, real results.",
    heroCta1Text: "Start Now",
    heroCta1Url: "/register",
    heroCta2Text: "Talk to a Consultant",
    heroCta2Url: "/contact",
    trustpilotScore: "4.5",
    trustpilotLabel: "Excellent",
    trustpilotTotal: "Based on 200+ reviews",
    ratingBars: "[85,10,0,5,0]",
    reviewsSectionTitle: "Trust we build with our clients day by day",
    reviewsShowMore: "Show More",
    videosSectionTitle: "Customer Stories on Video",
    ctaBannerTitle: "Start investing with confidence",
    ctaBannerSubtitle: "Join thousands of investors who trust Namaya for their financial journey",
    ctaBtn1Text: "Start Now",
    ctaBtn1Url: "/register",
    ctaBtn2Text: "Talk to a Consultant",
    ctaBtn2Url: "/contact",
    disclaimerText: "All reviews shown are from real clients. Individual results may vary based on market conditions and investment choices.",
  },
  ar: {
    heroTitle: "تقييمات العملاء",
    heroSubtitle: "اسمع من عملاء حقيقيين وثقوا بنمايا في رحلتهم الاستثمارية. تجارب حقيقية، نتائج حقيقية.",
    heroCta1Text: "ابدأ الآن",
    heroCta1Url: "/register",
    heroCta2Text: "تواصل مع مستشار",
    heroCta2Url: "/contact",
    trustpilotScore: "4.5",
    trustpilotLabel: "ممتاز",
    trustpilotTotal: "بناءً على أكثر من 200 تقييم",
    ratingBars: "[85,10,0,5,0]",
    reviewsSectionTitle: "ثقة نبنيها مع عملائنا يومًا بعد يوم",
    reviewsShowMore: "عرض المزيد",
    videosSectionTitle: "قصص العملاء بالفيديو",
    ctaBannerTitle: "ابدأ استثمارات بثقة",
    ctaBannerSubtitle: "انضم لآلاف المستثمرين الذين يثقون بنمايا في رحلتهم المالية",
    ctaBtn1Text: "ابدأ الآن",
    ctaBtn1Url: "/register",
    ctaBtn2Text: "تواصل مع مستشار",
    ctaBtn2Url: "/contact",
    disclaimerText: "جميع التقييمات المعروضة من عملاء حقيقيين. النتائج الفردية قد تختلف بناءً على ظروف السوق وخيارات الاستثمار.",
  },
};

const defaultReviews = [
  {
    stars: 5,
    badgeEn: "Responsiveness",
    badgeAr: "الاستجابة",
    textEn: "The customer service team was incredibly responsive. They answered all my questions quickly and helped me set up my account in no time. Highly recommended!",
    textAr: "فريق خدمة العملاء كان سريع الاستجابة بشكل لا يصدق. أجابوا على جميع أسئلتي بسرعة وساعدوني في إعداد حسابي في وقت قصير. أنصح بهم بشدة!",
    authorEn: "Ahmed M.",
    authorAr: "أحمد م.",
  },
  {
    stars: 5,
    badgeEn: "Credibility",
    badgeAr: "المصداقية",
    textEn: "I was skeptical at first, but Namaya proved to be a trustworthy platform. Transparent fees, reliable execution, and my withdrawals are always processed on time.",
    textAr: "كنت متشككًا في البداية، لكن نمايا أثبتت أنها منصة جديرة بالثقة. رسوم شفافة، تنفيذ موثوق، وعمليات السحب تتم دائمًا في الوقت المحدد.",
    authorEn: "Fatima K.",
    authorAr: "فاطمة ك.",
  },
  {
    stars: 5,
    badgeEn: "Support",
    badgeAr: "الدعم",
    textEn: "The educational resources and personal support from my account manager made all the difference. I feel confident in my investment decisions thanks to Namaya.",
    textAr: "الموارد التعليمية والدعم الشخصي من مدير حسابي أحدث فرقًا كبيرًا. أشعر بالثقة في قراراتي الاستثمارية بفضل نمايا.",
    authorEn: "Khalid S.",
    authorAr: "خالد س.",
  },
  {
    stars: 5,
    badgeEn: "Responsiveness",
    badgeAr: "الاستجابة",
    textEn: "Fast execution speeds and a user-friendly platform. The mobile app works perfectly for trading on the go. Great experience overall!",
    textAr: "سرعة تنفيذ عالية ومنصة سهلة الاستخدام. التطبيق يعمل بشكل ممتاز للتداول أثناء التنقل. تجربة رائعة بشكل عام!",
    authorEn: "Sara A.",
    authorAr: "سارة أ.",
  },
  {
    stars: 5,
    badgeEn: "Credibility",
    badgeAr: "المصداقية",
    textEn: "As a beginner, I needed a platform that would guide me. Namaya's team was patient and professional. My portfolio has grown steadily since I started.",
    textAr: "كمبتدئ، كنت بحاجة لمنصة ترشدني. فريق نمايا كان صبورًا ومحترفًا. محفظتي نمت بشكل مستمر منذ أن بدأت.",
    authorEn: "Omar H.",
    authorAr: "عمر ح.",
  },
  {
    stars: 5,
    badgeEn: "Support",
    badgeAr: "الدعم",
    textEn: "Excellent withdrawal process - fast and hassle-free. I received my funds within 24 hours. The transparency is what keeps me with Namaya.",
    textAr: "عملية سحب ممتازة - سريعة وبدون أي تعقيد. استلمت أموالي خلال 24 ساعة. الشفافية هي ما يبقيني مع نمايا.",
    authorEn: "Noura T.",
    authorAr: "نورة ت.",
  },
];

const defaultVideos = [
  {
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    captionEn: "Excellent withdrawal experience",
    captionAr: "تجربة سحب ممتازة",
  },
  {
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    captionEn: "We got quick results",
    captionAr: "حصلنا نتيجة سريعة",
  },
  {
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    captionEn: "My opinion after a month",
    captionAr: "رأيي بعد شهر",
  },
];

const defaultFaqs = [
  {
    questionEn: "Is our company trustworthy?",
    questionAr: "هل شركتنا موثوقة؟",
    answerEn: "Yes, Namaya is a fully licensed and regulated financial company. We operate under strict compliance standards and our clients' funds are held in segregated accounts for maximum protection.",
    answerAr: "نعم، نمايا شركة مالية مرخصة ومنظمة بالكامل. نعمل وفق معايير امتثال صارمة وأموال عملائنا محفوظة في حسابات منفصلة لأقصى حماية.",
  },
  {
    questionEn: "How does the withdrawal process work?",
    questionAr: "كيف تتم عملية السحب؟",
    answerEn: "Withdrawals are processed within 24 hours on business days. Simply submit a withdrawal request through your personal area and the funds will be transferred to your registered bank account.",
    answerAr: "تتم معالجة عمليات السحب خلال 24 ساعة في أيام العمل. ببساطة قدم طلب سحب من خلال منطقتك الشخصية وسيتم تحويل الأموال إلى حسابك البنكي المسجل.",
  },
  {
    questionEn: "Is the account Islamic?",
    questionAr: "هل الحساب إسلامي؟",
    answerEn: "Yes, we offer Islamic trading accounts that are fully compliant with Sharia principles. These accounts have no swap or overnight interest charges.",
    answerAr: "نعم، نقدم حسابات تداول إسلامية متوافقة بالكامل مع مبادئ الشريعة. هذه الحسابات لا تحتوي على رسوم مبادلة أو فوائد ليلية.",
  },
  {
    questionEn: "How do I get started?",
    questionAr: "كيف أبدأ؟",
    answerEn: "Getting started is easy! Register on our website, complete the verification process, fund your account, and you're ready to start trading. Our team is available to guide you through every step.",
    answerAr: "البدء سهل! سجل على موقعنا، أكمل عملية التحقق، مول حسابك، وأنت جاهز لبدء التداول. فريقنا متاح لإرشادك في كل خطوة.",
  },
];

async function main() {
  await prisma.contentBlock.upsert({
    where: { key: "customerReviews.content" },
    update: { valueJson: JSON.stringify(defaultContent) },
    create: { key: "customerReviews.content", valueJson: JSON.stringify(defaultContent) },
  });
  console.log("Upserted customerReviews.content");

  await prisma.contentBlock.upsert({
    where: { key: "customerReviews.reviews" },
    update: { valueJson: JSON.stringify(defaultReviews) },
    create: { key: "customerReviews.reviews", valueJson: JSON.stringify(defaultReviews) },
  });
  console.log("Upserted customerReviews.reviews with", defaultReviews.length, "reviews");

  await prisma.contentBlock.upsert({
    where: { key: "customerReviews.videos" },
    update: { valueJson: JSON.stringify(defaultVideos) },
    create: { key: "customerReviews.videos", valueJson: JSON.stringify(defaultVideos) },
  });
  console.log("Upserted customerReviews.videos with", defaultVideos.length, "videos");

  await prisma.contentBlock.upsert({
    where: { key: "customerReviews.faqs" },
    update: { valueJson: JSON.stringify(defaultFaqs) },
    create: { key: "customerReviews.faqs", valueJson: JSON.stringify(defaultFaqs) },
  });
  console.log("Upserted customerReviews.faqs with", defaultFaqs.length, "faqs");

  console.log("\nDone! The customer reviews page now has all content seeded.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
