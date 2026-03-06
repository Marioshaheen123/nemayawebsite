import { NextResponse } from "next/server";
import { getContentBlocks } from "@/lib/content";

export async function GET() {
  const blocks = await getContentBlocks(["crypto-deposit.config"]);
  const crypto = blocks["crypto-deposit.config"] as
    | {
        enabled: boolean;
        walletAddress: string;
        currency: string;
        network: string;
        qrImage: string;
        recommendedPlatforms: { name: string; logo: string }[];
      }
    | undefined;

  if (!crypto?.enabled) {
    return NextResponse.json({ enabled: false });
  }

  return NextResponse.json({
    enabled: true,
    walletAddress: crypto.walletAddress,
    currency: crypto.currency,
    network: crypto.network,
    qrImage: crypto.qrImage,
    recommendedPlatforms: crypto.recommendedPlatforms || [],
  });
}
