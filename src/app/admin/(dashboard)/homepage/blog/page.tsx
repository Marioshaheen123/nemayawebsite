import { getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/admin-cache";
import BlogEditor from "@/components/admin/editors/BlogEditor";

export default async function BlogPage() {
  const data = await cached(
    async () => {
      const [blocks, articles] = await Promise.all([
        getContentBlocks(["blog.sectionData"]),
        prisma.blogArticle.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
      ]);
      return {
        sectionData: blocks["blog.sectionData"] ?? {},
        articles: JSON.parse(JSON.stringify(articles)),
      };
    },
    "admin-homepage-blog",
    ["admin-homepage-blog"]
  );
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <BlogEditor initialData={data} />
    </div>
  );
}
