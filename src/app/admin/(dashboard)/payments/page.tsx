import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import PaymentSettingsEditor from "@/components/admin/editors/PaymentSettingsEditor";

export default async function PaymentsAdminPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["payments.config"]);
      return blocks["payments.config"] ?? { providers: [] };
    },
    "admin-payments",
    ["admin-payments"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <PaymentSettingsEditor initialData={data} />
    </div>
  );
}
