import { NextRequest, NextResponse } from "next/server";

/**
 * Send OTP code to phone or email.
 * In production, integrate with SMS provider (Twilio, etc.) or email service.
 *
 * Currently logs the code to console for development.
 */
export async function POST(request: NextRequest) {
  try {
    const { phone, email, type } = await request.json();

    const target = phone || email;
    if (!target) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = String(100000 + Math.floor(Math.random() * 900000));

    // TODO: In production, store OTP and send via SMS/email
    // await redis.setex(`otp:${target}`, 300, otp); // 5 min expiry
    // if (type === "sms") await twilio.send(phone, `Your code: ${otp}`);
    // if (type === "email") await sendgrid.send(email, `Your code: ${otp}`);

    console.log(`[send-otp] ${type || "sms"} OTP for ${target}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${type === "email" ? "email" : "phone"}`,
      // Include OTP in development for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("[send-otp]", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
