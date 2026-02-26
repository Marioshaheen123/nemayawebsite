import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FaqEditor from "@/components/admin/FaqEditor";

export const metadata = { title: "FAQ Manager — Nemaya Admin" };

export default async function FaqAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const categories = await prisma.faqCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return <FaqEditor initialCategories={categories} />;
}
