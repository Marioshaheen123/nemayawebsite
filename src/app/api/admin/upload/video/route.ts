import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  validateMagicBytes,
  generateSafeFilename,
} from "@/lib/upload-security";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/error-handler";

const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

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
        { error: "Invalid file type. Allowed: MP4, WebM, MOV" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 100MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileName = generateSafeFilename("video", file.type);
    await writeFile(path.join(uploadDir, fileName), buffer);
    const resultUrl = `/uploads/${fileName}`;

    await logAuditEvent({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "upload",
      resource: "VideoUpload",
      details: JSON.stringify({ originalName: file.name, type: file.type, size: file.size, url: resultUrl }),
      ip: getClientIp(request),
    });

    return NextResponse.json({ url: resultUrl });
  } catch (error) {
    return safeErrorResponse(error, "POST /api/admin/upload/video");
  }
}
