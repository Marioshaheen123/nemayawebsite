import UserDetailEditor from "@/components/admin/editors/UserDetailEditor";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <UserDetailEditor userId={id} />
    </div>
  );
}
