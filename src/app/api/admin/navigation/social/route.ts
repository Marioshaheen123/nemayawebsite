import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const icons = await prisma.socialIcon.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(icons);
  } catch (error) {
    console.error("[GET /api/admin/navigation/social]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { src, alt, href, sortOrder } = body;

    if (!src || !alt || !href) {
      return NextResponse.json(
        { error: "src, alt, and href are required" },
        { status: 400 }
      );
    }

    // Determine next sortOrder if not provided
    let resolvedSortOrder = sortOrder;
    if (resolvedSortOrder == null) {
      const max = await prisma.socialIcon.aggregate({ _max: { sortOrder: true } });
      resolvedSortOrder = (max._max.sortOrder ?? 0) + 1;
    }

    const icon = await prisma.socialIcon.create({
      data: {
        src,
        alt,
        href,
        sortOrder: resolvedSortOrder,
      },
    });

    return NextResponse.json(icon, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/navigation/social]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
