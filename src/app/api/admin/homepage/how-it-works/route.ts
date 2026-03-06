import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageHowItWorksSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "homepage.howItWorksContent",
    "homepage.howItWorksBadge",
    "homepage.howItWorksImage",
  ]);
  return NextResponse.json({
    content: blocks["homepage.howItWorksContent"] ?? { en: {}, ar: {} },
    badge: blocks["homepage.howItWorksBadge"] ?? { label: "", labelAr: "" },
    image: blocks["homepage.howItWorksImage"] ?? "",
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageHowItWorksSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("homepage.howItWorksContent", data.content),
    updateContentBlock("homepage.howItWorksBadge", data.badge),
    updateContentBlock("homepage.howItWorksImage", data.image),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.howItWorks",
    details: JSON.stringify({ keys: ["homepage.howItWorksContent", "homepage.howItWorksBadge", "homepage.howItWorksImage"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
