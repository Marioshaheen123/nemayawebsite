/**
 * Add SEO fields to BlogArticle, EconomicDevelopment, FinancialAsset, Video tables in Turso.
 * Run: npx tsx scripts/add-seo-fields.ts
 */
import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const tables = ["BlogArticle", "EconomicDevelopment", "FinancialAsset", "Video"];
const seoColumns = [
  { name: "metaTitleEn", type: "TEXT" },
  { name: "metaTitleAr", type: "TEXT" },
  { name: "metaDescriptionEn", type: "TEXT" },
  { name: "metaDescriptionAr", type: "TEXT" },
  { name: "ogImageUrl", type: "TEXT" },
  { name: "keywords", type: "TEXT" },
];

async function main() {
  for (const table of tables) {
    for (const col of seoColumns) {
      try {
        await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`  ✓ ${table}.${col.name}`);
      } catch (e: any) {
        if (e.message?.includes("duplicate column")) {
          console.log(`  - ${table}.${col.name} (already exists)`);
        } else {
          console.error(`  ✗ ${table}.${col.name}: ${e.message}`);
        }
      }
    }
  }

  // Seed global SEO content block
  const seoGlobal = JSON.stringify({
    siteNameAr: "نمايا",
    siteNameEn: "Namaya",
    defaultTitleAr: "نمايا - استثمر الآن بذكاء",
    defaultTitleEn: "Namaya - Invest Smart Now",
    defaultDescriptionAr:
      "كن ذكيًا واستثمر في أصولك بأمان. نمايا هي منصتك السعودية الآمنة للتداول في الأسواق المحلية والعالمية.",
    defaultDescriptionEn:
      "Be smart and invest in your assets safely. Namaya is your secure Saudi platform for trading in local and global markets.",
    defaultOgImageUrl: "/images/og-default.jpg",
    googleVerification: "",
    analyticsId: "",
  });

  try {
    await client.execute({
      sql: `INSERT INTO "ContentBlock" ("id", "key", "valueJson", "updatedAt")
            VALUES (lower(hex(randomblob(12))), 'seo.global', ?, datetime('now'))
            ON CONFLICT ("key") DO UPDATE SET "valueJson" = ?, "updatedAt" = datetime('now')`,
      args: [seoGlobal, seoGlobal],
    });
    console.log("\n✓ Seeded seo.global content block");
  } catch (e: any) {
    console.error(`✗ seo.global: ${e.message}`);
  }

  console.log("\nDone!");
}

main().catch(console.error);
