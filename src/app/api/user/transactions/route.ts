import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-guard";
import { getUserTransactions } from "@/lib/services/payment-service";

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
    const typeFilter = url.searchParams.get("type") || undefined;
    const statusFilter = url.searchParams.get("status") || undefined;

    const validTypes = ["Deposit", "Withdrawal", "Bonus"];
    const validStatuses = ["Completed", "Pending", "Failed"];

    const { items, total } = await getUserTransactions({
      userId: user.sub,
      type: typeFilter && validTypes.includes(typeFilter) ? typeFilter : undefined,
      status: statusFilter && validStatuses.includes(statusFilter) ? statusFilter : undefined,
      page,
      limit,
    });

    return NextResponse.json({ transactions: items, total });
  } catch (error) {
    console.error("[user-transactions-get]", error);
    return NextResponse.json({ transactions: [], total: 0 });
  }
}
