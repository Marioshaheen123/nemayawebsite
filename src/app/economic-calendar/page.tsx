import type { Metadata } from "next";
import Header from "@/components/Header";
import EconomicCalendarPage from "@/components/EconomicCalendarPage";
import Footer from "@/components/Footer";
import { getContentBlock, getLayoutData } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "التقويم الاقتصادي",
    descriptionAr: "تابع الأحداث الاقتصادية المهمة والمؤثرة على الأسواق المالية",
    path: "/economic-calendar",
  });
}

export default async function EconomicCalendar() {
  const { headerData, footerData } = await getLayoutData();
  const [sampleData, i18n, currencyToCountry] = await Promise.all([
    getContentBlock<any>("economicCalendar.sampleData"),
    getContentBlock<any>("economicCalendar.i18n"),
    getContentBlock<any>("economicCalendar.currencyToCountry"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <EconomicCalendarPage
        sampleData={sampleData}
        i18n={i18n}
        currencyToCountry={currencyToCountry}
      />
      <Footer {...footerData} />
    </main>
  );
}
