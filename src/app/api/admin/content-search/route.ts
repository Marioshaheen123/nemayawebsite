import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/lib/validation";
import { contentSearchSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";

interface SearchResult {
  type: "contentBlock" | "model";
  model?: string;
  id?: string;
  key?: string;
  field: string;
  path?: string;
  preview: string;
  matchCount: number;
}

/** Recursively search all string values in an object, return matches */
function searchObject(obj: unknown, query: string, parentPath = ""): { path: string; value: string; count: number }[] {
  const results: { path: string; value: string; count: number }[] = [];
  const lowerQuery = query.toLowerCase();

  if (typeof obj === "string") {
    const count = obj.toLowerCase().split(lowerQuery).length - 1;
    if (count > 0) {
      // Center preview around first match
      const matchIdx = obj.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, matchIdx - 80);
      const end = Math.min(obj.length, matchIdx + lowerQuery.length + 120);
      const preview = (start > 0 ? "..." : "") + obj.substring(start, end) + (end < obj.length ? "..." : "");
      results.push({ path: parentPath, value: preview, count });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      results.push(...searchObject(item, query, `${parentPath}[${i}]`));
    });
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      results.push(...searchObject(v, query, parentPath ? `${parentPath}.${k}` : k));
    }
  }

  return results;
}

/** Search bilingual string fields of a Prisma model */
function searchModelFields(
  records: Record<string, unknown>[],
  model: string,
  fields: string[],
  query: string
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  for (const record of records) {
    for (const field of fields) {
      const value = record[field];
      if (typeof value !== "string") continue;

      // For JSON string fields (like benefitsEn, paragraphsEn), parse and search
      let searchableText = value;
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          searchableText = parsed.join(" ");
        }
      } catch {
        // Not JSON, use as-is
      }

      const count = searchableText.toLowerCase().split(lowerQuery).length - 1;
      if (count > 0) {
        // Center preview around first match
        const matchIdx = searchableText.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, matchIdx - 80);
        const end = Math.min(searchableText.length, matchIdx + lowerQuery.length + 120);
        const preview = (start > 0 ? "..." : "") + searchableText.substring(start, end) + (end < searchableText.length ? "..." : "");
        results.push({
          type: "model",
          model,
          id: record.id as string,
          field,
          preview,
          matchCount: count,
        });
      }
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, contentSearchSchema);
  if (error) return error;
  const { query } = data;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  const q = query.trim();
  const results: SearchResult[] = [];

  // 1. Search all ContentBlocks
  const blocks = await prisma.contentBlock.findMany();
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block.valueJson);
      const matches = searchObject(parsed, q);
      for (const m of matches) {
        results.push({
          type: "contentBlock",
          key: block.key,
          field: m.path,
          path: m.path,
          preview: m.value,
          matchCount: m.count,
        });
      }
    } catch {
      // Skip invalid JSON
    }
  }

  // 2. Search BlogArticle
  const articles = await prisma.blogArticle.findMany();
  results.push(...searchModelFields(
    articles as unknown as Record<string, unknown>[],
    "BlogArticle",
    ["titleEn", "titleAr", "excerptEn", "excerptAr", "bodyEn", "bodyAr"],
    q
  ));

  // 3. Search NavItem
  const navItems = await prisma.navItem.findMany();
  results.push(...searchModelFields(
    navItems as unknown as Record<string, unknown>[],
    "NavItem",
    ["labelEn", "labelAr"],
    q
  ));

  // 4. Search FaqCategory
  const faqCats = await prisma.faqCategory.findMany();
  results.push(...searchModelFields(
    faqCats as unknown as Record<string, unknown>[],
    "FaqCategory",
    ["nameEn", "nameAr"],
    q
  ));

  // 5. Search FaqItem
  const faqItems = await prisma.faqItem.findMany();
  results.push(...searchModelFields(
    faqItems as unknown as Record<string, unknown>[],
    "FaqItem",
    ["questionEn", "questionAr", "answerEn", "answerAr"],
    q
  ));

  // 6. Search Plan
  const plans = await prisma.plan.findMany();
  results.push(...searchModelFields(
    plans as unknown as Record<string, unknown>[],
    "Plan",
    ["nameEn", "nameAr", "descriptionEn", "descriptionAr", "ctaEn", "ctaAr", "benefitsEn", "benefitsAr"],
    q
  ));

  // 7. Search PlanFeature
  const planFeatures = await prisma.planFeature.findMany();
  results.push(...searchModelFields(
    planFeatures as unknown as Record<string, unknown>[],
    "PlanFeature",
    ["labelEn", "labelAr"],
    q
  ));

  // 8. Search FinancialAsset
  const assets = await prisma.financialAsset.findMany();
  results.push(...searchModelFields(
    assets as unknown as Record<string, unknown>[],
    "FinancialAsset",
    ["nameEn", "nameAr", "headlineEn", "headlineAr", "descriptionEn", "descriptionAr", "whatIsEn", "whatIsAr"],
    q
  ));

  // 9. Search Video
  const videos = await prisma.video.findMany();
  results.push(...searchModelFields(
    videos as unknown as Record<string, unknown>[],
    "Video",
    ["titleEn", "titleAr", "descEn", "descAr", "fullDescEn", "fullDescAr"],
    q
  ));

  // 10. Search LegalSection
  const legalSections = await prisma.legalSection.findMany();
  results.push(...searchModelFields(
    legalSections as unknown as Record<string, unknown>[],
    "LegalSection",
    ["titleEn", "titleAr", "paragraphsEn", "paragraphsAr"],
    q
  ));

  // 11. Search IslamicRulingSection
  const irSections = await prisma.islamicRulingSection.findMany();
  results.push(...searchModelFields(
    irSections as unknown as Record<string, unknown>[],
    "IslamicRulingSection",
    ["nameEn", "nameAr"],
    q
  ));

  // 12. Search IslamicRulingItem
  const irItems = await prisma.islamicRulingItem.findMany();
  results.push(...searchModelFields(
    irItems as unknown as Record<string, unknown>[],
    "IslamicRulingItem",
    ["titleEn", "titleAr", "questionEn", "questionAr", "answerEn", "answerAr", "muftiEn", "muftiAr"],
    q
  ));

  // 13. Search SuggestedArticle
  const suggested = await prisma.suggestedArticle.findMany();
  results.push(...searchModelFields(
    suggested as unknown as Record<string, unknown>[],
    "SuggestedArticle",
    ["titleEn", "titleAr"],
    q
  ));

  // 14. Search AssetAdvantage
  const advantages = await prisma.assetAdvantage.findMany();
  results.push(...searchModelFields(
    advantages as unknown as Record<string, unknown>[],
    "AssetAdvantage",
    ["titleEn", "titleAr", "descEn", "descAr"],
    q
  ));

  // 15. Search AssetFaq
  const assetFaqs = await prisma.assetFaq.findMany();
  results.push(...searchModelFields(
    assetFaqs as unknown as Record<string, unknown>[],
    "AssetFaq",
    ["questionEn", "questionAr", "answerEn", "answerAr"],
    q
  ));

  // 16. Search Instrument
  const instruments = await prisma.instrument.findMany();
  results.push(...searchModelFields(
    instruments as unknown as Record<string, unknown>[],
    "Instrument",
    ["nameEn", "nameAr"],
    q
  ));

  return NextResponse.json({ results });
}
