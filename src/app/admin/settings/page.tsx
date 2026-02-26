import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings — Nemaya Admin" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <SettingsForm />;
}
