import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import WithdrawalSettingsEditor from "@/components/admin/editors/WithdrawalSettingsEditor";

const DEFAULT_CONFIG = {
  enabled: true,
  timezone: "Asia/Riyadh",
  schedule: [
    { day: 0, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 1, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 2, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 3, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 4, slots: [{ from: "09:00", to: "17:00" }] },
  ],
  popupTitle: { en: "Outside Trading Hours", ar: "خارج ساعات التداول" },
  popupMessage: {
    en: "Withdrawal requests can only be submitted during trading hours.\nPlease try again during the scheduled working hours.",
    ar: "يمكن تقديم طلبات السحب فقط خلال ساعات التداول.\nيرجى المحاولة مرة أخرى خلال ساعات العمل المحددة.",
  },
};

export default async function WithdrawalSettingsPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["withdrawal.tradingHours"]);
      return blocks["withdrawal.tradingHours"] ?? DEFAULT_CONFIG;
    },
    "admin-withdrawal-settings",
    ["admin-withdrawal-settings"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <WithdrawalSettingsEditor initialData={data} />
    </div>
  );
}
