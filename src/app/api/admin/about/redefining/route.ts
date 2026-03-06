import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutRedefiningSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.redefiningBadge",
    "about.redefiningContent",
    "about.stats",
  ]);
  return NextResponse.json({
    badge: blocks["about.redefiningBadge"] ?? { label: "", labelAr: "" },
    content: blocks["about.redefiningContent"] ?? {
      en: { title1: "", title2: "", p1: "", p2: "" },
      ar: { title1: "", title2: "", p1: "", p2: "" },
    },
    stats: blocks["about.stats"] ?? { en: [], ar: [] },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutRedefiningSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.redefiningBadge", data.badge),
    updateContentBlock("about.redefiningContent", data.content),
    updateContentBlock("about.stats", data.stats),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.redefining",
    details: JSON.stringify({ keys: ["about.redefiningBadge", "about.redefiningContent", "about.stats"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
