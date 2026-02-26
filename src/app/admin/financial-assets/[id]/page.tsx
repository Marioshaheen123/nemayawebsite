import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FinancialAssetForm from "@/components/admin/FinancialAssetForm";

export const metadata = { title: "Edit Financial Asset — Nemaya Admin" };

type PageProps = { params: Promise<{ id: string }> };

export default async function FinancialAssetDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const isNew = id === "new";

  return <FinancialAssetForm assetId={isNew ? undefined : id} />;
}
