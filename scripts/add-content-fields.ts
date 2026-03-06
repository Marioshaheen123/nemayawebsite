/**
 * Add imageAltEn, imageAltAr, category, tags columns to BlogArticle and EconomicDevelopment
 * Run: npx tsx scripts/add-content-fields.ts
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const COLUMNS = [
  { table: "BlogArticle", col: "imageAltEn", type: "TEXT" },
  { table: "BlogArticle", col: "imageAltAr", type: "TEXT" },
  { table: "BlogArticle", col: "category", type: "TEXT" },
  { table: "BlogArticle", col: "tags", type: "TEXT" },
  { table: "EconomicDevelopment", col: "imageAltEn", type: "TEXT" },
  { table: "EconomicDevelopment", col: "imageAltAr", type: "TEXT" },
  { table: "EconomicDevelopment", col: "category", type: "TEXT" },
  { table: "EconomicDevelopment", col: "tags", type: "TEXT" },
];

async function main() {
  for (const { table, col, type } of COLUMNS) {
    try {
      await db.execute(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
      console.log(`+ ${table}.${col}`);
    } catch (e: any) {
      if (e.message?.includes("duplicate column")) {
        console.log(`= ${table}.${col} (already exists)`);
      } else {
        console.error(`! ${table}.${col}: ${e.message}`);
      }
    }
  }
  console.log("Done.");
}

main();
