import Header from "@/components/Header";
import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getBlogArticlesBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const [headerData, footerData, blogPageHeroTitle, blogData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
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
