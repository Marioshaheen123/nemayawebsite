import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear access token
  response.cookies.set(COOKIE_NAME, "", {
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 0,
  });

  // Clear refresh token
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...SECURE_COOKIE_OPTIONS,
    path: "/api/admin/auth/refresh",
    maxAge: 0,
  });

  return response;
}
