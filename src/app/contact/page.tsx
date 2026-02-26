import Header from "@/components/Header";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";
import { getContentBlock, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Contact() {
  const [headerData, footerData, i18n, totalSteps] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getContentBlock<any>("contact.i18n"),
    getContentBlock<any>("contact.totalSteps"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <ContactPage i18n={i18n} totalSteps={totalSteps} />
      <Footer {...footerData} />
    </main>
  );
}
