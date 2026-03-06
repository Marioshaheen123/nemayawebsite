import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import {
  validateMagicBytes,
  generateSafeFilename,
} from "@/lib/upload-security";
import { safeErrorResponse } from "@/lib/error-handler";
import { requireUser } from "@/lib/user-guard";
import { updateUserAvatar } from "@/lib/services/crm-service";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 800 * 1024; // 800KB

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 800 KB limit" },
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

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    let resultUrl: string;

    if (file.type === "image/gif") {
      const fileName = generateSafeFilename("avatar", file.type);
      await writeFile(join(uploadsDir, fileName), buffer);
      resultUrl = `/uploads/${fileName}`;
    } else {
      const fileName = generateSafeFilename("avatar", "image/webp");
      await sharp(buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(uploadsDir, fileName));
      resultUrl = `/uploads/${fileName}`;
    }

    // Update avatar URL in CRM (Dynamics 365 Contact entity)
    await updateUserAvatar(user.sub, resultUrl);

    return NextResponse.json({ url: resultUrl }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "POST /api/user/avatar");
  }
}
