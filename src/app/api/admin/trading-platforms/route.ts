import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { tradingPlatformsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "tradingPlatforms.content",
    "tradingPlatforms.mockupImage",
    "tradingPlatforms.checkIcon",
  ]);
  return NextResponse.json({
    content: blocks["tradingPlatforms.content"] ?? {
      en: { heading: "", boldParagraph: "", paragraph: "", whyTitle: "", features: [], closingBold: "", cta: "", ctaUrl: "" },
      ar: { heading: "", boldParagraph: "", paragraph: "", whyTitle: "", features: [], closingBold: "", cta: "", ctaUrl: "" },
    },
    mockupImage: blocks["tradingPlatforms.mockupImage"] ?? "",
    checkIcon: blocks["tradingPlatforms.checkIcon"] ?? "",
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, tradingPlatformsSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("tradingPlatforms.content", data.content),
    updateContentBlock("tradingPlatforms.mockupImage", data.mockupImage),
    updateContentBlock("tradingPlatforms.checkIcon", data.checkIcon),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:tradingPlatforms",
    details: JSON.stringify({ keys: ["tradingPlatforms.content", "tradingPlatforms.mockupImage", "tradingPlatforms.checkIcon"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/trading-platforms");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
