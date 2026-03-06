import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutVisionSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.visionBadge",
    "about.visionTitle",
    "about.visionCards",
    "about.visionImages",
  ]);
  return NextResponse.json({
    badge: blocks["about.visionBadge"] ?? { label: "", labelAr: "" },
    title: blocks["about.visionTitle"] ?? { en: "", ar: "" },
    cards: blocks["about.visionCards"] ?? { en: [], ar: [] },
    images: blocks["about.visionImages"] ?? [],
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutVisionSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.visionBadge", data.badge),
    updateContentBlock("about.visionTitle", data.title),
    updateContentBlock("about.visionCards", data.cards),
    updateContentBlock("about.visionImages", data.images),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.vision",
    details: JSON.stringify({ keys: ["about.visionBadge", "about.visionTitle", "about.visionCards", "about.visionImages"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
