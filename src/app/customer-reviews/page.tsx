import type { Metadata } from "next";
import Header from "@/components/Header";
import CustomerReviewsPage from "@/components/CustomerReviewsPage";
import Footer from "@/components/Footer";
import { getContentBlocks, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "تقييمات العملاء",
    descriptionAr: "اطلع على تقييمات عملاء نمايا وتجاربهم الحقيقية",
    path: "/customer-reviews",
  });
}

export default async function CustomerReviews() {
  const { headerData, footerData } = await getLayoutData();
  const blocks = await getContentBlocks([
    "customerReviews.content",
    "customerReviews.reviews",
    "customerReviews.videos",
    "customerReviews.faqs",
  ]);

  const defaultContent = {
    en: {
      heroTitle: "Customer Reviews",
      heroSubtitle: "Hear from real clients who trusted Namaya with their investment journey.",
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
      ctaBannerSubtitle: "Join thousands of investors who trust Namaya",
      ctaBtn1Text: "Start Now",
      ctaBtn1Url: "/register",
      ctaBtn2Text: "Talk to a Consultant",
      ctaBtn2Url: "/contact",
      disclaimerText: "All reviews shown are from real clients. Individual results may vary.",
    },
    ar: {
      heroTitle: "تقييمات العملاء",
      heroSubtitle: "اسمع من عملاء حقيقيين وثقوا بنمايا في رحلتهم الاستثمارية.",
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
      ctaBannerSubtitle: "انضم لآلاف المستثمرين الذين يثقون بنمايا",
      ctaBtn1Text: "ابدأ الآن",
      ctaBtn1Url: "/register",
      ctaBtn2Text: "تواصل مع مستشار",
      ctaBtn2Url: "/contact",
      disclaimerText: "جميع التقييمات المعروضة من عملاء حقيقيين. النتائج الفردية قد تختلف.",
    },
  };

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <CustomerReviewsPage
        content={blocks["customerReviews.content"] || defaultContent}
        reviews={blocks["customerReviews.reviews"] || []}
        videos={blocks["customerReviews.videos"] || []}
        faqs={blocks["customerReviews.faqs"] || []}
      />
      <Footer {...footerData} />
    </main>
  );
}
