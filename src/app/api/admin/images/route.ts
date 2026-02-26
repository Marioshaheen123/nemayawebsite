import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const images = await prisma.siteImage.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = formData.get("altText") as string | null;
    const category = formData.get("category") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicPath = `/uploads/${uniqueName}`;

    // Save to DB
    const image = await prisma.siteImage.create({
      data: {
        path: publicPath,
        fileName: file.name,
        altText: altText || null,
        category: category || null,
        mimeType: file.type,
        sizeBytes: file.size,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/images]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
