import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  signAdminToken,
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/admin-auth";
import { safeErrorResponse } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sub } = await verifyRefreshToken(refreshToken);

    // Verify admin still exists in database
    const admin = await prisma.adminUser.findUnique({
      where: { id: sub },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = await signAdminToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });

    response.cookies.set(COOKIE_NAME, accessToken, {
      ...SECURE_COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    return safeErrorResponse(error, "POST /api/admin/auth/refresh", 401);
  }
}
