import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://namaya.com";
const SITE_NAME_AR = "نمايا";
const SITE_NAME_EN = "Namaya";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
const DEFAULT_DESCRIPTION_AR =
  "كن ذكيًا واستثمر في أصولك بأمان. نمايا هي منصتك السعودية الآمنة للتداول في الأسواق المحلية والعالمية.";

// ─── Metadata Builder ────────────────────────────────────────────────

export interface SeoInput {
  titleAr: string;
  titleEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  path: string;
  ogImageUrl?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  keywords?: string;
}

export function buildMetadata(input: SeoInput): Metadata {
  const canonical = `${SITE_URL}${input.path}`;
  const title = input.titleAr;
  const description = input.descriptionAr;
  const ogImage = input.ogImageUrl
    ? input.ogImageUrl.startsWith("http")
      ? input.ogImageUrl
      : `${SITE_URL}${input.ogImageUrl}`
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: input.keywords || undefined,
    alternates: {
      canonical,
      languages: {
        ar: canonical,
        en: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME_AR,
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      type: input.type === "article" ? "article" : "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(input.type === "article" && input.publishedTime
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ─── JSON-LD Builders ────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME_EN,
    alternateName: SITE_NAME_AR,
    url: SITE_URL,
    logo: `${SITE_URL}/images/nemayalogo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+966135117700",
      email: "Info@namaya.ar",
      areaServed: "SA",
      availableLanguage: ["Arabic", "English"],
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME_AR,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  modifiedTime: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${SITE_URL}${article.imageUrl}`,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_EN,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/nemayalogo.png`,
      },
    },
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function financialProductJsonLd(asset: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: asset.name,
    description: asset.description,
    url: asset.url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME_EN,
    },
  };
}

export { SITE_URL, SITE_NAME_AR, SITE_NAME_EN, DEFAULT_OG_IMAGE, DEFAULT_DESCRIPTION_AR };
