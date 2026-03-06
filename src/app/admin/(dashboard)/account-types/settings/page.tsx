import { getContentBlocks } from "@/lib/content";
import AccountTypesSettingsEditor from "@/components/admin/editors/AccountTypesSettingsEditor";


export default async function AccountTypesSettingsPage() {
  const blocks = await getContentBlocks([
    "pricing.accountTypesPageHeroTitle", "pricing.accountTypesPageHeading",
  ]);
  const data = {
    heroTitle: blocks["pricing.accountTypesPageHeroTitle"] ?? { en: "", ar: "" },
    pageHeading: blocks["pricing.accountTypesPageHeading"] ?? {
      en: { before: "", bold: "" },
      ar: { before: "", bold: "" },
    },
  };
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <AccountTypesSettingsEditor initialData={data} />
    </div>
  );
}
