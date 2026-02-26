import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import IslamicRulingsEditor from "@/components/admin/IslamicRulingsEditor";

export const metadata = { title: "Islamic Rulings — Nemaya Admin" };

export default async function IslamicRulingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <IslamicRulingsEditor />;
}
