import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ImageLibrary from "@/components/admin/ImageLibrary";

export const metadata = { title: "Images Library — Nemaya Admin" };

export default async function ImagesPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <ImageLibrary />;
}
