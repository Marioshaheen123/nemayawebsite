import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import CryptoDepositEditor from "@/components/admin/editors/CryptoDepositEditor";

export default async function CryptoDepositAdminPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["crypto-deposit.config"]);
      return blocks["crypto-deposit.config"] ?? undefined;
    },
    "admin-crypto-deposit",
    ["admin-crypto-deposit"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <CryptoDepositEditor initialData={data} />
    </div>
  );
}
