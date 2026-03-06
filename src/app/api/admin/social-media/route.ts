import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { socialMediaSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "socialMedia.content",
    "socialMedia.channels",
  ]);
  return NextResponse.json({
    content: blocks["socialMedia.content"] ?? {
      en: {
        heroTitle: "Social Media",
        sectionHeading: "All Namaya social media platforms in one place",
        sectionDescription: "",
        contactTitle: "Contact Us",
        contactDescription: "",
        contactCtaText: "Contact Us",
        contactCtaUrl: "/contact",
      },
      ar: {
        heroTitle: "مواقع التواصل الاجتماعي",
        sectionHeading: "كل منصات التواصل الاجتماعي الخاصة بنمايا في مكان واحد",
        sectionDescription: "",
        contactTitle: "تواصل معنا",
        contactDescription: "",
        contactCtaText: "تواصل معنا",
        contactCtaUrl: "/contact",
      },
    },
    channels: blocks["socialMedia.channels"] ?? [],
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, socialMediaSchema);
  if (error) return error;

  await Promise.all([
    updateContentBlock("socialMedia.content", data.content),
    updateContentBlock("socialMedia.channels", data.channels),
  ]);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:socialMedia",
    details: JSON.stringify({ keys: ["socialMedia.content", "socialMedia.channels"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
