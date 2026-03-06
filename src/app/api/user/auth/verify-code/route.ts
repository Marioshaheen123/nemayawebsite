import { NextRequest, NextResponse } from "next/server";

/**
 * OTP code verification endpoint.
 * In production, this would verify SMS/email OTP codes against
 * a stored code (in DB or cache like Redis).
 *
 * Currently accepts any 6-digit code for development.
 * Wire to your SMS/email provider (Twilio, SendGrid, etc.) for production.
 */
export async function POST(request: NextRequest) {
  try {
    const { code, phone } = await request.json();

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json(
        { error: "A valid 6-digit code is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // TODO: In production, verify against stored OTP
    // const stored = await redis.get(`otp:${phone}`);
    // if (stored !== code) return error;

    // For now, accept any 6-digit code in development
    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("[verify-code]", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
