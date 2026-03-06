import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Use existing blog images as placeholders
  const imageMap: Record<string, string> = {
    "/uploads/econ-dev-1.jpg": "/images/blog-page-1.jpg",
    "/uploads/econ-dev-2.jpg": "/images/blog-page-2.jpg",
    "/uploads/econ-dev-3.jpg": "/images/blog-page-3.jpg",
    "/uploads/econ-dev-4.jpg": "/images/blog-1.jpg",
    "/uploads/econ-dev-5.jpg": "/images/blog-2.jpg",
    "/uploads/econ-dev-6.jpg": "/images/blog-3.jpg",
  };

  const articles = await prisma.economicDevelopment.findMany();
  for (const a of articles) {
    const newImage = imageMap[a.imageUrl];
    if (newImage) {
      await prisma.economicDevelopment.update({
        where: { id: a.id },
        data: { imageUrl: newImage },
      });
      console.log(`Updated ${a.slug}: ${a.imageUrl} -> ${newImage}`);
    }
  }

  // Also fix suggested items
  const suggested = await prisma.suggestedEconomicDevelopment.findMany();
  for (const s of suggested) {
    const newImage = imageMap[s.imageUrl];
    if (newImage) {
      await prisma.suggestedEconomicDevelopment.update({
        where: { id: s.id },
        data: { imageUrl: newImage },
      });
      console.log(`Updated suggested ${s.slug}: ${s.imageUrl} -> ${newImage}`);
    }
  }

  console.log("\nDone fixing images!");
}

main().catch(console.error).finally(() => process.exit());
