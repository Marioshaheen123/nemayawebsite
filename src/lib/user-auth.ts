import { SignJWT, jwtVerify } from "jose";

// ─── Lazy secret — evaluated on first use, not at import time ───────
function getSecret(): Uint8Array {
  const raw = process.env.USER_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error(
      "USER_JWT_SECRET (or ADMIN_JWT_SECRET fallback) is missing or too short (minimum 32 characters)."
    );
  }
  return new TextEncoder().encode(raw);
}

// ─── Cookie names ────────────────────────────────────────────────────
export const USER_COOKIE_NAME = "user_token";
export const USER_REFRESH_COOKIE_NAME = "user_refresh";

// ─── Secure cookie options ───────────────────────────────────────────
export const USER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

// ─── Token payload ───────────────────────────────────────────────────
export interface UserTokenPayload {
  sub: string;
  accountId: string;
  email: string;
}

// ─── Access token (1 hour) ──────────────────────────────────────────
export async function signUserToken(payload: UserTokenPayload) {
  return new SignJWT({
    ...payload,
    type: "user_access",
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .setJti(crypto.randomUUID())
    .sign(getSecret());
}

// ─── Refresh token (30 days) ────────────────────────────────────────
export async function signUserRefreshToken(payload: UserTokenPayload) {
  return new SignJWT({
    sub: payload.sub,
    type: "user_refresh",
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setJti(crypto.randomUUID())
    .sign(getSecret());
}

// ─── Verify access token ────────────────────────────────────────────
export async function verifyUserToken(
  token: string
): Promise<UserTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.type !== "user_access") throw new Error("Invalid token type");
  return payload as unknown as UserTokenPayload;
}

// ─── Verify refresh token ───────────────────────────────────────────
export async function verifyUserRefreshToken(
  token: string
): Promise<{ sub: string }> {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.type !== "user_refresh") throw new Error("Invalid token type");
  return { sub: payload.sub as string };
}
