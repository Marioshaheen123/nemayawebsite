import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VideosEditor from "@/components/admin/VideosEditor";

export const metadata = { title: "Videos — Nemaya Admin" };

export default async function VideosAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const videos = await prisma.video.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <VideosEditor initialVideos={videos} />;
}
