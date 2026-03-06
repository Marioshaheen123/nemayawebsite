import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutBridgingSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.bridgingContent",
    "about.bridgingImage",
  ]);
  return NextResponse.json({
    content: blocks["about.bridgingContent"] ?? {
      en: { title: "", p1: "", p2: "", cta: "" },
      ar: { title: "", p1: "", p2: "", cta: "" },
    },
    image: blocks["about.bridgingImage"] ?? "",
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutBridgingSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.bridgingContent", data.content),
    updateContentBlock("about.bridgingImage", data.image),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.bridging",
    details: JSON.stringify({ keys: ["about.bridgingContent", "about.bridgingImage"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
