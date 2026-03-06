import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageCarouselSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "homepage.carouselCards",
    "homepage.carouselHeading",
    "homepage.carouselBadge",
  ]);
  return NextResponse.json({
    cards: blocks["homepage.carouselCards"] ?? { en: [], ar: [] },
    heading: blocks["homepage.carouselHeading"] ?? { en: {}, ar: {} },
    badge: blocks["homepage.carouselBadge"] ?? { label: "", labelAr: "" },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageCarouselSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("homepage.carouselCards", data.cards),
    updateContentBlock("homepage.carouselHeading", data.heading),
    updateContentBlock("homepage.carouselBadge", data.badge),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.carousel",
    details: JSON.stringify({ keys: ["homepage.carouselCards", "homepage.carouselHeading", "homepage.carouselBadge"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
