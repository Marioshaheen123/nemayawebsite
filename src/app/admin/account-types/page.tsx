import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PlansEditor from "@/components/admin/PlansEditor";

export const metadata = { title: "Account Types — Nemaya Admin" };

export default async function AccountTypesAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [plans, features] = await Promise.all([
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.planFeature.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return <PlansEditor initialPlans={plans} initialFeatures={features} />;
}
