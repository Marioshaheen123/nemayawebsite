import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;

  const block = await prisma.contentBlock.findUnique({ where: { key } });
  if (!block) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(block);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const body = await request.json();
  const { valueJson } = body;

  // Validate JSON
  try {
    JSON.parse(valueJson);
  } catch {
    return NextResponse.json({ error: "valueJson must be valid JSON" }, { status: 400 });
  }

  const block = await prisma.contentBlock.upsert({
    where: { key },
    update: { valueJson },
    create: { key, valueJson },
  });

  return NextResponse.json(block);
}
