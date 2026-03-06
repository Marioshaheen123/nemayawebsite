import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, USER_COOKIE_NAME, type UserTokenPayload } from "./user-auth";

/**
 * Require authenticated user. Returns the user payload or a 401 error response.
 */
export async function requireUser(
  request: NextRequest
): Promise<{ user: UserTokenPayload; error?: never } | { user?: never; error: NextResponse }> {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value;
  if (!token) {
    return {
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  try {
    const user = await verifyUserToken(token);
    return { user };
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid or expired session" }, { status: 401 }),
    };
  }
}
