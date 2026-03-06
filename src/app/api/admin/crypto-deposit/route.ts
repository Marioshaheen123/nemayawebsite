import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { z } from "zod";
import { validateBody } from "@/lib/validation";

const cryptoDepositSchema = z.object({
  enabled: z.boolean(),
  walletAddress: z.string().max(500),
  currency: z.string().max(100),
  network: z.string().max(100),
  qrImage: z.string().max(2000),
  recommendedPlatforms: z
    .array(
      z.object({
        name: z.string().max(100),
        logo: z.string().max(2000),
      })
    )
    .max(10),
});

const CONTENT_KEY = "crypto-deposit.config";

const DEFAULT_CONFIG = {
  enabled: true,
  walletAddress: "",
  currency: "USDT  TetherUS",
  network: "TRX  Tron (TRC20)",
  qrImage: "",
  recommendedPlatforms: [],
};

export async function GET() {
  const blocks = await getContentBlocks([CONTENT_KEY]);
  return NextResponse.json(blocks[CONTENT_KEY] ?? DEFAULT_CONFIG);
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, cryptoDepositSchema);
  if (error) return error;

  await updateContentBlock(CONTENT_KEY, data);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: `ContentBlock:${CONTENT_KEY}`,
    details: JSON.stringify({ keys: [CONTENT_KEY] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-crypto-deposit", "default");
  return NextResponse.json({ success: true });
}
