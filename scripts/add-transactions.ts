/**
 * Create "Transaction" table in Turso DB.
 * Run: npx tsx scripts/add-transactions.ts
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "Transaction" (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        date TEXT NOT NULL DEFAULT (datetime('now')),
        method TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        status TEXT NOT NULL DEFAULT 'Pending',
        reference TEXT,
        note TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    console.log("+ Transaction table created");

    // Add index on userId for fast lookups
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_transaction_userId ON "Transaction"(userId)
    `);
    console.log("+ Index on userId created");

    // Add index on date for sorting
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_transaction_date ON "Transaction"(date)
    `);
    console.log("+ Index on date created");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("= Transaction table already exists");
    } else {
      console.error("! Transaction:", e.message);
    }
  }
  console.log("Done.");
}

main();
