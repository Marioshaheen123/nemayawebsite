import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { safeErrorResponse } from "@/lib/error-handler";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ admin: null }, { status: 401 });
  }
  try {
    const payload = await verifyAdminToken(token);
    return NextResponse.json({
      admin: { id: payload.sub, email: payload.email, name: payload.name },
    });
  } catch (error) {
    return safeErrorResponse(error, "GET /api/admin/auth/me", 401);
  }
}
