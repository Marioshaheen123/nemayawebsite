import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const item = await prisma.navItem.findUnique({
      where: { id },
      include: { children: { orderBy: { sortOrder: "asc" } } },
    });

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[GET /api/admin/navigation/items/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { location, labelEn, labelAr, href, hasDropdown, sortOrder, parentId } = body;

    const item = await prisma.navItem.update({
      where: { id },
      data: {
        ...(location !== undefined && { location }),
        ...(labelEn !== undefined && { labelEn }),
        ...(labelAr !== undefined && { labelAr }),
        ...(href !== undefined && { href }),
        ...(hasDropdown !== undefined && { hasDropdown }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(parentId !== undefined && { parentId: parentId || null }),
      },
      include: { children: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PUT /api/admin/navigation/items/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.navItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/navigation/items/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
