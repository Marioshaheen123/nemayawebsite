import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const icon = await prisma.socialIcon.findUnique({ where: { id } });
    if (!icon) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(icon);
  } catch (error) {
    console.error("[GET /api/admin/navigation/social/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { src, alt, href, sortOrder } = body;

    const icon = await prisma.socialIcon.update({
      where: { id },
      data: {
        ...(src !== undefined && { src }),
        ...(alt !== undefined && { alt }),
        ...(href !== undefined && { href }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json(icon);
  } catch (error) {
    console.error("[PUT /api/admin/navigation/social/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.socialIcon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/navigation/social/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
