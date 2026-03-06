import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { jwtVerify } from "jose";
import { getUserById, updateUserPassword } from "@/lib/services/crm-service";

function getSecret(): Uint8Array {
  const raw = process.env.USER_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!raw) throw new Error("JWT secret missing");
  return new TextEncoder().encode(raw);
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify reset token
    let payload;
    try {
      const result = await jwtVerify(token, getSecret());
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 401 }
      );
    }

    if (payload.type !== "password_reset") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      );
    }

    const userId = payload.sub as string;
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passwordHash = await hash(password, 12);
    await updateUserPassword(userId, passwordHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password]", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
