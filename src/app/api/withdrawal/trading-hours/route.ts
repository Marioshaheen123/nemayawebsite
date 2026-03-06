import { NextResponse } from "next/server";
import { getContentBlocks } from "@/lib/content";

export async function GET() {
  const blocks = await getContentBlocks(["withdrawal.tradingHours"]);
  const config = blocks["withdrawal.tradingHours"];

  if (!config) {
    return NextResponse.json({ enabled: false });
  }

  return NextResponse.json(config);
}
