import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutBlogSectionSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.blogSectionBadge",
    "about.blogSectionHeading",
  ]);
  return NextResponse.json({
    badge: blocks["about.blogSectionBadge"] ?? { label: "", labelAr: "" },
    heading: blocks["about.blogSectionHeading"] ?? {
      en: { before: "", bold: "" },
      ar: { before: "", bold: "" },
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutBlogSectionSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.blogSectionBadge", data.badge),
    updateContentBlock("about.blogSectionHeading", data.heading),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.blogSection",
    details: JSON.stringify({ keys: ["about.blogSectionBadge", "about.blogSectionHeading"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
