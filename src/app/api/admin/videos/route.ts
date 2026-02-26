import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const videos = await prisma.video.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const requiredFields = { videoId, titleEn, titleAr, descEn, descAr, fullDescEn, fullDescAr, linkTextEn, linkTextAr, day, monthEn, monthAr, durationEn, durationAr, videoUrl };
  const missing = Object.entries(requiredFields)
    .filter(([, v]) => v === undefined || v === "")
    .map(([k]) => k);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate takeaways are valid JSON arrays
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

  let parsedTakeawaysEn: string;
  let parsedTakeawaysAr: string;
  try {
    parsedTakeawaysEn = parseTakeaways(takeawaysEn, "takeawaysEn");
    parsedTakeawaysAr = parseTakeaways(takeawaysAr, "takeawaysAr");
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const video = await prisma.video.create({
    data: {
      videoId,
      titleEn,
      titleAr,
      descEn,
      descAr,
      fullDescEn,
      fullDescAr,
      takeawaysEn: parsedTakeawaysEn,
      takeawaysAr: parsedTakeawaysAr,
      linkTextEn,
      linkTextAr,
      day,
      monthEn,
      monthAr,
      durationEn,
      durationAr,
      videoUrl,
      labelEn: labelEn ?? "",
      labelAr: labelAr ?? "",
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(video, { status: 201 });
}
