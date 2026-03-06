import { NextResponse } from "next/server";
import { getContentBlocks } from "@/lib/content";

export async function GET() {
  const blocks = await getContentBlocks(["payments.config"]);
  const config = blocks["payments.config"] as
    | { providers: Array<{ name: string; enabled: boolean; isActive: boolean; linkTemplate: string; amounts: number[]; currency: string; currencySymbol: string }> }
    | undefined;

  if (!config?.providers?.length) {
    return NextResponse.json({ active: false });
  }

  const active = config.providers.find((p) => p.enabled && p.isActive);
  if (!active) {
    return NextResponse.json({ active: false });
  }

  return NextResponse.json({
    active: true,
    providerName: active.name,
    linkTemplate: active.linkTemplate,
    amounts: active.amounts,
    currency: active.currency,
    currencySymbol: active.currencySymbol,
  });
}
