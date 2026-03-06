import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  validateMagicBytes,
  generateSafeFilename,
} from "@/lib/upload-security";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";

// SVG intentionally excluded — SVG files can contain XSS payloads
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate actual file content matches claimed MIME type
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    let resultUrl: string;

    // GIF: save as-is (sharp doesn't handle animated GIF well)
    if (file.type === "image/gif") {
      const fileName = generateSafeFilename("admin", file.type);
      await writeFile(path.join(uploadDir, fileName), buffer);
      resultUrl = `/uploads/${fileName}`;
    } else {
      // JPEG/PNG/WebP: compress to WebP via Sharp
      const fileName = generateSafeFilename("admin", "image/webp");
      await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(uploadDir, fileName));
      resultUrl = `/uploads/${fileName}`;
    }

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "upload",
      resource: "Upload",
      details: JSON.stringify({ originalName: file.name, type: file.type, size: file.size, url: resultUrl }),
      ip: getClientIp(request),
    });

    return NextResponse.json({ url: resultUrl });
  } catch (error) {
    return safeErrorResponse(error, "POST /api/admin/upload");
  }
}
