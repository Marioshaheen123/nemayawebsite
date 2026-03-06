import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";
import { bodyToHtml } from "./body-utils";

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

/** Batch-fetch multiple content blocks — cached on the server for 120s */
export async function getContentBlocks(keys: string[]): Promise<Record<string, any>> {
  const sortedKeys = [...keys].sort().join(",");
  return unstable_cache(
    async () => {
      const blocks = await prisma.contentBlock.findMany({
        where: { key: { in: keys } },
      });
      const map: Record<string, any> = {};
      for (const block of blocks) {
        try {
          map[block.key] = JSON.parse(block.valueJson);
        } catch {
          map[block.key] = null;
        }
      }
      return map;
    },
    [`content-blocks-${sortedKeys}`],
    { tags: ["content-blocks"], revalidate: 120 }
  )();
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
        imageAlt: (a as any).imageAltEn || a.titleEn,
        day: a.day,
        month: a.monthEn,
        readTime: a.readTimeEn,
        title: a.titleEn,
        excerpt: a.excerptEn,
        body: bodyToHtml(a.bodyEn),
        suggestedBreakAfter: a.suggestedBreakAfter,
        category: (a as any).category || undefined,
        tags: (a as any).tags || undefined,
      })),
      ar: articles.map((a) => ({
        id: a.slug,
        image: a.imageUrl,
        imageAlt: (a as any).imageAltAr || a.titleAr,
        day: a.day,
        month: a.monthAr,
        readTime: a.readTimeAr,
        title: a.titleAr,
        excerpt: a.excerptAr,
        body: bodyToHtml(a.bodyAr),
        suggestedBreakAfter: a.suggestedBreakAfter,
        category: (a as any).category || undefined,
        tags: (a as any).tags || undefined,
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

function parseBenefitsJson(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

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
        ctaUrl: p.ctaUrl || "/register",
        featuresLabel: p.featuresLabelEn,
        ctaStyle: p.ctaStyle,
        bg: p.bg,
        gradient: p.gradient || undefined,
        benefits: parseBenefitsJson(p.benefitsEn),
      })),
      ar: plans.map((p) => ({
        name: p.nameAr,
        price: p.priceAr,
        period: p.periodAr,
        description: p.descriptionAr,
        cta: p.ctaAr,
        ctaUrl: p.ctaUrl || "/register",
        featuresLabel: p.featuresLabelAr,
        ctaStyle: p.ctaStyle,
        bg: p.bg,
        gradient: p.gradient || undefined,
        benefits: parseBenefitsJson(p.benefitsAr),
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

// ─── Economic Developments ──────────────────────────────────────────

export async function getEconomicDevelopments() {
  return prisma.economicDevelopment.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getEconomicDevelopmentsBilingual() {
  const articles = await getEconomicDevelopments();

  // Auto-generate suggested: latest 4 non-featured articles
  const featured = articles.find((a) => a.featured) || articles[0];
  const suggestedRaw = articles
    .filter((a) => a !== featured)
    .slice(0, 4);

  return {
    articles: {
      en: articles.map((a) => ({
        id: a.slug,
        image: a.imageUrl,
        imageAlt: (a as any).imageAltEn || a.titleEn,
        day: a.day,
        month: a.monthEn,
        readTime: a.readTimeEn,
        title: a.titleEn,
        excerpt: a.excerptEn,
        body: bodyToHtml(a.bodyEn),
        featured: a.featured,
        category: (a as any).category || undefined,
        tags: (a as any).tags || undefined,
      })),
      ar: articles.map((a) => ({
        id: a.slug,
        image: a.imageUrl,
        imageAlt: (a as any).imageAltAr || a.titleAr,
        day: a.day,
        month: a.monthAr,
        readTime: a.readTimeAr,
        title: a.titleAr,
        excerpt: a.excerptAr,
        body: bodyToHtml(a.bodyAr),
        featured: a.featured,
        category: (a as any).category || undefined,
        tags: (a as any).tags || undefined,
      })),
    },
    suggested: {
      en: suggestedRaw.map((a) => ({
        image: a.imageUrl,
        title: a.titleEn,
        slug: a.slug,
      })),
      ar: suggestedRaw.map((a) => ({
        image: a.imageUrl,
        title: a.titleAr,
        slug: a.slug,
      })),
    },
  };
}

// ─── Images ──────────────────────────────────────────────────────────

export async function getSiteImages(category?: string) {
  return prisma.siteImage.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

// ─── Shared Layout Data ─────────────────────────────────────────────

// Combined header + footer fetch: 2 DB round-trips instead of 6
export async function getLayoutData() {
  // 1) Batch all content blocks in ONE query
  const blocks = await getContentBlocks([
    'navigation.headerCta',
    'navigation.footerLabels',
    'navigation.footerContactInfo',
  ]);

  // 2) Run all nav/social queries in parallel (simple findMany — safe for Turso)
  const [navItems, quickLinks, supportLinks, socialIcons] = await Promise.all([
    getHeaderNavItems(),
    getFooterQuickLinks(),
    getFooterSupportLinks(),
    getSocialIcons(),
  ]);

  const cta = blocks['navigation.headerCta'] || { en: { signup: 'Sign up', login: 'Log in' }, ar: { signup: 'سجل', login: 'تسجيل الدخول' } };
  const labels = blocks['navigation.footerLabels'] || { en: {}, ar: {} };
  const contactInfo = blocks['navigation.footerContactInfo'] || {};

  return {
    headerData: {
      headerNavItems: {
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
      },
      headerCta: cta,
    },
    footerData: {
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
    },
  };
}

// Keep individual functions for backward compatibility
export async function getHeaderData() {
  const { headerData } = await getLayoutData();
  return headerData;
}

export async function getFooterData() {
  const { footerData } = await getLayoutData();
  return footerData;
}

// ─── Homepage Data ──────────────────────────────────────────────────
export async function getHomepageData() {
  // Batch-fetch all content blocks in a single query to avoid Turso P2028 transaction timeouts
  const blocks = await getContentBlocks([
    'homepage.heroContent', 'homepage.heroImages',
    'homepage.benefitsFeatures', 'homepage.benefitsHeading', 'homepage.benefitsCtaText', 'homepage.benefitsBadge', 'homepage.benefitsImages',
    'homepage.carouselCards', 'homepage.carouselHeading', 'homepage.carouselBadge',
    'homepage.howItWorksContent', 'homepage.howItWorksBadge', 'homepage.howItWorksImage',
    'pricing.sectionHeading', 'pricing.sectionBadge', 'pricing.viewAllLabel',
    'blog.sectionData',
    'faq.homepageFaqHeading', 'faq.homepageFaqBadge',
  ]);

  // Sequential DB queries for non-content-block data
  const homepagePlans = await getHomepagePlans();
  const planFeatures = await getPlanFeatures();
  const homepageFaqItems = await getHomepageFaqItems();

  return {
    hero: { heroContent: blocks['homepage.heroContent'], heroImages: blocks['homepage.heroImages'] },
    benefits: {
      features: blocks['homepage.benefitsFeatures'],
      heading: blocks['homepage.benefitsHeading'],
      ctaText: blocks['homepage.benefitsCtaText'],
      badge: blocks['homepage.benefitsBadge'],
      images: blocks['homepage.benefitsImages'],
    },
    carousel: { cards: blocks['homepage.carouselCards'], heading: blocks['homepage.carouselHeading'], badge: blocks['homepage.carouselBadge'] },
    howItWorks: { content: blocks['homepage.howItWorksContent'], badge: blocks['homepage.howItWorksBadge'], image: blocks['homepage.howItWorksImage'] },
    pricing: {
      sectionHeading: blocks['pricing.sectionHeading'],
      sectionBadge: blocks['pricing.sectionBadge'],
      viewAllLabel: blocks['pricing.viewAllLabel'],
      plans: homepagePlans,
      features: planFeatures,
    },
    blog: { sectionData: blocks['blog.sectionData'] },
    faq: { heading: blocks['faq.homepageFaqHeading'], badge: blocks['faq.homepageFaqBadge'], items: homepageFaqItems },
  };
}
