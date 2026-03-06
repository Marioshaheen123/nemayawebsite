import { NextRequest, NextResponse } from "next/server";
import { updateContentBlock, getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { footerSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const [blocks, quickLinks, supportLinks, socialIcons] = await Promise.all([
    getContentBlocks(["navigation.footerLabels", "navigation.footerContactInfo"]),
    prisma.navItem.findMany({
      where: { location: "footerQuickLinks" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.navItem.findMany({
      where: { location: "footerSupportLinks" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.socialIcon.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({
    labels: blocks["navigation.footerLabels"] ?? {
      en: { brandDesc: "", quickLinks: "", support: "", contact: "", copyright: "" },
      ar: { brandDesc: "", quickLinks: "", support: "", contact: "", copyright: "" },
    },
    contactInfo: blocks["navigation.footerContactInfo"] ?? { phone: "", email: "" },
    quickLinks: JSON.parse(JSON.stringify(quickLinks)),
    supportLinks: JSON.parse(JSON.stringify(supportLinks)),
    socialIcons: JSON.parse(JSON.stringify(socialIcons)),
  });
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, footerSchema);
  if (error) return error;
  const { labels, contactInfo, quickLinks, supportLinks, socialIcons } = data;

  // Update content blocks
  await Promise.all([
    updateContentBlock("navigation.footerLabels", labels),
    updateContentBlock("navigation.footerContactInfo", contactInfo),
  ]);

  // Sync Quick Links
  if (quickLinks) {
    const existingQL = await prisma.navItem.findMany({
      where: { location: "footerQuickLinks" },
      select: { id: true },
    });
    const existingQLIds = new Set(existingQL.map((l) => l.id));
    const incomingQLIds = new Set(
      quickLinks.filter((l: any) => l.id && !l.id.startsWith("new_")).map((l: any) => l.id)
    );
    const toDeleteQL = [...existingQLIds].filter((id) => !incomingQLIds.has(id));
    if (toDeleteQL.length > 0) {
      await prisma.navItem.deleteMany({ where: { id: { in: toDeleteQL } } });
    }
    for (let i = 0; i < quickLinks.length; i++) {
      const link = quickLinks[i];
      const isNew = !link.id || link.id.startsWith("new_");
      const data = {
        location: "footerQuickLinks" as string,
        labelEn: link.labelEn || "",
        labelAr: link.labelAr || "",
        href: link.href || "",
        sortOrder: i,
      };
      if (isNew) {
        await prisma.navItem.create({ data });
      } else {
        await prisma.navItem.update({ where: { id: link.id! }, data });
      }
    }
  }

  // Sync Support Links
  if (supportLinks) {
    const existingSL = await prisma.navItem.findMany({
      where: { location: "footerSupportLinks" },
      select: { id: true },
    });
    const existingSLIds = new Set(existingSL.map((l) => l.id));
    const incomingSLIds = new Set(
      supportLinks.filter((l: any) => l.id && !l.id.startsWith("new_")).map((l: any) => l.id)
    );
    const toDeleteSL = [...existingSLIds].filter((id) => !incomingSLIds.has(id));
    if (toDeleteSL.length > 0) {
      await prisma.navItem.deleteMany({ where: { id: { in: toDeleteSL } } });
    }
    for (let i = 0; i < supportLinks.length; i++) {
      const link = supportLinks[i];
      const isNew = !link.id || link.id.startsWith("new_");
      const data = {
        location: "footerSupportLinks" as string,
        labelEn: link.labelEn || "",
        labelAr: link.labelAr || "",
        href: link.href || "",
        sortOrder: i,
      };
      if (isNew) {
        await prisma.navItem.create({ data });
      } else {
        await prisma.navItem.update({ where: { id: link.id! }, data });
      }
    }
  }

  // Sync Social Icons
  if (socialIcons) {
    const existingSI = await prisma.socialIcon.findMany({ select: { id: true } });
    const existingSIIds = new Set(existingSI.map((i) => i.id));
    const incomingSIIds = new Set(
      socialIcons.filter((i: any) => i.id && !i.id.startsWith("new_")).map((i: any) => i.id)
    );
    const toDeleteSI = [...existingSIIds].filter((id) => !incomingSIIds.has(id));
    if (toDeleteSI.length > 0) {
      await prisma.socialIcon.deleteMany({ where: { id: { in: toDeleteSI } } });
    }
    for (let i = 0; i < socialIcons.length; i++) {
      const icon = socialIcons[i];
      const isNew = !icon.id || icon.id.startsWith("new_");
      const data = {
        src: icon.src || "",
        alt: icon.alt || "",
        href: icon.href || "",
        sortOrder: i,
      };
      if (isNew) {
        await prisma.socialIcon.create({ data });
      } else {
        await prisma.socialIcon.update({ where: { id: icon.id! }, data });
      }
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "update",
    resource: "Footer",
    details: JSON.stringify({ quickLinksCount: data.quickLinks?.length ?? 0, supportLinksCount: data.supportLinks?.length ?? 0, socialIconsCount: data.socialIcons?.length ?? 0 }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-footer", "default");
  return NextResponse.json({ success: true });
}
