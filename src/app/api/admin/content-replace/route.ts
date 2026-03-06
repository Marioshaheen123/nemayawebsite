import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { contentReplaceSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

interface ReplaceTarget {
  type: "contentBlock" | "model";
  model?: string;
  id?: string;
  key?: string;
  field: string;
  path?: string;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Recursively replace all string occurrences in an object (case-insensitive) */
function replaceInObject(obj: unknown, search: string, replace: string): unknown {
  if (typeof obj === "string") {
    return obj.replace(new RegExp(escapeRegExp(search), "gi"), replace);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceInObject(item, search, replace));
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = replaceInObject(v, search, replace);
    }
    return result;
  }
  return obj;
}

/** Replace in a ContentBlock — replaces all occurrences within the entire block.
 *  ContentBlocks are grouped units, so replacing at a specific path isn't needed;
 *  the UI groups results by block key and all matches in a block are replaced together. */
function replaceInBlock(obj: unknown, search: string, replace: string): unknown {
  return replaceInObject(obj, search, replace);
}

/** Model name → Prisma delegate mapping */
const MODEL_MAP: Record<string, string> = {
  BlogArticle: "blogArticle",
  NavItem: "navItem",
  FaqCategory: "faqCategory",
  FaqItem: "faqItem",
  Plan: "plan",
  PlanFeature: "planFeature",
  FinancialAsset: "financialAsset",
  Video: "video",
  LegalSection: "legalSection",
  IslamicRulingSection: "islamicRulingSection",
  IslamicRulingItem: "islamicRulingItem",
  SuggestedArticle: "suggestedArticle",
  AssetAdvantage: "assetAdvantage",
  AssetFaq: "assetFaq",
  Instrument: "instrument",
};

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, contentReplaceSchema);
  if (error) return error;
  const { search, replace, targets } = data;
  if (!search || !targets || !Array.isArray(targets)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let replaced = 0;

  // Group targets by type and key/id to minimize DB writes
  const contentBlockKeys = new Set<string>();
  const modelUpdates = new Map<string, Map<string, Set<string>>>(); // model -> id -> fields

  for (const target of targets as ReplaceTarget[]) {
    if (target.type === "contentBlock" && target.key) {
      contentBlockKeys.add(target.key);
    } else if (target.type === "model" && target.model && target.id) {
      if (!modelUpdates.has(target.model)) modelUpdates.set(target.model, new Map());
      const modelMap = modelUpdates.get(target.model)!;
      if (!modelMap.has(target.id)) modelMap.set(target.id, new Set());
      modelMap.get(target.id)!.add(target.field);
    }
  }

  // Process ContentBlocks
  for (const key of contentBlockKeys) {
    const block = await prisma.contentBlock.findUnique({ where: { key } });
    if (!block) continue;
    try {
      const parsed = JSON.parse(block.valueJson);
      const updated = replaceInBlock(parsed, search, replace);
      await prisma.contentBlock.update({
        where: { key },
        data: { valueJson: JSON.stringify(updated) },
      });
      replaced++;
    } catch {
      // Skip invalid JSON
    }
  }

  // Process model records
  for (const [model, idFieldMap] of modelUpdates) {
    const prismaModel = MODEL_MAP[model];
    if (!prismaModel) continue;

    for (const [id, fields] of idFieldMap) {
      // Fetch the record
      const record = await (prisma as any)[prismaModel].findUnique({ where: { id } });
      if (!record) continue;

      const updateData: Record<string, string> = {};
      for (const field of fields) {
        const value = record[field];
        if (typeof value !== "string") continue;

        // Handle JSON string fields (like benefitsEn, paragraphsEn)
        const regex = new RegExp(escapeRegExp(search), "gi");
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            const updated = parsed.map((item: unknown) =>
              typeof item === "string" ? item.replace(regex, replace) : item
            );
            updateData[field] = JSON.stringify(updated);
            continue;
          }
        } catch {
          // Not JSON
        }

        updateData[field] = value.replace(regex, replace);
      }

      if (Object.keys(updateData).length > 0) {
        await (prisma as any)[prismaModel].update({
          where: { id },
          data: updateData,
        });
        replaced++;
      }
    }
  }

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "content-replace",
    resource: "ContentReplace",
    details: JSON.stringify({ search: data.search, replace: data.replace, targetsCount: data.targets?.length ?? 0, replaced }),
    ip: getClientIp(request),
  });

  // Revalidate caches
  revalidatePath("/");
  revalidateTag("content-blocks", "default");

  return NextResponse.json({ replaced });
}
