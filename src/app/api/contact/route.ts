import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateBody } from "@/lib/validation";
import { safeErrorResponse } from "@/lib/error-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createContactRequest } from "@/lib/services/crm-service";

const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().regex(/^0?5\d{8}$/, "Invalid Saudi phone number"),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 contact submissions per 10 minutes per IP
    const ip = getClientIp(request);
    const rl = rateLimit(ip, { maxRequests: 5, windowSizeSeconds: 600 }, "contact");
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { data, error } = await validateBody(request, contactSchema);
    if (error) return error;

    // Create contact request in CRM (Dynamics 365 Lead/Case entity)
    await createContactRequest({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      reason: data.subject,
      requestType: "Contact Form",
      topicDetails: data.message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return safeErrorResponse(err, "POST /api/contact");
  }
}
