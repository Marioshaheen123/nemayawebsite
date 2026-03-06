import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-guard";
import { z } from "zod";
import { createContactRequest } from "@/lib/services/crm-service";

const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phoneNumber: z.string().min(1).max(30),
  reason: z.string().min(1).max(500),
  requestType: z.string().min(1).max(100),
  topicDetails: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Create contact request in CRM (Dynamics 365 Lead/Case entity)
    await createContactRequest({
      userId: user.sub,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      reason: data.reason,
      requestType: data.requestType,
      topicDetails: data.topicDetails || "",
    });

    return NextResponse.json({ success: true, message: "Contact request submitted" });
  } catch (error) {
    console.error("[user-contact]", error);
    return NextResponse.json(
      { error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
}
