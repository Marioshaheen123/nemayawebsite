import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import VideoForm from "@/components/admin/VideoForm";

export const metadata = { title: "New Video — Nemaya Admin" };

export default async function NewVideoPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return <VideoForm />;
}
