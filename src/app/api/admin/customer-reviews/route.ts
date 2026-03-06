import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { customerReviewsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "customerReviews.content",
    "customerReviews.reviews",
    "customerReviews.videos",
    "customerReviews.faqs",
  ]);

  const defaultContent = {
    en: {
      heroTitle: "Customer Reviews",
      heroSubtitle: "",
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
      ctaBannerSubtitle: "",
      ctaBtn1Text: "Start Now",
      ctaBtn1Url: "/register",
      ctaBtn2Text: "Talk to a Consultant",
      ctaBtn2Url: "/contact",
      disclaimerText: "",
    },
    ar: {
      heroTitle: "تقييمات العملاء",
      heroSubtitle: "",
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
      ctaBannerSubtitle: "",
      ctaBtn1Text: "ابدأ الآن",
      ctaBtn1Url: "/register",
      ctaBtn2Text: "تواصل مع مستشار",
      ctaBtn2Url: "/contact",
      disclaimerText: "",
    },
  };

  return NextResponse.json({
    content: blocks["customerReviews.content"] ?? defaultContent,
    reviews: blocks["customerReviews.reviews"] ?? [],
    videos: blocks["customerReviews.videos"] ?? [],
    faqs: blocks["customerReviews.faqs"] ?? [],
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, customerReviewsSchema);
  if (error) return error;

  await Promise.all([
    updateContentBlock("customerReviews.content", data.content),
    updateContentBlock("customerReviews.reviews", data.reviews),
    updateContentBlock("customerReviews.videos", data.videos),
    updateContentBlock("customerReviews.faqs", data.faqs),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:customerReviews",
    details: JSON.stringify({ keys: ["customerReviews.content", "customerReviews.reviews", "customerReviews.videos", "customerReviews.faqs"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/customer-reviews");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
