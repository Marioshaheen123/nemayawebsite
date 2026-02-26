import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await prisma.navItem.findMany({
      orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
      include: { children: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/admin/navigation/items]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { location, labelEn, labelAr, href, hasDropdown, sortOrder, parentId } = body;

    if (!location || !labelEn || !labelAr || !href) {
      return NextResponse.json(
        { error: "location, labelEn, labelAr, and href are required" },
        { status: 400 }
      );
    }

    // Determine next sortOrder if not provided
    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.navItem.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const item = await prisma.navItem.create({
      data: {
        location,
        labelEn,
        labelAr,
        href,
        hasDropdown: hasDropdown ?? false,
        sortOrder: resolvedSortOrder,
        parentId: parentId || null,
      },
      include: { children: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/navigation/items]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
