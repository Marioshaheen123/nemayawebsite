import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { withdrawalSettingsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

const DEFAULT_CONFIG = {
  enabled: true,
  timezone: "Asia/Riyadh",
  schedule: [
    { day: 0, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 1, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 2, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 3, slots: [{ from: "09:00", to: "17:00" }] },
    { day: 4, slots: [{ from: "09:00", to: "17:00" }] },
  ],
  popupTitle: { en: "Outside Trading Hours", ar: "خارج ساعات التداول" },
  popupMessage: {
    en: "Withdrawal requests can only be submitted during trading hours.\nPlease try again during the scheduled working hours.",
    ar: "يمكن تقديم طلبات السحب فقط خلال ساعات التداول.\nيرجى المحاولة مرة أخرى خلال ساعات العمل المحددة.",
  },
};

export async function GET() {
  const blocks = await getContentBlocks(["withdrawal.tradingHours"]);
  return NextResponse.json(blocks["withdrawal.tradingHours"] ?? DEFAULT_CONFIG);
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, withdrawalSettingsSchema);
  if (error) return error;
  await updateContentBlock("withdrawal.tradingHours", data);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:withdrawal.tradingHours",
    details: JSON.stringify({ keys: ["withdrawal.tradingHours"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-withdrawal-settings", "default");
  return NextResponse.json({ success: true });
}
