import { NextResponse } from "next/server";
import { USER_COOKIE_NAME, USER_REFRESH_COOKIE_NAME } from "@/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(USER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(USER_REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/user/auth/refresh",
    maxAge: 0,
  });

  return response;
}
