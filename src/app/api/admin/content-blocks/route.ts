import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blocks = await prisma.contentBlock.findMany({
    orderBy: { key: "asc" },
  });

  return NextResponse.json(blocks);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, valueJson } = body;

  if (!key || typeof key !== "string") {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  // Validate JSON
  try {
    JSON.parse(valueJson);
  } catch {
    return NextResponse.json({ error: "valueJson must be valid JSON" }, { status: 400 });
  }

  const existing = await prisma.contentBlock.findUnique({ where: { key } });
  if (existing) {
    return NextResponse.json({ error: "A content block with this key already exists" }, { status: 409 });
  }

  const block = await prisma.contentBlock.create({
    data: { key, valueJson },
  });

  return NextResponse.json(block, { status: 201 });
}
