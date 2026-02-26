import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const image = await prisma.siteImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete file from disk if it's in uploads
    if (image.path.startsWith("/uploads/")) {
      const filePath = join(process.cwd(), "public", image.path);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await prisma.siteImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/images/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { altText, category } = body;

    const image = await prisma.siteImage.update({
      where: { id },
      data: {
        ...(altText !== undefined && { altText }),
        ...(category !== undefined && { category }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("[PUT /api/admin/images/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
