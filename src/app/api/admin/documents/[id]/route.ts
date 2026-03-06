import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";
import { z } from "zod";
import { updateDocumentStatus } from "@/lib/services/crm-service";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existing = await prisma.userDocument.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await updateDocumentStatus(id, parsed.data.status);

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "update",
      resource: "UserDocument",
      resourceId: id,
      details: JSON.stringify({ status: parsed.data.status, userId: existing.userId }),
      ip: getClientIp(request),
    });

    return NextResponse.json(updated);
  } catch (error) {
    return safeErrorResponse(error, "admin-document-patch");
  }
}
