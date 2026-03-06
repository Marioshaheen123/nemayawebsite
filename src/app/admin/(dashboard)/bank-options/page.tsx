import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import BankOptionsEditor from "@/components/admin/editors/BankOptionsEditor";

const DEFAULT_BANKS = {
  banks: [
    { value: "SABB", en: "SABB Bank", ar: "بنك ساب" },
    { value: "SNB", en: "Saudi National Bank (SNB)", ar: "البنك الأهلي السعودي" },
    { value: "ALRAJHI", en: "Al Rajhi Bank", ar: "مصرف الراجحي" },
    { value: "RIYADH", en: "Riyad Bank", ar: "بنك الرياض" },
    { value: "ALINMA", en: "Alinma Bank", ar: "مصرف الإنماء" },
    { value: "ALBILAD", en: "Bank AlBilad", ar: "بنك البلاد" },
    { value: "ALJAZIRA", en: "Bank AlJazira", ar: "بنك الجزيرة" },
    { value: "BSF", en: "Banque Saudi Fransi", ar: "البنك السعودي الفرنسي" },
    { value: "ANB", en: "Arab National Bank", ar: "البنك العربي الوطني" },
    { value: "SIB", en: "Saudi Investment Bank", ar: "البنك السعودي للاستثمار" },
    { value: "GIB", en: "Gulf International Bank", ar: "بنك الخليج الدولي" },
    { value: "EMIRATES_NBD", en: "Emirates NBD", ar: "الإمارات دبي الوطني" },
    { value: "ADCB", en: "Abu Dhabi Commercial Bank", ar: "بنك أبوظبي التجاري" },
    { value: "QNB", en: "Qatar National Bank", ar: "بنك قطر الوطني" },
    { value: "NBK", en: "National Bank of Kuwait", ar: "بنك الكويت الوطني" },
    { value: "CIB", en: "Commercial International Bank", ar: "البنك التجاري الدولي" },
    { value: "OTHER", en: "Other", ar: "أخرى" },
  ],
};

export default async function BankOptionsPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["withdrawal.bankOptions"]);
      return blocks["withdrawal.bankOptions"] ?? DEFAULT_BANKS;
    },
    "admin-bank-options",
    ["admin-bank-options"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <BankOptionsEditor initialData={data} />
    </div>
  );
}
