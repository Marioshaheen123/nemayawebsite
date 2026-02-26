import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(video);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const {
    videoId,
    titleEn,
    titleAr,
    descEn,
    descAr,
    fullDescEn,
    fullDescAr,
    takeawaysEn,
    takeawaysAr,
    linkTextEn,
    linkTextAr,
    day,
    monthEn,
    monthAr,
    durationEn,
    durationAr,
    videoUrl,
    labelEn,
    labelAr,
    sortOrder,
  } = body;

  // Validate takeaways if provided
  const parseTakeaways = (raw: string, field: string) => {
    if (!raw || raw.trim() === "") return "[]";
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error(`${field} must be a JSON array`);
      return raw;
    } catch {
      throw new Error(`${field} is not valid JSON`);
    }
  };

  let parsedTakeawaysEn: string | undefined;
  let parsedTakeawaysAr: string | undefined;
  try {
    if (takeawaysEn !== undefined) parsedTakeawaysEn = parseTakeaways(takeawaysEn, "takeawaysEn");
    if (takeawaysAr !== undefined) parsedTakeawaysAr = parseTakeaways(takeawaysAr, "takeawaysAr");
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const video = await prisma.video.update({
    where: { id },
    data: {
      ...(videoId !== undefined && { videoId }),
      ...(titleEn !== undefined && { titleEn }),
      ...(titleAr !== undefined && { titleAr }),
      ...(descEn !== undefined && { descEn }),
      ...(descAr !== undefined && { descAr }),
      ...(fullDescEn !== undefined && { fullDescEn }),
      ...(fullDescAr !== undefined && { fullDescAr }),
      ...(parsedTakeawaysEn !== undefined && { takeawaysEn: parsedTakeawaysEn }),
      ...(parsedTakeawaysAr !== undefined && { takeawaysAr: parsedTakeawaysAr }),
      ...(linkTextEn !== undefined && { linkTextEn }),
      ...(linkTextAr !== undefined && { linkTextAr }),
      ...(day !== undefined && { day }),
      ...(monthEn !== undefined && { monthEn }),
      ...(monthAr !== undefined && { monthAr }),
      ...(durationEn !== undefined && { durationEn }),
      ...(durationAr !== undefined && { durationAr }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(labelEn !== undefined && { labelEn }),
      ...(labelAr !== undefined && { labelAr }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.video.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
