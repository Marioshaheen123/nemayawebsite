import type { Lang } from "@/data/types";

/**
 * Pick the right language variant from bilingual En/Ar fields.
 */
export function bilingual<T>(en: T, ar: T, lang: Lang): T {
  return lang === "en" ? en : ar;
}

/**
 * Parse a JSON string safely, returning fallback on error.
 */
export function parseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
