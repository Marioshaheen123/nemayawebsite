import { z } from "zod";

export const createTransactionSchema = z.object({
  userId: z.string().min(1).max(200),
  date: z.string().max(50).optional(), // ISO date string; defaults to now
  method: z.enum(["Credit Card", "Bank Transfer", "Internal"]),
  type: z.enum(["Deposit", "Withdrawal", "Bonus"]),
  amount: z.number(),
  currency: z.string().max(10).optional().default("USD"),
  status: z
    .enum(["Completed", "Pending", "Failed"])
    .optional()
    .default("Pending"),
  reference: z.string().max(500).optional(),
  note: z.string().max(2000).optional(),
});

export const updateTransactionSchema = z.object({
  status: z.enum(["Completed", "Pending", "Failed"]).optional(),
  note: z.string().max(2000).optional(),
  method: z.enum(["Credit Card", "Bank Transfer", "Internal"]).optional(),
  amount: z.number().optional(),
});
