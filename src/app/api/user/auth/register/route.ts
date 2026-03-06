import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import {
  getUserByEmail,
  isAccountIdTaken,
  createUser,
} from "@/lib/services/crm-service";

const registerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().regex(/^\+\d{1,4}\d{4,15}$/, "Invalid phone number"),
  password: z.string().min(8).max(200),
  confirmPassword: z.string().min(8).max(200),
  age: z.string().max(50).optional(),
  country: z.string().max(100).optional(),
  callTime: z.string().max(100).optional(),
});

function generateAccountId(): string {
  return String(100000 + Math.floor(Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check if email already exists in CRM
    const existingEmail = await getUserByEmail(data.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate unique account ID
    let accountId = generateAccountId();
    let attempts = 0;
    while (attempts < 10) {
      const taken = await isAccountIdTaken(accountId);
      if (!taken) break;
      accountId = generateAccountId();
      attempts++;
    }

    const passwordHash = await hash(data.password, 12);

    // Create user in CRM (Dynamics 365 Contact)
    const user = await createUser({
      accountId,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.phone,
      country: data.country || "",
    });

    return NextResponse.json({
      success: true,
      accountId: user.accountId,
    }, { status: 201 });
  } catch (error) {
    console.error("[user-auth-register]", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
