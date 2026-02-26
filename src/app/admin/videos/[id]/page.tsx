import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import VideoForm from "@/components/admin/VideoForm";

export const metadata = { title: "Edit Video — Nemaya Admin" };

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();

  // Pass the DB record as initial values — shape matches VideoFormValues + id
  return (
    <VideoForm
      initial={{
        id: video.id,
        videoId: video.videoId,
        titleEn: video.titleEn,
        titleAr: video.titleAr,
        descEn: video.descEn,
        descAr: video.descAr,
        fullDescEn: video.fullDescEn,
        fullDescAr: video.fullDescAr,
        takeawaysEn: video.takeawaysEn,
        takeawaysAr: video.takeawaysAr,
        linkTextEn: video.linkTextEn,
        linkTextAr: video.linkTextAr,
        day: video.day,
        monthEn: video.monthEn,
        monthAr: video.monthAr,
        durationEn: video.durationEn,
        durationAr: video.durationAr,
        videoUrl: video.videoUrl,
        labelEn: video.labelEn,
        labelAr: video.labelAr,
        sortOrder: video.sortOrder,
      }}
    />
  );
}
