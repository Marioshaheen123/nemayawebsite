import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { websiteSettingsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

const DEFAULTS = {
  accentColor: "#057e33",
  accentColorDark: "#046b2b",
  gradientFrom: "#0a7f35",
  gradientVia: "#12a544",
  gradientTo: "#3ec95e",
  gradientHoverFrom: "#086b2c",
  gradientHoverVia: "#0e8e3a",
  gradientHoverTo: "#34b552",
  mainLogo: "/images/nemayalogo.png",
  smallLogo: "/images/small logo.png",
};

export async function GET() {
  const blocks = await getContentBlocks(["settings.website"]);
  return NextResponse.json(blocks["settings.website"] ?? DEFAULTS);
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, websiteSettingsSchema);
  if (error) return error;
  await updateContentBlock("settings.website", data);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:settings.website",
    details: JSON.stringify({ keys: ["settings.website"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-website-settings", "default");
  return NextResponse.json({ success: true });
}
