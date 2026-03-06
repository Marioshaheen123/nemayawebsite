import { z, ZodSchema } from "zod";
import { NextRequest, NextResponse } from "next/server";

/**
 * Parse and validate JSON body against a Zod schema.
 * Also validates Content-Type header.
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return {
      data: null,
      error: NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      ),
    };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data, error: null };
}

// ─── Reusable field schemas ──────────────────────────────────────────

/** Bilingual text field (up to 10K chars) */
export const bilingualString = z.string().max(10_000);

/** Short text (up to 500 chars) */
export const shortString = z.string().max(500);

/** URL slug format */
export const slug = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

/** Sort order integer */
export const sortOrder = z
  .number()
  .int()
  .min(0)
  .max(100_000)
  .optional()
  .default(0);

/** CUID format (Prisma default IDs) */
export const cuid = z.string().min(1).max(50);

/** Rich text / HTML body content (up to 500K) */
export const safeHtml = z.string().max(500_000);

/** URL string */
export const urlString = z.string().url().max(2000).or(z.literal(""));

/** Image URL (relative or absolute) */
export const imageUrl = z.string().max(2000);

/** Boolean with default */
export const boolDefault = (def: boolean) => z.boolean().optional().default(def);

/** Optional nullable string */
export const optStr = z.string().max(10_000).optional().nullable();

/** Optional nullable short string */
export const optShortStr = z.string().max(500).optional().nullable();
