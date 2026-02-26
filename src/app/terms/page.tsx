import Header from "@/components/Header";
import TermsPage from "@/components/TermsPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLegalSectionsBilingual, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Terms() {
  const [headerData, footerData, heroTitle, sections] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getContentBlock<any>("legal.termsHeroTitle"),
    getLegalSectionsBilingual("terms"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <TermsPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
