import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  validateMagicBytes,
  generateSafeFilename,
  sanitizeAlphanumeric,
} from "@/lib/upload-security";
import { safeErrorResponse } from "@/lib/error-handler";
import { requireUser } from "@/lib/user-guard";
import { getUserDocuments, createDocument } from "@/lib/services/crm-service";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const docs = await getUserDocuments(user.sub);
    return NextResponse.json({ documents: docs });
  } catch (error) {
    return safeErrorResponse(error, "GET /api/user/documents");
  }
}

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docKey = formData.get("docKey") as string | null;
    const face = formData.get("face") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!docKey) {
      return NextResponse.json(
        { error: "No docKey provided" },
        { status: 400 }
      );
    }

    const safeDocKey = sanitizeAlphanumeric(docKey);
    const safeFace = face ? sanitizeAlphanumeric(face) : null;

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit" },
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

    const facePart = safeFace ? `-${safeFace}` : "";
    const prefix = `doc-${safeDocKey}${facePart}`;
    const fileName = generateSafeFilename(prefix, file.type);

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, fileName), buffer);

    const resultUrl = `/uploads/${fileName}`;

    // Save document record to CRM (Dynamics 365 Annotation entity)
    await createDocument({
      userId: user.sub,
      docKey: safeDocKey,
      face: safeFace || "",
      fileUrl: resultUrl,
      originalName: file.name,
    });

    return NextResponse.json(
      { url: resultUrl, docKey: safeDocKey, face: safeFace },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "POST /api/user/documents");
  }
}
