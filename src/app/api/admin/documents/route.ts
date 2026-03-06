import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeErrorResponse } from "@/lib/error-handler";
import { getDocuments } from "@/lib/services/crm-service";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
    const statusFilter = url.searchParams.get("status") || undefined;
    const userId = url.searchParams.get("userId") || undefined;

    const validStatuses = ["Pending", "Approved", "Rejected"];

    const { items, total } = await getDocuments({
      status: statusFilter && validStatuses.includes(statusFilter) ? statusFilter : undefined,
      userId,
      page,
      limit,
    });

    return NextResponse.json({ documents: items, total });
  } catch (error) {
    return safeErrorResponse(error, "admin-documents-get");
  }
}
