import { z } from "zod";

export const videoSchema = z.object({
  videoId: z.string().min(1).max(100),
  titleEn: z.string().max(500),
  titleAr: z.string().max(500),
  descEn: z.string().max(5000),
  descAr: z.string().max(5000),
  fullDescEn: z.string().max(50_000),
  fullDescAr: z.string().max(50_000),
  takeawaysEn: z.string().max(50_000),
  takeawaysAr: z.string().max(50_000),
  linkTextEn: z.string().max(200),
  linkTextAr: z.string().max(200),
  day: z.string().max(10),
  monthEn: z.string().max(50),
  monthAr: z.string().max(50),
  durationEn: z.string().max(50),
  durationAr: z.string().max(50),
  videoUrl: z.string().max(2000),
  labelEn: z.string().max(100).optional().default(""),
  labelAr: z.string().max(100).optional().default(""),
  sortOrder: z.number().int().min(0).max(100_000).optional().default(0),
  metaTitleEn: z.string().max(200).optional().nullable(),
  metaTitleAr: z.string().max(200).optional().nullable(),
  metaDescriptionEn: z.string().max(500).optional().nullable(),
  metaDescriptionAr: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
  keywords: z.string().max(1000).optional().nullable(),
});

const biObj = z.object({ en: z.string().max(500), ar: z.string().max(500) });

export const videoLabelsSchema = z.object({
  heroTitle: biObj,
  watchNowLabel: biObj,
  moreVideoLabel: biObj,
  keyTakeawaysLabel: biObj,
  directLinkLabel: biObj,
});
