import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminToken,
  COOKIE_NAME,
  type AdminTokenPayload,
} from "@/lib/admin-auth";

/**
 * Defense-in-depth: verify admin token inside a route handler
 * (redundant with middleware — that's the point).
 * Returns the admin payload for audit logging.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<
  | { admin: AdminTokenPayload; error: null }
  | { admin: null; error: NextResponse }
> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return {
      admin: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  try {
    const admin = await verifyAdminToken(token);
    return { admin, error: null };
  } catch {
    return {
      admin: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}
