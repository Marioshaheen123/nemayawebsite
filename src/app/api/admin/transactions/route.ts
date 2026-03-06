import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { validateBody } from "@/lib/validation";
import { createTransactionSchema } from "@/lib/schemas/transaction";
import { safeErrorResponse } from "@/lib/error-handler";
import { getTransactions, createTransaction } from "@/lib/services/payment-service";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
    const userId = url.searchParams.get("userId") || undefined;
    const type = url.searchParams.get("type") || undefined;
    const status = url.searchParams.get("status") || undefined;

    const validTypes = ["Deposit", "Withdrawal", "Bonus"];
    const validStatuses = ["Completed", "Pending", "Failed"];

    const { items, total } = await getTransactions({
      userId,
      type: type && validTypes.includes(type) ? type : undefined,
      status: status && validStatuses.includes(status) ? status : undefined,
      page,
      limit,
    });

    return NextResponse.json({ transactions: items, total });
  } catch (error) {
    return safeErrorResponse(error, "admin-transactions-get");
  }
}

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, createTransactionSchema);
  if (error) return error;

  try {
    const transaction = await createTransaction({
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      method: data.method,
      status: data.status,
      note: data.note ?? undefined,
      currency: data.currency,
      reference: data.reference ?? null,
    });

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "create",
      resource: "Transaction",
      resourceId: transaction.id,
      details: JSON.stringify({ userId: data.userId, type: data.type, amount: data.amount }),
      ip: getClientIp(request),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "admin-transactions-post");
  }
}
