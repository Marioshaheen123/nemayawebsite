import type { Metadata } from "next";
import Header from "@/components/Header";
import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import { getLayoutData, getContentBlock, getBlogArticlesBilingual } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "المدونة",
    descriptionAr: "اقرأ أحدث المقالات والأخبار حول التداول والاستثمار في الأسواق المالية",
    path: "/blog",
  });
}

export default async function Blog() {
  const { headerData, footerData } = await getLayoutData();
  const [blogPageHeroTitle, blogData] = await Promise.all([
    getContentBlock("blog.pageHeroTitle"),
    getBlogArticlesBilingual(),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <BlogPage
        blogArticles={blogData.articles}
        blogPageHeroTitle={blogPageHeroTitle}
      />
      <Footer {...footerData} />
    </main>
  );
}
