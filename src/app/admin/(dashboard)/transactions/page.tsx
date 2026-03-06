import TransactionsEditor from "@/components/admin/editors/TransactionsEditor";

export default function TransactionsPage() {
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <TransactionsEditor />
    </div>
  );
}
