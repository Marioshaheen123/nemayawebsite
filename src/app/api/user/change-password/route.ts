import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { requireUser } from "@/lib/user-guard";
import { getUserById, updateUserPassword } from "@/lib/services/crm-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }
    if (!/\d/.test(newPassword)) {
      return NextResponse.json(
        { error: "New password must contain at least one number" },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      return NextResponse.json(
        { error: "New password must contain at least one special character" },
        { status: 400 }
      );
    }

    // Get user from CRM — need passwordHash for verification
    // NOTE: When using Dynamics 365 + Azure AD B2C for auth, password change
    // would go through the identity provider's API instead
    const dbUser = await prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCurrentValid = await compare(currentPassword, dbUser.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const newHash = await hash(newPassword, 12);
    await updateUserPassword(user.sub, newHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[user-change-password]", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
