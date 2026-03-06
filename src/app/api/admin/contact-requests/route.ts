import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeErrorResponse } from "@/lib/error-handler";
import { getContactRequests } from "@/lib/services/crm-service";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
    const statusFilter = url.searchParams.get("status") || undefined;

    const validStatuses = ["New", "In Progress", "Resolved"];

    const { items, total } = await getContactRequests({
      status: statusFilter && validStatuses.includes(statusFilter) ? statusFilter : undefined,
      page,
      limit,
    });

    return NextResponse.json({ requests: items, total });
  } catch (error) {
    return safeErrorResponse(error, "admin-contact-requests-get");
  }
}
