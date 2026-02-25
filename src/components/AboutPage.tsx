"use client";

import React from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import SectionBadge from "./SectionBadge";

const content = {
  en: {
    // Hero
    heroTitle1: "Empowering your Financial",
    heroTitle2: "Ambitions",
    heroSubtitle:
      "A bridge between traditional stability and the future of digital trading.",
    // Redefining
    redefiningTitle1: "Redefining Investment in the ",
    redefiningTitle2: "Kingdom",
    redefiningP1:
      "Namaya is a premier financial services provider specializing in innovative trading and investment solutions. Headquartered in Riyadh, it serves a diverse base of retail and institutional clients across Saudi Arabia and the GCC.",
    redefiningP2:
      "With over a decade of regional expertise, we combine local market wisdom with world-class technology to make global markets accessible to everyone.",
    stats: [
      { value: "10+", label: "Years of Global Market Expertise" },
      { value: "50+", label: "High-Impact Transactions Executed" },
      { value: "100%", label: "Sharia-Compliant Trading Environment" },
    ],
    // Vision
    visionBadge: "Our Vision",
    visionTitle1:
      "Our Vision: Shaping a prosperous future through regional wealth creation in line with Vision 2030.",
    visionCards: [
      {
        title: "National Pride",
        desc: "Fostering a prosperous future for our nation",
      },
      {
        title: "Technological Prowess",
        desc: "Continuously evolving to stay ahead of market trends",
      },
      {
        title: "Human-Centric",
        desc: "Placing your financial growth at the heart of our business",
      },
      {
        title: "Hope in the Future",
        desc: "Achieving financial goals with confidence and ease",
      },
    ],
    // Mission
    missionTitle:
      "Our Mission: Empowering investors with seamless, secure, and Sharia-compliant trading tools.",
    // Values
    valuesTitle1: "Built on ",
    valuesTitle2: "trust, ",
    valuesTitle3: "driven by your financial ",
    valuesTitle4: "success.",
    values: [
      {
        label: "Integrity:",
        desc: "We uphold the highest ethical standards in every transaction.",
      },
      {
        label: "Innovation:",
        desc: "We continuously evolve our technology to stay ahead of market trends.",
      },
      {
        label: "Client-Centricity:",
        desc: "Your financial growth is the heartbeat of our business.",
      },
    ],
    // Security
    securityTitle1: "Uncompromising ",
    securityTitle2: "Security",
    securityTitle3: " for Your Peace of Mind",
    securityP1:
      "At Namaya, we prioritize the safety of your investments above all else. By combining state-of-the-art encryption technology with strict regulatory compliance, we ensure that your capital is protected within a secure and reliable environment.",
    securityP2:
      "We are dedicated to maintaining a transparent and professional space for every investor. Your trust is our most valuable asset, and we work tirelessly to uphold it and earn your confidence every single day.",
    // Bridging
    bridgingTitle: "Bridging Global Markets with Local Wisdom",
    bridgingP1:
      "Namaya stands at the intersection of traditional financial stability and the fast-moving future of digital trading. Born from a strategic joint venture between Al Fouzan Group and Omran Al Omran & Partners, we leverage over a decade of global market expertise to deliver a premium trading experience.",
    bridgingP2:
      "Our ecosystem is designed for both retail and institutional investors in the Kingdom, providing a sophisticated yet intuitive dashboard that makes global markets accessible to everyone. We are committed to transparency, speed, and continuous evolution to ensure you stay ahead of market trends.",
    bridgingCta: "Explore Our Trading Platforms",
    // Blog
    blogTitle1: "What's New at ",
    blogTitle2: "Namaya",
  },
  ar: {
    heroTitle1: "تمكين طموحاتك",
    heroTitle2: "المالية",
    heroSubtitle: "جسر بين الاستقرار التقليدي ومستقبل التداول الرقمي.",
    redefiningTitle1: "إعادة تعريف الاستثمار في ",
    redefiningTitle2: "المملكة",
    redefiningP1:
      "نامايا هي مزود رائد للخدمات المالية متخصص في حلول التداول والاستثمار المبتكرة. يقع مقرها الرئيسي في الرياض، وتخدم قاعدة متنوعة من العملاء الأفراد والمؤسسات عبر المملكة العربية السعودية ودول مجلس التعاون الخليجي.",
    redefiningP2:
      "مع أكثر من عقد من الخبرة الإقليمية، نجمع بين حكمة السوق المحلية والتكنولوجيا العالمية المستوى لجعل الأسواق العالمية متاحة للجميع.",
    stats: [
      { value: "10+", label: "سنوات من الخبرة في السوق العالمية" },
      { value: "50+", label: "صفقات عالية التأثير تم تنفيذها" },
      { value: "100%", label: "بيئة تداول متوافقة مع الشريعة" },
    ],
    visionBadge: "الرؤية والرسالة",
    visionTitle1:
      "رؤيتنا: تشكيل مستقبل مزدهر من خلال خلق الثروة الإقليمية بما يتماشى مع رؤية 2030.",
    visionCards: [
      {
        title: "الفخر الوطني",
        desc: "تعزيز مستقبل مزدهر لأمتنا",
      },
      {
        title: "البراعة التكنولوجية",
        desc: "التطور المستمر للبقاء في صدارة اتجاهات السوق",
      },
      {
        title: "مركزية الإنسان",
        desc: "وضع نموك المالي في قلب أعمالنا",
      },
      {
        title: "الأمل في المستقبل",
        desc: "تحقيق الأهداف المالية بثقة وسهولة",
      },
    ],
    missionTitle:
      "مهمتنا: تمكين المستثمرين من أدوات تداول سلسة وآمنة ومتوافقة مع الشريعة.",
    valuesTitle1: "مبنية على ",
    valuesTitle2: "الثقة، ",
    valuesTitle3: "مدفوعة بنجاحك ",
    valuesTitle4: "المالي.",
    values: [
      {
        label: "النزاهة:",
        desc: "نحن نلتزم بأعلى المعايير الأخلاقية في كل معاملة.",
      },
      {
        label: "الابتكار:",
        desc: "نحن نطور تقنيتنا باستمرار للبقاء في صدارة اتجاهات السوق.",
      },
      {
        label: "محورية العميل:",
        desc: "نموك المالي هو نبض أعمالنا.",
      },
    ],
    securityTitle1: "أمان ",
    securityTitle2: "لا يتزعزع",
    securityTitle3: " من أجل راحتك النفسية",
    securityP1:
      "في نامايا، نضع سلامة استثماراتك فوق كل شيء. من خلال دمج تقنية التشفير المتطورة مع الامتثال الصارم للوائح، نضمن حماية رأس مالك ضمن بيئة آمنة وموثوقة.",
    securityP2:
      "نحن ملتزمون بالحفاظ على مساحة شفافة ومهنية لكل مستثمر. ثقتك هي أغلى أصولنا، ونعمل بلا كلل للحفاظ عليها وكسب ثقتك كل يوم.",
    bridgingTitle: "ربط الأسواق العالمية بالحكمة المحلية",
    bridgingP1:
      "تقف نماء عند تقاطع الاستقرار المالي التقليدي ومستقبل التداول الرقمي السريع. وُلدت من مشروع مشترك استراتيجي بين مجموعة الفوزان وعمران العمران وشركاه، نحن نستفيد من أكثر من عقد من الخبرة في الأسواق العالمية لتقديم تجربة تداول متميزة.",
    bridgingP2:
      "تم تصميم نظامنا البيئي لكل من المستثمرين الأفراد والمؤسسات في المملكة، حيث يوفر لوحة تحكم متطورة وسهلة الاستخدام تجعل الأسواق العالمية متاحة للجميع. نحن ملتزمون بالشفافية والسرعة والتطور المستمر لضمان بقائك في صدارة اتجاهات السوق.",
    bridgingCta: "استكشف منصات التداول الخاصة بنا",
    blogTitle1: "ما الجديد في ",
    blogTitle2: "نامايا",
  },
};

const visionImages = [
  "/images/about-vision-1.jpg",
  "/images/about-vision-2.jpg",
  "/images/about-vision-3.jpg",
  "/images/about-vision-4.jpg",
];

const blogArticles = {
  en: [
    {
      image: "/images/blog-1.jpg",
      day: "10",
      month: "December",
      readTime: "10 min read",
      title: "5 Tips to optimize your financial operations today",
      excerpt:
        "Practical advice to streamline workflows and reduce costs using cutting-edge tools.",
    },
    {
      image: "/images/blog-2.jpg",
      day: "09",
      month: "December",
      readTime: "7 min read",
      title: "The power of AI in financial decision-making",
      excerpt:
        "Learn how artificial intelligence is transforming financial strategies with real-time insights.",
    },
    {
      image: "/images/blog-3.jpg",
      day: "08",
      month: "December",
      readTime: "15 min read",
      title: "How fintech is changing the game",
      excerpt:
        "How technologies are reshaping the financial landscape and driving business success.",
    },
  ],
  ar: [
    {
      image: "/images/blog-1.jpg",
      day: "10",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title: "5 نصائح لتحسين عملياتك المالية اليوم",
      excerpt:
        "نصائح عملية لتبسيط سير العمل وتقليل التكاليف باستخدام أدوات متطورة.",
    },
    {
      image: "/images/blog-2.jpg",
      day: "09",
      month: "ديسمبر",
      readTime: "7 دقائق قراءة",
      title: "قوة الذكاء الاصطناعي في اتخاذ القرارات المالية",
      excerpt:
        "تعلم كيف يقوم الذكاء الاصطناعي بتحويل الاستراتيجيات المالية من خلال رؤى في الوقت الحقيقي.",
    },
    {
      image: "/images/blog-3.jpg",
      day: "08",
      month: "ديسمبر",
      readTime: "15 دقائق قراءة",
      title: "كيف تغير التكنولوجيا المالية قواعد اللعبة",
      excerpt:
        "كيف تعيد التقنيات تشكيل المشهد المالي وتدفع نحو نجاح الأعمال.",
    },
  ],
};

const readMoreLabel = { en: "Read More", ar: "اقرأ المزيد" };

export default function AboutPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = content[lang];
  const articles = blogArticles[lang];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/blog-hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-80"
          />
        </div>
        <div
          dir={isAr ? "rtl" : undefined}
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[50px] xl:py-[60px]"
        >
          <h1 className="text-white text-[32px] md:text-[48px] xl:text-[60px] font-extrabold leading-[1.15] max-w-[600px]">
            {t.heroTitle1}
            <br />
            <span className="italic text-[#b0f127]">{t.heroTitle2}</span>
          </h1>
          <p className="text-white/80 text-[14px] md:text-[16px] leading-[1.5] mt-[16px] max-w-[500px]">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ===== REDEFINING INVESTMENT ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge label="Who We Are" labelAr="من نحن" />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[30px]">
            {t.redefiningTitle1}
            <span className="font-bold">{t.redefiningTitle2}</span>
          </h2>

          {/* Two-column text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px] mb-[40px] md:mb-[60px]">
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {t.redefiningP1}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {t.redefiningP2}
            </p>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-[30px] md:gap-0 ${
              isAr ? "md:flex-row-reverse" : ""
            }`}
          >
            {t.stats.map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="hidden md:block w-px h-[60px] bg-[#cacceb] mx-[40px] xl:mx-[60px] shrink-0" />
                )}
                <div className="text-center">
                  <div className="text-[#0e314c] text-[48px] md:text-[56px] xl:text-[64px] font-bold leading-[1]">
                    {stat.value}
                  </div>
                  <p className="text-[#6084a4] text-[13px] md:text-[14px] leading-[1.4] mt-[6px]">
                    {stat.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section className="bg-[#f9f9f9] py-[50px] md:py-[70px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="text-center mb-[16px]">
            <SectionBadge label="Our Vision" labelAr="الرؤية والرسالة" />
          </div>
          <h2 className="text-center text-[#0e314c] text-[22px] md:text-[32px] xl:text-[36px] leading-[1.3] mb-[40px] max-w-[900px] mx-auto">
            {t.visionTitle1}
          </h2>

          {/* Vision cards 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px]">
            {t.visionCards.map((card, i) => (
              <div
                key={i}
                className="relative rounded-[20px] overflow-hidden aspect-[630/300] group"
              >
                <Image
                  src={visionImages[i]}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-[24px] md:p-[30px]">
                  <h3 className="text-white text-[20px] md:text-[24px] font-bold leading-[1.2] mb-[6px]">
                    {card.title}
                  </h3>
                  <p className="text-white/80 text-[13px] md:text-[14px] leading-[1.4]">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="bg-white py-[40px] md:py-[50px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto text-center">
          <h2
            dir={isAr ? "rtl" : undefined}
            className="text-[#0e314c] text-[22px] md:text-[32px] xl:text-[36px] leading-[1.3]"
          >
            {t.missionTitle}
          </h2>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-white pb-[50px] md:pb-[70px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <div className="text-center mb-[24px]">
            <SectionBadge label="Our Values" labelAr="قيمنا" />
          </div>
          <div
            dir={isAr ? "rtl" : undefined}
            className="relative rounded-[20px] overflow-hidden"
          >
            <Image
              src="/images/about-values-bg.jpg"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0e314c]/85" />
            <div className="relative z-10 flex flex-col lg:flex-row gap-[30px] lg:gap-[48px] p-[30px] md:p-[50px] xl:p-[64px]">
              {/* Values text */}
              <div className="flex-1 flex flex-col gap-[20px]">
                <h3 className="text-white text-[24px] md:text-[32px] xl:text-[36px] leading-[1.2]">
                  {t.valuesTitle1}
                  <span className="font-bold">{t.valuesTitle2}</span>
                  {t.valuesTitle3}
                  <span className="font-bold">{t.valuesTitle4}</span>
                </h3>
                {t.values.map((v, i) => (
                  <div key={i} className="flex items-start gap-[10px]">
                    <div className="mt-[6px] w-[20px] h-[20px] shrink-0">
                      <Image
                        src="/images/trading-check.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="text-white/90 text-[14px] md:text-[16px] leading-[1.5]">
                      <span className="font-bold">{v.label}</span> {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge
              label="Security & Compliance"
              labelAr="الأمان والامتثال"
            />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[30px]">
            {t.securityTitle1}
            <span className="font-bold">{t.securityTitle2}</span>
            {t.securityTitle3}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px]">
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {t.securityP1}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
              {t.securityP2}
            </p>
          </div>
        </div>
      </section>

      {/* ===== BRIDGING GLOBAL MARKETS ===== */}
      <section className="bg-[#f9f9f9] py-[50px] md:py-[70px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center gap-[30px] lg:gap-[48px]">
            {/* Text */}
            <div className="flex-1 flex flex-col gap-[20px]">
              <h2 className="text-[#0e314c] text-[25px] md:text-[32px] xl:text-[36px] font-bold leading-[1.2]">
                {t.bridgingTitle}
              </h2>
              <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
                {t.bridgingP1}
              </p>
              <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.6]">
                {t.bridgingP2}
              </p>
              <div>
                <a
                  href="/trading-platforms"
                  className="inline-flex items-center justify-center px-[36px] py-[15.5px] bg-[#12953d] border border-[#b0f127] rounded-[5px] text-white text-[14px] font-semibold leading-[21px] hover:bg-[#0e7a31] transition-all"
                >
                  {t.bridgingCta}
                </a>
              </div>
            </div>
            {/* Image */}
            <div className="flex-1 relative rounded-[20px] overflow-hidden aspect-[600/400]">
              <Image
                src="/images/about-bridging.jpg"
                alt="Bridging Global Markets"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG / WHAT'S NEW ===== */}
      <section className="bg-white py-[50px] md:py-[70px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="text-center mb-[24px]">
            <SectionBadge label="Blog and News" labelAr="المدونة والأخبار" />
          </div>
          <h2 className="text-center text-[#0e314c] text-[25px] md:text-[36px] xl:text-[42px] leading-[1.2] mb-[40px]">
            {t.blogTitle1}
            <span className="font-bold">{t.blogTitle2}</span>
          </h2>

          {/* Blog cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {articles.map((article, i) => (
              <div key={i} className="flex flex-col">
                {/* Image */}
                <div
                  className={`relative aspect-[421/298] overflow-hidden ${
                    isAr
                      ? "rounded-tr-[125px] rounded-tl-[25px]"
                      : "rounded-tl-[125px] rounded-tr-[25px]"
                  }`}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content */}
                <div className="border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[30px] pt-[56px] px-[30px]">
                  {/* Date badge + read time */}
                  <div
                    className={`flex items-end gap-4 absolute top-0 ${
                      isAr
                        ? "right-[30px] left-[30px] flex-row-reverse"
                        : "left-[30px] right-[30px]"
                    }`}
                  >
                    <div className="relative -mt-[62px]">
                      <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
                        <div className="flex flex-col items-center p-[10px]">
                          <span className="text-white text-[40px] font-bold leading-[40px]">
                            {article.day}
                          </span>
                        </div>
                        <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                          <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                            {article.month}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-[#0e314c] text-[20px] md:text-[24px] leading-[26px] md:leading-[28.8px] font-semibold mb-[10px]">
                    {article.title}
                  </h3>
                  <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-2">
                    {article.excerpt}
                  </p>
                  <a href="/blog" className="cta-glass-solid">
                    {readMoreLabel[lang]}
                    <span className="cta-arrow">{isAr ? "←" : "→"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
