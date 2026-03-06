import { SignJWT, jwtVerify } from "jose";

// ─── Secret validation ───────────────────────────────────────────────
const JWT_SECRET_RAW = process.env.ADMIN_JWT_SECRET;
if (!JWT_SECRET_RAW || JWT_SECRET_RAW.length < 32) {
  throw new Error(
    "FATAL: ADMIN_JWT_SECRET environment variable is missing or too short (minimum 32 characters). The application refuses to start without a secure secret."
  );
}
const SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

// ─── Cookie names ────────────────────────────────────────────────────
export const COOKIE_NAME = "admin_token";
export const REFRESH_COOKIE_NAME = "admin_refresh";

// ─── Secure cookie options ───────────────────────────────────────────
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

// ─── Token payload ───────────────────────────────────────────────────
export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
}

// ─── Access token (15 minutes) ───────────────────────────────────────
export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT({
    ...payload,
    type: "access",
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setJti(crypto.randomUUID())
    .sign(SECRET);
}

// ─── Refresh token (7 days) ─────────────────────────────────────────
export async function signRefreshToken(payload: AdminTokenPayload) {
  return new SignJWT({
    sub: payload.sub,
    type: "refresh",
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setJti(crypto.randomUUID())
    .sign(SECRET);
}

// ─── Verify access token ────────────────────────────────────────────
export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  if (payload.type !== "access") throw new Error("Invalid token type");
  return payload as unknown as AdminTokenPayload;
}

// ─── Verify refresh token ───────────────────────────────────────────
export async function verifyRefreshToken(
  token: string
): Promise<{ sub: string }> {
  const { payload } = await jwtVerify(token, SECRET);
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  return { sub: payload.sub as string };
}
