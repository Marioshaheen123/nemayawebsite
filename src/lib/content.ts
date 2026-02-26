import { prisma } from "./prisma";

// ─── ContentBlock helpers ────────────────────────────────────────────

export async function getContentBlock<T>(key: string): Promise<T> {
  const block = await prisma.contentBlock.findUniqueOrThrow({
    where: { key },
  });
  return JSON.parse(block.valueJson) as T;
}

export async function getContentBlockSafe<T>(key: string, fallback: T): Promise<T> {
  const block = await prisma.contentBlock.findUnique({
    where: { key },
  });
  if (!block) return fallback;
  try {
    return JSON.parse(block.valueJson) as T;
  } catch {
    return fallback;
  }
}

export async function updateContentBlock(key: string, value: unknown) {
  return prisma.contentBlock.upsert({
    where: { key },
    update: { valueJson: JSON.stringify(value) },
    create: { key, valueJson: JSON.stringify(value) },
  });
}

// ─── Blog ────────────────────────────────────────────────────────────

export async function getBlogArticles() {
  return prisma.blogArticle.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllBlogArticles() {
  return prisma.blogArticle.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBlogArticleBySlug(slug: string) {
  return prisma.blogArticle.findUnique({ where: { slug } });
}

export async function getBlogArticleById(id: string) {
  return prisma.blogArticle.findUnique({ where: { id } });
}

export async function getSuggestedArticles() {
  return prisma.suggestedArticle.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

// ─── FAQ ─────────────────────────────────────────────────────────────

export async function getHomepageFaqItems() {
  const categories = await prisma.faqCategory.findMany({
    where: { isHomepage: true },
    include: { questions: { orderBy: { sortOrder: "asc" } } },
  });
  return categories.flatMap((c) => c.questions);
}

export async function getFaqCategories() {
  return prisma.faqCategory.findMany({
    include: { questions: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

// ─── Plans ───────────────────────────────────────────────────────────

export async function getPlans() {
  return prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPlanFeatures() {
  return prisma.planFeature.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getHomepagePlans() {
  return prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
}

// ─── Financial Assets ────────────────────────────────────────────────

export async function getFinancialAssetCards() {
  return prisma.financialAsset.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFinancialAssetDetail(slug: string) {
  return prisma.financialAsset.findUnique({
    where: { slug },
    include: {
      instruments: { orderBy: { sortOrder: "asc" } },
      advantages: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

// ─── Videos ──────────────────────────────────────────────────────────

export async function getVideos() {
  return prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
}

// ─── Legal ───────────────────────────────────────────────────────────

export async function getLegalSections(pageType: string) {
  return prisma.legalSection.findMany({
    where: { pageType },
    orderBy: { sortOrder: "asc" },
  });
}

// ─── Islamic Rulings ─────────────────────────────────────────────────

export async function getIslamicRulingSections() {
  return prisma.islamicRulingSection.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

// ─── Navigation ──────────────────────────────────────────────────────

export async function getHeaderNavItems() {
  return prisma.navItem.findMany({
    where: { location: "header", parentId: null },
    include: { children: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFooterQuickLinks() {
  return prisma.navItem.findMany({
    where: { location: "footerQuickLinks" },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFooterSupportLinks() {
  return prisma.navItem.findMany({
    where: { location: "footerSupportLinks" },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSocialIcons() {
  return prisma.socialIcon.findMany({ orderBy: { sortOrder: "asc" } });
}

// ─── Blog Bilingual ─────────────────────────────────────────────

export async function getBlogArticlesBilingual() {
  const articles = await getBlogArticles();
  const suggested = await getSuggestedArticles();
  return {
    articles: {
      en: articles.map((a) => ({
        id: a.slug,
        image: a.imageUrl,
        day: a.day,
        month: a.monthEn,
        readTime: a.readTimeEn,
        title: a.titleEn,
        excerpt: a.excerptEn,
        body: JSON.parse(a.bodyEn) as string[],
        suggestedBreakAfter: a.suggestedBreakAfter,
      })),
      ar: articles.map((a) => ({
        id: a.slug,
        image: a.imageUrl,
        day: a.day,
        month: a.monthAr,
        readTime: a.readTimeAr,
        title: a.titleAr,
        excerpt: a.excerptAr,
        body: JSON.parse(a.bodyAr) as string[],
        suggestedBreakAfter: a.suggestedBreakAfter,
      })),
    },
    suggested: {
      en: suggested.map((s) => ({
        image: s.imageUrl,
        title: s.titleEn,
        slug: s.slug,
      })),
      ar: suggested.map((s) => ({
        image: s.imageUrl,
        title: s.titleAr,
        slug: s.slug,
      })),
    },
  };
}

// ─── FAQ Bilingual ──────────────────────────────────────────────

export async function getFaqCategoriesBilingual() {
  const categories = await getFaqCategories();
  return {
    en: categories.map((c) => ({
      name: c.nameEn,
      questions: c.questions.map((q) => ({
        question: q.questionEn,
        answer: q.answerEn,
      })),
    })),
    ar: categories.map((c) => ({
      name: c.nameAr,
      questions: c.questions.map((q) => ({
        question: q.questionAr,
        answer: q.answerAr,
      })),
    })),
  };
}

// ─── Videos Bilingual ───────────────────────────────────────────

export async function getVideosBilingual() {
  const vids = await getVideos();
  return {
    en: vids.map((v) => ({
      id: v.videoId,
      title: v.titleEn,
      desc: v.descEn,
      fullDesc: v.fullDescEn,
      takeaways: JSON.parse(v.takeawaysEn) as string[],
      linkText: v.linkTextEn,
      day: v.day,
      month: v.monthEn,
      duration: v.durationEn,
      videoUrl: v.videoUrl,
      label: v.labelEn || undefined,
    })),
    ar: vids.map((v) => ({
      id: v.videoId,
      title: v.titleAr,
      desc: v.descAr,
      fullDesc: v.fullDescAr,
      takeaways: JSON.parse(v.takeawaysAr) as string[],
      linkText: v.linkTextAr,
      day: v.day,
      month: v.monthAr,
      duration: v.durationAr,
      videoUrl: v.videoUrl,
      label: v.labelAr || undefined,
    })),
  };
}

// ─── Plans Bilingual ────────────────────────────────────────────

export async function getPlansBilingual() {
  const plans = await getPlans();
  const features = await getPlanFeatures();
  return {
    plans: {
      en: plans.map((p) => ({
        name: p.nameEn,
        price: p.priceEn,
        period: p.periodEn,
        description: p.descriptionEn,
        cta: p.ctaEn,
        featuresLabel: p.featuresLabelEn,
        ctaStyle: p.ctaStyle,
        bg: p.bg,
        gradient: p.gradient || undefined,
      })),
      ar: plans.map((p) => ({
        name: p.nameAr,
        price: p.priceAr,
        period: p.periodAr,
        description: p.descriptionAr,
        cta: p.ctaAr,
        featuresLabel: p.featuresLabelAr,
        ctaStyle: p.ctaStyle,
        bg: p.bg,
        gradient: p.gradient || undefined,
      })),
    },
    features: {
      en: features.map((f) => f.labelEn),
      ar: features.map((f) => f.labelAr),
    },
  };
}

// ─── Legal Bilingual ────────────────────────────────────────────────

export async function getLegalSectionsBilingual(pageType: string) {
  const sections = await getLegalSections(pageType);
  return {
    en: sections.map((s: any) => ({
      title: s.titleEn,
      paragraphs: typeof s.paragraphsEn === "string" ? JSON.parse(s.paragraphsEn) : s.paragraphsEn,
    })),
    ar: sections.map((s: any) => ({
      title: s.titleAr,
      paragraphs: typeof s.paragraphsAr === "string" ? JSON.parse(s.paragraphsAr) : s.paragraphsAr,
    })),
  };
}

// ─── Islamic Rulings Bilingual ──────────────────────────────────────

export async function getIslamicRulingSectionsBilingual() {
  const sections = await getIslamicRulingSections();
  return {
    en: sections.map((s: any) => ({
      name: s.nameEn,
      items: s.items.map((item: any) => ({
        title: item.titleEn,
        question: item.questionEn,
        answer: item.answerEn,
        mufti: item.muftiEn,
      })),
    })),
    ar: sections.map((s: any) => ({
      name: s.nameAr,
      items: s.items.map((item: any) => ({
        title: item.titleAr,
        question: item.questionAr,
        answer: item.answerAr,
        mufti: item.muftiAr,
      })),
    })),
  };
}

// ─── Images ──────────────────────────────────────────────────────────

export async function getSiteImages(category?: string) {
  return prisma.siteImage.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

// ─── Dashboard Stats ─────────────────────────────────────────────────

export async function getDashboardStats() {
  const [
    blogCount,
    videoCount,
    faqCount,
    planCount,
    assetCount,
    imageCount,
  ] = await Promise.all([
    prisma.blogArticle.count(),
    prisma.video.count(),
    prisma.faqItem.count(),
    prisma.plan.count(),
    prisma.financialAsset.count(),
    prisma.siteImage.count(),
  ]);

  return { blogCount, videoCount, faqCount, planCount, assetCount, imageCount };
}

// ─── Shared Layout Data ─────────────────────────────────────────────
export async function getHeaderData() {
  const [navItems, cta] = await Promise.all([
    getHeaderNavItems(),
    getContentBlockSafe('navigation.headerCta', { en: { signup: 'Sign up', login: 'Log in' }, ar: { signup: 'سجل', login: 'تسجيل الدخول' } }),
  ]);
  // Transform DB NavItems to bilingual format matching the existing { en: NavItem[], ar: NavItem[] } shape
  const headerNavItems = {
    en: navItems.map((item: any) => ({
      label: item.labelEn,
      href: item.href,
      children: item.children?.length > 0
        ? item.children.map((c: any) => ({ label: c.labelEn, href: c.href }))
        : undefined,
    })),
    ar: navItems.map((item: any) => ({
      label: item.labelAr,
      href: item.href,
      children: item.children?.length > 0
        ? item.children.map((c: any) => ({ label: c.labelAr, href: c.href }))
        : undefined,
    })),
  };
  return { headerNavItems, headerCta: cta };
}

export async function getFooterData() {
  const [quickLinks, supportLinks, socialIcons, labels, contactInfo] = await Promise.all([
    getFooterQuickLinks(),
    getFooterSupportLinks(),
    getSocialIcons(),
    getContentBlockSafe('navigation.footerLabels', { en: {}, ar: {} }),
    getContentBlockSafe('navigation.footerContactInfo', {}),
  ]);
  return {
    footerQuickLinks: {
      en: quickLinks.map((l: any) => ({ label: l.labelEn, href: l.href })),
      ar: quickLinks.map((l: any) => ({ label: l.labelAr, href: l.href })),
    },
    footerSupportLinks: {
      en: supportLinks.map((l: any) => ({ label: l.labelEn, href: l.href })),
      ar: supportLinks.map((l: any) => ({ label: l.labelAr, href: l.href })),
    },
    footerSocialIcons: socialIcons,
    footerLabels: labels,
    footerContactInfo: contactInfo,
  };
}

// ─── Homepage Data ──────────────────────────────────────────────────
export async function getHomepageData() {
  const [
    heroContent, heroImages,
    benefitsFeatures, benefitsHeading, benefitsCtaText, benefitsBadge, benefitsImages,
    carouselCards, carouselHeading, carouselBadge,
    howItWorksContent, howItWorksBadge, howItWorksImage,
    pricingSectionHeading, pricingSectionBadge, pricingViewAllLabel,
    blogSectionData,
    faqHeading, faqBadge,
    homepagePlans, planFeatures, homepageFaqItems,
  ] = await Promise.all([
    getContentBlock('homepage.heroContent'),
    getContentBlock('homepage.heroImages'),
    getContentBlock('homepage.benefitsFeatures'),
    getContentBlock('homepage.benefitsHeading'),
    getContentBlock('homepage.benefitsCtaText'),
    getContentBlock('homepage.benefitsBadge'),
    getContentBlock('homepage.benefitsImages'),
    getContentBlock('homepage.carouselCards'),
    getContentBlock('homepage.carouselHeading'),
    getContentBlock('homepage.carouselBadge'),
    getContentBlock('homepage.howItWorksContent'),
    getContentBlock('homepage.howItWorksBadge'),
    getContentBlock('homepage.howItWorksImage'),
    getContentBlock('pricing.sectionHeading'),
    getContentBlock('pricing.sectionBadge'),
    getContentBlock('pricing.viewAllLabel'),
    getContentBlock('blog.sectionData'),
    getContentBlock('faq.homepageFaqHeading'),
    getContentBlock('faq.homepageFaqBadge'),
    getHomepagePlans(),
    getPlanFeatures(),
    getHomepageFaqItems(),
  ]);
  return {
    hero: { heroContent, heroImages },
    benefits: { features: benefitsFeatures, heading: benefitsHeading, ctaText: benefitsCtaText, badge: benefitsBadge, images: benefitsImages },
    carousel: { cards: carouselCards, heading: carouselHeading, badge: carouselBadge },
    howItWorks: { content: howItWorksContent, badge: howItWorksBadge, image: howItWorksImage },
    pricing: { sectionHeading: pricingSectionHeading, sectionBadge: pricingSectionBadge, viewAllLabel: pricingViewAllLabel, plans: homepagePlans, features: planFeatures },
    blog: { sectionData: blogSectionData },
    faq: { heading: faqHeading, badge: faqBadge, items: homepageFaqItems },
  };
}
