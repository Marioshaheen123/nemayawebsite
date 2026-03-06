/**
 * Add profile columns to User table and create UserDocument + ContactRequest tables.
 * Run: npx tsx scripts/add-user-fields.ts
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const USER_COLUMNS = [
  "mobile TEXT NOT NULL DEFAULT ''",
  "dateOfBirth TEXT NOT NULL DEFAULT ''",
  "address TEXT NOT NULL DEFAULT ''",
  "city TEXT NOT NULL DEFAULT ''",
  "postalCode TEXT NOT NULL DEFAULT ''",
  "country TEXT NOT NULL DEFAULT ''",
  "profession TEXT NOT NULL DEFAULT ''",
  "additionalPhone TEXT NOT NULL DEFAULT ''",
  "annualIncome TEXT NOT NULL DEFAULT ''",
  "avatar TEXT NOT NULL DEFAULT ''",
];

async function main() {
  // 1. Add missing columns to User table
  for (const col of USER_COLUMNS) {
    const colName = col.split(" ")[0];
    try {
      await db.execute(`ALTER TABLE "User" ADD COLUMN ${col}`);
      console.log(`+ Added column ${colName} to User`);
    } catch (e: any) {
      if (e.message?.includes("duplicate column") || e.message?.includes("already exists")) {
        console.log(`= Column ${colName} already exists`);
      } else {
        console.error(`! Column ${colName}:`, e.message);
      }
    }
  }

  // 2. Create UserDocument table
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "UserDocument" (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        docKey TEXT NOT NULL,
        face TEXT,
        url TEXT NOT NULL,
        fileName TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    console.log("+ UserDocument table created");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_userdocument_userId ON "UserDocument"(userId)
    `);
    console.log("+ Index on UserDocument.userId created");
  } catch (e: any) {
    console.error("! UserDocument:", e.message);
  }

  // 3. Create ContactRequest table
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "ContactRequest" (
        id TEXT PRIMARY KEY,
        userId TEXT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        reason TEXT NOT NULL,
        requestType TEXT NOT NULL,
        topicDetails TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'New',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    console.log("+ ContactRequest table created");
  } catch (e: any) {
    console.error("! ContactRequest:", e.message);
  }

  console.log("\nDone!");
}

main();
