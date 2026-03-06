import { NextResponse } from "next/server";

const CLIENT_MESSAGES: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  413: "Payload too large",
  415: "Unsupported media type",
  429: "Too many requests",
  500: "Internal server error",
};

/**
 * Safe error response that never leaks internal details to the client.
 * Logs the full error server-side for debugging.
 */
export function safeErrorResponse(
  error: unknown,
  context: string,
  statusCode = 500
): NextResponse {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
  } else {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${context}] ${msg}`);
  }

  return NextResponse.json(
    { error: CLIENT_MESSAGES[statusCode] ?? "Internal server error" },
    { status: statusCode }
  );
}
