import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// ─── Rate limit configs ──────────────────────────────────────────────
const LOGIN_LIMIT = { maxRequests: 5, windowSizeSeconds: 300 };
const ADMIN_UPLOAD_LIMIT = { maxRequests: 10, windowSizeSeconds: 60 };
const ADMIN_MUTATION_LIMIT = { maxRequests: 30, windowSizeSeconds: 60 };
const USER_UPLOAD_LIMIT = { maxRequests: 5, windowSizeSeconds: 60 };
const REFRESH_LIMIT = { maxRequests: 10, windowSizeSeconds: 60 };

function rateLimitResponse(resetInSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetInSeconds),
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = getClientIp(request);

  // ─── Request size limit (1MB for JSON APIs) ──────────────────────
  if (pathname.startsWith("/api/")) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 1_048_576) {
      // Allow larger for upload endpoints (they have their own limits)
      if (
        !pathname.startsWith("/api/admin/upload") &&
        pathname !== "/api/user/avatar" &&
        pathname !== "/api/user/documents"
      ) {
        return NextResponse.json(
          { error: "Payload too large" },
          { status: 413 }
        );
      }
    }
  }

  // ─── CORS origin check for admin API ─────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ─── Rate limit: admin login ─────────────────────────────────────
  if (pathname === "/api/admin/auth/login" && method === "POST") {
    const rl = rateLimit(`login:${ip}`, LOGIN_LIMIT, "login");
    if (!rl.success) return rateLimitResponse(rl.resetInSeconds);
  }

  // ─── Rate limit: token refresh ───────────────────────────────────
  if (pathname === "/api/admin/auth/refresh" && method === "POST") {
    const rl = rateLimit(`refresh:${ip}`, REFRESH_LIMIT, "refresh");
    if (!rl.success) return rateLimitResponse(rl.resetInSeconds);
  }

  // ─── Rate limit: user uploads ────────────────────────────────────
  if (
    (pathname === "/api/user/avatar" || pathname === "/api/user/documents") &&
    method === "POST"
  ) {
    const rl = rateLimit(`user-upload:${ip}`, USER_UPLOAD_LIMIT, "user-upload");
    if (!rl.success) return rateLimitResponse(rl.resetInSeconds);
  }

  // ─── Rate limit: admin uploads ───────────────────────────────────
  if (pathname.startsWith("/api/admin/upload") && method === "POST") {
    const rl = rateLimit(
      `admin-upload:${ip}`,
      ADMIN_UPLOAD_LIMIT,
      "admin-upload"
    );
    if (!rl.success) return rateLimitResponse(rl.resetInSeconds);
  }

  // ─── Rate limit: admin mutations ─────────────────────────────────
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth") &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method)
  ) {
    const rl = rateLimit(
      `admin-mutation:${ip}`,
      ADMIN_MUTATION_LIMIT,
      "admin-mutation"
    );
    if (!rl.success) return rateLimitResponse(rl.resetInSeconds);
  }

  // ─── CSRF: require custom header on admin mutations ──────────────
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method)
  ) {
    // Upload uses FormData, not JSON — check for the header only on JSON routes
    if (!pathname.startsWith("/api/admin/upload")) {
      const csrf = request.headers.get("x-requested-with");
      if (csrf !== "XMLHttpRequest") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }
  }

  // ─── Protect admin pages (except login) ──────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // ─── Protect admin API routes (except auth) ──────────────────────
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/refresh")
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/user/:path*"],
};
