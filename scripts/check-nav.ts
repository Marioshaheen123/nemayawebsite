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
  const allItems = await prisma.navItem.findMany({
    where: { location: "header", parentId: null },
    include: { children: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  console.log("Header items from Turso:");
  for (const item of allItems) {
    console.log("  ", item.labelEn, "/", item.labelAr, "- href:", item.href, "- dropdown:", item.hasDropdown, "- children:", item.children.length);
    for (const c of item.children) {
      console.log("    ->", c.labelEn, "/", c.labelAr, "- href:", c.href);
    }
  }
}

main().catch(console.error).finally(() => process.exit());
