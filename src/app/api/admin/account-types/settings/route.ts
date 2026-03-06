import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { accountTypesSettingsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "pricing.accountTypesPageHeroTitle",
    "pricing.accountTypesPageHeading",
  ]);
  return NextResponse.json({
    heroTitle: blocks["pricing.accountTypesPageHeroTitle"] ?? { en: "", ar: "" },
    pageHeading: blocks["pricing.accountTypesPageHeading"] ?? {
      en: { before: "", bold: "" },
      ar: { before: "", bold: "" },
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, accountTypesSettingsSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("pricing.accountTypesPageHeroTitle", data.heroTitle),
    updateContentBlock("pricing.accountTypesPageHeading", data.pageHeading),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:accountTypes.settings",
    details: JSON.stringify({ keys: ["pricing.accountTypesPageHeroTitle", "pricing.accountTypesPageHeading"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/account-types");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
