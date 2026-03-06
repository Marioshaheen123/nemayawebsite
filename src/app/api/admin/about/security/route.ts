import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutSecuritySchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.securityBadge",
    "about.securityContent",
  ]);
  return NextResponse.json({
    badge: blocks["about.securityBadge"] ?? { label: "", labelAr: "" },
    content: blocks["about.securityContent"] ?? {
      en: { title1: "", title2: "", title3: "", p1: "", p2: "" },
      ar: { title1: "", title2: "", title3: "", p1: "", p2: "" },
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutSecuritySchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.securityBadge", data.badge),
    updateContentBlock("about.securityContent", data.content),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.security",
    details: JSON.stringify({ keys: ["about.securityBadge", "about.securityContent"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
