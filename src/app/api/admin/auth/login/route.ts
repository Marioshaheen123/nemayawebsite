import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  signAdminToken,
  signRefreshToken,
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !(await compare(password, admin.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    };

    const accessToken = await signAdminToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });

    // Access token — short-lived (15 min)
    response.cookies.set(COOKIE_NAME, accessToken, {
      ...SECURE_COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    // Refresh token — longer-lived (7 days), scoped to refresh endpoint
    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      ...SECURE_COOKIE_OPTIONS,
      path: "/api/admin/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    await logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "login",
      resource: "AdminAuth",
      details: JSON.stringify({ email }),
      ip: getClientIp(request),
    });

    return response;
  } catch (error) {
    return safeErrorResponse(error, "POST /api/admin/auth/login");
  }
}
