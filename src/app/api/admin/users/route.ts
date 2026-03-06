import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeErrorResponse } from "@/lib/error-handler";
import { getUsers } from "@/lib/services/crm-service";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
    const search = url.searchParams.get("search")?.trim() || "";

    const { items, total } = await getUsers({ search: search || undefined, page, limit });

    return NextResponse.json({ users: items, total });
  } catch (error) {
    return safeErrorResponse(error, "admin-users-get");
  }
}
