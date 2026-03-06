import { NextRequest, NextResponse } from "next/server";
import {
  verifyUserToken,
  verifyUserRefreshToken,
  signUserToken,
  USER_COOKIE_NAME,
  USER_REFRESH_COOKIE_NAME,
  USER_COOKIE_OPTIONS,
} from "@/lib/user-auth";
import { getUserById } from "@/lib/services/crm-service";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(USER_REFRESH_COOKIE_NAME)?.value;

  // Try access token first
  if (token) {
    try {
      const payload = await verifyUserToken(token);
      const user = await getUserById(payload.sub);
      if (user) {
        return NextResponse.json({
          user: {
            id: user.accountId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      }
    } catch {
      // Access token expired or invalid — fall through to refresh
    }
  }

  // Try refresh token
  if (refreshToken) {
    try {
      const { sub } = await verifyUserRefreshToken(refreshToken);
      const user = await getUserById(sub);
      if (user) {
        // Issue a new access token
        const newAccessToken = await signUserToken({
          sub: user.id,
          accountId: user.accountId,
          email: user.email,
        });

        const response = NextResponse.json({
          user: {
            id: user.accountId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });

        response.cookies.set(USER_COOKIE_NAME, newAccessToken, {
          ...USER_COOKIE_OPTIONS,
          maxAge: 60 * 60,
        });

        return response;
      }
    } catch {
      // Refresh token also invalid
    }
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
