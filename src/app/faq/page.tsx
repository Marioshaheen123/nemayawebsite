import Header from "@/components/Header";
import FaqPage from "@/components/FaqPage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getFaqCategoriesBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Faq() {
  const [headerData, footerData, faqPageHeroTitle, faqPageIntroText, faqCategories] =
    await Promise.all([
      getHeaderData(),
      getFooterData(),
      getContentBlock("faq.pageHeroTitle"),
      getContentBlock("faq.pageIntroText"),
      getFaqCategoriesBilingual(),
    ]);

  return (
    <main className="bg-white">
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
