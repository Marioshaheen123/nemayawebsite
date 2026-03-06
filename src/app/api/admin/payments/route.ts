import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { paymentsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

const DEFAULT_CONFIG = { providers: [] };

export async function GET() {
  const blocks = await getContentBlocks(["payments.config"]);
  return NextResponse.json(blocks["payments.config"] ?? DEFAULT_CONFIG);
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, paymentsSchema);
  if (error) return error;
  await updateContentBlock("payments.config", data);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:payments.config",
    details: JSON.stringify({ keys: ["payments.config"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-payments", "default");
  return NextResponse.json({ success: true });
}
