import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutHeroSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks(["about.heroContent"]);
  return NextResponse.json({
    heroContent: blocks["about.heroContent"] ?? {
      en: { title1: "", title2: "", subtitle: "" },
      ar: { title1: "", title2: "", subtitle: "" },
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutHeroSchema);
  if (error) return error;
  await updateContentBlock("about.heroContent", data.heroContent);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.hero",
    details: JSON.stringify({ keys: ["about.heroContent"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
