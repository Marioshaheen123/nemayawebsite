import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-guard";
import { z } from "zod";
import { createWithdrawalRequest } from "@/lib/services/payment-service";

const withdrawalSchema = z.object({
  method: z.enum(["bank", "digital"]),
  amount: z.number().positive(),
  // Bank fields
  bankName: z.string().max(200).optional(),
  ibanNumber: z.string().max(50).optional(),
  // Digital fields
  currencyType: z.string().max(50).optional(),
  walletAddress: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireUser(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = withdrawalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Validate method-specific fields
    if (data.method === "bank") {
      if (!data.bankName) {
        return NextResponse.json({ error: "Bank name is required" }, { status: 400 });
      }
      if (!data.ibanNumber || data.ibanNumber.length < 10) {
        return NextResponse.json({ error: "Valid IBAN is required" }, { status: 400 });
      }
    } else {
      if (!data.walletAddress) {
        return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
      }
    }

    const methodLabel = data.method === "bank" ? "Bank Transfer" : "Digital Currency";
    const noteDetails = data.method === "bank"
      ? `Bank: ${data.bankName}, IBAN: SA${data.ibanNumber}`
      : `Currency: ${data.currencyType || "USDT"}, Wallet: ${data.walletAddress}`;

    // Create withdrawal request via payment service
    const transaction = await createWithdrawalRequest({
      userId: user.sub,
      amount: -Math.abs(data.amount),
      method: methodLabel,
      details: noteDetails,
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted",
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("[withdrawal-request]", error);
    return NextResponse.json(
      { error: "Failed to submit withdrawal request" },
      { status: 500 }
    );
  }
}
