import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  validateMagicBytes,
  generateSafeFilename,
} from "@/lib/upload-security";
import { requireUser } from "@/lib/user-guard";
import { createDepositWithProof } from "@/lib/services/payment-service";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const amount = formData.get("amount") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, PDF" },
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

    const fileName = generateSafeFilename("deposit-proof", file.type);
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, fileName), buffer);

    const resultUrl = `/uploads/${fileName}`;
    const parsedAmount = amount ? parseFloat(amount) : 0;

    // Create pending deposit transaction via payment service
    const transaction = await createDepositWithProof({
      userId: user.sub,
      amount: Math.abs(parsedAmount),
      proofUrl: resultUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Deposit proof submitted",
      transactionId: transaction.id,
      proofUrl: resultUrl,
    });
  } catch (error) {
    console.error("[deposit-proof]", error);
    return NextResponse.json(
      { error: "Failed to submit deposit proof" },
      { status: 500 }
    );
  }
}
