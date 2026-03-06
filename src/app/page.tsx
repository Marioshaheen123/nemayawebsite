import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import BenefitsCarousel from "@/components/BenefitsCarousel";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getHomepageData, getLayoutData, getBlogArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "نمايا - استثمر الآن بذكاء",
    descriptionAr: "كن ذكيًا واستثمر في أصولك بأمان. نمايا هي منصتك السعودية الآمنة للتداول في الأسواق المحلية والعالمية.",
    path: "/",
  });
}

export default async function Home() {
  const [{ headerData, footerData }, homepageData, blogArticlesRaw] = await Promise.all([
    getLayoutData(),
    getHomepageData(),
    getBlogArticles(),
  ]);

  // Transform DB plans to bilingual format
  const parseBenefits = (json: string) => { try { const a = JSON.parse(json); return Array.isArray(a) ? a : []; } catch { return []; } };
  const plansBilingual = {
    en: homepageData.pricing.plans.map((p: any) => ({
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
      benefits: parseBenefits(p.benefitsEn),
    })),
    ar: homepageData.pricing.plans.map((p: any) => ({
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
      benefits: parseBenefits(p.benefitsAr),
    })),
  };

  // Transform DB plan features to bilingual format
  const featuresBilingual = {
    en: homepageData.pricing.features.map((f: any) => f.labelEn),
    ar: homepageData.pricing.features.map((f: any) => f.labelAr),
  };

  // Transform DB FAQ items to bilingual format
  const faqItemsBilingual = {
    en: homepageData.faq.items.map((q: any) => ({
      question: q.questionEn,
      answer: q.answerEn,
    })),
    ar: homepageData.faq.items.map((q: any) => ({
      question: q.questionAr,
      answer: q.answerAr,
    })),
  };

  // Transform DB blog articles to bilingual format (first 3)
  const blogArticlesBilingual = {
    en: blogArticlesRaw.slice(0, 3).map((a: any) => ({
      id: a.slug,
      image: a.imageUrl,
      day: a.day,
      month: a.monthEn,
      readTime: a.readTimeEn,
      title: a.titleEn,
      excerpt: a.excerptEn,
    })),
    ar: blogArticlesRaw.slice(0, 3).map((a: any) => ({
      id: a.slug,
      image: a.imageUrl,
      day: a.day,
      month: a.monthAr,
      readTime: a.readTimeAr,
      title: a.titleAr,
      excerpt: a.excerptAr,
    })),
  };

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <Hero
        heroContent={homepageData.hero.heroContent}
        heroImages={homepageData.hero.heroImages}
      />
      <Benefits
        benefitsFeatures={homepageData.benefits.features}
        benefitsHeading={homepageData.benefits.heading}
        benefitsCtaText={homepageData.benefits.ctaText}

        benefitsImages={homepageData.benefits.images}
      />
      <BenefitsCarousel
        carouselCards={homepageData.carousel.cards}
        carouselHeading={homepageData.carousel.heading}

      />
      <HowItWorks
        howItWorksContent={homepageData.howItWorks.content}

        howItWorksImage={homepageData.howItWorks.image}
      />
      <Pricing
        pricingSectionHeading={homepageData.pricing.sectionHeading}

        pricingViewAllLabel={homepageData.pricing.viewAllLabel}
        plans={plansBilingual}
        features={featuresBilingual}
      />
      <Blog
        blogSectionData={homepageData.blog.sectionData}
        blogArticles={blogArticlesBilingual}
      />
      <FAQ
        homepageFaqItems={faqItemsBilingual}
        homepageFaqHeading={homepageData.faq.heading}

      />
      <Footer {...footerData} />
    </main>
  );
}
