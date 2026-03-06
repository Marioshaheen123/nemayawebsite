/**
 * Create "User" table in Turso DB and seed a demo user.
 * Run: npx tsx scripts/add-users.ts
 */
import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        firstName TEXT NOT NULL DEFAULT '',
        lastName TEXT NOT NULL DEFAULT '',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    console.log("+ User table created");

    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_accountId ON "User"(accountId)
    `);
    console.log("+ Index on accountId created");

    // Seed demo user: account 123456, password "password"
    const passwordHash = await hash("password", 12);
    const id = "demo-user-" + Date.now();
    await db.execute({
      sql: `INSERT OR IGNORE INTO "User" (id, accountId, email, passwordHash, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, "123456", "mmmm369@gmail.com", passwordHash, "Doe", "John"],
    });
    console.log("+ Demo user seeded (account: 123456, password: password)");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("= User table already exists");
    } else {
      console.error("! User:", e.message);
    }
  }
  console.log("Done.");
}

main();
