import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check if it already exists
  const alreadyExists = await prisma.navItem.findFirst({
    where: { location: "footerSupportLinks", href: "/social-media" },
  });
  if (alreadyExists) {
    console.log("Social Media link already exists in footer, skipping.");
    return;
  }

  // Get current max sortOrder
  const existing = await prisma.navItem.findMany({
    where: { location: "footerSupportLinks" },
    orderBy: { sortOrder: "desc" },
    take: 1,
  });
  const nextOrder = existing.length > 0 ? existing[0].sortOrder + 1 : 0;

  await prisma.navItem.create({
    data: {
      location: "footerSupportLinks",
      labelEn: "Social Media",
      labelAr: "مواقع التواصل الاجتماعي",
      href: "/social-media",
      hasDropdown: false,
      sortOrder: nextOrder,
    },
  });
  console.log("Added Social Media link to footer support links at sortOrder", nextOrder);

  // List all support links to verify
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
