import type { Metadata } from "next";
import Header from "@/components/Header";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "تواصل معنا",
    descriptionAr: "تواصل مع فريق نمايا للاستفسارات والدعم",
    path: "/contact",
  });
}

export default async function Contact() {
  const { headerData, footerData } = await getLayoutData();
  const [i18n, totalSteps] = await Promise.all([
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
