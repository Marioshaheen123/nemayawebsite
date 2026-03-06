import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-guard";
import { safeErrorResponse } from "@/lib/error-handler";
import { z } from "zod";
import { getUserById, updateUser } from "@/lib/services/crm-service";

const profileSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  mobile: z.string().max(30).optional(),
  dateOfBirth: z.string().max(20).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  additionalPhone: z.string().max(30).optional(),
  annualIncome: z.string().max(50).optional(),
});

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const dbUser = await getUserById(user.sub);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: dbUser.accountId,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      mobile: dbUser.mobile,
      dateOfBirth: dbUser.dateOfBirth,
      address: dbUser.address,
      city: dbUser.city,
      postalCode: dbUser.postalCode,
      country: dbUser.country,
      profession: dbUser.profession,
      additionalPhone: dbUser.additionalPhone,
      annualIncome: dbUser.annualIncome,
      avatar: dbUser.avatarUrl,
    });
  } catch (error) {
    return safeErrorResponse(error, "GET /api/user/profile");
  }
}

export async function PUT(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    await updateUser(user.sub, {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile ?? "",
      dateOfBirth: data.dateOfBirth ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      postalCode: data.postalCode ?? "",
      country: data.country ?? "",
      profession: data.profession ?? "",
      additionalPhone: data.additionalPhone ?? "",
      annualIncome: data.annualIncome ?? "",
    });

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    return safeErrorResponse(error, "PUT /api/user/profile", 400);
  }
}
