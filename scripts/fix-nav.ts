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
  // Find Blog nav item
  const blogItem = await prisma.navItem.findFirst({
    where: { location: "header", labelEn: "Blog", parentId: null },
    include: { children: true },
  });

  if (!blogItem) {
    console.log("Blog nav item not found!");
    return;
  }

  console.log("Found Blog item:", blogItem.id, "- current children:", blogItem.children.length);

  // Update Blog to be a dropdown
  await prisma.navItem.update({
    where: { id: blogItem.id },
    data: { hasDropdown: true, href: "#" },
  });
  console.log("Updated Blog to dropdown");

  // Add children if none exist
  if (blogItem.children.length === 0) {
    await prisma.navItem.create({
      data: {
        location: "header",
        labelEn: "Blog",
        labelAr: "مدونة",
        href: "/blog",
        hasDropdown: false,
        sortOrder: 0,
        parentId: blogItem.id,
      },
    });
    console.log("Created Blog child");

    await prisma.navItem.create({
      data: {
        location: "header",
        labelEn: "Economic Developments",
        labelAr: "التطورات الاقتصادية",
        href: "/economic-developments",
        hasDropdown: false,
        sortOrder: 1,
        parentId: blogItem.id,
      },
    });
    console.log("Created Economic Developments child");
  }

  // Verify
  const updated = await prisma.navItem.findMany({
    where: { location: "header", parentId: null },
    include: { children: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  console.log("\nUpdated header items:");
  for (const item of updated) {
    console.log("  ", item.labelEn, "/", item.labelAr, "- href:", item.href, "- dropdown:", item.hasDropdown, "- children:", item.children.length);
    for (const c of item.children) {
      console.log("    ->", c.labelEn, "/", c.labelAr, "- href:", c.href);
    }
  }
}

main().catch(console.error).finally(() => process.exit());
