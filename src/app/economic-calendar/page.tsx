import Header from "@/components/Header";
import EconomicCalendarPage from "@/components/EconomicCalendarPage";
import Footer from "@/components/Footer";
import { getContentBlock, getHeaderData, getFooterData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EconomicCalendar() {
  const [headerData, footerData, sampleData, i18n, currencyToCountry] = await Promise.all([
    getHeaderData(),
    getFooterData(),
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
