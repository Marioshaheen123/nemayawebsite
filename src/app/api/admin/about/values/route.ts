import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { aboutValuesSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "about.valuesBadge",
    "about.valuesHeading",
    "about.values",
    "about.valuesImage",
  ]);
  return NextResponse.json({
    badge: blocks["about.valuesBadge"] ?? { label: "", labelAr: "" },
    heading: blocks["about.valuesHeading"] ?? {
      en: { part1: "", bold1: "", part2: "", bold2: "" },
      ar: { part1: "", bold1: "", part2: "", bold2: "" },
    },
    values: blocks["about.values"] ?? { en: [], ar: [] },
    image: blocks["about.valuesImage"] ?? "",
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, aboutValuesSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("about.valuesBadge", data.badge),
    updateContentBlock("about.valuesHeading", data.heading),
    updateContentBlock("about.values", data.values),
    updateContentBlock("about.valuesImage", data.image),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:about.values",
    details: JSON.stringify({ keys: ["about.valuesBadge", "about.valuesHeading", "about.values", "about.valuesImage"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
