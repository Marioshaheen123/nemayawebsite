import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { videoLabelsSchema } from "@/lib/schemas/video";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const blocks = await getContentBlocks([
    "videos.heroTitle",
    "videos.watchNowLabel",
    "videos.moreVideoLabel",
    "videos.keyTakeawaysLabel",
    "videos.directLinkLabel",
  ]);
  return NextResponse.json({
    heroTitle: blocks["videos.heroTitle"] ?? { en: "Video", ar: "\u0641\u064A\u062F\u064A\u0648" },
    watchNowLabel: blocks["videos.watchNowLabel"] ?? { en: "Watch Now", ar: "\u0634\u0627\u0647\u062F \u0627\u0644\u0622\u0646" },
    moreVideoLabel: blocks["videos.moreVideoLabel"] ?? { en: "More video", ar: "\u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0641\u064A\u062F\u064A\u0648" },
    keyTakeawaysLabel: blocks["videos.keyTakeawaysLabel"] ?? { en: "Key Takeaways:", ar: "\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629:" },
    directLinkLabel: blocks["videos.directLinkLabel"] ?? { en: "Direct Link to Tool:", ar: "\u0631\u0627\u0628\u0637 \u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u0623\u062F\u0627\u0629:" },
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, videoLabelsSchema);
  if (error) return error;
  await Promise.all([
    updateContentBlock("videos.heroTitle", data.heroTitle),
    updateContentBlock("videos.watchNowLabel", data.watchNowLabel),
    updateContentBlock("videos.moreVideoLabel", data.moreVideoLabel),
    updateContentBlock("videos.keyTakeawaysLabel", data.keyTakeawaysLabel),
    updateContentBlock("videos.directLinkLabel", data.directLinkLabel),
  ]);
  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "update",
    resource: "ContentBlock:videos.labels",
    details: JSON.stringify({ keys: ["videos.heroTitle", "videos.watchNowLabel", "videos.moreVideoLabel", "videos.keyTakeawaysLabel", "videos.directLinkLabel"] }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidatePath("/videos");
  revalidateTag("content-blocks", "default");
  return NextResponse.json({ success: true });
}
