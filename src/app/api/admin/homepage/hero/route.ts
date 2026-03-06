import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageHeroSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "homepage.heroContent",
    "homepage.heroImages",
  ]);
  return NextResponse.json({
    heroContent: blocks["homepage.heroContent"] ?? { en: {}, ar: {} },
    heroImages: blocks["homepage.heroImages"] ?? { background: "", person: "" },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageHeroSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("homepage.heroContent", data.heroContent),
    updateContentBlock("homepage.heroImages", data.heroImages),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.hero",
    details: JSON.stringify({ keys: ["homepage.heroContent", "homepage.heroImages"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
