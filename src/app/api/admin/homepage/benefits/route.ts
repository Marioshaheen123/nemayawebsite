import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { homepageBenefitsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "homepage.benefitsFeatures",
    "homepage.benefitsHeading",
    "homepage.benefitsCtaText",
    "homepage.benefitsBadge",
    "homepage.benefitsImages",
  ]);
  return NextResponse.json({
    features: blocks["homepage.benefitsFeatures"] ?? { en: [], ar: [] },
    heading: blocks["homepage.benefitsHeading"] ?? { en: {}, ar: {} },
    ctaText: blocks["homepage.benefitsCtaText"] ?? { en: "", ar: "" },
    badge: blocks["homepage.benefitsBadge"] ?? { label: "", labelAr: "" },
    images: blocks["homepage.benefitsImages"] ?? { phone: "", centerLogo: "" },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, homepageBenefitsSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("homepage.benefitsFeatures", data.features),
    updateContentBlock("homepage.benefitsHeading", data.heading),
    updateContentBlock("homepage.benefitsCtaText", data.ctaText),
    updateContentBlock("homepage.benefitsBadge", data.badge),
    updateContentBlock("homepage.benefitsImages", data.images),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:homepage.benefits",
    details: JSON.stringify({ keys: ["homepage.benefitsFeatures", "homepage.benefitsHeading", "homepage.benefitsCtaText", "homepage.benefitsBadge", "homepage.benefitsImages"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
