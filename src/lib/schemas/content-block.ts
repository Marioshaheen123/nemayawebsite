import { z } from "zod";

// ─── Shared bilingual helpers ────────────────────────────────────────
const bi = z.object({ en: z.string().max(5000), ar: z.string().max(5000) });
const biShort = z.object({ en: z.string().max(500), ar: z.string().max(500) });
const badge = z.object({
  label: z.string().max(200),
  labelAr: z.string().max(200),
});

// ─── FAQ ─────────────────────────────────────────────────────────────
export const faqSchema = z.object({
  heroTitle: biShort,
  introText: z.object({
    en: z.object({ left: z.string().max(5000), right: z.string().max(5000) }),
    ar: z.object({ left: z.string().max(5000), right: z.string().max(5000) }),
  }),
  categories: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        nameEn: z.string().max(200).optional().default(""),
        nameAr: z.string().max(200).optional().default(""),
        isHomepage: z.boolean().optional().default(false),
        questions: z
          .array(
            z.object({
              questionEn: z.string().max(2000).optional().default(""),
              questionAr: z.string().max(2000).optional().default(""),
              answerEn: z.string().max(50_000).optional().default(""),
              answerAr: z.string().max(50_000).optional().default(""),
            })
          )
          .max(200)
          .optional()
          .default([]),
      })
    )
    .max(50),
});

// ─── Islamic Rulings ─────────────────────────────────────────────────
export const islamicRulingsSchema = z.object({
  heroTitle: biShort,
  sectionLabels: z.object({
    en: z.object({
      question: z.string().max(200),
      answer: z.string().max(200),
      mufti: z.string().max(200),
    }),
    ar: z.object({
      question: z.string().max(200),
      answer: z.string().max(200),
      mufti: z.string().max(200),
    }),
  }),
  sections: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        nameEn: z.string().max(200).optional().default(""),
        nameAr: z.string().max(200).optional().default(""),
        items: z
          .array(
            z.object({
              titleEn: z.string().max(500).optional().default(""),
              titleAr: z.string().max(500).optional().default(""),
              questionEn: z.string().max(5000).optional().default(""),
              questionAr: z.string().max(5000).optional().default(""),
              answerEn: z.string().max(50_000).optional().default(""),
              answerAr: z.string().max(50_000).optional().default(""),
              muftiEn: z.string().max(500).optional().default(""),
              muftiAr: z.string().max(500).optional().default(""),
            })
          )
          .max(200)
          .optional()
          .default([]),
      })
    )
    .max(50),
});

// ─── Legal ───────────────────────────────────────────────────────────
export const legalSchema = z.object({
  pageType: z.enum(["privacy", "terms", "deposit-withdrawal", "website-verification", "security-reliability"]),
  heroTitle: biShort,
  sections: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        titleEn: z.string().max(500).optional().default(""),
        titleAr: z.string().max(500).optional().default(""),
        paragraphsEn: z.union([z.string(), z.array(z.string())]).transform(
          (v) => (typeof v === "string" ? v : JSON.stringify(v))
        ),
        paragraphsAr: z.union([z.string(), z.array(z.string())]).transform(
          (v) => (typeof v === "string" ? v : JSON.stringify(v))
        ),
      })
    )
    .max(100),
});

// ─── Account Types / Plans ───────────────────────────────────────────
export const planSchema = z.object({
  nameEn: z.string().max(200).optional().default(""),
  nameAr: z.string().max(200).optional().default(""),
  priceEn: z.string().max(100).optional().default(""),
  priceAr: z.string().max(100).optional().default(""),
  periodEn: z.string().max(100).optional().default(""),
  periodAr: z.string().max(100).optional().default(""),
  descriptionEn: z.string().max(2000).optional().default(""),
  descriptionAr: z.string().max(2000).optional().default(""),
  featuresLabelEn: z.string().max(200).optional().default(""),
  featuresLabelAr: z.string().max(200).optional().default(""),
  ctaEn: z.string().max(200).optional().default(""),
  ctaAr: z.string().max(200).optional().default(""),
  ctaUrl: z.string().max(2000).optional().default("/register"),
  ctaStyle: z.string().max(50).optional().default("outline"),
  bg: z.string().max(50).optional().default("#ffffff"),
  gradient: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).max(100_000).optional().default(0),
  benefitsEn: z.string().max(50_000).optional().default("[]"),
  benefitsAr: z.string().max(50_000).optional().default("[]"),
});

export const accountTypesSettingsSchema = z.object({
  heroTitle: biShort,
  pageHeading: z.object({
    en: z.object({ before: z.string().max(200), bold: z.string().max(200) }),
    ar: z.object({ before: z.string().max(200), bold: z.string().max(200) }),
  }),
});

// ─── Footer ──────────────────────────────────────────────────────────
export const footerSchema = z.object({
  labels: z.object({
    en: z.record(z.string(), z.string().max(500)),
    ar: z.record(z.string(), z.string().max(500)),
  }),
  contactInfo: z.object({
    phone: z.string().max(50),
    email: z.string().max(200),
  }),
  quickLinks: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        labelEn: z.string().max(200).optional().default(""),
        labelAr: z.string().max(200).optional().default(""),
        href: z.string().max(2000).optional().default(""),
      })
    )
    .max(50),
  supportLinks: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        labelEn: z.string().max(200).optional().default(""),
        labelAr: z.string().max(200).optional().default(""),
        href: z.string().max(2000).optional().default(""),
      })
    )
    .max(50),
  socialIcons: z
    .array(
      z.object({
        id: z.string().max(50).optional().nullable(),
        src: z.string().max(2000).optional().default(""),
        alt: z.string().max(200).optional().default(""),
        href: z.string().max(2000).optional().default(""),
      })
    )
    .max(20),
});

// ─── Homepage sections ───────────────────────────────────────────────
export const homepageHeroSchema = z.object({
  heroContent: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  heroImages: z.object({
    background: z.string().max(2000),
    person: z.string().max(2000),
  }),
});

export const homepageBenefitsSchema = z.object({
  features: z.object({ en: z.array(z.unknown()).max(50), ar: z.array(z.unknown()).max(50) }),
  heading: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  ctaText: biShort,
  badge: badge,
  images: z.object({
    phone: z.string().max(2000),
    centerLogo: z.string().max(2000),
  }),
});

export const homepageCarouselSchema = z.object({
  cards: z.object({ en: z.array(z.unknown()).max(50), ar: z.array(z.unknown()).max(50) }),
  heading: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  badge: badge,
});

export const homepageHowItWorksSchema = z.object({
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  badge: badge,
  image: z.string().max(2000),
});

export const homepageFaqSchema = z.object({
  heading: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  badge: badge,
  categoryId: z.string().max(50),
  items: z
    .array(
      z.object({
        questionEn: z.string().max(2000).optional().default(""),
        questionAr: z.string().max(2000).optional().default(""),
        answerEn: z.string().max(50_000).optional().default(""),
        answerAr: z.string().max(50_000).optional().default(""),
      })
    )
    .max(200),
});

export const homepageBlogSchema = z.object({
  sectionData: z.record(z.string(), z.unknown()),
  articles: z
    .array(
      z.object({
        id: z.string().max(50),
        titleEn: z.string().max(500),
        titleAr: z.string().max(500),
        excerptEn: z.string().max(2000),
        excerptAr: z.string().max(2000),
        imageUrl: z.string().max(2000),
        day: z.string().max(10),
        monthEn: z.string().max(50),
        monthAr: z.string().max(50),
        readTimeEn: z.string().max(50),
        readTimeAr: z.string().max(50),
      })
    )
    .max(20)
    .optional(),
});

export const homepagePricingSchema = z.object({
  sectionHeading: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  sectionBadge: badge,
  viewAllLabel: biShort,
  plans: z
    .array(
      z.object({
        nameEn: z.string().max(200).optional().default(""),
        nameAr: z.string().max(200).optional().default(""),
        priceEn: z.string().max(100).optional().default(""),
        priceAr: z.string().max(100).optional().default(""),
        periodEn: z.string().max(100).optional().default(""),
        periodAr: z.string().max(100).optional().default(""),
        descriptionEn: z.string().max(2000).optional().default(""),
        descriptionAr: z.string().max(2000).optional().default(""),
        featuresLabelEn: z.string().max(200).optional().default(""),
        featuresLabelAr: z.string().max(200).optional().default(""),
        ctaEn: z.string().max(200).optional().default(""),
        ctaAr: z.string().max(200).optional().default(""),
        ctaUrl: z.string().max(2000).optional().default("/register"),
        ctaStyle: z.string().max(50).optional().default(""),
        bg: z.string().max(50).optional().default(""),
        gradient: z.union([z.boolean(), z.string()]).optional().default(false),
        benefitsEn: z.string().max(50_000).optional().default("[]"),
        benefitsAr: z.string().max(50_000).optional().default("[]"),
      })
    )
    .max(20),
  features: z
    .array(
      z.object({
        labelEn: z.string().max(200).optional().default(""),
        labelAr: z.string().max(200).optional().default(""),
      })
    )
    .max(50),
});

// ─── About page sections ─────────────────────────────────────────────
export const aboutHeroSchema = z.object({
  heroContent: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
});

export const aboutVisionSchema = z.object({
  badge: badge,
  title: biShort,
  cards: z.object({ en: z.array(z.unknown()).max(20), ar: z.array(z.unknown()).max(20) }),
  images: z.array(z.string().max(2000)).max(20),
});

export const aboutMissionSchema = z.object({
  missionTitle: biShort,
});

export const aboutValuesSchema = z.object({
  badge: badge,
  heading: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  values: z.object({ en: z.array(z.unknown()).max(20), ar: z.array(z.unknown()).max(20) }),
  image: z.string().max(2000),
});

export const aboutSecuritySchema = z.object({
  badge: badge,
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
});

export const aboutBridgingSchema = z.object({
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  image: z.string().max(2000),
});

export const aboutRedefiningSchema = z.object({
  badge: badge,
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  stats: z.object({ en: z.array(z.unknown()).max(20), ar: z.array(z.unknown()).max(20) }),
});

export const aboutBlogSectionSchema = z.object({
  badge: badge,
  heading: z.object({
    en: z.object({ before: z.string().max(200), bold: z.string().max(200) }),
    ar: z.object({ before: z.string().max(200), bold: z.string().max(200) }),
  }),
});

// ─── Customer Reviews ───────────────────────────────────────────────
export const customerReviewsSchema = z.object({
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  reviews: z
    .array(
      z.object({
        stars: z.number().int().min(1).max(5).optional().default(5),
        badgeEn: z.string().max(200).optional().default(""),
        badgeAr: z.string().max(200).optional().default(""),
        textEn: z.string().max(5000).optional().default(""),
        textAr: z.string().max(5000).optional().default(""),
        authorEn: z.string().max(200).optional().default(""),
        authorAr: z.string().max(200).optional().default(""),
      })
    )
    .max(100),
  videos: z
    .array(
      z.object({
        youtubeUrl: z.string().max(2000).optional().default(""),
        captionEn: z.string().max(500).optional().default(""),
        captionAr: z.string().max(500).optional().default(""),
      })
    )
    .max(50),
  faqs: z
    .array(
      z.object({
        questionEn: z.string().max(2000).optional().default(""),
        questionAr: z.string().max(2000).optional().default(""),
        answerEn: z.string().max(50_000).optional().default(""),
        answerAr: z.string().max(50_000).optional().default(""),
      })
    )
    .max(50),
});

// ─── Social Media ───────────────────────────────────────────────────
export const socialMediaSchema = z.object({
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  channels: z
    .array(
      z.object({
        image: z.string().max(2000).optional().default(""),
        titleEn: z.string().max(500).optional().default(""),
        titleAr: z.string().max(500).optional().default(""),
        descriptionEn: z.string().max(5000).optional().default(""),
        descriptionAr: z.string().max(5000).optional().default(""),
        ctaTextEn: z.string().max(200).optional().default(""),
        ctaTextAr: z.string().max(200).optional().default(""),
        ctaUrl: z.string().max(2000).optional().default(""),
      })
    )
    .max(50),
});

// ─── Trading Platforms ───────────────────────────────────────────────
export const tradingPlatformsSchema = z.object({
  content: z.object({ en: z.record(z.string(), z.unknown()), ar: z.record(z.string(), z.unknown()) }),
  mockupImage: z.string().max(2000),
  checkIcon: z.string().max(2000),
});

// ─── Website Settings ────────────────────────────────────────────────
export const websiteSettingsSchema = z.object({
  accentColor: z.string().max(20),
  accentColorDark: z.string().max(20),
  gradientFrom: z.string().max(20).optional().default("#0a7f35"),
  gradientVia: z.string().max(20).optional().default("#12a544"),
  gradientTo: z.string().max(20).optional().default("#3ec95e"),
  gradientHoverFrom: z.string().max(20).optional().default("#086b2c"),
  gradientHoverVia: z.string().max(20).optional().default("#0e8e3a"),
  gradientHoverTo: z.string().max(20).optional().default("#34b552"),
  mainLogo: z.string().max(2000),
  smallLogo: z.string().max(2000),
});

// ─── Payments ────────────────────────────────────────────────────────
export const paymentsSchema = z.object({
  providers: z.array(z.record(z.string(), z.unknown())).max(20),
});

// ─── Withdrawal Settings ─────────────────────────────────────────────
export const withdrawalSettingsSchema = z.object({
  enabled: z.boolean(),
  timezone: z.string().max(100),
  schedule: z
    .array(
      z.object({
        day: z.number().int().min(0).max(6),
        slots: z
          .array(
            z.object({
              from: z.string().max(10),
              to: z.string().max(10),
            })
          )
          .max(20),
      })
    )
    .max(7),
  popupTitle: biShort,
  popupMessage: bi,
});

// ─── Bank Options ───────────────────────────────────────────────────
export const bankOptionsSchema = z.object({
  banks: z
    .array(
      z.object({
        value: z.string().min(1).max(50),
        en: z.string().min(1).max(200),
        ar: z.string().min(1).max(200),
      })
    )
    .min(1)
    .max(50),
});

// ─── SEO Settings ────────────────────────────────────────────────────
export const seoSettingsSchema = z.record(z.string(), z.unknown());

// ─── Content Search/Replace ──────────────────────────────────────────
export const contentSearchSchema = z.object({
  query: z.string().min(1).max(1000),
});

export const contentReplaceSchema = z.object({
  search: z.string().min(1).max(10_000),
  replace: z.string().max(10_000),
  targets: z
    .array(
      z.object({
        type: z.enum(["contentBlock", "model"]),
        key: z.string().max(200).optional(),
        model: z.string().max(100).optional(),
        id: z.string().max(50).optional(),
        field: z.string().max(100),
        path: z.string().max(500).optional(),
      })
    )
    .max(500),
});
