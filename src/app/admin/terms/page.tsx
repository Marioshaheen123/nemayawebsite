import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LegalPageEditor from "@/components/admin/LegalPageEditor";

export const metadata = { title: "Terms & Conditions Editor — Nemaya Admin" };

export default async function TermsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <LegalPageEditor pageType="terms" pageTitle="Terms & Conditions" />;
}
