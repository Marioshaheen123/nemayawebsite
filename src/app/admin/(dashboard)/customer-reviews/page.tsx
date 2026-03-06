import { getContentBlocks } from "@/lib/content";
import CustomerReviewsEditor from "@/components/admin/editors/CustomerReviewsEditor";

export default async function CustomerReviewsAdminPage() {
  const blocks = await getContentBlocks([
    "customerReviews.content",
    "customerReviews.reviews",
    "customerReviews.videos",
    "customerReviews.faqs",
  ]);
  const data = {
    content: blocks["customerReviews.content"] ?? {
      en: { heroTitle: "Customer Reviews", heroSubtitle: "", heroCta1Text: "Start Now", heroCta1Url: "/register", heroCta2Text: "Talk to a Consultant", heroCta2Url: "/contact", trustpilotScore: "4.5", trustpilotLabel: "Excellent", trustpilotTotal: "Based on 200+ reviews", ratingBars: "[85,10,0,5,0]", reviewsSectionTitle: "", reviewsShowMore: "Show More", videosSectionTitle: "", ctaBannerTitle: "", ctaBannerSubtitle: "", ctaBtn1Text: "Start Now", ctaBtn1Url: "/register", ctaBtn2Text: "Talk to a Consultant", ctaBtn2Url: "/contact", disclaimerText: "" },
      ar: { heroTitle: "تقييمات العملاء", heroSubtitle: "", heroCta1Text: "ابدأ الآن", heroCta1Url: "/register", heroCta2Text: "تواصل مع مستشار", heroCta2Url: "/contact", trustpilotScore: "4.5", trustpilotLabel: "ممتاز", trustpilotTotal: "بناءً على أكثر من 200 تقييم", ratingBars: "[85,10,0,5,0]", reviewsSectionTitle: "", reviewsShowMore: "عرض المزيد", videosSectionTitle: "", ctaBannerTitle: "", ctaBannerSubtitle: "", ctaBtn1Text: "ابدأ الآن", ctaBtn1Url: "/register", ctaBtn2Text: "تواصل مع مستشار", ctaBtn2Url: "/contact", disclaimerText: "" },
    },
    reviews: blocks["customerReviews.reviews"] ?? [],
    videos: blocks["customerReviews.videos"] ?? [],
    faqs: blocks["customerReviews.faqs"] ?? [],
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <CustomerReviewsEditor initialData={data} />
    </div>
  );
}
