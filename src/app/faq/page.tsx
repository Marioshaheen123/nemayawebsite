import type { Metadata } from "next";
import Header from "@/components/Header";
import FaqPage from "@/components/FaqPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getLayoutData, getContentBlock, getFaqCategoriesBilingual, getFaqCategories } from "@/lib/content";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "الأسئلة الشائعة",
    descriptionAr: "إجابات على الأسئلة الأكثر شيوعاً حول التداول والاستثمار مع نمايا",
    path: "/faq",
  });
}

export default async function Faq() {
  const { headerData, footerData } = await getLayoutData();
  const [faqPageHeroTitle, faqPageIntroText, faqCategories, rawCategories] =
    await Promise.all([
      getContentBlock("faq.pageHeroTitle"),
      getContentBlock("faq.pageIntroText"),
      getFaqCategoriesBilingual(),
      getFaqCategories(),
    ]);

  // Build FAQ JSON-LD from all questions (Arabic)
  const faqItems = rawCategories.flatMap((c: any) =>
    c.questions.map((q: any) => ({ question: q.questionAr, answer: q.answerAr }))
  );

  return (
    <main className="bg-white">
      {faqItems.length > 0 && <JsonLd data={faqPageJsonLd(faqItems)} />}
      <Header {...headerData} />
      <FaqPage
        faqCategories={faqCategories}
        faqPageHeroTitle={faqPageHeroTitle}
        faqPageIntroText={faqPageIntroText}
      />
      <Footer {...footerData} />
    </main>
  );
}
