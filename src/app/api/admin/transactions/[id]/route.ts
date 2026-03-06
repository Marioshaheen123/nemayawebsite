import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { validateBody } from "@/lib/validation";
import { updateTransactionSchema } from "@/lib/schemas/transaction";
import { safeErrorResponse } from "@/lib/error-handler";
import { updateTransaction, deleteTransaction } from "@/lib/services/payment-service";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await validateBody(request, updateTransactionSchema);
  if (error) return error;

  try {
    // Check existence before update
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const transaction = await updateTransaction(id, {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.method !== undefined && { method: data.method }),
      ...(data.amount !== undefined && { amount: data.amount }),
    });

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "update",
      resource: "Transaction",
      resourceId: id,
      details: JSON.stringify(data),
      ip: getClientIp(request),
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return safeErrorResponse(error, "admin-transaction-patch");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await deleteTransaction(id);

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "delete",
      resource: "Transaction",
      resourceId: id,
      details: JSON.stringify({ userId: existing.userId, type: existing.type, amount: existing.amount }),
      ip: getClientIp(request),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return safeErrorResponse(error, "admin-transaction-delete");
  }
}
