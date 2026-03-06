import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  // Create EconomicDevelopment table
  await libsql.execute(`
    CREATE TABLE IF NOT EXISTS "EconomicDevelopment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "slug" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "day" TEXT NOT NULL,
      "monthEn" TEXT NOT NULL,
      "monthAr" TEXT NOT NULL,
      "readTimeEn" TEXT NOT NULL,
      "readTimeAr" TEXT NOT NULL,
      "titleEn" TEXT NOT NULL,
      "titleAr" TEXT NOT NULL,
      "excerptEn" TEXT NOT NULL,
      "excerptAr" TEXT NOT NULL,
      "bodyEn" TEXT NOT NULL,
      "bodyAr" TEXT NOT NULL,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "published" BOOLEAN NOT NULL DEFAULT true,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Created EconomicDevelopment table");

  // Create unique index on slug
  await libsql.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "EconomicDevelopment_slug_key" ON "EconomicDevelopment"("slug")
  `);
  console.log("Created slug unique index");

  // Create SuggestedEconomicDevelopment table
  await libsql.execute(`
    CREATE TABLE IF NOT EXISTS "SuggestedEconomicDevelopment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "titleEn" TEXT NOT NULL,
      "titleAr" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "sortOrder" INTEGER NOT NULL DEFAULT 0
    )
  `);
  console.log("Created SuggestedEconomicDevelopment table");

  // Verify tables exist
  const tables = await libsql.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%conomic%'`);
  console.log("\nTables:", tables.rows.map(r => r.name));

  // Now seed some sample data using Prisma
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const prisma = new PrismaClient({ adapter });

  // Check if articles already exist
  const existing = await prisma.economicDevelopment.findMany();
  if (existing.length > 0) {
    console.log(`\nAlready have ${existing.length} articles, skipping seed`);
  } else {
    // Seed sample articles
    const articles = [
      { slug: "somalia-eritrea-bilateral-cooperation", imageUrl: "/uploads/econ-dev-1.jpg", day: "12", monthEn: "January", monthAr: "يناير", readTimeEn: "10 min read", readTimeAr: "10 دقائق قراءة", titleEn: "Somalia and Eritrea resume bilateral diplomatic missions and strengthen bilateral cooperation", titleAr: "الصومال وإريتريا تستأنفان الرحلات الجوية المباشرة وتعززان التعاون الثنائي", excerptEn: "Somalia and Eritrea have taken a significant step towards strengthening their bilateral relations.", excerptAr: "اتخذت الصومال وإريتريا خطوة مهمة نحو تعزيز علاقاتهما الثنائية.", bodyEn: '["Somalia and Eritrea have taken a significant step.","The two nations agreed to establish permanent embassies."]', bodyAr: '["اتخذت الصومال وإريتريا خطوة مهمة.","اتفقت الدولتان على إنشاء سفارات دائمة."]', featured: true, published: true, sortOrder: 0 },
      { slug: "imf-calls-nigeria-fiscal-policy", imageUrl: "/uploads/econ-dev-2.jpg", day: "09", monthEn: "January", monthAr: "يناير", readTimeEn: "8 min read", readTimeAr: "8 دقائق قراءة", titleEn: "The IMF calls on Nigeria to implement tighter fiscal policies to reduce the inflation rate", titleAr: "صندوق النقد الدولي يدعو نيجيريا إلى إعادة ضبط سياساتها لتخفيض أسعار الغذاء", excerptEn: "The International Monetary Fund has urged Nigeria to adopt stricter fiscal measures.", excerptAr: "حث صندوق النقد الدولي نيجيريا على تبني إجراءات مالية أكثر صرامة.", bodyEn: '["The IMF has urged Nigeria to adopt stricter measures.","The IMF recommends reducing government spending."]', bodyAr: '["حث صندوق النقد الدولي نيجيريا.","يوصي صندوق النقد الدولي بتقليل الإنفاق."]', featured: false, published: true, sortOrder: 1 },
      { slug: "imf-announces-global-economy-achievements", imageUrl: "/uploads/econ-dev-3.jpg", day: "08", monthEn: "January", monthAr: "يناير", readTimeEn: "7 min read", readTimeAr: "7 دقائق قراءة", titleEn: "The IMF announces that the global economy has achieved better than expected results", titleAr: "صندوق النقد الدولي يعلن أن الاقتصاد العالمي حقق نتائج أفضل من المتوقع", excerptEn: "The International Monetary Fund highlighted global economic resilience.", excerptAr: "أبرز صندوق النقد الدولي أن الاقتصاد العالمي أظهر مرونة ملحوظة.", bodyEn: '["The IMF highlighted global resilience.","Key factors include strong consumer spending."]', bodyAr: '["أبرز صندوق النقد الدولي مرونة عالمية.","تشمل العوامل الرئيسية الإنفاق الاستهلاكي."]', featured: false, published: true, sortOrder: 2 },
      { slug: "world-bank-calls-financing-solutions", imageUrl: "/uploads/econ-dev-4.jpg", day: "10", monthEn: "January", monthAr: "يناير", readTimeEn: "6 min read", readTimeAr: "6 دقائق قراءة", titleEn: "The World Bank calls for new financing solutions to support developing countries", titleAr: "البنك الدولي يدعو إلى حلول تمويل جديدة لدعم البلدان النامية", excerptEn: "The World Bank has called for innovative financing mechanisms.", excerptAr: "دعا البنك الدولي إلى آليات تمويل مبتكرة لدعم الدول النامية.", bodyEn: '["The World Bank has called for innovative financing.","Developing countries face funding shortfalls."]', bodyAr: '["دعا البنك الدولي إلى آليات تمويل مبتكرة.","تواجه البلدان النامية عجزاً تمويلياً سنوياً."]', featured: false, published: true, sortOrder: 3 },
      { slug: "somalia-eritrea-air-travel-cooperation", imageUrl: "/uploads/econ-dev-5.jpg", day: "09", monthEn: "January", monthAr: "يناير", readTimeEn: "5 min read", readTimeAr: "5 دقائق قراءة", titleEn: "Somalia and Eritrea resume direct air travel and strengthen regional cooperation", titleAr: "الصومال وإريتريا تستأنفان الرحلات الجوية المباشرة وتعززان التعاون الإقليمي", excerptEn: "In a landmark move, Somalia and Eritrea restored direct flights.", excerptAr: "في خطوة تاريخية، أعادت الصومال وإريتريا الاتصالات الجوية.", bodyEn: '["Somalia and Eritrea restored direct flights.","The resumption is expected to boost tourism."]', bodyAr: '["أعادت الصومال وإريتريا الاتصالات الجوية.","من المتوقع أن يعزز السياحة."]', featured: false, published: true, sortOrder: 4 },
      { slug: "imf-global-economy-resilience", imageUrl: "/uploads/econ-dev-6.jpg", day: "10", monthEn: "January", monthAr: "يناير", readTimeEn: "9 min read", readTimeAr: "9 دقائق قراءة", titleEn: "IMF: The global economy shows resilience despite ongoing trade tensions", titleAr: "صندوق النقد الدولي: الاقتصاد العالمي يُظهر مرونة رغم التوترات التجارية", excerptEn: "Despite trade disputes, global growth maintained its trajectory.", excerptAr: "رغم تصاعد النزاعات التجارية، حافظ النمو العالمي على مساره.", bodyEn: '["Despite trade disputes, growth maintained.","Central bank policies played a crucial role."]', bodyAr: '["رغم النزاعات التجارية، حافظ النمو.","لعبت السياسات النقدية دوراً حاسماً."]', featured: false, published: true, sortOrder: 5 },
    ];

    for (const a of articles) {
      await prisma.economicDevelopment.create({ data: a });
    }
    console.log(`\nSeeded ${articles.length} articles`);

    // Seed suggested
    const suggestions = [
      { imageUrl: "/uploads/econ-dev-1.jpg", titleEn: "Somalia and Eritrea bilateral cooperation", titleAr: "التعاون الثنائي بين الصومال وإريتريا", slug: "somalia-eritrea-bilateral-cooperation", sortOrder: 0 },
      { imageUrl: "/uploads/econ-dev-2.jpg", titleEn: "IMF fiscal policy for Nigeria", titleAr: "سياسة صندوق النقد لنيجيريا", slug: "imf-calls-nigeria-fiscal-policy", sortOrder: 1 },
      { imageUrl: "/uploads/econ-dev-3.jpg", titleEn: "Global economy exceeds expectations", titleAr: "الاقتصاد العالمي يتجاوز التوقعات", slug: "imf-announces-global-economy-achievements", sortOrder: 2 },
      { imageUrl: "/uploads/econ-dev-4.jpg", titleEn: "World Bank financing solutions", titleAr: "حلول تمويل البنك الدولي", slug: "world-bank-calls-financing-solutions", sortOrder: 3 },
    ];

    for (const s of suggestions) {
      await prisma.suggestedEconomicDevelopment.create({ data: s });
    }
    console.log(`Seeded ${suggestions.length} suggested items`);
  }
}

main().catch(console.error).finally(() => process.exit());
