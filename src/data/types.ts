export type Lang = "en" | "ar";
export type Bilingual<T> = { en: T; ar: T };

// --- Navigation ---
export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  hasDropdown: boolean;
  href: string;
  children?: NavChild[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialIcon {
  src: string;
  alt: string;
  href: string;
}

// --- Homepage Sections ---
export interface BenefitFeature {
  title: string;
  description: string;
}

export interface CarouselCard {
  image: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  bullets: string[];
}

// --- Pricing / Plans ---
export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaUrl: string;
  featuresLabel: string;
  ctaStyle: string;
  bg: string;
  gradient?: boolean;
}

// --- Blog ---
export interface BlogArticleSummary {
  id: string;
  image: string;
  day: string;
  month: string;
  readTime: string;
  title: string;
  excerpt: string;
}

export interface BlogArticleFull extends BlogArticleSummary {
  body: string[];
  suggestedBreakAfter?: number;
}

export interface SuggestedArticle {
  image: string;
  title: string;
  slug: string;
}

// --- FAQ ---
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  name: string;
  questions: FaqItem[];
}

// --- About ---
export interface AboutStat {
  value: string;
  label: string;
}

export interface VisionCard {
  title: string;
  desc: string;
}

export interface ValueItem {
  label: string;
  desc: string;
}

// --- Financial Assets ---
export interface FinancialAssetCard {
  slug: string;
  name: string;
  headline: string;
  description: string;
  stats: string[];
}

export interface Instrument {
  name: string;
  symbol: string;
  spread: string;
  leverage: string;
  hours: string;
}

export interface AssetAdvantage {
  title: string;
  desc: string;
}

export interface AssetFaqItem {
  q: string;
  a: string;
}

export interface FinancialAssetDetail {
  slug: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  instruments: Instrument[];
  whatIs: string[];
  advantages: AssetAdvantage[];
  faq: AssetFaqItem[];
}

// --- Videos ---
export interface Video {
  id: string;
  title: string;
  desc: string;
  fullDesc: string;
  takeaways: string[];
  linkText: string;
  day: string;
  month: string;
  duration: string;
  videoUrl: string;
  label?: string;
}

// --- Legal ---
export interface LegalSection {
  title: string;
  paragraphs: string[];
}

// --- Islamic Rulings ---
export interface RulingItem {
  title: string;
  question: string;
  answer: string;
  mufti: string;
}

export interface RulingSection {
  name: string;
  items: RulingItem[];
}
