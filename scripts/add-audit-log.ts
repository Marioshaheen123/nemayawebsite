/**
 * Create AuditLog table in Turso DB.
 * Run: npx tsx scripts/add-audit-log.ts
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
      CREATE TABLE IF NOT EXISTS AuditLog (
        id TEXT PRIMARY KEY,
        adminId TEXT NOT NULL,
        adminEmail TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resourceId TEXT,
        details TEXT,
        ip TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    console.log("+ AuditLog table created");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("= AuditLog table already exists");
    } else {
      console.error("! AuditLog:", e.message);
    }
  }
  console.log("Done.");
}

main();
