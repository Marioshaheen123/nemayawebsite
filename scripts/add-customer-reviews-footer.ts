import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const alreadyExists = await prisma.navItem.findFirst({
    where: { location: "footerSupportLinks", href: "/customer-reviews" },
  });
  if (alreadyExists) {
    console.log("Customer Reviews link already exists in footer, skipping.");
    return;
  }

  const existing = await prisma.navItem.findMany({
    where: { location: "footerSupportLinks" },
    orderBy: { sortOrder: "desc" },
    take: 1,
  });
  const nextOrder = existing.length > 0 ? existing[0].sortOrder + 1 : 0;

  await prisma.navItem.create({
    data: {
      location: "footerSupportLinks",
      labelEn: "Customer Reviews",
      labelAr: "تقييمات العملاء",
      href: "/customer-reviews",
      hasDropdown: false,
      sortOrder: nextOrder,
    },
  });
  console.log("Added Customer Reviews link to footer support links at sortOrder", nextOrder);

  const all = await prisma.navItem.findMany({
    where: { location: "footerSupportLinks" },
    orderBy: { sortOrder: "asc" },
  });
  console.log("\nAll footer support links:");
  all.forEach((l) => console.log(`  ${l.sortOrder}. ${l.labelEn} | ${l.labelAr} | ${l.href}`));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
