import Header from "@/components/Header";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLegalSectionsBilingual, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicy() {
  const [headerData, footerData, heroTitle, sections] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getContentBlock<any>("legal.privacyPolicyHeroTitle"),
    getLegalSectionsBilingual("privacy"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <PrivacyPolicyPage heroTitle={heroTitle} sections={sections} />
      <Footer {...footerData} />
    </main>
  );
}
