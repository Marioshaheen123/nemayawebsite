import { NextRequest, NextResponse } from "next/server";
import {
  verifyUserRefreshToken,
  signUserToken,
  USER_COOKIE_NAME,
  USER_REFRESH_COOKIE_NAME,
  USER_COOKIE_OPTIONS,
} from "@/lib/user-auth";
import { getUserById } from "@/lib/services/crm-service";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(USER_REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const { sub } = await verifyUserRefreshToken(refreshToken);
    const user = await getUserById(sub);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const accessToken = await signUserToken({
      sub: user.id,
      accountId: user.accountId,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.accountId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    response.cookies.set(USER_COOKIE_NAME, accessToken, {
      ...USER_COOKIE_OPTIONS,
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
