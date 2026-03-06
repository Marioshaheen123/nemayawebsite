import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getUserByEmail } from "@/lib/services/crm-service";

function getSecret(): Uint8Array {
  const raw = process.env.USER_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!raw) throw new Error("JWT secret missing");
  return new TextEncoder().encode(raw);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email.toLowerCase().trim());

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Generate a password reset token (15 min expiry)
    const resetToken = await new SignJWT({
      sub: user.id,
      type: "password_reset",
      email: user.email,
    } as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .setJti(crypto.randomUUID())
      .sign(getSecret());

    // TODO: Send email with reset link: /reset-password?token=<resetToken>
    // Integration point: Use SendGrid, AWS SES, or Dynamics 365 email
    console.log(`[password-reset] Token for ${user.email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
      // Include token in development for testing
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
