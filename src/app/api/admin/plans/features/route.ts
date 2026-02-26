import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const features = await prisma.planFeature.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(features);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { labelEn, labelAr, sortOrder } = body;

  if (!labelEn || !labelAr) {
    return NextResponse.json({ error: "labelEn and labelAr are required" }, { status: 400 });
  }

  const feature = await prisma.planFeature.create({
    data: { labelEn, labelAr, sortOrder: sortOrder ?? 0 },
  });

  return NextResponse.json(feature, { status: 201 });
}

/**
 * PUT /api/admin/plans/features
 * Replaces the entire feature list (bulk upsert).
 * Body: { features: Array<{ id?: string, labelEn, labelAr, sortOrder }> }
 */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const features: { id?: string; labelEn: string; labelAr: string; sortOrder: number }[] =
    body.features ?? [];

  // Delete features not in the new list
  const incomingIds = features.filter((f) => f.id).map((f) => f.id as string);
  await prisma.planFeature.deleteMany({
    where: { id: { notIn: incomingIds } },
  });

  // Upsert each feature
  const results = await Promise.all(
    features.map((f, i) => {
      const data = { labelEn: f.labelEn, labelAr: f.labelAr, sortOrder: f.sortOrder ?? i };
      if (f.id) {
        return prisma.planFeature.update({ where: { id: f.id }, data });
      }
      return prisma.planFeature.create({ data });
    })
  );

  return NextResponse.json(results);
}
