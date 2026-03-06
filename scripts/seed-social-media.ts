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
    heroTitle: "Social Media",
    sectionHeading: "All Namaya social media platforms in one place",
    sectionDescription:
      "Namaya is present on various social media platforms to share educational content, analyses, market updates, and to showcase real customer experiences in audio and video. We have organized all the official links for Namaya's channels so you can follow updates with full clarity and transparency.",
    contactTitle: "Contact Us",
    contactDescription:
      "For any inquiry regarding Namaya's official channels or website content, you can contact us directly through the contact page.",
    contactCtaText: "Contact Us",
    contactCtaUrl: "/contact",
  },
  ar: {
    heroTitle: "مواقع التواصل الاجتماعي",
    sectionHeading: "كل منصات التواصل الاجتماعي الخاصة بنمايا في مكان واحد",
    sectionDescription:
      "تتواجد نمايا في منصات التواصل الاجتماعي المختلفة لتشارك المحتوى التعليمي، التحليلات، وتحديثات السوق، بالإضافة إلى عرض تجارب عملاء حقيقية بالصوت والصورة. رتبنا لك كل الروابط الرسمية لقنوات نمايا لمتابعة التحديثات بكل وضوح وشفافية.",
    contactTitle: "تواصل معنا",
    contactDescription:
      "لأي استفسار بخصوص قنوات نمايا الرسمية أو محتوى الموقع، يمكنك التواصل معنا مباشرة عبر صفحة التواصل.",
    contactCtaText: "تواصل معنا",
    contactCtaUrl: "/contact",
  },
};

const defaultChannels = [
  {
    image: "/uploads/social-instagram.jpg",
    titleEn: "Instagram – Namaya Instagram",
    titleAr: "إنستغرام – Namaya Instagram",
    descriptionEn:
      "Namaya's Instagram account, simple and quick content, awareness designs, and concise investment information for those who prefer fast and clear information.",
    descriptionAr:
      "حساب إنستغرام لنمايا، محتوى بسيط وسريع، تصاميم توعوية، ومعلومات استثمارية مختصرة تناسب اللي يحب المعلومة السريعة والواضحة..",
    ctaTextEn: "Follow us on Instagram",
    ctaTextAr: "تابعنا على إنستغرام",
    ctaUrl: "https://www.instagram.com/namaya.ar/",
  },
  {
    image: "/uploads/social-facebook.jpg",
    titleEn: "Facebook – Namaya Facebook",
    titleAr: "فيسبوك – Namaya Facebook",
    descriptionEn:
      "Namaya's official Facebook page, a place for interaction, sharing educational content, updates, and connecting with the investor community.",
    descriptionAr:
      "صفحة فيسبوك الرسمية لنمايا، مكان للتفاعل، مشاركة المحتوى التعليمي، التحديثات، والتواصل مع مجتمع المستثمرين.",
    ctaTextEn: "Visit Facebook Page",
    ctaTextAr: "زيارة صفحة فيسبوك",
    ctaUrl: "https://www.facebook.com/Namaya.invest/",
  },
  {
    image: "/uploads/social-linkedin.jpg",
    titleEn: "LinkedIn – Namaya LinkedIn",
    titleAr: "لينكدإن – Namaya LinkedIn",
    descriptionEn:
      "Namaya's LinkedIn account, where we share economic articles, in-depth analyses, and news that interest investors who prefer professional and expert content.",
    descriptionAr:
      "حساب لينكدإن الخاص بنمايا، نشارك فيه مقالات اقتصادية، تحليلات معمّقة، وأخبار تهم المستثمرين اللي يفضلون المحتوى المهني والاحترافي.",
    ctaTextEn: "Follow us on LinkedIn",
    ctaTextAr: "تابعنا على لينكدان",
    ctaUrl: "https://www.linkedin.com/company/namaya-ar/",
  },
  {
    image: "/uploads/social-slideshare.jpg",
    titleEn: "SlideShare – Namaya SlideShare",
    titleAr: "سلايد شير – Namaya SlideShare",
    descriptionEn:
      "We share on SlideShare presentations and educational materials explaining investment and trading concepts in a clear and concise manner, suitable for beginners and enthusiasts.",
    descriptionAr:
      "نشارك على منصة سلايد شير عروض تقديمية ومواد تعليمية تشرح مفاهيم الاستثمار والتداول بأسلوب واضح ومختصر، تناسب المبتدئين والمهتمين.",
    ctaTextEn: "Go to SlideShare",
    ctaTextAr: "انتقل لسلايد شير",
    ctaUrl: "https://www.slideshare.net/slideshow/company-profile-namaya-investment/284980830",
  },
  {
    image: "/uploads/social-telegram.jpg",
    titleEn: "Telegram – Namaya Telegram",
    titleAr: "تلغرام – Namaya Telegram",
    descriptionEn:
      "Namaya's official Telegram channel, where we post daily investment content, market analyses, opportunities, and alerts to help you stay informed. Follow us for the latest developments in financial markets, currencies, and stocks, and get exclusive insights and analyses to help you make better investment decisions.",
    descriptionAr:
      "قناة التلغرام الرسمية لنمايا، ننزل فيها محتوى استثماري يومي، تحليلات سوق، فرص، وتنبيهات تساعدك تكون دايم بالصورة. تابع معنا آخر التطورات في الأسواق المالية والعملات والأسهم، واحصل على رؤى وتحليلات حصرية تساعدك في اتخاذ قرارات استثمارية أفضل.",
    ctaTextEn: "Follow us on Telegram",
    ctaTextAr: "تابعنا على تلغرام",
    ctaUrl: "https://t.me/Namaya_sa",
  },
  {
    image: "/uploads/social-youtube.jpg",
    titleEn: "YouTube – Namaya YouTube",
    titleAr: "يوتيوب – Namaya YouTube",
    descriptionEn:
      "Namaya's official YouTube channel, where we share educational videos and market analyses, in addition to real customer clips sharing their experiences with Namaya and their investment journey.",
    descriptionAr:
      "قناة يوتيوب الرسمية لنمايا، نشارك فيها فيديوهات تعليمية وتحليلات للسوق، بالإضافة إلى مقاطع حقيقية لعملاء يشاركوا عن تجاربهم مع نمايا وكيف كانت رحلتهم الاستثمارية.",
    ctaTextEn: "Visit YouTube Channel",
    ctaTextAr: "زيارة قناة يوتيوب",
    ctaUrl: "https://www.youtube.com/@Namaya-ar",
  },
];

async function main() {
  // Upsert content
  await prisma.contentBlock.upsert({
    where: { key: "socialMedia.content" },
    update: { valueJson: JSON.stringify(defaultContent) },
    create: { key: "socialMedia.content", valueJson: JSON.stringify(defaultContent) },
  });
  console.log("Upserted socialMedia.content");

  // Upsert channels
  await prisma.contentBlock.upsert({
    where: { key: "socialMedia.channels" },
    update: { valueJson: JSON.stringify(defaultChannels) },
    create: { key: "socialMedia.channels", valueJson: JSON.stringify(defaultChannels) },
  });
  console.log("Upserted socialMedia.channels with", defaultChannels.length, "channels");

  console.log("\nDone! The social media page now has content and all 6 channels.");
  console.log("NOTE: You need to upload images to /public/uploads/ with these names:");
  defaultChannels.forEach((c) => console.log("  ", c.image));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
