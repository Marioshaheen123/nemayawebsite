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
  const key = "economicDevelopments.pageHeroTitle";
  const existing = await prisma.contentBlock.findUnique({ where: { key } });
  if (existing) {
    console.log("Content block already exists:", existing.valueJson);
  } else {
    await prisma.contentBlock.create({
      data: {
        key,
        valueJson: JSON.stringify({ en: "Economic Developments", ar: "التطورات الاقتصادية" }),
      },
    });
    console.log("Created hero title content block");
  }
}

main().catch(console.error).finally(() => process.exit());
