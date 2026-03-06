import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import {
  signUserToken,
  signUserRefreshToken,
  USER_COOKIE_NAME,
  USER_REFRESH_COOKIE_NAME,
  USER_COOKIE_OPTIONS,
} from "@/lib/user-auth";
import { getUserByAccountId } from "@/lib/services/crm-service";

export async function POST(request: NextRequest) {
  try {
    const { accountNumber, password } = await request.json();

    if (!accountNumber || !password) {
      return NextResponse.json(
        { error: "Account number and password are required" },
        { status: 400 }
      );
    }

    const user = await getUserByAccountId(accountNumber);

    if (!user || !(await compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      sub: user.id,
      accountId: user.accountId,
      email: user.email,
    };

    const accessToken = await signUserToken(tokenPayload);
    const refreshToken = await signUserRefreshToken(tokenPayload);

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

    response.cookies.set(USER_REFRESH_COOKIE_NAME, refreshToken, {
      ...USER_COOKIE_OPTIONS,
      path: "/api/user/auth",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("[user-auth-login]", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
