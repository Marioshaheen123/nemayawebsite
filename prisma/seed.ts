/**
 * Prisma Seed Script
 *
 * Populates the database from all existing data files.
 * Run with: npx prisma db seed  OR  npx tsx prisma/seed.ts
 *
 * NOTE: Uses relative imports (not @/ alias) because this runs outside Next.js.
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

// ─── Data imports ─────────────────────────────────────────────────────────────

// Blog
import {
  blogArticles,
  suggestedArticles,
  moreArticlesCards,
  blogSectionData,
  blogPageHeroTitle,
} from "../src/data/blog";

// FAQ
import {
  homepageFaqItems,
  homepageFaqHeading,
  homepageFaqBadge,
  faqCategories,
  faqPageHeroTitle,
  faqPageIntroText,
} from "../src/data/faq";

// Pricing / Plans
import {
  allPlans,
  planFeatures,
  pricingSectionHeading,
  pricingSectionBadge,
  pricingViewAllLabel,
  accountTypesPageHeroTitle,
  accountTypesPageHeading,
} from "../src/data/pricing";

// Navigation
import {
  headerNavItems,
  headerCta,
  footerQuickLinks,
  footerSupportLinks,
  footerSocialIcons,
  footerLabels,
  footerContactInfo,
} from "../src/data/navigation";

// Financial Assets
import {
  assets,
  cards,
  heroTitle as assetsHeroTitle,
  heroSubtitle as assetsHeroSubtitle,
  exploreLabel,
  cardImages,
  backLabel,
  ctaSection as assetCtaSection,
  tableHeaders,
  sectionTitles,
  howToStartSteps,
} from "../src/data/financialAssets";

// Videos
import {
  videos,
  heroTitle as videosHeroTitle,
  watchNowLabel,
  moreVideoLabel,
  keyTakeawaysLabel,
  directLinkLabel,
} from "../src/data/videos";

// About
import {
  heroContent as aboutHeroContent,
  redefiningBadge,
  redefiningContent,
  stats as aboutStats,
  visionBadge,
  visionTitle,
  visionCards,
  visionImages,
  missionTitle,
  valuesBadge,
  valuesHeading,
  values,
  valuesImage,
  securityBadge,
  securityContent,
  bridgingContent,
  bridgingImage,
  blogSectionBadge as aboutBlogSectionBadge,
  blogSectionHeading as aboutBlogSectionHeading,
} from "../src/data/about";

// Homepage
import {
  heroContent as homepageHeroContent,
  heroImages as homepageHeroImages,
} from "../src/data/homepage/hero";

import {
  benefitsFeatures,
  benefitsHeading,
  benefitsCtaText,
  benefitsBadge,
  benefitsImages,
} from "../src/data/homepage/benefits";

import {
  carouselCards,
  carouselHeading,
  carouselBadge,
} from "../src/data/homepage/benefitsCarousel";

import {
  howItWorksContent,
  howItWorksBadge,
  howItWorksImage,
} from "../src/data/homepage/howItWorks";

// Trading Platforms
import {
  content as tradingPlatformsContent,
  mockupImage as tradingMockupImage,
  checkIcon as tradingCheckIcon,
} from "../src/data/tradingPlatforms";

// Contact
import { i18n as contactI18n, TOTAL_STEPS as contactTotalSteps } from "../src/data/contact";

// Economic Calendar
import {
  sampleData as calendarSampleData,
  i18n as calendarI18n,
  currencyToCountry,
} from "../src/data/economicCalendar";

// Auth
import {
  loginText,
  registerText,
  ageOptions,
  countryOptions,
  callTimeOptions,
  forgotPasswordText,
  resetPasswordText,
  verifyEmailText,
  verifyNumberText,
  verifyCodeText,
} from "../src/data/auth";

// Legal
import {
  heroTitle as ppHeroTitle,
  sections as ppSections,
} from "../src/data/legal/privacyPolicy";

import {
  heroTitle as termsHeroTitle,
  sections as termsSections,
} from "../src/data/legal/terms";

import {
  heroTitle as irHeroTitle,
  sectionLabels,
  rulingsData,
} from "../src/data/legal/islamicRulings";

// ─── Prisma client ────────────────────────────────────────────────────────────

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log("Starting seed...");

  // ── 1. Delete all existing data (order matters due to FK constraints) ────────
  console.log("Deleting existing data...");

  await prisma.socialIcon.deleteMany();
  await prisma.navItem.deleteMany(); // self-referential: children first handled by cascade
  await prisma.islamicRulingItem.deleteMany();
  await prisma.islamicRulingSection.deleteMany();
  await prisma.legalSection.deleteMany();
  await prisma.assetFaq.deleteMany();
  await prisma.assetAdvantage.deleteMany();
  await prisma.instrument.deleteMany();
  await prisma.financialAsset.deleteMany();
  await prisma.planFeature.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.faqCategory.deleteMany();
  await prisma.suggestedArticle.deleteMany();
  await prisma.blogArticle.deleteMany();
  await prisma.video.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("All existing data deleted.");

  // ── 2. AdminUser ─────────────────────────────────────────────────────────────
  console.log("Seeding AdminUser...");

  const hashedPassword = await bcrypt.hash("Admin123!@#", 12);
  await prisma.adminUser.create({
    data: {
      email: "admin@nemaya.ar",
      hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  // ── 3. ContentBlock ──────────────────────────────────────────────────────────
  console.log("Seeding ContentBlock...");

  const contentBlocks: { key: string; value: unknown }[] = [
    // Blog
    { key: "blog.sectionData", value: blogSectionData },
    { key: "blog.pageHeroTitle", value: blogPageHeroTitle },
    { key: "blog.moreArticlesCards", value: moreArticlesCards },
    // FAQ
    { key: "faq.homepageFaqHeading", value: homepageFaqHeading },
    { key: "faq.homepageFaqBadge", value: homepageFaqBadge },
    { key: "faq.pageHeroTitle", value: faqPageHeroTitle },
    { key: "faq.pageIntroText", value: faqPageIntroText },
    // Pricing
    { key: "pricing.sectionHeading", value: pricingSectionHeading },
    { key: "pricing.sectionBadge", value: pricingSectionBadge },
    { key: "pricing.viewAllLabel", value: pricingViewAllLabel },
    { key: "pricing.accountTypesPageHeroTitle", value: accountTypesPageHeroTitle },
    { key: "pricing.accountTypesPageHeading", value: accountTypesPageHeading },
    // Navigation
    { key: "navigation.headerCta", value: headerCta },
    { key: "navigation.footerLabels", value: footerLabels },
    { key: "navigation.footerContactInfo", value: footerContactInfo },
    // Financial Assets
    { key: "financialAssets.heroTitle", value: assetsHeroTitle },
    { key: "financialAssets.heroSubtitle", value: assetsHeroSubtitle },
    { key: "financialAssets.exploreLabel", value: exploreLabel },
    { key: "financialAssets.cardImages", value: cardImages },
    { key: "financialAssets.backLabel", value: backLabel },
    { key: "financialAssets.ctaSection", value: assetCtaSection },
    { key: "financialAssets.tableHeaders", value: tableHeaders },
    { key: "financialAssets.sectionTitles", value: sectionTitles },
    { key: "financialAssets.howToStartSteps", value: howToStartSteps },
    { key: "financialAssets.cards", value: cards },
    // Videos
    { key: "videos.heroTitle", value: videosHeroTitle },
    { key: "videos.watchNowLabel", value: watchNowLabel },
    { key: "videos.moreVideoLabel", value: moreVideoLabel },
    { key: "videos.keyTakeawaysLabel", value: keyTakeawaysLabel },
    { key: "videos.directLinkLabel", value: directLinkLabel },
    // About
    { key: "about.heroContent", value: aboutHeroContent },
    { key: "about.redefiningBadge", value: redefiningBadge },
    { key: "about.redefiningContent", value: redefiningContent },
    { key: "about.stats", value: aboutStats },
    { key: "about.visionBadge", value: visionBadge },
    { key: "about.visionTitle", value: visionTitle },
    { key: "about.visionCards", value: visionCards },
    { key: "about.visionImages", value: visionImages },
    { key: "about.missionTitle", value: missionTitle },
    { key: "about.valuesBadge", value: valuesBadge },
    { key: "about.valuesHeading", value: valuesHeading },
    { key: "about.values", value: values },
    { key: "about.valuesImage", value: valuesImage },
    { key: "about.securityBadge", value: securityBadge },
    { key: "about.securityContent", value: securityContent },
    { key: "about.bridgingContent", value: bridgingContent },
    { key: "about.bridgingImage", value: bridgingImage },
    { key: "about.blogSectionBadge", value: aboutBlogSectionBadge },
    { key: "about.blogSectionHeading", value: aboutBlogSectionHeading },
    // Homepage
    { key: "homepage.heroContent", value: homepageHeroContent },
    { key: "homepage.heroImages", value: homepageHeroImages },
    { key: "homepage.benefitsFeatures", value: benefitsFeatures },
    { key: "homepage.benefitsHeading", value: benefitsHeading },
    { key: "homepage.benefitsCtaText", value: benefitsCtaText },
    { key: "homepage.benefitsBadge", value: benefitsBadge },
    { key: "homepage.benefitsImages", value: benefitsImages },
    { key: "homepage.carouselCards", value: carouselCards },
    { key: "homepage.carouselHeading", value: carouselHeading },
    { key: "homepage.carouselBadge", value: carouselBadge },
    { key: "homepage.howItWorksContent", value: howItWorksContent },
    { key: "homepage.howItWorksBadge", value: howItWorksBadge },
    { key: "homepage.howItWorksImage", value: howItWorksImage },
    // Trading Platforms
    { key: "tradingPlatforms.content", value: tradingPlatformsContent },
    { key: "tradingPlatforms.mockupImage", value: tradingMockupImage },
    { key: "tradingPlatforms.checkIcon", value: tradingCheckIcon },
    // Contact
    { key: "contact.i18n", value: contactI18n },
    { key: "contact.totalSteps", value: contactTotalSteps },
    // Economic Calendar
    { key: "economicCalendar.sampleData", value: calendarSampleData },
    { key: "economicCalendar.i18n", value: calendarI18n },
    { key: "economicCalendar.currencyToCountry", value: currencyToCountry },
    // Auth
    { key: "auth.loginText", value: loginText },
    { key: "auth.registerText", value: registerText },
    { key: "auth.ageOptions", value: ageOptions },
    { key: "auth.countryOptions", value: countryOptions },
    { key: "auth.callTimeOptions", value: callTimeOptions },
    { key: "auth.forgotPasswordText", value: forgotPasswordText },
    { key: "auth.resetPasswordText", value: resetPasswordText },
    { key: "auth.verifyEmailText", value: verifyEmailText },
    { key: "auth.verifyNumberText", value: verifyNumberText },
    { key: "auth.verifyCodeText", value: verifyCodeText },
    // Legal
    { key: "legal.privacyPolicyHeroTitle", value: ppHeroTitle },
    { key: "legal.termsHeroTitle", value: termsHeroTitle },
    { key: "legal.islamicRulingsHeroTitle", value: irHeroTitle },
    { key: "legal.islamicRulingsSectionLabels", value: sectionLabels },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.create({
      data: {
        key: block.key,
        valueJson: JSON.stringify(block.value),
      },
    });
  }

  // ── 4. BlogArticle ───────────────────────────────────────────────────────────
  console.log("Seeding BlogArticle...");

  const enArticles = blogArticles.en;
  const arArticles = blogArticles.ar;

  // Build a map from slug (id) -> ar article for matching by index
  // EN and AR arrays have the same length; match by index
  const articleCount = Math.min(enArticles.length, arArticles.length);

  for (let i = 0; i < articleCount; i++) {
    const en = enArticles[i];
    const ar = arArticles[i];

    await prisma.blogArticle.create({
      data: {
        slug: en.id,
        imageUrl: en.image,
        day: en.day,
        monthEn: en.month,
        monthAr: ar.month,
        readTimeEn: en.readTime,
        readTimeAr: ar.readTime,
        titleEn: en.title,
        titleAr: ar.title,
        excerptEn: en.excerpt,
        excerptAr: ar.excerpt,
        bodyEn: JSON.stringify(en.body),
        bodyAr: JSON.stringify(ar.body),
        suggestedBreakAfter: en.suggestedBreakAfter ?? null,
        published: true,
        sortOrder: i,
      },
    });
  }

  // ── 5. SuggestedArticle ──────────────────────────────────────────────────────
  console.log("Seeding SuggestedArticle...");

  const enSuggested = suggestedArticles.en;
  const arSuggested = suggestedArticles.ar;
  const suggestedCount = Math.min(enSuggested.length, arSuggested.length);

  for (let i = 0; i < suggestedCount; i++) {
    const en = enSuggested[i];
    const ar = arSuggested[i];

    await prisma.suggestedArticle.create({
      data: {
        imageUrl: en.image,
        titleEn: en.title,
        titleAr: ar.title,
        slug: en.slug,
        sortOrder: i,
      },
    });
  }

  // ── 6. FaqCategory + FaqItem ─────────────────────────────────────────────────
  console.log("Seeding FaqCategory + FaqItem...");

  // 6a. Homepage FAQ (isHomepage = true)
  const homepageCat = await prisma.faqCategory.create({
    data: {
      nameEn: "Homepage",
      nameAr: "الصفحة الرئيسية",
      sortOrder: 0,
      isHomepage: true,
    },
  });

  const enHomepageFaqs = homepageFaqItems.en;
  const arHomepageFaqs = homepageFaqItems.ar;
  const homepageFaqCount = Math.min(enHomepageFaqs.length, arHomepageFaqs.length);

  for (let i = 0; i < homepageFaqCount; i++) {
    await prisma.faqItem.create({
      data: {
        questionEn: enHomepageFaqs[i].question,
        questionAr: arHomepageFaqs[i].question,
        answerEn: enHomepageFaqs[i].answer,
        answerAr: arHomepageFaqs[i].answer,
        sortOrder: i,
        categoryId: homepageCat.id,
      },
    });
  }

  // 6b. Regular FAQ categories
  const enCategories = faqCategories.en;
  const arCategories = faqCategories.ar;
  const catCount = Math.min(enCategories.length, arCategories.length);

  for (let ci = 0; ci < catCount; ci++) {
    const enCat = enCategories[ci];
    const arCat = arCategories[ci];

    const cat = await prisma.faqCategory.create({
      data: {
        nameEn: enCat.name,
        nameAr: arCat.name,
        sortOrder: ci + 1, // offset by 1 since homepage is 0
        isHomepage: false,
      },
    });

    const enQuestions = enCat.questions;
    const arQuestions = arCat.questions;
    const qCount = Math.min(enQuestions.length, arQuestions.length);

    for (let qi = 0; qi < qCount; qi++) {
      await prisma.faqItem.create({
        data: {
          questionEn: enQuestions[qi].question,
          questionAr: arQuestions[qi].question,
          answerEn: enQuestions[qi].answer,
          answerAr: arQuestions[qi].answer,
          sortOrder: qi,
          categoryId: cat.id,
        },
      });
    }
  }

  // ── 7. Plan + PlanFeature ────────────────────────────────────────────────────
  console.log("Seeding Plan + PlanFeature...");

  const enPlans = allPlans.en;
  const arPlans = allPlans.ar;
  const planCount = Math.min(enPlans.length, arPlans.length);

  for (let i = 0; i < planCount; i++) {
    const en = enPlans[i];
    const ar = arPlans[i];

    await prisma.plan.create({
      data: {
        nameEn: en.name,
        nameAr: ar.name,
        priceEn: en.price,
        priceAr: ar.price,
        periodEn: en.period,
        periodAr: ar.period,
        descriptionEn: en.description,
        descriptionAr: ar.description,
        featuresLabelEn: en.featuresLabel,
        featuresLabelAr: ar.featuresLabel,
        ctaEn: en.cta,
        ctaAr: ar.cta,
        ctaStyle: en.ctaStyle,
        bg: en.bg,
        gradient: en.gradient ?? false,
        sortOrder: i,
      },
    });
  }

  const enFeatures = planFeatures.en;
  const arFeatures = planFeatures.ar;
  const featureCount = Math.min(enFeatures.length, arFeatures.length);

  for (let i = 0; i < featureCount; i++) {
    await prisma.planFeature.create({
      data: {
        labelEn: enFeatures[i],
        labelAr: arFeatures[i],
        sortOrder: i,
      },
    });
  }

  // ── 8. FinancialAsset + Instrument + AssetAdvantage + AssetFaq ───────────────
  console.log("Seeding FinancialAsset + related models...");

  const enAssets = assets.en;
  const arAssets = assets.ar;

  // Build a map from slug -> ar asset for matching
  const arAssetBySlug = new Map(arAssets.map((a) => [a.slug, a]));
  // Also get card stats from the cards export (cards have stats array)
  const enCardBySlug = new Map(
    cards.en.map((c) => [c.slug, c])
  );
  const arCardBySlug = new Map(
    cards.ar.map((c) => [c.slug, c])
  );

  for (let i = 0; i < enAssets.length; i++) {
    const enAsset = enAssets[i];
    const arAsset = arAssetBySlug.get(enAsset.slug);

    if (!arAsset) {
      console.warn(`No AR asset found for slug: ${enAsset.slug}, skipping.`);
      continue;
    }

    const enCard = enCardBySlug.get(enAsset.slug);
    const arCard = arCardBySlug.get(enAsset.slug);

    const financialAsset = await prisma.financialAsset.create({
      data: {
        slug: enAsset.slug,
        nameEn: enAsset.name,
        nameAr: arAsset.name,
        headlineEn: enAsset.headline,
        headlineAr: arAsset.headline,
        descriptionEn: enAsset.description,
        descriptionAr: arAsset.description,
        imageUrl: enAsset.image,
        statsEn: JSON.stringify(enCard?.stats ?? []),
        statsAr: JSON.stringify(arCard?.stats ?? []),
        whatIsEn: JSON.stringify(enAsset.whatIs),
        whatIsAr: JSON.stringify(arAsset.whatIs),
        sortOrder: i,
      },
    });

    // Instruments — match EN and AR by index
    const enInstruments = enAsset.instruments;
    const arInstruments = arAsset.instruments;
    const instrCount = Math.min(enInstruments.length, arInstruments.length);

    for (let j = 0; j < instrCount; j++) {
      const enI = enInstruments[j];
      const arI = arInstruments[j];

      await prisma.instrument.create({
        data: {
          nameEn: enI.name,
          nameAr: arI.name,
          symbol: enI.symbol,
          spread: enI.spread,
          leverage: enI.leverage,
          hours: enI.hours,
          sortOrder: j,
          assetId: financialAsset.id,
        },
      });
    }

    // Advantages — match EN and AR by index
    const enAdvantages = enAsset.advantages;
    const arAdvantages = arAsset.advantages;
    const advCount = Math.min(enAdvantages.length, arAdvantages.length);

    for (let j = 0; j < advCount; j++) {
      const enA = enAdvantages[j];
      const arA = arAdvantages[j];

      await prisma.assetAdvantage.create({
        data: {
          titleEn: enA.title,
          titleAr: arA.title,
          descEn: enA.desc,
          descAr: arA.desc,
          sortOrder: j,
          assetId: financialAsset.id,
        },
      });
    }

    // FAQs — match EN and AR by index
    const enFaqs = enAsset.faq;
    const arFaqs = arAsset.faq;
    const faqCount = Math.min(enFaqs.length, arFaqs.length);

    for (let j = 0; j < faqCount; j++) {
      const enF = enFaqs[j];
      const arF = arFaqs[j];

      await prisma.assetFaq.create({
        data: {
          questionEn: enF.q,
          questionAr: arF.q,
          answerEn: enF.a,
          answerAr: arF.a,
          sortOrder: j,
          assetId: financialAsset.id,
        },
      });
    }
  }

  // ── 9. Video ─────────────────────────────────────────────────────────────────
  console.log("Seeding Video...");

  const enVideos = videos.en;
  const arVideos = videos.ar;

  // Build a map from id -> ar video for matching
  const arVideoById = new Map(arVideos.map((v) => [v.id, v]));

  for (let i = 0; i < enVideos.length; i++) {
    const en = enVideos[i];
    const ar = arVideoById.get(en.id);

    if (!ar) {
      console.warn(`No AR video found for id: ${en.id}, skipping.`);
      continue;
    }

    await prisma.video.create({
      data: {
        videoId: en.id,
        titleEn: en.title,
        titleAr: ar.title,
        descEn: en.desc,
        descAr: ar.desc,
        fullDescEn: en.fullDesc,
        fullDescAr: ar.fullDesc,
        takeawaysEn: JSON.stringify(en.takeaways),
        takeawaysAr: JSON.stringify(ar.takeaways),
        linkTextEn: en.linkText,
        linkTextAr: ar.linkText,
        day: en.day,
        monthEn: en.month,
        monthAr: ar.month,
        durationEn: en.duration,
        durationAr: ar.duration,
        videoUrl: en.videoUrl,
        labelEn: en.label ?? "",
        labelAr: ar.label ?? "",
        sortOrder: i,
      },
    });
  }

  // ── 10. LegalSection — Privacy Policy ────────────────────────────────────────
  console.log("Seeding LegalSection (privacyPolicy)...");

  const enPpSections = ppSections.en;
  const arPpSections = ppSections.ar;
  const ppCount = Math.min(enPpSections.length, arPpSections.length);

  for (let i = 0; i < ppCount; i++) {
    const en = enPpSections[i];
    const ar = arPpSections[i];

    await prisma.legalSection.create({
      data: {
        pageType: "privacyPolicy",
        titleEn: en.title,
        titleAr: ar.title,
        paragraphsEn: JSON.stringify(en.paragraphs),
        paragraphsAr: JSON.stringify(ar.paragraphs),
        sortOrder: i,
      },
    });
  }

  // ── 11. LegalSection — Terms & Conditions ────────────────────────────────────
  console.log("Seeding LegalSection (terms)...");

  const enTermsSections = termsSections.en;
  const arTermsSections = termsSections.ar;
  const termsCount = Math.min(enTermsSections.length, arTermsSections.length);

  for (let i = 0; i < termsCount; i++) {
    const en = enTermsSections[i];
    const ar = arTermsSections[i];

    await prisma.legalSection.create({
      data: {
        pageType: "terms",
        titleEn: en.title,
        titleAr: ar.title,
        paragraphsEn: JSON.stringify(en.paragraphs),
        paragraphsAr: JSON.stringify(ar.paragraphs),
        sortOrder: i,
      },
    });
  }

  // ── 12. IslamicRulingSection + IslamicRulingItem ──────────────────────────────
  console.log("Seeding IslamicRulingSection + IslamicRulingItem...");

  const enRulings = rulingsData.en;
  const arRulings = rulingsData.ar;

  // Match sections by index
  const rulingsSectionCount = Math.min(enRulings.length, arRulings.length);

  for (let si = 0; si < rulingsSectionCount; si++) {
    const enSection = enRulings[si];
    const arSection = arRulings[si];

    const section = await prisma.islamicRulingSection.create({
      data: {
        nameEn: enSection.name,
        nameAr: arSection.name,
        sortOrder: si,
      },
    });

    const enItems = enSection.items;
    const arItems = arSection.items;
    const itemCount = Math.min(enItems.length, arItems.length);

    for (let ii = 0; ii < itemCount; ii++) {
      const enItem = enItems[ii];
      const arItem = arItems[ii];

      await prisma.islamicRulingItem.create({
        data: {
          titleEn: enItem.title,
          titleAr: arItem.title,
          questionEn: enItem.question,
          questionAr: arItem.question,
          answerEn: enItem.answer,
          answerAr: arItem.answer,
          muftiEn: enItem.mufti,
          muftiAr: arItem.mufti,
          sortOrder: ii,
          sectionId: section.id,
        },
      });
    }
  }

  // ── 13. NavItem — Header ─────────────────────────────────────────────────────
  console.log("Seeding NavItem (header)...");

  const enHeaderNav = headerNavItems.en;
  const arHeaderNav = headerNavItems.ar;
  const headerNavCount = Math.min(enHeaderNav.length, arHeaderNav.length);

  for (let i = 0; i < headerNavCount; i++) {
    const en = enHeaderNav[i];
    const ar = arHeaderNav[i];

    // Create parent nav item
    const parent = await prisma.navItem.create({
      data: {
        location: "header",
        labelEn: en.label,
        labelAr: ar.label,
        href: en.href,
        hasDropdown: en.hasDropdown,
        sortOrder: i,
        parentId: null,
      },
    });

    // Create children if any
    const enChildren = en.children ?? [];
    const arChildren = ar.children ?? [];
    const childCount = Math.min(enChildren.length, arChildren.length);

    for (let j = 0; j < childCount; j++) {
      await prisma.navItem.create({
        data: {
          location: "header",
          labelEn: enChildren[j].label,
          labelAr: arChildren[j].label,
          href: enChildren[j].href,
          hasDropdown: false,
          sortOrder: j,
          parentId: parent.id,
        },
      });
    }
  }

  // ── 14. NavItem — Footer Quick Links ─────────────────────────────────────────
  console.log("Seeding NavItem (footerQuickLinks)...");

  const enQuickLinks = footerQuickLinks.en;
  const arQuickLinks = footerQuickLinks.ar;
  const quickLinksCount = Math.min(enQuickLinks.length, arQuickLinks.length);

  for (let i = 0; i < quickLinksCount; i++) {
    await prisma.navItem.create({
      data: {
        location: "footerQuickLinks",
        labelEn: enQuickLinks[i].label,
        labelAr: arQuickLinks[i].label,
        href: enQuickLinks[i].href,
        hasDropdown: false,
        sortOrder: i,
        parentId: null,
      },
    });
  }

  // ── 15. NavItem — Footer Support Links ───────────────────────────────────────
  console.log("Seeding NavItem (footerSupportLinks)...");

  const enSupportLinks = footerSupportLinks.en;
  const arSupportLinks = footerSupportLinks.ar;
  const supportLinksCount = Math.min(enSupportLinks.length, arSupportLinks.length);

  for (let i = 0; i < supportLinksCount; i++) {
    await prisma.navItem.create({
      data: {
        location: "footerSupportLinks",
        labelEn: enSupportLinks[i].label,
        labelAr: arSupportLinks[i].label,
        href: enSupportLinks[i].href,
        hasDropdown: false,
        sortOrder: i,
        parentId: null,
      },
    });
  }

  // ── 16. SocialIcon ────────────────────────────────────────────────────────────
  console.log("Seeding SocialIcon...");

  for (let i = 0; i < footerSocialIcons.length; i++) {
    const icon = footerSocialIcons[i];
    await prisma.socialIcon.create({
      data: {
        src: icon.src,
        alt: icon.alt,
        href: icon.href,
        sortOrder: i,
      },
    });
  }

  console.log("Seed completed successfully!");
}

// ─── Run ──────────────────────────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
