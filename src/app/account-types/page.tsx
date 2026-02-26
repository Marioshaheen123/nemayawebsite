import Header from "@/components/Header";
import AccountTypesPage from "@/components/AccountTypesPage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getPlansBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AccountTypes() {
  const [headerData, footerData, accountTypesPageHeroTitle, accountTypesPageHeading, plansData] =
    await Promise.all([
      getHeaderData(),
      getFooterData(),
      getContentBlock("accountTypes.pageHeroTitle"),
      getContentBlock("accountTypes.pageHeading"),
      getPlansBilingual(),
    ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <AccountTypesPage
        allPlans={plansData.plans}
        planFeatures={plansData.features}
        accountTypesPageHeroTitle={accountTypesPageHeroTitle}
        accountTypesPageHeading={accountTypesPageHeading}
      />
      <Footer {...footerData} />
    </main>
  );
}
