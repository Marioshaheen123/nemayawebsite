import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LegalPageEditor from "@/components/admin/LegalPageEditor";

export const metadata = { title: "Privacy Policy Editor — Nemaya Admin" };

export default async function PrivacyPolicyPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <LegalPageEditor pageType="privacyPolicy" pageTitle="Privacy Policy" />;
}
