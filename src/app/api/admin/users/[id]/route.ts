import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";
import { z } from "zod";
import {
  getUserById,
  updateUser,
  getUserContactRequests,
  getUserDocuments,
} from "@/lib/services/crm-service";
import { getUserTransactions } from "@/lib/services/payment-service";

const updateUserSchema = z.object({
  firstName: z.string().max(200).optional(),
  lastName: z.string().max(200).optional(),
  email: z.string().email().max(200).optional(),
  mobile: z.string().max(30).optional(),
  dateOfBirth: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(200).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  profession: z.string().max(200).optional(),
  additionalPhone: z.string().max(30).optional(),
  annualIncome: z.string().max(100).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch related data from CRM + payment services
    const [transactions, documents, contactRequests] = await Promise.all([
      getUserTransactions({ userId: id, limit: 20 }).then((r) => r.items),
      getUserDocuments(id),
      getUserContactRequests(id),
    ]);

    return NextResponse.json({ user, transactions, documents, contactRequests });
  } catch (error) {
    return safeErrorResponse(error, "admin-user-get");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await getUserById(id);
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await updateUser(id, parsed.data);

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "update",
      resource: "User",
      resourceId: id,
      details: JSON.stringify(parsed.data),
      ip: getClientIp(request),
    });

    return NextResponse.json(user);
  } catch (error) {
    return safeErrorResponse(error, "admin-user-patch");
  }
}
